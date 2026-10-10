import { Section } from '../../components/layout/Section';
import { TextLink } from '../../components/ui/TextLink';
import { contacts } from '../../content/site';
import styles from './Contact.module.css';

/** Финальный блок. Контакты берутся из content/site.ts. */
export function Contact() {
  const hasContacts = Boolean(contacts.email) || contacts.channels.length > 0;

  return (
    <Section id="contact" surface="dark" index="03" label="Контакт" labelledBy="contact-title">
      <h2 id="contact-title" className={`t-display ${styles.title}`}>
        Есть задача? Давайте обсудим
      </h2>
      {hasContacts ? (
        <ul role="list" className={styles.list}>
          {contacts.email && (
            <li>
              <TextLink href={`mailto:${contacts.email}`} className="t-h3">
                {contacts.email}
              </TextLink>
            </li>
          )}
          {contacts.channels.map((c) => (
            <li key={c.href}>
              <TextLink href={c.href} external className="t-h3">
                {c.label}
              </TextLink>
            </li>
          ))}
        </ul>
      ) : (
        <p className={`t-body-l t-muted t-measure ${styles.list}`}>
          Способы связи появятся здесь совсем скоро.
        </p>
      )}
    </Section>
  );
}
