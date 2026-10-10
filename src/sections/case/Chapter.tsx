import type { ReactNode } from 'react';
import { Col, Grid } from '../../components/layout/Grid';
import { Section } from '../../components/layout/Section';
import { typograph } from '../../lib/text';
import styles from './Chapter.module.css';

type ChapterProps = {
  id: string;
  index: string;
  label: string;
  title: string;
  body?: string[];
  surface?: 'dark' | 'light';
  /** Колонка справа от заголовка (например, паспорт проекта). */
  aside?: ReactNode;
  /** Материалы под текстом: скриншоты, образцы, списки. */
  children?: ReactNode;
};

/**
 * Глава кейса: слева номер и заголовок (на десктопе «прилипают» при прокрутке),
 * справа текст. Под ними — иллюстрации на всю ширину.
 */
export function Chapter({ id, index, label, title, body, surface = 'light', aside, children }: ChapterProps) {
  const titleId = `${id}-title`;
  return (
    <Section id={id} surface={surface} index={index} label={label} labelledBy={titleId}>
      <Grid className={styles.grid}>
        <Col span={{ sm: 4, md: 8, lg: 5 }}>
          <h2 id={titleId} className={`t-h2 ${styles.title}`}>
            {typograph(title)}
          </h2>
        </Col>
        <Col span={{ sm: 4, md: 8, lg: 6 }} start={{ lg: 7 }} className={styles.body}>
          {body?.map((p) => (
            <p key={p} className="t-body-l">
              {typograph(p)}
            </p>
          ))}
          {aside}
        </Col>
      </Grid>
      {children && <div className={styles.media}>{children}</div>}
    </Section>
  );
}
