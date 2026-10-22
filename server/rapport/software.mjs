// Verouderde software die publiek zichtbaar is (websiterapport op /check, 22 oktober 2026).
//
// Alleen wat de site zelf in de HTML of in een gelinkte feed laat zien:
//   - CMS-versie uit <meta name="generator"> en uit de <generator> van een feed die de homepage zelf linkt;
//   - bibliotheken uit de adressen van scripts en stylesheets (CDN-pad, bestandsnaam, of ?ver= in wp-includes);
//   - plugin-versies alleen als ze in de HTML staan (?ver= bij /wp-content/plugins/<slug>/, of een generator-tag).
// Daarna vergelijken met open bronnen:
//   - OSV.dev (GitHub Security Advisories, CC-BY 4.0) voor bekende lekken in bibliotheken;
//   - api.wordpress.org: stable-check (latest/outdated/insecure per WordPress-versie) en de nieuwste pluginversie.
// Geen WPScan (licentie), geen gokpaden, geen readme.html.

import { testbankModus } from "../php-check.mjs";

const SEMVER = /^\d+\.\d+(?:\.\d+)?$/;

// Bibliotheken die we herkennen, met hun naam bij npm (zo staan ze in OSV).
const BIBLIOTHEKEN = new Set(["jquery", "jquery-ui", "jquery-migrate", "bootstrap", "lodash", "moment", "angular", "handlebars", "underscore", "vue", "dompurify", "axios", "jquery-validation", "select2", "swiper", "chart.js", "datatables.net", "knockout", "mustache", "prismjs", "highlight.js", "video.js", "plyr", "fancybox", "@fancyapps/fancybox", "lightbox2", "slick-carousel", "owl.carousel"]);
const ALIAS = {
  jqueryui: "jquery-ui", "jquery-ui-dist": "jquery-ui", "twitter-bootstrap": "bootstrap", "lodash.js": "lodash", "moment.js": "moment",
  "angular.js": "angular", angularjs: "angular", "handlebars.js": "handlebars", "underscore.js": "underscore", "vue.js": "vue",
  "jquery-validate": "jquery-validation", "jquery.validate": "jquery-validation", "chartjs": "chart.js", "datatables": "datatables.net",
  "knockout.js": "knockout", "mustache.js": "mustache", "videojs": "video.js", "fancybox": "@fancyapps/fancybox", "slick": "slick-carousel",
};
const npmNaam = (n) => { const k = String(n).toLowerCase(); const a = ALIAS[k] || k; return BIBLIOTHEKEN.has(a) ? a : null; };

// Generator-tags van plugins met een versie, en hun slug op wordpress.org.
const PLUGIN_GENERATOR = [
  [/^WooCommerce\s+(\d+\.\d+(?:\.\d+)?)/i, "woocommerce", "WooCommerce"],
  [/^Elementor\s+(\d+\.\d+(?:\.\d+)?)/i, "elementor", "Elementor"],
  [/^Site Kit by Google\s+(\d+\.\d+(?:\.\d+)?)/i, "google-site-kit", "Site Kit by Google"],
  [/^All in One SEO(?: \(AIOSEO\))?\s+(\d+\.\d+(?:\.\d+)?)/i, "all-in-one-seo-pack", "All in One SEO"],
];

const ATTR_URL = /<(script|link)\b[^>]*?\b(src|href)\s*=\s*["']([^"']{1,500})["'][^>]*>/gi;
const META_GEN = /<meta\b[^>]*>/gi;

