import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';

// Сайт публикуется на GitHub Pages по адресу https://tsum323.github.io/DWeb/,
// поэтому все пути к ресурсам начинаются с /DWeb/ (регистр важен: так называется репозиторий).
// При переходе на свой домен достаточно заменить base на '/'.
export default defineConfig({
  base: '/DWeb/',
  // imagetools сжимает изображения при сборке: AVIF и WebP в нескольких размерах.
  plugins: [react(), imagetools()],
  css: {
    modules: {
      // Читаемые имена классов в разработке, короткие — в сборке.
      generateScopedName: process.env.NODE_ENV === 'production' ? '[hash:base64:6]' : '[name]__[local]',
    },
  },
});
