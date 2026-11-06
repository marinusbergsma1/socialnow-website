#!/usr/bin/env node
// Proef, Marinus 6 nov 2026 (na het live zetten van het 5 YEARS-logo): "Groene streep rechts zodat SocialNow mooi uitlijnt kan
// worden en 5 YEARS eronder." Rood op main vóór de wijziging, groen erna.
//   1. de groene gloed van de onderlijn van de header zit rechts, niet links onder het logo;
//   2. het woordmerk SocialNow staat op de middenlijn van het menu (zelfde hoogte als de knoppen);
//   3. 5 YEARS staat eronder en raakt de onderlijn niet (minstens 8 px ruimte), ook tijdens de intro.
// Gebruik: npm run build && PLAYWRIGHT_CORE=<pad naar playwright-core/index.mjs> BROWSER_CHANNEL=chrome node scripts/proef-header-5years-uitlijning.mjs
//          (of met --url https://socialnow.nl om de live site te meten)
import fs from "node:fs";
import { spawn } from "node:child_process";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const urlArg = process.argv.indexOf("--url");
let basis = urlArg > 0 ? process.argv[urlArg + 1] : null, server;
if (!basis) {
  if (!fs.existsSync("dist/index.html")) { console.error("Geen dist/: draai eerst npm run build."); process.exit(1); }
  basis = "http://localhost:4393";
  server = spawn("node_modules/.bin/vite", ["preview", "--port", "4393", "--strictPort"], { stdio: "ignore" });
  for (let i = 0; i < 60; i++) { try { await fetch(basis); break; } catch { await new Promise((r) => setTimeout(r, 250)); } }
}
const WM = 113 / 176;
// Leest een png van één pixel hoog en geeft per pixel groen min rood (de groene streep is #25d366, de rest zwart of grijs).
import { inflateSync } from "node:zlib";
function rijGroen(png) {
  let breed = 0, kleur = 0; const idat = [];
  for (let o = 8; o < png.length;) {
    const len = png.readUInt32BE(o), type = png.toString("ascii", o + 4, o + 8), d = png.subarray(o + 8, o + 8 + len);
    if (type === "IHDR") { breed = d.readUInt32BE(0); kleur = d[9]; } else if (type === "IDAT") idat.push(d);
    o += 12 + len;
  }
  const bpp = kleur === 6 ? 4 : 3, raw = inflateSync(Buffer.concat(idat)), f = raw[0], rij = Buffer.from(raw.subarray(1, 1 + breed * bpp));
  for (let i = 0; i < rij.length; i++) { // filters voor de eerste rij: de rij erboven is nul
    const a = i >= bpp ? rij[i - bpp] : 0;
    if (f === 1) rij[i] = (rij[i] + a) & 255; else if (f === 3) rij[i] = (rij[i] + (a >> 1)) & 255; else if (f === 4) rij[i] = (rij[i] + a) & 255;
  }
  return Array.from({ length: breed }, (_, i) => rij[i * bpp + 1] - rij[i * bpp]);
} // woordmerk = bovenste 113 van de 176 beeldpunten van public/5jaar/logo-5years.webp (zie BRON.md)
try {
  const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome" });
  for (const w of [1440, 900, 760, 390, 320]) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } });
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto(basis + "/", { waitUntil: "load" }); await p.waitForTimeout(1000);
    const m = await p.evaluate((WM) => {
      const h = document.querySelector(".sn-site>.h-header"), img = h.querySelector(".h-brand img");
      const knop = h.querySelector(".h-header-claim"), hb = h.getBoundingClientRect(), a = img.getBoundingClientRect(), k = knop.getBoundingClientRect();
      return { H: hb.height, navMid: k.y + k.height / 2, wmMid: a.y + a.height * WM / 2, badgeOnder: a.y + a.height, x: a.x };
    }, WM);
    const shot = await p.screenshot({ clip: { x: 0, y: Math.round(m.H) - 1, width: w, height: 1 } });
    const groen = rijGroen(shot);
    const px = groen.length; const gem = (a, b) => { let s = 0; for (let i = a; i < b; i++) s += groen[i]; return s / (b - a); };
    const links = gem(0, Math.round(px * 0.15)), rechts = gem(Math.round(px * 0.85), px);
    eis(rechts > links + 20, `${w}px: groene streep rechts (groen links ${links.toFixed(0)}, rechts ${rechts.toFixed(0)})`);
    eis(Math.abs(m.wmMid - m.navMid) <= 1.5, `${w}px: SocialNow op de middenlijn van het menu (woordmerk ${m.wmMid.toFixed(1)}, menu ${m.navMid.toFixed(1)})`);
    eis(m.H - m.badgeOnder >= 8, `${w}px: 5 YEARS eronder met ruimte tot de streep (${(m.H - m.badgeOnder).toFixed(1)} px)`);
    await p.close();
  }
  { // tijdens de intro ligt de animatie nog steeds precies over het logo
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(basis + "/"); await p.waitForTimeout(900);
    const d = await p.evaluate(() => {
      const img = document.querySelector(".h-header .h-brand img"), v = document.querySelector(".h-header .h-brand-intro");
      if (!v) return null; const a = img.getBoundingClientRect(), b = v.getBoundingClientRect();
      return [b.x - (a.x - a.width * 150 / 624), b.y - (a.y - a.height * 48 / 176)];
    });
    eis(d && Math.abs(d[0]) <= 1 && Math.abs(d[1]) <= 1, `intro valt precies over het logo (afwijking ${d ? d.map((n) => n.toFixed(1)) : "geen intro"})`);
    await p.close();
  }
  await browser.close();
} finally { server?.kill(); }
console.log(fouten.length ? `\n${fouten.length} rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
