import { expect, test } from '@playwright/test';
import { pages, scrollThrough } from './support/helpers';

/* Изображения: загружаются, имеют описание и заданные размеры (без сдвигов вёрстки). */

// Страницы без картинок (анкета, политика) пропускаются.
for (const p of pages.filter((p) => !('images' in p))) {
  test(`${p.name}: все изображения загружены, с alt и размерами`, async ({ page }) => {
    await page.goto(p.path);
    await scrollThrough(page);
    const images = await page.locator('img').evaluateAll((imgs) =>
      imgs.map((img) => {
        const i = img as HTMLImageElement;
        return {
          src: i.currentSrc.split('/').pop(),
          loaded: i.complete && i.naturalWidth > 0,
          alt: i.alt.trim().length > 10,
          sized: i.hasAttribute('width') && i.hasAttribute('height'),
        };
      }),
    );
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) expect(img, img.src).toEqual({ ...img, loaded: true, alt: true, sized: true });
  });
}
