import type { ReactNode } from 'react';
import styles from './SectionLabel.module.css';

/** Подпись «01 / Работы» — номер листа на «чертеже». */
export function SectionLabel({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className={`t-mono ${styles.label}`}>
      {index && (
        <>
          <span className={styles.index}>{index}</span>
          <span aria-hidden="true" className={styles.slash}>
            /
          </span>
        </>
      )}
      <span>{children}</span>
    </p>
  );
}
