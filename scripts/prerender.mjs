/*
 * Пререндер: превращает каждую страницу сайта в готовый HTML-файл.
 *
 * Зачем: GitHub Pages умеет отдавать только файлы. Без пререндера прямая ссылка
 * на /dweb/work/peaky вернула бы 404, а соцсети и поисковики не увидели бы
 * заголовок и описание страницы (они не выполняют JavaScript).
 *
 * Запускается автоматически в конце `npm run build`.
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, getMeta, prerenderPaths, absoluteUrl, site } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const assets = await readdir(path.join(dist, 'assets'));
const base = '/dweb/';

const escape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Предзагрузка основного шрифта: латиница и кириллица Geologica.
const preloads = assets
  .filter((f) => /^geologica-(latin|cyrillic)-shrp-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="${base}assets/${f}" as="font" type="font/woff2" crossorigin />`);

function head(meta, { canonical = true } = {}) {
  const url = absoluteUrl(meta.path);
  return [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    meta.noindex ? '<meta name="robots" content="noindex, nofollow" />' : '',
    canonical ? `<link rel="canonical" href="${url}" />` : '',
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:site_name" content="${site.name}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    canonical ? `<meta property="og:url" content="${url}" />` : '',
    '<meta name="twitter:card" content="summary_large_image" />',
    ...preloads,
  ]
    .filter(Boolean)
    .join('\n    ');
}

function page(urlPath, options) {
  return template
    .replace('<!--app-head-->', head(getMeta(urlPath), options))
    .replace('<!--app-html-->', render(urlPath));
}

const written = [];

for (const urlPath of prerenderPaths()) {
  const file = path.join(dist, urlPath, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, page(urlPath));
  written.push(path.relative(dist, file));
}

// 404.html — GitHub Pages отдаёт его для любого неизвестного адреса.
await writeFile(path.join(dist, '404.html'), page('/404', { canonical: false }));
written.push('404.html');

// Карта сайта для поисковиков.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${prerenderPaths()
  .map((p) => `  <url><loc>${absoluteUrl(p)}</loc></url>`)
  .join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
written.push('sitemap.xml');

await rm(ssrDir, { recursive: true, force: true });

console.log(`Пререндер: ${written.length} файлов`);
for (const f of written) console.log(`  dist/${f}`);
