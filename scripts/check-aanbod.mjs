// check-aanbod: red/green-proef voor het aanbod en de hero van 29 september 2026.
//
// Marinus, 29 september 2026: "Voordat iets live komt moet het altijd RED/GREEN getest worden."
// Deze proef legt vast wat hij die avond vroeg, en is rood op main van vóór de wijziging en groen erna:
//   - (19 oktober 2026) prijzen als blok op /diensten: OS Gratis/€35/€65, website €0 en €2.000 tot €5.000,
//     marketing €3.000 per maand met custom OS, custom OS vanaf €10.000, tokens los, Connect 15%;
//   - geen "Echt waar", en de aanbodpagina in het diepzwart van de homepage;
//   - het echte Salesforce-logo in de hero en in de Salesforce-tegel;
//   - de teamstrook knijpt de tekst niet meer tot een smal kolommetje;
//   - de positionering in de meta-omschrijving en llms.txt, en de vertalingen en/de/fr.
//
// Draai: node scripts/check-aanbod.mjs   (exit 0 = groen)
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
  // 30 september 2026: secties en pagina's laden later (proposal/later.tsx); in Node eerst alles laden, dan renderen.
  await (await server.ssrLoadModule("/proposal/later.tsx")).allesVooraf();
  const render = (route, language = "nl") =>
    renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { basename: "/voorstel", initialEntries: [`/voorstel${route}`] },
        React.createElement(Page, { language }),
      ),
    );
  // 19 oktober 2026 (Marinus): de prijzen staan als blok #prijzen op /diensten; /prijzen stuurt door en staat niet meer in het menu.
  const diensten = render("/diensten");
  const home = render("/");

  // Aanbod: het OS per team, de website en het werk met ons team.
  eis(diensten.includes('id="prijzen"'), "/diensten: prijsblok #prijzen ontbreekt");
  eis(!render("/prijzen").includes("prijs-kaart"), "/prijzen: toont nog een eigen prijspagina");
  eis(!home.includes('href="/voorstel/prijzen"'), "menu: link naar /prijzen staat er nog");
  for (const bedrag of ["€0", "€35", "€65", "€3.000", "€4.000", "€4.500", "€5.000"])
    eis(diensten.includes(`<strong>${bedrag}</strong>`), `/diensten: prijs ${bedrag} ontbreekt`);
  // 19 oktober 2026 (Marinus): Team heet Business, Business heet Enterprise met onbeperkte opslag; USP's van het gratis OS;
  // Connect per periode van 3 maanden, vanaf Meta 1 maand gratis bij geen winst en minimaal €1.000 mediabudget; team per vakgebied.
  for (const zin of ["Gratis Studio", "Studio, 5.000 stockfoto&#x27;s, social media en boekhouding", "Social media management", "Boekhoudpakket", "Geen minimum mediabudget",
    "Kies Enterprise", "Onbeperkte opslag", "Complete branding: logo, kleuren en stijl", "Google Ads: Search, Shopping en Performance Max", "Gratis demowebsite", "Gratis website", "Altijd 3 maanden", "Geen winst? 1 maand gratis", "Mediabudget vanaf €1.000", "Hulp binnen Odoo: inrichting en vragen", "Vast aanspreekpunt uit ons team",
    "Nodig 2 mensen uit", "2 tot 5 medewerkers", "5 tot 10 medewerkers", "1.500 tokens per maand", "4.000 tokens per maand",
    "Custom OS ingericht rond je bedrijf", "Ad-creatie: beeld en video voor je advertenties", "€2.000 tot €5.000", "vanaf €10.000"])
    eis(diensten.includes(zin), `/diensten: '${zin}' ontbreekt`);
  eis(diensten.includes("Meest gekozen") && diensten.includes("Meeste waarde"), "/diensten: geen nadruk op Meta en Business");
  // 19 oktober 2026 (Marinus): pakketten boven de losse diensten; die staan als strook eronder. "Doe maar 4K meest gekozen."
  eis(diensten.indexOf('id="prijzen"') > -1 && diensten.indexOf('id="prijzen"') < diensten.indexOf('id="development"'), "/diensten: pakketten staan niet boven de diensten");
  eis(diensten.includes('class="cx-rij"') && diensten.indexOf('class="cx-rij"') > diensten.indexOf('id="prijzen"'), "/diensten: Connect-sectie van de homepage staat niet onder de prijzen");
  eis(/Meest gekozen[\s\S]{0,200}<h3>Meta<\/h3>/.test(diensten), "/diensten: Meta (€4.000) niet als meest gekozen");
  // 19 oktober 2026 (Marinus): "De punten moeten altijd overeenkomen." Elke kaart in een rij heeft evenveel regels, opslag op plek 2.
  const kaarten = [...diensten.matchAll(/<ul class="prijs-punten">([\s\S]*?)<\/ul>/g)].map((m) => [...m[1].matchAll(/<li(?! class="prijs-groep")[^>]*>([^<]*)<\/li>/g)].map((l) => l[1]));
  eis(kaarten.length === 7, `/diensten: ${kaarten.length} kaarten in plaats van 7`);
  eis(kaarten.slice(0, 3).every((k) => k.length === 10 && /opslag/i.test(k[1])), "/diensten: OS-kaarten hebben niet dezelfde rijen met opslag op plek 2");
  eis(kaarten.slice(3).every((k) => k.length === 9 && /Meta Ads/.test(k[3])), "/diensten: Connect-kaarten hebben niet dezelfde negen rijen");
  // "Deze zijn nu wel écht te lang." De details staan in één uitklapbare tabel.
  eis(diensten.includes('class="prijs-vergelijk"'), "/diensten: vergelijkingstabel ontbreekt");
  // 19 oktober 2026 (Marinus): "AI agents ipv Milo" in de prijzen, en de Connect-pakketten per onderwerp uitgewerkt.
  eis((diensten.match(/Helft vooraf, helft bij oplevering\./g) || []).length === 2, "/diensten: betaling helft vooraf, helft bij oplevering niet bij website en custom OS");
  // "De prijs voor websites moeten er ook staan."
  for (const bedrag of ["€2.000 tot €5.000", "vanaf €10.000"]) eis(diensten.includes(`<strong>${bedrag}</strong>`), `/diensten: losse prijs ${bedrag} niet groot in beeld`);
  eis(!/Dashboard, CRM en Milo/.test(diensten) && diensten.includes("Dashboard, CRM en AI agents"), "/diensten: Milo staat nog in de prijzen");
  for (const groep of ["Merk en website", "Content", "Advertenties", "Begeleiding", "Financiën", "Afspraken"])
    eis(diensten.includes(`colSpan="5">${groep}</th>`) || diensten.includes(`colspan="5">${groep}</th>`), `/diensten: groep '${groep}' niet in de vergelijkingstabel`);
  eis(diensten.includes("Head of Meta Ads") && !diensten.includes("Meta Ads Specialist"), "/diensten: Sergio niet als Head of Meta Ads");
  for (const oud of ["€5.500", "€6.000", "Content + Meta", "Onbeperkt teamleden", "Kies Team", "100 GB opslag", "Losse diensten"])
    eis(!diensten.includes(oud), `/diensten: oud pakket '${oud}' staat er nog`);
  eis(!/Nano Banana|Veo 3/.test(diensten), "/diensten: modelnamen in de prijzen");
  eis(!diensten.includes("Echt waar"), "/diensten: 'Echt waar' staat er nog");

  // Bedragen in de notatie van de taal: in het Engels leest €3.000 als drie euro.
  const notatie = { en: ["€3,000", "€4,500"], de: ["3.000 €", "4.500 €"] };
  for (const [taal, verwacht] of Object.entries(notatie)) {
    const pagina = render("/diensten", taal);
    for (const bedrag of verwacht) eis(pagina.includes(`<strong>${bedrag}</strong>`), `${taal} /diensten: bedrag niet als '${bedrag}'`);
  }

  // Wat de bezoeker in en/de/fr ziet, niet alleen of de sleutel in de json staat. De verwachte tekst komt uit het woordenboek.
  const escape = (t) => t.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
  const nieuweZinnen = ["Diensten en prijzen", "Al in je gratis OS", "Geen winst? 1 maand gratis", "Wij doen het werk, met échte mensen", "Nodig 2 mensen uit", "Custom OS ingericht rond je bedrijf"];
  for (const taal of ["en", "de", "fr"]) {
    const woorden = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
    const pagina = render("/diensten", taal);
    for (const zin of nieuweZinnen) {
      const vertaald = woorden[zin];
      eis(Boolean(vertaald) && pagina.includes(escape(vertaald)), `${taal} /diensten: '${zin}' niet vertaald op de pagina`);
      if (vertaald && vertaald !== zin) eis(!pagina.includes(escape(zin)), `${taal} /diensten: Nederlands '${zin}' staat er nog`);
    }
  }

  // Salesforce-logo: echt logo, in de hero en in de tegel
  const logo = "/images/partners/salesforce.svg";
  eis((home.match(new RegExp(`src="${logo}"`, "g")) || []).length >= 2, "home: echt Salesforce-logo niet in hero én tegel");
  eis(!home.includes("NEXT STEP SALESFORCE"), "home: 'NEXT STEP SALESFORCE' is nog alleen tekst");
  const svg = lees(`public${logo}`);
  eis(svg.includes('viewBox="0 0 273 191"') && svg.includes("#00A1E0"), "logo: public/images/partners/salesforce.svg is niet het officiële logo");
} finally {
  await server.close();
}

