// 30 september 2026 (Marinus: "site VEEL SNELLER, WIL ECHT INSTANT LOADING"). Zonder JavaScript was
// elke pagina leeg: het eerste beeld wachtte op ruim 300 KB script en 275 KB blokkerende CSS. Deze stap
// draait na postbuild en localize-build en doet per route-HTML uit de sitemap, per taal:
// 1. de echte inhoud van de app in #root zetten (index.tsx hydrateert die in de browser);
// 2. de CSS die deze pagina gebruikt inline in de head zetten en de volledige stylesheet zonder
//    blokkeren laten laden (Beasties);
// 3. het logo in de header, de achtergrond van de hero en de letter van de kop (TT Norms Bold) vooraf laden.
//
// De 404-pagina en de oude /it- en /es-doorverwijzingen blijven leeg: daar weet de server niet welke
// route de bezoeker opent. Proef: scripts/proef-prerender.mjs.
import { readFileSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import Beasties from "beasties";

const root = process.cwd();
const uit = path.join(root, "dist-ssr");

// Dezelfde JSX-vertaallaag en aliassen als vite.config.ts; de knip in vendor-chunks hoort alleen bij de
// browserbundel en breekt een SSR-bouw waarin react extern blijft.
await build({
  configFile: false,
  logLevel: "warn",
  plugins: [react({ jsxImportSource: "@socialnow/i18n" })],
  resolve: {
    alias: {
      "@": root,
      "@socialnow/i18n": path.join(root, "proposal/i18n"),
    },
  },
  publicDir: false,
  build: {
    ssr: "prerender-entry.tsx",
    outDir: uit,
    emptyOutDir: true,
    target: "node20",
    minify: false,
    rollupOptions: { output: { format: "es", entryFileNames: "prerender-entry.mjs" } },
  },
});

const { render, allesVooraf } = await import(pathToFileURL(path.join(uit, "prerender-entry.mjs")).href);
// Secties onder de vouw en de andere pagina's laden in de browser later (proposal/later.tsx); hier eerst allemaal.
await allesVooraf();

// React 19 zet voor elke afbeelding zonder loading="lazy" een eigen preload vooraan in de HTML, ook voor
// het logo in de gesloten QR-dialoog. Op een trage lijn duwen die veertien verzoeken de letter en het
// script naar achteren; de afbeeldingen laden gewoon via hun eigen <img>.
const REACT_BEELDPRELOADS = /^(?:<link rel="preload" as="image"[^>]*\/>)+/;
const kopLetter = readdirSync("dist/assets").find((f) => /^TTNorms-Bold-.*\.woff2$/.test(f));
if (!kopLetter) throw new Error("[prerender] TTNorms-Bold woff2 ontbreekt in dist/assets");
const LETTER = `<link rel="preload" href="/assets/${kopLetter}" as="font" type="font/woff2" crossorigin />`;
// Een beeld vooraf laden zoals de pagina het zelf zou kiezen: met srcset en sizes als de <img> die heeft.
const attr = (tag, naam) => tag.match(new RegExp(`\\s${naam}="([^"]*)"`))?.[1];
function beeldVooraf(tag) {
  if (!tag) return "";
  const src = attr(tag, "src");
  const srcset = attr(tag, "srcSet") || attr(tag, "srcset");
  const sizes = attr(tag, "sizes");
  return `\n    <link rel="preload" href="${src}" as="image"${srcset ? ` imagesrcset="${srcset}"` : ""}${sizes ? ` imagesizes="${sizes}"` : ""} fetchpriority="high" />`;
}

const beasties = new Beasties({
  path: path.join(root, "dist"),
  publicPath: "/",
  // De volledige stylesheet laadt als preload en wordt stylesheet zodra hij binnen is; zonder JS via noscript.
  preload: "swap",
  noscriptFallback: true,
  pruneSource: false,
  // Alleen de @font-face-regels die de pagina gebruikt, zonder de letters zelf in te bakken.
  inlineFonts: true,
  preloadFonts: false,
  keyframes: "critical",
  // Beasties herkent :is(), :where() en :has() niet en liet die regels vallen; in de hero verschoof het
  // teamblok daardoor 10 px zodra de volledige CSS binnenkwam. Samen nog geen 2,5 KB, dus altijd mee.
  allowRules: [/:is\(/, /:where\(/, /:has\(/],
  compress: true,
  reduceInlineStyles: false,
  logLevel: "warn",
});

const LEEG = '<div id="root"></div>';
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
const paden = [...new Set([...sitemap.matchAll(/<loc>https:\/\/socialnow\.nl([^<]*)<\/loc>/g)].map((m) => m[1] || "/"))];
let aantal = 0;
const fouten = [];
for (const pad of paden) {
  const taal = pad.match(/^\/(nl|de|fr|es|it|pt|pl|sv|da|tr|ja)(?=\/|$)/)?.[1] || "en";
  const bestand = `dist${pad === "/" ? "" : pad.replace(/\/$/, "")}/index.html`;
  const html = readFileSync(bestand, "utf8");
  if (!html.includes(LEEG)) { fouten.push(`${bestand}: geen lege root`); continue; }
  let inhoud;
  try {
    inhoud = render(pad, taal).replace(REACT_BEELDPRELOADS, "");
  } catch (fout) {
    fouten.push(`${pad}: ${fout?.message || fout}`);
    continue;
  }
  // Het logo in de kop, en op de homepage de achtergrond van de hero (het beeldmerk achter de wereldbol,
  // het grootste beeld in de eerste schermhoogte en dus de Largest Contentful Paint).
  const logo = inhoud.match(/<a class="h-brand"[^>]*><img[^>]*>/)?.[0].replace(/^<a[^>]*>/, "");
  const achtergrond = inhoud.match(/<img class="brand-globe-fallback"[^>]*>/)?.[0];
  const vooraf = LETTER + beeldVooraf(logo) + beeldVooraf(achtergrond);
  const metInhoud = html
    .replace(/<meta charset="UTF-8" \/>/, `$&\n    ${vooraf}`)
    .replace(LEEG, `<div id="root" data-prerender="${taal}">${inhoud}</div>`);
  writeFileSync(bestand, await beasties.process(metInhoud));
  aantal++;
}
rmSync(uit, { recursive: true, force: true });
if (fouten.length) {
  console.error("[prerender] mislukt:\n" + fouten.join("\n"));
  process.exit(1);
}
console.log(`[prerender] ${aantal} pagina's met echte HTML en inline kritieke CSS geschreven`);
