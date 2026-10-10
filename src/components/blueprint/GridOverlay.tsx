import type { CSSProperties } from 'react';
import { useGridOverlay } from '../../lib/gridOverlay';
import styles from './GridOverlay.module.css';

const MAX_COLUMNS = 12;

/** Сетка страницы поверх контента. Колонки лишние на узких экранах скрываются стилями. */
export function GridOverlay() {
  const on = useGridOverlay();
  if (!on) return null;
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.columns}>
        {Array.from({ length: MAX_COLUMNS }, (_, i) => (
          <span key={i} className={styles.column} style={{ '--i': i } as CSSProperties}>
            <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
