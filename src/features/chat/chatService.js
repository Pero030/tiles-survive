import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions, isFirebaseConfigured } from '../../services/firebase.js';
import { authService } from '../auth/authService.js';

const chatRoomsRef = collection(db, 'chatRooms');

const normalizeMessage = (message) => String(message || '').trim().slice(0, 800);
const normalizeServer = (gameServer) => String(gameServer || '').replace(/\D/g, '').slice(0, 6);
const normalizeAllianceTag = (allianceTag) => String(allianceTag || '').trim().replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8);
const normalizeRoomTitle = (title) => String(title || '').trim().slice(0, 60);
const normalizeLanguageCode = (languageCode) => String(languageCode || '').trim().toLowerCase().replace(/[^a-z-]/g, '').slice(0, 12) || 'en';

const getRoomRef = (roomId) => doc(db, 'chatRooms', roomId);
const getRoomMessagesRef = (roomId) => collection(db, 'chatRooms', roomId, 'messages');

const buildAllianceRoomId = ({ gameServer, allianceTag }) => {
  const server = normalizeServer(gameServer);
  const tag = normalizeAllianceTag(allianceTag);
  return server && tag ? `alliance-${server}-${tag}` : '';
};

const buildSenderLabel = (user, profile = {}) => {
  const server = normalizeServer(profile.gameServer);
  const allianceTag = normalizeAllianceTag(profile.allianceTag);
  const profileName = String(user.displayName || profile.displayName || 'Player').trim();
  const parts = [];

  if (server) {
    parts.push(`#${server}`);
  }

  if (allianceTag) {
    parts.push(`[${allianceTag}]`);
  }

  parts.push(profileName);
  return parts.join(' ');
};

