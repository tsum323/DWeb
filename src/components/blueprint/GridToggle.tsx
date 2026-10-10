import { toggleGridOverlay, useGridOverlay } from '../../lib/gridOverlay';
import styles from './GridToggle.module.css';

/** Переключатель режима «Разметка». На клавиатуре — клавиша G. */
export function GridToggle({ className }: { className?: string }) {
  const on = useGridOverlay();
  return (
    <button
      type="button"
      className={[styles.toggle, 't-mono', className].filter(Boolean).join(' ')}
      aria-pressed={on}
      onClick={toggleGridOverlay}
    >
      <span className={styles.box} aria-hidden="true" />
      Разметка
      <kbd className={styles.key} aria-hidden="true">
        G
      </kbd>
    </button>
  );
}
