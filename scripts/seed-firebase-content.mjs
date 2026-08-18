import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { deleteApp, initializeApp } from 'firebase/app';
import { doc, getFirestore, writeBatch } from 'firebase/firestore';
import {
  faqItems,
  guideEntries,
  guideSections,
  heroClasses,
  heroImagesBySlug,
  metaFormations,
} from '../src/data/content.js';
import { fallbackFlagImages } from '../src/data/flagImages.js';
import { officialPatchFeedUrl, patchNotes } from '../src/data/patchNotes.js';
import { translations } from '../src/data/translations.js';

const loadEnvFile = (fileName) => {
  const envPath = resolve(process.cwd(), fileName);
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex < 0) return;
    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  });
};

loadEnvFile('.env.local');
loadEnvFile('.env');

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCzeWgBvl0dn_3GXBli1kqaX8i8hPxq-RU',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'tiles-survive--guide.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'tiles-survive--guide',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'tiles-survive--guide.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '28545490896',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:28545490896:web:97e82ffbbc1d13b59fe3d5',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-K5RYZ724H5',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cloneContent = (value) => JSON.parse(JSON.stringify(value || {}));
const getDocumentId = (item, index) => item.id || item.slug || item.version || String(index);

const queuedWrites = [];
const queueSet = (collectionName, id, data) => {
  queuedWrites.push({ collectionName, id, data: cloneContent(data) });
};

const queueCollection = (collectionName, items, getId = getDocumentId) => {
  items.forEach((item, index) => queueSet(collectionName, getId(item, index), item));
};

queueSet('appSettings', 'main', {
  officialPatchFeedUrl,
  contentVersion: 'firebase-v2',
  updatedAt: new Date().toISOString(),
});

queueSet('assets', 'heroImages', {
  heroImagesBySlug,
  updatedAt: new Date().toISOString(),
});

queueSet('assets', 'flagImages', {
  ...fallbackFlagImages,
  updatedAt: new Date().toISOString(),
});

queueCollection('guideSections', guideSections, (item, index) => item.id || String(index));
queueCollection('heroes', guideEntries.filter((entry) => entry.type === 'hero'), (item) => item.slug || item.id);
queueCollection('events', guideEntries.filter((entry) => entry.type === 'event'), (item) => item.slug || item.id);
queueCollection('villages', guideEntries.filter((entry) => entry.type === 'village'), (item) => item.slug || item.id);
queueCollection('alliance', guideEntries.filter((entry) => entry.type === 'alliance'), (item) => item.slug || item.id);
queueCollection('buildings', guideEntries.filter((entry) => entry.type === 'building'), (item) => item.slug || item.id);
queueCollection('worldMap', guideEntries.filter((entry) => entry.type === 'map'), (item) => item.slug || item.id);
queueCollection('tips', guideEntries.filter((entry) => entry.type === 'tip'), (item) => item.slug || item.id);
queueCollection('faqItems', faqItems, (item, index) => item.id || String(index));
queueCollection('patchNotes', patchNotes, (item, index) => item.id || item.version || String(index));
queueCollection('heroClasses', heroClasses, (item) => item.id);
queueCollection('metaFormations', metaFormations, (item) => item.id);

Object.entries(translations).forEach(([language, messages]) => {
  queueSet('translations', language, { language, messages });
});

for (let index = 0; index < queuedWrites.length; index += 450) {
  const batch = writeBatch(db);
  queuedWrites.slice(index, index + 450).forEach(({ collectionName, id, data }) => {
    batch.set(doc(db, collectionName, id), data, { merge: true });
  });
  await batch.commit();
}

console.log(`Seeded Firebase v2 content structure with ${queuedWrites.length} documents.`);
console.log('Collections: appSettings, assets/heroImages, assets/flagImages, guideSections, heroes, events, villages, alliance, buildings, worldMap, tips, faqItems, patchNotes, heroClasses, metaFormations, translations.');
await deleteApp(app);