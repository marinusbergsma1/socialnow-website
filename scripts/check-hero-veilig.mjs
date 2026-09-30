// check-hero-veilig: red/green-proef voor de hero en Mijn waarom van 30 september 2026.
//
// Marinus, 30 september 2026: "bij landen gewoon logo animatie OS zoals eerst ook en deze [OS-film] meer omhoog met
// daaronder alle veiligheid en databescherming video's starten met 1 dan daaronder kleine nummertjes met een eventuele
// naam", en "Hier [Mijn waarom] wil ik een werkbalk met alles wat ik voor Light Art Collection heb gedaan. De Artist
// Impressions." Plus de afspraak van 29 september: geen modelnamen in sitetekst.
// Rood op main van vóór de wijziging, groen erna. Draai: node scripts/check-hero-veilig.mjs   (exit 0 = groen)
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { existsSync, readFileSync } from "node:fs";

// Sommige onderdelen lezen tijdens het renderen de browser (LogoIntro: window.matchMedia). Voor deze renderproef
// volstaat een minimale browserschil; de proef gaat over inhoud en opmaakregels, niet over gedrag.
if (typeof globalThis.window === "undefined") {
  const lijst = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  const niets = () => {};
  const opslag = { getItem: () => null, setItem: niets, removeItem: niets };
  globalThis.window = {
    matchMedia: lijst, addEventListener: niets, removeEventListener: niets, scrollTo: niets,
    requestAnimationFrame: niets, cancelAnimationFrame: niets, setTimeout, clearTimeout,
    location: { href: "https://socialnow.nl/", pathname: "/", search: "", hash: "", origin: "https://socialnow.nl" },
    innerWidth: 1440, innerHeight: 900, localStorage: opslag, sessionStorage: opslag,
    navigator: { userAgent: "node", language: "nl" },
  };
  globalThis.localStorage ??= opslag;
  globalThis.sessionStorage ??= opslag;
}

const fouten = [];
const eis = (ok, tekst) => { if (!ok) fouten.push(tekst); };
const lees = (pad) => (existsSync(pad) ? readFileSync(pad, "utf8") : "");

const server = await createServer({
  configFile: false,
  logLevel: "silent",
  resolve: { alias: { "@socialnow/i18n": `${process.cwd()}/proposal/i18n` } },
  ssr: {
    noExternal: ["react-router-dom", "react-router"],
    resolve: { conditions: ["module-sync", "node", "development"] },
  },
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { MemoryRouter } = await server.ssrLoadModule("react-router-dom");
  const { default: Page } = await server.ssrLoadModule("/proposal/WebsiteProposal.tsx");
  const render = (route, language = "nl") =>
    renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { basename: "/voorstel", initialEntries: [`/voorstel${route}`] },
        React.createElement(Page, { language }),
      ),
    );
  const nl = render("/");
  const en = render("/", "en");
  const hero = nl.slice(nl.indexOf('id="home"'), nl.indexOf('id="bereikt"') > 0 ? nl.indexOf('id="bereikt"') : undefined);

  // 1. De logo-animatie van het OS staat weer bovenaan de hero, vóór het team en de kop.
  const logo = hero.indexOf("/video/bedankt/logo-animatie.mp4");
  eis(logo > 0 && logo < hero.indexOf("<h1"), "hero begint met de OS-logo-animatie, vóór de kop");
  // 2. De OS-film staat in de hero, de Brusselfilm niet meer; de OS-film komt vóór de veiligheidsfilms.
  eis(hero.includes("/video/os/os-booth-en.mp4"), "OS-film staat in de hero");
  eis(!hero.includes("bedankt-brussel.mp4"), "Brusselfilm staat niet meer in de hero");
  eis(hero.indexOf("os-booth-en.mp4") < hero.indexOf("h-film-veilig"), "OS-film staat boven de veiligheidsfilms");
  // 3. Vijf veiligheidsfilms met kleine nummers en namen, beginnend bij 1.
  const nummers = hero.slice(hero.indexOf("h-veilig-nummers"));
  eis((nummers.match(/<button/g) || []).length >= 5, "vijf genummerde knoppen onder de veiligheidsfilm");
  eis(/<video[^>]+vertrouwen-versleuteling-nl\.mp4/.test(hero), "de hero start met veiligheidsfilm 1 (versleuteling)");
  eis(/aria-current="true"><b>1<\/b>/.test(hero), "knop 1 staat als eerste actief");
  // 4. Strook met de Artist Impressions voor Light Art Collection in Mijn waarom.
  const waarom = nl.slice(nl.indexOf('id="verhaal"'));
  eis(waarom.includes("h-lac"), "Light Art Collection-strook staat in het verhaal");
  // Ronde 2 (30 september): "3 is genoeg", elk paar nieuw (zie scripts/proef-light-art-drie.mjs), geladen uit images/light-art/licht.
  eis(["eternal-sundown", "infinita", "butterfly-effect"].every((b) => waarom.includes(`/images/light-art/licht/${b}-voor-800.webp`) && waarom.includes(`/images/light-art/licht/${b}-na-800.webp`)), "Eternal Sundown, Infinita en Butterfly Effect staan voor en na in de strook");
  // 4b. Elke impressie heeft een voor-beeld met schuif (Marinus: "Ik mis de before foto's met slider functie").
  const schuiven = (waarom.match(/class="h-lac-schuif"/g) || []).length;
  eis(schuiven === 3, "elke Artist Impression heeft een voor-en-na-schuif, drie in totaal");
  for (const pad of [...waarom.matchAll(/src="(\/images\/light-art\/[^"]+)"/g)].map((m) => m[1]))
    eis(existsSync(`public${pad}`), `beeld bestaat: ${pad}`);
  eis([...waarom.matchAll(/src="\/images\/light-art\//g)].length === 6, "zes nieuwe beelden, drie voor en drie na, staan in de strook");
  // 4c. Odoo-regel (Marinus, 30 september): "Integrated in ODOO's ERP system."
  eis(hero.includes("INTEGRATED IN ODOO’S ERP SYSTEM") && !hero.includes("IMPLEMENTATION POSSIBLE"), "Odoo-regel luidt Integrated in Odoo’s ERP system");
  // 5. Geen modelnamen in de sitetekst (afspraak 29 september).
  for (const [taal, html] of [["nl", nl], ["en", en]]) {
    const tekst = html.replace(/<[^>]+>/g, " ");
    eis(!/\b(Claude|Codex|Gemini|Anthropic|OpenAI|ChatGPT|GPT-\d)\b/.test(tekst), `geen modelnamen in de homepage (${taal})`);
  }
  // 6. Vertaald in het Engels.
  eis(en.includes("Security and data protection"), "titel veiligheidsfilms vertaald (en)");
  eis(en.includes("Artist Impressions for Light Art Collection"), "strook Light Art Collection vertaald (en)");
} finally {
  await server.close();
}

if (fouten.length) {
  console.error("ROOD:\n- " + fouten.join("\n- "));
  process.exit(1);
}
console.log("GROEN: hero met logo-animatie, OS-film, vijf veiligheidsfilms, Light Art-strook en geen modelnamen");
