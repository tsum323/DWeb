import type { ComponentPropsWithoutRef } from 'react';
import { Icon } from './Icon';
import styles from './TextLink.module.css';

type TextLinkProps = ComponentPropsWithoutRef<'a'> & {
  /** Внешняя ссылка: откроется в новой вкладке и получит значок ↗. */
  external?: boolean;
};

export function TextLink({ external, className, children, ...rest }: TextLinkProps) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a className={[styles.link, className].filter(Boolean).join(' ')} {...externalProps} {...rest}>
      <span className={styles.text}>{children}</span>
      {external && (
        <>
          <Icon name="arrow-up-right" size={16} className={styles.icon} />
          <span className="visually-hidden"> (откроется в новой вкладке)</span>
        </>
      )}
    </a>
  );
}
