/*
 * Картинки для превью ссылок (Open Graph), 1200 × 630:
 * public/og/home.png и public/og/<slug>.png для каждого проекта.
 *
 * Запуск: npm run og
 * Нужен только при изменении заголовка сайта или добавлении проекта —
 * готовые PNG хранятся в репозитории, обычная сборка их не пересоздаёт.
 */
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'og');

const dataUri = async (file, type) =>
  `data:${type};base64,${(await readFile(path.join(root, file))).toString('base64')}`;

// Данные проектов берём из исходников через Vite — тот же код, что и на сайте.
const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true } });
const { projects } = await vite.ssrLoadModule('/src/content/projects/index.ts');
await vite.close();

const fonts = {
  sans: await dataUri(
    'node_modules/@fontsource-variable/geologica/files/geologica-cyrillic-shrp-normal.woff2',
    'font/woff2',
  ),
  sansLatin: await dataUri(
    'node_modules/@fontsource-variable/geologica/files/geologica-latin-shrp-normal.woff2',
    'font/woff2',
  ),
  mono: await dataUri(
    'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-cyrillic-wght-normal.woff2',
    'font/woff2',
  ),
  monoLatin: await dataUri(
    'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
    'font/woff2',
  ),
};

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function page({ label, title, text, shot, footer }) {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>
@font-face{font-family:G;src:url(${fonts.sans}) format('woff2');unicode-range:U+0400-045F}
@font-face{font-family:G;src:url(${fonts.sansLatin}) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:M;src:url(${fonts.mono}) format('woff2');unicode-range:U+0400-045F}
@font-face{font-family:M;src:url(${fonts.monoLatin}) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#17191B;color:#F2F0E9;font-family:G,sans-serif;position:relative}
.grid{position:absolute;inset:0 56px;display:grid;grid-template-columns:repeat(12,1fr);gap:24px}
.grid span{border-inline:1px solid #22262A}
.wrap{position:absolute;inset:56px;display:flex;flex-direction:column;justify-content:space-between}
.mono{font-family:M,monospace;font-size:18px;letter-spacing:.06em;text-transform:uppercase;color:#858B91}
.mono b{color:#B9F66B;font-weight:400}
h1{font-size:${shot ? 92 : 84}px;line-height:.95;letter-spacing:-.035em;font-weight:650;font-variation-settings:'SHRP' 70;max-width:${shot ? 560 : 900}px}
p{margin-top:24px;font-size:26px;line-height:1.35;color:#858B91;max-width:${shot ? 520 : 760}px;font-weight:350}
.foot{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid #2C3034;padding-top:20px}
.logo{font-size:34px;letter-spacing:-.04em;display:flex;align-items:baseline}
.logo b{font-weight:750;font-variation-settings:'SHRP' 100}.logo i{font-style:normal;font-weight:300}
.logo s{width:9px;height:9px;background:#B9F66B;margin-left:4px;text-decoration:none}
.shot{position:absolute;left:660px;top:112px;width:640px;height:376px;overflow:hidden;border:1px solid #3A3F44;background:#17191B}
.shot .bar{display:flex;justify-content:space-between;padding:8px 12px;border-bottom:1px solid #3A3F44;font-family:M;font-size:14px;letter-spacing:.06em;color:#858B91;text-transform:uppercase}
.shot .bar b{color:#B9F66B;font-weight:400}.shot img{display:block;width:100%}
</style></head><body>
<div class="grid">${'<span></span>'.repeat(12)}</div>
${shot ? `<figure class="shot"><div class="bar"><span>${escape(shot.label)}</span><b>${shot.viewport} px</b></div><img src="${shot.src}"></figure>` : ''}
<div class="wrap">
  <div class="mono">${label}</div>
  <div><h1>${title}</h1>${text ? `<p>${escape(text)}</p>` : ''}</div>
  <div class="foot"><div class="logo"><b>DW</b><i>eb</i><s></s></div><div class="mono">${footer}</div></div>
</div></body></html>`;
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });

async function render(name, html) {
  await tab.setContent(html, { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: path.join(outDir, `${name}.png`) });
  console.log(`  public/og/${name}.png`);
}

console.log('Картинки превью:');
await render(
  'home',
  page({
    label: 'DWeb <b>/</b> сайты и интерфейсы',
    title: 'Сайты для бизнеса&nbsp;— продуманные от&nbsp;сетки до&nbsp;кода',
    text: 'Проектирую и разрабатываю сайты для небольшого бизнеса: от структуры и дизайна до адаптивной вёрстки и запуска.',
    footer: 'Структура · дизайн · вёрстка',
  }),
);

for (const p of projects) {
  // Исходник скриншота (webp в полном размере) — путь берём из папки проекта.
  const src = await dataUri(`src/content/projects/${p.slug}/media/desktop-home.webp`, 'image/webp');
  await render(
    p.slug,
    page({
      label: `<b>Кейс</b> / ${escape(p.type)}`,
      title: escape(p.title),
      text: p.summary,
      shot: { src, label: p.media.cover.desktop.label, viewport: p.media.cover.desktop.viewport },
      footer: escape(p.stack.join(' · ')),
    }),
  );
}

await browser.close();
