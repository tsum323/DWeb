import { Route, Routes } from 'react-router';
import { CasePage } from '../pages/CasePage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SystemPage } from '../pages/SystemPage';
import { Layout } from './Layout';

/** Карта сайта. Служебная страница /system доступна только при разработке. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="work/:slug" element={<CasePage />} />
        {import.meta.env.DEV && <Route path="system" element={<SystemPage />} />}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
