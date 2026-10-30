import { site } from '../content/site';
import { getProject, projects } from '../content/projects';

export type PageMeta = {
  title: string;
  description: string;
  /** Путь без базового префикса: '/', '/work/brass'. */
  path: string;
  type: 'website' | 'article';
  noindex: boolean;
  /** Картинка превью ссылки (из public/og), путь от корня сайта. */
  image: { path: string; alt: string };
  /** Структурированные данные для поисковиков (schema.org). */
  jsonLd?: Record<string, unknown>;
};

const homeImage = { path: '/og/home.png', alt: 'DWeb — сайты для бизнеса, продуманные от сетки до кода' };

const home: Omit<PageMeta, 'path'> = {
  title: 'DWeb — сайты для бизнеса',
  description: site.description,
  type: 'website',
  noindex: !site.indexable,
  image: homeImage,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: `${site.url}/`,
    description: site.description,
    inLanguage: 'ru',
  },
};

/** Простые страницы: список проектов, анкета, политика. */
const pagesMeta: Record<string, { title: string; description: string }> = {
  '/work': {
    title: 'Проекты — DWeb',
    description:
      'Все проекты DWeb: сайты для бизнеса и веб-приложения — коротко о каждом, подробности и скриншоты на странице проекта.',
  },
  '/brief': {
    title: 'Анкета: расскажите о задаче — DWeb',
    description:
      'Несколько коротких вопросов о бизнесе и будущем сайте: готовые варианты ответа или свои слова. Помогает быстро понять задачу.',
  },
  '/privacy': {
    title: 'Политика конфиденциальности — DWeb',
    description:
      'Какие данные собирает анкета на сайте DWeb, зачем они нужны, как передаются и как их удалить.',
  },
};

/** Метаданные страницы по её пути. Используются и при пререндере, и в браузере. */
export function getMeta(path: string): PageMeta {
  const clean = path.replace(/\/+$/, '') || '/';
  if (clean === '/') return { ...home, path: '/' };

  const simple = pagesMeta[clean];
  if (simple) {
    return {
      ...simple,
      path: clean,
      type: 'website',
      noindex: !site.indexable,
      image: homeImage,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: simple.title,
        description: simple.description,
        url: absoluteUrl(clean),
        inLanguage: 'ru',
        isPartOf: { '@type': 'WebSite', name: site.name, url: `${site.url}/` },
      },
    };
  }

  const caseMatch = clean.match(/^\/work\/([^/]+)$/);
  const project = caseMatch ? getProject(caseMatch[1]) : undefined;
  if (project) {
    return {
      title: `${project.seo.title} — DWeb`,
      description: project.seo.description,
      path: `/work/${project.slug}`,
      type: 'article',
      noindex: !site.indexable,
      image: { path: `/og/${project.slug}.png`, alt: `${project.title} — ${project.type.toLowerCase()}` },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.seo.description,
        url: absoluteUrl(`/work/${project.slug}`),
        dateCreated: String(project.year),
        inLanguage: 'ru',
        keywords: project.stack.join(', '),
        creator: { '@type': 'Organization', name: site.name, url: `${site.url}/` },
      },
    };
  }

  return {
    title: 'Страница не найдена — DWeb',
    description: 'Такой страницы нет. Вернитесь на главную DWeb.',
    path: clean,
    type: 'website',
    noindex: true,
    image: homeImage,
  };
}

/** Все страницы, которые превращаются в готовые HTML-файлы при сборке. */
export function prerenderPaths() {
  return ['/', ...projects.map((p) => `/work/${p.slug}`), ...Object.keys(pagesMeta)];
}

export function absoluteUrl(path: string) {
  return `${site.url}${path === '/' ? '/' : `${path}/`}`;
}
