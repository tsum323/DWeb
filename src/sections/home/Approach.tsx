import { Section } from '../../components/layout/Section';
import { Tag } from '../../components/ui/Tag';
import { principles, process, tools } from '../../content/approach';
import { typograph } from '../../lib/text';
import styles from './Approach.module.css';

/** 03 / Подход — четыре этапа работы, принципы и инструменты. */
export function Approach() {
  return (
    <Section id="approach" surface="dark" index="03" label="Подход" labelledBy="approach-title">
      <h2 id="approach-title" className={`t-h2 ${styles.title}`} data-reveal="lines">
        Четыре этапа от&nbsp;задачи до&nbsp;запуска
      </h2>

      <ol role="list" className={styles.process} data-reveal="stagger">
        {process.map((step, i) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.node} aria-hidden="true" />
            <p className={`t-mono ${styles.stepIndex}`}>Этап {String(i + 1).padStart(2, '0')}</p>
            <h3 className="t-h3">{step.title}</h3>
            <p className="t-muted">{typograph(step.text)}</p>
            <p className={`t-mono ${styles.result}`}>→ {step.result}</p>
          </li>
        ))}
      </ol>

      <div className={styles.bottom}>
        <div>
          <h3 className="t-mono">Принципы</h3>
          <ul role="list" className={styles.principles} data-reveal="stagger">
            {principles.map((p) => (
              <li key={p.title}>
                <p className="t-h3">{p.title}</p>
                <p className="t-muted">{typograph(p.text)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="t-mono">Инструменты</h3>
          <ul role="list" className={styles.tools}>
            {tools.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
