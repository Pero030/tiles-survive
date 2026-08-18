import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  getAdditionalUserInfo,
  getRedirectResult,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../services/firebase.js';
import { markCurrentWebsiteUserOffline, saveWebsiteUserPresence } from '../../services/websiteUsers.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const accountMissingError = () => new Error('Account does not exist. Please use Register first.');

const syncUser = async (credential) => {
  if (credential?.user) {
    await saveWebsiteUserPresence(credential.user, true);
  }

  return credential;
};

const syncSocialUser = async (credential, { allowNewUser = false } = {}) => {
  const info = getAdditionalUserInfo(credential);

  if (info?.isNewUser && !allowNewUser) {
    try {
      await deleteUser(credential.user);
    } catch (error) {
      console.error(error);
    }

    await signOut(auth).catch(() => {});
    throw accountMissingError();
  }

  return syncUser(credential);
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
    const credential = await createUserWithEmailAndPassword(auth, normalizeEmail(email), password);
    await sendEmailVerification(credential.user);
    return syncUser(credential);
  },

  async signInWithEmail(email, password) {
    return syncUser(await signInWithEmailAndPassword(auth, normalizeEmail(email), password));
  },

  async signInWithGoogle(options) {
    return syncSocialUser(await signInWithPopup(auth, createGoogleProvider()), options);
  },

  async signInWithApple(options) {
    return syncSocialUser(await signInWithPopup(auth, createAppleProvider()), options);
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


  async updateDisplayName(displayName) {
    if (!auth.currentUser) {
      throw new Error('No signed in user found.');
    }

    await updateProfile(auth.currentUser, { displayName: String(displayName || '').trim() });
    await saveWebsiteUserPresence(auth.currentUser, true);
    return auth.currentUser;
  },

  async updateUserPassword(password) {
    if (!auth.currentUser) {
      throw new Error('No signed in user found.');
    }

    await updatePassword(auth.currentUser, password);
    await saveWebsiteUserPresence(auth.currentUser, true);
  },
  async completeRedirectLogin() {
    return syncSocialUser(await getRedirectResult(auth), { allowNewUser: true });
  },

  async signOut() {
    await markCurrentWebsiteUserOffline();
    return signOut(auth);
  },
};