import { Container } from '../components/layout/Container';
import { ProjectCard } from '../components/project/ProjectCard';
import { SectionLabel } from '../components/ui/SectionLabel';
import { projects } from '../content/projects';
import styles from './WorkPage.module.css';

/** Все проекты: коротко о каждом, подробности — на странице кейса. */
export function WorkPage() {
  return (
    <section data-surface="light" className={styles.page} aria-labelledby="work-page-title">
      <Container>
        <SectionLabel index="→">Работы</SectionLabel>
        <h1 id="work-page-title" className={`t-h1 ${styles.title}`} data-reveal="lines">
          Проекты
        </h1>
        <p className={`t-body-l t-measure ${styles.lead}`}>
          {projects.length} проектов: сайты для бизнеса и веб-приложения. Коротко о&nbsp;каждом здесь,
          подробно, со&nbsp;скриншотами&nbsp;— на&nbsp;странице проекта.
        </p>

        <ul role="list" className={styles.grid}>
          {projects.map((project, i) => (
            <li key={project.slug}>
              <ProjectCard project={project} index={i} headingLevel={2} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
