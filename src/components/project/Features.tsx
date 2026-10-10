import type { Feature } from '../../content/schema';
import { Col, Grid } from '../layout/Grid';
import { typograph } from '../../lib/text';
import styles from './Features.module.css';

/**
 * «Реализовано» и «Следующие шаги» — всегда раздельно.
 * Пунктирная рамка у планов — общий для сайта знак «ещё не сделано».
 */
export function Features({ features, className }: { features: Feature[]; className?: string }) {
  const shipped = features.filter((f) => f.status === 'shipped');
  const planned = features.filter((f) => f.status === 'planned');

  return (
    <Grid className={[styles.features, className].filter(Boolean).join(' ')}>
      <Col span={{ sm: 4, md: 8, lg: 7 }}>
        <h3 className="t-mono">Реализовано</h3>
        <ol role="list" className={styles.list} data-reveal="stagger">
          {shipped.map((f, i) => (
            <li key={f.title} className={styles.item}>
              <span className={`t-mono ${styles.index}`}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="t-h3">{f.title}</p>
                <p className="t-muted">{typograph(f.description)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Col>
      {planned.length > 0 && (
        <Col span={{ sm: 4, md: 8, lg: 4 }} start={{ lg: 9 }}>
          <h3 className="t-mono">Следующие шаги</h3>
          <ul role="list" className={styles.planned} data-reveal="stagger">
            {planned.map((f) => (
              <li key={f.title}>
                <p className={styles.plannedTitle}>{f.title}</p>
                <p className="t-small t-muted">{typograph(f.description)}</p>
              </li>
            ))}
          </ul>
        </Col>
      )}
    </Grid>
  );
}
