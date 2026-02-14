import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['lucide-react'],
          // Recharts is ~180KB gzipped — isolate so it only loads on pages that need it
          'charts': ['recharts'],
        }
      }
    },
    sourcemap: false,
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    // Warn on large chunks
    chunkSizeWarningLimit: 200,
  }
});
