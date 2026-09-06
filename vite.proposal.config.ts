import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Afzonderlijke build: het voorstel komt niet in de productie-ingang of sitemap.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist-proposal',
    rollupOptions: { input: 'voorstel.html' },
  },
});
