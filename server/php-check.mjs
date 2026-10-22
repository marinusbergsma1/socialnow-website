// De gratis php2shell-check (CVE-2026-109618 en CVE-2026-109619, bekend sinds 21 oktober 2026).
//
// 22 oktober 2026 (Marinus): advertentie "Take the free check at socialnow.nl". De bezoeker vult
// zijn domein in, wij doen één gewone GET op de homepage en lezen wat de server zelf laat zien:
//
//   - alleen passief: geen exploit, geen poortscan, geen gokpaden, geen POST, geen foutprovocatie;
//   - één GET per hop, redirects volgen tot vijf keer, alles samen 8 s, body tot 200 KB;
//   - alleen publieke adressen op poort 80 en 443: elke hop wordt opnieuw opgezocht en gecontroleerd,
//     en we verbinden met precies het adres dat we controleerden (geen DNS-rebinding naar binnen);
//   - niets opslaan: het antwoord gaat terug naar de bezoeker en verdwijnt.
//
// Uitslagen (contract: /Volumes/WORK/02-SOCIALNOW/php-check/testbank, beslistabel: ONDERZOEK.md 5.2):
//   groen     de versie die de server meldt bevat de fix, of er draait aantoonbaar geen PHP
//   rood      alleen met bewijs: een build of nummer waarvan vaststaat dat het de fix mist
//   oranje    PHP gezien, maar of de fix erin zit is van buitenaf niet zeker
//   onbekend  we konden niets bruikbaars lezen
// De ergste fout is een gepatchte server rood noemen. Twijfel is dus nooit rood. En groen is nooit
// "veilig": alleen dat de getoonde versie de fix bevat.

import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { BIJGEWERKT, DEBIAN_TAKKEN, HERSTELD, UBUNTU } from "./php-check-tabellen.mjs";

export const VERSIE_CHECK = `php-check/2 (${BIJGEWERKT})`;
export const USER_AGENT = "Mozilla/5.0 (compatible; SocialNow-php-check/2.0; +https://socialnow.nl/php-check)";
export const MAX_REDIRECTS = 5;
export const TIMEOUT_MS = 8000;
const MAX_BODY = 200 * 1024;

// ---------------------------------------------------------------------------------------------
// Invoer
// ---------------------------------------------------------------------------------------------

// "Example.com", "HTTPS://www.Example.com/pad?x" en "example.com:443" worden een hostnaam.
// Geen IP-adressen, geen andere poorten, geen gebruikersnamen.
export function normaliseerDomein(invoer) {
  let s = String(invoer ?? "").replace(/[\u200B-\u200D\u2060\uFEFF]/g, "").trim().toLowerCase();
  if (!s || s.length > 300) return { ok: false, reden: "leeg" };
  if (!/^[a-z][a-z0-9+.-]*:\/\//.test(s)) s = `https://${s}`;
  let url;
  try { url = new URL(s); } catch { return { ok: false, reden: "ongeldig" }; }
  if (!["http:", "https:"].includes(url.protocol)) return { ok: false, reden: "ongeldig" };
  if (url.username || url.password) return { ok: false, reden: "ongeldig" };
  if (url.port && !["80", "443"].includes(url.port)) return { ok: false, reden: "poort" };
  const host = url.hostname.replace(/\.$/, "");
  if (net.isIP(host.replace(/^\[|\]$/g, ""))) return { ok: false, reden: "ip" };
  if (!/^(?=.{1,253}$)([a-z0-9_](?:[a-z0-9_-]{0,61}[a-z0-9])?\.)+[a-z0-9-]{2,63}$/.test(host)) return { ok: false, reden: "ongeldig" };
  return { ok: true, host };
}

// ---------------------------------------------------------------------------------------------
// Alleen publieke adressen
// ---------------------------------------------------------------------------------------------

function ipv4Getal(ip) { return ip.split(".").reduce((n, d) => n * 256 + Number(d), 0); }
const V4_PRIVE = [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16],
  ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.88.99.0", 24], ["192.168.0.0", 16],
  ["198.18.0.0", 15], ["198.51.100.0", 24], ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
].map(([basis, bits]) => [ipv4Getal(basis), bits]);

