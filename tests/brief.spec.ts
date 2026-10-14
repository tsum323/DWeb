import { expect, test } from '@playwright/test';
import { collectErrors } from './support/helpers';

/* Окно «Обсудить проект» и анкета /brief. */

test.describe('окно «Обсудить проект»', () => {
  test('открывается из шапки или меню, ведёт к анкете и закрывается', async ({ page, isMobile }) => {
    const errors = collectErrors(page);
    await page.goto('');

    if (isMobile) {
      await page.getByRole('button', { name: 'Меню' }).click();
      await page.getByRole('dialog', { name: 'Меню' }).getByRole('link', { name: 'Обсудить проект' }).click();
    } else {
      await page.getByRole('banner').getByRole('link', { name: 'Обсудить проект' }).click();
    }

    const dialog = page.getByRole('dialog', { name: 'Как удобнее начать?' });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\/DWeb\/$/); // окно, а не переход к блоку

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    await page.getByRole('main').getByRole('link', { name: 'Обсудить проект' }).first().click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: /Ответить на вопросы/ }).click();
    await expect(page).toHaveURL(/\/DWeb\/brief\/?$/);
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Расскажите\s+о\s+задаче/);
    expect(errors).toEqual([]);
  });

  test('на странице кейса кнопка тоже открывает окно', async ({ page }) => {
    await page.goto('work/brass/');
    await page.getByRole('main').getByRole('link', { name: 'Обсудить проект' }).last().click();
    await expect(page.getByRole('dialog', { name: 'Как удобнее начать?' })).toBeVisible();
    await expect(page).toHaveURL(/work\/brass\/$/);
  });

  test('без JavaScript кнопка ведёт к блоку «Контакт»', async ({ browser }, info) => {
    const context = await browser.newContext({ ...info.project.use, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/DWeb/');
    const href = await page.locator('main a[data-discuss]').first().getAttribute('href');
    expect(href).toBe('/DWeb/#contact');
    await expect(page.locator('#contact').getByRole('link', { name: /Ответить на вопросы/ })).toHaveAttribute(
      'href',
      '/DWeb/brief',
    );
    await context.close();
  });
});

test.describe('анкета', () => {
  test('проходится целиком: варианты, свои слова, пропуски, проверка контакта, правка', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('brief/');
    await expect(page.getByText('Вопрос 01 из 09')).toBeVisible();

    // 1 — один вариант + свои слова.
    await page.getByText('Красота и уход', { exact: false }).click();
    await page.getByLabel(/Своими словами/).fill('Барбершоп на две кресла');
    await page.getByRole('button', { name: 'Далее' }).click();

    // 2 — несколько вариантов; фокус переходит на новый вопрос.
    await expect(page.getByRole('heading', { name: 'Кто ваши клиенты?' })).toBeFocused();
    await page.getByText('Гости и туристы').click();
    await page.getByText('Жители района или города').click();
    await page.getByRole('button', { name: 'Далее' }).click();

    // 3–9 — пропускаем.
    for (let i = 3; i <= 9; i++) {
      await expect(page.getByText(`Вопрос 0${i} из 09`)).toBeVisible();
      await page.getByRole('button', { name: 'Пропустить' }).click();
    }

    // Контакт: без данных и согласия дальше не пускает.
    await expect(page.getByRole('heading', { name: 'Как с вами связаться?' })).toBeVisible();
    await page.getByRole('button', { name: 'Далее' }).click();
    await expect(page.getByText('Укажите, как с вами связаться')).toBeVisible();
    await expect(page.getByLabel('Ник или номер телефона')).toBeFocused();

    await page.getByText('Почта', { exact: true }).click();
    await page.getByLabel('Адрес почты').fill('не-почта');
    await page.getByRole('button', { name: 'Далее' }).click();
    await expect(page.getByText('Похоже, в адресе почты опечатка')).toBeVisible();

    await page.getByLabel('Адрес почты').fill('client@example.com');
    await page.getByRole('button', { name: 'Далее' }).click();
    await expect(page.getByText('Без согласия я не смогу получить заявку')).toBeVisible();
    await page.getByRole('checkbox', { name: /Согласен/ }).check({ force: true });
    await page.getByRole('button', { name: 'Далее' }).click();

    // Проверка ответов.
    await expect(page.getByRole('heading', { name: 'Проверьте ответы' })).toBeFocused();
    const summary = page.locator('dl');
    await expect(summary).toContainText('Красота и уход');
    await expect(summary).toContainText('«Барбершоп на две кресла»');
    await expect(summary).toContainText('Жители района или города');
    await expect(summary).toContainText('Пропущено');
    await expect(summary).toContainText('Почта: client@example.com');

    // Правка ответа возвращает к проверке.
    await page.getByRole('button', { name: /Изменить.*Сроки/ }).click();
    await page.getByText('В течение месяца').click();
    await page.getByRole('button', { name: 'Сохранить' }).click();
    await expect(summary).toContainText('В течение месяца');

    // Отправка: посредник подменён. Первая попытка — сбой, вторая — успех.
    const bodies: { text: string; website: string }[] = [];
    let fail = true;
    await page.route(/workers\.dev/, async (route) => {
      bodies.push(JSON.parse(route.request().postData() ?? '{}'));
      await route.fulfill({ status: fail ? 500 : 200, body: fail ? '{"ok":false}' : '{"ok":true}' });
    });

    await page.getByRole('button', { name: 'Отправить' }).click();
    await expect(page.getByRole('alert')).toContainText('Не получилось отправить');
    // При сбое ответы не теряются: их можно скопировать.
    await page.getByText('Показать текст заявки').click();
    const text = await page.locator('details pre').textContent();
    expect(text).toContain('Заявка с сайта DWeb');
    expect(text).toContain('9. Сроки\n— В течение месяца');
    expect(text).toContain('Почта: client@example.com');

    fail = false;
    await page.getByRole('button', { name: 'Отправить ещё раз' }).click();
    await expect(page.getByRole('heading', { name: 'Спасибо, заявка отправлена' })).toBeFocused();
    expect(bodies).toHaveLength(2);
    expect(bodies[1]).toEqual({ text, website: '' });

    // После отправки черновик удалён: анкета начинается заново.
    await page.reload();
    await expect(page.getByText('Вопрос 01 из 09')).toBeVisible();
    await expect(page.getByRole('radio', { name: /Красота и уход/ })).not.toBeChecked();
    expect(errors.filter((e) => !e.includes('500'))).toEqual([]);
  });

  test('черновик сохраняется при обновлении страницы', async ({ page }) => {
    await page.goto('brief/');
    await page.getByText('Еда и напитки', { exact: false }).click();
    await page.getByRole('button', { name: 'Далее' }).click();
    await expect(page.getByText('Вопрос 02 из 09')).toBeVisible();

    await page.reload();
    await expect(page.getByText('Вопрос 02 из 09')).toBeVisible();
    await page.getByRole('button', { name: 'Назад' }).click();
    await expect(page.getByRole('radio', { name: /Еда и напитки/ })).toBeChecked();
  });
});

