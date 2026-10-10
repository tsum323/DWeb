import { Link } from 'react-router';
import { useDiscuss } from '../../components/contact/DiscussDialog';
import { Container } from '../../components/layout/Container';
import { Actions } from '../../components/ui/Actions';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { getNextProject } from '../../content/projects';
import type { Project } from '../../content/schema';
import styles from './CaseOutro.module.css';

/** 10–12. Живой проект, переход к следующему кейсу и призыв обсудить похожую задачу. */
export function CaseOutro({ project }: { project: Project }) {
  const next = getNextProject(project.slug);
  const discuss = useDiscuss();
  const host = project.live ? new URL(project.live.href).host + new URL(project.live.href).pathname : '';

  return (
    <>
      {project.live && (
        <section data-surface="light" className={styles.live} aria-labelledby="live-title">
          <Container>
            <SectionLabel index="→">Живой проект</SectionLabel>
            <h2 id="live-title" className="visually-hidden">
              Ссылка на проект
            </h2>
            <a href={project.live.href} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
              <span className={`t-h2 ${styles.host}`}>{host.replace(/\/$/, '')}</span>
              <Icon name="arrow-up-right" size={40} className={styles.liveIcon} />
              <span className="visually-hidden"> (откроется в новой вкладке)</span>
            </a>
            {project.status.kind === 'demo' && (
              <p className="t-small t-muted">
                {project.status.label}. Страницы закрыты от поисковиков до запуска.
              </p>
            )}
          </Container>
        </section>
      )}

      <section data-surface="dark" className={styles.outro} aria-labelledby="outro-title">
        <Container className={styles.grid}>
          <div className={styles.next}>
            {next ? (
              <Link to={`/work/${next.slug}`} className={styles.nextLink}>
                <span className="t-mono t-muted">Следующий кейс</span>
                <span className="t-h1">{next.title}</span>
                <Icon name="arrow-right" size={32} />
              </Link>
            ) : (
              <>
                <p className="t-mono t-muted">Следующий кейс</p>
                <p className={`t-body-l ${styles.soon}`}>Новые проекты появятся здесь по мере готовности.</p>
                <Link to="/#work" className={`t-mono ${styles.back}`}>
                  ← Ко всем работам
                </Link>
              </>
            )}
          </div>

          <div className={styles.cta}>
            <h2 id="outro-title" className="t-h1" data-reveal="lines">
              Нужен похожий сайт?
            </h2>
            <p className="t-body-l t-muted t-measure">
              Расскажите о бизнесе и задаче — предложу структуру и план работ.
            </p>
            <Actions>
              <Button {...discuss}>Обсудить проект</Button>
            </Actions>
          </div>
        </Container>
      </section>
    </>
  );
}
