import { useSyncExternalStore } from 'react';

/** Точки перелома проекта — те же, что в tokens.css. */
export const breakpoints = [
  { name: 'телефон', min: 0, columns: 4 },
  { name: 'планшет', min: 640, columns: 8 },
  { name: 'ноутбук', min: 1024, columns: 12 },
  { name: 'десктоп', min: 1440, columns: 12 },
] as const;

export type Viewport = { width: number; height: number };

let snapshot: Viewport | null = null;

function read(): Viewport {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (!snapshot || snapshot.width !== width || snapshot.height !== height) {
    snapshot = { width, height };
  }
  return snapshot;
}

function subscribe(onChange: () => void) {
  let frame = 0;
  const handler = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(onChange);
  };
  window.addEventListener('resize', handler, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', handler);
  };
}

/** Текущий размер окна. При пререндере возвращает null — разметка не «прыгает». */
export function useViewport(): Viewport | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function breakpointFor(width: number) {
  return [...breakpoints].reverse().find((bp) => width >= bp.min) ?? breakpoints[0];
}
