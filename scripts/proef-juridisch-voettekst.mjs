// 30 september 2026: proef voor twee vondsten van de gauntlet op de live site.
// A: op elke juridische pagina in nl, de en fr ging "Alle documenten" naar /nl/nl/juridisch (404),
//    en op de hub /juridisch ging "Lezen" naar /nl/nl/voorwaarden. De router heeft al een taalbasis
//    (index.tsx: BrowserRouter basename="/nl"), dus een <Link> met languagePrefix ervoor zet de taal
//    er twee keer in.
// B: de voettekst en de filmlink onder "See it in motion" waren in en, de en fr half Nederlands.
// De proef rendert de echte componenten in Node met dezelfde routerbasis als index.tsx en dezelfde
// vertaallaag (jsxImportSource @socialnow/i18n). Draaien: node scripts/proef-juridisch-voettekst.mjs
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

const server = await createServer({
  configFile: false,
  logLevel: "error",
  plugins: [react({ jsxImportSource: "@socialnow/i18n" })],
  resolve: { alias: { "@socialnow/i18n": `${process.cwd()}/proposal/i18n` } },
  ssr: { noExternal: ["react-router-dom", "react-router"], resolve: { conditions: ["module-sync", "node", "development"] } },
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true },
  appType: "custom",
});

const uitkomst = new Map();
function eis(naam, goed, detail) {
  if (!uitkomst.has(naam)) uitkomst.set(naam, { goed: 0, fout: [] });
  const r = uitkomst.get(naam);
  if (goed) r.goed++; else r.fout.push(detail);
}

try {
  const { MemoryRouter } = await server.ssrLoadModule("react-router-dom");
  const { LanguageProvider, languagePrefix, LANGUAGES } = await server.ssrLoadModule("/proposal/i18n/context.ts");
  const { DOCUMENTEN } = await server.ssrLoadModule("/components/legal-index.ts");
  const { default: DocumentPage } = await server.ssrLoadModule("/components/DocumentPage.tsx");
  const { default: JuridischPage } = await server.ssrLoadModule("/components/JuridischPage.tsx");
  const { default: BrandFooter } = await server.ssrLoadModule("/proposal/BrandFooter.tsx");
  const { default: ShowcaseFilms } = await server.ssrLoadModule("/proposal/ShowcaseFilms.tsx");

  // Zoals index.tsx: Engels zonder basis, de andere talen onder /nl, /de, /fr.
  const render = (taal, pad, element) => {
    const basis = languagePrefix(taal) || "/";
    return renderToStaticMarkup(
      React.createElement(MemoryRouter, { basename: basis, initialEntries: [`${languagePrefix(taal)}${pad}`] },
        React.createElement(LanguageProvider, { language: taal }, element)),
    );
  };
  const links = (html) => [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map(([, href, binnen]) => ({ href, tekst: binnen.replace(/<[^>]+>/g, "").trim() }));
  const zichtbareTekst = (html) => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
  const dubbel = /^\/(nl|de|fr)\/\1(\/|$)/;

  const alleDocumenten = { nl: "Alle documenten", en: "All documents", de: "Alle Dokumente", fr: "Tous les documents" };
  for (const taal of LANGUAGES) {
    const p = languagePrefix(taal);
    // A1: "Alle documenten" op elk van de zeven juridische documenten.
    for (const d of DOCUMENTEN) {
      const html = render(taal, d.path, React.createElement(DocumentPage, { slug: d.slug }));
      const link = links(html).find((l) => l.tekst === alleDocumenten[taal]);
      eis('A1 "Alle documenten" gaat naar /juridisch met één taalprefix', link?.href === `${p}/juridisch`,
        `${taal} ${d.path}: href ${link ? link.href : "(geen link gevonden)"}, verwacht ${p}/juridisch`);
      for (const l of links(html)) eis("A3 geen enkele link op de pagina met dubbele taalprefix", !dubbel.test(l.href), `${taal} ${d.path}: ${l.href}`);
    }
    // A2: de "Lezen"-knoppen op de hub /juridisch.
    const hub = render(taal, "/juridisch", React.createElement(JuridischPage));
    const hrefs = links(hub).map((l) => l.href);
    // Elke link naar het document telt, ook die van de keurmerken; ze moeten allemaal kloppen.
    for (const d of DOCUMENTEN) {
      const naarDoc = hrefs.filter((h) => h.endsWith(d.path));
      eis("A2 hub /juridisch linkt elk document met één taalprefix", naarDoc.length > 0 && naarDoc.every((h) => h === `${p}${d.path}`),
        `${taal} /juridisch: links naar ${d.path} zijn ${naarDoc.join(", ") || "(geen)"}, verwacht ${p}${d.path}`);
    }
    for (const h of hrefs) eis("A3 geen enkele link op de pagina met dubbele taalprefix", !dubbel.test(h), `${taal} /juridisch: ${h}`);
  }

  // B: voettekst en filmlink zonder Nederlands in en, de en fr.
  const nederlands = ["verwerkersovereenkomst", "staan met alle andere documenten op", "juridisch en compliance", "Juridisch", "Veiligheid en databescherming", "Veiligheid"];
  const verwacht = {
    en: ["data processing agreement", "are listed with all other documents under", "legal and compliance", "Legal", "Security and data protection"],
    de: ["Auftragsverarbeitungsvertrag", "finden Sie mit allen anderen Dokumenten unter", "Rechtliches und Compliance", "Rechtliches", "Sicherheit und Datenschutz"],
    fr: ["accord de traitement des données", "figurent avec tous les autres documents sur la page", "juridique et conformité", "Juridique", "Sécurité et protection des données"],
  };
  for (const taal of ["en", "de", "fr"]) {
    const tekst = zichtbareTekst(render(taal, "/", React.createElement(React.Fragment, null,
      React.createElement(ShowcaseFilms), React.createElement(BrandFooter))));
    for (const woord of nederlands) {
      const gevonden = new RegExp(`(^|[^\\p{L}])${woord}([^\\p{L}]|$)`, "u").test(tekst);
      eis("B1 geen Nederlandse woorden in voettekst en filmlink", !gevonden, `${taal}: "${woord}" staat er nog`);
    }
    for (const zin of verwacht[taal]) eis("B2 vertaling staat in voettekst en filmlink", tekst.includes(zin), `${taal}: "${zin}" ontbreekt`);
  }
  // Het Nederlands zelf blijft ongemoeid.
  const nlTekst = zichtbareTekst(render("nl", "/", React.createElement(React.Fragment, null,
    React.createElement(ShowcaseFilms), React.createElement(BrandFooter))));
  for (const zin of ["verwerkersovereenkomst", "staan met alle andere documenten op", "juridisch en compliance", "Juridisch", "Veiligheid en databescherming"])
    eis("B3 Nederlandse voettekst ongewijzigd", nlTekst.includes(zin), `nl: "${zin}" ontbreekt`);
} finally {
  await server.close();
}

let fouten = 0;
for (const [naam, { goed, fout }] of [...uitkomst].sort(([a], [b]) => a.localeCompare(b))) {
  fouten += fout.length;
  console.log(`${fout.length ? "ROOD " : "GROEN"}  ${naam}: ${goed} goed, ${fout.length} fout`);
  for (const f of fout) console.log(`         ${f}`);
}
console.log(fouten ? `\nROOD: ${fouten} fouten` : "\nGROEN: alle eisen gehaald");
process.exit(fouten ? 1 : 0);
