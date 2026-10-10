import { expect, test } from '@playwright/test';
import { collectErrors, hiddenRevealCount, pages, scrollThrough } from './support/helpers';

/* Анимации и их защиты: контент никогда не остаётся скрытым. */

for (const p of pages) {
  test(`${p.name}: после прокрутки скрытых элементов нет`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(p.path);
    await scrollThrough(page);
    expect(await hiddenRevealCount(page)).toBe(0);
    expect(errors).toEqual([]);
  });

  test(`${p.name}: «уменьшить движение» — всё видно сразу`, async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(`/DWeb/${p.path}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).not.toHaveClass(/motion-pending/);
    expect(await hiddenRevealCount(page)).toBe(0);
    await context.close();
  });

  test(`${p.name}: без JavaScript всё видно`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/DWeb/${p.path}`);
    expect(await hiddenRevealCount(page)).toBe(0);
    await context.close();
  });

  test(`${p.name}: если движок анимаций не загрузился, через 2,5 с всё видно`, async ({ page }) => {
    await page.route(/engine-[\w-]+\.js$/, (route) => route.abort());
    await page.goto(p.path);
    await page.waitForTimeout(3000);
    await scrollThrough(page);
    expect(await hiddenRevealCount(page)).toBe(0);
  });

  test(`${p.name}: высота заголовков после анимации не меняется`, async ({ page }) => {
    await page.goto(p.path, { waitUntil: 'networkidle' });
    const heights = () =>
      page.evaluate(() =>
        [...document.querySelectorAll('[data-reveal="lines"]')].map((el) =>
          Math.round(el.getBoundingClientRect().height),
        ),
      );
    const before = await heights();
    await scrollThrough(page);
    await page.waitForTimeout(1500);
    expect(await heights()).toEqual(before);
  });
}
