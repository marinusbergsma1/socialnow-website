// Proef partnertegels (11 oktober 2026, Marinus bij een schermafdruk van de tegels SocialNow, Attesso en Fincer:
// "deze tiles moeten nog aangepast en zitten letters nog met elkaar verbonden op mobiel").
// Vaste regel: partnertegels altijd als de donkere kaarten van het story-document (business.socialnow.nl/hossam.html,
// bron presentatie-jeroen-20261008/deploy/middleware.js, .team-duo). Donkere kaarten op #06080d, hoek 20px,
// SocialNow × Komen #102219→#09140e rand #37915b, ~/attesso als mono-tekst #f3c6e8 #251a28→#100d14 rand #925789,
// Fincer (fincer-wit.png) #162137→#0c1320 rand #4776aa. Nooit een vlakje achter een logo, geen lichte tegels.
// Namen en functies in de merkletter (niet in vette mono), woordafstand >= 0,24 em, geen woordbreuk midden in een naam.
// Geldt voor de homepage (.h-duo) en /team (.h-team-duo), op 375 en 1440.
// Ronde 2 (11 oktober 2026, schermafdruk van live op 375 px): naam en LinkedIn-icoon op dezelfde regel, geen afgesneden
// tekst, naam en functie niet over een gezicht (bovenste 70 % van de foto), Fincer onder elkaar op mobiel, Albert Deltour
// donker goud (#2a2015→#110d08, rand 2 px #e6bd91, tekst wit, ELT Live-logo licht), cookiemelding op mobiel compact met
// Milo binnen de kaart.
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
          // Ronde 2: LinkedIn-icoon op dezelfde regel als het laatste woord van de naam.
          const losseIconen = [];
          for (const svg of t.querySelectorAll("figcaption .h-linkedin-mark")) {
            const naamEl = svg.closest("b, strong") || svg.parentElement;
            const loper = document.createTreeWalker(naamEl, NodeFilter.SHOW_TEXT);
            let laatst = null;
            for (let n = loper.nextNode(); n; n = loper.nextNode()) {
              if (!(svg.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_PRECEDING)) break;
              const i = n.textContent.search(/\S\s*$/);
              if (i >= 0) laatst = [n, i];
            }
            if (!laatst) continue;
            const bereik = document.createRange();
            bereik.setStart(laatst[0], laatst[1]); bereik.setEnd(laatst[0], laatst[1] + 1);
            const letter = bereik.getBoundingClientRect();
            const icoon = svg.getBoundingClientRect();
            const midden = icoon.top + icoon.height / 2;
            if (midden < letter.top || midden > letter.bottom) losseIconen.push(naamEl.textContent.trim().slice(0, 20));
          }
          const andereKleur = [...t.querySelectorAll(".h-naam-eind")].filter((el) => getComputedStyle(el).color !== getComputedStyle(el.parentElement).color || getComputedStyle(el).fontSize !== getComputedStyle(el.parentElement).fontSize).map((el) => el.textContent.trim());
          eis(`${k.naam}: hele naam in één kleur en maat${andereKleur.length ? ` (anders: ${andereKleur.join(", ")})` : ""}`, andereKleur.length === 0);
          eis(`${k.naam}: naam en LinkedIn-icoon op dezelfde regel${losseIconen.length ? ` (los: ${losseIconen.join(", ")})` : ""}`, losseIconen.length === 0);
          // Ronde 2: geen afgesneden tekst (binnen de kaart en binnen elke ouder die overloop verbergt).
          const kaart = t.getBoundingClientRect();
          const afgesneden = [];
          for (const el of t.querySelectorAll("b, strong, i, p, span, a, figcaption")) {
            const tekst = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
            if (!tekst) continue;
            const r = el.getBoundingClientRect();
            if (!r.width) continue;
            let uit = r.right > kaart.right + 1 || r.bottom > kaart.bottom + 1 || r.left < kaart.left - 1;
            for (let o = el.parentElement; o && o !== t && !uit; o = o.parentElement) {
              if (getComputedStyle(o).overflow === "visible") continue;
              const or = o.getBoundingClientRect();
              if (r.bottom > or.bottom + 1 || r.right > or.right + 1) uit = true;
            }
            if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).display !== "inline") uit = true;
            if (uit) afgesneden.push(tekst.slice(0, 20));
          }
          eis(`${k.naam}: geen afgesneden tekst${afgesneden.length ? ` (${afgesneden.slice(0, 3).join("; ")})` : ""}`, afgesneden.length === 0);
          // Ronde 2: naam en functie overlappen geen gezicht (bovenste 70 % van elke foto blijft vrij).
          const overGezicht = [];
          for (const fig of t.querySelectorAll("figure")) {
            const img = fig.querySelector("img");
            if (!img) continue;
            const f = img.getBoundingClientRect();
            const zoneOnder = f.top + f.height * 0.7;
            for (const el of fig.querySelectorAll("figcaption b, figcaption strong, figcaption i, figcaption span")) {
              const r = el.getBoundingClientRect();
              if (!r.width || !r.height) continue;
              const overlap = r.left < f.right && r.right > f.left && r.top < zoneOnder && r.bottom > f.top;
              if (overlap) { overGezicht.push(el.textContent.trim().slice(0, 18)); break; }
            }
          }
          eis(`${k.naam}: tekstvlak overlapt geen gezicht${overGezicht.length ? ` (${overGezicht.join(", ")})` : ""}`, overGezicht.length === 0);
          // Ronde 2: op mobiel de naam op één regel in de homepagetegels ("Marinus / Bergsma" mag niet meer).
          if (pag.route === "/nl/" && innerWidth <= 640) {
            const gebroken = [...t.querySelectorAll("figcaption b")].filter((b) => b.getBoundingClientRect().height > parseFloat(getComputedStyle(b).fontSize) * 1.7).map((b) => b.textContent.trim());
            eis(`${k.naam}: naam op één regel op mobiel${gebroken.length ? ` (gebroken: ${gebroken.join(", ")})` : ""}`, gebroken.length === 0);
          }
          // Ronde 2: Fincer op mobiel onder elkaar, toelichting onder het portret.
          if (sleutel === "fincer" && innerWidth <= 640) {
            const fig = t.querySelector("figure");
            const uitleg = t.querySelector(".h-fincer-toelichting");
            if (fig && uitleg) eis(`${k.naam}: op mobiel gestapeld (toelichting onder het portret)`, uitleg.getBoundingClientRect().top >= fig.getBoundingClientRect().bottom - 1);
          }
        }
        // Ronde 2: Albert Deltour donker goud op de homepage.
        const albert = pag.route === "/nl/" ? document.querySelector(".sn-advisory") : null;
        if (pag.route === "/nl/") {
          eis("Albert: kaart bestaat", albert);
          if (albert) {
            const c = getComputedStyle(albert);
            eis(`Albert: donker goud #2a2015→#110d08 (nu ${c.backgroundImage.slice(0, 60)} / ${c.backgroundColor})`, c.backgroundImage.includes("rgb(42, 32, 21)") && c.backgroundImage.includes("rgb(17, 13, 8)"));
            eis(`Albert: rand 2 px #e6bd91 (nu ${c.borderTopWidth} ${c.borderTopColor})`, c.borderTopWidth === "2px" && c.borderTopColor === "rgb(230, 189, 145)");
            const wit = [...albert.querySelectorAll("h3, h3 a, .sn-advisory-copy > strong, .sn-advisory-copy > p")].filter((el) => getComputedStyle(el).color !== "rgb(255, 255, 255)");
            eis(`Albert: tekst wit (${wit.map((el) => `${el.tagName.toLowerCase()} ${getComputedStyle(el).color}`).slice(0, 2).join(", ")})`, wit.length === 0);
            const logo = albert.querySelector(".sn-advisory-logo img");
            eis(`Albert: ELT Live-logo licht (filter ${logo ? getComputedStyle(logo).filter : "geen logo"})`, logo && /invert\(1\)/.test(getComputedStyle(logo).filter));
          }
        }
        return uit;
      }, { pag, KAARTEN });
      for (const [naam, ok] of r) eisen.push([`${breedte} ${pag.route} ${naam}`, ok]);
    }
    await context.close();
  }
  // Ronde 2: cookiemelding op mobiel compact, Milo binnen de kaart (zonder minder-beweging, dan blijft hij 5 s staan).
  {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    await context.route("**/*", (route) => (new URL(route.request().url()).origin === base ? route.continue() : route.abort()));
    const page = await context.newPage();
    await page.goto(`${base}/nl/`);
    const koekje = page.locator(".h-koekje");
    await koekje.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(700);
    const m = await page.evaluate(() => {
      const k = document.querySelector(".h-koekje");
      const milo = document.querySelector(".h-koekje-milo");
      if (!k || !milo) return null;
      const kr = k.getBoundingClientRect(), mr = milo.getBoundingClientRect();
      return { hoog: Math.round(kr.height), miloBinnen: mr.top >= kr.top - 1 && mr.left >= kr.left - 1 && mr.bottom <= kr.bottom + 1 };
    });
    eisen.push([`375 /nl/ cookiemelding zichtbaar`, !!m]);
    if (m) {
      eisen.push([`375 /nl/ cookiemelding compact, hoogstens 120 px (nu ${m.hoog})`, m.hoog <= 120]);
      eisen.push([`375 /nl/ Milo binnen de cookiekaart, niet over de inhoud`, m.miloBinnen]);
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
