import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { pages } from './support/helpers';

/* Доступность: автоматический аудит axe-core по WCAG 2.2 AA и лучшим практикам. */

const axePath = new URL('../node_modules/axe-core/axe.min.js', import.meta.url);

for (const p of [...pages, { name: 'страница 404', path: 'такой-страницы-нет' }]) {
  test(`${p.name}: нет нарушений доступности`, async ({ browser }, info) => {
    // Без анимаций: аудит контраста видит итоговое состояние страницы.
    const context = await browser.newContext({ ...info.project.use, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(`/DWeb/${p.path}`, { waitUntil: 'networkidle' });
    await page.addScriptTag({ content: await readFile(axePath, 'utf8') });

    const violations = await page.evaluate(async () => {
      // @ts-expect-error — axe появляется в окне после addScriptTag
      const result = await window.axe.run(document, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
      });
      return result.violations.map(
        (v: { id: string; help: string; nodes: { target: string[] }[] }) =>
          `${v.id}: ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
      );
    });
    expect(violations).toEqual([]);
    await context.close();
  });
}
