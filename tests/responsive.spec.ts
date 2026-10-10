import { expect, test } from '@playwright/test';
import { collectErrors, horizontalOverflow, pages, scrollThrough } from './support/helpers';

/* Адаптивность: шесть ширин от самого узкого телефона до широкого монитора.
   Размеры задаются вручную, поэтому набор запускается один раз, в проекте desktop. */
test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'ширины задаются вручную'));

const widths = [320, 375, 768, 1024, 1440, 1920];

for (const p of pages) {
  for (const width of widths) {
    test(`${p.name} @${width}px: нет горизонтальной прокрутки, обрезанных заголовков и ошибок`, async ({
      page,
    }) => {
      const errors = collectErrors(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(p.path);
      await scrollThrough(page, 600);

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);

      // Заголовок не должен вылезать за свой блок (длинные русские слова на узких экранах).
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll('h1, h2, h3')]
          // Заголовки только для экранных дикторов намеренно сжаты до 1 px — их не проверяем.
          .filter((h) => !h.classList.contains('visually-hidden'))
          .filter((h) => h.scrollWidth > h.clientWidth + 1)
          .map((h) => h.textContent?.slice(0, 40)),
      );
      expect(clipped).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}
