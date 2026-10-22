#!/usr/bin/env node
// Proef: de gratis php2shell-check (22 oktober 2026). Rood op main, groen op feat/php-check.
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
eis(/<Route path="\/php-check" element={<PhpCheckPage \/>} \/>/.test(app), "route /php-check bestaat (en /nl/php-check via de taalprefix)");
eis(/'php-check': \{title: /.test(post), "postbuild maakt dist/php-check/index.html met eigen titel en omschrijving");
eis(/<h1[^>]*>Is je website veilig\?<\/h1>/.test(tsx), "kop \"Is je website veilig?\"");
eis(/type="checkbox"/.test(tsx) && /Dit is mijn website, of ik heb toestemming/.test(tsx), "vinkje: mijn site of toestemming");
eis(/We doen de check en de updates gratis\. Wil je dieper gaan, dan bespreken we de scope met je\./.test(tsx), "formulier voor de gratis handmatige check en updates");
eis(/conceptLink\(/.test(tsx) && !/fetch\([^)]*aanvraag/i.test(tsx), "aanvraag als ingevuld concept (aanvragen.ts), de site slaat niets op");

// 2. Engels compleet, met de vaste zinnen letterlijk
const en = JSON.parse(lees("proposal/i18n/en.json") || "{}");
eis(en["Is je website veilig?"] === "Is your website safe?", "EN-kop is \"Is your website safe?\"");
eis(en["We doen de check en de updates gratis. Wil je dieper gaan, dan bespreken we de scope met je."] === "We do the check and the updates for free. If you want to go deeper, we'll discuss the scope with you.", "EN-zin over gratis check en scope klopt letterlijk");
const zinnen = new Set();
const jsx = tsx.slice(tsx.indexOf('<div className="pc">'));
for (const m of jsx.matchAll(/>\s*([^<>{}]*[A-Za-zÀ-ž][^<>{}]*?)\s*</g)) zinnen.add(m[1].replace(/\s+/g, " ").trim());
for (const m of tsx.matchAll(/\b(?:placeholder|aria-label|title|alt)="([^"]+)"/g)) zinnen.add(m[1]);
for (const m of tsx.matchAll(/\bt\("([^"]+)"\)/g)) zinnen.add(m[1]);
for (const blok of tsx.matchAll(/const (?:FOUTEN|LABEL|oranje)[^=]*= \{([\s\S]*?)\n\s*\};/g)) for (const m of blok[1].matchAll(/:\s*"([^"]+)"/g)) zinnen.add(m[1]);
for (const m of tsx.matchAll(/\? "([^"]{12,})"\s*\n?\s*: "([^"]{12,})"/g)) { zinnen.add(m[1]); zinnen.add(m[2]); }
const vaste = new Set(["Gratis php2shell-check", "PHP-versie"]); // eigennamen en codes mogen gelijk blijven, maar staan er wel in
const zonder = [...zinnen].filter((z) => /[a-z]{3}/i.test(z) && !/^[\w.-]+@[\w.-]+$/.test(z) && !(z in en) && !vaste.has(z));
eis(zinnen.size > 60 && zonder.length === 0, `elke zin op de pagina heeft een Engelse vertaling (${zinnen.size} zinnen${zonder.length ? `, mist: ${zonder.slice(0, 4).join(" | ")}` : ""})`);
eis(!!en["Is je website veilig? Gratis php2shell-check | SocialNow"], "EN-titel voor de metadata");

// 3. Stijl: zwart, geen ligaturen, gevulde knop #0b7a37 met wit, groen #25d366 alleen als accent
eis(/\.pc \{[^}]*background: #000/.test(css), "zwarte grond");
eis(/font-variant-ligatures: none/.test(css) && /"liga" 0/.test(css), "geen ligaturen");
eis(/--pc-vlak: #0b7a37/.test(css) && /\.pc-knop \{[^}]*background: var\(--pc-vlak\);[^}]*color: #fff/.test(css), "gevulde knop #0b7a37 met witte tekst");
eis(!/background(-color)?:\s*(#25d366|var\(--pc-groen\))[^;]*;[^}]*color:\s*#fff/i.test(css), "geen witte tekst op felgroen #25d366");
eis(/\.pc-kop \{[^}]*text-wrap: balance/.test(css) && /\.pc-sectiekop \{[^}]*font-size: clamp\(/.test(css), "koppen schalen mee en verdelen hun regels (twee regels gemeten in de PR)");

// 4. Serverfunctie: bestaat, en houdt zich aan de grenzen
const api = lees("api/php-check.js");
eis(/export default async function handler/.test(api) && /toestemming/.test(api), "api/php-check.js vraagt het vinkje");
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

console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
