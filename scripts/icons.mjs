/*
 * Иконки сайта из public/favicon.svg:
 *   apple-touch-icon.png (180) — экран «Домой» на iPhone и iPad;
 *   icon-192.png, icon-512.png — для манифеста (site.webmanifest).
 * Запуск: npm run icons (нужен только при смене логотипа).
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const pub = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const svg = await readFile(path.join(pub, 'favicon.svg'));

for (const [name, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await sharp(svg, { density: 72 * Math.ceil(size / 32) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, name));
  console.log(`  public/${name}`);
}
