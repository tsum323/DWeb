import { useParams } from 'react-router';
import { Stamp } from '../components/blueprint/Stamp';
import { Container } from '../components/layout/Container';
import { Col, Grid } from '../components/layout/Grid';
import { Actions } from '../components/ui/Actions';
import { Button } from '../components/ui/Button';
import { sentenceList } from '../lib/text';
import { SectionLabel } from '../components/ui/SectionLabel';
import { getProject } from '../content/projects';
import { NotFoundPage } from './NotFoundPage';
import styles from './CasePage.module.css';

/**
 * Страница кейса — каркас этапа B: заголовок, штамп и ссылки.
 * Полный шаблон (главы, скриншоты, функции, следующий кейс) — этап D.
 */
export function CasePage() {
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFoundPage />;

  return (
    <article data-surface={project.theme?.surface ?? 'dark'} className={styles.cover}>
      <Container>
        <SectionLabel index="Кейс">{project.type}</SectionLabel>
        <h1 className={`t-display ${styles.title}`}>{project.title}</h1>
        <Grid className={styles.grid}>
          <Col span={{ sm: 4, md: 8, lg: 6 }}>
            <p className="t-body-l t-measure">{project.summary}</p>
            <Actions>
              {project.live && (
                <Button
                  href={project.live.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon="arrow-up-right"
                >
                  {project.live.label}
                </Button>
              )}
              <Button to="/#work" variant="secondary">
                Все работы
              </Button>
            </Actions>
          </Col>
          <Col span={{ sm: 4, md: 8, lg: 5 }} start={{ lg: 8 }}>
            <Stamp
              rows={[
                { term: 'Год', value: project.year },
                { term: 'Статус', value: project.status.label },
                { term: 'Роль', value: sentenceList(project.role) },
                { term: 'Стек', value: project.stack.join(', ') },
              ]}
            />
          </Col>
        </Grid>
      </Container>
    </article>
  );
}
