import { expect, test } from '@playwright/test';
import { collectErrors } from './support/helpers';

/* Работы: короткий блок на главной, список всех проектов и переход к кейсу. */

test('на главной — не больше трёх карточек и переход ко всем проектам', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('');
  const cards = page.locator('#work article');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(3);

  await page
    .locator('#work')
    .getByRole('link', { name: /Все проекты/ })
    .click();
  await expect(page).toHaveURL(/\/DWeb\/work$/);
  await expect(page.locator('h1')).toHaveText('Проекты');
  expect(errors).toEqual([]);
});

test('страница «Проекты»: каждая карточка ведёт на свой кейс', async ({ page }) => {
  await page.goto('work/');
  const links = page.locator('main article h2 a');
  const total = await links.count();
  expect(total).toBeGreaterThanOrEqual(6);

  for (let i = 0; i < total; i++) {
    await page.goto('work/');
    const link = page.locator('main article h2 a').nth(i);
    const title = (await link.textContent())!.trim();
    await link.click();
    await expect(page).toHaveURL(/\/DWeb\/work\/[a-z-]+$/);
    await expect(page.locator('h1')).toHaveText(title);
  }
});
