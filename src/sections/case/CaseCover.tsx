import { Container } from '../../components/layout/Container';
import { CoverVisual } from '../../components/project/CoverVisual';
import { Actions } from '../../components/ui/Actions';
import { Button } from '../../components/ui/Button';
import { SectionLabel } from '../../components/ui/SectionLabel';
import type { Project } from '../../content/schema';
import { typograph } from '../../lib/text';
import styles from './CaseCover.module.css';

/** 1–2. Обложка: тип, название, одна фраза о проекте, ссылки и пара экранов. */
export function CaseCover({ project }: { project: Project }) {
  return (
    <header data-surface={project.theme?.surface ?? 'dark'} className={styles.cover}>
      <Container>
        <SectionLabel index="Кейс">{project.type}</SectionLabel>
        <h1 className={`t-display ${styles.title}`} data-reveal="lines">
          {project.title}
        </h1>
        <p className={`t-body-l t-measure ${styles.summary}`}>{typograph(project.summary)}</p>
        <Actions>
          {project.live && (
            <Button href={project.live.href} target="_blank" rel="noopener noreferrer" icon="arrow-up-right">
              {project.live.label}
              <span className="visually-hidden"> (откроется в новой вкладке)</span>
            </Button>
          )}
          <Button to="/#work" variant="secondary">
            Все работы
          </Button>
        </Actions>
        <div data-vt-skip>
          <CoverVisual
            cover={project.media.cover}
            priority
            className={styles.visual}
            viewTransitionName={`cover-${project.slug}`}
          />
        </div>
      </Container>
    </header>
  );
}
