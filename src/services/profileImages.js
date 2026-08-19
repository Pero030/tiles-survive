import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase.js';

export const uploadProfileImageToR2 = async ({ file, idToken }) => {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }

  const createProfileImageUpload = httpsCallable(functions, 'createProfileImageUpload');
  const uploadSession = await createProfileImageUpload({
    contentType: file.type,
    size: file.size,
  });
  const { uploadUrl, publicUrl } = uploadSession.data || {};

  if (!uploadUrl || !publicUrl) {
    throw new Error('Profile image upload could not be prepared.');
  }

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Profile image upload failed.');
  }

  return publicUrl;
};
