import { site } from '../content/site';
import { getProject, projects } from '../content/projects';

export type PageMeta = {
  title: string;
  description: string;
  /** Путь без базового префикса: '/', '/work/peaky'. */
  path: string;
  type: 'website' | 'article';
  noindex: boolean;
};

const home: Omit<PageMeta, 'path'> = {
  title: 'DWeb — сайты для бизнеса',
  description: site.description,
  type: 'website',
  noindex: !site.indexable,
};

/** Метаданные страницы по её пути. Используются и при пререндере, и в браузере. */
export function getMeta(path: string): PageMeta {
  const clean = path.replace(/\/+$/, '') || '/';
  if (clean === '/') return { ...home, path: '/' };

  const caseMatch = clean.match(/^\/work\/([^/]+)$/);
  const project = caseMatch ? getProject(caseMatch[1]) : undefined;
  if (project) {
    return {
      title: `${project.seo.title} — DWeb`,
      description: project.seo.description,
      path: `/work/${project.slug}`,
      type: 'article',
      noindex: !site.indexable,
    };
  }

  return {
    title: 'Страница не найдена — DWeb',
    description: 'Такой страницы нет. Вернитесь на главную DWeb.',
    path: clean,
    type: 'website',
    noindex: true,
  };
}

/** Все страницы, которые превращаются в готовые HTML-файлы при сборке. */
export function prerenderPaths() {
  return ['/', ...projects.map((p) => `/work/${p.slug}`)];
}

export function absoluteUrl(path: string) {
  return `${site.url}${path === '/' ? '/' : `${path}/`}`;
}
