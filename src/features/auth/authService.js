import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { auth } from '../../services/firebase.js';
import { markCurrentWebsiteUserOffline, saveWebsiteUserPresence } from '../../services/websiteUsers.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const syncUser = async (credential) => {
  if (credential?.user) {
    await saveWebsiteUserPresence(credential.user, true);
  }

  return credential;
};

const createGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
};

const createAppleProvider = () => {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  return provider;
};

export const authService = {
  getCurrentUser() {
    return auth.currentUser;
  },

  subscribe(onChange) {
    return onAuthStateChanged(auth, onChange);
  },

  async registerWithEmail(email, password) {
    return syncUser(await createUserWithEmailAndPassword(auth, normalizeEmail(email), password));
  },

  async signInWithEmail(email, password) {
    return syncUser(await signInWithEmailAndPassword(auth, normalizeEmail(email), password));
  },

  async signInWithGoogle() {
    return syncUser(await signInWithPopup(auth, createGoogleProvider()));
  },

  async signInWithApple() {
    return syncUser(await signInWithPopup(auth, createAppleProvider()));
  },

  async redirectWithGoogle() {
    return signInWithRedirect(auth, createGoogleProvider());
  },

  async redirectWithApple() {
    return signInWithRedirect(auth, createAppleProvider());
  },

  async sendVerificationEmail() {
    if (!auth.currentUser) {
      throw new Error('No signed in user found.');
    }

    await sendEmailVerification(auth.currentUser);
  },

  async reloadCurrentUser() {
    if (!auth.currentUser) return null;
    await auth.currentUser.reload();
    await saveWebsiteUserPresence(auth.currentUser, true);
    return auth.currentUser;
  },

  async completeRedirectLogin() {
    return syncUser(await getRedirectResult(auth));
  },

  async signOut() {
    await markCurrentWebsiteUserOffline();
    return signOut(auth);
  },
};