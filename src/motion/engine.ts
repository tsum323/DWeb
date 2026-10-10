/*
 * Движок анимаций. Загружается отдельно (динамический import) уже после
 * того, как страница показана, поэтому не замедляет первый экран.
 *
 * Анимации описываются в разметке атрибутом data-reveal:
 *   lines   — заголовок появляется построчно из-под маски («Сборка»);
 *   frame   — скриншот раскрывается сверху вниз, изображение слегка «оседает»;
 *   draw    — линия прорисовывается слева направо («Разметка»), содержимое проявляется;
 *   stagger — дочерние элементы появляются по очереди.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { duration, ease } from './tokens';

gsap.registerPlugin(ScrollTrigger, SplitText);

type Options = {
  /** Не анимировать то, что уже на экране (страница успела показаться без анимации). */
  skipInView: boolean;
  /** Переход между страницами идёт через View Transitions — обложку не трогаем. */
  viewTransition: boolean;
  /** Первая загрузка сайта: элементы с data-reveal-intro уже анимирует CSS. */
  firstRun: boolean;
};

const isPhone = () => window.matchMedia('(max-width: 39.99em)').matches;

export function animatePage(root: HTMLElement, { skipInView, viewTransition, firstRun }: Options) {
  const distance = isPhone() ? 16 : 28;

  const ctx = gsap.context(() => {
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      // Снимаем «ожидание» (opacity: 0 из global.css) — дальше видимостью управляет анимация.
      // Скрываем только прозрачностью, не visibility: так содержимое остаётся доступным
      // экранным дикторам и клавиатуре, даже пока ждёт прокрутки.
      gsap.set(el, { opacity: 1 });

      const inView = el.getBoundingClientRect().top < window.innerHeight;
      if ((skipInView && inView) || (viewTransition && el.closest('[data-vt-skip]'))) return;
      if (firstRun && el.hasAttribute('data-reveal-intro')) return;

      const scrollTrigger = { trigger: el, start: 'top 88%', once: true };

      switch (el.dataset.reveal) {
        case 'lines': {
          // Если в заголовке ссылка или кнопка, не разбиваем его на строки: SplitText
          // прячет содержимое от экранных дикторов, и ссылка стала бы недоступна.
          if (el.querySelector('a, button')) {
            gsap.from(el, {
              opacity: 0,
              y: distance,
              duration: duration.reveal,
              ease: ease.out,
              scrollTrigger,
            });
            break;
          }
          const split = SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            aria: 'auto',
            // Делить слова только по обычному пробелу: неразрывные пробелы из typograph()
            // («бизнеса\u00A0—») должны держать слова вместе и во время анимации.
            wordDelimiter: ' ',
            reduceWhiteSpace: false,
          });
          gsap.from(split.lines, {
            yPercent: 110,
            duration: duration.reveal,
            ease: ease.out,
            stagger: 0.08,
            scrollTrigger,
            // После появления возвращаем обычный текст — переносы снова подстраиваются под ширину.
            onComplete: () => split.revert(),
          });
          break;
        }
        case 'frame': {
          const img = el.querySelector('img');
          const tl = gsap.timeline({ scrollTrigger, delay: Number(el.dataset.revealDelay ?? 0) });
          tl.fromTo(
            el,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: duration.reveal * 1.2,
              ease: ease.out,
              clearProps: 'clipPath',
            },
          );
          if (img)
            tl.from(
              img,
              { scale: 1.08, duration: duration.reveal * 1.6, ease: ease.out, clearProps: 'scale' },
              0,
            );
          break;
        }
        case 'draw': {
          const tl = gsap.timeline({ scrollTrigger });
          tl.fromTo(el, { '--draw': 0 }, { '--draw': 1, duration: duration.draw, ease: ease.inOut });
          tl.from(
            el.children,
            { opacity: 0, y: 8, duration: duration.slow, ease: ease.out, stagger: 0.06 },
            0.25,
          );
          break;
        }
        case 'stagger': {
          gsap.from(el.children, {
            opacity: 0,
            y: distance,
            duration: duration.reveal,
            ease: ease.out,
            stagger: 0.08,
            scrollTrigger,
            clearProps: 'transform,opacity',
          });
          break;
        }
      }
    });
  }, root);

  ScrollTrigger.refresh();
  return () => ctx.revert();
}
