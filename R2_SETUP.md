# Cloudflare R2 asset setup

R2 bucket:

```text
tiles-survive-guide-assets
```

Public URL:

```text
https://pub-12686d91087b4996871337b307ef7e9d.r2.dev
```

The app can now load images from R2.

Supported image values in Firestore:

```text
https://pub-12686d91087b4996871337b307ef7e9d.r2.dev/heroes/nikola.jpeg
r2://heroes/nikola.jpeg
/heroes/nikola-skills/electric-surge.webp
```

When `VITE_R2_ASSETS=true`, local public paths like `/heroes/...`, `/flags/...`, `/screenshots/...` and `/images/...` are redirected to R2.

## Upload local images to R2

Create `.env.local` with:

```env
VITE_R2_ASSETS=true
VITE_R2_PUBLIC_URL=https://pub-12686d91087b4996871337b307ef7e9d.r2.dev
R2_PUBLIC_URL=https://pub-12686d91087b4996871337b307ef7e9d.r2.dev
R2_BUCKET=tiles-survive-guide-assets
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
```

Then run:

```bash
npm run seed:r2-assets
```

The script uploads brand images, hero images, flags, skill images and screenshots. It also updates Firestore `siteContent/app.heroImagesBySlug` to public R2 URLs.