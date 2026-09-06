import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [
    react({ jsxImportSource: "@socialnow/i18n" }),
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
    target: "es2020",
    minify: "esbuild",
    cssMinify: true,
    // Warn on large chunks
    chunkSizeWarningLimit: 200,
    // Asset inlining: inline small assets (< 8KB) as base64 to reduce HTTP requests
    assetsInlineLimit: 8192,
  },
});
