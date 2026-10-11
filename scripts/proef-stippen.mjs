// Proef stippenmotor (11 oktober 2026, chat 10 "Snelheid en toegankelijkheid"; Marinus: "WIL ECHT INSTANT LOADING").
// Meet op de gebouwde homepage (dist/) wat de stippen kosten en of ze zich netjes gedragen:
//   1. scrollen: lange taken en scripttijd per beeld bij 4x tragere processor, aantal canvassen, rust als er niets beweegt
//   2. het vaste stippenveld wist en tekent alleen het gebied van het effect (dirty rect) en staat stil in een verborgen tab
//   3. stippenscènes tekenen alleen in beeld
//   4. prefers-reduced-motion en de knop "Animaties pauzeren" (proposal/motion.tsx): geen bewegende stippen
//   5. touch: geen hover-golven, wel een golf bij een tik op een tegel; geen horizontale overflow op 390 px
//   6. elke stip op het raster: 16 + 32k in documentcoördinaten (scènes: onderverdeling 16 of 8 px)
//   7. geen consolefouten
// Gebruik: npm run build && node scripts/proef-stippen.mjs   (DIST=… voor een andere build, CHROMIUM=… voor een andere browser)
import { existsSync, readFileSync, statSync } from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

const DIST = process.env.DIST || "dist";
const CHROMIUM = process.env.CHROMIUM || path.join(os.homedir(), "Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const pw = await import(process.env.PLAYWRIGHT_CORE || "/Users/marinusbergsma/SocialNow-OS/app-explainer/node_modules/playwright-core/index.mjs");

const AKKOORD = readFileSync("components/legal.ts", "utf8").match(/LEGAL_VERSION = "([^"]+)"/)?.[1] ?? "";
const eisen = [];
const eis = (naam, ok, detail = "") => { eisen.push([naam, Boolean(ok), detail]); };
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

// Meetlaag in de pagina: elke tekenopdracht op een canvas (wissen, stip, vullen) met het rAF-beeld waarin hij valt, de
// gewiste oppervlakte, of het canvas in beeld is, en de documentcoördinaten van elke stip. Plus de duur van elke
// rAF-callback en lange taken.
const MEETLAAG = () => {
  const m = (window.__m = { ops: [], rafs: [], lang: [], beeld: 0, aan: true });
  const ids = new WeakMap(); let volg = 0;
  const id = (c) => { if (!ids.has(c)) ids.set(c, ++volg); return ids.get(c); };
  const soort = (c) => (c.classList.contains("sn-stipveld") ? "veld" : c.closest(".sn-stipscene") ? "scene" : c.classList.contains("brand-globe-canvas") ? "globe" : "anders");
  const vakCache = new WeakMap();
  const vak = (c) => {
    const nu = performance.now(), v = vakCache.get(c);
    if (v && nu - v.t < 4) return v;
    const b = c.getBoundingClientRect();
    const n = { t: nu, b, zicht: b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth && b.width > 0 };
    vakCache.set(c, n); return n;
  };
  const P = CanvasRenderingContext2D.prototype;
  const log = (ctx, wat, extra) => {
    if (!m.aan) return;
    const c = ctx.canvas; if (!(c instanceof HTMLCanvasElement)) return;
    const v = vak(c);
    m.ops.push({ c: id(c), s: soort(c), wat, f: m.beeld, z: v.zicht, ...extra(v.b, ctx) });
  };
  const wis = P.clearRect;
  P.clearRect = function (x, y, w, h) {
    log(this, "wis", (b) => ({ opp: Math.max(0, Math.min(w, b.width - x) * Math.min(h, b.height - y)) / Math.max(1, b.width * b.height) }));
    return wis.apply(this, arguments);
  };
  const boog = P.arc;
  P.arc = function (x, y) {
    log(this, "stip", (b, ctx) => {
      const t = ctx.getTransform(), d = devicePixelRatio && ctx.canvas.width / Math.max(1, b.width);
      const px = (t.a * x + t.c * y + t.e) / d, py = (t.b * x + t.d * y + t.f) / d;
      return { x: b.left + scrollX + px, y: b.top + scrollY + py };
    });
    return boog.apply(this, arguments);
  };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf((t) => {
    m.beeld++; const t0 = performance.now();
    try { cb(t); } finally { if (m.aan) m.rafs.push(performance.now() - t0); }
  });
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (m.aan) m.lang.push(e.duration); }).observe({ type: "longtask", buffered: true }); } catch {}
};

