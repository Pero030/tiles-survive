import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase.js';

export const getPublicAssetDataUrl = async (url) => {
  const getPublicAssetDataUrlFunction = httpsCallable(functions, 'getPublicAssetDataUrl');
  const result = await getPublicAssetDataUrlFunction({ url });
  const dataUrl = String(result.data?.dataUrl || '');

  if (!dataUrl.startsWith('data:image/')) {
    throw new Error('Image could not be prepared for PNG export.');
  }

  return dataUrl;
};