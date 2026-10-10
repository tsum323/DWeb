import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { nav } from '../../content/site';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import styles from './MobileMenu.module.css';

type MobileMenuProps = { open: boolean; onClose: () => void };

/**
 * Полноэкранное меню на базе <dialog>: браузер сам удерживает фокус внутри,
 * закрывает по Esc и делает остальную страницу недоступной для клика.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Переход по ссылке закрывает меню.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash]);

  return (
    <dialog ref={ref} className={styles.menu} data-surface="dark" aria-label="Меню" onClose={onClose}>
      <div className={styles.top}>
        <Logo />
        <button type="button" className={`${styles.close} t-mono`} onClick={onClose}>
          Закрыть
          <Icon name="close" size={20} />
        </button>
      </div>

      <nav aria-label="Меню сайта" className={styles.nav}>
        <ol role="list" className={styles.list}>
          {nav.map((item, i) => (
            <li key={item.href} className={styles.item}>
              <Link to={item.href} className={styles.link} onClick={onClose}>
                <span className={`t-mono ${styles.index}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className="t-h2">{item.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <Link to="/#contact" className={styles.cta} onClick={onClose}>
        Обсудить проект
        <Icon name="arrow-right" size={18} />
      </Link>
    </dialog>
  );
}
