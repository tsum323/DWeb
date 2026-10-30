import { Link } from 'react-router';
import { Section } from '../../components/layout/Section';
import { ProjectCard } from '../../components/project/ProjectCard';
import { Icon } from '../../components/ui/Icon';
import { getFeaturedProjects, projects } from '../../content/projects';
import styles from './Work.module.css';

/**
 * 01 / Работы — коротко: несколько избранных проектов и переход ко всему списку.
 * Подробности каждого проекта — на его странице.
 */
export function Work() {
  const featured = getFeaturedProjects();

  return (
    <Section id="work" surface="light" index="01" label="Работы" labelledBy="work-title">
      <div className={styles.intro}>
        <h2 id="work-title" className="t-h2" data-reveal="lines">
          Избранные проекты
        </h2>
        <p className="t-body-l t-muted t-measure">
          Сайты для бизнеса и веб-приложения: от каталога с админ-панелью до симулятора города. Статус каждого
          указан честно.
        </p>
      </div>

      <ul role="list" className={styles.grid} data-reveal="stagger">
        {featured.map((project) => (
          <li key={project.slug}>
            <ProjectCard
              project={project}
              index={projects.indexOf(project)}
              sizes="(min-width: 64em) 30vw, (min-width: 40em) 50vw, 100vw"
            />
          </li>
        ))}
      </ul>

      <Link to="/work" className={styles.all}>
        <span className="t-mono t-muted">Всего проектов: {String(projects.length).padStart(2, '0')}</span>
        <span className={`t-h2 ${styles.allTitle}`}>
          Все проекты
          <Icon name="arrow-right" size={40} className={styles.allIcon} />
        </span>
      </Link>
    </Section>
  );
}
