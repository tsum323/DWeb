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

export type Project = {
  slug: string;
  title: string;
  /** Одна фраза для карточки и описания страницы. */
  summary: string;
  type: string;
  year: number;
  status: ProjectStatus;
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
  seo: { title: string; description: string };
};
