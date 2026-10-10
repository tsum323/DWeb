import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { nav } from '../../content/site';
import { Container } from '../layout/Container';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { MobileMenu } from './MobileMenu';
import styles from './Header.module.css';

/**
 * Шапка сайта.
 * — Прячется при прокрутке вниз и возвращается при прокрутке вверх.
 * — Берёт цвета той секции, над которой находится (тёмная или светлая).
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [surface, setSurface] = useState<'dark' | 'light'>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      const header = ref.current;
      if (!header) return;

      // Прятать только после первого экрана шапки и при заметном движении вниз.
      if (Math.abs(y - lastY) > 4) {
        setHidden(y > lastY && y > header.offsetHeight * 2);
        lastY = y;
      }
      setScrolled(y > 8);

      // Какая секция сейчас под шапкой?
      const probeY = header.offsetHeight / 2;
      const under = document
        .elementsFromPoint(window.innerWidth / 2, probeY)
        .find((el) => !header.contains(el))
        ?.closest<HTMLElement>('[data-surface]');
      const next = under?.dataset.surface === 'light' ? 'light' : 'dark';
      setSurface(next);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return (
    <header
      ref={ref}
      className={styles.header}
      data-surface={surface}
      data-hidden={hidden && !menuOpen}
      data-scrolled={scrolled}
    >
      <Container className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="DWeb — на главную">
          <Logo />
        </Link>

        <nav aria-label="Основная навигация" className={styles.nav}>
          <ul role="list" className={styles.links}>
            {nav.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link to="/#contact" className={styles.cta}>
          Обсудить проект
          <Icon name="arrow-right" size={16} />
        </Link>

        <button
          type="button"
          className={`${styles.menuButton} t-mono`}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          Меню
          <Icon name="menu" size={20} />
        </button>
      </Container>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
