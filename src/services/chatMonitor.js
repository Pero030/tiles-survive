import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';

const chatRoomsRef = collection(db, 'chatRooms');

export const formatChatRoomType = (type) => {
  if (type === 'global') return 'Global';
  if (type === 'alliance') return 'Alliance';
  if (type === 'allianceSub') return 'Alliance sub chat';
  if (type === 'private') return 'Private';
  return 'Chat';
};

export const subscribeToAllChatRooms = (onData, onError) => {
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    onData([]);
    return () => {};
  }

  return onSnapshot(
    query(chatRoomsRef, orderBy('updatedAt', 'desc'), limit(100)),
    (snapshot) => {
      onData(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
    },
    (error) => {
      onError?.(error);
    },
  );
};

export const subscribeToChatRoomMessages = (roomId, onData, onError) => {
  if (typeof window === 'undefined' || !isFirebaseConfigured() || !roomId) {
    onData([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, 'chatRooms', roomId, 'messages'), orderBy('createdAt', 'desc'), limit(100)),
    (snapshot) => {
      onData(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })).reverse());
    },
    (error) => {
      onError?.(error);
    },
  );
};
