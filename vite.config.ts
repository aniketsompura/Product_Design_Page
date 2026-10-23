import { defineConfig } from 'vite';

// Relative asset paths so the build works from any folder (GitHub Pages, a CDN, a zip).
export default defineConfig({
  base: './',
});
