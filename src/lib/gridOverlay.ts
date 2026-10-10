import { useEffect, useSyncExternalStore } from 'react';

/* Состояние режима «Разметка»: показывает сетку страницы поверх контента.
   Хранится в атрибуте <html data-grid>, чтобы стили могли реагировать без React. */

const listeners = new Set<() => void>();

function isOn() {
  return document.documentElement.dataset.grid === 'on';
}

export function setGridOverlay(on: boolean) {
  document.documentElement.dataset.grid = on ? 'on' : 'off';
  listeners.forEach((l) => l());
}

export function toggleGridOverlay() {
  setGridOverlay(!isOn());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useGridOverlay() {
  return useSyncExternalStore(subscribe, isOn, () => false);
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

/** Клавиша G переключает сетку, Esc — выключает. */
export function useGridShortcut() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      if (event.key === 'g' || event.key === 'G' || event.key === 'п' || event.key === 'П') {
        toggleGridOverlay();
      } else if (event.key === 'Escape' && isOn()) {
        setGridOverlay(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
