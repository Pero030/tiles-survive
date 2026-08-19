import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';

const publicProfilesRef = collection(db, 'publicProfiles');

const cleanPublicProfile = (profile) => ({
  uid: profile.uid,
  displayName: String(profile.displayName || 'Player').trim().slice(0, 40),
  gameServer: String(profile.gameServer || '').replace(/\D/g, '').slice(0, 6),
  allianceName: String(profile.allianceName || '').trim().slice(0, 48),
  allianceTag: String(profile.allianceTag || '').trim().replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8),
  photoURL: String(profile.photoURL || '').trim(),
  updatedAt: serverTimestamp(),
});

export const savePublicProfile = async (profile) => {
  if (!profile?.uid || !isFirebaseConfigured()) {
    return;
  }

  await setDoc(doc(db, 'publicProfiles', profile.uid), cleanPublicProfile(profile), { merge: true });
};

export const subscribeToPublicProfiles = (onData, onError) => {
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    onData([]);
    return () => {};
  }

  return onSnapshot(
    query(publicProfilesRef, orderBy('displayName', 'asc')),
    (snapshot) => {
      onData(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
    },
    (error) => {
      onError?.(error);
    },
  );
};
