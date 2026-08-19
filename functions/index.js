const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { Translate } = require('@google-cloud/translate').v2;
const admin = require('firebase-admin');
const { HttpsError, onCall } = require('firebase-functions/v2/https');
const { defineSecret, defineString } = require('firebase-functions/params');

admin.initializeApp();

const db = admin.firestore();
const translate = new Translate();
const r2AccountId = defineString('R2_ACCOUNT_ID');
const r2Bucket = defineString('R2_BUCKET');
const r2PublicUrl = defineString('R2_PUBLIC_URL');
const r2AccessKeyId = defineSecret('R2_ACCESS_KEY_ID');
const r2SecretAccessKey = defineSecret('R2_SECRET_ACCESS_KEY');

const normalizeLanguageCode = (languageCode) => String(languageCode || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z-]/g, '')
  .split('-')[0]
  .slice(0, 8);

const normalizeServer = (gameServer) => String(gameServer || '').replace(/\D/g, '').slice(0, 6);
const normalizeAllianceTag = (allianceTag) => String(allianceTag || '').trim().replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8);
const allowedAvatarTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

const protectMentions = (text) => {
  const mentions = [];
  const protectedText = String(text || '').replace(/@[^\s.,!?;:]+/g, (match) => {
    const token = `TSMENTION${mentions.length}TOKEN`;
    mentions.push({ token, value: match });
    return token;
  });

  return { protectedText, mentions };
};

const restoreMentions = (text, mentions) => mentions.reduce(
  (value, mention) => value.replaceAll(mention.token, mention.value),
  String(text || ''),
);

const getR2Client = () => new S3Client({
  region: 'auto',
  endpoint: `https://${r2AccountId.value()}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId.value(),
    secretAccessKey: r2SecretAccessKey.value(),
  },
});

const assertCanReadRoom = async ({ roomId, uid }) => {
  const roomSnapshot = await db.doc(`chatRooms/${roomId}`).get();
  if (!roomSnapshot.exists) {
    throw new HttpsError('not-found', 'Chat room not found.');
  }

  const room = roomSnapshot.data() || {};
  if (room.type === 'global') {
    return;
  }

  if (room.type === 'private') {
    if (room.memberUids?.[uid] === true) {
      return;
    }

    throw new HttpsError('permission-denied', 'You are not a member of this private chat.');
  }

  if (room.type === 'alliance') {
    const profileSnapshot = await db.doc(`users/${uid}`).get();
    const profile = profileSnapshot.exists ? profileSnapshot.data() || {} : {};
    const sameServer = normalizeServer(profile.gameServer) === normalizeServer(room.gameServer);
    const sameTag = normalizeAllianceTag(profile.allianceTag) === normalizeAllianceTag(room.allianceTag);

    if (sameServer && sameTag) {
      return;
    }

    throw new HttpsError('permission-denied', 'You are not a member of this alliance chat.');
  }

  throw new HttpsError('permission-denied', 'You cannot read this chat.');
};

exports.translateChatMessage = onCall({ region: 'us-central1' }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Sign in before translating chat messages.');
  }

  const roomId = String(request.data?.roomId || '').trim();
  const messageId = String(request.data?.messageId || '').trim();
  const targetLanguage = normalizeLanguageCode(request.data?.targetLanguage);

  if (!roomId || !messageId || !targetLanguage) {
    throw new HttpsError('invalid-argument', 'Room, message, and target language are required.');
  }

  if (targetLanguage === 'en') {
    return { translatedText: null, targetLanguage };
  }

  await assertCanReadRoom({ roomId, uid });

  const messageRef = db.doc(`chatRooms/${roomId}/messages/${messageId}`);
  const messageSnapshot = await messageRef.get();
  if (!messageSnapshot.exists) {
    throw new HttpsError('not-found', 'Chat message not found.');
  }

  const message = messageSnapshot.data() || {};
  const originalText = String(message.text || '').trim();
  if (!originalText) {
    return { translatedText: '', targetLanguage };
  }

  const cachedTranslation = message.translations?.[targetLanguage];
  if (cachedTranslation) {
    return { translatedText: cachedTranslation, targetLanguage };
  }

  const { protectedText, mentions } = protectMentions(originalText);
  const [translatedText] = await translate.translate(protectedText, {
    from: message.language || undefined,
    to: targetLanguage,
    format: 'text',
  });
  const restoredText = restoreMentions(translatedText, mentions);

  await messageRef.set({
    translations: {
      [targetLanguage]: restoredText,
    },
    translatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return { translatedText: restoredText, targetLanguage };
});

exports.createProfileImageUpload = onCall({
  region: 'us-central1',
  secrets: [r2AccessKeyId, r2SecretAccessKey],
}, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Sign in before uploading a profile image.');
  }

  const contentType = String(request.data?.contentType || '').toLowerCase();
  const size = Number(request.data?.size || 0);
  const extension = allowedAvatarTypes.get(contentType);

  if (!extension) {
    throw new HttpsError('invalid-argument', 'Please choose a JPG, PNG, WEBP, or GIF image.');
  }

  if (!size || size > 3 * 1024 * 1024) {
    throw new HttpsError('invalid-argument', 'Profile image must be smaller than 3 MB.');
  }

  const key = `user-avatars/${uid}/profile-${Date.now()}.${extension}`;
  const uploadUrl = await getSignedUrl(
    getR2Client(),
    new PutObjectCommand({
      Bucket: r2Bucket.value(),
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
    { expiresIn: 120 },
  );
  const publicBaseUrl = r2PublicUrl.value().replace(/\/+$/, '');
  const publicUrl = `${publicBaseUrl}/${key.split('/').map(encodeURIComponent).join('/')}`;

  return { uploadUrl, publicUrl };
});
