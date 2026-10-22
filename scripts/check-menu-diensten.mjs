#!/usr/bin/env node
// Proef (Marinus 22 okt 2026): het Products-menu met "SocialNow OS" (OS groen) en "SocialNow Connect" (Connect blauw), elk met één
// regel uitleg en een groen pijltje, is heel duidelijk. Services krijgt precies zo'n uitklapmenu, en op mobiel staan OS, Connect en
// de diensten als kaarten in kleur, met grote tikvlakken en niets over de rand. Alle talen, titels hooguit twee regels op 390 en 1440,
// letters nooit aan elkaar, geen gedachtestreepjes.
// Gebruik: node scripts/check-menu-diensten.mjs                     bron en woordenboeken
//          node scripts/check-menu-diensten.mjs --dist [map]        ook in de browser, tegen de gebouwde dist/ (geen server nodig)
//          node scripts/check-menu-diensten.mjs <url>               ook in de browser, tegen een live adres of Vercel-preview
//          --foto <map>  schermafdrukken met het menu open (en en nl, 390 en 1440). PLAYWRIGHT_CORE wijst naar playwright-core.
// Zelfde dag (regie): Security wordt een hoofdpunt in het menu, rustig (klein schildje, geen pil), naar /security. De proef
// test dat de link naar /security wijst, niet dat de pagina al bestaat (check-fix bouwt die).
// Rood op main (ce8c917 en live socialnow.nl), groen op de tak menu-services-20261022.
import fs from "node:fs";
import path from "node:path";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (pad) => (fs.existsSync(pad) ? fs.readFileSync(pad, "utf8") : "");
const TALEN = ["en", "nl", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const woordenboek = Object.fromEntries(TALEN.filter((t) => t !== "nl").map((t) => [t, JSON.parse(lees(`proposal/i18n/${t}.json`) || "{}")]));
const vertaal = (tekst, taal) => (taal === "nl" ? tekst : woordenboek[taal][tekst] ?? woordenboek.en[tekst] ?? tekst);
const STREEP = /[–—]/;

// 1. Bron
const menu = lees("proposal/Producten.tsx"), shell = lees("proposal/WebsiteProposal.tsx"), css = lees("proposal/hoofdmenu.css");
const pricing = lees("proposal/Pricing.tsx"), experts = lees("proposal/ConnectExperts.tsx");
const blok = menu.slice(menu.indexOf("export const DIENSTEN"), menu.indexOf("] as const;", menu.indexOf("export const DIENSTEN")));
const DIENSTEN = [...blok.matchAll(/\{ naar: "([^"]+)", titel: "([^"]+)", regel: "([^"]+)", soort: "([^"]+)" \}/g)].map(([, naar, titel, regel, soort]) => ({ naar, titel, regel, soort }));
const PRODUCTEN = [{ naam: "OS", regel: "AI-powered management & operations.", soort: "os" }, { naam: "Connect", regel: "De juiste experts voor jouw bedrijf.", soort: "connect" }];
eis(DIENSTEN.length >= 3, `Producten.tsx: DIENSTEN met kaarten voor het Diensten-menu (${DIENSTEN.length})`);
eis(/function Uitklapmenu\(/.test(menu) && /<Uitklapmenu naam="producten"/.test(menu) && /<Uitklapmenu naam="diensten"/.test(menu), "Producten en Diensten delen één uitklapmenu: zelfde opmaak, animatie, toetsen en focus");
eis(/path === "\/diensten" \? (<React\.Fragment key=\{path\}>)?<DienstenMenu/.test(shell), "desktop: Diensten in de hoofdnavigatie is het uitklapmenu");
const ankers = new Set([...pricing.matchAll(/<Rij\s+id="(\w+)"/g)].map((m) => `prijs-${m[1]}-titel`).concat(pricing.includes('id="prijs-los-titel"') ? ["prijs-los-titel"] : [], pricing.includes('id="prijzen"') ? ["prijzen"] : [], experts.includes('id="team"') ? ["team"] : []));
for (const d of DIENSTEN) eis(d.naar.startsWith("/diensten#") && ankers.has(d.naar.split("#")[1]), `kaart "${d.titel}" wijst naar een bestaand anker op /diensten (${d.naar})`);
// Geen nieuwe beweringen: elke onderregel staat al op /diensten (op een slotpunt na).
const dienstenBron = pricing + experts;
for (const d of DIENSTEN) eis(dienstenBron.includes(d.regel) || dienstenBron.includes(d.regel.replace(/\.$/, "")), `onderregel "${d.regel}" komt van /diensten`);
eis(DIENSTEN.filter((d) => /\b(OS|Connect)\b/.test(d.titel)).every((d) => d.soort === d.titel.match(/\b(OS|Connect)\b/)[1].toLowerCase()), "kleur alleen bij OS (groen) en Connect (blauw)");
eis(/DIENSTEN\.map/.test(shell) && /PRODUCTEN\.map/.test(shell) && /h-mobile-kaarten/.test(shell) && /<i className=\{p\.soort\}>/.test(shell) && /<span>\{p\.regel\}<\/span>/.test(shell), "mobiel: OS, Connect en de diensten als kaarten met onderregel");
eis(/a\.h-mobile-product\{[^}]*min-height:(\d+)px/.test(css) && Number(css.match(/a\.h-mobile-product\{[^}]*min-height:(\d+)px/)[1]) >= 48, "mobiel: tikvlak minstens 48 px hoog");
eis(/\.h-producten-menu[^{]*\{[^}]*font-variant-ligatures:none/.test(css) && /\.h-mobile-nav :is\([^)]*\)\{font-variant-ligatures:none/.test(css), "letters nooit aan elkaar in menu en mobiele kaarten");
eis(/export const SECURITY_PAD = "\/security";/.test(menu) && /<NavLink to=\{SECURITY_PAD\}/.test(menu) && /<span translate="no">Security<\/span>/.test(menu), "Security: eigen menu-item naar /security, in elke taal \"Security\"");
eis(/<DienstenMenu \/><SecurityLink \/>/.test(shell) && /<SecurityLink mobiel/.test(shell), "Security op desktop (na Diensten) en mobiel");
eis(/ShieldCheck/.test(menu) && !/sn-pill[^"]*h-security|h-security[^"]*sn-pill/.test(menu), "Security: klein schildje, geen pilknop");
// 2. Woordenboeken
for (const taal of TALEN.filter((t) => t !== "nl")) {
  const nodig = ["Producten", "Diensten", ...PRODUCTEN.map((p) => p.regel).filter((r) => r !== "AI-powered management & operations."), ...DIENSTEN.flatMap((d) => [d.titel, d.regel])];
  const mist = nodig.filter((k) => !woordenboek[taal][k]);
  eis(DIENSTEN.length > 0 && mist.length === 0, `${taal}: alle menuteksten vertaald${mist.length ? ` (mist: ${mist.join(" | ")})` : ""}`);
  const merk = DIENSTEN.filter((d) => /\b(OS|Connect)\b/.test(d.titel)).every((d) => new RegExp(`\\b${d.titel.match(/\b(OS|Connect)\b/)[1]}\\b`).test(woordenboek[taal][d.titel] ?? ""));
  eis(DIENSTEN.length > 0 && merk, `${taal}: OS en Connect blijven letterlijk staan, zodat de kleur meegaat`);
  eis(!DIENSTEN.some((d) => STREEP.test(vertaal(d.titel, taal) + vertaal(d.regel, taal))), `${taal}: geen gedachtestreepjes`);
}

// 3. Browser: tegen dist/ of een adres
const args = process.argv.slice(2);
const fotoMap = args.includes("--foto") ? args[args.indexOf("--foto") + 1] : null;
const distMap = args.includes("--dist") ? (args[args.indexOf("--dist") + 1] && !args[args.indexOf("--dist") + 1].startsWith("-") && !args[args.indexOf("--dist") + 1].startsWith("http") ? args[args.indexOf("--dist") + 1] : "dist") : null;
const url = args.find((a) => /^https?:/.test(a));
if (distMap || url) {
  const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome" });
  const basis = url ? url.replace(/\/$/, "") : "https://menu.proef";
  const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".mp4": "video/mp4", ".ico": "image/x-icon", ".xml": "application/xml" };
  const nieuweContext = async (viewport, taal) => {
    // De taal van de proefbrowser mag niet meetellen: anders stuurt de taaldetectie / door naar /nl.
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: taal === "nl" ? "nl-NL" : "en-GB" });
    await ctx.addCookies([{ name: "sn-taal", value: taal, url: basis }]);
    // Geen cookiemelding en geen intro in de proef; die staan los van het menu.
    await ctx.addInitScript(() => { try { sessionStorage.setItem("sn-preview-logo-v5", "seen"); localStorage.setItem("sn-koekje", "1"); } catch {} });
    if (distMap) await ctx.route("https://menu.proef/**", async (route) => {
      const p = decodeURIComponent(new URL(route.request().url()).pathname);
      const kandidaten = [p, path.join(p, "index.html"), `${p}.html`].map((k) => path.join(distMap, k));
      const bestand = kandidaten.find((k) => fs.existsSync(k) && fs.statSync(k).isFile()) ?? path.join(distMap, p.split("/")[1] && TALEN.includes(p.split("/")[1]) ? `${p.split("/")[1]}/index.html` : "index.html");
      await route.fulfill({ status: 200, contentType: TYPES[path.extname(bestand)] ?? "application/octet-stream", body: fs.readFileSync(bestand) });
    });
    else await ctx.route(/(cookiebot|consent\.cookiebot|googletagmanager|google-analytics|vercel-insights|_vercel\/insights)/, (r) => r.abort());
    return ctx;
  };
  const GROEN = "rgb(37, 211, 102)", BLAUW = "rgb(32, 175, 222)";
  const meetKaarten = (page, selector) => page.evaluate((selector) => [...document.querySelectorAll(selector)].map((a) => {
    const b = a.querySelector("b") ?? a, s = a.querySelector("span"), r = a.getBoundingClientRect(), cb = getComputedStyle(b);
    const regels = Math.round(b.getBoundingClientRect().height / parseFloat(cb.lineHeight));
    return { titel: b.innerText.trim(), regel: s?.innerText.trim(), regels, hoogte: Math.round(r.height), links: Math.round(r.left), rechts: Math.round(r.right),
      kleuren: [...b.querySelectorAll("i")].map((i) => [i.className, i.textContent, getComputedStyle(i).color]), pijl: !!a.querySelector("svg"),
      liga: cb.fontVariantLigatures, pijlKleur: a.querySelector("svg") ? getComputedStyle(a.querySelector("svg")).color : "" };
  }), selector);
  const geenScroll = (page) => page.evaluate(() => ({ breed: document.documentElement.scrollWidth, raam: innerWidth }));
  const kleurOk = (k) => k.kleuren.every(([c, w, kleur]) => (c === "os" && w === "OS" && kleur === GROEN) || (c === "connect" && w === "Connect" && kleur === BLAUW));
  for (const taal of TALEN) {
    const prefix = taal === "en" ? "" : `/${taal}`;
    const verwachtD = DIENSTEN.map((d) => ({ titel: vertaal(d.titel, taal), regel: vertaal(d.regel, taal), kleur: /\b(OS|Connect)\b/.test(d.titel) }));
    const verwachtP = PRODUCTEN.map((p) => ({ titel: `SocialNow ${p.naam}`, regel: vertaal(p.regel, taal) }));
    // Desktop 1440
    {
      const ctx = await nieuweContext({ width: 1440, height: 900 }, taal);
      const page = await ctx.newPage();
      await page.goto(`${basis}${prefix}/projecten`, { waitUntil: "networkidle" }).catch(() => {});
      const knop = page.locator(".h-desktop-nav .h-uitklap-diensten > button");
      const heeft = await knop.count();
      eis(heeft === 1, `${taal} 1440: Diensten-knop met uitklapmenu in de hoofdnavigatie`);
      if (heeft) {
        await knop.focus(); await page.keyboard.press("Enter"); await page.waitForTimeout(250);
        eis(await knop.getAttribute("aria-expanded") === "true" && await page.locator("#h-diensten-menu").isVisible(), `${taal} 1440: Enter opent het menu (aria-expanded)`);
        const k = await meetKaarten(page, "#h-diensten-menu a");
        eis(k.length === DIENSTEN.length && k.every((x, i) => x.titel === verwachtD[i].titel && x.regel === verwachtD[i].regel), `${taal} 1440: ${k.length} kaarten met titel en één regel uitleg in de juiste taal${k.length ? "" : " (geen kaarten)"}`);
        if (k.some((x, i) => x.titel !== verwachtD[i]?.titel || x.regel !== verwachtD[i]?.regel)) console.log("       gezien:", JSON.stringify(k.map((x) => [x.titel, x.regel])));
        eis(k.every((x) => x.regels <= 2), `${taal} 1440: titels hooguit twee regels (${k.map((x) => x.regels).join(",")})`);
        eis(k.every(kleurOk) && k.filter((x) => x.kleuren.length).length === verwachtD.filter((d) => d.kleur).length, `${taal} 1440: OS groen, Connect blauw, verder geen kleur`);
        eis(k.every((x) => x.pijl && x.pijlKleur === GROEN), `${taal} 1440: groen pijltje op elke kaart`);
        eis(k.every((x) => x.liga === "none"), `${taal} 1440: geen ligaturen`);
        eis(k.every((x) => x.links >= 0 && x.rechts <= 1440), `${taal} 1440: menu binnen het scherm`);
        await page.keyboard.press("Tab");
        eis(await page.evaluate(() => document.activeElement?.closest("#h-diensten-menu") !== null), `${taal} 1440: Tab gaat van de knop naar de eerste kaart`);
        if (fotoMap && (taal === "en" || taal === "nl")) await page.screenshot({ path: path.join(fotoMap, `desktop-1440-${taal}-diensten.png`), clip: { x: 0, y: 0, width: 1440, height: 560 } });
        await page.keyboard.press("Escape"); await page.waitForTimeout(150);
        eis(!(await page.locator("#h-diensten-menu").isVisible()) && await page.evaluate(() => document.activeElement?.classList.contains("h-producten-knop") && !!document.activeElement.closest(".h-uitklap-diensten")), `${taal} 1440: Escape sluit en zet de focus terug op de knop`);
        // Producten: zelfde kaartopmaak, ook bij aanwijzen met de muis.
        await page.locator(".h-uitklap-producten > button").hover(); await page.waitForTimeout(250);
        const p = await meetKaarten(page, "#h-producten-menu a");
        eis(p.length === 2 && p.every((x, i) => x.titel === verwachtP[i].titel && x.regel === verwachtP[i].regel) && p.every(kleurOk) && p.every((x) => x.kleuren.length === 1), `${taal} 1440: Producten blijft SocialNow OS (groen) en Connect (blauw) met onderregel`);
        if (fotoMap && (taal === "en" || taal === "nl")) await page.screenshot({ path: path.join(fotoMap, `desktop-1440-${taal}-producten.png`), clip: { x: 0, y: 0, width: 1440, height: 420 } });
        await page.locator(".h-uitklap-diensten > button").hover(); await page.waitForTimeout(250);
        eis(await page.locator("#h-diensten-menu").isVisible() && !(await page.locator("#h-producten-menu").isVisible()), `${taal} 1440: bij aanwijzen opent Diensten en sluit Producten`);
        if (taal === "nl") {
          await page.locator("#h-diensten-menu a").first().click(); await page.waitForTimeout(900);
          const plek = await page.evaluate(() => ({ pad: location.pathname + location.hash, top: Math.round(document.getElementById(location.hash.slice(1))?.getBoundingClientRect().top ?? -1), open: !document.getElementById("h-diensten-menu")?.hidden }));
          eis(plek.pad === `/nl${DIENSTEN[0].naar}` && plek.top >= 0 && plek.top < 450 && !plek.open, `nl 1440: klik op ${DIENSTEN[0].titel} gaat naar ${plek.pad}, kop in beeld (top ${plek.top}), menu dicht`);
        }
        const sec = await page.evaluate(() => { const a = document.querySelector(".h-desktop-nav a.h-security"); if (!a) return null; const cs = getComputedStyle(a), svg = a.querySelector("svg");
          const d = document.querySelector(".h-desktop-nav .h-uitklap-diensten");
          return { href: a.getAttribute("href"), tekst: a.textContent.trim(), schild: svg ? getComputedStyle(svg).color : "", bg: cs.backgroundColor, rand: cs.borderTopWidth, hoogte: Math.round(a.getBoundingClientRect().height), naDiensten: !!d && d.nextElementSibling === a }; });
        eis(!!sec && sec.href === `${prefix}/security` && sec.tekst === "Security", `${taal} 1440: Security wijst naar ${prefix}/security (${sec?.href})`);
        eis(!!sec && sec.naDiensten && sec.schild === GROEN && /rgba\(0, 0, 0, 0\)|transparent/.test(sec.bg) && sec.rand === "0px", `${taal} 1440: Security na Diensten, groen schildje, geen pil (${sec?.bg}, rand ${sec?.rand})`);
        const s = await geenScroll(page);
        eis(s.breed <= s.raam, `${taal} 1440: geen horizontale scroll (${s.breed} <= ${s.raam})`);
      }
      await ctx.close();
    }
    // 1280: kleinste breedte met de volle navigatie; met Security erbij moet alles nog naast elkaar passen.
    {
      const ctx = await nieuweContext({ width: 1280, height: 800 }, taal);
      const page = await ctx.newPage();
      await page.goto(`${basis}${prefix}/projecten`, { waitUntil: "networkidle" }).catch(() => {});
      const r = await page.evaluate(() => { const nav = document.querySelector(".h-desktop-nav"), na = nav?.nextElementSibling; if (!nav || getComputedStyle(nav).display === "none") return null;
        const kinderen = [...nav.children].map((k) => k.getBoundingClientRect()); const claim = document.querySelector(".h-header-claim")?.getBoundingClientRect();
        return { navRechts: Math.round(nav.getBoundingClientRect().right), volgende: Math.round(na.getBoundingClientRect().left), claimRechts: Math.round(claim?.right ?? 0), eenRij: kinderen.every((k) => Math.abs(k.top - kinderen[0].top) < 12), breed: document.documentElement.scrollWidth };
      });
      eis(!!r && r.navRechts <= r.volgende && r.eenRij && r.claimRechts <= 1280 && r.breed <= 1280, `${taal} 1280: navigatie met Security past op één rij naast taal en knoppen (${r ? `${r.navRechts} <= ${r.volgende}, knop tot ${r.claimRechts}` : "geen navigatie"})`);
      if (fotoMap && (taal === "en" || taal === "nl")) await page.screenshot({ path: path.join(fotoMap, `desktop-1280-${taal}-navigatie.png`), clip: { x: 0, y: 0, width: 1280, height: 120 } });
      await ctx.close();
    }
    // Mobiel 390
    {
      const ctx = await nieuweContext({ width: 390, height: 844 }, taal);
      const page = await ctx.newPage();
      await page.goto(`${basis}${prefix}/projecten`, { waitUntil: "networkidle" }).catch(() => {});
      await page.locator(".h-menu-toggle").click(); await page.waitForTimeout(300);
      const groepen = await page.locator("#mobile-nav .h-mobile-kaarten").count();
      eis(groepen === 2, `${taal} 390: mobiel menu toont twee groepen kaarten, Producten en Diensten (${groepen})`);
      const k = await meetKaarten(page, "#mobile-nav a.h-mobile-product");
      const p = k.slice(0, 2), d = k.slice(2);
      eis(p.length === 2 && p.every((x, i) => x.titel === verwachtP[i].titel && x.regel === verwachtP[i].regel) && p.every(kleurOk) && p.every((x) => x.kleuren.length === 1), `${taal} 390: SocialNow OS groen en Connect blauw, met dezelfde onderregels`);
      eis(d.length === DIENSTEN.length && d.every((x, i) => x.titel === verwachtD[i].titel && x.regel === verwachtD[i].regel) && d.every(kleurOk), `${taal} 390: diensten als kaarten met titel en uitleg`);
      eis(k.length > 2 && k.every((x) => x.regels <= 2), `${taal} 390: titels hooguit twee regels (${k.map((x) => x.regels).join(",")})`);
      eis(k.length > 2 && k.every((x) => x.hoogte >= 56), `${taal} 390: grote tikvlakken (min ${Math.min(...k.map((x) => x.hoogte))} px)`);
      eis(k.length > 2 && k.every((x) => x.links >= 0 && x.rechts <= 390), `${taal} 390: geen kaart over de rand`);
      eis(k.length > 2 && k.every((x) => x.liga === "none" && x.pijlKleur === GROEN), `${taal} 390: geen ligaturen, groen pijltje`);
      const ms = await page.evaluate(() => { const a = document.querySelector("#mobile-nav a.h-security"); if (!a) return null; const r = a.getBoundingClientRect(); return { href: a.getAttribute("href"), tekst: a.textContent.trim(), hoogte: Math.round(r.height), rechts: Math.round(r.right), schild: getComputedStyle(a.querySelector("svg")).color }; });
      eis(!!ms && ms.href === `${prefix}/security` && ms.tekst === "Security" && ms.schild === GROEN && ms.hoogte >= 44 && ms.rechts <= 390, `${taal} 390: Security in het mobiele menu, naar ${prefix}/security, groen schildje (${ms?.href}, ${ms?.hoogte} px)`);
      const s = await geenScroll(page);
      eis(s.breed <= s.raam, `${taal} 390: geen horizontale scroll (${s.breed} <= ${s.raam})`);
      const bereik = await page.evaluate(() => { const c = document.querySelector("#mobile-nav .h-mobile-call"); if (!c) return null; c.scrollIntoView({ block: "end", behavior: "instant" }); const r = c.getBoundingClientRect(); return Math.round(r.bottom) <= innerHeight; });
      eis(bereik === true, `${taal} 390: onderaan het menu blijft Plan een call bereikbaar`);
      if (fotoMap && (taal === "en" || taal === "nl")) {
        await page.evaluate(() => { scrollTo(0, 0); document.getElementById("mobile-nav").scrollTop = 0; }); await page.waitForTimeout(150);
        await page.screenshot({ path: path.join(fotoMap, `mobiel-390-${taal}-menu-boven.png`) });
        await page.evaluate(() => { const n = document.getElementById("mobile-nav"); n.scrollTop = n.scrollHeight; }); await page.waitForTimeout(150);
        await page.screenshot({ path: path.join(fotoMap, `mobiel-390-${taal}-menu-onder.png`) });
      }
      await ctx.close();
    }
  }
  await browser.close();
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