/* Посредник Cloudflare Worker: проверяется напрямую, без сети — Telegram подменён. */
test.describe('посредник для Telegram', () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'не зависит от браузера'));

  const workerPath = '../worker/brief-worker.js';
  const env = { BOT_TOKEN: 'token', CHAT_ID: '42' };
  const origin = 'https://tsum323.github.io';
  const post = (body: unknown, headers: Record<string, string> = {}) =>
    new Request('https://worker.example/', {
      method: 'POST',
      headers: { Origin: origin, 'CF-Connecting-IP': String(Math.random()), ...headers },
      body: JSON.stringify(body),
    });

  test('пересылает заявку и отклоняет лишнее', async () => {
    const { default: worker, chunks } = await import(workerPath);
    const sent: { chat_id: string; text: string }[] = [];
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async (_url: string, init: RequestInit) => {
      sent.push(JSON.parse(String(init.body)));
      return new Response('{"ok":true}');
    }) as typeof fetch;

    try {
      const text = 'Заявка с сайта DWeb\n\n1. Бизнес\n— Красота и уход';
      const ok = await worker.fetch(post({ text, website: '' }), env);
      expect(ok.status).toBe(200);
      expect(ok.headers.get('Access-Control-Allow-Origin')).toBe(origin);
      expect(sent).toEqual([{ chat_id: '42', text, disable_web_page_preview: true }]);

      // Чужой сайт, ловушка для ботов, пустой текст.
      expect((await worker.fetch(post({ text }, { Origin: 'https://evil.example' }), env)).status).toBe(403);
      expect((await worker.fetch(post({ text, website: 'spam' }), env)).status).toBe(200);
      expect((await worker.fetch(post({ text: '' }), env)).status).toBe(400);
      expect(sent).toHaveLength(1);

      // Частые повторы с одного адреса ограничены.
      const statuses = [];
      for (let i = 0; i < 7; i++)
        statuses.push((await worker.fetch(post({ text }, { 'CF-Connecting-IP': '1.1.1.1' }), env)).status);
      expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
      expect(statuses.at(-1)).toBe(429);

      // Длинная заявка делится на сообщения не длиннее 4000 символов без потери текста.
      const long = Array.from({ length: 300 }, (_, i) => `Строка ${i} ${'х'.repeat(20)}`).join('\n');
      const parts: string[] = chunks(long);
      expect(parts.length).toBeGreaterThan(1);
      expect(parts.every((p) => p.length <= 4000)).toBe(true);
      expect(parts.join('\n')).toBe(long);
    } finally {
      globalThis.fetch = realFetch;
    }
  });
});
