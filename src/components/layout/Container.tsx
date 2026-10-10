import type { ComponentPropsWithoutRef, ElementType } from 'react';
import styles from './Container.module.css';

type ContainerProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

/** Ограничивает ширину контента и задаёт поля страницы. */
export function Container<T extends ElementType = 'div'>({ as, className, ...rest }: ContainerProps<T>) {
  const Tag = as ?? 'div';
  return <Tag className={[styles.container, className].filter(Boolean).join(' ')} {...rest} />;
}
