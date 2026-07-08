// GitHub Pages SPA-fix: geef elke route een echte index.html (status 200)
// en gebruik een kopie van de SPA als 404-fallback voor dynamische routes
// zoals /project/:slug.
import { mkdirSync, copyFileSync } from 'fs';

const routes = ['diensten', 'projecten', 'prijzen', 'privacy', 'team'];

for (const route of routes) {
  mkdirSync(`dist/${route}`, { recursive: true });
  copyFileSync('dist/index.html', `dist/${route}/index.html`);
}

copyFileSync('dist/index.html', 'dist/404.html');
console.log(`[postbuild] ${routes.length} route-pagina's + SPA 404-fallback geschreven`);
