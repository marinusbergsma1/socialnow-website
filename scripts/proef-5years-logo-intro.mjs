#!/usr/bin/env node
// Proef, Marinus 6 nov 2026: "Zorg tegelijk dat het SocialNow 5 YEARS logo vanuit de Video ook op de site komt met ... BEELDMERK
// ANIMATIE ZOALS OOK IN DE VIDEO ALS LOGO INTRO KORT". Bron: 04_OS-VIDEO/video-project/83-vijf-jaar-socialnow (s7-logo.mp4 en
// het witte #jaren-badge van de eindtitel). Rood op main vóór de wijziging, groen erna.
//
// Gebruik:  node scripts/proef-5years-logo-intro.mjs                 (bronbestanden)
//           npm run build && PLAYWRIGHT_CORE=<pad naar playwright-core/index.mjs> BROWSER_CHANNEL=chrome \
//             node scripts/proef-5years-logo-intro.mjs --browser       (ook de gebouwde site in Chrome)
import fs from "node:fs";
import { spawn } from "node:child_process";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const grootte = (p) => (fs.existsSync(p) ? fs.statSync(p).size : Infinity);

const MAP = "public/5jaar";
const shell = lees("proposal/WebsiteProposal.tsx");
const header = shell + lees("proposal/Logo5Jaar.tsx");
const css = lees("proposal/hoofdmenu.css");

// 1. Eigen map met de filmbestanden, licht genoeg voor de header
eis(grootte(`${MAP}/logo-intro.webm`) <= 160_000, "beeldmerk-intro als webm (≤ 160 KB) in public/5jaar/");
eis(grootte(`${MAP}/logo-intro.mp4`) <= 160_000, "beeldmerk-intro als mp4 (≤ 160 KB) voor Safari in public/5jaar/");
eis(grootte(`${MAP}/logo-5years.webp`) <= 80_000, "5 YEARS-logo uit de eindtitel als webp (≤ 80 KB) in public/5jaar/");
eis(/83-vijf-jaar-socialnow/.test(lees(`${MAP}/BRON.md`)) && /terugzetten/i.test(lees(`${MAP}/BRON.md`)), "public/5jaar/BRON.md noemt de film als bron en hoe je terugzet");

// 2. Header: het logo uit de film, met de intro alleen op de homepage
eis(/src="\/5jaar\/logo-5years\.webp"/.test(header) && /alt="SocialNow 5 YEARS"/.test(header), "header toont het 5 YEARS-logo uit de film");
eis(!/className="h-brand-jaren"/.test(header), "het losse CSS-label is vervangen door het echte logo");
eis(/<video[^>]*\bautoplay\b[^>]*\bmuted\b[^>]*\bplaysinline\b/.test(header) && /logo-intro\.webm/.test(header) && /logo-intro\.mp4/.test(header),
  "intro speelt vanzelf, zonder geluid, ook op iPhone (autoplay muted playsinline, webm + mp4)");
eis(/<Logo5Jaar thuis=\{location\.pathname === "\/"\}/.test(shell) && /useState\(\(\) => thuis\)/.test(header), "intro alleen bij het laden van de homepage");

