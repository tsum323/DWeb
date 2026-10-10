/*
 * Сервер для тестов, который ведёт себя как GitHub Pages:
 *  — сайт доступен по адресу /DWeb/ (базовый путь из vite.config.ts);
 *  — папка без слэша → редирект 301 на адрес со слэшем;
 *  — папка → её index.html;
 *  — нет файла → 404.html со статусом 404;
 *  — текстовые файлы сжимаются gzip.
 * Запуск: node tests/support/pages-server.mjs [папка=dist] [порт=4174]
 */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = path.resolve(process.argv[2] ?? 'dist');
const port = Number(process.argv[3] ?? 4174);
const base = '/DWeb';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.webmanifest': 'application/manifest+json',
};

async function send(req, res, status, file) {
  let body = await readFile(file);
  const headers = { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' };
  if (
    /\.(html|js|css|svg|xml|webmanifest)$/.test(file) &&
    /gzip/.test(req.headers['accept-encoding'] ?? '')
  ) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
  }
  res.writeHead(status, headers);
  res.end(body);
}

http
  .createServer(async (req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!url.startsWith(base)) {
      res.writeHead(404);
      return res.end('outside base');
    }
    let file = path.join(dist, url.slice(base.length) || '/');
    if (!file.startsWith(dist)) {
      res.writeHead(400);
      return res.end();
    }
    try {
      const s = await stat(file);
      if (s.isDirectory()) {
        if (!url.endsWith('/')) {
          res.writeHead(301, { Location: `${url}/` });
          return res.end();
        }
        file = path.join(file, 'index.html');
      }
      await send(req, res, 200, file);
    } catch {
      await send(req, res, 404, path.join(dist, '404.html'));
    }
  })
  .listen(port, () => console.log(`Тестовый сервер: http://localhost:${port}${base}/`));
