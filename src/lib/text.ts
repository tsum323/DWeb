/** Список через запятую с заглавной буквы: ['структура', 'дизайн'] → «Структура, дизайн». */
export function sentenceList(items: string[]) {
  const text = items.join(', ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