// 19 oktober 2026 (Marinus): de Connect-pilot op workers.dev weg van socialnow.nl; /connect/ zegt groot "Coming November 15th".
const connectPagina = lees("public/connect/index.html");
eis(!/workers\.dev/.test(connectPagina) && /Coming <span>November 15th\.<\/span>/.test(connectPagina), "/connect/: nog de pilot of geen Coming November 15th");
eis(!/workers\.dev/.test(lees("proposal/ConnectExperts.tsx")) && !/href="\/connect\/">\s*<span className="cx-lang">Meld je aan/.test(lees("proposal/ConnectExperts.tsx")), "Connect-sectie: aanmelden gaat nog naar de pilot");
eis(lees("proposal/ConnectExperts.tsx").includes("cx-binnenkort"), "Connect-sectie: Coming November 15th ontbreekt");

// 19 oktober 2026 (Marinus): "Ik wil dat je die duurdere prijzen pas ziet bij betaling."
eis(!/46,67|86,67|43,75|81,25/.test(lees("proposal/Pricing.tsx").replace(/\/\/.*|\{\/\*[\s\S]*?\*\/\}/g, "")) && !lees("proposal/Pricing.tsx").includes("prijs-periode\""), "/diensten: maandprijzen of schakelaar nog zichtbaar");

