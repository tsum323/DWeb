import styles from './Logo.module.css';

/**
 * Словесный знак DWeb. «DW» — плотный и острый, «eb» — лёгкий:
 * контраст насыщенности внутри одного слова. Салатовый квадрат —
 * «курсор» и метка начала координат на чертеже.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={[styles.logo, className].filter(Boolean).join(' ')} role="img" aria-label="DWeb">
      <span aria-hidden="true" className={styles.strong}>
        DW
      </span>
      <span aria-hidden="true" className={styles.light}>
        eb
      </span>
      <span aria-hidden="true" className={styles.mark} />
    </span>
  );
}
