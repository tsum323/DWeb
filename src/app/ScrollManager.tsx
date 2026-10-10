import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Прокрутка при переходах: к якорю (/#work), если он есть, иначе — в начало страницы.
 * Кнопки «назад/вперёд» браузер восстанавливает сам.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  // useLayoutEffect: прокрутка до отрисовки кадра — важно для плавного перехода между страницами.
  useLayoutEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        target.focus({ preventScroll: true });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, key]);

  return null;
}
