// Proef bundel en lettertypes (30 september 2026, Marinus: "site VEEL SNELLER, WIL ECHT INSTANT LOADING").
// Rood op main b1913f7 (8: 360 KB script voor de hero, OTF-lettertypes zonder preload), 27f20be en cd379f4 (2: 360,9 KB
// script, 126 KB lettertypes), groen op perf/js-lettertypes-20260930.
// Gebruik: npm run build && node scripts/proef-bundel.mjs
// Deel 3 opent de build in een headless browser; playwright-core komt uit PLAYWRIGHT_CORE of uit de explainer-map.
import { existsSync, readFileSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { gzipSync } from "node:zlib";

const DIST = "dist";
const BUDGET = 120 * 1024;
const eisen = [];
const eis = (naam, ok, detail = "") => { eisen.push([naam, Boolean(ok), detail]); };
const lees = (bestand) => readFileSync(path.join(DIST, bestand), "utf8");
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

// 1. Het eerste script plus alles wat het statisch importeert.
const html = lees("index.html");
const ingang = html.match(/<script type="module"[^>]*src="\/(assets\/[^"]+\.js)"/)?.[1];
const statisch = new Set();
const stapel = ingang ? [ingang] : [];
while (stapel.length) {
  const bestand = stapel.pop();
  if (statisch.has(bestand)) continue;
  statisch.add(bestand);
  for (const m of lees(bestand).matchAll(/(?:^|[;}\s])import\s*(?:[\w$*{},\s]+from\s*)?["']\.\/([^"']+\.js)["']/g)) stapel.push(`assets/${m[1]}`);
}
const gzip = [...statisch].reduce((som, bestand) => som + gzipSync(readFileSync(path.join(DIST, bestand))).length, 0);
eis(`eerste script plus statische imports onder ${kb(BUDGET)} gzip`, ingang && gzip < BUDGET, `${statisch.size} bestanden, ${kb(gzip)}`);

// 2. Lettertypes: woff2, font-display swap, het koplettertype vooraf.
const cssBestand = html.match(/<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"/)?.[1];
const css = cssBestand ? lees(cssBestand) : "";
const vlakken = [...css.matchAll(/@font-face\{([^}]*font-family:"?TT Norms"?[^}]*)\}/g)].map((m) => m[1]);
const bronnen = vlakken.map((v) => v.match(/url\(([^)]+)\)/)?.[1] ?? "");
const lettergrootte = bronnen.reduce((som, b) => som + (existsSync(path.join(DIST, b)) ? statSync(path.join(DIST, b)).size : Infinity), 0);
eis("TT Norms als woff2, geen otf", vlakken.length === 3 && bronnen.every((b) => b.endsWith(".woff2")), bronnen.join(" "));
eis("drie gewichten samen onder 120 KB", lettergrootte < 120 * 1024, kb(lettergrootte));
eis("font-display: swap op elk gewicht", vlakken.length === 3 && vlakken.every((v) => v.includes("font-display:swap")));
const bold = bronnen[vlakken.findIndex((v) => /font-weight:700/.test(v))];
for (const pagina of ["index.html", "nl/index.html", "de/index.html", "fr/index.html", "prijzen/index.html"]) {
  const preload = lees(pagina).match(/<link rel="preload" href="([^"]+)" as="font" type="font\/woff2" crossorigin/)?.[1];
  eis(`koplettertype (Bold) laadt vooraf op /${pagina.replace("index.html", "")}`, bold && preload === bold, preload ?? "geen preload");
}

