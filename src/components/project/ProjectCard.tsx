import { Link } from 'react-router';
import type { Project } from '../../content/schema';
import { typograph } from '../../lib/text';
import { Frame } from '../media/Frame';
import { Tag } from '../ui/Tag';
import styles from './ProjectCard.module.css';

type ProjectCardProps = {
  project: Project;
  /** Порядковый номер «листа»: P/01, P/02… */
  index: number;
  /** Заголовок карточки: h3 внутри секции главной, h2 на странице проектов. */
  headingLevel?: 2 | 3;
  sizes?: string;
};

export const statusLabel = (project: Project) =>
  project.status.kind === 'demo' ? 'Демо' : project.status.kind === 'live' ? 'Запущен' : 'В работе';

/**
 * Короткая карточка проекта: скриншот, название, одна строка о главном и стек.
 * Подробности — на странице кейса.
 */
export function ProjectCard({ project, index, headingLevel = 3, sizes }: ProjectCardProps) {
  const caseUrl = `/work/${project.slug}`;
  const Heading = `h${headingLevel}` as const;

  return (
    <article className={styles.card} aria-labelledby={`${project.slug}-title`}>
      {/* Картинка дублирует ссылку заголовка, поэтому скрыта от клавиатуры и дикторов. */}
      <Link to={caseUrl} className={styles.visual} tabIndex={-1} aria-hidden="true">
        <Frame
          {...project.media.cover.desktop}
          sizes={sizes ?? '(min-width: 64em) 45vw, 100vw'}
          viewTransitionName={`cover-${project.slug}`}
        />
      </Link>

      <p className={`t-mono ${styles.meta}`}>
        <span className={styles.number}>P/{String(index + 1).padStart(2, '0')}</span>
        <span>{project.type}</span>
      </p>

      <Heading id={`${project.slug}-title`} className={`t-h3 ${styles.title}`}>
        <Link to={caseUrl} className={styles.link}>
          {project.title}
        </Link>
      </Heading>

      <p className={`t-body ${styles.hook}`}>{typograph(project.hook)}</p>

      <ul role="list" className={styles.tags} aria-label="Статус и технологии">
        <li>
          <Tag>{statusLabel(project)}</Tag>
        </li>
        {project.stack.slice(0, 3).map((t) => (
          <li key={t}>
            <Tag>{t}</Tag>
          </li>
        ))}
      </ul>
    </article>
  );
}
