import { Link } from 'react-router';
import { Section } from '../../components/layout/Section';
import { Icon } from '../../components/ui/Icon';
import { getProject } from '../../content/projects';
import { doing, learning } from '../../content/services';
import { typograph } from '../../lib/text';
import styles from './Services.module.css';

/** 02 / Услуги — что делаю (с примерами) и что развиваю (пунктиром — «в работе»). */
export function Services() {
  return (
    <Section id="services" surface="light" index="02" label="Услуги" labelledBy="services-title">
      <h2 id="services-title" className={`t-h2 ${styles.title}`}>
        Что делаю и&nbsp;что развиваю
      </h2>

      <ol role="list" className={styles.list}>
        {doing.map((s, i) => {
          const example = s.example ? getProject(s.example) : undefined;
          return (
            <li key={s.title} className={styles.row}>
              <span className={`t-mono ${styles.index}`}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={`t-h3 ${styles.name}`}>{s.title}</h3>
              <p className={styles.text}>{typograph(s.text)}</p>
              {example && (
                <Link to={`/work/${example.slug}`} className={`t-mono ${styles.example}`}>
                  Пример: {example.title}
                  <Icon name="arrow-right" size={14} />
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <div className={styles.learning}>
        <h3 className="t-mono">Развиваю</h3>
        <ul role="list" className={styles.learningList}>
          {learning.map((s) => (
            <li key={s.title} className={styles.learningItem}>
              <p className={styles.learningTitle}>{s.title}</p>
              <p className="t-small t-muted">{typograph(s.text)}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
