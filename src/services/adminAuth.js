import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase.js';
import { markCurrentWebsiteUserOffline } from './websiteUsers.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizeList = (items) => Array.isArray(items) ? items.map((item) => String(item || '').trim().toLowerCase()).filter(Boolean) : [];

const readCentralAdminAccess = async (user) => {
  const snapshot = await getDoc(doc(db, 'admin', 'access'));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  const email = normalizeEmail(user.email);
  const emails = normalizeList(data.emails || data.adminEmails);
  const uids = Array.isArray(data.uids || data.adminUids) ? (data.uids || data.adminUids).map(String) : [];

  if (data.active === false) {
    return null;
  }

  if (emails.includes(email) || uids.includes(user.uid)) {
    return {
      id: 'admin/access',
      active: true,
      role: 'admin',
      source: 'central-access-list',
    };
  }

  return null;
};

const readAdminRecord = async (user) => {
  if (!user?.uid) {
    return null;
  }

  const centralAccess = await readCentralAdminAccess(user);
  if (centralAccess) {
    return centralAccess;
  }

  const lookupIds = [user.uid, normalizeEmail(user.email)].filter(Boolean);

  for (const lookupId of lookupIds) {
    const snapshot = await getDoc(doc(db, 'adminUsers', lookupId));
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
  }

  return null;
};

export const isAllowedAdminRecord = (record) => Boolean(record && record.active !== false && (record.role === 'admin' || record.isAdmin === true));

export const getCurrentAdminState = async (user) => {
  if (!user || !isFirebaseConfigured()) {
    return { authenticated: false, allowed: false, user: null, adminRecord: null };
  }

  const adminRecord = await readAdminRecord(user);
  return {
    authenticated: true,
    allowed: isAllowedAdminRecord(adminRecord),
    user,
    adminRecord,
  };
};

export const subscribeToAdminAuth = (onChange) => {
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    onChange({ loading: false, authenticated: false, allowed: false, user: null, adminRecord: null });
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    try {
      const state = await getCurrentAdminState(user);
      onChange({ loading: false, ...state });
    } catch (error) {
      console.error(error);
      onChange({ loading: false, authenticated: Boolean(user), allowed: false, user, adminRecord: null, error });
    }
  });
};

export const signInAdmin = async ({ email, password }) => {
  const credential = await signInWithEmailAndPassword(auth, normalizeEmail(email), password);
  const state = await getCurrentAdminState(credential.user);

  if (!state.allowed) {
    await signOut(auth);
    throw new Error('This Firebase user is not marked as an admin. Add the email to Firestore: admin/access -> emails.');
  }

  return state;
};

export const signOutAdmin = async () => {
  await markCurrentWebsiteUserOffline();
  return signOut(auth);
};