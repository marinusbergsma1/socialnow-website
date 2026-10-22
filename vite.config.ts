import path from "path";
import { pathToFileURL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { startVastiqPreview } from "./scripts/vastiq-preview.mjs";
import woordenboekSplit from "./scripts/woordenboek-split.mjs";

export default defineConfig({
  base: "/",
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [
    {
      name: "local-vastiq-preview",
      apply: "serve",
      transformIndexHtml(html) {
        return html.replace("frame-src 'self' https:", "frame-src 'self' https: http://127.0.0.1:4330");
      },
      async configureServer() {
        await startVastiqPreview();
      },
    },
    // 30 september 2026: alleen de kern van elk woordenboek gaat mee in het eerste script (zie het bestand zelf).
    woordenboekSplit({ verslag: (v) => console.log(`[woordenboek] ${v.kern} van ${v.sleutels} zinnen in het eerste script, waarvan ${v.patroon.length} via een sjabloon; ${v.nergens} staan nergens letterlijk in de code`) }),
    react({ jsxImportSource: "@socialnow/i18n" }),
    // 22 oktober 2026: de check-functies (api/php-check.js, api/check-aanvraag.js) ook lokaal, in vite dev én vite preview.
    // Zonder dit gaf een lokale preview HTML terug op /api/php-check en zag de bezoeker "De check lukte niet".
    (() => {
      const koppel = (middlewares: { use: (pad: string, fn: (req: any, res: any) => void) => void }) => {
        for (const naam of ["php-check", "check-aanvraag", "check-rapport"]) {
          middlewares.use(`/api/${naam}`, async (req, res) => {
            const stukken: Buffer[] = [];
            for await (const s of req) stukken.push(s as Buffer);
            const { default: handler } = await import(pathToFileURL(path.resolve(__dirname, `api/${naam}.js`)).href);
            const r = Object.assign(req, { body: Buffer.concat(stukken).toString("utf8") });
            const uit = Object.assign(res, {
              status(code: number) { res.statusCode = code; return uit; },
              json(data: unknown) { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(data)); return uit; },
            });
            await handler(r, uit);
          });
        }
      };
      return { name: "local-check-api", configureServer: (server: any) => koppel(server.middlewares), configurePreviewServer: (server: any) => koppel(server.middlewares) };
    })(),
    {
      name: "socialnow-preview-routes",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (
            req.url &&
            /^\/voorstel(?:\/|\?|$)/.test(req.url) &&
            !req.url.split("?")[0].includes(".")
          ) {
            req.url = "/voorstel.html";
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@socialnow/i18n": path.resolve(__dirname,"proposal/i18n"),
    },
  },
  build: {
    rollupOptions: {
      input: { index: "index.html", voorstel: "voorstel.html" },
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["lucide-react"],
        },
      },
    },
    sourcemap: false,
    // 11 oktober 2026: geen modulepreload-polyfill in het eerste script; elke browser die de site ondersteunt kent
    // <link rel="modulepreload"> (Safari sinds 17), oudere laden gewoon zonder voorladen.
    modulePreload: { polyfill: false },
    target: "es2020",
    minify: "esbuild",
    cssMinify: true,
    // Warn on large chunks
    chunkSizeWarningLimit: 200,
    // Asset inlining: inline small assets (< 8KB) as base64 to reduce HTTP requests
    assetsInlineLimit: 8192,
  },
});
