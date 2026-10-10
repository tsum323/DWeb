import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { SectionLabel } from '../components/ui/SectionLabel';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <section data-surface="dark" className={styles.page} aria-labelledby="nf-title">
      <Container>
        <SectionLabel index="404">Лист не найден</SectionLabel>
        <h1 id="nf-title" className={`t-display ${styles.title}`}>
          Такой страницы нет на&nbsp;чертеже
        </h1>
        <p className="t-body-l t-muted t-measure">
          Возможно, ссылка устарела или в адресе опечатка. Начните с главной — там все работы.
        </p>
        <div className={styles.actions}>
          <Button to="/">На главную</Button>
        </div>
      </Container>
    </section>
  );
}
