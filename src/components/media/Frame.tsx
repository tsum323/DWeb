import { Picture, type Image } from './Picture';
import styles from './Frame.module.css';

type FrameProps = {
  image: Image;
  /** Подпись слева в рамке: что показано. */
  label: string;
  /** Ширина экрана, на котором сделан снимок, — подпись справа. */
  viewport: number;
  device: 'desktop' | 'mobile';
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Скриншот в «чертёжной» рамке: тонкая линия и подписи — что за экран
 * и при какой ширине снят. Без имитации браузера или телефона.
 */
export function Frame({ image, label, viewport, device, sizes, priority, className }: FrameProps) {
  return (
    <figure className={[styles.frame, styles[device], className].filter(Boolean).join(' ')}>
      <figcaption className={`t-mono ${styles.bar}`}>
        <span className={styles.label}>{label}</span>
        <span className={styles.size}>{viewport} px</span>
      </figcaption>
      <Picture image={image} sizes={sizes} priority={priority} />
    </figure>
  );
}
