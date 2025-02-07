/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['mdb-react-ui-kit'],
  },
  css: {
    preprocessorOptions: {
      sass: {
        // This ensures that Vite uses the modern Sass API by default
        api: 'modern', 
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
  },
});
