import { defineConfig, devices } from '@playwright/test';

/*
 * Автотесты сайта. Перед запуском нужна сборка: npm run build.
 * Локально — только Chromium; в CI (GitHub Actions) добавляется WebKit —
 * движок Safari, в котором владелец смотрит сайт на iPad.
 */
const ci = Boolean(process.env.CI);

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  reporter: ci ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4174/DWeb/',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node tests/support/pages-server.mjs dist 4174',
    url: 'http://localhost:4174/DWeb/',
    reuseExistingServer: !ci,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    ...(ci ? [{ name: 'ipad-safari', use: { ...devices['iPad (gen 7)'] } }] : []),
  ],
});
