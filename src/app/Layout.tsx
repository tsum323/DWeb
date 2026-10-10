import { Outlet } from 'react-router';
import { GridOverlay } from '../components/blueprint/GridOverlay';
import { Footer } from '../components/site/Footer';
import { Header } from '../components/site/Header';
import { useGridShortcut } from '../lib/gridOverlay';
import { useDocumentMeta } from '../seo/useDocumentMeta';
import { ScrollManager } from './ScrollManager';
import styles from './Layout.module.css';

/** Общий каркас всех страниц: ссылка пропуска, шапка, контент, подвал. */
export function Layout() {
  useGridShortcut();
  useDocumentMeta();

  return (
    <div id="top" className={styles.layout}>
      <a href="#main" className={styles.skip}>
        Перейти к содержимому
      </a>
      <Header />
      <main id="main" tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <GridOverlay />
      <ScrollManager />
    </div>
  );
}
