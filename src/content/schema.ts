import type { Image } from '../components/media/Picture';

/*
 * Формат данных проекта. Новый кейс = новая папка в content/projects
 * плюс строка в content/projects/index.ts. Шаблоны менять не нужно.
 *
 * Правило честности: всё, что здесь записано, должно быть правдой.
 * Необязательные поля (метрики, отзывы) просто не заполняются, если данных нет, —
 * соответствующий блок на странице тогда не отображается.
 */

export type ProjectStatus = {
  /** live — работает у клиента; demo — показан клиенту, не запущен; in-progress — в разработке. */
  kind: 'live' | 'demo' | 'in-progress';
  label: string;
};

export type Feature = {
  title: string;
  description: string;
  /** shipped — уже работает; planned — идея или следующий шаг. Показываются раздельно. */
  status: 'shipped' | 'planned';
};

export type Chapter = {
  title: string;
  /** Абзацы текста. */
  body: string[];
};

export type Metric = {
  label: string;
  value: string;
  /** Откуда взята цифра. Без источника метрика не публикуется. */
  source: string;
};

export type ExternalLink = { href: string; label: string };

/** Скриншот проекта с подписью «что показано и при какой ширине экрана». */
export type Shot = {
  image: Image;
  label: string;
  viewport: number;
  device: 'desktop' | 'mobile';
  /** Подпись под изображением в кейсе: «рис. 2 — …». */
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  /** Одна фраза для карточки и описания страницы. */
  summary: string;
  type: string;
  year: number;
  status: ProjectStatus;
  /** Пункты со строчной буквы — на странице они выводятся списком через запятую. */
  role: string[];
  scope: string[];
  stack: string[];
  live?: ExternalLink;
  repo?: ExternalLink;
  /** Своя окраска обложки кейса. */
  theme?: { surface: 'dark' | 'light' };
  chapters: {
    context: Chapter;
    concept?: Chapter;
    implementation?: Chapter;
    responsive?: Chapter;
  };
  features: Feature[];
  limitations: string[];
  metrics?: Metric[];
  /** Проект, который разбирается подробно на главной. Если не указан — первый в списке. */
  featured?: boolean;
  /** Короткий разбор для главной: по одному-два предложения. */
  teaser: { task: string; solution: string; build: string };
  media: {
    /** Пара для обложки и карточки: десктоп + телефон. */
    cover: { desktop: Shot; mobile: Shot };
    /** Дополнительные экраны для разбора и страницы кейса. */
    gallery: Shot[];
  };
  seo: { title: string; description: string };
};
