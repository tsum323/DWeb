import { briefQuestions, contactMethods, type ContactMethodId } from '../content/brief';

/** Ответ на один вопрос: выбранные варианты и текст «своими словами». */
export type Answer = { choices: string[]; text: string };

export type BriefState = {
  answers: Record<string, Answer>;
  contact: { name: string; method: ContactMethodId; value: string; comment: string };
};

export const emptyAnswer: Answer = { choices: [], text: '' };

export const initialBrief: BriefState = {
  answers: {},
  contact: { name: '', method: 'telegram', value: '', comment: '' },
};

/** Ограничения длины полей — сообщение должно уместиться в Telegram. */
export const limits = { own: 400, name: 80, value: 120, comment: 1000 } as const;

export function isAnswered(answer: Answer | undefined) {
  return Boolean(answer && (answer.choices.length > 0 || answer.text.trim()));
}

/** Проверка контакта. Возвращает текст ошибки или undefined. */
export function contactError(method: ContactMethodId, value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Укажите, как с вами связаться';
  if (method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Похоже, в адресе почты опечатка';
  if ((method === 'phone' || method === 'whatsapp') && v.replace(/\D/g, '').length < 10)
    return 'В номере телефона должно быть не меньше 10 цифр';
  if (method === 'telegram' && v.replace(/^@/, '').length < 3)
    return 'Укажите ник в Telegram или номер телефона';
  return undefined;
}

/** Текст заявки: одинаковый для Telegram и для копирования. */
export function formatBrief(state: BriefState) {
  const lines = ['Заявка с сайта DWeb', ''];

  briefQuestions.forEach((q, i) => {
    const a = state.answers[q.id];
    lines.push(`${i + 1}. ${q.short}`);
    if (!isAnswered(a)) {
      lines.push('— пропущено');
    } else {
      for (const c of a!.choices) lines.push(`— ${c}`);
      if (a!.text.trim()) lines.push(`— ${a!.choices.length ? 'Своими словами: ' : ''}${a!.text.trim()}`);
    }
    lines.push('');
  });

  const { name, method, value, comment } = state.contact;
  const methodLabel = contactMethods.find((m) => m.id === method)?.label ?? method;
  lines.push('Контакт');
  if (name.trim()) lines.push(`Имя: ${name.trim()}`);
  lines.push(`${methodLabel}: ${value.trim()}`);
  if (comment.trim()) lines.push('', 'Комментарий', comment.trim());

  return lines.join('\n');
}

/** Отправка через посредника (Cloudflare Worker). Бросает ошибку, если не получилось. */
export async function sendBrief(endpoint: string, text: string, trap: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      // text/plain — «простой» запрос: браузеру не нужна предварительная проверка CORS.
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ text, website: trap }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Ответ сервера: ${response.status}`);
  } finally {
    clearTimeout(timer);
  }
}

/* Черновик в браузере посетителя: если страница обновится, ответы не пропадут.
   Хранилище может быть недоступно (приватный режим) — тогда просто работаем без него. */
const DRAFT_KEY = 'dweb-brief-draft';

export function loadDraft(): { state: BriefState; step: number } | undefined {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return undefined;
    const draft = JSON.parse(raw) as { state: BriefState; step: number };
    if (!draft?.state?.answers || !draft.state.contact) return undefined;
    return { state: { ...initialBrief, ...draft.state }, step: Number(draft.step) || 0 };
  } catch {
    return undefined;
  }
}

export function saveDraft(state: BriefState, step: number) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ state, step }));
  } catch {
    /* хранилище недоступно */
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* хранилище недоступно */
  }
}
