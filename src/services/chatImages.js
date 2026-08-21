import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase.js';

export const uploadChatImageToR2 = async ({ file, roomId }) => {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }

  const createChatImageUpload = httpsCallable(functions, 'createChatImageUpload');
  const uploadSession = await createChatImageUpload({
    roomId,
    contentType: file.type,
    size: file.size,
  });
  const { uploadUrl, publicUrl } = uploadSession.data || {};

  if (!uploadUrl || !publicUrl) {
    throw new Error('Chat image upload could not be prepared.');
  }

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Chat image upload failed.');
  }

  return publicUrl;
};