import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase.js';

const usersCollectionRef = collection(db, 'users');
let unsubscribeAuth = null;
let heartbeatTimer = null;
let trackedUid = '';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const buildUserRecord = (user, online) => ({
  uid: user.uid,
  email: normalizeEmail(user.email),
  displayName: user.displayName || '',
  photoURL: user.photoURL || '',
  providerId: user.providerData?.[0]?.providerId || 'password',
  emailVerified: Boolean(user.emailVerified),
  online,
  lastSeenAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

export const saveWebsiteUserPresence = async (user, online = true) => {
  if (!user?.uid || !isFirebaseConfigured()) {
    return;
  }

  await setDoc(doc(db, 'users', user.uid), buildUserRecord(user, online), { merge: true });
};

const stopHeartbeat = () => {
  if (heartbeatTimer) {
    window.clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
};

export const startWebsiteUserTracking = () => {
  if (typeof window === 'undefined' || !isFirebaseConfigured() || unsubscribeAuth) {
    return () => {};
  }

  unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    stopHeartbeat();
    trackedUid = user?.uid || '';

    if (!user) {
      return;
    }

    await saveWebsiteUserPresence(user, true);

    heartbeatTimer = window.setInterval(() => {
      if (auth.currentUser?.uid === trackedUid) {
        saveWebsiteUserPresence(auth.currentUser, true).catch(console.error);
      }
    }, 60000);
  });

  const handlePageHide = () => {
    if (auth.currentUser) {
      saveWebsiteUserPresence(auth.currentUser, false).catch(() => {});
    }
  };

  window.addEventListener('pagehide', handlePageHide);

  return () => {
    stopHeartbeat();
    window.removeEventListener('pagehide', handlePageHide);
    unsubscribeAuth?.();
    unsubscribeAuth = null;
  };
};

export const markCurrentWebsiteUserOffline = async () => {
  if (auth.currentUser) {
    await saveWebsiteUserPresence(auth.currentUser, false);
  }
};

export const subscribeToWebsiteUsers = (onData, onError) => {
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    onData([]);
    return () => {};
  }

  return onSnapshot(
    query(usersCollectionRef, orderBy('lastSeenAt', 'desc')),
    (snapshot) => {
      onData(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
    },
    (error) => {
      onError?.(error);
    },
  );
};