export function isPubliekAdres(ip) {
  const soort = net.isIP(ip);
  if (soort === 4) {
    const n = ipv4Getal(ip);
    return !V4_PRIVE.some(([basis, bits]) => Math.floor(n / 2 ** (32 - bits)) === Math.floor(basis / 2 ** (32 - bits)));
  }
  if (soort === 6) {
    const v = ip.toLowerCase();
    const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPubliekAdres(mapped[1]);
    if (/^(fc|fd|fe[89ab]|ff)/.test(v)) return false; // unique local, link-local, multicast
    if (/^2001:db8:/.test(v) || /^2001:0{0,4}:/.test(v) || /^2002:/.test(v) || /^64:ff9b:/.test(v)) return false;
    return /^[23][0-9a-f]{0,3}:/.test(v); // alleen globaal unicast
  }
  return false;
}

// Namen die nooit op internet bestaan: die zoeken we niet eens op.
const GERESERVEERD = /(^|\.)(localhost|local|internal|intranet|lan|home|corp|test|invalid|example|onion|arpa)$/;

// Alleen in de testbank op deze Mac mag een nagebootste server op 127.0.0.1 draaien. Op Vercel
// (VERCEL is daar altijd gezet) en in productie staat dit altijd uit.
export function testbankModus() {
  return (process.env.PHP_CHECK_TESTBANK === "1" || process.env.PHPCHECK_TESTBANK === "1") && !process.env.VERCEL && process.env.NODE_ENV !== "production";
}

async function zoekAdres(host) {
  if (testbankModus() && host.endsWith(".testbank.localhost")) return { ok: true, adres: "127.0.0.1", familie: 4 };
  if (GERESERVEERD.test(host)) return { ok: false, reden: "dns" };
  let adressen;
  try { adressen = await dns.lookup(host, { all: true, verbatim: true }); } catch { return { ok: false, reden: "dns" }; }
  if (!adressen.length) return { ok: false, reden: "dns" };
  // Eén intern adres tussen de publieke is genoeg om te weigeren.
  if (adressen.some((a) => !isPubliekAdres(a.address))) return { ok: false, reden: "intern" };
  // IPv4 eerst: niet elke serverfunctie kan via IPv6 naar buiten.
  const keuze = adressen.find((a) => a.family === 4) || adressen[0];
  return { ok: true, adres: keuze.address, familie: keuze.family };
}

// ---------------------------------------------------------------------------------------------
// Eén GET, redirects volgen
// ---------------------------------------------------------------------------------------------

