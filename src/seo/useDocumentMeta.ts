import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { getMeta } from './meta';

/**
 * При переходах внутри сайта обновляет заголовок вкладки и описание.
 * Первую загрузку обслуживает готовый HTML из пререндера.
 */
export function useDocumentMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = getMeta(pathname);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [pathname]);
}
