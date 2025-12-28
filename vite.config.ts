import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Ensures compatibility with older browsers if needed, but modern defaults are usually fine
    target: 'esnext',
  },
  // Ensure base is relative for flexible deployment (works well for both CF Pages and GitHub Pages)
  base: './',
});