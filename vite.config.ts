import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Сайт публикуется на GitHub Pages по адресу https://tsum323.github.io/dweb/,
// поэтому все пути к ресурсам начинаются с /dweb/.
// При переходе на свой домен достаточно заменить base на '/'.
export default defineConfig({
  base: '/dweb/',
  plugins: [react()],
  css: {
    modules: {
      // Читаемые имена классов в разработке, короткие — в сборке.
      generateScopedName: process.env.NODE_ENV === 'production' ? '[hash:base64:6]' : '[name]__[local]',
    },
  },
});
