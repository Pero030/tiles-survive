import { getFirebaseStorageUrl } from '../services/firebase.js';

const externalAssetPattern = /^(https?:|data:|blob:)/i;
const firebaseAssetPrefixes = ['/heroes/', '/images/', '/flags/', '/screenshots/', '/patches/', '/guides/'];
const defaultR2PublicBaseUrl = 'https://pub-12686d91087b4996871337b307ef7e9d.r2.dev';
const preferFirebaseStorageAssets = import.meta.env.VITE_FIREBASE_STORAGE_ASSETS === 'true';
const preferR2Assets = import.meta.env.VITE_R2_ASSETS !== 'false';
const r2PublicBaseUrl = (import.meta.env.VITE_R2_PUBLIC_URL || defaultR2PublicBaseUrl).replace(/\/+$/, '');

const toR2Url = (source) => {
  if (!source || !r2PublicBaseUrl) return source;
  const storagePath = source.startsWith('r2://') ? source.slice('r2://'.length) : source.replace(/^\/+/, '');
  return `${r2PublicBaseUrl}/${storagePath.split('/').map(encodeURIComponent).join('/')}`;
};

export function assetPath(path) {
  if (!path || externalAssetPattern.test(path)) return path;
  if (path.startsWith('r2://')) return toR2Url(path);

  if (preferR2Assets && firebaseAssetPrefixes.some((prefix) => path.startsWith(prefix))) {
    return toR2Url(path);
  }

  if (path.startsWith('firebase://') || path.startsWith('gs://')) return getFirebaseStorageUrl(path);

  if (preferFirebaseStorageAssets && firebaseAssetPrefixes.some((prefix) => path.startsWith(prefix))) {
    return getFirebaseStorageUrl(`firebase://${path.replace(/^\/+/, '')}`);
  }

  if (!path.startsWith('/') || path.startsWith(import.meta.env.BASE_URL)) return path;
  if (path.startsWith('/assets/') || path.startsWith('/src/')) return path;
  return `${import.meta.env.BASE_URL}${path.slice(1)}`;
}