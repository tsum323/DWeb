import { Container } from '../components/layout/Container';
import { SectionLabel } from '../components/ui/SectionLabel';
import { typograph } from '../lib/text';
import styles from './PrivacyPage.module.css';

/*
 * Политика конфиденциальности для анкеты /brief.
 * Описывает только то, что сайт действительно делает. Если изменится способ
 * отправки заявок или появятся счётчики посещений — текст нужно обновить.
 */

const sections = [
  {
    title: 'Какие данные собираются',
    body: [
      'Только то, что вы сами укажете в анкете: ответы на вопросы, имя (по желанию), контакт для связи — ник в Telegram, номер телефона или адрес почты — и комментарий.',
      'Сайт не использует cookie, счётчики посещений и рекламные системы.',
    ],
  },
  {
    title: 'Зачем',
    body: [
      'Чтобы ответить на вашу заявку и обсудить проект. Данные не используются для рассылок и не передаются третьим лицам для рекламы.',
    ],
  },
  {
    title: 'Как передаются и где хранятся',
    body: [
      'Пока вы заполняете анкету, черновик ответов хранится только в вашем браузере — чтобы ничего не потерялось при обновлении страницы. После отправки черновик удаляется.',
      'При отправке ответы передаются через сервис Cloudflare в мессенджер Telegram владельцу сайта. На самом сайте заявки не хранятся.',
      'Сайт размещён на GitHub Pages. Как и любой хостинг, GitHub обрабатывает технические данные запросов (например, IP-адрес) по своим правилам.',
    ],
  },
  {
    title: 'Сколько хранятся',
    body: [
      'Заявка хранится в переписке владельца сайта, пока идёт обсуждение проекта, и удаляется по вашей просьбе.',
    ],
  },
  {
    title: 'Ваши права',
    body: [
      'Вы можете в любой момент попросить уточнить, изменить или удалить ваши данные, а также отозвать согласие на их обработку. Для этого напишите по контактам, указанным на сайте.',
    ],
  },
];

export function PrivacyPage() {
  return (
    <section data-surface="light" className={styles.page} aria-labelledby="privacy-title">
      <Container>
        <SectionLabel index="→">Документ</SectionLabel>
        <h1 id="privacy-title" className={`t-h1 ${styles.title}`}>
          Политика конфиденциальности
        </h1>
        <p className="t-body-l t-measure t-muted">
          Как сайт DWeb обращается с&nbsp;данными, которые вы оставляете в&nbsp;анкете. Оператор персональных
          данных&nbsp;— владелец сайта DWeb.
        </p>

        <div className={styles.body}>
          {sections.map((s, i) => (
            <section key={s.title} className={styles.item} aria-labelledby={`privacy-${i}`}>
              <h2 id={`privacy-${i}`} className="t-h3">
                <span className={`t-mono ${styles.index}`}>{String(i + 1).padStart(2, '0')}</span>
                {s.title}
              </h2>
              <div className={styles.text}>
                {s.body.map((p) => (
                  <p key={p} className="t-body t-measure">
                    {typograph(p)}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </section>
  );
}
