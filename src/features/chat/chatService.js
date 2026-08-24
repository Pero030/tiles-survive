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
const normalizeImageAttachment = (attachment = null) => {
  const item = attachment || {};
  const url = String(item.url || '').trim();
  if (!url) return null;

  return {
    url,
    name: String(item.name || 'Chat image').trim().slice(0, 120),
    type: String(item.type || 'image').trim().slice(0, 40),
    size: Number(item.size || 0),
  };
};
const normalizeServer = (gameServer) => String(gameServer || '').replace(/\D/g, '').slice(0, 6);
const normalizeAllianceTag = (allianceTag) => String(allianceTag || '').trim().replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8);
const normalizeRoomTitle = (title) => String(title || '').trim().slice(0, 60);
const normalizeInviteCode = (code) => String(code || '').trim().replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 12);
const normalizeLanguageCode = (languageCode) => String(languageCode || '').trim().toLowerCase().replace(/[^a-z-]/g, '').slice(0, 12) || 'en';
const getDirectPrivateKey = (firstUid, secondUid) => [firstUid, secondUid].filter(Boolean).sort().join('_');
const isDeleteConfirmation = (value) => ['delete', 'loeschen', 'loschen', 'löschen'].includes(String(value || '').trim().toLowerCase());
const getAllianceMuteUntil = (room, uid) => Number(room?.mutedUntilByUid?.[uid] || 0);
const isAllianceMemberMuted = (room, user) => {
  if (!room || !user || (room.type !== 'alliance' && room.type !== 'allianceSub')) return false;
  if (canManageAllianceRoom(room, user)) return false;
  const muteUntil = getAllianceMuteUntil(room, user.uid);
  return muteUntil > Date.now() || room.mutedUids?.[user.uid] === true;
};
const formatMuteUntil = (timestamp) => {
  const value = Number(timestamp || 0);
  if (!value) return '';
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};
const formatMuteDuration = (totalMinutes) => {
  const minutes = Math.max(1, Math.round(Number(totalMinutes) || 0));
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  if (hours > 0 && restMinutes > 0) return `${hours} hour${hours === 1 ? '' : 's'} ${restMinutes} minute${restMinutes === 1 ? '' : 's'}`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
};

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

const canWriteRoom = (room, user, profile = {}) => {
  if (!canUseRoom(room, user, profile)) return false;
  if (isAllianceMemberMuted(room, user)) return false;
  if (room.type !== 'allianceSub') return true;
  if (room.memberCanWrite === false) {
    return canManageAllianceRoom(room, user);
  }
  return true;
};

const canInviteToRoom = (room, user) => {
  if (!room || room.type !== 'private' || !user) return false;
  if (room.ownerUid === user.uid) return true;
  return room.memberPermissions?.[user.uid]?.canInvite === true && room.memberUids?.[user.uid] === true;
};

const canKickFromRoom = (room, user) => {
  if (!room || room.type !== 'private' || !user) return false;
  if (room.ownerUid === user.uid) return true;
  return room.memberPermissions?.[user.uid]?.canKick === true && room.memberUids?.[user.uid] === true;
};

const normalizeAllianceRolePermission = (permission) => permission === 'owner' ? 'owner' : permission === 'admin' ? 'admin' : 'member';
const normalizeAllianceRoleName = (name) => String(name || '').trim().slice(0, 32);
const normalizeAllianceRoleId = (name) => normalizeAllianceRoleName(name)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 40);
const getAllianceRoleDefinition = (room, roleId) => {
  if (roleId === 'owner') return { id: 'owner', name: 'Owner', permission: 'owner', system: true };
  if (roleId === 'admin') return { id: 'admin', name: 'Admin', permission: 'admin', system: true };
  if (roleId === 'member') return { id: 'member', name: 'Member', permission: 'member', system: true };
  const customRole = room?.allianceRoles?.[roleId];
  return customRole ? { id: roleId, ...customRole, permission: normalizeAllianceRolePermission(customRole.permission) } : { id: 'member', name: 'Member', permission: 'member', system: true };
};
const getAllianceMemberPermission = (room, userOrUid) => {
  const uid = typeof userOrUid === 'string' ? userOrUid : userOrUid?.uid;
  if (!room || !uid) return 'member';
  if (room.ownerUid === uid) return 'owner';
  const roleId = room.memberRoles?.[uid] || 'member';
  return getAllianceRoleDefinition(room, roleId).permission;
};

