import type { ReactNode } from 'react';
import { Container } from './Container';
import { SectionLabel } from '../ui/SectionLabel';
import styles from './Section.module.css';

type SectionProps = {
  id?: string;
  surface: 'dark' | 'light';
  /** Номер секции на «чертеже»: 01, 02… */
  index?: string;
  label?: string;
  /** Видимый или скрытый заголовок секции для навигации экранных дикторов. */
  labelledBy?: string;
  children: ReactNode;
  className?: string;
};

/** Секция страницы: задаёт поверхность, вертикальный ритм и подпись «01 / Раздел». */
export function Section({ id, surface, index, label, labelledBy, children, className }: SectionProps) {
  return (
    <section
      id={id}
      data-surface={surface}
      aria-labelledby={labelledBy}
      className={[styles.section, className].filter(Boolean).join(' ')}
    >
      <Container>
        {label && (
          <div className={`${styles.head} draw-line`} data-reveal="draw">
            <SectionLabel index={index}>{label}</SectionLabel>
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
