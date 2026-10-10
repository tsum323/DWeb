import { Container } from '../../components/layout/Container';
import { Col, Grid } from '../../components/layout/Grid';
import { Frame } from '../../components/media/Frame';
import { Button } from '../../components/ui/Button';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { getFeaturedProject } from '../../content/projects';
import styles from './Breakdown.module.css';

/**
 * 01.1 / Разбор — подробный взгляд на главный проект прямо на главной:
 * задача, решение, реализация, что сделано и что дальше.
 */
export function Breakdown() {
  const project = getFeaturedProject();
  if (!project) return null;

  const shipped = project.features.filter((f) => f.status === 'shipped');
  const planned = project.features.filter((f) => f.status === 'planned');
  const steps = [
    { label: 'Задача', text: project.teaser.task },
    { label: 'Решение', text: project.teaser.solution },
    { label: 'Реализация', text: project.teaser.build },
  ];
  const [wide, tall] = project.media.gallery;

  return (
    <section data-surface="dark" className={styles.section} aria-labelledby="breakdown-title">
      <Container>
        <div className={styles.head}>
          <SectionLabel index="01.1">Разбор</SectionLabel>
        </div>
        <h2 id="breakdown-title" className={`t-h2 ${styles.title}`}>
          Как устроен {project.title}
        </h2>

        <ol role="list" className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.label} className={styles.step}>
              <p className="t-mono">
                <span className={styles.stepIndex}>{String(i + 1).padStart(2, '0')}</span> {s.label}
              </p>
              <p className="t-body-l">{s.text}</p>
            </li>
          ))}
        </ol>

        {wide && tall && (
          <Grid className={styles.gallery}>
            <Col span={{ sm: 4, md: 8, lg: 8 }} as="div">
              <Frame {...wide} sizes="(min-width: 64em) 60vw, 100vw" />
              {wide.caption && <p className={`t-mono t-muted ${styles.caption}`}>рис. 1 — {wide.caption}</p>}
            </Col>
            <Col span={{ sm: 3, md: 4, lg: 3 }} start={{ lg: 10 }} as="div" className={styles.tall}>
              <Frame {...tall} sizes="(min-width: 64em) 20vw, 60vw" />
              {tall.caption && <p className={`t-mono t-muted ${styles.caption}`}>рис. 2 — {tall.caption}</p>}
            </Col>
          </Grid>
        )}

        <Grid className={styles.features}>
          <Col span={{ sm: 4, md: 8, lg: 7 }}>
            <h3 className="t-mono">Реализовано</h3>
            <ol role="list" className={styles.featureList}>
              {shipped.map((f, i) => (
                <li key={f.title} className={styles.feature}>
                  <span className={`t-mono ${styles.featureIndex}`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="t-h3">{f.title}</p>
                    <p className="t-muted">{f.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Col>
          {planned.length > 0 && (
            <Col span={{ sm: 4, md: 8, lg: 4 }} start={{ lg: 9 }}>
              <h3 className="t-mono">Следующие шаги</h3>
              <ul role="list" className={styles.planned}>
                {planned.map((f) => (
                  <li key={f.title}>
                    <p className={styles.plannedTitle}>{f.title}</p>
                    <p className="t-small t-muted">{f.description}</p>
                  </li>
                ))}
              </ul>
            </Col>
          )}
        </Grid>

        <div className={styles.actions}>
          <Button to={`/work/${project.slug}`}>Полный кейс</Button>
        </div>
      </Container>
    </section>
  );
}
