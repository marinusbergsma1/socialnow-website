#!/usr/bin/env node
// Proef: drie kernonderdelen in Connect (Marinus, 6 nov 2026): "Belangrijkste onderdelen zijn Cybersecurity - ERP & CRM en Growth",
// "3 takken naast elkaar". ERP & CRM met Steef, Douwe, Gijsbert en Indexworld als bedrijf, daaronder Lead Flow optimisation met
// Yvo Overhoff en Maurits Poppelaars (Signal Flow). Growth met subkoppen, sales en partnerships apart.
// Gebruik: node scripts/check-connect-takken.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const content = fs.readFileSync("proposal/content.ts", "utf8");
const tsx = fs.readFileSync("proposal/ConnectExperts.tsx", "utf8");
const css = fs.readFileSync("proposal/connect-experts.css", "utf8");
const trust = fs.readFileSync("proposal/TeamTrust.tsx", "utf8");
const postbuild = fs.readFileSync("scripts/postbuild.mjs", "utf8");

eis(/name: "Yvo Overhoff", role: "Lead Flow Engineer · Signal Flow", image: "Yvo-Overhoff\.webp"/.test(content), "Yvo in het team als Lead Flow Engineer");
eis(/name: "Maurits Poppelaars", role: "Lead Flow Analyst · Signal Flow", image: "Maurits-Poppelaars\.webp"/.test(content), "Maurits in het team als Lead Flow Analyst");
for (const n of ["Yvo-Overhoff", "Maurits-Poppelaars"]) {
  eis(fs.existsSync(`public/images/${n}.webp`) && [96, 160, 320, 480].every(s => fs.existsSync(`public/images/klein/${n}-${s}.webp`)), `foto van ${n} in alle maten`);
}
eis(/\{ name: "Lead Flow optimisation", members: \["Yvo Overhoff", "Maurits Poppelaars"\] \}/.test(content), "groep Lead Flow optimisation met Yvo en Maurits");
const sales = content.match(/\{ name: "Sales", members: \[([^\]]*)\]/), partners = content.match(/\{ name: "Partnerships", members: \[([^\]]*)\]/);
eis(!!sales && !!partners && !/Aron|Ruben/.test(partners[1]) && /Aron/.test(sales[1]), "sales en partnerships apart");

const takken = tsx.match(/const TAKKEN[\s\S]*?\n\];/)?.[0] ?? "";
const plek = (t) => takken.indexOf(`naam: "${t}"`);
eis(plek("Cybersecurity") >= 0 && plek("Cybersecurity") < plek("ERP & CRM") && plek("ERP & CRM") < plek("Growth"), "drie takken: Cybersecurity, ERP & CRM, Growth");
eis(/naam: "Cybersecurity", delen: \[\{ leden: \["Douwe Kramer", "Gijsbert Westeneng"\]/.test(takken), "Cybersecurity: Douwe en Gijsbert");
eis(/leden: \["Steef Komen", "Douwe Kramer", "Gijsbert Westeneng"\], bedrijven: \[\{ naam: "Indexworld"/.test(takken), "ERP & CRM: Steef, Douwe, Gijsbert en Indexworld");
eis(/kop: "Lead Flow optimisation"/.test(takken) && takken.indexOf("Lead Flow optimisation") > plek("ERP & CRM") && takken.indexOf("Lead Flow optimisation") < plek("Growth"), "Lead Flow optimisation als subtak onder ERP & CRM");
eis(/const GROWTH = \["Ads & search", "Video, photo & design", "UGC & social media", "Sales", "Partnerships"\]/.test(tsx), "Growth met subkoppen per vak, sales en partnerships apart");
eis(tsx.indexOf(">Eindverantwoordelijk<") < tsx.indexOf(">Kernonderdelen<") && tsx.indexOf(">Kernonderdelen<") < tsx.indexOf(">Vakgebieden<"), "lagen: Eindverantwoordelijk, Kernonderdelen, Vakgebieden");
eis(/\.cx-takken \{[^}]*grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1fr\) minmax\(0, 2fr\)/.test(css), "drie takken naast elkaar, Growth het breedst");
eis(/functie: "Lead Flow optimisation", mensen: \["Yvo Overhoff", "Maurits Poppelaars"\]/.test(trust) && /functie: "Sales"/.test(trust), "teampagina: Lead Flow optimisation en Sales als functie");
eis(postbuild.includes("person('Yvo Overhoff', 'Lead Flow Engineer')") && postbuild.includes("person('Maurits Poppelaars', 'Lead Flow Analyst')"), "Yvo en Maurits in de gestructureerde teamgegevens");
for (const l of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${l}.json`, "utf8"));
  eis(!!w["Kernonderdelen"], `laagnaam Kernonderdelen vertaald (${l})`);
}

if (process.argv.includes("--dist")) {
  const html = fs.readFileSync("dist/nl/producten/index.html", "utf8");
  const s = html.indexOf('class="cx-takken"'), blok = s < 0 ? "" : html.slice(s, html.indexOf("Vakgebieden", s));
  for (const t of ["Cybersecurity", "ERP &amp; CRM", "Growth", "Lead Flow optimisation", "Sales", "Partnerships"]) eis(blok.includes(t), `gebouwde pagina toont ${t}`);
  eis(blok.includes("Yvo Overhoff") && blok.includes("Maurits Poppelaars") && blok.includes("Indexworld"), "gebouwde pagina toont Yvo, Maurits en Indexworld");
  const fotos = [...blok.matchAll(/<img[^>]*?\ssrc="([^"?]+)/g)].map(m => m[1]);
  const kwijt = fotos.filter(f => !fs.existsSync(`dist${f}`));
  eis(fotos.length >= 20 && !kwijt.length, `elke foto in de takken bestaat (${fotos.length}${kwijt.length ? ", kwijt: " + kwijt.slice(0, 3).join(" ") : ""})`);
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
