// check-vacatures: red/green-proef voor /vacatures van 19 oktober 2026.
//
// Marinus: "Ik mis even de job offers die er eerst wel stonden. Er moet een pagina komen waarin een hoop banen staan
// waar mensen zich voor aan kunnen melden. Maar ook alvast voor Connect met uitleg."
// Rood op main van vóór de wijziging, groen erna.
//
// Draai: node scripts/check-vacatures.mjs   (exit 0 = groen)
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
  await (await server.ssrLoadModule("/proposal/later.tsx")).allesVooraf();
  const render = (route, language = "nl") =>
    renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { basename: "/voorstel", initialEntries: [`/voorstel${route}`] },
        React.createElement(Page, { language }),
      ),
    );
  // Koppen zetten de laatste punt in een eigen span; vergelijk tekst daarom ook zonder tags.
  const tekst = (html) => html.replace(/<[^>]+>/g, "");
  const vac = render("/vacatures");
  const home = render("/");
  const vacTekst = tekst(vac);

  // "een hoop banen": minimaal twintig functies, gefilterd per team, met zoeken.
  const items = (vac.match(/class="h-vac-item/g) || []).length;
  eis(items >= 20, `/vacatures: ${items} functies in plaats van minimaal 20`);
  eis(vac.includes('class="h-vac-zoek"'), "/vacatures: zoekveld ontbreekt");
  for (const team of ["Klanten", "Sales", "Marketing en content", "Tech en AI", "Operations en finance", "Stages"])
    eis(new RegExp(`<button[^>]*aria-pressed="(true|false)"[^>]*>${team} <span>`).test(vac), `/vacatures: teamfilter '${team}' ontbreekt`);
  // "waar mensen zich voor aan kunnen melden": per functie een formulier, plus een voor Connect.
  const vormen = (vac.match(/class="h-vac-vorm"/g) || []).length;
  eis(vormen >= items + 1, `/vacatures: ${vormen} aanmeldformulieren voor ${items} functies en Connect`);
  eis(/<input(?=[^>]*name="email")(?=[^>]*required="")[^>]*>/.test(vac), "/vacatures: e-mailveld niet verplicht");
  const postings = JSON.parse(vac.match(/<script type="application\/ld\+json"[^>]*>(\[[\s\S]*?\])<\/script>/)?.[1] ?? "[]");
  eis(postings.length === items, `/vacatures: ${postings.length} JobPostings voor ${items} functies`);

  // "Maar ook alvast voor Connect met uitleg."
  eis(vac.includes('id="connect"') && vacTekst.includes("Word expert op Connect."), "/vacatures: Connect-blok ontbreekt");
  eis((vac.match(/class="h-vac-stap-nr"/g) || []).length === 5, "/vacatures: Connect-uitleg heeft geen vijf stappen");
  for (const zin of ["15 november", "85%", "Connect rekent 15% per opdracht", "Pas na de keuring sta je zichtbaar op Connect", "Meld je aan als expert"])
    eis(vacTekst.includes(zin), `/vacatures: Connect '${zin}' ontbreekt`);
  eis(!vac.includes("Wij koppelen je"), "/vacatures: Connect zegt dat wij koppelen");

  // Vindbaar: in het menu en vanaf de Connect-sectie op de homepage. Steef met een foto die bestaat.
  const menu = home.match(/<nav class="h-desktop-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
  eis(menu.includes('href="/voorstel/vacatures"'), "menu: geen link naar /vacatures in de hoofdnavigatie");
  eis(home.includes('href="/voorstel/vacatures#connect"') && home.includes('href="/voorstel/vacatures#functies"'), "home: Connect-sectie linkt niet naar aanmelden en vacatures");
  eis(!vac.includes('src="/images/Steef-Komen.webp"'), "/vacatures: foto Steef wijst naar een pad dat niet laadt");

  // Later die dag (Marinus): "Graag ook even Growth Manager als baan erbij zetten."
  eis(vac.includes('id="growth-manager"') && vac.includes("<b>Growth Manager</b>"), "/vacatures: Growth Manager ontbreekt");
  // "En bij SocialNow Connect graag our team of experts. Met de details daar allemaal blauw niet groen."
  eis(tekst(home).includes("Ons team van experts.") && tekst(render("/", "en")).includes("Our team of experts."), "home: Connect-kop is niet 'Our team of experts'");
  const cxCss = lees("proposal/connect-experts.css");
  const cxDeel = cxCss.slice(cxCss.indexOf("/* 19 oktober 2026: ontwerp 1"));
  eis(cxDeel.length > 100 && !/#25d366|#1a9c4b/i.test(cxDeel) && cxDeel.includes("#20afde"), "Connect-sectie: accenten zijn nog groen in plaats van blauw");
  const vacCss = lees("proposal/vacatures-page.css");
  const vacConnect = vacCss.slice(vacCss.indexOf("/* Connect op wit"), vacCss.indexOf("@media (max-width: 1100px)"));
  eis(vacConnect.length > 100 && !/#25d366|#1a9c4b|#76e7a2/i.test(vacConnect), "/vacatures: Connect-blok is nog groen");
  // "Bij vullen de tekst graag wit maken."
  eis(/cx-wit-knop:is\(:hover, :focus-visible, :active\) > span:first-child \{ color: #fff !important; -webkit-text-fill-color: #fff/.test(cxCss), "Connect-knop: tekst niet wit bij vullen");

  // Wat de bezoeker in en/de/fr ziet.
  const escape = (t) => t.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
  const nieuweZinnen = ["Ons team van experts.", "Word expert op Connect.", "Kies je plek.", "Meld je aan als expert", "Sales Development Representative", "Veilig betaald", "Marketing en content"];
  for (const taal of ["en", "de", "fr"]) {
    const woorden = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
    const pagina = tekst(render("/vacatures", taal)) + tekst(render("/", taal));
    for (const zin of nieuweZinnen) {
      const vertaald = woorden[zin];
      eis(Boolean(vertaald) && pagina.includes(escape(vertaald).replaceAll("&#x27;", "&#x27;")), `${taal} /vacatures: '${zin}' niet vertaald op de pagina`);
    }
    if (woorden["Word expert op Connect."]) eis(!pagina.includes("Word expert op Connect."), `${taal} /vacatures: Nederlandse kop staat er nog`);
  }
} finally {
  await server.close();
}

if (fouten.length) {
  console.error(`ROOD: ${fouten.length} eisen niet gehaald`);
  for (const f of fouten) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("GROEN: vacatures en Connect-aanmelding");
