/* Импорт изображения с суффиксом ?…&as=picture возвращает набор вариантов
   (форматы × размеры) для элемента <picture>. Его создаёт vite-imagetools. */
declare module '*as=picture' {
  const picture: import('../components/media/Picture').PictureData;
  export default picture;
}
