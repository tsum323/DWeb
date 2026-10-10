import { Col, Grid } from '../../components/layout/Grid';
import { Section } from '../../components/layout/Section';
import { ContactOptions } from '../../components/contact/ContactOptions';
import styles from './Contact.module.css';

const brief = [
  'Чем занимается бизнес',
  'Что нужно: новый сайт, лендинг или доработка',
  'К какому сроку нужен сайт',
];

/** 04 / Контакт — финальный призыв. Контакты берутся из content/site.ts, рядом — путь к анкете. */
export function Contact() {
  return (
    <Section id="contact" surface="light" index="04" label="Контакт" labelledBy="contact-title">
      <h2 id="contact-title" className={`t-display ${styles.title}`} data-reveal="lines">
        Есть задача? Давайте обсудим
      </h2>

      <Grid className={styles.grid} data-reveal="stagger">
        <Col span={{ sm: 4, md: 4, lg: 5 }}>
          <p className="t-mono t-muted">Что написать в первом сообщении</p>
          <ol role="list" className={styles.brief}>
            {brief.map((b, i) => (
              <li key={b}>
                <span className={`t-mono ${styles.briefIndex}`}>{String(i + 1).padStart(2, '0')}</span>
                {b}
              </li>
            ))}
          </ol>
        </Col>

        <Col span={{ sm: 4, md: 4, lg: 6 }} start={{ lg: 7 }}>
          <p className="t-mono t-muted">Связь</p>
          <div className={styles.options}>
            <ContactOptions />
          </div>
        </Col>
      </Grid>
    </Section>
  );
}
