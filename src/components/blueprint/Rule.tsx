import styles from './Rule.module.css';

type RuleProps = {
  /** Подписи на концах линии, как размерная линия на чертеже. */
  start?: string;
  end?: string;
  className?: string;
};

/** Тонкая линия с засечками на концах. */
export function Rule({ start, end, className }: RuleProps) {
  return (
    <div className={[styles.rule, className].filter(Boolean).join(' ')} aria-hidden={!start && !end}>
      {start && <span className="t-mono t-muted">{start}</span>}
      <span className={styles.line} />
      {end && <span className="t-mono t-muted">{end}</span>}
    </div>
  );
}
