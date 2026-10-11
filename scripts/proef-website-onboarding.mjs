// Proef website-onboarding (11 oktober 2026, Marinus): op socialnow.nl een duidelijke link naar de nieuwe
// website-onboarding https://website.socialnow.nl, "Gratis website builder via Odoo of een gratis demo via SocialNow →
// Start je website-onboarding", in alle 10 talen. Plek: het gratis aanbod (ProductOffer) in de hero, onder "Bouw samen
// met ons team" en boven de Feedback-groepen; ProductOffer staat ook in de bento "Begin met je website".
// Leest de bouw in dist/, dus eerst npm run build. Rood op main b8e3b9d, groen op fix/partnertegels-mobiel-20261011.
// 11 oktober 2026: de hero-link wijst naar #free-website (FreeWebsite.tsx), de knop daar naar website.socialnow.nl.
import { existsSync, readFileSync } from "node:fs";

if (!existsSync("dist/nl/index.html")) {
  console.error("Geen dist/nl/index.html: draai eerst npm run build.");
  process.exit(1);
}

const URL_ONBOARDING = "https://website.socialnow.nl";
const UITLEG = "Gratis website builder via Odoo of een gratis demo via SocialNow";
const KNOP = "Start je website-onboarding";
const TALEN = ["nl", "en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const woordenboek = Object.fromEntries(TALEN.filter((t) => t !== "nl").map((t) => [t, JSON.parse(readFileSync(`proposal/i18n/${t}.json`, "utf8"))]));
const vertaal = (taal, zin) => (taal === "nl" ? zin : woordenboek[taal][zin]);
const ontsnap = { amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " ", rsquo: "’" };
const ontsmet = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, n) => ontsnap[n] ?? m);
const pad = (taal) => `dist${taal === "en" ? "" : `/${taal}`}/index.html`;
const tekst = (html) => ontsmet(html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/g, " ").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");

const eisen = [];
for (const taal of TALEN) {
  const uitleg = vertaal(taal, UITLEG);
  const knop = vertaal(taal, KNOP);
  if (taal !== "nl") eisen.push([`${taal}: uitleg en knop vertaald in het woordenboek`, Boolean(uitleg && knop) && uitleg !== UITLEG && knop !== KNOP && /odoo/i.test(uitleg) && /socialnow/i.test(uitleg)]);
  const html = (readFileSync(pad(taal), "utf8").split('<div id="root"')[1] || "");
  // De link zelf. Sinds 11 oktober 2026 ("FREE WEBSITE, groen vlak") wijst de link in de hero naar de sectie
  // #free-website op de homepage; daar staat de knop naar website.socialnow.nl (zie scripts/proef-free-website.mjs).
  const links = [...html.matchAll(/<a\b[^>]*href="[^"]*#free-website"[^>]*>([\s\S]*?)<\/a>/g)];
  const goed = links.filter((m) => { const t = tekst(m[1]); return uitleg && knop && t.includes(uitleg) && t.includes(knop); });
  eisen.push([`${taal}: homepage linkt met "${knop}" naar #free-website (${links.length} links)`, goed.length >= 1]);
  const plek = goed.length ? html.indexOf(goed[0][0]) : -1;
  const tegels = html.indexOf("h-team-kern");
  eisen.push([`${taal}: de link staat in de hero, boven de partnertegels`, plek > -1 && tegels > -1 && plek < tegels]);
  const sectie = html.indexOf('id="free-website"');
  const knopOnboarding = sectie > -1 ? html.slice(sectie).match(/<a\b[^>]*href="https:\/\/website\.socialnow\.nl\/?"[^>]*>/) : null;
  eisen.push([`${taal}: in #free-website opent de knop ${URL_ONBOARDING} in een nieuw tabblad met noopener`, Boolean(knopOnboarding) && /target="_blank"/.test(knopOnboarding[0]) && /noopener/.test(knopOnboarding[0])]);
}
const nieuw = TALEN.flatMap((t) => [vertaal(t, UITLEG), vertaal(t, KNOP)]).filter(Boolean).join(" ");
eisen.push(["geen modelnamen in de nieuwe teksten", !/claude|anthropic|openai|chatgpt|\bgpt\b|gemini/i.test(nieuw)]);

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} van ${eisen.length} rood` : `alles groen (${eisen.length} eisen)`);
process.exit(fout ? 1 : 0);
