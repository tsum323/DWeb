import { Link } from 'react-router';
import type { Project } from '../../content/schema';
import { Stamp } from '../blueprint/Stamp';
import { Col, Grid } from '../layout/Grid';
import { Frame } from '../media/Frame';
import { sentenceList } from '../../lib/text';
import { Actions } from '../ui/Actions';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import styles from './ProjectSheet.module.css';

type ProjectSheetProps = {
  project: Project;
  /** Порядковый номер «листа»: P/01, P/02… */
  index: number;
};

/**
 * «Лист» проекта: крупный скриншот десктопа, наложенный на него телефон,
 * штамп со сведениями и ссылки. Основная карточка портфолио.
 */
export function ProjectSheet({ project, index }: ProjectSheetProps) {
  const { cover } = project.media;
  const caseUrl = `/work/${project.slug}`;
  const number = `P/${String(index + 1).padStart(2, '0')}`;

  return (
    <article className={styles.sheet} aria-labelledby={`${project.slug}-title`}>
      <header className={styles.head}>
        <span className={`t-mono ${styles.number}`}>{number}</span>
        <h3 id={`${project.slug}-title`} className={`t-h1 ${styles.title}`}>
          <Link to={caseUrl} className={styles.titleLink}>
            {project.title}
          </Link>
        </h3>
        <div className={styles.tags}>
          <Tag>
            {project.status.kind === 'demo'
              ? 'Демо'
              : project.status.kind === 'live'
                ? 'Запущен'
                : 'В работе'}
          </Tag>
          <Tag>{project.year}</Tag>
        </div>
      </header>

      {/* Изображения дублируют ссылку заголовка, поэтому скрыты от клавиатуры и дикторов как ссылка. */}
      <Link to={caseUrl} className={styles.visual} tabIndex={-1} aria-hidden="true">
        <Frame {...cover.desktop} className={styles.desktop} sizes="(min-width: 64em) 75vw, 100vw" />
        <Frame {...cover.mobile} className={styles.mobile} sizes="(min-width: 64em) 18vw, 40vw" />
      </Link>

      <Grid className={styles.info}>
        <Col span={{ sm: 4, md: 8, lg: 6 }}>
          <p className="t-body-l t-measure">{project.summary}</p>
          <ul role="list" className={styles.stack} aria-label="Технологии">
            {project.stack.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
          <Actions>
            <Button to={caseUrl}>Смотреть кейс</Button>
            {project.live && (
              <Button
                href={project.live.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                icon="arrow-up-right"
              >
                {project.live.label}
                <span className="visually-hidden"> (откроется в новой вкладке)</span>
              </Button>
            )}
          </Actions>
        </Col>
        <Col span={{ sm: 4, md: 8, lg: 5 }} start={{ lg: 8 }}>
          <Stamp
            rows={[
              { term: 'Тип', value: project.type },
              { term: 'Статус', value: project.status.label },
              { term: 'Роль', value: sentenceList(project.role) },
              { term: 'Объём', value: sentenceList(project.scope) },
            ]}
          />
        </Col>
      </Grid>
    </article>
  );
}
