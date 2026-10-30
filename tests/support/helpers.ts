import type { Page } from '@playwright/test';

/** Страницы сайта, которые проверяются во всех наборах. Пути — от базового /DWeb/. */
export const pages = [
  { name: 'главная', path: '' },
  { name: 'проекты', path: 'work/' },
  { name: 'кейс TEHNIKA', path: 'work/tehnika/' },
  { name: 'кейс Personal Dashboard', path: 'work/dashboard/' },
  { name: 'кейс Brass', path: 'work/brass/' },
  { name: 'кейс Трейдинг', path: 'work/trading/' },
  { name: 'кейс Суд идей', path: 'work/sud-idei/' },
  { name: 'кейс Городок', path: 'work/gorodok/' },
  { name: 'анкета', path: 'brief/', images: false },
  { name: 'политика', path: 'privacy/', images: false },
] as const;

/** Собирает ошибки страницы и консоли. Ответ 404 для страницы «не найдено» ожидаем. */
export function collectErrors(page: Page, { allow404 = false } = {}) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (allow404 && m.text().includes('404')) return;
    errors.push(m.text());
  });
  return errors;
}

/** Медленно прокручивает страницу до конца — срабатывают анимации и ленивые картинки. */
export async function scrollThrough(page: Page, step = 400) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(1500);
}

/** Сколько анимируемых элементов сейчас невидимы (прозрачность или visibility, включая предков). */
export function hiddenRevealCount(page: Page) {
  return page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter((el) => {
        for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
          const s = getComputedStyle(n);
          if (s.visibility === 'hidden' || Number(s.opacity) < 0.05) return true;
        }
        return false;
      }).length,
  );
}

/** Насколько страница шире окна (горизонтальная прокрутка). 0 — прокрутки нет. */
export function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}