const typen = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm" };
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
const browser = await pw.chromium.launch({ headless: true, executablePath: existsSync(CHROMIUM) ? CHROMIUM : undefined });

const BUITEN = /workers\.dev|googleapis|behold|google-analytics|googletagmanager|vercel-insights|plausible/;
async function opPagina(opties = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opties });
  await ctx.addCookies([{ name: "sn-taal", value: "nl", url: basis }]);
  // Het welkomstvenster (proposal/ConsentPopup.tsx) al akkoord, anders ligt het over de tegels.
  await ctx.addInitScript((v) => { try { localStorage.setItem("sn-akkoord", v); } catch {} }, AKKOORD);
  await ctx.route(BUITEN, (r) => r.abort());
  await ctx.addInitScript(MEETLAAG);
  const p = await ctx.newPage();
  const fouten = [];
  p.on("pageerror", (e) => fouten.push(`pageerror: ${e.message}`));
  p.on("console", (m) => { if (m.type() === "error" && !BUITEN.test(m.location()?.url || "")) fouten.push(`console: ${m.text()} (${m.location()?.url || ""})`); });
  await p.goto(`${basis}/nl/`, { waitUntil: "load" });
  await p.waitForSelector("canvas.sn-stipveld", { state: "attached", timeout: 8000 }).catch(() => {});
  return { ctx, p, fouten };
}
const leeg = (p) => p.evaluate(() => { window.__m.ops = []; window.__m.rafs = []; window.__m.lang = []; });
const lees = (p) => p.evaluate(() => window.__m);
// Hele pagina langs (alles laden), daarna terug naar boven.
async function helemaalLangs(p, stap = 700, pauze = 120) {
  for (let n = 0; n < 80; n++) {
    const [y, max] = await p.evaluate(() => [scrollY, document.documentElement.scrollHeight - innerHeight]);
    if (y >= max - 2) break;
    await p.mouse.wheel(0, stap); await wacht(pauze);
  }
}
const p_ctx = [];

