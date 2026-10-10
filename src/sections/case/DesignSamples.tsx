import type { Project } from '../../content/schema';
import styles from './DesignSamples.module.css';

/** Образцы визуального решения: цвета и шрифты проекта, набранные этими же шрифтами. */
export function DesignSamples({ design }: { design: NonNullable<Project['design']> }) {
  return (
    <div className={styles.samples}>
      <div>
        <h3 className="t-mono">Палитра</h3>
        <ul role="list" className={styles.palette} data-reveal="stagger">
          {design.palette.map((c) => (
            <li key={c.hex} className={styles.color}>
              <span className={styles.chip} style={{ backgroundColor: c.hex }} />
              <span className={styles.colorName}>{c.name}</span>
              <span className="t-mono t-muted">{c.hex}</span>
              <span className="t-small t-muted">{c.role}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="t-mono">Шрифты</h3>
        <ul role="list" className={styles.fonts} data-reveal="stagger">
          {design.fonts.map((f) => (
            <li key={f.name} className={styles.font}>
              <div className={styles.fontMeta}>
                <span className={styles.colorName}>{f.name}</span>
                <span className="t-small t-muted">{f.role}</span>
              </div>
              <p
                className={styles.specimen}
                style={{ fontFamily: f.family, fontStyle: f.italic ? 'italic' : undefined }}
              >
                {f.sample}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
