import { readFileSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCzeWgBvl0dn_3GXBli1kqaX8i8hPxq-RU',
  authDomain: 'tiles-survive--guide.firebaseapp.com',
  projectId: 'tiles-survive--guide',
  storageBucket: 'tiles-survive--guide.firebasestorage.app',
  messagingSenderId: '28545490896',
  appId: '1:28545490896:web:97e82ffbbc1d13b59fe3d5',
  measurementId: 'G-K5RYZ724H5',
};

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), '..');

function loadDotEnv(filePath) {
  let content = '';
  try {
    content = readFileSync(filePath, 'utf8');
  } catch {
    return;
  }

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const separatorIndex = trimmed.indexOf('=');
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && !process.env[key]) process.env[key] = value;
  }
}

loadDotEnv(path.join(projectRoot, '.env'));
loadDotEnv(path.join(projectRoot, '.env.local'));

const r2Config = {
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET || 'tiles-survive-guide-assets',
  publicUrl: (process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL || 'https://pub-12686d91087b4996871337b307ef7e9d.r2.dev').replace(/\/+$/, ''),
};

const missingKeys = Object.entries(r2Config).filter(([, value]) => !value).map(([key]) => key);
if (missingKeys.length > 0) {
  throw new Error(`Missing R2 config: ${missingKeys.join(', ')}. Add these values to .env.local first.`);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});

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
const toPublicUrl = (storagePath) => `${r2Config.publicUrl}/${storagePath.split('/').map(encodeURIComponent).join('/')}`;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(fullPath));
    else if (entry.isFile() && isImageFile(fullPath)) files.push(fullPath);
  }

  return files;
}

async function uploadFile(localPath, storagePath) {
  const body = await readFile(localPath);
  const extension = path.extname(localPath).toLowerCase();
  const contentType = contentTypes[extension] || 'application/octet-stream';

  await s3.send(new PutObjectCommand({
    Bucket: r2Config.bucket,
    Key: storagePath,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));

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
    if (!current || extension === '.jpeg' || extension === '.jpg') bestHeroFiles.set(slug, file);
  }

  const heroImagesBySlug = {};
  for (const [slug, file] of [...bestHeroFiles.entries()].sort(([first], [second]) => first.localeCompare(second))) {
    const fileName = `${slug}${path.extname(file).toLowerCase()}`;
    const storagePath = `heroes/${fileName}`;
    await uploadFile(file, storagePath);
    heroImagesBySlug[slug] = { src: toPublicUrl(storagePath) };
    if (slug === 'layla') heroImagesBySlug.leyla = { src: toPublicUrl(storagePath) };
  }

  await setDoc(doc(db, 'assets', 'heroImages'), {
    heroImagesBySlug,
    r2PublicUrl: r2Config.publicUrl,
    assetsUpdatedAt: serverTimestamp(),
  }, { merge: true });

  console.log(`updated Firestore assets/heroImages with ${Object.keys(heroImagesBySlug).length} R2 URLs`);
}

async function main() {
  console.log(`Using R2 bucket: ${r2Config.bucket}`);
  console.log(`Using R2 public URL: ${r2Config.publicUrl}`);
  await uploadHeroImages();
  await uploadDirectory(path.join(projectRoot, 'src', 'assets', 'brand'), 'brand');
  await uploadDirectory(path.join(projectRoot, 'src', 'assets', 'images'), 'images');
  await uploadDirectory(path.join(projectRoot, 'public', 'flags'), 'flags');
  await uploadDirectory(path.join(projectRoot, 'public', 'heroes'), 'heroes');
  await uploadDirectory(path.join(projectRoot, 'public', 'screenshots'), 'screenshots');
  console.log('R2 asset upload finished.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});