// Proef M7 (Indexworld, 5 november 2026): "One code file of 385 KB contains the whole site."
// Veilige winst zonder ander beeld: React (react-dom/client, scheduler) staat in vendor, dat niet verandert als de site
// verandert. Het sitebrede bestand, dat bij elke publicatie een nieuwe naam krijgt, moet daardoor onder 260 KB blijven.
// Het totaal aan JavaScript voor de homepage mag niet groeien (grens: 125 KB brotli, was 121,7 KB op main 8cee616).
// Leest dist/, dus eerst npm run build.
import { existsSync, readFileSync } from "node:fs";
import { brotliCompressSync } from "node:zlib";

const DIST = process.env.DIST || "dist";
if (!existsSync(`${DIST}/index.html`)) { console.error("Geen dist/index.html: draai eerst npm run build."); process.exit(1); }
const html = readFileSync(`${DIST}/index.html`, "utf8");
const scripts = [...new Set([...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]))];
const maat = scripts.map((s) => { const b = readFileSync(`${DIST}${s}`); return { s, raw: b.length, br: brotliCompressSync(b).length, tekst: b.toString("utf8") }; });
const vendor = maat.find((m) => /\/vendor-/.test(m.s));
const site = maat.filter((m) => !/\/(vendor|ui|index)-/.test(m.s)).sort((a, b) => b.raw - a.raw)[0];
const totaalBr = maat.reduce((n, m) => n + m.br, 0);
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
// react-dom-client herken je aan de scheduler die hij aanroept (unstable_scheduleCallback).
const reactClient = (t) => /unstable_scheduleCallback/.test(t);
const eisen = [
  [`React-client staat in vendor (${vendor ? vendor.s : "geen vendor"})`, Boolean(vendor && reactClient(vendor.tekst) && !reactClient(site.tekst))],
  [`sitebreed bestand ${site.s} is ${kb(site.raw)} (grens 260 KB)`, site.raw < 260 * 1024],
  [`homepage-JavaScript samen ${kb(totaalBr)} brotli over ${maat.length} bestanden (grens 125 KB)`, totaalBr < 125 * 1024],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} van ${eisen.length} rood` : `alles groen (${eisen.length} eisen)`);
process.exit(fout ? 1 : 0);