// 3. In de browser: elke taal tekent de kop en een vertaalde navigatie met alleen het eerste script; alles wat later laadt
//    wordt vastgehouden (niet geweigerd: een geweigerd bestand ziet de site als een oude versie en herlaadt één keer).
//    Daarna, met alles open, verschijnen de secties onder de vouw in dezelfde taal.
const woordenboeken = Object.fromEntries(["en", "de", "fr"].map((t) => [t, JSON.parse(readFileSync(`proposal/i18n/${t}.json`, "utf8"))]));
const vertaal = (tekst, taal) => (taal === "nl" ? tekst : woordenboeken[taal][tekst] ?? woordenboeken.en[tekst] ?? tekst);
const pw = await import(process.env.PLAYWRIGHT_CORE || "/Users/marinusbergsma/SocialNow-OS/app-explainer/node_modules/playwright-core/index.mjs").catch(() => null);
if (!pw) eis("playwright-core gevonden voor de browserproef", false, "zet PLAYWRIGHT_CORE");
else {
  const typen = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4" };
  const server = http.createServer((req, res) => {
    const pad = decodeURIComponent(req.url.split("?")[0]);
    let bestand = path.join(DIST, pad);
    if (existsSync(bestand) && statSync(bestand).isDirectory()) bestand = path.join(bestand, "index.html");
    const status = existsSync(bestand) ? 200 : 404;
    if (status === 404) bestand = path.join(DIST, "404.html");
    res.writeHead(status, { "content-type": typen[path.extname(bestand)] ?? "application/octet-stream" });
    res.end(readFileSync(bestand));
  });
  await new Promise((klaar) => server.listen(0, "127.0.0.1", klaar));
  const basis = `http://127.0.0.1:${server.address().port}`;
  const browser = await pw.chromium.launch({ headless: true });
  try {
    for (const taal of ["en", "nl", "de", "fr"]) {
      const url = `${basis}${taal === "en" ? "/" : `/${taal}/`}`;
      const verwacht = vertaal("Het OS", taal);
      // a. alleen het eerste script (plus de Duitse of Franse kern)
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      await ctx.addCookies([{ name: "sn-taal", value: taal, url: basis }]);
      await ctx.route(/\/assets\/.*\.js$/, (route) => {
        const bestand = new URL(route.request().url()).pathname.slice(1);
        return statisch.has(bestand) || /_sn-woordenboek-kern-/.test(bestand) ? route.continue() : new Promise(() => {});
      });
      await ctx.route(/workers\.dev|googleapis|behold/, (route) => route.abort());
      const pagina = await ctx.newPage();
      await pagina.goto(url, { waitUntil: "domcontentloaded" });
      const kop = await pagina.waitForSelector(`h1.h-taalwissel span[lang="${taal}"]`, { timeout: 15000 }).then((el) => el.textContent()).catch(() => "");
      const nav = await pagina.locator(`.h-desktop-nav a[href$="/het-os"]`).first().textContent().catch(() => "");
      eis(`${taal}: kop en navigatie met alleen het eerste script`, kop.includes("SocialNow!") && nav === verwacht, `kop "${kop}", navigatie "${nav}" (verwacht "${verwacht}")`);
      await ctx.close();
      // b. alles open: de secties onder de vouw laden, in dezelfde taal
      const vrij = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      await vrij.addCookies([{ name: "sn-taal", value: taal, url: basis }]);
      await vrij.route(/workers\.dev|googleapis|behold/, (route) => route.abort());
      const volledig = await vrij.newPage();
      const fouten = [];
      volledig.on("pageerror", (e) => fouten.push(e.message));
      await volledig.goto(url, { waitUntil: "load" });
      await volledig.mouse.wheel(0, 2000);
      const vragen = await volledig.waitForSelector("#vragen", { timeout: 15000 }).then((el) => el.textContent()).catch(() => "");
      const voet = await volledig.waitForSelector("footer", { timeout: 15000 }).then(() => true).catch(() => false);
      const titel = vertaal("Eerst helderheid.", taal);
      eis(`${taal}: secties onder de vouw en voettekst laden, vertaald`, vragen.includes(titel) && voet && !fouten.length, `vragen ${vragen.includes(titel) ? "vertaald" : `mist "${titel}"`}, voettekst ${voet}, fouten ${fouten.join("; ") || "geen"}`);
      await vrij.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

let rood = 0;
for (const [naam, ok, detail] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}${detail ? `: ${detail}` : ""}`); if (!ok) rood++; }
console.log(rood ? `${rood} rood` : "alles groen");
process.exit(rood ? 1 : 0);
