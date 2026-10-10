import { Section } from '../../components/layout/Section';
import { ProjectSheet } from '../../components/project/ProjectSheet';
import { projects } from '../../content/projects';
import styles from './Work.module.css';

/** 01 / Работы — все проекты «листами». Новый проект появляется здесь автоматически. */
export function Work() {
  return (
    <Section id="work" surface="light" index="01" label="Работы" labelledBy="work-title">
      <div className={styles.intro}>
        <h2 id="work-title" className="t-h2" data-reveal="lines">
          Избранные работы
        </h2>
        <p className="t-body-l t-muted t-measure">
          Реальные проекты — от первой встречи с заказчиком до адаптивной вёрстки. Статус каждого указан
          честно.
        </p>
      </div>
      <div className={styles.list}>
        {projects.map((project, i) => (
          <ProjectSheet key={project.slug} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}
