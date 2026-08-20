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
        }
      }
    },
    sourcemap: false,
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    // Warn on large chunks
    chunkSizeWarningLimit: 200,
    // Asset inlining: inline small assets (< 8KB) as base64 to reduce HTTP requests
    assetsInlineLimit: 8192,
  }
});
