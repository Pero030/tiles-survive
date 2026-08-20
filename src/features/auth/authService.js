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
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../../services/firebase.js';
import { uploadProfileImageToR2 } from '../../services/profileImages.js';
import { savePublicProfile } from '../../services/profileDirectory.js';
import { markCurrentWebsiteUserOffline, saveWebsiteUserPresence } from '../../services/websiteUsers.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const accountMissingError = () => new Error('Account does not exist. Please use Register first.');

const normalizeGameServer = (gameServer) => String(gameServer || '').replace(/\D/g, '').slice(0, 6);
const normalizeAllianceName = (allianceName) => String(allianceName || '').trim().slice(0, 48);
const normalizeAllianceTag = (allianceTag) => String(allianceTag || '').trim().replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8);
const isPersistablePhotoURL = (photoURL) => /^https:\/\//i.test(String(photoURL || '').trim());
const normalizePhotoURL = (photoURL) => {
  const value = String(photoURL || '').trim();
  return isPersistablePhotoURL(value) ? value : '';
};

const getUserProfileSnapshot = async (uid, collectionName) => {
  if (!uid || !isFirebaseConfigured()) {
    return {};
  }

  const snapshot = await getDoc(doc(db, collectionName, uid)).catch(() => null);
  return snapshot?.exists?.() ? snapshot.data() : {};
};

const mergeUserProfile = (user, privateProfile = {}, publicProfile = {}, partialProfile = {}) => {
  const displayName = partialProfile.displayName
    ?? privateProfile.displayName
    ?? publicProfile.displayName
    ?? user?.displayName
    ?? '';

  return {
    uid: user?.uid,
    displayName: String(displayName || '').trim(),
    gameServer: normalizeGameServer(partialProfile.gameServer ?? privateProfile.gameServer ?? publicProfile.gameServer),
    allianceName: normalizeAllianceName(partialProfile.allianceName ?? privateProfile.allianceName ?? publicProfile.allianceName),
    allianceTag: normalizeAllianceTag(partialProfile.allianceTag ?? privateProfile.allianceTag ?? publicProfile.allianceTag),
    photoURL: normalizePhotoURL(partialProfile.photoURL ?? privateProfile.photoURL ?? publicProfile.photoURL ?? user?.photoURL),
  };
};

const syncUser = async (credential) => {
  if (credential?.user) {
    await saveWebsiteUserPresence(credential.user, true);
    await syncPublicProfile(credential.user);
  }

  return credential;
};

