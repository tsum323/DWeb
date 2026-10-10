import { Link } from 'react-router';
import { Stamp } from '../../components/blueprint/Stamp';
import { Col, Grid } from '../../components/layout/Grid';
import { Section } from '../../components/layout/Section';
import { Icon } from '../../components/ui/Icon';
import { projects } from '../../content/projects';
import styles from './WorkPreview.module.css';

/**
 * Временный список работ этапа B: проверяет, что данные и маршруты кейсов связаны.
 * На этапе C его заменит полноценный блок «Работы» с крупными превью.
 */
export function WorkPreview() {
  return (
    <Section id="work" surface="light" index="01" label="Работы" labelledBy="work-title">
      <h2 id="work-title" className="t-h2">
        Избранные работы
      </h2>
      <ul role="list" className={styles.list}>
        {projects.map((p) => (
          <li key={p.slug}>
            <Grid className={styles.row}>
              <Col span={{ sm: 4, md: 8, lg: 7 }}>
                <Link to={`/work/${p.slug}`} className={styles.link}>
                  <span className="t-h1">{p.title}</span>
                  <Icon name="arrow-right" size={28} className={styles.arrow} />
                </Link>
                <p className="t-body-l t-muted t-measure">{p.summary}</p>
              </Col>
              <Col span={{ sm: 4, md: 8, lg: 5 }}>
                <Stamp
                  rows={[
                    { term: 'Тип', value: p.type },
                    { term: 'Год', value: p.year },
                    { term: 'Стек', value: p.stack.join(', ') },
                    { term: 'Статус', value: p.status.label },
                  ]}
                />
              </Col>
            </Grid>
          </li>
        ))}
      </ul>
    </Section>
  );
}