function generatorInhoud(html) {
  const uit = [];
  for (const m of String(html).matchAll(META_GEN)) {
    if (!/\bname\s*=\s*["']generator["']/i.test(m[0])) continue;
    const c = m[0].match(/\bcontent\s*=\s*["']([^"']{1,200})["']/i);
    if (c) uit.push({ tekst: c[1].trim(), tag: m[0].slice(0, 200) });
  }
  return uit;
}

function versieUitUrl(ruw) {
  let u;
  try { u = new URL(ruw.replace(/&amp;/g, "&"), "https://x.invalid/"); } catch { return null; }
  const pad = decodeURIComponent(u.pathname).toLowerCase();
  const ver = u.searchParams.get("ver") || "";
  const vol = `${u.hostname}${pad}`;
  // WordPress zet bij zijn eigen jQuery de echte bibliotheekversie in ?ver=.
  let m;
  if ((m = pad.match(/\/wp-includes\/js\/jquery\/(jquery|jquery-migrate)(?:\.min)?\.js$/)) && SEMVER.test(ver)) return { naam: m[1], versie: ver, bron: "wp-includes" };
  if (/\/wp-includes\/js\/jquery\/ui\/[a-z-]+(?:\.min)?\.js$/.test(pad) && SEMVER.test(ver)) return { naam: "jquery-ui", versie: ver, bron: "wp-includes" };
  if ((m = vol.match(/^cdnjs\.cloudflare\.com\/ajax\/libs\/([^/]+)\/(\d+\.\d+\.\d+)\//))) return npmNaam(m[1]) && { naam: npmNaam(m[1]), versie: m[2], bron: "cdnjs" };
  if ((m = vol.match(/^ajax\.googleapis\.com\/ajax\/libs\/([^/]+)\/(\d+\.\d+\.\d+)\//))) return npmNaam(m[1]) && { naam: npmNaam(m[1]), versie: m[2], bron: "googleapis" };
  if ((m = vol.match(/^(?:cdn|fastly)\.jsdelivr\.net\/npm\/((?:@[^/@]+\/)?[^/@]+)@(\d+\.\d+\.\d+)(?:\/|$)/))) return npmNaam(m[1]) && { naam: npmNaam(m[1]), versie: m[2], bron: "jsdelivr" };
  if ((m = vol.match(/^unpkg\.com\/((?:@[^/@]+\/)?[^/@]+)@(\d+\.\d+\.\d+)(?:\/|$)/))) return npmNaam(m[1]) && { naam: npmNaam(m[1]), versie: m[2], bron: "unpkg" };
  if ((m = vol.match(/^code\.jquery\.com\/(?:jquery-(\d+\.\d+\.\d+)(?:\.slim)?(?:\.min)?\.js|ui\/(\d+\.\d+\.\d+)\/)/))) return m[1] ? { naam: "jquery", versie: m[1], bron: "code.jquery.com" } : { naam: "jquery-ui", versie: m[2], bron: "code.jquery.com" };
  if ((m = vol.match(/^(?:maxcdn|stackpath|netdna)\.bootstrapcdn\.com\/(?:twitter-)?bootstrap\/(\d+\.\d+\.\d+)\//))) return { naam: "bootstrap", versie: m[1], bron: "bootstrapcdn" };
  // Versie in de bestandsnaam: jquery-1.12.4.min.js, bootstrap-3.3.7.min.css, jquery-ui-1.12.1.js.
  if ((m = pad.match(/\/(jquery-ui|jquery-migrate|jquery|bootstrap|lodash|moment|angular|handlebars|underscore|vue|dompurify|select2|swiper)[.-](\d+\.\d+\.\d+)(?:\.slim)?(?:\.min)?\.(?:js|css)$/))) return { naam: npmNaam(m[1]), versie: m[2], bron: "bestandsnaam" };
  return null;
}

function pluginUitUrl(ruw) {
  let u;
  try { u = new URL(ruw.replace(/&amp;/g, "&"), "https://x.invalid/"); } catch { return null; }
  const m = u.pathname.match(/\/wp-content\/plugins\/([a-z0-9_-]{2,80})\//i);
  if (!m) return null;
  const ver = u.searchParams.get("ver") || "";
  if (!/^\d{1,3}\.\d{1,3}(?:\.\d{1,4}){0,2}$/.test(ver)) return { slug: m[1].toLowerCase(), versie: null };
  return { slug: m[1].toLowerCase(), versie: ver };
}

// Alles wat de pagina's en de feed openbaar maken. Pure functie: geen netwerk.
export function vindSoftware(paginas = [], feed = null) {
  let cms = null;
  const bibliotheken = new Map();
  const pluginVer = new Map(); // slug → { versies: Set, bewijs }
  const pluginGen = new Map();
  for (const p of paginas) {
    const html = String(p.body || "");
    for (const g of generatorInhoud(html)) {
      let m;
      if (!cms && (m = g.tekst.match(/^WordPress\s+(\d+\.\d+(?:\.\d+)?)/i))) cms = { naam: "WordPress", versie: m[1], bron: "generator", bewijs: g.tag, url: p.url };
      else if (!cms && /^WordPress\b/i.test(g.tekst)) cms = { naam: "WordPress", versie: null, bron: "generator", bewijs: g.tag, url: p.url };
      else if (!cms && (m = g.tekst.match(/^Drupal\s+(\d+)(?:\.(\d+(?:\.\d+)?))?/i))) cms = { naam: "Drupal", versie: m[2] ? `${m[1]}.${m[2]}` : m[1], hoofdversie: Number(m[1]), bron: "generator", bewijs: g.tag, url: p.url };
      else if (!cms && (m = g.tekst.match(/^Joomla!?\s*(\d+\.\d+(?:\.\d+)?)?/i))) cms = { naam: "Joomla", versie: m[1] || null, bron: "generator", bewijs: g.tag, url: p.url };
      else if (!cms && (m = g.tekst.match(/^TYPO3\s+(?:CMS\s*)?(\d+\.\d+(?:\.\d+)?)?/i))) cms = { naam: "TYPO3", versie: m[1] || null, bron: "generator", bewijs: g.tag, url: p.url };
      for (const [re, slug, naam] of PLUGIN_GENERATOR) {
        const pm = g.tekst.match(re);
        if (pm && !pluginGen.has(slug)) pluginGen.set(slug, { slug, naam, versie: pm[1], bewijs: g.tag, url: p.url });
      }
    }
    const yoast = html.match(/This site is optimized with the Yoast SEO(?: Premium)? plugin v(\d+\.\d+(?:\.\d+)?)/i);
    if (yoast && !pluginGen.has("wordpress-seo") && !/Premium/i.test(yoast[0])) pluginGen.set("wordpress-seo", { slug: "wordpress-seo", naam: "Yoast SEO", versie: yoast[1], bewijs: yoast[0], url: p.url });
    for (const m of html.matchAll(ATTR_URL)) {
      const ruw = m[3];
      const b = versieUitUrl(ruw);
      if (b && b.naam) {
        const sleutel = `${b.naam}@${b.versie}`;
        if (!bibliotheken.has(sleutel)) bibliotheken.set(sleutel, { ...b, bewijs: ruw.slice(0, 300), url: p.url });
      }
      const pl = pluginUitUrl(ruw);
      if (pl) {
        const r = pluginVer.get(pl.slug) || { versies: new Set(), zonder: 0, bewijs: ruw.slice(0, 300), url: p.url };
        if (pl.versie) r.versies.add(pl.versie); else r.zonder++;
        pluginVer.set(pl.slug, r);
      }
    }
  }
  // Feed die de homepage zelf linkt: <generator>https://wordpress.org/?v=6.4.2</generator>.
  if (feed?.body) {
    const m = String(feed.body).match(/<generator>\s*https?:\/\/wordpress\.org\/\?v=(\d+\.\d+(?:\.\d+)?)\s*<\/generator>/i);
    if (m && (!cms || (cms.naam === "WordPress" && !cms.versie))) cms = { naam: "WordPress", versie: m[1], bron: "feed", bewijs: m[0], url: feed.url };
  }
  // Een plugin zonder eigen versie krijgt van WordPress de WordPress-versie als ?ver=. Die tellen we niet: niet de versie
  // uit de generator, niet een ?ver= van wp-includes buiten jQuery, en niet een nummer dat bij twee plugins gelijk is.
  const kernVersies = new Set(cms?.naam === "WordPress" && cms.versie ? [cms.versie] : []);
  for (const p of paginas) for (const m of String(p.body || "").matchAll(ATTR_URL)) {
    const k = m[3].match(/\/wp-includes\/(?!js\/jquery\/)[^"'?]+\?ver=(\d+\.\d+(?:\.\d+)?)(?:&|$)/i);
    if (k) kernVersies.add(k[1]);
  }
  const perVersie = new Map();
  for (const r of pluginVer.values()) for (const v of r.versies) perVersie.set(v, (perVersie.get(v) || 0) + 1);
  const plugins = [];
  for (const [slug, r] of pluginVer) {
    if (pluginGen.has(slug)) continue;
    const versies = [...r.versies].filter((v) => !kernVersies.has(v) && perVersie.get(v) === 1);
    // Alleen als elk bestand van die plugin hetzelfde nummer draagt; anders is ?ver= geen pluginversie.
    if (versies.length !== 1 || r.versies.size !== 1) continue;
    plugins.push({ slug, naam: slug, versie: versies[0], bron: "ver", bewijs: r.bewijs, url: r.url });
  }
  for (const g of pluginGen.values()) plugins.push({ ...g, bron: "generator" });
  return { cms, bibliotheken: [...bibliotheken.values()], plugins };
}

// ---------------------------------------------------------------------------------------------
// Open bronnen, met een korte cache in het geheugen van deze functie
// ---------------------------------------------------------------------------------------------

const bronCache = new Map();
async function haalJson(url, { ms = 4000, methode = "GET", body, cacheMs = 6 * 3600 * 1000 } = {}) {
  const sleutel = `${methode} ${url} ${body || ""}`;
  const c = bronCache.get(sleutel);
  if (c && Date.now() - c.t < cacheMs) return c.data;
  const r = await fetch(url, { method: methode, body, headers: body ? { "Content-Type": "application/json" } : {}, signal: AbortSignal.timeout(ms) });
  if (!r.ok) throw new Error(`status ${r.status}`);
  const data = await r.json();
  bronCache.set(sleutel, { t: Date.now(), data });
  if (bronCache.size > 500) bronCache.delete(bronCache.keys().next().value);
  return data;
}
const basis = (env, standaard) => (testbankModus() && process.env[env] ? process.env[env].replace(/\/$/, "") : standaard);
const OSV = () => basis("CHECK_OSV_URL", "https://api.osv.dev");
const WPORG = () => basis("CHECK_WPORG_URL", "https://api.wordpress.org");

export async function wordpressStatus(versie) {
  const tabel = await haalJson(`${WPORG()}/core/stable-check/1.0/`);
  const nieuwste = Object.keys(tabel).find((k) => tabel[k] === "latest") || null;
  return { status: tabel[versie] || null, nieuwste };
}

export async function pluginNieuwste(slug) {
  const data = await haalJson(`${WPORG()}/plugins/info/1.2/?action=plugin_information&request%5Bslug%5D=${encodeURIComponent(slug)}&request%5Bfields%5D%5Bsections%5D=0`);
  return data && typeof data.version === "string" ? { versie: data.version, naam: String(data.name || slug).replace(/&#\d+;|&amp;/g, " ").replace(/\s+/g, " ").trim() } : null;
}

const ERNST = { LOW: 1, MODERATE: 2, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
export async function osvLekken(naam, versie) {
  const data = await haalJson(`${OSV()}/v1/query`, { methode: "POST", body: JSON.stringify({ package: { name: naam, ecosystem: "npm" }, version: versie }) });
  return (data?.vulns || []).map((v) => {
    const ernst = String(v.database_specific?.severity || "").toUpperCase();
    return { id: v.id, cve: (v.aliases || []).find((a) => /^CVE-/.test(a)) || null, ernst: ERNST[ernst] ? ernst : null, samenvatting: String(v.summary || "").slice(0, 160) };
  });
}

// ---------------------------------------------------------------------------------------------
// Oordeel
// ---------------------------------------------------------------------------------------------

export function vergelijkVersie(a, b) {
  const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] ?? 0) - (y[i] ?? 0); if (d) return d; }
  return 0;
}

// Haalt de bronnen op en geeft per onderdeel een status. Een bron die niet antwoordt geeft "onbekend" voor dat
// onderdeel, nooit een gok.
export async function beoordeelSoftware(gevonden, { maxBibliotheken = 8, maxPlugins = 10 } = {}) {
  const onderdelen = [];
  const bronFouten = [];
  const taken = [];
  const { cms } = gevonden;
  if (cms?.naam === "WordPress" && cms.versie) {
    taken.push(wordpressStatus(cms.versie).then((s) => {
      const status = s.status === "insecure" ? "slecht" : s.status === "outdated" ? "aandacht" : s.status === "latest" ? "goed" : "onbekend";
      onderdelen.push({ soort: "cms", naam: "WordPress", versie: cms.versie, status, nieuwste: s.nieuwste, wpStatus: s.status, bron: cms.bron, bewijs: cms.bewijs, url: cms.url });
    }).catch(() => { bronFouten.push("wordpress.org"); onderdelen.push({ soort: "cms", naam: "WordPress", versie: cms.versie, status: "onbekend", bron: cms.bron, bewijs: cms.bewijs, url: cms.url }); }));
  } else if (cms?.naam === "Drupal" && cms.hoofdversie && cms.hoofdversie <= 7) {
    // Drupal 7 kreeg op 5 januari 2025 zijn laatste update (drupal.org/about/drupal-7/d7eol).
    onderdelen.push({ soort: "cms", naam: "Drupal", versie: cms.versie, status: "slecht", eol: "2025-01-05", bron: cms.bron, bewijs: cms.bewijs, url: cms.url });
  } else if (cms) {
    onderdelen.push({ soort: "cms", naam: cms.naam, versie: cms.versie, status: "onbekend", bron: cms.bron, bewijs: cms.bewijs, url: cms.url });
  }
  for (const b of gevonden.bibliotheken.slice(0, maxBibliotheken)) {
    taken.push(osvLekken(b.naam, b.versie).then((lekken) => {
      const zwaarste = Math.max(0, ...lekken.map((l) => ERNST[l.ernst] || 2));
      const status = !lekken.length ? "goed" : zwaarste >= 3 ? "slecht" : "aandacht";
      onderdelen.push({ soort: "bibliotheek", naam: b.naam, versie: b.versie, status, lekken: lekken.slice(0, 6), aantalLekken: lekken.length, bron: b.bron, bewijs: b.bewijs, url: b.url });
    }).catch(() => { bronFouten.push("osv.dev"); onderdelen.push({ soort: "bibliotheek", naam: b.naam, versie: b.versie, status: "onbekend", bron: b.bron, bewijs: b.bewijs, url: b.url }); }));
  }
  for (const p of gevonden.plugins.slice(0, maxPlugins)) {
    taken.push(pluginNieuwste(p.slug).then((n) => {
      // Geen plugin op wordpress.org, of ?ver= hoger dan de nieuwste release: dan is het geen pluginversie. Niet melden.
      if (!n || vergelijkVersie(p.versie, n.versie) > 0) return;
      onderdelen.push({ soort: "plugin", naam: p.bron === "generator" ? p.naam : n.naam, slug: p.slug, versie: p.versie, nieuwste: n.versie, status: vergelijkVersie(p.versie, n.versie) < 0 ? "aandacht" : "goed", bron: p.bron, bewijs: p.bewijs, url: p.url });
    }).catch(() => { bronFouten.push("wordpress.org"); }));
  }
  await Promise.all(taken);
  const volgorde = { slecht: 0, aandacht: 1, onbekend: 2, goed: 3 };
  onderdelen.sort((a, b) => volgorde[a.status] - volgorde[b.status] || a.naam.localeCompare(b.naam));
  return { onderdelen, bronFouten: [...new Set(bronFouten)] };
}
