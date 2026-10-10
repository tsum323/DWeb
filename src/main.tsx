import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router';
import { AppRoutes } from './app/routes';
import './styles/global.css';

const container = document.getElementById('root');
if (!container) throw new Error('Не найден элемент #root');

// VITE_ROUTER=hash — сборка для превью, где сайт открыт не по адресу /dweb/.
const app = (
  <StrictMode>
    {import.meta.env.VITE_ROUTER === 'hash' ? (
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    ) : (
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    )}
  </StrictMode>
);

// В собранном сайте разметка уже есть в HTML (пререндер) — React её «оживляет».
// При разработке HTML пустой — React рисует всё с нуля.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
