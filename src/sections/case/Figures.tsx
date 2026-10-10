import { Frame } from '../../components/media/Frame';
import type { Shot } from '../../content/schema';
import styles from './Figures.module.css';

type FiguresProps = {
  shots: { shot: Shot; number: number }[];
};

/**
 * Иллюстрации главы. Десктопные экраны — широкие, телефонные — узкие и стоят рядом.
 * Номер «рис. N» сквозной по странице кейса.
 */
export function Figures({ shots }: FiguresProps) {
  return (
    <div className={styles.figures}>
      {shots.map(({ shot, number }) => (
        <div key={shot.label + number} className={styles[shot.device]}>
          <Frame
            {...shot}
            sizes={
              shot.device === 'desktop' ? '(min-width: 64em) 80vw, 100vw' : '(min-width: 64em) 25vw, 45vw'
            }
          />
          {shot.caption && (
            <p className={`t-mono t-muted ${styles.caption}`}>
              рис. {number} — {shot.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
