// Proef partnertegels (11 oktober 2026, Marinus bij een schermafdruk van de tegels SocialNow, Attesso en Fincer:
// "deze tiles moeten nog aangepast en zitten letters nog met elkaar verbonden op mobiel").
// Vaste regel: partnertegels altijd als de donkere kaarten van het story-document (business.socialnow.nl/hossam.html,
// bron presentatie-jeroen-20261008/deploy/middleware.js, .team-duo). Donkere kaarten op #06080d, hoek 20px,
// SocialNow × Komen #102219→#09140e rand #37915b, ~/attesso als mono-tekst #f3c6e8 #251a28→#100d14 rand #925789,
// Fincer (fincer-wit.png) #162137→#0c1320 rand #4776aa. Nooit een vlakje achter een logo, geen lichte tegels.
// Namen en functies in de merkletter (niet in vette mono), woordafstand >= 0,24 em, geen woordbreuk midden in een naam.
// Geldt voor de homepage (.h-duo) en /team (.h-team-duo), op 375 en 1440.
// Leest de bouw in dist/, dus eerst npm run build. PLAYWRIGHT_CORE en BROWSER_CHANNEL=chrome zoals de andere proeven.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (!existsSync("dist/nl/index.html")) {
  console.error("Geen dist/nl/index.html: draai eerst npm run build.");
  process.exit(1);
}