const ensureGlobalRoom = async () => {
  await setDoc(getRoomRef('global'), {
    id: 'global',
    type: 'global',
    title: 'Global',
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

const ensureAllianceRoom = async (profile) => {
  const roomId = buildAllianceRoomId(profile);
  if (!roomId) {
    throw new Error('Set your game server and alliance tag in your profile first.');
  }

  const server = normalizeServer(profile.gameServer);
  const tag = normalizeAllianceTag(profile.allianceTag);

  await setDoc(getRoomRef(roomId), {
    id: roomId,
    type: 'alliance',
    title: `#${server} [${tag}] Alliance`,
    gameServer: server,
    allianceTag: tag,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return roomId;
};

const getCurrentProfile = async () => {
  if (!auth.currentUser) {
    throw new Error('Sign in before using chat.');
  }

  return authService.getCurrentUserProfile();
};

const canUseRoom = (room, user, profile = {}) => {
  if (!room || !user) return false;
  if (room.type === 'global') return true;
  if (room.type === 'private') return room.memberUids?.[user.uid] === true;
  if (room.type === 'alliance') {
    return room.gameServer === normalizeServer(profile.gameServer)
      && room.allianceTag === normalizeAllianceTag(profile.allianceTag);
  }
  return false;
};

const canInviteToRoom = (room, user) => {
  if (!room || room.type !== 'private' || !user) return false;
  if (room.ownerUid === user.uid) return true;
  return room.invitePolicy === 'allMembers' && room.memberUids?.[user.uid] === true;
};

const canDeleteRoom = (room, user) => room?.type === 'private' && Boolean(user?.uid) && room.ownerUid === user.uid;

export const chatService = {
  getGlobalRoom() {
    return { id: 'global', type: 'global', title: 'Global' };
  },

  getAllianceRoomForProfile(profile = {}) {
    const roomId = buildAllianceRoomId(profile);
    if (!roomId) return null;

    const server = normalizeServer(profile.gameServer);
    const tag = normalizeAllianceTag(profile.allianceTag);
    return {
      id: roomId,
      type: 'alliance',
      title: `#${server} [${tag}] Alliance`,
      gameServer: server,
      allianceTag: tag,
    };
  },

  canInviteToRoom,

  canDeleteRoom,

  subscribeToPrivateRooms(user, onData, onError) {
    if (typeof window === 'undefined' || !isFirebaseConfigured() || !user?.uid) {
      onData([]);
      return () => {};
    }

    return onSnapshot(
      query(chatRoomsRef, where('type', '==', 'private'), where(`memberUids.${user.uid}`, '==', true)),
      (snapshot) => {
        onData(snapshot.docs
          .map((roomDoc) => ({ id: roomDoc.id, ...roomDoc.data() }))
          .sort((first, second) => (second.updatedAt?.toMillis?.() || 0) - (first.updatedAt?.toMillis?.() || 0)));
      },
      (error) => {
        onError?.(error);
      },
    );
  },

  subscribeToRoom(roomId, onData, onError) {
    if (typeof window === 'undefined' || !isFirebaseConfigured() || !roomId) {
      onData(null);
      return () => {};
    }

    return onSnapshot(
      getRoomRef(roomId),
      (snapshot) => {
        onData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      },
      (error) => {
        onError?.(error);
      },
    );
  },

  subscribeToMessages(roomId, onData, onError) {
    if (typeof window === 'undefined' || !isFirebaseConfigured() || !roomId) {
      onData([]);
      return () => {};
    }

    return onSnapshot(
      query(getRoomMessagesRef(roomId), orderBy('createdAt', 'asc'), limit(100)),
      (snapshot) => {
        onData(snapshot.docs.map((messageDoc) => ({ id: messageDoc.id, ...messageDoc.data() })));
      },
      (error) => {
        onError?.(error);
      },
    );
  },

  async createPrivateRoom({ title, invitePolicy = 'ownerOnly', memberUids = [] }) {
    if (!auth.currentUser) {
      throw new Error('Sign in before creating a private chat.');
    }

    const profile = await getCurrentProfile();
    const uniqueMemberUids = [...new Set([auth.currentUser.uid, ...memberUids.filter(Boolean)])];
    const memberMap = Object.fromEntries(uniqueMemberUids.map((uid) => [uid, true]));
    const roomTitle = normalizeRoomTitle(title) || 'Private Chat';

    const roomDoc = await addDoc(chatRoomsRef, {
      type: 'private',
      title: roomTitle,
      ownerUid: auth.currentUser.uid,
      invitePolicy: invitePolicy === 'allMembers' ? 'allMembers' : 'ownerOnly',
      memberUids: memberMap,
      memberCount: uniqueMemberUids.length,
      createdByLabel: buildSenderLabel(auth.currentUser, profile),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return roomDoc.id;
  },

  async addMembersToPrivateRoom(roomId, memberUids = []) {
    if (!auth.currentUser) {
      throw new Error('Sign in before inviting users.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      throw new Error('Private chat not found.');
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (!canInviteToRoom(room, auth.currentUser)) {
      throw new Error('You are not allowed to invite users to this chat.');
    }

    const uniqueMemberUids = [...new Set(memberUids.filter(Boolean))].filter((uid) => !room.memberUids?.[uid]);
    if (!uniqueMemberUids.length) {
      return;
    }

    await updateDoc(getRoomRef(roomId), {
      ...Object.fromEntries(uniqueMemberUids.map((uid) => [`memberUids.${uid}`, true])),
      memberCount: Object.keys(room.memberUids || {}).length + uniqueMemberUids.length,
      updatedAt: serverTimestamp(),
    });
  },

  async deletePrivateRoom(roomId) {
    if (!auth.currentUser) {
      throw new Error('Sign in before deleting a private chat.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      return;
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (!canDeleteRoom(room, auth.currentUser)) {
      throw new Error('Only the creator can delete this private chat.');
    }

    const messageSnapshots = await getDocs(query(getRoomMessagesRef(roomId), limit(100)));
    const batch = writeBatch(db);
    messageSnapshots.docs.forEach((messageDoc) => {
      batch.delete(messageDoc.ref);
    });
    await batch.commit();
    await deleteDoc(getRoomRef(roomId));
  },

  async sendMessage(room, message) {
    if (!auth.currentUser) {
      throw new Error('Sign in before writing in chat.');
    }

    const text = normalizeMessage(message);
    if (!text) {
      throw new Error('Enter a message first.');
    }

    const profile = await getCurrentProfile();
    let roomId = room?.id;

    if (room?.type === 'global') {
      await ensureGlobalRoom();
      roomId = 'global';
    } else if (room?.type === 'alliance') {
      roomId = await ensureAllianceRoom(profile);
    } else {
      const roomSnapshot = await getDoc(getRoomRef(roomId));
      if (!roomSnapshot.exists()) {
        throw new Error('Chat room not found.');
      }

      const privateRoom = { id: roomSnapshot.id, ...roomSnapshot.data() };
      if (!canUseRoom(privateRoom, auth.currentUser, profile)) {
        throw new Error('You are not a member of this chat.');
      }
    }

    await addDoc(getRoomMessagesRef(roomId), {
      text,
      senderLabel: buildSenderLabel(auth.currentUser, profile),
      uid: auth.currentUser.uid,
      gameServer: normalizeServer(profile.gameServer),
      allianceName: profile.allianceName || '',
      allianceTag: normalizeAllianceTag(profile.allianceTag),
      displayName: auth.currentUser.displayName || profile.displayName || '',
      photoURL: auth.currentUser.photoURL || profile.photoURL || '',
      createdAt: serverTimestamp(),
    });

    await setDoc(getRoomRef(roomId), {
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async translateMessage({ roomId, messageId, targetLanguage }) {
    if (!auth.currentUser) {
      throw new Error('Sign in before translating chat messages.');
    }

    const language = normalizeLanguageCode(targetLanguage);
    if (!roomId || !messageId || language === 'en') {
      return null;
    }

    const translateChatMessage = httpsCallable(functions, 'translateChatMessage');
    const result = await translateChatMessage({ roomId, messageId, targetLanguage: language });
    return result.data?.translatedText || null;
  },
};
