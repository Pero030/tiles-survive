import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCzeWgBvl0dn_3GXBli1kqaX8i8hPxq-RU',
  authDomain: 'tiles-survive--guide.firebaseapp.com',
  projectId: 'tiles-survive--guide',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'tiles-survive--guide.firebasestorage.app',
  messagingSenderId: '28545490896',
  appId: '1:28545490896:web:97e82ffbbc1d13b59fe3d5',
  measurementId: 'G-K5RYZ724H5',
};

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), '..');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const contentTypes = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const toPosixPath = (value) => value.split(path.sep).join('/');
const isImageFile = (filePath) => imageExtensions.has(path.extname(filePath).toLowerCase());

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectFiles(fullPath));
    } else if (entry.isFile() && isImageFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function uploadFile(localPath, storagePath) {
  const bytes = await readFile(localPath);
  const extension = path.extname(localPath).toLowerCase();
  const contentType = contentTypes[extension] || 'application/octet-stream';

  await uploadBytes(ref(storage, storagePath), bytes, {
    contentType,
    cacheControl: 'public,max-age=31536000,immutable',
  });

  console.log(`uploaded ${storagePath}`);
}

async function uploadDirectory(localDirectory, storagePrefix) {
  const files = await collectFiles(localDirectory).catch(() => []);

  for (const file of files) {
    const relativePath = toPosixPath(path.relative(localDirectory, file));
    await uploadFile(file, `${storagePrefix}/${relativePath}`);
  }

  return files;
}

async function uploadHeroImages() {
  const heroDirectory = path.join(projectRoot, 'src', 'assets', 'heroes');
  const heroFiles = await collectFiles(heroDirectory).catch(() => []);
  const bestHeroFiles = new Map();

  for (const file of heroFiles) {
    const extension = path.extname(file).toLowerCase();
    const slug = path.basename(file, extension).toLowerCase();
    const current = bestHeroFiles.get(slug);

    if (!current || extension === '.jpeg' || extension === '.jpg') {
      bestHeroFiles.set(slug, file);
    }
  }

  const heroImagesBySlug = {};

  for (const [slug, file] of [...bestHeroFiles.entries()].sort(([first], [second]) => first.localeCompare(second))) {
    const fileName = `${slug}${path.extname(file).toLowerCase()}`;
    const storagePath = `heroes/${fileName}`;
    await uploadFile(file, storagePath);
    heroImagesBySlug[slug] = { src: `firebase://${storagePath}` };

    if (slug === 'layla') {
      heroImagesBySlug.leyla = { src: `firebase://${storagePath}` };
    }
  }

  await setDoc(doc(db, 'assets', 'heroImages'), {
    heroImagesBySlug,
    assetsUpdatedAt: serverTimestamp(),
  }, { merge: true });

  console.log(`updated Firestore assets/heroImages with ${Object.keys(heroImagesBySlug).length} entries`);
}

async function main() {
  console.log(`Using Firebase Storage bucket: `);
  await uploadHeroImages();
  await uploadDirectory(path.join(projectRoot, 'src', 'assets', 'brand'), 'brand');
  await uploadDirectory(path.join(projectRoot, 'src', 'assets', 'images'), 'images');
  await uploadDirectory(path.join(projectRoot, 'public', 'flags'), 'flags');
  await uploadDirectory(path.join(projectRoot, 'public', 'heroes'), 'heroes');
  await uploadDirectory(path.join(projectRoot, 'public', 'screenshots'), 'screenshots');
  console.log('Firebase asset upload finished.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
