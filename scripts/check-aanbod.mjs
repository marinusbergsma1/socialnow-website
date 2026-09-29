// check-aanbod: red/green-proef voor het aanbod en de hero van 29 september 2026.
//
// Marinus, 29 september 2026: "Voordat iets live komt moet het altijd RED/GREEN getest worden."
// Deze proef legt vast wat hij die avond vroeg, en is rood op main van vóór de wijziging en groen erna:
//   - het OS op maat zakelijk: "Vanaf €10.000 · prijs op aanvraag", geen reuzencijfer;
//   - maandpakketten minimaal drie maanden, met custom OS, complete rebranding, website en uitlegcall;
//   - maandprijzen blijven zichtbaar, het losse websiteblok (vanaf €3.500) is weg;
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
  const render = (route, language = "nl") =>
    renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { basename: "/voorstel", initialEntries: [`/voorstel${route}`] },
        React.createElement(Page, { language }),
      ),
    );
  const prijzen = render("/prijzen");
  const home = render("/");

  // Aanbod
  eis(prijzen.includes("Vanaf €10.000 · prijs op aanvraag"), "/prijzen: 'Vanaf €10.000 · prijs op aanvraag' ontbreekt");
  eis(!/<strong>€10\.000<\/strong>/.test(prijzen), "/prijzen: €10.000 staat nog als groot cijfer");
  eis(prijzen.includes("Maandpakketten · minimaal 3 maanden"), "/prijzen: 'minimaal 3 maanden' ontbreekt");
  for (const item of ["Custom OS", "Complete rebranding", "Je website", "Persoonlijke call met uitleg van je systeem"])
    eis(prijzen.includes(`<li>${item}</li>`), `/prijzen: inbegrepen '${item}' ontbreekt`);
  for (const bedrag of ["€4.000", "€5.000", "€5.500", "€6.000"])
    eis(prijzen.includes(bedrag), `/prijzen: maandprijs ${bedrag} ontbreekt`);
  eis(!prijzen.includes("vanaf €3.500"), "/prijzen: los websiteblok 'vanaf €3.500' staat er nog");
  eis(!prijzen.includes("Echt waar"), "/prijzen: 'Echt waar' staat er nog");

  // Bedragen in de notatie van de taal. 30 september 2026: de maandprijzen stonden in en/de/fr als "€4.000"
  // onder "From €10,000"; in het Engels leest €4.000 als vier euro. De vertaling loopt via het woordenboek
  // (hele tekstknoop "€4.000" is de sleutel). Frans met hetzelfde spatieteken als "10 000 €" in fr.json.
  const frSpatie = (JSON.parse(lees("proposal/i18n/fr.json") || "{}")["Vanaf €10.000 · prijs op aanvraag"] || "").match(/10(.)000/)?.[1] ?? " ";
  const notatie = {
    en: (d) => `€${d},000`, de: (d) => `${d}.000 €`, fr: (d) => `${d}${frSpatie}000 €`,
  };
  for (const [taal, maak] of Object.entries(notatie)) {
    const pagina = render("/prijzen", taal);
    for (const [bedrag, duizend] of [["€4.000", "4"], ["€5.000", "5"], ["€5.500", "5"], ["€6.000", "6"]]) {
      const verwacht = bedrag === "€5.500" ? maak("5").replace(/000/, "500") : maak(duizend);
      eis(pagina.includes(`<strong>${verwacht}</strong>`), `${taal} /prijzen: maandprijs ${bedrag} niet als '${verwacht}'`);
    }
    eis(!/<strong>€\d\.\d{3}<\/strong>/.test(pagina), `${taal} /prijzen: een maandprijs staat nog in Nederlandse notatie`);
    // Duits en Frans zetten het euroteken achter het getal, ook bij €0 op de drie gratis-tegels.
    if (taal !== "en") eis(!/€\s?\d/.test(pagina.replace(/<[^>]+>/g, " ")), `${taal} /prijzen: bedrag met € ervoor`);
  }

  // Wat de bezoeker in en/de/fr ziet, niet alleen of de sleutel in de json staat: een sleutel die net anders
  // gespeld is dan de JSX-zin bleef eerder groen terwijl de pagina Nederlands toonde. De verwachte tekst komt
  // uit het woordenboek zelf, zodat de proef geen tweede kopie van de vertalingen bijhoudt.
  const escape = (t) => t.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
  const nieuweZinnen = [
    "Vanaf €10.000 · prijs op aanvraag", "Maandpakketten · minimaal 3 maanden",
    "Elk pakket is een extra laag bovenop de gratis versie en loopt minimaal drie maanden.",
    "In elk pakket inbegrepen:", "Complete rebranding", "Persoonlijke call met uitleg van je systeem",
  ];
  for (const taal of ["en", "de", "fr"]) {
    const woorden = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
    const pagina = render("/prijzen", taal);
    for (const zin of nieuweZinnen) {
      const vertaald = woorden[zin];
      eis(Boolean(vertaald) && pagina.includes(escape(vertaald)), `${taal} /prijzen: '${zin}' niet vertaald op de pagina`);
      if (vertaald && vertaald !== zin) eis(!pagina.includes(escape(zin)), `${taal} /prijzen: Nederlands '${zin}' staat er nog`);
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
eis(llms.includes("minimaal 3 maanden"), "llms.txt: maandpakketten zonder minimale looptijd");

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
