import { Container } from '../components/layout/Container';
import { SectionLabel } from '../components/ui/SectionLabel';
import { briefQuestions } from '../content/brief';
import { BriefForm } from '../sections/brief/BriefForm';
import styles from './BriefPage.module.css';

/** Анкета для тех, кто не знает, с чего начать разговор о сайте. */
export function BriefPage() {
  return (
    <section data-surface="light" className={styles.page} aria-labelledby="brief-title">
      <Container>
        <SectionLabel index="→">Анкета</SectionLabel>
        <h1 id="brief-title" className={`t-h1 ${styles.title}`} data-reveal="lines">
          Расскажите о&nbsp;задаче
        </h1>
        <p className={`t-body-l t-measure ${styles.lead}`}>
          {briefQuestions.length} коротких вопросов. Выбирайте готовые варианты или пишите своими словами.
          Чего не&nbsp;знаете&nbsp;— пропускайте, обсудим при разговоре.
        </p>
        <noscript>
          <p className={styles.noscript}>
            Для анкеты нужен включённый JavaScript. Можно написать напрямую — контакты на главной странице.
          </p>
        </noscript>
        <BriefForm />
      </Container>
    </section>
  );
}
