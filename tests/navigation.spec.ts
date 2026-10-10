import { expect, test } from '@playwright/test';
import { collectErrors } from './support/helpers';

/* Навигация: меню, шапка, переходы между страницами, клавиатура. */

test('телефон: меню открывается, закрывается по Esc и ведёт к разделу', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop', 'меню — только на узких экранах');
  await page.goto('');
  const dialog = page.getByRole('dialog', { name: 'Меню' });

  await page.getByRole('button', { name: 'Меню' }).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.getByRole('button', { name: 'Меню' }).click();
  await dialog.getByRole('link', { name: /Контакт/ }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#contact')).toBeInViewport();
});

test('десктоп: ссылки шапки ведут к разделам и с главной, и со страницы кейса', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'навигация в шапке — на широких экранах');
  const errors = collectErrors(page);
  const nav = page.getByRole('navigation', { name: 'Основная навигация' });

  await page.goto('work/peaky/');
  for (const [label, id] of [
    ['Работы', 'work'],
    ['Услуги', 'services'],
    ['Подход', 'approach'],
    ['Контакт', 'contact'],
  ] as const) {
    await nav.getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`/DWeb/#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
  expect(errors).toEqual([]);
});

test('переход на кейс: адрес, заголовок вкладки, страница сверху', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('');
  const link = page.getByRole('link', { name: 'Смотреть кейс' }).first();
  await link.scrollIntoViewIfNeeded();
  await link.click();

  await expect(page).toHaveURL(/\/DWeb\/work\/peaky$/);
  await expect(page).toHaveTitle(/^Peaky Barbers/);
  await expect(page.locator('h1')).toHaveText('Peaky Barbers');
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  await page.goBack();
  await expect(page).toHaveTitle(/^DWeb/);
  expect(errors).toEqual([]);
});

test('шапка прячется при прокрутке вниз, возвращается вверх и меняет цвет над светлым', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'поведение шапки одинаково на всех экранах');
  await page.goto('');
  await page.waitForTimeout(500);
  const header = page.locator('header').first();

  await page.mouse.wheel(0, 900);
  await expect(header).toHaveAttribute('data-hidden', 'true');
  await page.mouse.wheel(0, -300);
  await expect(header).toHaveAttribute('data-hidden', 'false');

  await page.evaluate(() => window.scrollTo(0, document.getElementById('work')!.offsetTop + 60));
  await expect(header).toHaveAttribute('data-surface', 'light');
});

test('клавиатура: первый Tab — «Перейти к содержимому», G включает разметку', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'клавиатура — десктоп');
  await page.goto('');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveText('Перейти к содержимому');

  await page.keyboard.press('g');
  await expect(page.locator('html')).toHaveAttribute('data-grid', 'on');
  await expect(page.getByRole('button', { name: /Разметка/ })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('data-grid', 'off');
});
