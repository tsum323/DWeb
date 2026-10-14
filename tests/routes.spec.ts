import { expect, test } from '@playwright/test';
import { pages } from './support/helpers';

/* Маршруты, метаданные и файлы для поисковиков. Не зависят от размера экрана —
   проверяются один раз, в проекте desktop. */
test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'не зависит от экрана'));

const site = 'https://tsum323.github.io/DWeb';

for (const p of pages) {
  test(`${p.name}: открывается по прямой ссылке и содержит метаданные`, async ({ page }) => {
    const response = await page.goto(p.path);
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/DWeb/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${site}/${p.path}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      new RegExp(`^${site}/og/`),
    );
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');

    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(() => JSON.parse(jsonLd ?? '')).not.toThrow();
  });
}

test('адрес без слэша перенаправляется на адрес со слэшем', async ({ request }) => {
  const response = await request.get('work/brass', { maxRedirects: 0 });
  expect(response.status()).toBe(301);
  expect(response.headers().location).toBe('/DWeb/work/brass/');
});

test('неизвестный адрес: страница «не найдено» со статусом 404 и noindex', async ({ page }) => {
  const response = await page.goto('такой-страницы-нет');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('Такой страницы нет');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await page.getByRole('link', { name: 'На главную', exact: true }).click();
  await expect(page).toHaveURL(/\/DWeb\/$/);
});

test('несуществующий кейс показывает «не найдено»', async ({ page }) => {
  const response = await page.goto('work/unknown/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('Такой страницы нет');
});

test('sitemap.xml перечисляет все страницы, и все они открываются', async ({ request }) => {
  const xml = await (await request.get('sitemap.xml')).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
  expect(urls.length).toBeGreaterThanOrEqual(pages.length);
  for (const url of urls) {
    expect(url.startsWith(`${site}/`)).toBe(true);
    const local = url.slice(site.length + 1);
    expect((await request.get(local)).status(), url).toBe(200);
  }
});

test('картинки превью ссылок существуют и имеют размер 1200 × 630', async ({ page, request }) => {
  for (const p of pages) {
    await page.goto(p.path);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    const file = await request.get(og!.slice(site.length + 1));
    expect(file.status(), og!).toBe(200);
    const png = await file.body();
    // Ширина и высота PNG записаны в заголовке IHDR (байты 16–23).
    expect([png.readUInt32BE(16), png.readUInt32BE(20)], og!).toEqual([1200, 630]);
  }
});

test('иконки и манифест на месте', async ({ page, request }) => {
  await page.goto('');
  for (const selector of ['link[rel="icon"]', 'link[rel="apple-touch-icon"]', 'link[rel="manifest"]']) {
    const href = await page.locator(selector).getAttribute('href');
    expect((await request.get(href!.replace('/DWeb/', ''))).status(), selector).toBe(200);
  }
});
