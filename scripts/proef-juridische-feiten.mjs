// 26 oktober 2026: bij het narekenen van de verdienmodellen (plan.socialnow.nl) bleken vier feiten op socialnow.nl niet te kloppen.
// 1. /diensten zei "helft bij oplevering", de algemene voorwaarden (art. 7) zeggen "restant binnen 14 dagen na factuurdatum".
// 2. "SocialNow B.V." bestaat niet: de partij is de eenmanszaak M. Bergsma h.o.d.n. SocialNow, KvK 77146301.
// 3. "Bespaar 25%" stond er zonder te zeggen waartegenover.
// 4. Tristan heet Slobben, niet Slobbe.
// Proef op de bron en, als die er is, op de build in dist/. Rood per eis, groen als alles klopt.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const fouten = [];
const eis = (ok, melding) => { if (!ok) fouten.push(melding); };
const lees = (f) => readFileSync(f, "utf8");
const ZELF = "scripts/proef-juridische-feiten.mjs";
const TALEN = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const ENTITEIT = "M. Bergsma h.o.d.n. SocialNow";
const KVK = "77146301";

function bestanden(map, exts) {
  const uit = [];
  if (!existsSync(map)) return uit;
  for (const naam of readdirSync(map)) {
    if (naam.startsWith(".") || naam === "node_modules") continue;
    const pad = join(map, naam);
    if (statSync(pad).isDirectory()) uit.push(...bestanden(pad, exts));
    else if (exts.includes(extname(naam))) uit.push(pad);
  }
  return uit;
}

const TEKST = [".ts", ".tsx", ".mjs", ".js", ".json", ".txt", ".html", ".md"];
const bron = ["proposal", "components", "scripts", "worker", "api", "data", "server"]
  .flatMap((m) => bestanden(m, TEKST))
  .concat(bestanden("public", [".txt", ".json", ".html"]))
  .filter((f) => f !== ZELF);
const gebouwd = existsSync("dist") ? bestanden("dist", [".html", ".txt", ".json"]) : [];

// 2. Geen B.V. bij SocialNow
const bv = /SocialNow\s+B\.?V\b/;
for (const f of [...bron, ...gebouwd]) eis(!bv.test(lees(f)), `${f}: noemt "SocialNow B.V."`);
const schema = lees("scripts/brand-schema.mjs");
eis(schema.includes(`legalName: '${ENTITEIT}'`), `brand-schema: legalName is niet "${ENTITEIT}"`);
eis(schema.includes(KVK), "brand-schema: KvK 77146301 ontbreekt bij de juridische naam");
const connect = lees("public/connect/index.html");
eis(connect.includes(ENTITEIT) && connect.includes(KVK), `public/connect: voettekst mist "${ENTITEIT}" met KvK ${KVK}`);
const feiten = lees("public/socialnow-facts.json");
eis(feiten.includes(ENTITEIT) && feiten.includes(KVK), `socialnow-facts.json: mist "${ENTITEIT}" met KvK ${KVK}`);

// 4. Tristan Slobben
const slobbe = /Tristan[\s-]Slobbe(?!n)/i;
for (const f of [...bron, ...gebouwd]) eis(!slobbe.test(lees(f)), `${f}: noemt "Tristan Slobbe"`);
eis(lees("proposal/content.ts").includes('name: "Tristan Slobben"'), 'content.ts: "Tristan Slobben" ontbreekt in people');
eis(JSON.parse(lees("proposal/i18n/en.json"))["Tristan Slobben op LinkedIn"] === "Tristan Slobben on LinkedIn", "en.json: LinkedIn-label van Tristan Slobben ontbreekt");

// 1. Betaaltermijn gelijk aan de voorwaarden
const voorwaarden = lees("components/legal.ts");
eis(/aanbetaling van 50%[^"]*Het restant wordt betaald binnen 14 dagen na factuurdatum/.test(voorwaarden), "voorwaarden art. 7: tekst onverwacht gewijzigd");
const BETALING = "Helft vooraf bij akkoord, de rest bij oplevering, te betalen binnen 14 dagen na factuurdatum.";
const prijzen = lees("proposal/Pricing.tsx");
eis(prijzen.includes(`<p className="prijs-betaling">${BETALING}</p>`), "/diensten: betaaltekst noemt niet de 14 dagen na factuurdatum uit art. 7");
eis(!/helft bij oplevering\.?</.test(prijzen), '/diensten: losse "helft bij oplevering" staat er nog');
eis(/14 dagen na factuurdatum/.test(lees("public/llms.txt")), "llms.txt: betaaltekst wijkt af van art. 7");

// 3. Bespaar 25% met uitleg
const BESPAAR = /Bespaar 25% met een jaarabonnement ten opzichte van maandelijks betalen\./;
eis(BESPAAR.test(prijzen), '/diensten: "Bespaar 25%" zonder waartegenover');

// Alle talen
for (const t of TALEN) {
  const w = JSON.parse(lees(`proposal/i18n/${t}.json`));
  eis(Boolean(w[BETALING]) && /14/.test(w[BETALING]), `${t}.json: betaaltekst met 14 dagen niet vertaald`);
  const sleutel = Object.keys(w).find((k) => BESPAAR.test(k) && k.startsWith("Je software is gratis."));
  eis(Boolean(sleutel), `${t}.json: "Bespaar 25%"-tekst met uitleg niet vertaald`);
}

// Gebouwde pagina's (alleen als dist/ er is)
if (gebouwd.length) {
  const pagina = (p) => (existsSync(p) ? lees(p) : "");
  const dienstenEn = pagina("dist/diensten/index.html");
  eis(/14 days/.test(dienstenEn), "dist /diensten (en): betaaltekst zonder 14 dagen");
  eis(/Save 25%[^<]*month/.test(dienstenEn), "dist /diensten (en): Save 25% zonder waartegenover");
  const dienstenNl = pagina("dist/nl/diensten/index.html");
  eis(dienstenNl.includes("14 dagen na factuurdatum"), "dist /nl/diensten: betaaltekst zonder 14 dagen");
  eis(pagina("dist/team/index.html").includes("Tristan Slobben"), "dist /team: Tristan Slobben ontbreekt");
}

if (fouten.length) {
  console.error(`ROOD (${fouten.length})\n` + fouten.join("\n"));
  process.exit(1);
}
console.log(`GROEN: juridische partij, betaaltermijn, Bespaar 25% en Tristan Slobben kloppen (${bron.length} bronbestanden, ${gebouwd.length} gebouwd)`);
