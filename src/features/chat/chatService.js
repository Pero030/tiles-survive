import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
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
const normalizeInviteCode = (code) => String(code || '').trim().replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 12);
const normalizeLanguageCode = (languageCode) => String(languageCode || '').trim().toLowerCase().replace(/[^a-z-]/g, '').slice(0, 12) || 'en';

const getRoomRef = (roomId) => doc(db, 'chatRooms', roomId);
const getRoomMessagesRef = (roomId) => collection(db, 'chatRooms', roomId, 'messages');
const MAX_ALLIANCE_SUB_ROOMS = 5;

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

const buildJoinRequest = (user, profile = {}) => ({
  uid: user.uid,
  displayName: user.displayName || profile.displayName || 'Player',
  senderLabel: buildSenderLabel(user, profile),
  gameServer: normalizeServer(profile.gameServer),
  allianceName: profile.allianceName || '',
  allianceTag: normalizeAllianceTag(profile.allianceTag),
  photoURL: user.photoURL || profile.photoURL || '',
  status: 'pending',
  requestedAt: serverTimestamp(),
});

const getPublicProfile = async (uid) => {
  if (!uid) return {};

  const profileSnapshot = await getDoc(doc(db, 'publicProfiles', uid));
  return profileSnapshot.exists() ? { uid, ...profileSnapshot.data() } : { uid };
};

const getAllianceJoinName = (profile = {}) => String(profile.displayName || 'Player').trim() || 'Player';

