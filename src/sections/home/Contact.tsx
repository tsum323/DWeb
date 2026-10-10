import { Col, Grid } from '../../components/layout/Grid';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { TextLink } from '../../components/ui/TextLink';
import { contacts } from '../../content/site';
import styles from './Contact.module.css';

const brief = [
  'Чем занимается бизнес',
  'Что нужно: новый сайт, лендинг или доработка',
  'Желаемые сроки и ориентир по бюджету',
];

/** 04 / Контакт — финальный призыв. Контакты берутся из content/site.ts. */
export function Contact() {
  const hasContacts = Boolean(contacts.email) || contacts.channels.length > 0;

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
          {hasContacts ? (
            <div className={styles.channels}>
              {contacts.email && (
                <Button href={`mailto:${contacts.email}`} icon="arrow-up-right">
                  {contacts.email}
                </Button>
              )}
              <ul role="list" className={styles.links}>
                {contacts.channels.map((c) => (
                  <li key={c.href}>
                    <TextLink href={c.href} external className="t-h3">
                      {c.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className={`t-body-l ${styles.placeholder}`}>Способы связи появятся здесь совсем скоро.</p>
          )}
        </Col>
      </Grid>
    </Section>
  );
}
