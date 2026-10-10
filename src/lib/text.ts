/** Список через запятую с заглавной буквы: ['структура', 'дизайн'] → «Структура, дизайн». */
export function sentenceList(items: string[]) {
  const text = items.join(', ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Неразрывный пробел. */
const NBSP = String.fromCharCode(0xa0);

const SHORT_WORDS = /(^|[\s(«])(в|во|и|с|со|к|ко|о|об|у|а|но|на|до|от|по|за|из|не|ни|для|без|при|как)\s+/gi;

/**
 * Типографика:
 * — короткие предлоги и союзы «приклеиваются» к следующему слову, чтобы не висеть
 *   в конце строки («и / интерактивность»);
 * — тире не начинает строку: оно привязано к предыдущему слову.
 */
export function typograph(text: string) {
  const glue = `$1$2${NBSP}`;
  // Дважды — чтобы обработать идущие подряд короткие слова («и в зале»).
  return text.replace(SHORT_WORDS, glue).replace(SHORT_WORDS, glue).replace(/ — /g, `${NBSP}— `);
}
