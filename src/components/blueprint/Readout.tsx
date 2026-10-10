import { breakpointFor, useViewport } from '../../lib/viewport';

/**
 * Живая строка параметров экрана: «1440 × 900 · ноутбук · 12 кол.»
 * Маленькая демонстрация того, что вёрстка продумана под каждый размер.
 */
export function Readout({ className }: { className?: string }) {
  const viewport = useViewport();
  const text = viewport
    ? (() => {
        const bp = breakpointFor(viewport.width);
        return `${viewport.width} × ${viewport.height} · ${bp.name} · ${bp.columns} кол.`;
      })()
    : '— × — · сетка';

  return (
    <p className={['t-mono t-muted', className].filter(Boolean).join(' ')}>
      <span className="visually-hidden">Параметры экрана: </span>
      {text}
    </p>
  );
}
