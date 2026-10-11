// Proef zwart + raster (11 oktober 2026, Marinus): "Ik wil de gehele site met dots hebben" en "Verder site ook helemaal zwart".
// Basistak feat/stippen-site-20261011, eerste livegang. Eisen op 390 en 1440 px, op de gebouwde homepage in NL/EN/DE/FR:
// - body puur zwart (#000) met het stippenraster van 32 px als achtergrond (radial-gradient, 32px 32px);
// - --c-zwart is #000 en .sn-site laat het raster door (doorzichtig);
// - het lichtgevende stippenveld (canvas.sn-stipveld) staat vast, vult het scherm en vangt geen klikken;
// - de stippenscènes in Bereikt (100 stippen) en Overzicht staan op de pagina met een canvas;
// - geen grijze band: de hero en de klantenstrook hebben geen vaste #0b0f12-verdonkering meer;
// - Marinus 11 okt: "De stippen zelf zijn te groot, moet meer een achtergrond effect zijn": rasterstip hooguit 1,1 px straal en
//   dekking hooguit 0,10; het vaste stippenveld (golven) tekent met straal hooguit 1,1;
// - niets buiten beeld (geen horizontale scroll).
// Leest de bouw in dist/, dus eerst npm run build. PLAYWRIGHT_CORE en BROWSER_CHANNEL=chrome zoals de andere proeven.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (!existsSync("dist/nl/index.html")) {
  console.error("Geen dist/nl/index.html: draai eerst npm run build.");
  process.exit(1);
}

const TALEN = ["nl", "en", "de", "fr"];
const BREEDTES = [390, 1440];
const pad = (taal) => (taal === "en" ? "/" : `/${taal}/`);
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
    const context = await browser.newContext({ viewport: { width: breedte, height: 900 }, locale: "en-US", timezoneId: "America/New_York" });
    await context.route("**/*", (route) => (new URL(route.request().url()).origin === base ? route.continue() : route.abort()));
    const page = await context.newPage();
    for (const taal of TALEN) {
      await page.goto(`${base}${pad(taal)}`);
      await page.waitForLoadState("networkidle");
      // Het stippenveld laadt bij idle (uiterlijk 2,5 s).
      await page.waitForSelector("canvas.sn-stipveld", { state: "attached", timeout: 4000 }).catch(() => {});
      const m = await page.evaluate(async () => {
        const body = getComputedStyle(document.body);
        const site = document.querySelector(".sn-site");
        const veld = document.querySelector("canvas.sn-stipveld");
        const vs = veld ? getComputedStyle(veld) : null;
        const vr = veld ? veld.getBoundingClientRect() : null;
        const scene = (sel) => {
          const el = document.querySelector(sel);
          if (!el) return false;
          el.scrollIntoView({ block: "center" });
          return Boolean(el.querySelector("canvas"));
        };
        const bereikt = scene(".h-resultaat-stippen");
        const overzicht = scene(".tr-dash-stippen");
        window.scrollTo(0, 0);
        const vw = document.documentElement.clientWidth;
        return {
          bg: body.backgroundColor, beeld: body.backgroundImage, maat: body.backgroundSize,
          zwart: getComputedStyle(document.documentElement).getPropertyValue("--c-zwart").trim().toLowerCase(),
          siteBg: site ? getComputedStyle(site).backgroundColor : "geen .sn-site",
          veld: veld ? { pos: vs.position, pe: vs.pointerEvents, b: Math.round(vr.width), h: Math.round(vr.height), vw, vh: innerHeight } : null,
          bereikt, overzicht, scroll: document.documentElement.scrollWidth - vw,
        };
      });
      // Gauntlet: geen vaste #0b0f12-verdonkering over de hero of de klantenstrook (gaf een grijze band zonder stippen).
      const band = await page.evaluate(() => {
        const grijs = (el, pseudo) => (el ? /11, 15, 18|#0b0f12/i.test(getComputedStyle(el, pseudo).backgroundImage) : false);
        const hero = document.querySelector(".h-hero");
        const strook = document.querySelector(".h-clients-kort > .h-clients-strook");
        return [grijs(hero, "::after") && "hero", grijs(strook, "::before") && "strook links", grijs(strook, "::after") && "strook rechts"].filter(Boolean);
      });
      const stip = await page.evaluate(() => {
        const g = getComputedStyle(document.body).backgroundImage;
        const m = g.match(/rgba\(255, 255, 255, ([\d.]+)\) ([\d.]+)px/);
        return { a: m ? +m[1] : null, r: m ? +m[2] : null, veld: document.querySelector("canvas.sn-stipveld")?.dataset.straal ? +document.querySelector("canvas.sn-stipveld").dataset.straal : null };
      });
      const n = `${breedte} ${taal}`;
      eisen.push([`${n}: body puur zwart (${m.bg})`, m.bg === "rgb(0, 0, 0)"]);
      eisen.push([`${n}: stippenraster 32 px als achtergrond (${m.maat})`, /radial-gradient/.test(m.beeld) && m.maat === "32px 32px"]);
      eisen.push([`${n}: --c-zwart is #000 (${m.zwart})`, m.zwart === "#000" || m.zwart === "#000000"]);
      eisen.push([`${n}: .sn-site doorzichtig (${m.siteBg})`, m.siteBg === "rgba(0, 0, 0, 0)" || m.siteBg === "transparent"]);
      eisen.push([`${n}: stippenveld vast, schermvullend, klikt niet${m.veld ? ` (${m.veld.pos}, ${m.veld.b}x${m.veld.h})` : " (ontbreekt)"}`,
        Boolean(m.veld) && m.veld.pos === "fixed" && m.veld.pe === "none" && m.veld.b === m.veld.vw && m.veld.h === m.veld.vh]);
      eisen.push([`${n}: Bereikt in stippen (canvas)`, m.bereikt]);
      eisen.push([`${n}: Overzicht in stippen (canvas)`, m.overzicht]);
      eisen.push([`${n}: geen grijze #0b0f12-band (hero, klantenstrook)${band.length ? ` (wel: ${band.join(", ")})` : ""}`, band.length === 0]);
      eisen.push([`${n}: rasterstip klein als achtergrond (straal ${stip.r} px, dekking ${stip.a})`, stip.r !== null && stip.r <= 1.1 && stip.a <= .1]);
      eisen.push([`${n}: golfstippen klein (straal ${stip.veld})`, stip.veld !== null && stip.veld <= 1.1]);
      eisen.push([`${n}: niets buiten beeld (scroll ${m.scroll}px)`, m.scroll <= 0]);
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
