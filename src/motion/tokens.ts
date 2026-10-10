/* Параметры движения для JavaScript — те же, что в tokens.css (в секундах). */

export const duration = {
  fast: 0.14,
  base: 0.24,
  slow: 0.56,
  reveal: 0.9,
  draw: 1.2,
};

export const ease = {
  /** Появление: быстрый старт, мягкая остановка (= --ease-out). */
  out: 'expo.out',
  /** Перемещение и прорисовка (= --ease-in-out). */
  inOut: 'power3.inOut',
};
