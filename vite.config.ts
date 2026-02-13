import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/socialnow-website/',
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
          'charts': ['recharts'],
          'smooth-scroll': ['lenis'],
        }
      }
    },
    sourcemap: false,
    target: 'es2020',
    minify: 'esbuild',
    // Warn on large chunks
    chunkSizeWarningLimit: 200,
  }
});
