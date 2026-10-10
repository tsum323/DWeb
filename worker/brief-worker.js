/*
 * Посредник между анкетой на сайте и Telegram (Cloudflare Worker).
 *
 * Зачем: ключ бота нельзя хранить в коде сайта — его увидит любой посетитель.
 * Ключ лежит в настройках Worker'а, а сайт отправляет сюда только текст заявки.
 *
 * Настройки (Cloudflare → Worker → Settings → Variables and Secrets):
 *   BOT_TOKEN        — ключ бота от @BotFather (тип Secret);
 *   CHAT_ID          — ваш номер чата в Telegram;
 *   ALLOWED_ORIGINS  — необязательно: адреса сайтов через запятую
 *                      (по умолчанию https://tsum323.github.io).
 *
 * Пошаговая инструкция — docs/BRIEF_TELEGRAM.md.
 */

const MAX_BODY = 16_000; // байт
const MAX_TEXT = 8_000; // символов
const CHUNK = 4_000; // Telegram принимает до 4096 символов в одном сообщении
const RATE = { limit: 5, windowMs: 10 * 60 * 1000 }; // не больше 5 заявок за 10 минут с одного адреса

// Счётчик отправок живёт в памяти Worker'а: защита «на скорую руку» от повторных нажатий
// и простого спама. Для серьёзной атаки есть Cloudflare Turnstile (см. инструкцию).
const hits = new Map();

function rateLimited(ip, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > RATE.limit;
}

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const json = (status, data, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });

/** Делит длинный текст на части по строкам, чтобы каждая влезла в одно сообщение. */
export function chunks(text, size = CHUNK) {
  const parts = [];
  let current = '';
  for (const line of text.split('\n')) {
    const piece = line.length > size ? line.match(new RegExp(`[\\s\\S]{1,${size}}`, 'g')) : [line];
    for (const p of piece) {
      if (current && current.length + p.length + 1 > size) {
        parts.push(current);
        current = '';
      }
      current = current ? `${current}\n${p}` : p;
    }
  }
  if (current) parts.push(current);
  return parts;
}

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS ?? 'https://tsum323.github.io')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const origin = request.headers.get('Origin') ?? '';
    if (!allowed.includes(origin)) return json(403, { ok: false, error: 'origin' });
    const headers = cors(origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return json(405, { ok: false, error: 'method' }, headers);
    if (!env.BOT_TOKEN || !env.CHAT_ID) return json(500, { ok: false, error: 'config' }, headers);

    const raw = await request.text();
    if (raw.length > MAX_BODY) return json(413, { ok: false, error: 'size' }, headers);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return json(400, { ok: false, error: 'json' }, headers);
    }

    // Поле-ловушка заполнено — это бот. Отвечаем «успешно», но ничего не отправляем.
    if (data?.website) return json(200, { ok: true }, headers);

    const text = typeof data?.text === 'string' ? data.text.trim() : '';
    if (text.length < 20 || text.length > MAX_TEXT) return json(400, { ok: false, error: 'text' }, headers);

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    if (rateLimited(ip)) return json(429, { ok: false, error: 'rate' }, headers);

    // Без parse_mode: текст уходит как есть, разметка из анкеты не исполняется.
    for (const part of chunks(text)) {
      const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.CHAT_ID, text: part, disable_web_page_preview: true }),
      });
      if (!response.ok) return json(502, { ok: false, error: 'telegram' }, headers);
    }

    return json(200, { ok: true }, headers);
  },
};
