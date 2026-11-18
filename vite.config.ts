import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Served as a GitHub Pages project site: https://charanloyal.github.io/portfolio/
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2022',
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
