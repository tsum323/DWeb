import type { CSSProperties, ComponentPropsWithoutRef, ElementType } from 'react';
import styles from './Grid.module.css';

type GridProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/** Сетка страницы: 4 колонки на телефоне, 8 на планшете, 12 на десктопе. */
export function Grid<T extends ElementType = 'div'>({ as, className, ...rest }: GridProps<T>) {
  const Tag = as ?? 'div';
  return <Tag className={[styles.grid, className].filter(Boolean).join(' ')} {...rest} />;
}

/** Ширина и начало колонки на каждой точке перелома: sm (до 640), md (640+), lg (1024+). */
type Responsive = { sm?: number; md?: number; lg?: number };

type ColProps<T extends ElementType> = {
  as?: T;
  span?: Responsive;
  start?: Responsive;
} & ComponentPropsWithoutRef<T>;

export function Col<T extends ElementType = 'div'>({ as, span, start, className, style, ...rest }: ColProps<T>) {
  const Tag = as ?? 'div';
  const vars = {
    '--span-sm': span?.sm,
    '--span-md': span?.md,
    '--span-lg': span?.lg,
    '--start-sm': start?.sm,
    '--start-md': start?.md,
    '--start-lg': start?.lg,
    ...style,
  } as CSSProperties;
  return <Tag className={[styles.col, className].filter(Boolean).join(' ')} style={vars} {...rest} />;
}