const KAARTEN = {
  sn: { naam: "SocialNow × Komen", van: "rgb(16, 34, 25)", tot: "rgb(9, 20, 14)", rand: "rgb(55, 145, 91)" },
  attesso: { naam: "Attesso", van: "rgb(37, 26, 40)", tot: "rgb(16, 13, 20)", rand: "rgb(146, 87, 137)" },
  fincer: { naam: "Fincer", van: "rgb(22, 33, 55)", tot: "rgb(12, 19, 32)", rand: "rgb(71, 118, 170)" },
};
const PAGINAS = [
  { route: "/nl/", houder: ".h-team-kern", tegel: ".h-duo", kop: ".h-duo-kop", soort: { sn: ".is-sn", attesso: ".is-attesso", fincer: ".is-fincer" } },
  { route: "/nl/team/", houder: ".h-teams-duo", tegel: ".h-team-duo", kop: ".h-team-duo-label", soort: { sn: ".is-socialnow", attesso: ".is-attesso", fincer: ".is-fincer" } },
];
const BREEDTES = [375, 1440];
const eisen = [];

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".otf": "font/otf", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".json": "application/json" };
const server = createServer((req, res) => {
  let p = path.join("dist", decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright");
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
  for (const breedte of BREEDTES) {
    const context = await browser.newContext({ viewport: { width: breedte, height: 900 }, reducedMotion: "reduce" });
    await context.route("**/*", (route) => (new URL(route.request().url()).origin === base ? route.continue() : route.abort()));
    const page = await context.newPage();
    for (const pag of PAGINAS) {
      await page.goto(`${base}${pag.route}`);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      await page.locator(pag.houder).first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const r = await page.evaluate(({ pag, KAARTEN }) => {
        const uit = [];
        const eis = (naam, ok) => uit.push([naam, !!ok]);
        const houder = document.querySelector(pag.houder);
        eis(`houder ${pag.houder} bestaat`, houder);
        if (!houder) return uit;
        eis(`houder ${pag.houder} is #06080d (nu ${getComputedStyle(houder).backgroundColor})`, getComputedStyle(houder).backgroundColor === "rgb(6, 8, 13)");
        const leeg = (c) => (c.backgroundColor === "rgba(0, 0, 0, 0)" || c.backgroundColor === "transparent") && c.backgroundImage === "none";
        for (const [sleutel, k] of Object.entries(KAARTEN)) {
          const t = houder.querySelector(`${pag.tegel}${pag.soort[sleutel]}`);
          eis(`${k.naam}: tegel bestaat`, t);
          if (!t) continue;
          const c = getComputedStyle(t);
          eis(`${k.naam}: donker verloop ${k.van}→${k.tot} (nu ${c.backgroundImage.slice(0, 70)} / ${c.backgroundColor})`, c.backgroundImage.includes(k.van) && c.backgroundImage.includes(k.tot));
          eis(`${k.naam}: rand ${k.rand} (nu ${c.borderTopColor})`, c.borderTopColor === k.rand && parseFloat(c.borderTopWidth) >= 1);
          eis(`${k.naam}: hoek 20px (nu ${c.borderTopLeftRadius})`, c.borderTopLeftRadius === "20px");
          // Kop met logo: nergens een vlak achter het logo.
          const kop = t.querySelector(pag.kop);
          eis(`${k.naam}: kop bestaat`, kop);
          if (kop) {
            const vlakken = [kop, ...kop.querySelectorAll("*")].filter((el) => !leeg(getComputedStyle(el)));
            eis(`${k.naam}: geen vlak achter het logo (${vlakken.map((el) => `${el.tagName.toLowerCase()} ${getComputedStyle(el).backgroundColor}`).join(", ")})`, vlakken.length === 0);
            const beelden = [...kop.querySelectorAll("img")].map((i) => i.getAttribute("src") || "");
            if (sleutel === "sn") eis(`${k.naam}: SocialNow- en Komen-logo in de kop (${beelden.join(", ")})`, beelden.some((s) => /socialnow-logo/i.test(s)) && beelden.some((s) => /komen-operation-systems/.test(s)));
            if (sleutel === "fincer") eis(`${k.naam}: fincer-wit.png in de kop (${beelden.join(", ")})`, beelden.some((s) => /fincer-wit\.png/.test(s)));
            if (sleutel === "attesso") {
              const code = kop.querySelector("code");
              eis(`${k.naam}: ~/attesso als mono-tekst #f3c6e8 (${code ? `${code.textContent} ${getComputedStyle(code).color}` : "geen code"})`, code && code.textContent.trim() === "~/attesso" && getComputedStyle(code).color === "rgb(243, 198, 232)");
            }
          }
          // Ook buiten de kop (bedrijfsreferenties op /team): geen vlak tussen een logo en de kaart.
          const logoVlakken = [...t.querySelectorAll("img")].flatMap((img) => {
            const rij = [];
            for (let el = img; el && el !== t; el = el.parentElement) if (!el.matches("figure, figure *") && !leeg(getComputedStyle(el))) rij.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} ${getComputedStyle(el).backgroundColor}`);
            return rij;
          });
          eis(`${k.naam}: geen vlak achter logo's in de kaart (${[...new Set(logoVlakken)].slice(0, 3).join(", ")})`, logoVlakken.length === 0);
          // Namen en functies: merkletter, lucht tussen woorden en letters, geen breuk midden in een woord.
          const canvas = document.createElement("canvas").getContext("2d");
          const krap = [];
          for (const el of t.querySelectorAll("*")) {
            const tekst = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
            if (!tekst || el.closest(pag.kop)) continue;
            const cs = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            if (!rect.width || cs.display === "none" || cs.visibility === "hidden") continue;
            const fs = parseFloat(cs.fontSize);
            const ls = cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing);
            const ws = cs.wordSpacing === "normal" ? 0 : parseFloat(cs.wordSpacing);
            canvas.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
            const woord = (canvas.measureText(" ").width + ws + 2 * ls) / fs;
            const fouten = [];
            if (/monospace/.test(cs.fontFamily)) fouten.push("mono");
            if (ls < 0) fouten.push(`ls=${ls}`);
            if (tekst.includes(" ") && woord < 0.24) fouten.push(`woord=${woord.toFixed(3)}em`);
            if (cs.overflowWrap === "anywhere" || cs.wordBreak === "break-all") fouten.push(cs.overflowWrap);
            if (fs < 11) fouten.push(`${fs}px`);
            if (fouten.length) krap.push(`"${tekst.slice(0, 18)}" ${fouten.join(" ")}`);
          }
          eis(`${k.naam}: namen en functies ruim in de merkletter${krap.length ? ` (${krap.slice(0, 3).join("; ")})` : ""}`, krap.length === 0);
        }
        return uit;
      }, { pag, KAARTEN });
      for (const [naam, ok] of r) eisen.push([`${breedte} ${pag.route} ${naam}`, ok]);
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} van ${eisen.length} rood` : `alles groen (${eisen.length} eisen)`);
process.exit(fout ? 1 : 0);
