import type { Project } from '../../content/schema';
import { Frame } from '../media/Frame';
import styles from './CoverVisual.module.css';

type CoverVisualProps = {
  cover: Project['media']['cover'];
  /** Обложка первого экрана кейса грузится сразу; в списке работ — по мере прокрутки. */
  priority?: boolean;
  className?: string;
};

/** Композиция «десктоп + телефон»: телефон наезжает на правый нижний угол десктопа. */
export function CoverVisual({ cover, priority, className }: CoverVisualProps) {
  return (
    <div className={[styles.visual, className].filter(Boolean).join(' ')}>
      <Frame
        {...cover.desktop}
        className={styles.desktop}
        sizes="(min-width: 64em) 75vw, 100vw"
        priority={priority}
      />
      <Frame
        {...cover.mobile}
        className={styles.mobile}
        sizes="(min-width: 64em) 18vw, 40vw"
        priority={priority}
      />
    </div>
  );
}