const syncSocialUser = async (credential, { allowNewUser = false } = {}) => {
  if (!credential) {
    return null;
  }

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

const syncPublicProfile = async (user, partialProfile = {}) => {
  if (!user?.uid) {
    return;
  }

  const [privateProfile, publicProfile] = await Promise.all([
    getUserProfileSnapshot(user.uid, 'users'),
    getUserProfileSnapshot(user.uid, 'publicProfiles'),
  ]);
  const profile = mergeUserProfile(user, privateProfile, publicProfile, partialProfile);

  await savePublicProfile(profile);

  if ((profile.gameServer || profile.allianceName || profile.allianceTag || profile.photoURL) && (
    privateProfile.gameServer !== profile.gameServer
    || privateProfile.allianceName !== profile.allianceName
    || privateProfile.allianceTag !== profile.allianceTag
    || privateProfile.photoURL !== profile.photoURL
    || privateProfile.displayName !== profile.displayName
  )) {
    await setDoc(doc(db, 'users', user.uid), {
      displayName: profile.displayName,
      gameServer: profile.gameServer,
      allianceName: profile.allianceName,
      allianceTag: profile.allianceTag,
      photoURL: profile.photoURL,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
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
    await syncPublicProfile(auth.currentUser);
    return auth.currentUser;
  },


  async updateDisplayName(displayName) {
    if (!auth.currentUser) {
      throw new Error('No signed in user found.');
    }

    await updateProfile(auth.currentUser, { displayName: String(displayName || '').trim() });
    await saveWebsiteUserPresence(auth.currentUser, true);
    await syncPublicProfile(auth.currentUser, { displayName: auth.currentUser.displayName || '' });
    return auth.currentUser;
  },

  async getCurrentUserProfile() {
    if (!auth.currentUser?.uid || !isFirebaseConfigured()) {
      return {};
    }

    const [privateProfile, publicProfile] = await Promise.all([
      getUserProfileSnapshot(auth.currentUser.uid, 'users'),
      getUserProfileSnapshot(auth.currentUser.uid, 'publicProfiles'),
    ]);

    return mergeUserProfile(auth.currentUser, privateProfile, publicProfile);
  },

  async updateGameServer(gameServer) {
    if (!auth.currentUser) {
      throw new Error('No signed in user found.');
    }

    const normalizedServer = normalizeGameServer(gameServer);
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      gameServer: normalizedServer,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    await saveWebsiteUserPresence(auth.currentUser, true);
    await syncPublicProfile(auth.currentUser, { gameServer: normalizedServer });
    return normalizedServer;
  },

  async updateAllianceInfo({ allianceName, allianceTag }) {
    if (!auth.currentUser) {
      throw new Error('No signed in user found.');
    }

    const normalizedAllianceName = normalizeAllianceName(allianceName);
    const normalizedAllianceTag = normalizeAllianceTag(allianceTag);

    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      allianceName: normalizedAllianceName,
      allianceTag: normalizedAllianceTag,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    await saveWebsiteUserPresence(auth.currentUser, true);
    await syncPublicProfile(auth.currentUser, {
      allianceName: normalizedAllianceName,
      allianceTag: normalizedAllianceTag,
    });

    return {
      allianceName: normalizedAllianceName,
      allianceTag: normalizedAllianceTag,
    };
  },

  async updateProfileSettings({ displayName, gameServer, allianceName, allianceTag, photoURL: nextPhotoURL }) {
    if (!auth.currentUser) {
      throw new Error('No signed in user found.');
    }

    const normalizedDisplayName = String(displayName || '').trim();
    const normalizedServer = normalizeGameServer(gameServer);
    const normalizedAllianceName = normalizeAllianceName(allianceName);
    const normalizedAllianceTag = normalizeAllianceTag(allianceTag);
    const [privateProfile, publicProfile] = await Promise.all([
      getUserProfileSnapshot(auth.currentUser.uid, 'users'),
      getUserProfileSnapshot(auth.currentUser.uid, 'publicProfiles'),
    ]);
    const photoURL = normalizePhotoURL(nextPhotoURL)
      || normalizePhotoURL(auth.currentUser.photoURL)
      || normalizePhotoURL(privateProfile.photoURL)
      || normalizePhotoURL(publicProfile.photoURL);

    await updateProfile(auth.currentUser, { displayName: normalizedDisplayName, photoURL });
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      displayName: normalizedDisplayName,
      gameServer: normalizedServer,
      allianceName: normalizedAllianceName,
      allianceTag: normalizedAllianceTag,
      photoURL,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    await saveWebsiteUserPresence(auth.currentUser, true);
    await syncPublicProfile(auth.currentUser, {
      displayName: normalizedDisplayName,
      gameServer: normalizedServer,
      allianceName: normalizedAllianceName,
      allianceTag: normalizedAllianceTag,
      photoURL,
    });

    return {
      user: auth.currentUser,
      gameServer: normalizedServer,
      allianceName: normalizedAllianceName,
      allianceTag: normalizedAllianceTag,
      photoURL,
    };
  },

  async uploadProfileImage(file) {
    if (!auth.currentUser) {
      throw new Error('No signed in user found.');
    }

    if (!file?.type?.startsWith('image/')) {
      throw new Error('Please choose an image file.');
    }

    if (file.size > 3 * 1024 * 1024) {
      throw new Error('Profile image must be smaller than 3 MB.');
    }

    const photoURL = normalizePhotoURL(await uploadProfileImageToR2({ file }));
    if (!photoURL) {
      throw new Error('Profile image upload did not return a valid public image URL.');
    }

    await updateProfile(auth.currentUser, { photoURL });
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      photoURL,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    await saveWebsiteUserPresence(auth.currentUser, true);
    await syncPublicProfile(auth.currentUser, { photoURL });

    return {
      user: auth.currentUser,
      photoURL,
    };
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
