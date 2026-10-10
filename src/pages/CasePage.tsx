import { useParams } from 'react-router';
import { Stamp } from '../components/blueprint/Stamp';
import { Features } from '../components/project/Features';
import { Tag } from '../components/ui/Tag';
import { TextLink } from '../components/ui/TextLink';
import { getProject } from '../content/projects';
import type { Shot } from '../content/schema';
import { sentenceList, typograph } from '../lib/text';
import { CaseCover } from '../sections/case/CaseCover';
import { CaseOutro } from '../sections/case/CaseOutro';
import { Chapter } from '../sections/case/Chapter';
import { DesignSamples } from '../sections/case/DesignSamples';
import { Figures } from '../sections/case/Figures';
import { NotFoundPage } from './NotFoundPage';
import styles from './CasePage.module.css';

/**
 * Шаблон страницы кейса. Все кейсы собираются из данных одинаково;
 * глава без данных просто не выводится.
 */
export function CasePage() {
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFoundPage />;

  const { chapters, media } = project;
  // Сквозная нумерация рисунков: рис. 1, 2, 3…
  let figure = 0;
  const fig = (shot: Shot) => ({ shot, number: ++figure });
  const desktopShots = media.gallery.filter((s) => s.device === 'desktop');
  const mobileShots = [media.cover.mobile, ...media.gallery.filter((s) => s.device === 'mobile')];

  // Номера глав считаются по тем, что реально есть.
  let chapterIndex = 0;
  const next = () => String(++chapterIndex).padStart(2, '0');

  return (
    <article className={styles.case}>
      <CaseCover project={project} />

      <Chapter
        id="context"
        index={next()}
        label="Задача"
        title={chapters.context.title}
        body={chapters.context.body}
        aside={
          <Stamp
            className={styles.spec}
            rows={[
              { term: 'Год', value: project.year },
              { term: 'Статус', value: project.status.label },
              { term: 'Роль', value: sentenceList(project.role) },
              { term: 'Объём', value: sentenceList(project.scope) },
            ]}
          />
        }
      />

      {chapters.concept && (
        <Chapter
          id="concept"
          index={next()}
          label="Дизайн"
          title={chapters.concept.title}
          body={chapters.concept.body}
          surface="dark"
        >
          {project.design && <DesignSamples design={project.design} />}
        </Chapter>
      )}

      {chapters.implementation && (
        <Chapter
          id="implementation"
          index={next()}
          label="Реализация"
          title={chapters.implementation.title}
          body={chapters.implementation.body}
        >
          {desktopShots.length > 0 && <Figures shots={desktopShots.map(fig)} />}
        </Chapter>
      )}

      {chapters.responsive && (
        <Chapter
          id="responsive"
          index={next()}
          label="Адаптивность"
          title={chapters.responsive.title}
          body={chapters.responsive.body}
          surface="dark"
        >
          <Figures shots={mobileShots.map(fig)} />
        </Chapter>
      )}

      <Chapter
        id="stack"
        index={next()}
        label="Технологии"
        title="На чём сделано"
        aside={
          <ul role="list" className={styles.stack}>
            {project.stack.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        }
      />

      <Chapter
        id="result"
        index={next()}
        label="Результат"
        title="Результат и ограничения"
        surface="dark"
        aside={
          project.limitations.length > 0 && (
            <div className={styles.limits}>
              <h3 className="t-mono">Известные ограничения</h3>
              <ul role="list">
                {project.limitations.map((l) => (
                  <li key={l} className="t-body-l">
                    {typograph(l)}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      >
        {project.metrics && project.metrics.length > 0 && (
          <dl className={styles.metrics}>
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt className="t-mono t-muted">{m.label}</dt>
                <dd className="t-h1">{m.value}</dd>
                <dd className="t-small t-muted">Источник: {m.source}</dd>
              </div>
            ))}
          </dl>
        )}
        <Features features={project.features} />
        {project.repo && (
          <p className={styles.repo}>
            <TextLink href={project.repo.href} external>
              {project.repo.label}
            </TextLink>
          </p>
        )}
      </Chapter>

      <CaseOutro project={project} />
    </article>
  );
}