try {
  // 1. Scrollen over de homepage op 1440, processor 4x trager
  {
    const { ctx, p, fouten } = await opPagina(); p_ctx.push(ctx);
    await p.mouse.move(5, 5);
    await helemaalLangs(p);                      // opwarmen: alle secties laden
    await wacht(800);
    await p.evaluate(() => scrollTo(0, 0)); await wacht(600);
    const cdp = await ctx.newCDPSession(p); await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await leeg(p);
    const t0 = Date.now(); await helemaalLangs(p, 350, 90); const duur = Date.now() - t0;
    await wacht(400);
    const m = await lees(p);
    const lang = m.lang.filter((d) => d >= 50);
    const raf = m.rafs.reduce((a, b) => a + b, 0);
    const p95 = [...m.rafs].sort((a, b) => a - b)[Math.floor(m.rafs.length * .95)] || 0;
    eis("scrollen: geen lange taken (>= 50 ms) bij 4x tragere processor", lang.length === 0, `${lang.length} lange taken${lang.length ? ` (${lang.map((d) => Math.round(d)).join(", ")} ms)` : ""}, ${m.rafs.length} rAF-callbacks in ${duur} ms`);
    eis("scrollen: rAF-scripttijd onder 5% van de scrolltijd en p95 per beeld onder 4 ms", raf / duur < .05 && p95 < 4, `${(raf / duur * 100).toFixed(1)}%, p95 ${p95.toFixed(2)} ms`);
    const buiten = m.ops.filter((o) => (o.s === "scene" || o.s === "veld") && !o.z && o.wat === "stip");
    eis("scrollen: stippenscènes tekenen niet buiten beeld", buiten.length === 0, `${buiten.length} stippen getekend op canvassen buiten beeld`);
    const canvassen = await p.evaluate(() => ({ alle: document.querySelectorAll("canvas").length, scenes: document.querySelectorAll(".sn-stipscene canvas").length }));
    eis("aantal canvassen op de homepage hooguit 16", canvassen.alle <= 16, `${canvassen.alle} canvassen, waarvan ${canvassen.scenes} stippenscènes`);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    // Rust: onderaan, niets aanraken. Geen stippencanvas mag nog tekenen.
    await wacht(2500); await leeg(p); await wacht(2000);
    const rust = await lees(p);
    const rustOps = rust.ops.filter((o) => o.s !== "anders").length;
    eis("rust: stippen tekenen niets als er niets beweegt", rustOps === 0, `${rustOps} tekenopdrachten in 2 s, ${rust.rafs.length} rAF-callbacks van de hele pagina`);
    eis("homepage 1440: geen consolefouten", fouten.length === 0, fouten.slice(0, 4).join(" | "));
  }

  // 2. Vast stippenveld: golf bij hover op een tegel, gewist gebied, verborgen tab
  {
    const { ctx, p, fouten } = await opPagina(); p_ctx.push(ctx);
    await helemaalLangs(p); await p.evaluate(() => scrollTo(0, 0)); await wacht(500);
    const tegel = p.locator(".sn-tegel:not(.is-film):not(.is-foto) > .sn-tegel-vlak").nth(1);
    await tegel.scrollIntoViewIfNeeded(); await wacht(2600);
    await leeg(p);
    await tegel.hover(); await wacht(2200);
    const m = await lees(p);
    const veld = m.ops.filter((o) => o.s === "veld");
    const perBeeld = new Map();
    for (const o of veld) if (o.wat === "wis") perBeeld.set(o.f, (perBeeld.get(o.f) || 0) + o.opp);
    const opp = [...perBeeld.values()], gem = opp.reduce((a, b) => a + b, 0) / Math.max(1, opp.length);
    const stippen = veld.filter((o) => o.wat === "stip").length;
    eis("veld: hover op een tegel geeft een golf", stippen > 50, `${stippen} stippen in ${perBeeld.size} beelden`);
    eis("veld: per beeld gemiddeld minder dan 35% van het scherm gewist (dirty rect)", opp.length > 0 && gem < .35, `${(gem * 100).toFixed(0)}% van het scherm per beeld`);
    const naast = veld.filter((o) => o.wat === "stip" && (Math.abs(((o.x - 16) % 32 + 32) % 32) > .6 && Math.abs(((o.x - 16) % 32 + 32) % 32 - 32) > .6 || Math.abs(((o.y - 16) % 32 + 32) % 32) > .6 && Math.abs(((o.y - 16) % 32 + 32) % 32 - 32) > .6));
    eis("raster: golfstippen van het veld op 16 + 32k", stippen > 0 && naast.length === 0, `${naast.length} van ${stippen} naast het raster${naast[0] ? ` (bijv. ${naast[0].x.toFixed(1)}, ${naast[0].y.toFixed(1)})` : ""}`);
    // Beginstand van MotionProvider: data-motion="paused" tot zijn eerste effect (reduced staat standaard aan). Dat is
    // geen pauze van de bezoeker; een golf in dat venster moet gewoon spelen.
    await p.evaluate(() => document.querySelectorAll("[data-motion]").forEach((el) => el.setAttribute("data-motion", "paused")));
    const tegel3 = p.locator(".sn-tegel:not(.is-film):not(.is-foto) > .sn-tegel-vlak").nth(3);
    await tegel3.scrollIntoViewIfNeeded(); await wacht(1600); await leeg(p); await tegel3.hover(); await wacht(1000);
    const begin = (await lees(p)).ops.filter((o) => o.s === "veld" && o.wat === "stip").length;
    await p.evaluate(() => document.querySelectorAll("[data-motion]").forEach((el) => el.setAttribute("data-motion", "playing")));
    eis("veld: beginstand data-motion=\"paused\" (voor het eerste effect) houdt de golf niet tegen", begin > 50, `${begin} golfstippen`);
    // Verborgen tab midden in een golf: niets tekenen, daarna verder
    const tegel2 = p.locator(".sn-tegel:not(.is-film):not(.is-foto) > .sn-tegel-vlak").nth(2);
    await tegel2.scrollIntoViewIfNeeded(); await wacht(1600); await tegel2.hover(); await wacht(250);
    await p.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await wacht(100); await leeg(p); await wacht(900);
    const verborgen = (await lees(p)).ops.filter((o) => o.s === "veld" || o.s === "scene").length;
    await p.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event("visibilitychange")); });
    eis("veld: staat stil in een verborgen tab", verborgen === 0, `${verborgen} tekenopdrachten terwijl de tab verborgen was`);
    eis("veld: geen consolefouten", fouten.length === 0, fouten.slice(0, 4).join(" | "));
  }

  // 3. Raster in de scènes en de globe, met alle scènes afgespeeld
  {
    const { ctx, p } = await opPagina(); p_ctx.push(ctx);
    await leeg(p);
    for (let n = 0; n < 2; n++) { await helemaalLangs(p, 300, 260); await p.evaluate(() => scrollTo(0, 0)); await wacht(1500); }
    const m = await lees(p);
    const af = (v, s) => { const r = ((v - 16) % s + s) % s; return Math.min(r, s - r); };
    for (const [soort, s, naam] of [["globe", 32, "globe op 16 + 32k"], ["scene", 8, "stippenscènes op 16 + 8k (onderverdeling van 32)"]]) {
      const st = m.ops.filter((o) => o.s === soort && o.wat === "stip");
      const naast = st.filter((o) => af(o.x, s) > .6 || af(o.y, s) > .6);
      eis(`raster: ${naam}`, st.length > 0 && naast.length === 0, `${naast.length} van ${st.length} naast het raster${naast[0] ? ` (bijv. ${naast[0].x.toFixed(1)}, ${naast[0].y.toFixed(1)})` : ""}`);
    }
  }

  // 4a. prefers-reduced-motion: geen bewegende stippen (hooguit één tekenbeurt per canvas, de eindstand)
  {
    const { ctx, p, fouten } = await opPagina({ reducedMotion: "reduce" }); p_ctx.push(ctx);
    await leeg(p);
    await helemaalLangs(p, 400, 200); await wacht(1500);
    const tegels = p.locator(".sn-tegel:not(.is-film):not(.is-foto) > .sn-tegel-vlak");
    for (let n = 0; n < 3; n++) { await tegels.nth(n).hover().catch(() => {}); await wacht(300); }
    await wacht(800);
    const m = await lees(p);
    const beelden = new Map();
    for (const o of m.ops) if ((o.s === "veld" || o.s === "scene") && o.wat === "stip") { const s = beelden.get(o.c) || new Set(); s.add(o.f); beelden.set(o.c, s); }
    const veel = [...beelden.entries()].filter(([, s]) => s.size > 3);
    const veld = m.ops.filter((o) => o.s === "veld" && o.wat === "stip").length;
    eis("minder beweging: geen golf in het veld", veld === 0, `${veld} golfstippen`);
    eis("minder beweging: scènes in één keer in de eindstand", veel.length === 0, `${veel.length} canvassen met meer dan 3 beelden met stippen${veel[0] ? ` (bijv. ${veel[0][1].size})` : ""}`);
    eis("minder beweging: geen consolefouten", fouten.length === 0, fouten.slice(0, 4).join(" | "));
  }

  // 4b. Knop "Animaties pauzeren": daarna geen golven en scènes in de eindstand
  {
    const { ctx, p } = await opPagina(); p_ctx.push(ctx);
    await helemaalLangs(p, 600, 150); await wacht(500);
    // MotionControl (proposal/motion.tsx) staat op 11 okt op geen enkele pagina. Is hij er, dan klikt de proef hem;
    // anders zet de proef dezelfde stand die hij geeft: data-motion="paused" en data-motion-pauze="ja" op de MotionProvider.
    const knop = p.locator("button.h-motion-control").first();
    const heeft = await knop.count();
    if (heeft) { await knop.scrollIntoViewIfNeeded(); await knop.click(); }
    else await p.evaluate(() => document.querySelectorAll("[data-motion]").forEach((el) => { el.setAttribute("data-motion", "paused"); el.setAttribute("data-motion-pauze", "ja"); }));
    const stand = await p.evaluate(() => document.querySelector("[data-motion]")?.getAttribute("data-motion"));
    await p.evaluate(() => scrollTo(0, 0)); await wacht(1500);
    await leeg(p);
    await helemaalLangs(p, 400, 200); await wacht(800);
    const tegels = p.locator(".sn-tegel:not(.is-film):not(.is-foto) > .sn-tegel-vlak");
    for (let n = 0; n < 3; n++) { await tegels.nth(n).hover().catch(() => {}); await wacht(300); }
    await wacht(800);
    const m = await lees(p);
    const veld = m.ops.filter((o) => o.s === "veld" && o.wat === "stip").length;
    eis("pauzeknop: stand gepauzeerd", stand === "paused", `${heeft ? "knop geklikt" : "knop niet op de pagina, stand gezet"}: ${stand}`);
    eis("pauzeknop: geen golf in het veld na pauzeren", veld === 0, `${veld} golfstippen`);
  }

  // 5. Touch op 390 px: geen overflow, tik op een tegel geeft een golf
  {
    const { ctx, p, fouten } = await opPagina({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); p_ctx.push(ctx);
    await helemaalLangs(p, 600, 150); await wacht(800);
    const breed = await p.evaluate(() => ({ doc: document.documentElement.scrollWidth, body: document.body.scrollWidth, vp: innerWidth }));
    eis("390 px: geen horizontale overflow", breed.doc <= breed.vp && breed.body <= breed.vp, `scrollWidth ${breed.doc}/${breed.body}, scherm ${breed.vp}`);
    await p.evaluate(() => scrollTo(0, 0)); await wacht(500);
    const tegel = p.locator(".sn-tegel:not(.is-film):not(.is-foto) > .sn-tegel-vlak").nth(1);
    await tegel.scrollIntoViewIfNeeded(); await wacht(2600);
    await leeg(p);
    const b = await tegel.boundingBox();
    await p.touchscreen.tap(b.x + 12, b.y + 12); await wacht(1200);
    const veld = (await lees(p)).ops.filter((o) => o.s === "veld" && o.wat === "stip").length;
    eis("touch: tik op een tegel geeft een golf", veld > 30, `${veld} golfstippen`);
    eis("390 px: geen consolefouten", fouten.length === 0, fouten.slice(0, 4).join(" | "));
  }
} finally {
  await Promise.all(p_ctx.map((c) => c.close().catch(() => {})));
  await browser.close();
  server.close();
}

let rood = 0;
for (const [naam, ok, detail] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}${detail ? `: ${detail}` : ""}`); if (!ok) rood++; }
console.log(rood ? `${rood} rood` : "alles groen");
process.exit(rood ? 1 : 0);
