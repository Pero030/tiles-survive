import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: 'AIzaSyCzeWgBvl0dn_3GXBli1kqaX8i8hPxq-RU',
  authDomain: 'tiles-survive--guide.firebaseapp.com',
  projectId: 'tiles-survive--guide',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'tiles-survive--guide.firebasestorage.app',
  messagingSenderId: '28545490896',
  appId: '1:28545490896:web:97e82ffbbc1d13b59fe3d5',
  measurementId: 'G-K5RYZ724H5',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
const contentOverridesRef = doc(db, 'admin', 'contentOverrides');
const legacyContentOverridesRef = doc(db, 'siteContent', 'contentOverrides');
let analyticsInstance = null;

const externalAssetPattern = /^(https?:|data:|blob:)/i;

export const isFirebaseConfigured = () => Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

export const getFirebaseStorageUrl = (source) => {
  if (!source || externalAssetPattern.test(source)) {
    return source;
  }

  let storagePath = source;

  if (source.startsWith('gs://')) {
    const withoutScheme = source.slice(5);
    const firstSlash = withoutScheme.indexOf('/');
    storagePath = firstSlash >= 0 ? withoutScheme.slice(firstSlash + 1) : '';
  }

  if (source.startsWith('firebase://')) {
    storagePath = source.slice('firebase://'.length);
  }

  const normalizedPath = storagePath.replace(/^\/+/, '');

  if (!normalizedPath || !firebaseConfig.storageBucket) {
    return source;
  }

  return `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(normalizedPath)}?alt=media`;
};

export const initFirebaseAnalytics = async () => {
  if (typeof window === 'undefined' || !firebaseConfig.measurementId) {
    return null;
  }

  try {
    if (!(await isSupported())) {
      return null;
    }

    analyticsInstance = analyticsInstance || getAnalytics(app);
    return analyticsInstance;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const saveRemoteContentOverrides = async (overrides) => {
  if (!isFirebaseConfigured()) {
    return;
  }

  await setDoc(contentOverridesRef, {
    overrides,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const subscribeToRemoteContentOverrides = (onData, onError) => {
  if (typeof window === 'undefined' || !isFirebaseConfigured()) {
    return () => {};
  }

  let hasNewOverrides = false;

  const unsubscribeNew = onSnapshot(
    contentOverridesRef,
    (snapshot) => {
      const data = snapshot.exists() ? snapshot.data() : {};
      const overrides = data.overrides || {};
      hasNewOverrides = Object.keys(overrides).length > 0;
      onData(overrides);
    },
    (error) => {
      onError?.(error);
    },
  );

  const unsubscribeLegacy = onSnapshot(
    legacyContentOverridesRef,
    (snapshot) => {
      if (!snapshot.exists() || hasNewOverrides) {
        return;
      }

      const data = snapshot.data();
      onData(data.overrides || {});
    },
    (error) => {
      onError?.(error);
    },
  );

  return () => {
    unsubscribeNew();
    unsubscribeLegacy();
  };
};
