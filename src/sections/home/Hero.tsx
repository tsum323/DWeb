import { Link } from 'react-router';
import { GridToggle } from '../../components/blueprint/GridToggle';
import { Readout } from '../../components/blueprint/Readout';
import { Stamp } from '../../components/blueprint/Stamp';
import { Container } from '../../components/layout/Container';
import { Col, Grid } from '../../components/layout/Grid';
import { Actions } from '../../components/ui/Actions';
import { Button } from '../../components/ui/Button';
import { SectionLabel } from '../../components/ui/SectionLabel';
import styles from './Hero.module.css';

/** Первый экран. Заголовок утверждён на этапе A. */
export function Hero() {
  return (
    <section data-surface="dark" className={styles.hero} aria-labelledby="hero-title">
      <Container className={styles.inner}>
        <div>
          <div className={styles.top}>
            <SectionLabel>DWeb — сайты и интерфейсы</SectionLabel>
            <GridToggle />
          </div>
          <h1 id="hero-title" className={`t-display ${styles.title}`} data-reveal="lines">
            Сайты для бизнеса&nbsp;— продуманные от&nbsp;сетки до&nbsp;кода
          </h1>
          <Grid className={styles.grid} data-reveal="stagger">
            <Col span={{ sm: 4, md: 8, lg: 7 }}>
              <p className={`t-body-l t-measure ${styles.lead}`}>
                Проектирую и разрабатываю сайты для небольшого бизнеса: от структуры и дизайна до адаптивной
                вёрстки и запуска.
              </p>
              <Actions>
                <Button to="/#work">Смотреть работы</Button>
                <Button to="/#contact" variant="secondary">
                  Обсудить проект
                </Button>
              </Actions>
            </Col>
            <Col span={{ sm: 4, md: 8, lg: 4 }} start={{ lg: 9 }}>
              <Stamp
                rows={[
                  { term: 'Специализация', value: 'Сайты для бизнеса' },
                  { term: 'Статус', value: 'Принимаю проекты' },
                  { term: 'Формат', value: 'Дизайн + разработка' },
                  { term: 'Стек', value: 'HTML, CSS, JavaScript' },
                ]}
              />
            </Col>
          </Grid>
        </div>
        <div className={`${styles.foot} draw-line`} data-reveal="draw">
          <Readout />
          <Link to="/#work" className={`t-mono t-muted ${styles.next}`}>
            ↓ 01 / Работы
          </Link>
        </div>
      </Container>
    </section>
  );
}
