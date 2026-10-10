import type { ReactNode } from 'react';
import styles from './Stamp.module.css';

export type StampRow = { term: string; value: ReactNode };

type StampProps = {
  title?: ReactNode;
  rows: StampRow[];
  className?: string;
};

/**
 * «Штамп» — таблица основных сведений, как основная надпись на чертеже.
 * Используется в карточках проектов и на страницах кейсов.
 */
export function Stamp({ title, rows, className }: StampProps) {
  return (
    <div className={[styles.stamp, className].filter(Boolean).join(' ')}>
      {title && <div className={styles.title}>{title}</div>}
      <dl className={styles.rows}>
        {rows.map((row) => (
          <div className={styles.row} key={row.term}>
            <dt className="t-mono t-muted">{row.term}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
