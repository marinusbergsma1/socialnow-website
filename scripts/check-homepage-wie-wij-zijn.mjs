#!/usr/bin/env node
// Proef: homepage vertelt wie wij zijn. Marinus, 4 november 2026 (avond): "De landingspagina is wie wij zijn niet dit en hier moet
// de connect weer komen met daarna mooi de websites, daarna de mooie sliders en mobiele slider etc daarna mag wel die deze en nog
// beter gemaakt" en over de hero-knoppen: "2e knop hier graag blauw maken ook en eerste knop mag zijn website actie".
// Gebruik: node scripts/check-homepage-wie-wij-zijn.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const pages = fs.readFileSync("proposal/pages.tsx", "utf8");
const home = pages.slice(pages.indexOf("export function Home()"), pages.indexOf("export function ProductenPagina"));
const volgorde = ["<HomeEnthousiast", "<HomeConnectBand", "<ConnectExperts", "<FreeWebsite", "<ImageSliders", "<VideoSlider", "<WebsiteCTA"];
const plek = volgorde.map((v) => home.indexOf(v));
eis(plek.every((p) => p >= 0) && plek.every((p, i) => i === 0 || p > plek[i - 1]), `volgorde: ${volgorde.join(" → ").replace(/</g, "")}`);
const he = fs.readFileSync("proposal/HomeEnthousiast.tsx", "utf8");
eis(!he.includes("sn-deuren") && !he.includes("Waar wil je beginnen"), "geen 'Waar wil je beginnen?'-deuren meer");
eis(!/<WebsiteCTA\s*\/>/.test(he.slice(he.indexOf("export default function"))), "geen website-actieband direct onder de hero");
const acties = he.slice(he.indexOf("sn-alg-acties"), he.indexOf("<PartnerLogos"));
eis(/<span>Website-actie<\/span>/.test(acties), "eerste hero-knop heet Website-actie");
eis(/className="sn-pill sn-pill-blauw"[^>]*href="#contact"/.test(acties), "tweede hero-knop (Neem contact op) is blauw");
const css = fs.readFileSync("proposal/home-enthousiast.css", "utf8");
eis(/\.sn-pill-blauw[^{]*\{[^}]*#00a3e0/.test(css), "blauwe knop in Connect-blauw #00a3e0");
eis(/\.sn-cta-web[^{]*\{[^}]*(gradient|00a3e0)/.test(css) && he.includes("sn-cta-web-beeld"), "website-actieband onderaan is verfraaid (beeld en kleurverloop)");
// "Deze mobiele vind ik niks [...] misschien is 2 wel vet en focus meer op Gratis veiligheidupdates en websitedemo".
const cta = he.slice(he.indexOf("export function WebsiteCTA"), he.indexOf("export default")).replace(/\/\/.*$/gm, "");
eis((cta.match(/<img /g) || []).length === 2 && !/mobiel/.test(cta) && !/kwh/i.test(cta), "website-actieband: twee websitetegels, geen mobiel, geen kWh");
eis(cta.includes("Gratis veiligheidsupdates en websitedemo"), "website-actieband: kop over gratis veiligheidsupdates en websitedemo");
// "Doe toch maar gewoon die foto met zoom zoals die was en video alleen als je op afspelen klikt" en "Zoom mag iets sneller".
const hcss = fs.readFileSync("proposal/header-algemeen.css", "utf8");
const grow = hcss.match(/animation:sn-alg-grow (\d+)s/);
eis(he.includes("<AtomiumFoto />") && !he.includes("<OdooFilm"), "hero: de Atomium-foto, geen automatisch spelende film");
eis(!!grow && +grow[1] <= 16, `zoom iets sneller: hoogstens 16 s (nu ${grow ? grow[1] : "?"} s)`);
// Website-actie: "hier de liggende video [...] een kleine logobar met de logo's van de getroffen bedrijven met daarboven zelfs deze
// bedrijven zijn getroffen Binance er ook bij. Vraag een veiligheidsrapport aan of krijg een gratis demo van een moderne website op maat."
const gw = fs.readFileSync("proposal/GratisWebsite.tsx", "utf8");
// Daarna (5 nov): "Video misschien zelfs ook wel weg. Why an ai website is more safe and secure? Oid en dan naar een blog".
const posts = JSON.parse(fs.readFileSync("data/posts.json", "utf8"));
const blog = posts.find((p) => p.slug === "waarom-een-ai-website-veiliger-is");
eis(!/<video/.test(gw) && gw.includes('to="/blog/waarom-een-ai-website-veiliger-is"') && !!blog && blog.title === "Waarom een AI-website veiliger is", "website-actie: geen video maar een tegel naar het blog Waarom een AI-website veiliger is");
eis(!!blog && !/\bClaude\b|GPT|Gemini/.test(blog.body) && /Verizon/.test(blog.body) && /developer/.test(blog.body), "blog: feiten met bron, developer controleert, geen modelnamen");
// Daarna (5 nov): "de wordpress en binance en wikipedia logo's mogen weg. Hou het positief". Geen getroffen bedrijven meer.
eis(!gw.includes("gw2-getroffen") && !/binance|wikipedia|nintendo|wordpress/i.test(gw.replace(/\/\/.*$|\{\/\*[^]*?\*\/\}/gm, "")), "website-actie: positief, geen logo's van getroffen bedrijven");
// "Op Mobiel is het logo niet mooi uitgelicht met het menu": het logo staat verticaal in het midden van de balk.
eis(/\.h-header \.h-brand\{display:flex!important;align-items:center\}/.test(fs.readFileSync("proposal/hoofdmenu.css", "utf8")), "menubalk: logo verticaal in het midden");
eis(gw.includes("Vraag een veiligheidsrapport aan of krijg een gratis demo van een moderne website op maat.") && gw.includes('to="/security"'), "website-actie: veiligheidsrapport of gratis demo, met knop naar het rapport");
if (process.argv.includes("--dist")) {
  const nl = fs.readFileSync("dist/nl/index.html", "utf8");
  const i = (t) => nl.indexOf(t);
  eis(i('class="cx-team"') > 0 && i('class="cx-team"') < i('class="sn-cta-web'), "gebouwde homepage: Connect staat vóór de website-actieband");
  eis(!nl.includes("Waar wil je beginnen"), "gebouwde homepage zonder 'Waar wil je beginnen?'");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
