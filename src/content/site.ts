import type { ExternalLink } from './schema';

/* Единый источник общей информации о сайте. */

export const site = {
  name: 'DWeb',
  /** Адрес опубликованного сайта — для canonical, Open Graph и sitemap. */
  url: 'https://tsum323.github.io/DWeb',
  locale: 'ru_RU',
  description:
    'DWeb — проектирование и разработка сайтов для небольшого бизнеса: от структуры и дизайна до адаптивной вёрстки и запуска.',
  /**
   * Пока сайт не готов к публикации, поисковикам запрещено его индексировать.
   * На этапе публикации значение меняется на true.
   */
  indexable: false,
};

export const nav = [
  { href: '/work', label: 'Работы' },
  { href: '/#services', label: 'Услуги' },
  { href: '/#approach', label: 'Подход' },
  { href: '/#contact', label: 'Контакт' },
] as const;

/**
 * Контакты. Показываются в окне «Обсудить проект», в блоке «Контакт» и в подвале.
 * Если список пуст, вместо ссылок показывается нейтральный текст.
 */
export const contacts: { email?: string; channels: ExternalLink[] } = {
  email: undefined,
  channels: [{ href: 'https://t.me/psokoa', label: 'Telegram' }],
};
