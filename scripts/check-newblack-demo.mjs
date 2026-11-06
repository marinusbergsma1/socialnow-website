#!/usr/bin/env node
// Proef (6 nov 2026, Marinus: NEW BLACK als demo op een socialnow.nl-subdomein, alle logo's weer werkend).
// Het origineel (newblack.netlify.app) haalt al zijn beelden van i.ibb.co; die gaf 503's, dus kapotte logo's in de
// "Global Reference Network"-balk. De demo staat nu op newblack-demo.socialnow.nl met alle beelden zelf gehost.
// Eisen: 1) project newblack-website linkt naar https://newblack-demo.socialnow.nl/ (niet meer naar netlify);
//        2) hero- en full-screenshot zijn opnieuw vastgelegd (1440x900 en 1440 breed), niet meer de oude opname
//           met ontbrekende logo's en Omnichannel-foto;
//        3) live: de demo geeft 200, staat op noindex (meta + X-Robots-Tag), robots.txt Disallow: /,
//           en de app-bundel bevat geen enkele i.ibb.co-URL meer; elke /img/-verwijzing geeft 200.
// Gebruik: node scripts/check-newblack-demo.mjs   (rood op main, groen met de wijziging)
//          OFFLINE=1 slaat eis 3 over.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const DEMO = "https://newblack.client-demo.socialnow.nl/"; // sinds 6 nov 2026; newblack-demo.socialnow.nl geeft een 301
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };

const projects = readFileSync("data/projects.ts", "utf8");
const blok = projects.slice(projects.indexOf('slug: "newblack-website"'), projects.indexOf('slug: "newblack-website"') + 1200);
eis(blok.includes(`url: "${DEMO}"`), `newblack-website linkt naar ${DEMO}`);
eis(!/newblack\.netlify\.app/.test(projects), "geen link meer naar newblack.netlify.app");

// Oude opnames (main tot 6 nov 2026): logo-balk half leeg, Omnichannel-foto ontbrak.
const OUD = {
  "public/screenshots/newblack-hero.webp": "b8410f1a41f10f017eb8d73e9a0325a238e47f2e574bdc2087a063bbd6b08a29",
  "public/screenshots/newblack-full.webp": "5b344859df1fca734efb8804ae40808a0584f37d8625cba30ffa31c94755c003",
};
const webpMaat = (buf) => {
  const soort = buf.toString("ascii", 12, 16);
  if (soort === "VP8X") return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
  if (soort === "VP8 ") return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (soort === "VP8L") { const b = buf.readUInt32LE(21); return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)]; }
  return [0, 0];
};
for (const [pad, oudeHash] of Object.entries(OUD)) {
  const buf = existsSync(pad) ? readFileSync(pad) : Buffer.alloc(0);
  const [b, h] = buf.length ? webpMaat(buf) : [0, 0];
  const hero = pad.includes("hero");
  eis(createHash("sha256").update(buf).digest("hex") !== oudeHash && b === 1440 && (hero ? h === 900 : h > 2000),
    `${pad} opnieuw vastgelegd (${b}x${h}, ${hero ? "1440x900" : "1440 breed, volle pagina"})`);
}

if (!process.env.OFFLINE) {
  try {
    const res = await fetch(DEMO);
    const html = await res.text();
    eis(res.ok, `${DEMO} geeft 200`);
    eis(/<meta name="robots" content="noindex, nofollow">/.test(html), "meta robots noindex, nofollow");
    eis(/noindex/i.test(res.headers.get("x-robots-tag") || ""), "X-Robots-Tag noindex");
    const robots = await (await fetch(new URL("/robots.txt", DEMO))).text();
    eis(/Disallow:\s*\/\s*$/m.test(robots), "robots.txt Disallow: /");
    const js = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
    const bundel = js ? await (await fetch(new URL(js, DEMO))).text() : "";
    eis(bundel.length > 0 && !/ibb\.co/.test(bundel + html), "geen i.ibb.co-URL in html of app-bundel");
    const beelden = [...new Set((bundel + html).match(/\/img\/[\w.-]+\.(?:png|jpe?g|webp)/g) || [])];
    const stuk = [];
    for (const b of beelden) { const r = await fetch(new URL(b, DEMO), { method: "HEAD" }); if (!r.ok) stuk.push(`${r.status} ${b}`); }
    eis(beelden.length >= 23 && stuk.length === 0, `alle ${beelden.length} zelf gehoste beelden geven 200${stuk.length ? `: ${stuk.join(", ")}` : ""}`);
  } catch (e) {
    eis(false, `demo bereikbaar (${e.message})`);
  }
}

if (fouten.length) { console.error(`\n${fouten.length} eis(en) rood`); process.exit(1); }
console.log("\nalles groen");
