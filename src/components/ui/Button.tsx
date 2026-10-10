import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './Button.module.css';

type Common = {
  variant?: 'primary' | 'secondary';
  icon?: IconName | null;
  children: ReactNode;
};

type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'children'>;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, 'children'>;

/**
 * Кнопка-«ячейка»: текст и иконка разделены тонкой линией, как поля в штампе чертежа.
 * С href рендерится ссылкой, без него — кнопкой.
 */
export function Button(props: AsLink | AsButton) {
  const { variant = 'primary', icon = 'arrow-right', children, className, ...rest } = props;
  const cls = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      {icon && (
        <span className={styles.icon}>
          <Icon name={icon} size={18} />
        </span>
      )}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as ComponentPropsWithoutRef<'a'>)}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {inner}
    </button>
  );
}
