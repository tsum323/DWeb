import type { ReactNode } from 'react';
import styles from './Actions.module.css';

/** Группа кнопок. На телефоне кнопки выстраиваются ровной колонкой на всю ширину. */
export function Actions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={[styles.actions, className].filter(Boolean).join(' ')}>{children}</div>;
}
