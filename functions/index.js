const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { Translate } = require('@google-cloud/translate').v2;
const admin = require('firebase-admin');
const { HttpsError, onCall } = require('firebase-functions/v2/https');
const { defineSecret, defineString } = require('firebase-functions/params');

admin.initializeApp();

const db = admin.firestore();
let translateClient;
const getTranslateClient = () => {
  if (!translateClient) {
    translateClient = new Translate();
  }
  return translateClient;
};
const r2AccountId = defineString('R2_ACCOUNT_ID');
const r2Bucket = defineString('R2_BUCKET');
const r2PublicUrl = defineString('R2_PUBLIC_URL');
const r2AccessKeyId = defineSecret('R2_ACCESS_KEY_ID');
const r2SecretAccessKey = defineSecret('R2_SECRET_ACCESS_KEY');
const allowedFunctionOrigins = [
  'https://pero030.github.io',
  /^http:\/\/127\.0\.0\.1:\d+$/,
  /^http:\/\/localhost:\d+$/,
];
const cleanConfigValue = (value) => String(value || '').trim();

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

const escapeRegExp = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const protectTerms = (text, terms = []) => {
  let protectedText = String(text || '');
  const protectedTerms = [];

  [...new Set(terms.map((term) => String(term || '').trim()).filter((term) => term.length >= 2))]
    .sort((first, second) => second.length - first.length)
    .forEach((term) => {
      const token = `TSPROTECTED${protectedTerms.length}TOKEN`;
      const pattern = new RegExp(escapeRegExp(term), 'g');
      if (!pattern.test(protectedText)) return;
      protectedTerms.push({ token, value: term });
      protectedText = protectedText.replace(pattern, token);
    });

  return { protectedText, protectedTerms };
};

const restoreTerms = (text, protectedTerms) => protectedTerms.reduce(
  (value, term) => value.replaceAll(term.token, term.value),
  String(text || ''),
);

