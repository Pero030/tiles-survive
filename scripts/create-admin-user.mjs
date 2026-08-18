import { initializeApp } from 'firebase/app';
import { arrayUnion, doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCzeWgBvl0dn_3GXBli1kqaX8i8hPxq-RU',
  authDomain: 'tiles-survive--guide.firebaseapp.com',
  projectId: 'tiles-survive--guide',
  storageBucket: 'tiles-survive--guide.firebasestorage.app',
  messagingSenderId: '28545490896',
  appId: '1:28545490896:web:97e82ffbbc1d13b59fe3d5',
  measurementId: 'G-K5RYZ724H5',
};

const args = process.argv.slice(2);
const email = args.find((arg) => !arg.startsWith('--'))?.trim().toLowerCase();
const uid = args.find((arg) => arg.startsWith('--uid='))?.slice('--uid='.length).trim();

if (!email) {
  console.error('Usage: npm run admin:create -- admin@example.com');
  console.error('Optional: npm run admin:create -- admin@example.com --uid=FIREBASE_AUTH_UID');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const documentIds = Array.from(new Set([email, uid].filter(Boolean)));

await setDoc(doc(db, 'admin', 'access'), {
  active: true,
  emails: arrayUnion(email),
  updatedAt: serverTimestamp(),
  updatedBy: 'local-admin-bootstrap',
}, { merge: true });

console.log(`Admin email saved: admin/access emails -> ${email}`);

for (const id of documentIds) {
  await setDoc(doc(db, 'adminUsers', id), {
    active: true,
    role: 'admin',
    email,
    updatedAt: serverTimestamp(),
    updatedBy: 'local-admin-bootstrap',
  }, { merge: true });

  console.log(`Admin document saved: adminUsers/${id}`);
}

console.log('Done. You can now sign in at /secret-admin.');
process.exit(0);