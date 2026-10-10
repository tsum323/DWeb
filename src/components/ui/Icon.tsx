import type { SVGProps } from 'react';

/* Собственный небольшой набор иконок в одной манере (линия 1.5px, сетка 24px).
   Пять иконок дешевле и точнее по стилю, чем внешняя библиотека. */

const paths = {
  'arrow-right': 'M4 12h15M13 6l6 6-6 6',
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  'arrow-down': 'M12 4v15M6 13l6 6 6-6',
  menu: 'M3 8h18M3 16h18',
  close: 'M5 5l14 14M19 5 5 19',
  copy: 'M8 8h11v11H8zM5 16V5h11',
  check: 'M4 12.5 9.5 18 20 6',
} as const;

export type IconName = keyof typeof paths;

type IconProps = { name: IconName; size?: number } & SVGProps<SVGSVGElement>;

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
