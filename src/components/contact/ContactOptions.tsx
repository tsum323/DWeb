import { Link } from 'react-router';
import { briefQuestions } from '../../content/brief';
import { contacts } from '../../content/site';
import { Icon } from '../ui/Icon';
import styles from './ContactOptions.module.css';

type ContactOptionsProps = {
  /** Вызывается при выборе любого варианта — например, чтобы закрыть окно. */
  onChoose?: () => void;
};

/** Человекочитаемый адрес ссылки: https://t.me/name → t.me/name. */
const display = (href: string) => href.replace(/^https?:\/\//, '').replace(/\/$/, '');

/**
 * Способы начать разговор: прямые контакты из content/site.ts и анкета для тех,
 * кто не знает, с чего начать. Используется в окне «Обсудить проект» и в блоке «Контакт».
 */
export function ContactOptions({ onChoose }: ContactOptionsProps) {
  const hasContacts = Boolean(contacts.email) || contacts.channels.length > 0;

  return (
    <ul role="list" className={styles.list}>
      {contacts.channels.map((c) => (
        <li key={c.href}>
          <a
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.row}
            onClick={onChoose}
          >
            <span className={`t-mono ${styles.kicker}`}>Написать напрямую</span>
            <span className={`t-h3 ${styles.title}`}>{c.label}</span>
            <span className={`t-small ${styles.note}`}>
              {display(c.href)}
              <span className="visually-hidden"> (откроется в новой вкладке)</span>
            </span>
            <Icon name="arrow-up-right" size={22} className={styles.icon} />
          </a>
        </li>
      ))}

      {contacts.email && (
        <li>
          <a href={`mailto:${contacts.email}`} className={styles.row} onClick={onChoose}>
            <span className={`t-mono ${styles.kicker}`}>Написать напрямую</span>
            <span className={`t-h3 ${styles.title}`}>Почта</span>
            <span className={`t-small ${styles.note}`}>{contacts.email}</span>
            <Icon name="arrow-up-right" size={22} className={styles.icon} />
          </a>
        </li>
      )}

      {!hasContacts && (
        <li className={`t-small ${styles.placeholder}`}>Прямые контакты появятся здесь совсем скоро.</li>
      )}

      <li>
        <Link to="/brief" className={`${styles.row} ${styles.brief}`} onClick={onChoose}>
          <span className={`t-mono ${styles.kicker}`}>Не знаете, с чего начать?</span>
          <span className={`t-h3 ${styles.title}`}>Ответить на вопросы</span>
          <span className={`t-small ${styles.note}`}>
            {briefQuestions.length} коротких вопросов с&nbsp;готовыми вариантами&nbsp;— 3–5 минут
          </span>
          <Icon name="arrow-right" size={22} className={styles.icon} />
        </Link>
      </li>
    </ul>
  );
}
