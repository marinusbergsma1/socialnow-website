#!/usr/bin/env node
// Proef: de gratis php2shell-check op /check (22 oktober 2026). Rood op main, groen op feat/php-check.
// De volledige meting tegen nagebootste servers staat in /Volumes/WORK/02-SOCIALNOW/php-check/testbank
// (npm run meet); deze proef bewaakt in de repo zelf de pagina, de vertaling, de SSRF-grens en de
// beslisregel "rood alleen met bewijs".
// Gebruik: node scripts/proef-php-check.mjs
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

// 1. Pagina, route en metadata
const tsx = lees("proposal/PhpCheck.tsx");
const css = lees("proposal/php-check.css");
const app = lees("proposal/WebsiteProposal.tsx");
const post = lees("scripts/postbuild.mjs");
// 22 oktober 2026, middag: de pagina heet /security; /check stuurt door (scripts/proef-security.mjs bewaakt de 308).
eis(/<Route path="\/security" element={<PhpCheckPage \/>} \/>/.test(app), "route /security bestaat (en /nl/security via de taalprefix)");
eis(/\n  security: \{title: /.test(post), "postbuild maakt dist/security/index.html met eigen titel en omschrijving, en zet hem in de sitemap");
eis(/"source": "\/php-check",\s*"destination": "\/security"/.test(lees("vercel.json")), "/php-check verwijst door naar /security");
const aanvragen = lees("proposal/aanvragen.ts");
eis(/export const BOEK_URL = /.test(aanvragen) && /\/contact\?onderwerp=/.test(aanvragen), "boekknop uit één configwaarde (BOEK_URL), anders het contactformulier");
const disclaimer = tsx.indexOf("Deze scan leest alleen openbare informatie van je website.");
eis(disclaimer > tsx.indexOf('className="pc-uitslag"') && disclaimer < tsx.indexOf("</div>\n          )}\n        </div>"), "disclaimer bij elke uitslag, niet alleen rood");
eis(!/Drie niveaus|Verdiepte scan|Wat ziet de scan wel en niet/.test(tsx), "minder uitleg: geen drie niveaus en geen technische FAQ meer");
eis(/w3techs\.com/.test(tsx) && /thenextweb\.com/.test(tsx), "cijfers over php2shell met bronnen in een voetnoot");
eis((tsx.match(/<details>/g) || []).length === 3, "korte FAQ: precies drie vragen in gewone taal");
// 22 oktober 2026, middag (Marinus): geen knoppenparen meer, wel Steef en Michelle (scripts/proef-check-php-boven.mjs).
eis((tsx.match(/<Mensen /g) || []).length === 3 && !/<Oproepen /.test(tsx) && /boekLink\(language, domein, "uitgebreide-check"\)/.test(tsx), "Steef en Michelle in het PHP-blok (oranje en rood), bij de uitslag en onderaan: call plannen en mailen, geen knoppenparen");
const kort = tsx.slice(tsx.indexOf("function Aanvraag"), tsx.indexOf("function Oproepen"));
eis(/\{!kort && \(/.test(kort) && (kort.slice(0, kort.indexOf("{!kort && (")).match(/<input name="(naam|email|domein)"/g) || []).length === 3 && /defaultValue=\{domein\}/.test(kort), "kort formulier: drie velden, domein al ingevuld");
eis(/id="aanvraag" ref=\{aanvraagRef\}/.test(tsx) && /hash !== "#aanvraag"/.test(tsx) && /scrollIntoView/.test(tsx), "anker #aanvraag: het formulier staat open en de pagina scrolt ernaartoe");
eis(/\{kort && telefoon && <label>Telefoon/.test(tsx) && /<Aanvraag kort telefoon soort="uitgebreide-check"/.test(tsx), "formulier uitgebreide check: naam, e-mail, website en optioneel telefoon");
eis(/get\("domein"\)/.test(tsx), "?domein= vult de website alvast in");
eis(/<Film \/>/.test(tsx) && tsx.indexOf("<Film />") < tsx.indexOf('<form className="pc-check"') && ["", "-nl"].flatMap((n) => [`check-16x9${n}.mp4`, `check-9x16${n}.mp4`, `poster-16x9${n}.jpg`, `poster-9x16${n}.jpg`]).every((b) => fs.existsSync(`public/websitecheck/film/${b}`)) && /language === "nl" \? "-nl" : ""/.test(tsx) && /max-width: 760px/.test(tsx), "uitlegfilm bovenaan, boven de check: klik om af te spelen, poster, NL-film op /nl en EN-film elders, ondertitels in beeld, 9:16 op mobiel");
const docs = [...tsx.matchAll(/bestand: "([a-z-]+)"/g)].map((m) => m[1]);
eis(docs.length === 4 && docs.every((b) => ["nl", "en"].every((t) => fs.existsSync(`public/websitecheck/${b}-${t}.pdf`) && fs.readFileSync(`public/websitecheck/${b}-${t}.pdf`).subarray(0, 5).toString() === "%PDF-")), "vier documenten in NL en EN, elk bestand bestaat en is een pdf (nooit een kapotte link)");
eis(/\.pc-documenten \{ background: #fff/.test(css), "documenten in een witte sectie");
eis(/DOCUMENTEN\.length > 0 &&/.test(tsx), "documentenblok verschijnt alleen als er bestanden zijn, nooit een lege link");
eis(/<h1[^>]*>Is je website veilig\?<\/h1>/.test(tsx), "kop \"Is je website veilig?\"");
eis(!/type="checkbox"/.test(tsx) && !/toestemming/i.test(tsx) && !/toestemming/.test(lees("api/php-check.js")), "geen vinkje: de publieke scan is één gewone GET");
const hero = tsx.slice(tsx.indexOf('<form className="pc-check"'), tsx.indexOf("</form>", tsx.indexOf('<form className="pc-check"')));
eis(!/pc-klein|Geen aanval|bewaren niets/.test(hero), "onder de knop alleen het veld en de knop, geen geruststellende regels");
eis(/const host = normaliseerInvoer\(domein\);\s*if \(!host\) \{ zetUitslag\(null\); return zetHint/.test(tsx), "invoer eerst normaliseren, pas daarna valideren; onzin krijgt een hint, geen fout");
const normBron = (tsx.match(/export function normaliseerInvoer\(invoer: string\) \{([\s\S]*?)\n\}/) || [])[1];
const norm = normBron ? new Function("invoer", normBron) : () => "";
eis(["link.nl", "www.link.nl", "https://link.nl/pagina", "LINK.NL ", "link.nl/"].every((x) => /^(www\.)?link\.nl$/.test(norm(x))) && ["link", "", "1.2.3.4", "geen punt"].every((x) => norm(x) === ""), "elke invoer werkt: link.nl, www.link.nl, https://link.nl/pagina, LINK.NL , link.nl/");
eis(/\[ander, "https"\], \[ander, "http"\]/.test(lees("server/php-check.mjs")), "server probeert https, http, met en zonder www");
eis(/catch \{[\s\S]{0,160}toon\(\{ ok: true, domein: host, uitslag: "onbekend"/.test(tsx) && /j\?\.ok && j\.uitslag \? j : \{ ok: true, domein: host, uitslag: "onbekend"/.test(tsx) && !/De check lukte niet/.test(tsx), "een check lukt altijd: faalt onze API of geeft hij geen JSON, dan een nette uitslag \"onbekend\"");
eis(/kop: t\("Je site schermt dit af\."\),/.test(tsx) && /<Aanvraag kort /.test(tsx), "onbekend heet \"Je site schermt dit af\", met Steef en Michelle en een kort formulier");
const zelf = tsx.lastIndexOf("Dit kun je zelf al doen."), faqKop = tsx.indexOf("Veelgestelde vragen.");
eis(zelf > tsx.indexOf("pc-uitslag-plek") && zelf < faqKop && (tsx.match(/^  "[^"]+",$/gm) || []).length === 7, "blok \"Dit kun je zelf al doen\" met zeven stappen, direct onder de uitslag");
eis(/<Stappen aantal=\{3\}/.test(tsx.slice(tsx.indexOf("export function PhpBlok"))) && !/kleur === "rood" \|\| kleur === "oranje"\) && \(/.test(tsx), "elke uitslag toont stap 1 tot en met 3 in het PHP-blok (sinds 22 oktober middag ook groen en afgeschermd)");
eis(/Kopieer de e-mail/.test(tsx) && /navigator\.clipboard\.writeText/.test(tsx) && /expose_php=Off/.test(tsx) && /php\.net\/ChangeLog-8/.test(tsx) && /ncsc\.gov\.uk/.test(tsx) && /NSA/.test(tsx), "voorbeeldmail om te kopiëren, opmerking over expose_php en bronnen php.net, NCSC en NSA");
eis(/Omdat dit ons allemaal raakt, voeren we de essentiële updates tijdelijk gratis uit\. Wil je dieper gaan, dan bespreken we de scope met je\./.test(tsx), "afsluiting: essentiële updates tijdelijk gratis, scope bij meer diepgang");
eis(/fetch\(AANVRAAG/.test(tsx) && /const AANVRAAG = "\/api\/check-aanvraag"/.test(tsx) && /website2/.test(tsx), "formulieren gaan naar api/check-aanvraag (mail naar security@), met honeypot");

// 2. Engels compleet, met de vaste zinnen letterlijk
const en = JSON.parse(lees("proposal/i18n/en.json") || "{}");
eis(en["Is je website veilig?"] === "Is your website safe?", "EN-kop is \"Is your website safe?\"");
eis(en["Wij doen de check en de updates gratis. Wil je dieper gaan, dan bespreken we de scope met je."] === "We do the check and the updates for free. If you want to go deeper, we'll discuss the scope with you.", "EN-zin over gratis check en scope klopt letterlijk");
eis(en["Je site schermt dit af."] === "Your site shields this." && en["Plan een call in of vul het formulier in, dan nemen we contact met je op."] === "Book a call or fill in the form and we'll get in touch." && en["Dit kun je zelf al doen."] === "What you can do right now." && en["Kopieer de e-mail"] === "Copy email", "EN-teksten voor afgeschermd, zelf doen en Copy email letterlijk");
eis(en["Deze scan leest alleen openbare informatie van je website. Het is een snelle indicatie, geen volledige beveiligingsaudit en geen garantie. Wil je zekerheid? Plan een gratis call met ons team."] === "This scan only reads public information from your website. It is a quick indication, not a full security audit or a guarantee. Want certainty? Book a free call with our team." && en["Plan een gratis call"] === "Book a free call", "EN-disclaimer en knop \"Book a free call\" letterlijk");
const zinnen = new Set();
const jsx = tsx.slice(tsx.indexOf('<div className="pc">'));
for (const m of jsx.matchAll(/>\s*([^<>{}]*[A-Za-zÀ-ž][^<>{}]*?)\s*</g)) zinnen.add(m[1].replace(/\s+/g, " ").trim());
for (const m of tsx.matchAll(/\b(?:placeholder|aria-label|title|alt)="([^"]+)"/g)) zinnen.add(m[1]);
for (const m of tsx.matchAll(/\bt\("([^"]+)"\)/g)) zinnen.add(m[1]);
for (const m of tsx.matchAll(/^  "([^"]+)",$/gm)) zinnen.add(m[1]);
for (const blok of tsx.matchAll(/const (?:FOUTEN|LABEL|oranje)[^=]*= \{([\s\S]*?)\};/g)) for (const m of blok[1].matchAll(/:\s*"([^"]+)"/g)) zinnen.add(m[1]);
for (const m of tsx.matchAll(/\? "([^"]{12,})"\s*\n?\s*: "([^"]{12,})"/g)) { zinnen.add(m[1]); zinnen.add(m[2]); }
const vaste = new Set(["Gratis php2shell-check", "PHP-versie", "expose_php=Off"]); // eigennamen en codes mogen gelijk blijven, maar staan er wel in
const zonder = [...zinnen].filter((z) => /[a-z]{3}/i.test(z) && !/^[\w.-]+@[\w.-]+$/.test(z) && !(z in en) && !vaste.has(z));
eis(zinnen.size > 60 && zonder.length === 0, `elke zin op de pagina heeft een Engelse vertaling (${zinnen.size} zinnen${zonder.length ? `, mist: ${zonder.slice(0, 4).join(" | ")}` : ""})`);
eis(!!en["Is je website veilig? Gratis php2shell-check | SocialNow"], "EN-titel voor de metadata");
const andere = ["de", "fr", "es", "it", "pt", "pl", "sv", "da"].flatMap((taal) => { const w = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}"); return [...zinnen].filter((z) => /[a-z]{3}/i.test(z) && z in en && !(z in w)).map((z) => `${taal}: ${z}`); });
eis(andere.length === 0, `ook vertaald in DE, FR, ES, IT, PT, PL, SV en DA${andere.length ? ` (mist ${andere.length}, bijv. ${andere.slice(0, 2).join(" | ")})` : ""}`);
eis(!/\{t\(stap\)\}/.test(tsx), "stappen niet dubbel vertaald (anders faalt de prerender)");

// Taal: eerder gekozen taal, dan browsertaal, dan land, anders Engels; keuze onthouden met try/catch.
const det = lees("proposal/i18n/detect.ts");
const detStart = det.indexOf("export async function detectVisitorLanguage");
eis(detStart > 0 && det.indexOf("const uitBrowser = saved ? null : browserTaal();", detStart) > detStart && det.indexOf("const uitBrowser", detStart) < det.indexOf("TRACE_URL", detStart)
  && /try \{ document\.cookie = /.test(det) && /rememberLanguage\(code\)/.test(lees("proposal/LanguageSwitch.tsx")) && /if \(\/\^\\\/\(nl\|de/.test(det),
  "taal: eerder gekozen taal wint, dan browsertaal, dan land, anders Engels; geen lus op /nl/check; taalkiezer onthoudt");

// 3. Stijl: zwart, geen ligaturen, gevulde knop #0b7a37 met wit, groen #25d366 alleen als accent
eis(/\.pc \{[^}]*background: #000/.test(css), "zwarte grond");
eis(/font-variant-ligatures: none/.test(css) && /"liga" 0/.test(css), "geen ligaturen");
eis(/--pc-vlak: #0b7a37/.test(css) && /\.pc-knop \{[^}]*background: var\(--pc-vlak\);[^}]*color: #fff/.test(css), "gevulde knop #0b7a37 met witte tekst");
eis(!/background(-color)?:\s*(#25d366|var\(--pc-groen\))[^;]*;[^}]*color:\s*#fff/i.test(css), "geen witte tekst op felgroen #25d366");
eis(/\.pc-kop \{[^}]*text-wrap: balance/.test(css) && /\.pc-sectiekop \{[^}]*font-size: clamp\(/.test(css), "koppen schalen mee en verdelen hun regels (twee regels gemeten in de PR)");

// 4. Serverfunctie: bestaat, en houdt zich aan de grenzen
const api = lees("api/php-check.js");
eis(/export default async function handler/.test(api) && /uitslag: "onbekend", phpVersie: null, code: "fout"/.test(api), "api/php-check.js geeft bij een eigen fout ook een uitslag");
eis(/binnenLimiet\(`ip:/.test(api), "limiet per IP");
eis(!/\b(kv|@vercel\/blob|posthog|database|writeFile)\b/i.test(api + lees("server/php-check.mjs")), "slaat niets op en trackt niets");

if (fs.existsSync("server/php-check.mjs")) {
  const m = await import(pathToFileURL(`${process.cwd()}/server/php-check.mjs`).href);
  const prive = ["127.0.0.1", "10.1.2.3", "172.16.0.1", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1"];
  eis(prive.every((ip) => !m.isPubliekAdres(ip)) && m.isPubliekAdres("93.184.216.34") && m.isPubliekAdres("2606:4700::1111"), "interne adressen en cloud-metadata worden geweigerd, publieke niet");
  eis(["127.0.0.1", "http://10.0.0.1/", "voorbeeld.nl:8080", "user:pw@voorbeeld.nl"].every((d) => !m.normaliseerDomein(d).ok), "IP-adressen, andere poorten en inloggegevens als invoer geweigerd");
  eis(m.normaliseerDomein("HTTPS://WWW.Voorbeeld.nl/pad?x=1").host === "www.voorbeeld.nl", "invoer met schema, hoofdletters en pad wordt een hostnaam");
  eis(m.vergelijkVersie("8.4.3", "8.4.27") < 0 && m.vergelijkVersie("8.10.0", "8.9.9") > 0, "versies als getallen vergeleken, niet als tekst");
  eis(m.vergelijkDpkg("8.1.2-1ubuntu2.27", "8.1.2-1ubuntu2.28") < 0 && m.vergelijkDpkg("7.4.3-4ubuntu2.29+esm4", "7.4.3-4ubuntu2.29+esm5") < 0 && m.vergelijkDpkg("8.4.27-1~deb13u1", "8.4.27-1") < 0, "Ubuntu- en Debian-builds in dpkg-volgorde");
  const oordeel = (xpb, server = "nginx") => m.beoordeel({ headers: { "x-powered-by": xpb, server }, body: "" }).uitslag;
  eis(["PHP/8.4.26", "PHP/8.3.35", "PHP/8.1.31", "PHP/7.4.30", "PHP/8.4.3"].every((v) => oordeel(v) === "oranje"), "gewoon nummer onder de fix is oranje, nooit rood (cPanel, CloudLinux, RHEL patchen met het oude nummer)");
  eis(oordeel("PHP/8.1.2-1ubuntu2.25", "Apache/2.4.52 (Ubuntu)") === "rood" && oordeel("PHP/8.1.2-1ubuntu2.28", "Apache/2.4.52 (Ubuntu)") === "groen", "Ubuntu-build: rood en groen met bewijs");
  eis(oordeel("PHP/8.5.12") === "groen" && oordeel("PHP/8.6.0") === "groen", "op of boven de fix is groen");
  eis(m.beoordeel({ headers: { server: "Vercel", "x-powered-by": "Next.js" }, body: "<code>X-Powered-By: PHP/7.4.3</code>" }).uitslag === "onbekend", "versie nooit uit paginatekst; geen PHP zichtbaar is onbekend, niet groen");
} else eis(false, "server/php-check.mjs bestaat");

if (fs.existsSync("server/check-aanvraag.mjs")) {
  const a = await import(pathToFileURL(`${process.cwd()}/server/check-aanvraag.mjs`).href);
  const verzonden = [];
  const nep = { sendMail: async (m) => { verzonden.push(m); } };
  const aanvraag = a.leesAanvraag({ naam: "Test Persoon", email: "Test@Voorbeeld.NL", domein: "voorbeeld.nl", uitslag: "onbekend", phpVersie: "", taal: "nl", vraag: "Kunnen jullie kijken?" });
  const uit = await a.verstuurAanvraag(aanvraag, { transport: nep });
  const m = verzonden[0] || {};
  eis(uit.verstuurd && m.to === "security@socialnow.nl" && m.replyTo === "test@voorbeeld.nl" && m.subject === "Check-aanvraag: voorbeeld.nl (afgeschermd)"
    && ["Naam: Test Persoon", "E-mail: test@voorbeeld.nl", "Domein: voorbeeld.nl", "Uitslag: afgeschermd", "PHP-versie: afgeschermd", "Taal: nl", "Tijdstip: ", "Kunnen jullie kijken?"].every((r) => String(m.text).includes(r)),
    "aanvraag wordt één mail naar security@socialnow.nl (alias van info@) met naam, e-mail, domein, uitslag, PHP-versie of \"afgeschermd\", taal, tijdstip, vraag en Reply-To bezoeker (nep-transport)");
  const logs = [];
  const kapot = { sendMail: async () => { throw new Error("SMTP weg"); } };
  const mis = await a.verstuurAanvraag(aanvraag, { transport: kapot, log: { error: (r) => logs.push(r) } });
  eis(!mis.verstuurd && logs.length === 1 && /CHECK_AANVRAAG_NIET_VERSTUURD/.test(logs[0]) && /voorbeeld\.nl/.test(logs[0]), "lukt versturen niet (twee pogingen), dan staat de hele aanvraag in de logs: niets verdwijnt stilletjes");
  eis(a.controleerAanvraag(a.leesAanvraag({ naam: "x", email: "x@y.nl", domein: "y.nl", website2: "bot" })) === "honing", "honeypot vangt bots");
  const apiA = lees("api/check-aanvraag.js");
  eis(/binnenLimiet\(`aanvraag-ip:/.test(apiA) && /CHECK_AANVRAAG_LIMIET/.test(apiA) && !/CHECK_SMTP_PASS\s*=|smtp\.hostinger\.com.*pass/i.test(apiA), "limiet per IP en per adres; SMTP-gegevens alleen uit env");
} else eis(false, "server/check-aanvraag.mjs bestaat");

console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