// Kleur: diepzwart zoals de homepage
const prijsCss = lees("proposal/pricing.css");
eis(!/\.prijs-maatwerk-bedrag strong \{[^}]*120px/.test(prijsCss), "css: reuzencijfer voor het OS op maat staat er nog");
eis(/\.sn-site \.prijs \{ --prijs-kaart: #0b0f12; \}/.test(prijsCss), "css: kaarten niet in de tegelkleur van de homepage");
eis(/\.sn-site \.prijs-gratis \{ background:[^}]*#000;/.test(prijsCss), "css: gratis-blok niet diepzwart");
eis(/\.sn-site \.prijs-maatwerk \{ background:[^}]*#000;/.test(prijsCss), "css: OS-op-maatblok niet diepzwart");

// Teamstrook
const expCss = lees("proposal/experience.css");
eis(!/\.h-hero-tekst > \.h-team-trust \{[^}]*flex-wrap: nowrap/.test(expCss), "css: teamstrook staat nog op nowrap");
eis(/> \.h-team-trust > span:last-child \{ flex: 1 1 190px; min-width: 190px; \}/.test(expCss), "css: teamtekst heeft geen minimumbreedte");

// Positionering en llms.txt
const regel = "De AI-gestuurde persoonlijke werkplek, met échte professionals en menselijk contact.";
eis((lees("index.html").match(new RegExp(regel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length === 3, "index.html: positionering niet in description, og en twitter");
const llms = lees("public/llms.txt");
eis(llms.includes("AI-gestuurde persoonlijke werkplek"), "llms.txt: positionering ontbreekt");
eis(!llms.includes("vanaf €3.000 per maand"), "llms.txt: oude prijs €3.000 per maand staat er nog");
eis(llms.includes("per periode van 3 maanden"), "llms.txt: Connect-pakketten zonder periode van 3 maanden");
// 30 september 2026: llms.txt beloofde AI-crawlers nog een "gratis proof of concept" en een "discovery call"; die
// bestaan niet meer (gratis OS, demowebsite en basic rebranding; een gesprek via /contact).
eis(!/proof of concept|discovery call/i.test(llms), "llms.txt: oud aanbod (proof of concept, discovery call)");

// Meta per taal. 30 september 2026: de nieuwe title en description van /, /het-os en /prijzen hadden geen
// vertaling. scripts/localize-build.mjs valt dan terug op het Nederlands en meldt dat alleen in de buildlog;
// de Engelse site (socialnow.nl zonder prefix) en /de en /fr kregen Nederlandse deelkaartjes. Deze eis leest
// de teksten uit de bronnen zelf en vertaalt ze zoals localize-build dat doet (hele zin, anders per ' | ').
// Alleen deze drie routes: andere routes zijn van andere chats en horen hier niet rood te worden.
const woordenboek = Object.fromEntries(["en", "de", "fr"].map((t) => [t, JSON.parse(lees(`proposal/i18n/${t}.json`) || "{}")]));
const vertaal = (tekst, taal) => {
  const sleutel = tekst.replace(/\s+/g, " ").trim();
  // Alleen het eigen woordenboek: localize-build valt voor de en fr terug op het Engels, en een Engelse
  // omschrijving op /de of /fr is net zo fout als een Nederlandse.
  const gevonden = woordenboek[taal][sleutel];
  if (gevonden) return gevonden;
  if (tekst.includes(" | ")) return tekst.split(" | ").map((deel) => vertaal(deel, taal)).join(" | ");
  return tekst;
};
const postbuild = lees("scripts/postbuild.mjs");
const metaTeksten = [
  ...[...lees("index.html").matchAll(/<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content="([^"]+)"/g)].map((m) => m[1]),
  ...["'het-os'", "prijzen"].flatMap((route) => {
    const m = postbuild.match(new RegExp(`^\\s*${route}: \\{title: '([^']+)', description: '([^']+)'\\}`, "m"));
    eis(Boolean(m), `postbuild.mjs: routeMeta ${route} niet gevonden`);
    return m ? [m[1], m[2]] : [];
  }),
];
eis(metaTeksten.length === 7, `meta: 3 index-omschrijvingen en 4 routeteksten verwacht, ${metaTeksten.length} gevonden`);
for (const taal of ["en", "de", "fr"])
  for (const tekst of new Set(metaTeksten)) {
    const uit = vertaal(tekst, taal);
    const nl = uit.split(" | ").filter((deel) => deel !== "SocialNow" && tekst.split(" | ").includes(deel));
    eis(nl.length === 0, `${taal}: meta niet vertaald in ${taal}.json: '${nl[0]?.slice(0, 60)}…'`);
  }

if (fouten.length) {
  process.stderr.write(`ROOD: ${fouten.length} eis(en) niet gehaald\n  - ${fouten.join("\n  - ")}\n`);
  process.exit(1);
}
process.stdout.write("GROEN: alle eisen voor aanbod, logo, teamstrook, kleur en positionering gehaald\n");
