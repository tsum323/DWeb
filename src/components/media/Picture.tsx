import styles from './Picture.module.css';

/** Формат данных, который vite-imagetools отдаёт для ?as=picture. */
export type PictureData = {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
};

export type Image = {
  picture: PictureData;
  /** Описание для экранных дикторов и поисковиков. */
  alt: string;
};

type PictureProps = {
  image: Image;
  /** Какую ширину картинка занимает на экране — браузер выберет подходящий файл. */
  sizes: string;
  /** Изображения первого экрана грузятся сразу, остальные — по мере прокрутки. */
  priority?: boolean;
  className?: string;
};

const mime: Record<string, string> = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

export function Picture({ image, sizes, priority = false, className }: PictureProps) {
  const { sources, img } = image.picture;
  return (
    <picture className={[styles.picture, className].filter(Boolean).join(' ')}>
      {Object.entries(sources).map(([format, srcSet]) => (
        <source key={format} type={mime[format]} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        src={img.src}
        width={img.w}
        height={img.h}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}
