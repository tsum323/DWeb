import { Link } from 'react-router';
import { contacts, nav } from '../../content/site';
import { Container } from '../layout/Container';
import { Logo } from '../ui/Logo';
import { TextLink } from '../ui/TextLink';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  const hasContacts = Boolean(contacts.email) || contacts.channels.length > 0;

  return (
    <footer data-surface="dark" className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo />
            <p className="t-small t-muted">Сайты для бизнеса — продуманные от сетки до кода.</p>
          </div>

          <nav aria-label="Навигация в подвале">
            <p className="t-mono t-muted">Разделы</p>
            <ul role="list" className={styles.list}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="t-mono t-muted">Связь</p>
            {hasContacts ? (
              <ul role="list" className={styles.list}>
                {contacts.email && (
                  <li>
                    <TextLink href={`mailto:${contacts.email}`}>{contacts.email}</TextLink>
                  </li>
                )}
                {contacts.channels.map((c) => (
                  <li key={c.href}>
                    <TextLink href={c.href} external>
                      {c.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`t-small ${styles.note}`}>Контакты скоро появятся.</p>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <p className="t-mono t-muted">© {year} DWeb</p>
          <a href="#top" className={`t-mono ${styles.top}`}>
            Наверх ↑
          </a>
        </div>
      </Container>
    </footer>
  );
}