const getR2Client = () => new S3Client({
  region: 'auto',
  endpoint: `https://${cleanConfigValue(r2AccountId.value())}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: cleanConfigValue(r2AccessKeyId.value()),
    secretAccessKey: cleanConfigValue(r2SecretAccessKey.value()),
  },
});

const assertCanReadRoom = async ({ roomId, uid }) => {
  const roomSnapshot = await db.doc(`chatRooms/${roomId}`).get();
  if (!roomSnapshot.exists) {
    if (roomId === 'global') {
      return { type: 'global' };
    }
    throw new HttpsError('not-found', 'Chat room not found.');
  }

  const room = roomSnapshot.data() || {};
  if (room.type === 'global') {
    return room;
  }

  if (room.type === 'private') {
    if (room.memberUids?.[uid] === true) {
      return room;
    }

    throw new HttpsError('permission-denied', 'You are not a member of this private chat.');
  }

  if (room.type === 'alliance' || room.type === 'allianceSub') {
    const profileSnapshot = await db.doc(`users/${uid}`).get();
    const profile = profileSnapshot.exists ? profileSnapshot.data() || {} : {};
    const sameServer = normalizeServer(profile.gameServer) === normalizeServer(room.gameServer);
    const sameTag = normalizeAllianceTag(profile.allianceTag) === normalizeAllianceTag(room.allianceTag);
    let isApprovedMember = room.memberUids?.[uid] === true;

    if (!isApprovedMember && room.type === 'allianceSub' && room.parentRoomId) {
      const parentSnapshot = await db.doc(`chatRooms/${room.parentRoomId}`).get();
      const parentRoom = parentSnapshot.exists ? parentSnapshot.data() || {} : {};
      isApprovedMember = parentRoom.memberUids?.[uid] === true;
    }

    if (sameServer && sameTag && isApprovedMember) {
      if (room.type === 'allianceSub' && room.audience === 'leaders') {
        const role = room.memberRoles?.[uid];
        const isLeader = room.ownerUid === uid || role === 'owner' || role === 'admin';
        if (!isLeader) {
          throw new HttpsError('permission-denied', 'This leader chat is restricted.');
        }
      }
      return room;
    }

    throw new HttpsError('permission-denied', 'You are not an approved member of this alliance chat.');
  }

  throw new HttpsError('permission-denied', 'You cannot read this chat.');
};

exports.getPublicAssetDataUrl = onCall({ region: 'us-central1', cors: allowedFunctionOrigins }, async (request) => {
  const sourceUrl = String(request.data?.url || '').trim();
  const publicBaseUrl = cleanConfigValue(r2PublicUrl.value()).replace(/\/+$/, '');

  if (!sourceUrl || !publicBaseUrl || !sourceUrl.startsWith(`${publicBaseUrl}/`)) {
    throw new HttpsError('invalid-argument', 'Only configured public R2 assets can be exported.');
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new HttpsError('not-found', 'Asset could not be loaded for export.');
  }

  const contentType = String(response.headers.get('content-type') || '').split(';')[0].toLowerCase();
  if (!allowedAvatarTypes.has(contentType)) {
    throw new HttpsError('invalid-argument', 'Only JPG, PNG, WEBP, or GIF images can be exported.');
  }

  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength > 9 * 1024 * 1024) {
    throw new HttpsError('resource-exhausted', 'Image is too large to export in the browser.');
  }

  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return { dataUrl: `data:${contentType};base64,${base64}` };
});
exports.translateChatMessage = onCall({ region: 'us-central1', cors: allowedFunctionOrigins }, async (request) => {
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

  const { protectedText: mentionProtectedText, mentions } = protectMentions(originalText);
  const protectedNameTerms = [
    message.displayName,
    message.senderLabel,
    message.uid && message.uid !== '__system__' ? message.uid : '',
  ];
  const { protectedText, protectedTerms } = protectTerms(mentionProtectedText, protectedNameTerms);
  const [translatedText] = await getTranslateClient().translate(protectedText, {
    from: message.language || undefined,
    to: targetLanguage,
    format: 'text',
  });
  const restoredText = restoreMentions(restoreTerms(translatedText, protectedTerms), mentions);

  await messageRef.set({
    translations: {
      [targetLanguage]: restoredText,
    },
    translatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return { translatedText: restoredText, targetLanguage };
});

exports.createChatImageUpload = onCall({
  region: 'us-central1',
  cors: allowedFunctionOrigins,
  secrets: [r2AccessKeyId, r2SecretAccessKey],
}, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Sign in before uploading a chat image.');
  }

  const roomId = String(request.data?.roomId || '').trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 120);
  const contentType = String(request.data?.contentType || '').toLowerCase();
  const size = Number(request.data?.size || 0);
  const extension = allowedAvatarTypes.get(contentType);

  if (!roomId) {
    throw new HttpsError('invalid-argument', 'Chat room is required.');
  }

  if (!extension) {
    throw new HttpsError('invalid-argument', 'Please choose a JPG, PNG, WEBP, or GIF image.');
  }

  if (!size || size > 8 * 1024 * 1024) {
    throw new HttpsError('invalid-argument', 'Chat image must be smaller than 8 MB.');
  }

  const room = await assertCanReadRoom({ roomId, uid });
  if (room?.type === 'allianceSub' && room.memberCanWrite === false) {
    const role = room.memberRoles?.[uid];
    const canManage = room.ownerUid === uid || role === 'owner' || role === 'admin';
    if (!canManage) {
      throw new HttpsError('permission-denied', 'Only alliance chat owner/admins can upload images in this sub chat.');
    }
  }

  const key = `chat-images/${roomId}/${uid}/image-${Date.now()}.${extension}`;
  const uploadUrl = await getSignedUrl(
    getR2Client(),
    new PutObjectCommand({
      Bucket: cleanConfigValue(r2Bucket.value()),
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
    { expiresIn: 120 },
  );
  const publicBaseUrl = cleanConfigValue(r2PublicUrl.value()).replace(/\/+$/, '');
  const publicUrl = `${publicBaseUrl}/${key.split('/').map(encodeURIComponent).join('/')}`;

  return { uploadUrl, publicUrl };
});

exports.createProfileImageUpload = onCall({
  region: 'us-central1',
  cors: allowedFunctionOrigins,
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
      Bucket: cleanConfigValue(r2Bucket.value()),
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
    { expiresIn: 120 },
  );
  const publicBaseUrl = cleanConfigValue(r2PublicUrl.value()).replace(/\/+$/, '');
  const publicUrl = `${publicBaseUrl}/${key.split('/').map(encodeURIComponent).join('/')}`;

  return { uploadUrl, publicUrl };
});







