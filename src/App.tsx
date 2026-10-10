import { GridOverlay } from './components/blueprint/GridOverlay';
import { useGridShortcut } from './lib/gridOverlay';
import { SystemPage } from './pages/SystemPage';

export function App() {
  useGridShortcut();
  return (
    <>
      <SystemPage />
      <GridOverlay />
    </>
  );
}