const addAllianceJoinMessage = async (roomId, profile = {}) => {
  const displayName = getAllianceJoinName(profile);

  await addDoc(getRoomMessagesRef(roomId), {
    type: 'system',
    eventType: 'allianceJoined',
    text: `${displayName} joined the alliance chat.`,
    uid: '__system__',
    displayName,
    photoURL: profile.photoURL || '',
    createdAt: serverTimestamp(),
  });

  await setDoc(getRoomRef(roomId), {
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

const ensureGlobalRoom = async () => {
  await setDoc(getRoomRef('global'), {
    id: 'global',
    type: 'global',
    title: 'Global',
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

const createAllianceRoom = async (profile) => {
  const roomId = buildAllianceRoomId(profile);
  if (!roomId) {
    throw new Error('Set your game server and alliance tag in your profile first.');
  }

  const server = normalizeServer(profile.gameServer);
  const tag = normalizeAllianceTag(profile.allianceTag);
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('Sign in before creating an alliance chat.');
  }

  await setDoc(getRoomRef(roomId), {
    id: roomId,
    type: 'alliance',
    title: `#${server} [${tag}] Alliance`,
    gameServer: server,
    allianceName: profile.allianceName || '',
    allianceTag: tag,
    ownerUid: currentUser.uid,
    memberUids: { [currentUser.uid]: true },
    memberRoles: { [currentUser.uid]: 'owner' },
    memberCount: 1,
    verified: false,
    createdByLabel: buildSenderLabel(currentUser, profile),
    createdAt: serverTimestamp(),
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

const userMatchesAllianceRoom = (room, profile = {}) => room?.gameServer === normalizeServer(profile.gameServer)
  && room?.allianceTag === normalizeAllianceTag(profile.allianceTag);

const canUseRoom = (room, user, profile = {}) => {
  if (!room || !user) return false;
  if (room.type === 'global') return true;
  if (room.type === 'private') return room.memberUids?.[user.uid] === true;
  if (room.type === 'alliance') {
    return userMatchesAllianceRoom(room, profile) && room.memberUids?.[user.uid] === true;
  }
  if (room.type === 'allianceSub') {
    const isMember = userMatchesAllianceRoom(room, profile) && room.memberUids?.[user.uid] === true;
    if (!isMember) return false;
    return room.audience === 'leaders' ? canManageAllianceRoom(room, user) : true;
  }
  return false;
};

const canInviteToRoom = (room, user) => {
  if (!room || room.type !== 'private' || !user) return false;
  if (room.ownerUid === user.uid) return true;
  return room.invitePolicy === 'allMembers' && room.memberUids?.[user.uid] === true;
};

const canManageAllianceRoom = (room, user) => {
  if (!room || (room.type !== 'alliance' && room.type !== 'allianceSub') || !user) return false;
  const role = room.memberRoles?.[user.uid];
  return room.ownerUid === user.uid || role === 'owner' || role === 'admin';
};

const canChangeAllianceRoles = (room, user) => room?.type === 'alliance' && Boolean(user?.uid) && (room.ownerUid === user.uid || room.memberRoles?.[user.uid] === 'owner');
const canCreateAllianceSubRoom = (room, user) => room?.type === 'alliance' && Boolean(user?.uid) && (room.ownerUid === user.uid || room.memberRoles?.[user.uid] === 'owner');

const canDeleteRoom = (room, user) => room?.type === 'private' && Boolean(user?.uid) && room.ownerUid === user.uid;

const assertAllianceManager = async (roomId) => {
  if (!auth.currentUser) {
    throw new Error('Sign in before managing alliance chat.');
  }

  const roomSnapshot = await getDoc(getRoomRef(roomId));
  if (!roomSnapshot.exists()) {
    throw new Error('Alliance chat not found.');
  }

  const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
  if (!canManageAllianceRoom(room, auth.currentUser)) {
    throw new Error('Only alliance chat owner/admins can manage requests.');
  }

  return room;
};

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
      allianceName: profile.allianceName || '',
      allianceTag: tag,
      isCandidate: true,
    };
  },

  canInviteToRoom,
  canDeleteRoom,
  canUseRoom,
  canManageAllianceRoom,
  canChangeAllianceRoles,
  canCreateAllianceSubRoom,

  getAllianceAccessState(room, user, profile = {}) {
    if (!room || room.type !== 'alliance' || !user) return 'none';
    if (!userMatchesAllianceRoom(room, profile)) return 'profileMismatch';
    if (!room.ownerUid) return 'canCreate';
    if (room.memberUids?.[user.uid] === true) return 'member';
    if (room.joinRequests?.[user.uid]?.status === 'pending') return 'pending';
    return 'canRequest';
  },

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

  subscribeToAllianceSubRooms(parentRoomId, onData, onError) {
    if (typeof window === 'undefined' || !isFirebaseConfigured() || !parentRoomId) {
      onData([]);
      return () => {};
    }

    return onSnapshot(
      query(chatRoomsRef, where('parentRoomId', '==', parentRoomId)),
      (snapshot) => {
        onData(snapshot.docs
          .map((roomDoc) => ({ id: roomDoc.id, ...roomDoc.data() }))
          .filter((room) => room.type === 'allianceSub')
          .filter((room) => room.audience !== 'leaders' || canManageAllianceRoom(room, auth.currentUser))
          .sort((first, second) => (first.order || 0) - (second.order || 0)));
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

  async createAllianceChat(profileOverride = null) {
    const profile = profileOverride || await getCurrentProfile();
    const roomId = buildAllianceRoomId(profile);
    if (!roomId) {
      throw new Error('Set your game server and alliance tag in your profile first.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (roomSnapshot.exists()) {
      const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
      if (room.memberUids?.[auth.currentUser.uid] === true) {
        return roomId;
      }
      throw new Error('This alliance chat already exists. Send a join request instead.');
    }

    return createAllianceRoom(profile);
  },

  async createAllianceSubRoom(parentRoom) {
    if (!auth.currentUser) {
      throw new Error('Sign in before creating an alliance sub chat.');
    }

    if (!parentRoom?.id || parentRoom.type !== 'alliance') {
      throw new Error('Open the main alliance chat first.');
    }

    const parentSnapshot = await getDoc(getRoomRef(parentRoom.id));
    if (!parentSnapshot.exists()) {
      throw new Error('Main alliance chat not found.');
    }

    const liveParentRoom = { id: parentSnapshot.id, ...parentSnapshot.data() };
    if (!canCreateAllianceSubRoom(liveParentRoom, auth.currentUser)) {
      throw new Error('Only the alliance chat owner can create sub chats.');
    }

    const existingSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', liveParentRoom.id)));
    const existingSubRooms = existingSnapshot.docs
      .map((roomDoc) => ({ id: roomDoc.id, ...roomDoc.data() }))
      .filter((room) => room.type === 'allianceSub');

    if (existingSubRooms.length >= MAX_ALLIANCE_SUB_ROOMS) {
      throw new Error('You can create up to 5 alliance sub chats.');
    }

    const nextNumber = existingSubRooms.length + 1;
    const roomDoc = await addDoc(chatRoomsRef, {
      type: 'allianceSub',
      parentRoomId: liveParentRoom.id,
      title: `${liveParentRoom.title} - Chat ${nextNumber}`,
      gameServer: liveParentRoom.gameServer,
      allianceName: liveParentRoom.allianceName || '',
      allianceTag: liveParentRoom.allianceTag,
      ownerUid: liveParentRoom.ownerUid,
      memberUids: liveParentRoom.memberUids || {},
      memberRoles: liveParentRoom.memberRoles || {},
      memberCount: liveParentRoom.memberCount || Object.keys(liveParentRoom.memberUids || {}).length || 1,
      audience: 'members',
      order: nextNumber,
      createdByLabel: buildSenderLabel(auth.currentUser, await getCurrentProfile()),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return roomDoc.id;
  },
  async requestAllianceAccess(room, profileOverride = null) {
    if (!auth.currentUser) {
      throw new Error('Sign in before requesting alliance chat access.');
    }

    const profile = profileOverride || await getCurrentProfile();
    const roomId = room?.id || buildAllianceRoomId(profile);
    if (!roomId) {
      throw new Error('Set your game server and alliance tag in your profile first.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      throw new Error('This alliance chat has not been created yet. Create it if you are the first member here.');
    }

    const liveRoom = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (!userMatchesAllianceRoom(liveRoom, profile)) {
      throw new Error('Your profile server/alliance tag does not match this alliance chat.');
    }

    if (liveRoom.memberUids?.[auth.currentUser.uid] === true) {
      return;
    }

    await updateDoc(getRoomRef(roomId), {
      [`joinRequests.${auth.currentUser.uid}`]: buildJoinRequest(auth.currentUser, profile),
      updatedAt: serverTimestamp(),
    });
  },

  async approveAllianceRequest(roomId, uid) {
    const room = await assertAllianceManager(roomId);
    if (!uid || room.memberUids?.[uid]) return;

    const requestProfile = room.joinRequests?.[uid] || await getPublicProfile(uid);
    const subRoomsSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', roomId)));
    const batch = writeBatch(db);
    batch.update(getRoomRef(roomId), {
      [`memberUids.${uid}`]: true,
      [`memberRoles.${uid}`]: 'member',
      [`joinRequests.${uid}`]: deleteField(),
      memberCount: Object.keys(room.memberUids || {}).length + 1,
      updatedAt: serverTimestamp(),
    });

    subRoomsSnapshot.docs.forEach((roomDoc) => {
      const subRoom = roomDoc.data() || {};
      if (subRoom.type !== 'allianceSub') return;
      batch.update(roomDoc.ref, {
        [`memberUids.${uid}`]: true,
        [`memberRoles.${uid}`]: 'member',
        memberCount: Object.keys(subRoom.memberUids || {}).length + (subRoom.memberUids?.[uid] ? 0 : 1),
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    await addAllianceJoinMessage(roomId, requestProfile);
  },

  async rejectAllianceRequest(roomId, uid) {
    await assertAllianceManager(roomId);
    if (!uid) return;

    await updateDoc(getRoomRef(roomId), {
      [`joinRequests.${uid}`]: deleteField(),
      updatedAt: serverTimestamp(),
    });
  },

  async addAllianceMembers(roomId, memberUids = []) {
    const room = await assertAllianceManager(roomId);
    const uniqueMemberUids = [...new Set(memberUids.filter(Boolean))].filter((uid) => !room.memberUids?.[uid]);
    if (!uniqueMemberUids.length) {
      return;
    }

    const addedProfiles = await Promise.all(uniqueMemberUids.map((uid) => getPublicProfile(uid)));
    const subRoomsSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', roomId)));
    const batch = writeBatch(db);
    batch.update(getRoomRef(roomId), {
      ...Object.fromEntries(uniqueMemberUids.flatMap((uid) => [
        [`memberUids.${uid}`, true],
        [`memberRoles.${uid}`, 'member'],
        [`joinRequests.${uid}`, deleteField()],
      ])),
      memberCount: Object.keys(room.memberUids || {}).length + uniqueMemberUids.length,
      updatedAt: serverTimestamp(),
    });

    subRoomsSnapshot.docs.forEach((roomDoc) => {
      const subRoom = roomDoc.data() || {};
      if (subRoom.type !== 'allianceSub') return;
      const newForSubRoom = uniqueMemberUids.filter((uid) => !subRoom.memberUids?.[uid]);
      if (!newForSubRoom.length) return;
      batch.update(roomDoc.ref, {
        ...Object.fromEntries(newForSubRoom.flatMap((uid) => [
          [`memberUids.${uid}`, true],
          [`memberRoles.${uid}`, 'member'],
        ])),
        memberCount: Object.keys(subRoom.memberUids || {}).length + newForSubRoom.length,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    await Promise.all(addedProfiles.map((addedProfile) => addAllianceJoinMessage(roomId, addedProfile)));
  },

  async setAllianceMemberRole(roomId, uid, role) {
    if (!auth.currentUser) {
      throw new Error('Sign in before managing alliance chat.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      throw new Error('Alliance chat not found.');
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (!canChangeAllianceRoles(room, auth.currentUser)) {
      throw new Error('Only the alliance chat owner can change roles.');
    }

    if (!uid || uid === room.ownerUid || !room.memberUids?.[uid]) {
      return;
    }

    const nextRole = role === 'owner' ? 'owner' : role === 'admin' ? 'admin' : 'member';
    const subRoomsSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', roomId)));
    const batch = writeBatch(db);
    batch.update(getRoomRef(roomId), {
      [`memberRoles.${uid}`]: nextRole,
      updatedAt: serverTimestamp(),
    });

    subRoomsSnapshot.docs.forEach((roomDoc) => {
      const subRoom = roomDoc.data() || {};
      if (subRoom.type !== 'allianceSub' || !subRoom.memberUids?.[uid]) return;
      batch.update(roomDoc.ref, {
        [`memberRoles.${uid}`]: nextRole,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  },

  async setAllianceSubRoomAudience(roomId, audience) {
    if (!auth.currentUser) {
      throw new Error('Sign in before changing sub chat settings.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      throw new Error('Alliance sub chat not found.');
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (room.type !== 'allianceSub') {
      throw new Error('Open an alliance sub chat first.');
    }

    let managerRoom = room;
    if (room.parentRoomId) {
      const parentSnapshot = await getDoc(getRoomRef(room.parentRoomId));
      managerRoom = parentSnapshot.exists() ? { id: parentSnapshot.id, ...parentSnapshot.data() } : room;
    }

    if (!canManageAllianceRoom(managerRoom, auth.currentUser)) {
      throw new Error('Only alliance chat owner/admins can change sub chat settings.');
    }

    await updateDoc(getRoomRef(roomId), {
      audience: audience === 'leaders' ? 'leaders' : 'members',
      updatedAt: serverTimestamp(),
    });
  },

  async renameAllianceRoom(roomId, title) {
    if (!auth.currentUser) {
      throw new Error('Sign in before changing chat settings.');
    }

    const roomTitle = normalizeRoomTitle(title);
    if (!roomTitle) {
      throw new Error('Enter a chat name first.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      throw new Error('Alliance chat not found.');
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (room.type !== 'alliance' && room.type !== 'allianceSub') {
      throw new Error('Open an alliance chat first.');
    }

    let managerRoom = room;
    if (room.type === 'allianceSub' && room.parentRoomId) {
      const parentSnapshot = await getDoc(getRoomRef(room.parentRoomId));
      managerRoom = parentSnapshot.exists() ? { id: parentSnapshot.id, ...parentSnapshot.data() } : room;
    }

    if (!canManageAllianceRoom(managerRoom, auth.currentUser)) {
      throw new Error('Only alliance chat owner/admins can rename chats.');
    }

    await updateDoc(getRoomRef(roomId), {
      title: roomTitle,
      updatedAt: serverTimestamp(),
    });
  },

  async generateAllianceInviteCode(roomId) {
    const room = await assertAllianceManager(roomId);
    if (room.type !== 'alliance') {
      throw new Error('Invitation codes can only be created in the main alliance chat.');
    }

    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    await updateDoc(getRoomRef(roomId), {
      inviteCode: code,
      inviteCodeCreatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return code;
  },

  async joinAllianceByInviteCode(code, profileOverride = null) {
    if (!auth.currentUser) {
      throw new Error('Sign in before joining an alliance chat.');
    }

    const inviteCode = normalizeInviteCode(code);
    if (!inviteCode) {
      throw new Error('Enter an invite code first.');
    }

    const profile = profileOverride || await getCurrentProfile();
    const roomSnapshot = await getDocs(query(chatRoomsRef, where('inviteCode', '==', inviteCode), limit(1)));
    const roomDoc = roomSnapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .find((room) => room.type === 'alliance');

    if (!roomDoc) {
      throw new Error('Invite code not found.');
    }

    if (!userMatchesAllianceRoom(roomDoc, profile)) {
      throw new Error('Your profile server and alliance tag must match this alliance chat.');
    }

    if (roomDoc.memberUids?.[auth.currentUser.uid] === true) {
      return roomDoc.id;
    }

    const subRoomsSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', roomDoc.id)));
    const batch = writeBatch(db);
    batch.update(getRoomRef(roomDoc.id), {
      [`memberUids.${auth.currentUser.uid}`]: true,
      [`memberRoles.${auth.currentUser.uid}`]: 'member',
      [`joinRequests.${auth.currentUser.uid}`]: deleteField(),
      memberCount: Object.keys(roomDoc.memberUids || {}).length + 1,
      updatedAt: serverTimestamp(),
    });

    subRoomsSnapshot.docs.forEach((subRoomDoc) => {
      const subRoom = subRoomDoc.data() || {};
      if (subRoom.type !== 'allianceSub') return;
      batch.update(subRoomDoc.ref, {
        [`memberUids.${auth.currentUser.uid}`]: true,
        [`memberRoles.${auth.currentUser.uid}`]: 'member',
        memberCount: Object.keys(subRoom.memberUids || {}).length + (subRoom.memberUids?.[auth.currentUser.uid] ? 0 : 1),
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    await addAllianceJoinMessage(roomDoc.id, {
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || profile.displayName || 'Player',
      photoURL: auth.currentUser.photoURL || profile.photoURL || '',
    });
    return roomDoc.id;
  },

  async removeAllianceMember(roomId, uid) {
    const room = await assertAllianceManager(roomId);
    if (!uid || uid === room.ownerUid || !room.memberUids?.[uid]) {
      return;
    }

    const subRoomsSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', roomId)));
    const batch = writeBatch(db);
    batch.update(getRoomRef(roomId), {
      [`memberUids.${uid}`]: deleteField(),
      [`memberRoles.${uid}`]: deleteField(),
      memberCount: Math.max(1, Object.keys(room.memberUids || {}).length - 1),
      updatedAt: serverTimestamp(),
    });

    subRoomsSnapshot.docs.forEach((roomDoc) => {
      const subRoom = roomDoc.data() || {};
      if (subRoom.type !== 'allianceSub') return;
      batch.update(roomDoc.ref, {
        [`memberUids.${uid}`]: deleteField(),
        [`memberRoles.${uid}`]: deleteField(),
        memberCount: Math.max(1, Object.keys(subRoom.memberUids || {}).length - (subRoom.memberUids?.[uid] ? 1 : 0)),
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
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
    } else if (room?.type === 'alliance' || room?.type === 'allianceSub') {
      roomId = room?.id || buildAllianceRoomId(profile);
      const roomSnapshot = await getDoc(getRoomRef(roomId));
      if (!roomSnapshot.exists()) {
        throw new Error('Create this alliance chat before writing.');
      }

      const allianceRoom = { id: roomSnapshot.id, ...roomSnapshot.data() };
      if (!canUseRoom(allianceRoom, auth.currentUser, profile)) {
        throw new Error('You need alliance chat approval before writing here.');
      }
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
    if (!roomId || !messageId || !language) {
      return null;
    }

    const translateChatMessage = httpsCallable(functions, 'translateChatMessage');
    const result = await translateChatMessage({ roomId, messageId, targetLanguage: language });
    return result.data?.translatedText || null;
  },
};






