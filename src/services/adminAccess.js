import { arrayRemove, arrayUnion, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';

const accessRef = doc(db, 'admin', 'access');

export const normalizeAdminEmail = (email) => String(email || '').trim().toLowerCase();

export const subscribeToAdminAccess = (onData, onError) => {
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    onData({ active: true, emails: [] });
    return () => {};
  }

  return onSnapshot(
    accessRef,
    (snapshot) => {
      const data = snapshot.exists() ? snapshot.data() : {};
      onData({
        active: data.active !== false,
        emails: Array.isArray(data.emails) ? data.emails.map(normalizeAdminEmail).filter(Boolean).sort() : [],
      });
    },
    (error) => {
      onError?.(error);
    },
  );
};

export const addAdminEmail = async (email) => {
  const normalizedEmail = normalizeAdminEmail(email);

  if (!normalizedEmail) {
    throw new Error('Enter an email address.');
  }

  await setDoc(accessRef, {
    active: true,
    emails: arrayUnion(normalizedEmail),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  await setDoc(doc(db, 'adminUsers', normalizedEmail), {
    active: true,
    role: 'admin',
    email: normalizedEmail,
    updatedAt: serverTimestamp(),
    updatedBy: 'admin-access-panel',
  }, { merge: true });
};

export const removeAdminEmail = async (email) => {
  const normalizedEmail = normalizeAdminEmail(email);

  if (!normalizedEmail) {
    return;
  }

  await updateDoc(accessRef, {
    emails: arrayRemove(normalizedEmail),
    updatedAt: serverTimestamp(),
  });

  await setDoc(doc(db, 'adminUsers', normalizedEmail), {
    active: false,
    updatedAt: serverTimestamp(),
    updatedBy: 'admin-access-panel',
  }, { merge: true });
};