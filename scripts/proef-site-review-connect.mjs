// Proef M10 (Indexworld, 5 november 2026): "/connect has lang=nl while the whole site is English, no canonical, not in the sitemap."
// De pagina gaat 15 november live. Leest dist/, dus eerst npm run build.
import { existsSync, readFileSync } from "node:fs";

if (!existsSync("dist/connect/index.html")) { console.error("Geen dist/connect/index.html: draai eerst npm run build."); process.exit(1); }
const html = readFileSync("dist/connect/index.html", "utf8");
const kaart = readFileSync("dist/sitemap.xml", "utf8");
const zichtbaar = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
const eisen = [
  ["lang is en", /<html lang="en">/.test(html)],
  ["canonical naar https://socialnow.nl/connect", /<link rel="canonical" href="https:\/\/socialnow\.nl\/connect" \/>/.test(html)],
  ["niet op noindex of none, ook niet voor googlebot (anders hoort hij niet in de sitemap)", !/<meta\s+name="(?:robots|googlebot)"\s+content="[^"]*\b(?:noindex|none)\b/i.test(html.replace(/<!--[\s\S]*?-->/g, ""))],
  ["geen ontwikkelcommentaar over deze review in de gepubliceerde HTML", !/Indexworld M\d/.test(html)],
  ["staat in de sitemap", kaart.includes("<loc>https://socialnow.nl/connect</loc>")],
  ["sitemap blijft geldige xml (één urlset)", (kaart.match(/<\/urlset>/g) || []).length === 1],
  ["geen negatieve letterafstand", !/letter-spacing:\s*-/.test(html)],
  ["geen Nederlandse productteksten", !/\b(jouw|bedrijf|Bekijk|Meld je|Naar socialnow|Aanmelden|losse opdracht)\b/.test(zichtbaar)],
  ["geen modelnamen", !/\bClaude\b/i.test(zichtbaar)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} van ${eisen.length} rood` : `alles groen (${eisen.length} eisen)`);
process.exit(fout ? 1 : 0);
