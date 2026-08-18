# Firebase data and image setup

The app is now Firebase-first:

- Firestore can provide guide texts, FAQ, hero data, patch notes, translations and admin overrides.
- Firebase Storage can provide images through `firebase://path/to/file.png` or `gs://bucket/path/to/file.png`.
- Local files still remain as fallback so the site does not become blank while Firebase is empty or blocked.

## Upload images to Firebase Storage

1. In Firebase Console, enable Storage for the project.
2. Make sure the Storage bucket matches `.env.example` or set `FIREBASE_STORAGE_BUCKET` before running the upload.
3. Allow temporary write access while seeding, then lock it down again.
4. Run:

```bash
npm run seed:firebase-assets
```

The script uploads hero images, brand images, flags, public hero skill images and screenshots. It also updates `siteContent/app.heroImagesBySlug` in Firestore so hero cards can load from Firebase Storage.

## Use Firebase images in the app

Use these image paths in Firestore:

```text
firebase://heroes/nikola.jpeg
firebase://flags/en.png
firebase://screenshots/world-map.png
```

The app converts those paths into Firebase Storage download URLs automatically.

## Remove local fallback later

Only after Firestore and Storage contain everything, set:

```env
VITE_FIREBASE_ONLY=true
VITE_FIREBASE_STORAGE_ASSETS=true
```

Then test the site. After that works, local text/image fallback files can be removed step by step.