// Lokale server: serveert public/ en draait api/*.js zoals Vercel dat doet.
// Zonder Google-sleutels in je omgeving draait hij met de voorbeeldagenda.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const map = fileURLToPath(new URL("..", import.meta.url));
const poort = Number(process.env.PORT || 5191);
const soorten = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) {
    const naam = url.pathname.slice(5).replace(/[^a-z-]/g, "");
    let tekst = "";
    for await (const deel of req) tekst += deel;
    req.query = Object.fromEntries(url.searchParams);
    req.body = tekst;
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (j) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(j)); return res; };
    try {
      const { default: handler } = await import(pathToFileURL(join(map, "api", `${naam}.js`)).href);
      return await handler(req, res);
    } catch (f) {
      res.statusCode = 404;
      return res.end(String(f.message));
    }
  }
  const pad = normalize(!extname(url.pathname) ? "/index.html" : url.pathname).replace(/^(\.\.[/\\])+/, "");
  try {
    const inhoud = await readFile(join(map, "public", pad));
    res.setHeader("content-type", soorten[extname(pad)] || "application/octet-stream");
    res.end(inhoud);
  } catch {
    res.statusCode = 404;
    res.end("niet gevonden");
  }
}).listen(poort, () => console.log(`boeken op http://localhost:${poort}`));
