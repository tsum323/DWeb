import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { AppRoutes } from './app/routes';

export { getMeta, prerenderPaths, absoluteUrl } from './seo/meta';
export { site } from './content/site';

/** Базовый путь сайта из vite.config.ts — единый источник для пререндера. */
export const base = import.meta.env.BASE_URL;

/** Рендер страницы в HTML-строку на этапе сборки. */
export function render(path: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter
        basename={import.meta.env.BASE_URL}
        location={`${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`}
      >
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
}
