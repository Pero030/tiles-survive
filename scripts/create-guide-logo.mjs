import { readFileSync } from 'node:fs';
import { writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';

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
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');
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
  publicUrl: (process.env.R2_PUBLIC_URL || process.env.VITE_R2_PUBLIC_URL || '').replace(/\/+$/, ''),
};

const missingKeys = Object.entries(r2Config).filter(([, value]) => !value).map(([key]) => key);
if (missingKeys.length) throw new Error(`Missing R2 config: ${missingKeys.join(', ')}`);

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});

const sourceUrl = `${r2Config.publicUrl}/brand/tiles-survive-logo.png`;
const response = await fetch(sourceUrl, { cache: 'no-store' });
if (!response.ok) throw new Error(`Could not download logo: ${response.status}`);
const logoBuffer = Buffer.from(await response.arrayBuffer());
const metadata = await sharp(logoBuffer).metadata();
const sourceWidth = metadata.width || 570;
const sourceHeight = metadata.height || 203;

const guideWidth = Math.round(sourceWidth * 0.72);
const outputWidth = sourceWidth + guideWidth;
const outputHeight = sourceHeight + 8;
const fontSize = Math.round(sourceHeight * 0.39);
const x = Math.round(sourceWidth - sourceWidth * 0.005);
const y = Math.round(sourceHeight * 0.74);
const shineY = y - Math.round(fontSize * 0.48);

const guideSvg = Buffer.from(`
<svg width="${outputWidth}" height="${outputHeight}" viewBox="0 0 ${outputWidth} ${outputHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="guideFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff17a"/>
      <stop offset="0.4" stop-color="#ffbf49"/>
      <stop offset="0.72" stop-color="#fb8730"/>
      <stop offset="1" stop-color="#ef5d1f"/>
    </linearGradient>
    <linearGradient id="guideHighlight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fffde7" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#fffde7" stop-opacity="0"/>
    </linearGradient>
    <filter id="logoShadow" x="-30%" y="-50%" width="180%" height="210%">
      <feDropShadow dx="0" dy="11" stdDeviation="0" flood-color="#5d526f" flood-opacity="0.95"/>
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#1f1928" flood-opacity="0.34"/>
    </filter>
  </defs>
  <g filter="url(#logoShadow)" transform="rotate(-1 ${x + guideWidth / 2} ${sourceHeight / 2})">
    <text x="${x}" y="${y}" font-family="Cooper Black, Cooper Std Black, Arial Black, Arial, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-2" paint-order="stroke fill" stroke-linejoin="round" stroke-linecap="round" stroke="#f4eed8" stroke-width="25" fill="none" textLength="${Math.round(guideWidth * 0.88)}" lengthAdjust="spacingAndGlyphs">GUIDE</text>
    <text x="${x}" y="${y}" font-family="Cooper Black, Cooper Std Black, Arial Black, Arial, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-2" paint-order="stroke fill" stroke-linejoin="round" stroke-linecap="round" stroke="#b35425" stroke-width="13" fill="url(#guideFill)" textLength="${Math.round(guideWidth * 0.88)}" lengthAdjust="spacingAndGlyphs">GUIDE</text>
    <text x="${x + 8}" y="${shineY}" font-family="Cooper Black, Cooper Std Black, Arial Black, Arial, sans-serif" font-size="${Math.round(fontSize * 0.33)}" font-weight="900" letter-spacing="-2" fill="url(#guideHighlight)" opacity="0.85" textLength="${Math.round(guideWidth * 0.88)}" lengthAdjust="spacingAndGlyphs">GUIDE</text>
  </g>
</svg>`);

const output = await sharp({
  create: {
    width: outputWidth,
    height: outputHeight,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: logoBuffer, left: 0, top: 0 },
    { input: guideSvg, left: 0, top: 0 },
  ])
  .png()
  .toBuffer();

const outputPath = path.join(projectRoot, 'tiles-survive-guide-logo.preview.png');
await writeFile(outputPath, output);

await s3.send(new PutObjectCommand({
  Bucket: r2Config.bucket,
  Key: 'brand/tiles-survive-guide-logo.png',
  Body: output,
  ContentType: 'image/png',
  CacheControl: 'public, max-age=60',
}));

console.log(`Created ${outputWidth}x${outputHeight} logo.`);
console.log(`${r2Config.publicUrl}/brand/tiles-survive-guide-logo.png`);
console.log(outputPath);