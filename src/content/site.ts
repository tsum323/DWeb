import type { ExternalLink } from './schema';

/* Единый источник общей информации о сайте. */

export const site = {
  name: 'DWeb',
  /** Адрес опубликованного сайта — для canonical, Open Graph и sitemap. */
  url: 'https://tsum323.github.io/dweb',
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
  { href: '/#work', label: 'Работы' },
  { href: '/#approach', label: 'Подход' },
  { href: '/#contact', label: 'Контакт' },
] as const;

/**
 * Контакты. Сейчас пусто: владелец передаст их позже.
 * Пока список пуст, блок контактов показывает нейтральный текст без ссылок.
 */
export const contacts: { email?: string; channels: ExternalLink[] } = {
  email: undefined,
  channels: [],
};