function eenVerzoek(url, adres, familie, restMs) {
  return new Promise((resolve) => {
    let klaar = false;
    let opTijd = null; // na de headers: bij de klok toch beoordelen met wat er al binnen is
    const einde = (w) => { if (!klaar) { klaar = true; clearTimeout(wekker); resolve(w); } };
    const mod = url.protocol === "https:" ? https : http;
    let req;
    try {
      req = mod.request({
        method: "GET",
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        servername: net.isIP(url.hostname) ? undefined : url.hostname,
        headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml,*/*;q=0.5", "Accept-Encoding": "identity", Connection: "close" },
        // Verbind met het adres dat we net gecontroleerd hebben, niet met een nieuwe DNS-uitkomst.
        lookup: (_h, opts, cb) => (opts && opts.all ? cb(null, [{ address: adres, family: familie }]) : cb(null, adres, familie)),
        // We lezen alleen een versie; een verlopen of eigen certificaat mag de check niet blokkeren.
        rejectUnauthorized: false,
        agent: false,
      }, (res) => {
        const stukken = [];
        let lengte = 0;
        const af = () => einde({ ok: true, status: res.statusCode || 0, headers: res.headers, body: Buffer.concat(stukken).subarray(0, MAX_BODY).toString("latin1") });
        opTijd = af;
        res.on("data", (d) => {
          if (lengte >= MAX_BODY) return;
          stukken.push(d); lengte += d.length;
          if (lengte >= MAX_BODY) { af(); res.destroy(); }
        });
        res.on("end", af);
        res.on("close", af);
        res.on("error", af);
      });
    } catch { return resolve({ ok: false, reden: "verbinding" }); }
    // Eén harde klok voor dit verzoek: ook een server die de verbinding openhoudt en niets zegt.
    // Kwamen de headers al binnen en druppelt alleen de body, dan beoordelen we met die headers (X-Powered-By staat erin).
    const wekker = setTimeout(() => { const af = opTijd; if (af) af(); else einde({ ok: false, reden: "timeout" }); req.destroy(); }, Math.max(1, restMs));
    req.on("error", (e) => einde({ ok: false, reden: /cert|ssl|tls|EPROTO/i.test(String(e?.code || e?.message)) ? "tls" : e?.code === "HPE_INVALID_CONSTANT" || /parse/i.test(String(e?.code)) ? "geen-http" : "verbinding" }));
    req.end();
  });
}

export async function haalHomepage(host, { timeoutMs = TIMEOUT_MS, maxRedirects = MAX_REDIRECTS, schema = "https", einde = Date.now() + timeoutMs } = {}) {
  let url = new URL(`${schema}://${host}/`);
  const stappen = [];
  for (let hop = 0; hop <= maxRedirects; hop++) {
    const rest = einde - Date.now();
    if (rest <= 0) return { ok: false, reden: "timeout", stappen };
    if (url.port && !["80", "443"].includes(url.port)) return { ok: false, reden: "poort", stappen };
    const gevonden = await zoekAdres(url.hostname);
    if (!gevonden.ok) return { ok: false, reden: gevonden.reden, stappen };
    const a = await eenVerzoek(url, gevonden.adres, gevonden.familie, rest);
    if (!a.ok) return { ok: false, reden: a.reden, stappen };
    stappen.push({ url: url.href, status: a.status, headers: a.headers, body: a.body });
    const naar = a.headers.location;
    if (a.status >= 300 && a.status < 400 && naar) {
      let volgende;
      try { volgende = new URL(Array.isArray(naar) ? naar[0] : naar, url); } catch { return { ok: false, reden: "redirect", stappen }; }
      if (!["http:", "https:"].includes(volgende.protocol)) return { ok: false, reden: "redirect", stappen };
      if (net.isIP(volgende.hostname.replace(/^\[|\]$/g, ""))) return { ok: false, reden: "intern", stappen };
      url = volgende;
      continue;
    }
    return { ok: true, status: a.status, headers: a.headers, body: a.body, stappen, eindUrl: url.href };
  }
  return { ok: false, reden: "te-veel-redirects", stappen };
}

// ---------------------------------------------------------------------------------------------
// Versies vergelijken
// ---------------------------------------------------------------------------------------------

// Gewone versie: "8.4.3" < "8.4.27" (getallen, geen tekst).
export function vergelijkVersie(a, b) {
  const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] ?? 0) - (y[i] ?? 0); if (d) return d; }
  return 0;
}

// Debian/Ubuntu-pakketversies zoals dpkg ze vergelijkt: "~" sorteert vóór alles, "+esm5" erna.
function orde(c) {
  if (c === undefined) return 0;
  if (c === "~") return -1;
  if (/\d/.test(c)) return 0;
  if (/[A-Za-z]/.test(c)) return c.charCodeAt(0);
  return c.charCodeAt(0) + 256;
}
function verrevcmp(a, b) {
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    while ((i < a.length && !/\d/.test(a[i])) || (j < b.length && !/\d/.test(b[j]))) {
      const d = orde(a[i]) - orde(b[j]);
      if (d) return d;
      i++; j++;
    }
    while (a[i] === "0") i++;
    while (b[j] === "0") j++;
    let eerste = 0;
    while (/\d/.test(a[i] ?? "") && /\d/.test(b[j] ?? "")) { if (!eerste) eerste = a.charCodeAt(i) - b.charCodeAt(j); i++; j++; }
    if (/\d/.test(a[i] ?? "")) return 1;
    if (/\d/.test(b[j] ?? "")) return -1;
    if (eerste) return eerste;
  }
  return 0;
}
export function vergelijkDpkg(a, b) {
  const deel = (v) => {
    let epoch = 0, rest = String(v);
    const m = rest.match(/^(\d+):(.*)$/); if (m) { epoch = Number(m[1]); rest = m[2]; }
    const k = rest.lastIndexOf("-");
    return k < 0 ? [epoch, rest, "0"] : [epoch, rest.slice(0, k), rest.slice(k + 1)];
  };
  const [ea, ua, ra] = deel(a), [eb, ub, rb] = deel(b);
  return ea - eb || verrevcmp(ua, ub) || verrevcmp(ra, rb);
}

// ---------------------------------------------------------------------------------------------
// Signalen
// ---------------------------------------------------------------------------------------------

const lijst = (w) => (Array.isArray(w) ? w : w == null ? [] : [String(w)]);

// Uit één headerwaarde: "PHP/8.1.2-1ubuntu2.28" → { build: "8.1.2-1ubuntu2.28", basis: "8.1.2" }.
export function leesVersie(tekst) {
  const m = String(tekst || "").match(/(?:^|[\s,;(])php\/(\d+\.\d+(?:\.\d+)?)([0-9A-Za-z.+~:-]*)/i);
  if (!m) return null;
  return { build: `${m[1]}${m[2]}`, basis: m[1], achtervoegsel: m[2] };
}

// Waar komt de build vandaan? Alleen wat in de build zelf staat telt als bewijs.
export function herkomst(v) {
  const s = v.achtervoegsel.toLowerCase();
  if (!s) return "upstream";
  if (/deb\.sury\.org/.test(s)) return "sury";
  if (/ubuntu/.test(s)) return "ubuntu";
  if (/[~+]deb\d+u\d+/.test(s)) return "debian";
  return "pakket";
}

const ATTR = /\b(?:href|src|action)\s*=\s*["']([^"']{1,400})["']/gi;
const GENERATOR = /<meta\b[^>]*\bname\s*=\s*["']generator["'][^>]*>/gi;

export function leesSignalen(antwoord, host = "") {
  const h = antwoord?.headers || {};
  const body = String(antwoord?.body || "");
  const versies = [];
  for (const [kop, bron] of [["x-powered-by", "X-Powered-By"], ["server", "Server"]]) {
    for (const w of lijst(h[kop])) {
      // Node voegt dubbele X-Powered-By samen met ", ": "PHP/8.4.27, PleskLin".
      const v = leesVersie(w);
      if (v) versies.push({ ...v, bron, herkomst: herkomst(v) });
    }
  }
  const php = new Set();
  if (lijst(h["x-powered-by"]).some((w) => /\bphp\b/i.test(w))) php.add("x-powered-by");
  const cookies = lijst(h["set-cookie"]).join("\n");
  if (/(^|\n)\s*PHPSESSID=/i.test(cookies)) php.add("phpsessid");
  if (/(^|\n)\s*laravel_session=/i.test(cookies)) php.add("laravel");
  if (/(^|\n)\s*(ci_session|wordpress_|wp-settings|PrestaShop-|SESS[0-9a-f]{32}|SSESS[0-9a-f]{32})/i.test(cookies)) php.add("cms-cookie");
  if (h["x-pingback"] && /xmlrpc\.php/i.test(String(h["x-pingback"]))) php.add("wordpress");
  if (/wp-json|xmlrpc\.php/i.test(lijst(h.link).join(" "))) php.add("wordpress");
  if (/drupal/i.test(String(h["x-generator"] || "") + String(h["x-drupal-cache"] ? "drupal" : ""))) php.add("drupal");
  // Alleen attributen en de generator-tag; nooit lopende tekst (een artikel over PHP is geen PHP).
  for (const m of body.matchAll(ATTR)) {
    const w = m[1];
    let u; try { u = new URL(w, `https://${host || "x.invalid"}/`); } catch { continue; }
    if (host && u.hostname !== host && u.hostname !== `www.${host}` && `www.${u.hostname}` !== host) continue;
    if (/\.php$/i.test(u.pathname)) php.add("php-link");
    if (/^\/wp-(content|includes)\//i.test(u.pathname)) php.add("wordpress");
  }
  for (const m of body.matchAll(GENERATOR)) {
    if (/content\s*=\s*["'][^"']*(wordpress|joomla|drupal|typo3|prestashop|magento|craft cms|concrete)/i.test(m[0])) php.add("generator");
  }
  // Het platform (GitHub Pages, Next.js op Vercel) noemen we in de tekst, maar het blijft "onbekend":
  // geen PHP op de homepage betekent niet geen PHP achter een proxy of op een ander subdomein.
  const server = lijst(h.server).join(" ");
  const aangedreven = lijst(h["x-powered-by"]).join(" ");
  let platform = null;
  if (/^github\.com$/i.test(server.trim())) platform = "GitHub Pages";
  else if (/^netlify$/i.test(server.trim())) platform = "Netlify";
  else if (/next\.js/i.test(aangedreven) && /vercel/i.test(server)) platform = "Next.js op Vercel";
  // Een EL-distributienaam in de Server-header: die leveranciers patchen met het oude nummer.
  const elHint = /(red hat|almalinux|rocky|centos|cloudlinux|oracle linux|fedora)/i.test(server);
  return { versies, php: [...php], platform, elHint };
}

// ---------------------------------------------------------------------------------------------
// Oordeel
// ---------------------------------------------------------------------------------------------

const tak = (basis) => basis.split(".").slice(0, 2).join(".");

export function oordeelVersie(v, { elHint = false } = {}) {
  const t = tak(v.basis);
  const fix = HERSTELD[t];
  const [maj, min] = t.split(".").map(Number);
  const nieuwereTak = maj > 8 || (maj === 8 && min > 5);

  // Ubuntu: de build zelf is het bewijs, in beide richtingen.
  if (v.herkomst === "ubuntu") {
    const rij = UBUNTU[v.build.slice(0, v.build.lastIndexOf("-"))];
    if (!rij) return { uitslag: "oranje", reden: "ubuntu-onbekende-build" };
    return vergelijkDpkg(v.build, rij.hersteld) >= 0
      ? { uitslag: "groen", reden: "ubuntu-hersteld", hersteldVanaf: rij.hersteld, release: `Ubuntu ${rij.release}` }
      : { uitslag: "rood", reden: "ubuntu-voor-de-fix", hersteldVanaf: rij.hersteld, release: `Ubuntu ${rij.release}` };
  }
  if (v.basis.split(".").length < 3) return { uitslag: "oranje", reden: "geen-patchnummer", hersteldVanaf: fix };
  // Een nummer op of boven de fix bevat de fix, wie het pakket ook bouwde.
  if (nieuwereTak) return { uitslag: "groen", reden: "nieuwere-tak" };
  if (fix && vergelijkVersie(v.basis, fix) >= 0) return { uitslag: "groen", reden: v.herkomst === "upstream" ? "hersteld" : `${v.herkomst}-hersteld`, hersteldVanaf: fix };
  // Daaronder: rood alleen als de bouwer aantoonbaar upstream volgt (Debian 12/13, Sury).
  if (fix && (v.herkomst === "sury" || (v.herkomst === "debian" && DEBIAN_TAKKEN.includes(t)))) return { uitslag: "rood", reden: `${v.herkomst}-voor-de-fix`, hersteldVanaf: fix };
  if (v.herkomst !== "upstream") return { uitslag: "oranje", reden: `${v.herkomst}-niet-te-beoordelen`, hersteldVanaf: fix };
  // Gewoon nummer onder de fix: kan een leverancier met backport zijn. Waarschijnlijk niet gepatcht, nooit rood.
  if (!fix) return { uitslag: "oranje", reden: "eol-alleen-via-host", hersteldVanaf: null };
  return { uitslag: "oranje", reden: elHint ? "el-leverancier-onder-fix" : "onder-de-fix-zonder-bewijs", hersteldVanaf: fix };
}

export function beoordeel(antwoord, host = "") {
  const s = leesSignalen(antwoord, host);
  if (s.versies.length) {
    const oordelen = s.versies.map((v) => ({ v, o: oordeelVersie(v, s) }));
    const builds = new Set(s.versies.map((v) => v.build));
    const eerste = oordelen[0];
    if (builds.size > 1 && new Set(oordelen.map((x) => x.o.uitslag)).size > 1)
      return { uitslag: "oranje", phpVersie: eerste.v.build, reden: "tegenstrijdige-versies", bron: eerste.v.bron };
    return { uitslag: eerste.o.uitslag, phpVersie: eerste.v.build, reden: eerste.o.reden, hersteldVanaf: eerste.o.hersteldVanaf || null, release: eerste.o.release || null, bron: eerste.v.bron };
  }
  // Geen versie: onbekend. Ook zonder PHP-tekenen, want dat betekent niet "geen PHP" (proxy, subdomein).
  if (s.php.length) return { uitslag: "onbekend", phpVersie: null, reden: "versie-verborgen", tekenen: s.php };
  return { uitslag: "onbekend", phpVersie: null, reden: "geen-php-gezien", platform: s.platform };
}

// ---------------------------------------------------------------------------------------------
// Alles samen
// ---------------------------------------------------------------------------------------------

// Registreerbaar domein, eenvoudig: de laatste twee labels, of drie bij bekende tweede niveaus (co.uk, com.au...).
export function registreerbaar(host) {
  const d = String(host).replace(/^www\./, "").split(".");
  const n = d.length >= 3 && /^(co|com|org|net|ac|gov|edu|or|ne)$/.test(d[d.length - 2]) && d[d.length - 1].length === 2 ? 3 : 2;
  return d.slice(-n).join(".");
}

// Contract (testbank/CONTRACT.md): "reden" is een korte Nederlandse uitleg; de code staat apart in "code".
const UITLEG = {
  "hersteld": "De getoonde PHP-versie bevat de fix.",
  "nieuwere-tak": "De getoonde PHP-versie is nieuwer dan elke versie met het lek.",
  "ubuntu-hersteld": "De Ubuntu-build bevat de teruggezette fix.",
  "ubuntu-voor-de-fix": "De Ubuntu-build is ouder dan de build met de fix.",
  "ubuntu-onbekende-build": "Ubuntu-build die we nog niet kennen; laat je host het bevestigen.",
  "debian-voor-de-fix": "De Debian-build is ouder dan de build met de fix.",
  "sury-voor-de-fix": "Het Surý-pakket is ouder dan de versie met de fix.",
  "onder-de-fix-zonder-bewijs": "Versie onder de fix, maar sommige hosts patchen zonder het nummer te veranderen. Laat je host het bevestigen.",
  "el-leverancier-onder-fix": "Versie onder de fix op een systeem dat fixes vaak terugzet. Laat je host het bevestigen.",
  "eol-alleen-via-host": "Deze PHP-versie krijgt geen officiële fix meer; alleen je host kan hem gepatcht hebben.",
  "geen-patchnummer": "De server noemt geen volledig versienummer.",
  "tegenstrijdige-versies": "De server noemt meer dan één PHP-versie.",
  "versie-verborgen": "Er draait PHP, maar de server verbergt de versie.",
  "geen-php-gezien": "Van buitenaf is geen PHP te zien.",
  "doorverwijzing": "Je domein stuurt door naar een ander domein; die server mist de fix, maar of het jouw server is zien we niet.",
};
const uitlegVoor = (code) => UITLEG[code] || (/^onbereikbaar-/.test(code) ? "We konden de site niet lezen." : /-hersteld$/.test(code) ? "De getoonde PHP-versie bevat de fix." : /-niet-te-beoordelen$/.test(code) ? "Pakket waarvan we de fixversie nog niet kennen; laat je host het bevestigen." : "Van buitenaf niet te beoordelen.");

export async function controleer(invoer, opties = {}) {
  const uit = await controleerKaal(invoer, opties);
  return uit.ok ? { ...uit, code: uit.reden, reden: uitlegVoor(uit.reden) } : { ...uit, code: uit.reden };
}

async function controleerKaal(invoer, opties = {}) {
  const d = normaliseerDomein(invoer);
  if (!d.ok) return { ok: false, uitslag: "onbekend", phpVersie: null, reden: d.reden };
  const einde = Date.now() + (opties.timeoutMs || TIMEOUT_MS);
  // 22 oktober 2026 (Marinus): elke invoer moet werken. Eerst https, dan http, en daarna hetzelfde met of zonder www,
  // zolang er nog geen antwoord kwam (geen DNS, geen verbinding, kapotte TLS). Alles binnen dezelfde 8 seconden.
  const ander = d.host.startsWith("www.") ? d.host.slice(4) : `www.${d.host}`;
  const pogingen = opties.schema ? [[d.host, opties.schema]] : [[d.host, "https"], [d.host, "http"], [ander, "https"], [ander, "http"]];
  let a;
  for (const [host, schema] of pogingen) {
    a = await haalHomepage(host, { ...opties, einde, schema });
    if (a.ok || a.stappen?.length || !["dns", "verbinding", "tls", "geen-http"].includes(a.reden)) break;
  }
  const basis = { ok: true, domein: d.host, check: VERSIE_CHECK };
  if (!a.ok) {
    // Een redirect die halverwege ophoudt kan al een versie hebben laten zien (bijv. een lus).
    const metVersie = (a.stappen || []).map((st) => beoordeel(st, d.host)).find((b) => b.phpVersie);
    if (metVersie) return { ...basis, ...metVersie, hops: a.stappen.length };
    return { ...basis, uitslag: "onbekend", phpVersie: null, reden: `onbereikbaar-${a.reden}`, hops: a.stappen?.length || 0 };
  }
  // Signalen van de hele keten tellen: een kaal domein kan de versie al in de redirect noemen.
  let oordeel = beoordeel(a, new URL(a.eindUrl).hostname);
  if (!oordeel.phpVersie) {
    const eerder = a.stappen.slice(0, -1).map((st) => beoordeel(st, d.host)).find((b) => b.phpVersie);
    if (eerder) oordeel = eerder;
  }
  // Stuurt het domein door naar een ander registreerbaar domein (bijv. een winkelplatform), dan is de server die we lezen
  // niet zeker die van de bezoeker: dan nooit rood, hooguit oranje met de naam van dat domein.
  const eindHost = new URL(a.eindUrl).hostname;
  if (oordeel.uitslag === "rood" && registreerbaar(eindHost) !== registreerbaar(d.host)) oordeel = { ...oordeel, uitslag: "oranje", reden: "doorverwijzing", doorverwezenNaar: eindHost };
  return { ...basis, ...oordeel, status: a.status, hops: a.stappen.length - 1, ...(registreerbaar(eindHost) !== registreerbaar(d.host) ? { doorverwezenNaar: eindHost } : {}) };
}

// ---------------------------------------------------------------------------------------------
// Limiet per IP, alleen in het geheugen van deze functie. Geen opslag, geen tracking.
// ---------------------------------------------------------------------------------------------

const tellers = new Map();
export function binnenLimiet(sleutel, max = 6, vensterMs = 10 * 60 * 1000, nu = Date.now()) {
  const tijden = (tellers.get(sleutel) || []).filter((t) => nu - t < vensterMs);
  if (tijden.length >= max) { tellers.set(sleutel, tijden); return false; }
  tijden.push(nu);
  tellers.set(sleutel, tijden);
  if (tellers.size > 5000) for (const [k, v] of tellers) if (!v.some((t) => nu - t < vensterMs)) tellers.delete(k);
  return true;
}