const canManageAllianceRoom = (room, user) => {
  if (!room || (room.type !== 'alliance' && room.type !== 'allianceSub') || !user) return false;
  const permission = getAllianceMemberPermission(room, user);
  return permission === 'owner' || permission === 'admin';
};

const canChangeAllianceRoles = (room, user) => room?.type === 'alliance' && Boolean(user?.uid) && getAllianceMemberPermission(room, user) === 'owner';
const canCreateAllianceSubRoom = (room, user) => room?.type === 'alliance' && Boolean(user?.uid) && getAllianceMemberPermission(room, user) === 'owner';
const canDeleteAllianceRoom = (room, user) => Boolean(room?.id && user?.uid && getAllianceMemberPermission(room, user) === 'owner');

const canDeleteRoom = (room, user) => room?.type === 'private' && Boolean(user?.uid) && room.ownerUid === user.uid;

const deleteRoomMessages = async (roomId) => {
  let hasMoreMessages = true;

  while (hasMoreMessages) {
    const messageSnapshots = await getDocs(query(getRoomMessagesRef(roomId), limit(400)));
    if (messageSnapshots.empty) {
      hasMoreMessages = false;
      continue;
    }

    const batch = writeBatch(db);
    messageSnapshots.docs.forEach((messageDoc) => {
      batch.delete(messageDoc.ref);
    });
    await batch.commit();
  }
};

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
  canKickFromRoom,
  canDeleteRoom,
  canUseRoom,
  canWriteRoom,
  canManageAllianceRoom,
  canChangeAllianceRoles,
  canCreateAllianceSubRoom,
  canDeleteAllianceRoom,

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

  async createPrivateRoom({ title, invitePolicy = 'ownerOnly', memberUids = [], directKey = '', isDirectPrivate = false, directMemberNames = {} }) {
    if (!auth.currentUser) {
      throw new Error('Sign in before creating a private chat.');
    }

    const profile = await getCurrentProfile();
    const uniqueMemberUids = [...new Set([auth.currentUser.uid, ...memberUids.filter(Boolean)])];
    const memberMap = Object.fromEntries(uniqueMemberUids.map((uid) => [uid, true]));
    const memberPermissions = Object.fromEntries(uniqueMemberUids.map((uid) => [uid, {
      canInvite: uid === auth.currentUser.uid,
      canKick: uid === auth.currentUser.uid,
    }]));
    const roomTitle = normalizeRoomTitle(title);
    if (!roomTitle && isDirectPrivate !== true) {
      throw new Error('Enter a room name first.');
    }

    const roomDoc = await addDoc(chatRoomsRef, {
      type: 'private',
      title: roomTitle || 'Private Chat',
      ownerUid: auth.currentUser.uid,
      invitePolicy: invitePolicy === 'allMembers' ? 'allMembers' : 'ownerOnly',
      memberUids: memberMap,
      memberPermissions,
      memberCount: uniqueMemberUids.length,
      directKey: String(directKey || '').trim(),
      isDirectPrivate: isDirectPrivate === true,
      directMemberNames: isDirectPrivate === true ? directMemberNames : {},
      createdByLabel: buildSenderLabel(auth.currentUser, profile),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return roomDoc.id;
  },


  async createOrOpenDirectPrivateRoom({ targetUid, targetName = '' }) {
    if (!auth.currentUser) {
      throw new Error('Sign in before creating a private chat.');
    }

    const cleanedTargetUid = String(targetUid || '').trim();
    if (!cleanedTargetUid || cleanedTargetUid === auth.currentUser.uid) {
      throw new Error('Choose another user first.');
    }

    const directKey = getDirectPrivateKey(auth.currentUser.uid, cleanedTargetUid);
    const directSnapshot = await getDocs(query(chatRoomsRef, where('directKey', '==', directKey), limit(1)));
    const directRoom = directSnapshot.docs[0];
    if (directRoom) {
      return directRoom.id;
    }


    const currentProfile = await getCurrentProfile();
    const currentDisplayName = String(currentProfile?.displayName || auth.currentUser.displayName || 'Player').trim() || 'Player';
    const title = normalizeRoomTitle(targetName) || 'Private Chat';
    const roomId = await this.createPrivateRoom({
      title,
      invitePolicy: 'ownerOnly',
      memberUids: [cleanedTargetUid],
      directKey,
      isDirectPrivate: true,
      directMemberNames: {
        [auth.currentUser.uid]: currentDisplayName,
        [cleanedTargetUid]: title,
      },
    });
    return roomId;
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

  async updatePrivateRoomSettings(roomId, { title, invitePolicy }) {
    if (!auth.currentUser) {
      throw new Error('Sign in before changing private chat settings.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      throw new Error('Private chat not found.');
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (!canDeleteRoom(room, auth.currentUser)) {
      throw new Error('Only the creator can change private chat settings.');
    }

    await updateDoc(getRoomRef(roomId), {
      title: normalizeRoomTitle(title) || room.title || 'Private Chat',
      invitePolicy: invitePolicy === 'allMembers' ? 'allMembers' : 'ownerOnly',
      updatedAt: serverTimestamp(),
    });
  },
  async updatePrivateMemberPermissions(roomId, uid, permissions = {}) {
    if (!auth.currentUser) {
      throw new Error('Sign in before changing private chat permissions.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      throw new Error('Private chat not found.');
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (!canDeleteRoom(room, auth.currentUser)) {
      throw new Error('Only the creator can change member permissions.');
    }
    if (!room.memberUids?.[uid]) {
      throw new Error('This user is not a member of this private chat.');
    }
    if (uid === room.ownerUid) {
      throw new Error('The creator keeps all private chat rights.');
    }

    await updateDoc(getRoomRef(roomId), {
      ['memberPermissions.' + uid]: {
        canInvite: permissions.canInvite === true,
        canKick: permissions.canKick === true,
      },
      updatedAt: serverTimestamp(),
    });
  },

  async removeMemberFromPrivateRoom(roomId, uid) {
    if (!auth.currentUser) {
      throw new Error('Sign in before removing users.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      throw new Error('Private chat not found.');
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (!canKickFromRoom(room, auth.currentUser)) {
      throw new Error('You are not allowed to remove users from this chat.');
    }
    if (uid === room.ownerUid) {
      throw new Error('The creator cannot be removed from this private chat.');
    }
    if (!room.memberUids?.[uid]) {
      return;
    }

    await updateDoc(getRoomRef(roomId), {
      ['memberUids.' + uid]: deleteField(),
      ['memberPermissions.' + uid]: deleteField(),
      memberCount: Math.max(1, Object.keys(room.memberUids || {}).length - 1),
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

    await deleteRoomMessages(roomId);
    await deleteDoc(getRoomRef(roomId));
  },

  async deleteAllianceSubRoom(roomId, confirmationWord) {
    if (!auth.currentUser) {
      throw new Error('Sign in before deleting an alliance sub chat.');
    }

    if (!isDeleteConfirmation(confirmationWord)) {
      throw new Error('Type Delete first to confirm.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      return;
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

    if (!canDeleteAllianceRoom(managerRoom, auth.currentUser)) {
      throw new Error('Only an alliance chat owner can delete this sub chat.');
    }

    await deleteRoomMessages(room.id);
    await deleteDoc(getRoomRef(room.id));
  },

  async deleteAllianceRoom(roomId, confirmationWord) {
    if (!auth.currentUser) {
      throw new Error('Sign in before deleting an alliance chat.');
    }

    if (!isDeleteConfirmation(confirmationWord)) {
      throw new Error('Type Delete first to confirm.');
    }

    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      return;
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (room.type !== 'alliance') {
      throw new Error('Open the main alliance chat first.');
    }

    if (!canDeleteAllianceRoom(room, auth.currentUser)) {
      throw new Error('Only an alliance chat owner can delete this alliance chat.');
    }

    const subRoomsSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', room.id)));
    const roomsToDelete = [room, ...subRoomsSnapshot.docs.map((roomDoc) => ({ id: roomDoc.id, ...roomDoc.data() })).filter((subRoom) => subRoom.type === 'allianceSub')];

    for (const roomToDelete of roomsToDelete) {
      await deleteRoomMessages(roomToDelete.id);
    }

    const batch = writeBatch(db);
    roomsToDelete.forEach((roomToDelete) => {
      batch.delete(getRoomRef(roomToDelete.id));
    });
    await batch.commit();
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

  async createAllianceSubRoom(parentRoom, title = '') {
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
    const roomTitle = normalizeRoomTitle(title);
    if (!roomTitle) {
      throw new Error('Enter a sub chat name first.');
    }

    const roomDoc = await addDoc(chatRoomsRef, {
      type: 'allianceSub',
      parentRoomId: liveParentRoom.id,
      title: roomTitle,
      gameServer: liveParentRoom.gameServer,
      allianceName: liveParentRoom.allianceName || '',
      allianceTag: liveParentRoom.allianceTag,
      ownerUid: liveParentRoom.ownerUid,
      memberUids: liveParentRoom.memberUids || {},
      memberRoles: liveParentRoom.memberRoles || {},
      allianceRoles: liveParentRoom.allianceRoles || {},
      memberCount: liveParentRoom.memberCount || Object.keys(liveParentRoom.memberUids || {}).length || 1,
      audience: 'members',
      memberCanWrite: true,
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

  async setAllianceCustomRole(roomId, roleId, roleData = {}) {
    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      throw new Error('Alliance chat not found.');
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (!canChangeAllianceRoles(room, auth.currentUser)) {
      throw new Error('Only alliance owners can manage roles.');
    }

    const roleName = normalizeAllianceRoleName(roleData.name);
    const nextRoleId = normalizeAllianceRoleId(roleId || roleName);
    if (!roleName || !nextRoleId || ['owner', 'admin', 'member'].includes(nextRoleId)) {
      throw new Error('Enter a valid custom role name.');
    }

    const nextRole = {
      name: roleName,
      permission: normalizeAllianceRolePermission(roleData.permission),
      updatedAt: Date.now(),
    };
    const subRoomsSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', roomId)));
    const batch = writeBatch(db);
    batch.update(getRoomRef(roomId), {
      [`allianceRoles.${nextRoleId}`]: nextRole,
      updatedAt: serverTimestamp(),
    });

    subRoomsSnapshot.docs.forEach((roomDoc) => {
      const subRoom = roomDoc.data() || {};
      if (subRoom.type !== 'allianceSub') return;
      batch.update(roomDoc.ref, {
        [`allianceRoles.${nextRoleId}`]: nextRole,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    return nextRoleId;
  },

  async deleteAllianceCustomRole(roomId, roleId) {
    const roomSnapshot = await getDoc(getRoomRef(roomId));
    if (!roomSnapshot.exists()) {
      throw new Error('Alliance chat not found.');
    }

    const room = { id: roomSnapshot.id, ...roomSnapshot.data() };
    if (!canChangeAllianceRoles(room, auth.currentUser)) {
      throw new Error('Only alliance owners can manage roles.');
    }

    const normalizedRoleId = normalizeAllianceRoleId(roleId);
    if (!normalizedRoleId || ['owner', 'admin', 'member'].includes(normalizedRoleId)) return;

    const affectedUids = Object.entries(room.memberRoles || {})
      .filter(([, memberRole]) => memberRole === normalizedRoleId)
      .map(([uid]) => uid);
    const subRoomsSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', roomId)));
    const batch = writeBatch(db);
    batch.update(getRoomRef(roomId), {
      [`allianceRoles.${normalizedRoleId}`]: deleteField(),
      ...Object.fromEntries(affectedUids.map((uid) => [`memberRoles.${uid}`, 'member'])),
      updatedAt: serverTimestamp(),
    });

    subRoomsSnapshot.docs.forEach((roomDoc) => {
      const subRoom = roomDoc.data() || {};
      if (subRoom.type !== 'allianceSub') return;
      const subAffectedUids = Object.entries(subRoom.memberRoles || {})
        .filter(([, memberRole]) => memberRole === normalizedRoleId)
        .map(([uid]) => uid);
      batch.update(roomDoc.ref, {
        [`allianceRoles.${normalizedRoleId}`]: deleteField(),
        ...Object.fromEntries(subAffectedUids.map((uid) => [`memberRoles.${uid}`, 'member'])),
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
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

    if (!uid || !room.memberUids?.[uid]) {
      return;
    }

    const roleId = String(role || 'member').trim();
    const nextRole = ['owner', 'admin', 'member'].includes(roleId) || room.allianceRoles?.[roleId] ? roleId : 'member';
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

  async setAllianceSubRoomWriteAccess(roomId, memberCanWrite) {
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
      memberCanWrite: Boolean(memberCanWrite),
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
      title: roomTitle || 'Private Chat',
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

  async setAllianceMemberMuted(roomId, uid, options = {}) {
    const room = await assertAllianceManager(roomId);
    if (!uid || !room.memberUids?.[uid]) {
      return;
    }

    const muted = typeof options === 'boolean' ? options : options.muted === true;
    const durationMinutes = Math.max(1, Math.round(Number(options.durationMinutes || 0)));
    const mutedUntil = muted ? Date.now() + (durationMinutes * 60 * 1000) : 0;
    const targetName = String(options.displayName || 'Member').trim().slice(0, 80) || 'Member';
    const subRoomsSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', room.id)));
    const batch = writeBatch(db);
    const muteValue = muted ? mutedUntil : deleteField();

    batch.update(getRoomRef(room.id), {
      [`mutedUntilByUid.${uid}`]: muteValue,
      [`mutedUids.${uid}`]: deleteField(),
      updatedAt: serverTimestamp(),
    });

    subRoomsSnapshot.docs.forEach((roomDoc) => {
      const subRoom = roomDoc.data() || {};
      if (subRoom.type !== 'allianceSub' || !subRoom.memberUids?.[uid]) return;
      batch.update(roomDoc.ref, {
        [`mutedUntilByUid.${uid}`]: muteValue,
        [`mutedUids.${uid}`]: deleteField(),
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();

    if (muted) {
      const durationLabel = formatMuteDuration(durationMinutes);
      await addDoc(getRoomMessagesRef(room.id), {
        type: 'system',
        eventType: 'allianceMemberMuted',
        text: `${targetName} cannot write for ${durationLabel}.`,
        uid: '__system__',
        displayName: targetName,
        createdAt: serverTimestamp(),
      });
      await setDoc(getRoomRef(room.id), {
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  },

  async removeAllianceMember(roomId, uid) {
    const room = await assertAllianceManager(roomId);
    if (!uid || !room.memberUids?.[uid]) {
      return;
    }

    const subRoomsSnapshot = await getDocs(query(chatRoomsRef, where('parentRoomId', '==', roomId)));
    const batch = writeBatch(db);
    batch.update(getRoomRef(roomId), {
      [`memberUids.${uid}`]: deleteField(),
      [`memberRoles.${uid}`]: deleteField(),
      [`mutedUntilByUid.${uid}`]: deleteField(),
      [`mutedUids.${uid}`]: deleteField(),
      memberCount: Math.max(1, Object.keys(room.memberUids || {}).length - 1),
      updatedAt: serverTimestamp(),
    });

    subRoomsSnapshot.docs.forEach((roomDoc) => {
      const subRoom = roomDoc.data() || {};
      if (subRoom.type !== 'allianceSub') return;
      batch.update(roomDoc.ref, {
        [`memberUids.${uid}`]: deleteField(),
        [`memberRoles.${uid}`]: deleteField(),
        [`mutedUntilByUid.${uid}`]: deleteField(),
        [`mutedUids.${uid}`]: deleteField(),
        memberCount: Math.max(1, Object.keys(subRoom.memberUids || {}).length - (subRoom.memberUids?.[uid] ? 1 : 0)),
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  },

  async sendMessage(room, message, attachment = null) {
    if (!auth.currentUser) {
      throw new Error('Sign in before writing in chat.');
    }

    const text = normalizeMessage(message);
    const image = normalizeImageAttachment(attachment);
    if (!text && !image) {
      throw new Error('Enter a message or choose an image first.');
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
      if (!canWriteRoom(allianceRoom, auth.currentUser, profile)) {
        if (isAllianceMemberMuted(allianceRoom, auth.currentUser)) {
          const muteUntil = getAllianceMuteUntil(allianceRoom, auth.currentUser.uid);
          const muteUntilLabel = formatMuteUntil(muteUntil);
          throw new Error(muteUntilLabel ? 'Du wurdest bis ' + muteUntilLabel + ' Uhr für das Schreiben im Chat gesperrt.' : 'Du wurdest für das Schreiben im Chat gesperrt.');
        }
        throw new Error('Only alliance chat owner/admins can write in this sub chat.');
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
      ...(image ? { image } : {}),
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







