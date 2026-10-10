import { useEffect, useLayoutEffect } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router';

type Engine = typeof import('./engine');

let engine: Engine | undefined;
let firstRun = true;
let viewTransitionActive = false;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clearPending() {
  document.documentElement.classList.remove('motion-pending');
}

/**
 * Запускает анимации страницы после каждого перехода.
 * useLayoutEffect — чтобы начальные состояния выставлялись до отрисовки кадра
 * и при переходах между страницами ничего не «мигало».
 */
export function useMotion() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const root = document.getElementById('main');
    if (!root || reducedMotion()) {
      clearPending();
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const run = (m: Engine) => {
      if (cancelled) return;
      // Если страхующий таймер уже показал страницу, видимое не прячем повторно.
      const pendingAlive = document.documentElement.classList.contains('motion-pending');
      cleanup = m.animatePage(root, {
        skipInView: firstRun && !pendingAlive,
        viewTransition: viewTransitionActive,
        firstRun,
      });
      firstRun = false;
      clearPending();
    };

    if (engine) {
      run(engine);
    } else {
      // Первая загрузка: ждём шрифты, иначе строки заголовков разобьются по запасному шрифту.
      Promise.all([import('./engine'), document.fonts.ready])
        .then(([m]) => {
          engine = m;
          run(m);
        })
        .catch(clearPending);
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);
}

/**
 * Плавный переход между страницами (View Transitions API).
 * Перехватывает клики по внутренним ссылкам; если браузер не поддерживает
 * переходы или включено «уменьшить движение» — обычная навигация.
 */
export function useViewTransitions() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const base = import.meta.env.BASE_URL;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!document.startViewTransition || reducedMotion()) return;

      const link = (event.target as Element | null)?.closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      // «Обсудить проект» открывает окно, а не переходит на другую страницу.
      if (link.hasAttribute('data-discuss')) return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin || !url.pathname.startsWith(base)) return;

      const path = `/${url.pathname.slice(base.length)}`.replace(/\/+$/, '') || '/';
      if (path === (pathname.replace(/\/+$/, '') || '/')) return; // якорь на той же странице

      event.preventDefault();
      viewTransitionActive = true;
      const transition = document.startViewTransition(() => {
        flushSync(() => navigate(path + url.hash));
      });
      transition.finished.finally(() => {
        viewTransitionActive = false;
      });
    };

    // Фаза перехвата: срабатывает раньше обработчика ссылки React Router.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate, pathname]);
}
