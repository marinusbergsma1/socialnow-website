import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';

// Afzonderlijke build: het voorstel komt niet in de productie-ingang of sitemap.
export default defineConfig({
  base: '/',
  plugins: [react({jsxImportSource: "@socialnow/i18n"})],
  resolve: {alias: {"@socialnow/i18n": path.resolve(process.cwd(), "proposal/i18n")}},
  build: {
    outDir: 'dist-proposal',
    rollupOptions: { input: 'voorstel.html' },
  },
});
