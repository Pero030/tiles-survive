import {
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { auth } from '../../services/firebase.js';
import { markCurrentWebsiteUserOffline, saveWebsiteUserPresence } from '../../services/websiteUsers.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
let recaptchaVerifier = null;

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

  getPhoneVerifier(containerId = 'phone-recaptcha') {
    if (recaptchaVerifier) {
      return recaptchaVerifier;
    }

    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {},
    });

    return recaptchaVerifier;
  },

  async sendPhoneCode(phoneNumber, containerId) {
    const verifier = this.getPhoneVerifier(containerId);
    return signInWithPhoneNumber(auth, String(phoneNumber || '').trim(), verifier);
  },

  async confirmPhoneCode(confirmationResult, code) {
    return syncUser(await confirmationResult.confirm(String(code || '').trim()));
  },

  async completeRedirectLogin() {
    return syncUser(await getRedirectResult(auth));
  },

  async signOut() {
    await markCurrentWebsiteUserOffline();
    return signOut(auth);
  },
};