// 3. CSS: geen verschuiving, rustig bij reduced motion, geen negatieve letterafstand
eis(/\.h-brand-intro\{[^}]*position:absolute/.test(css), "intro ligt over het logo heen (position:absolute, geen layoutverschuiving)");
eis(/prefers-reduced-motion:reduce\)\{[^@]*\.h-brand-intro\{display:none/.test(css), "prefers-reduced-motion: geen intro, meteen het logo");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand in hoofdmenu.css");

// 4. In de browser, op de gebouwde site
if (process.argv.includes("--browser")) {
  if (!fs.existsSync("dist/index.html")) { eis(false, "dist/index.html bestaat (draai eerst npm run build)"); }
  else {
    const html = fs.readFileSync("dist/index.html", "utf8");
    eis(/<video[^>]*\bmuted\b/.test(html) && /logo-intro\.webm/.test(html), "gebouwde homepage-HTML bevat de intro mét muted (anders speelt Chrome hem niet af)");
    eis(!/logo-intro\.webm/.test(lees("dist/diensten/index.html")) && /logo-5years\.webp/.test(lees("dist/diensten/index.html")), "andere pagina's: logo zonder intro");
    const poort = 4391;
    const server = spawn("node_modules/.bin/vite", ["preview", "--port", String(poort), "--strictPort"], { stdio: "ignore" });
    try {
      const basis = `http://localhost:${poort}`;
      for (let i = 0; i < 60; i++) { try { await fetch(basis); break; } catch { await new Promise((r) => setTimeout(r, 250)); } }
      const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
      const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome" });
      const stand = (p) => p.evaluate(() => {
        const img = document.querySelector(".h-header .h-brand img"), v = document.querySelector(".h-header .h-brand-intro video");
        const r = document.querySelector(".h-header .h-brand").getBoundingClientRect();
        return { img: img ? +getComputedStyle(img).opacity : -1, src: img?.getAttribute("src"), video: !!v && getComputedStyle(v.parentElement).display !== "none",
          t: v ? v.currentTime : -1, brand: [r.x, r.y, r.width, r.height].map((n) => Math.round(n)), cls: window.__cls ?? 0,
          scroll: document.documentElement.scrollWidth - window.innerWidth };
      });
      const cls = () => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput && (e.sources || []).some((s) => s.node && s.node.closest && s.node.closest(".h-header"))) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); };

      for (const [naam, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobiel", { width: 390, height: 844 }]]) {
        const ctx = await browser.newContext({ viewport });
        const p = await ctx.newPage(); await p.addInitScript(cls);
        await p.goto(basis + "/", { waitUntil: "domcontentloaded" });
        await p.waitForTimeout(1200);
        const a = await stand(p);
        eis(a.video && a.t > 0.2 && a.img === 0, `${naam}: homepage speelt de beeldmerk-intro, logo nog verborgen (t=${a.t.toFixed(2)} s)`);
        await p.screenshot({ path: `/tmp/5jaar-intro-${naam}-1s.png`, clip: { x: 0, y: 0, width: viewport.width, height: 110 } }).catch(() => {});
        await p.waitForTimeout(4300);
        const b = await stand(p);
        eis(!b.video && b.img === 1 && b.src === "/5jaar/logo-5years.webp", `${naam}: na de intro staat het 5 YEARS-logo rustig in de header`);
        eis(JSON.stringify(a.brand) === JSON.stringify(b.brand), `${naam}: logoplek gelijk vóór en na de intro (${a.brand} → ${b.brand})`);
        eis(b.cls < 0.01, `${naam}: geen layoutverschuiving in de header (CLS ${b.cls.toFixed(4)})`);
        eis(b.scroll <= 0, `${naam}: geen horizontale scroll`);
        await p.screenshot({ path: `/tmp/5jaar-intro-${naam}-na.png`, clip: { x: 0, y: 0, width: viewport.width, height: 110 } }).catch(() => {});
        await ctx.close();
      }
      {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
        const p = await ctx.newPage(); await p.goto(basis + "/", { waitUntil: "domcontentloaded" }); await p.waitForTimeout(600);
        const s = await stand(p);
        eis(!s.video && s.img === 1, "prefers-reduced-motion: geen intro, logo meteen zichtbaar");
        await ctx.close();
      }
      {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const p = await ctx.newPage(); await p.goto(basis + "/diensten/", { waitUntil: "domcontentloaded" }); await p.waitForTimeout(600);
        const s = await stand(p);
        eis(!s.video && s.img === 1 && s.src === "/5jaar/logo-5years.webp", "andere pagina (/diensten/): logo zonder intro");
        await ctx.close();
      }
      await browser.close();
    } finally { server.kill(); }
  }
}
console.log(fouten.length ? `\n${fouten.length} rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
