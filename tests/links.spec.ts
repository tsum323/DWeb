import { expect, test } from '@playwright/test';
import { pages } from './support/helpers';

/* Ссылки: все внутренние открываются, якоря ведут на существующие разделы,
   внешние открываются в новой вкладке безопасно. */
test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'не зависит от экрана'));

test('все ссылки на всех страницах рабочие', async ({ page, request }) => {
  const origin = 'http://localhost:4174';
  const checked = new Set<string>();
  const problems: string[] = [];

  for (const p of pages) {
    await page.goto(p.path);
    const links = await page.locator('a[href]').evaluateAll((as) =>
      as.map((a) => ({
        href: (a as HTMLAnchorElement).href,
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel') ?? '',
        text: a.textContent?.trim().slice(0, 30),
      })),
    );

    for (const link of links) {
      const url = new URL(link.href);
      if (url.origin === origin) {
        const key = url.pathname;
        if (!checked.has(key)) {
          checked.add(key);
          const status = (await request.get(`${origin}${url.pathname}`)).status();
          if (status !== 200) problems.push(`${p.name}: «${link.text}» → ${url.pathname} (${status})`);
        }
        // Якорь должен вести на существующий раздел той страницы, куда ведёт ссылка.
        if (url.hash) {
          const targetPage = url.pathname.replace('/DWeb/', '');
          const html = await (await request.get(targetPage || '.')).text();
          if (!html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) {
            problems.push(`${p.name}: «${link.text}» → якорь ${url.hash} не найден`);
          }
        }
      } else if (url.protocol.startsWith('http')) {
        if (link.target !== '_blank' || !link.rel.includes('noopener')) {
          problems.push(`${p.name}: внешняя ссылка ${link.href} без target="_blank" rel="noopener"`);
        }
      }
    }
  }

  expect(problems).toEqual([]);
  expect(checked.size).toBeGreaterThan(1);
});
