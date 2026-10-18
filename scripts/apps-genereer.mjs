// 18 oktober 2026 (Marinus): "Liever welke apps wij allemaal mogelijk maken in ons systeem en dan écht een hele lijst."
// Deze generator maakt de appwand op de homepage (proposal/AppWand.tsx) uit de drie onderzoeksbestanden:
//   onderzoek-bedrijf.json, onderzoek-marketing.json, onderzoek-ai-werk.json
// en schrijft drie dingen:
//   proposal/apps.ts                 de lijst die de site leest (naam, slug, categorie, status, logo)
//   public/images/apps/<slug>.svg    het logo, uit Simple Icons (CC0) of een officiële merkpagina
//   public/images/apps/BRONNEN.md    per logo de bron, de licentie en de datum
//
// Gebruik:
//   npm pack simple-icons@16.35.0 && tar xzf simple-icons-16.35.0.tgz   (in een lege map buiten de repo)
//   node scripts/apps-genereer.mjs --onderzoek <map met de drie json-bestanden> --simple-icons <map>/package
//
// Eerlijkheid: status "os" (label "In het OS") alleen als het onderzoek status_os op een integratie zet die echt
// in het OS draait. Alles anders wordt "api" (label "Via API te koppelen"). Een app zonder bruikbaar SVG krijgt
// een teksttegel met de naam; er wordt nooit een logo verzonnen.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import path from "node:path";

const arg = (naam, standaard) => { const i = process.argv.indexOf(`--${naam}`); return i > 0 ? process.argv[i + 1] : standaard; };
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ONDERZOEK = arg("onderzoek", "/Volumes/WORK/02-SOCIALNOW/01_WEBSITE/integraties-onderzoek-20261018");
const SI = arg("simple-icons", "");
const DATUM = arg("datum", new Date().toISOString().slice(0, 10));
const LOGOS = path.join(ROOT, "public/images/apps");
// Volgorde telt bij dubbelingen: de eerste vermelding bepaalt de categorie. Zo staan Dropbox en Box bij opslag (bedrijf),
// en Slack, Zapier, Make, n8n, Telegram en Discord bij werk of communicatie (ai-werk) in plaats van bij social (marketing).
// Officiële logo's van merkpagina's (voor apps die niet in Simple Icons staan). De SVG zelf staat al in
// public/images/apps/<slug>.svg en wordt niet overschreven; per slug: bron, pagina, licentie, regels, datum en of het
// logo in eigen kleur te donker is voor zwart (donker: true, dan blijft het bij hover wit).
const OFFICIEEL_PAD = path.join(ROOT, "scripts/app-logos-officieel.json");
const OFFICIEEL = existsSync(OFFICIEEL_PAD) ? JSON.parse(readFileSync(OFFICIEEL_PAD, "utf8")) : {};
// Controle van 18 oktober 2026 (Marinus: "is het écht zo dat die allemaal gekoppeld kunnen worden?"): per app die het
// onderzoek "in_os" noemt, is in de OS-code nagelopen of een klant hem nu zelf koppelt. status per slug: "os" (zelf
// koppelen, met bewijs), "aanvraag" (koppeling bestaat, SocialNow zet hem aan) of "api". Een in_os-app die hier niet
// staat, wordt "aanvraag": zonder controle geen "In het OS". notities per slug: review, partner, betaald, psd2, odoo, zernio.
const CONTROLE_PAD = path.join(ROOT, "scripts/app-status-controle.json");
const CONTROLE = existsSync(CONTROLE_PAD) ? JSON.parse(readFileSync(CONTROLE_PAD, "utf8")) : { status: {}, notities: {} };
const BESTANDEN = ["onderzoek-bedrijf.json", "onderzoek-ai-werk.json", "onderzoek-marketing.json"];

// De tien categorieën van de appwand, in de volgorde van de filterpillen. De regex vangt de woorden die het
// onderzoek voor een categorie gebruikt (Nederlands of Engels).
export const CATEGORIEEN = [
  ["boekhouding", "Boekhouding & ERP", /boekhoud|erp|accounting|financ|factur|invoice|payroll|salaris|hr\b|personeel/i],
  ["crm", "CRM & verkoop", /crm|verkoop|sales|klant|lead|offerte|support|helpdesk|service desk/i],
  ["commerce", "E-commerce & betalen", /commerce|webshop|winkel|shop|betal|payment|kassa|pos\b|marketplace|boeking|booking/i],
  ["social", "Social & advertenties", /social|advert|ads\b|adverteren|campagne|influencer/i],
  ["analytics", "Analytics & SEO", /analytic|seo|statistiek|data|rapport|dashboard|bi\b|business intelligence|tag manager/i],
  ["communicatie", "E-mail & communicatie", /e-?mail|nieuwsbrief|newsletter|communicat|chat|bericht|messag|telefo|sms|whatsapp|video ?call|vergader/i],
  ["ai", "AI-modellen", /\bai\b|ai-|model|llm|taalmodel|inference/i],
  ["creatie", "Creatie & video", /creat|ontwerp|design|video|beeld|image|foto|audio|stem|voice|muziek|render/i],
  ["werk", "Werk & samenwerking", /werk|samenwerk|project|taak|task|kennis|knowledge|notit|automat|planning|agenda|calendar|formulier|form/i],
  ["opslag", "Opslag & documenten", /opslag|storage|document|bestand|file|drive|cloud|onderteken|sign/i],
];
const CATEGORIE_IDS = new Set(CATEGORIEEN.map(([id]) => id));
// De categorieën van het onderzoek van 18 oktober 2026, vertaald naar de tien van de appwand.
const ONDERZOEK_CATEGORIE = {
  boekhouding_erp: "boekhouding", facturatie_abonnementen: "boekhouding",
  crm_sales: "crm",
  ecommerce_marktplaats: "commerce", betalen_bank: "commerce",
  social_publiceren: "social", advertenties: "social",
  analytics_seo: "analytics", reviews: "analytics",
  email_automatisering: "communicatie", communicatie: "communicatie",
  ai_modellen: "ai",
  creatief_video: "creatie",
  werk_samenwerking: "werk", hr_planning: "werk", developer_hosting: "werk",
  opslag_documenten: "opslag",
};

const slugVan = (tekst) => String(tekst).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, "and").replace(/\+/g, "plus").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const eerste = (o, ...namen) => { for (const n of namen) if (o[n] !== undefined && o[n] !== null && o[n] !== "") return o[n]; return undefined; };

function lijstUit(json) {
  if (Array.isArray(json)) return json;
  for (const sleutel of ["apps", "items", "integraties", "integrations", "resultaten", "results", "software"]) if (Array.isArray(json?.[sleutel])) return json[sleutel];
  // Een object per categorie: { "CRM": [..], "Boekhouding": [..] }
  if (json && typeof json === "object") return Object.entries(json).flatMap(([cat, v]) => Array.isArray(v) ? v.map((x) => ({ categorie: cat, ...x })) : []);
  return [];
}

function categorieVan(app) {
  const ruw = String(eerste(app, "categorie_id", "categorie", "category", "groep", "group") ?? "");
  if (ONDERZOEK_CATEGORIE[ruw]) return ONDERZOEK_CATEGORIE[ruw];
  const id = slugVan(ruw);
  if (CATEGORIE_IDS.has(id)) return id;
  for (const [cid, label] of CATEGORIEEN) if (slugVan(ruw) === slugVan(label)) return cid;
  for (const [cid, , patroon] of CATEGORIEEN) if (patroon.test(ruw)) return cid;
  return undefined;
}

// status_os: alleen een duidelijke ja telt als "In het OS". Twijfel, "gedeeltelijk" of "gepland" is "Via API".
function statusVan(app) {
  const s = eerste(app, "status_os", "statusOs", "status", "in_os");
  if (app.api === false || /geen_api|geen api|no_api/i.test(String(s ?? ""))) return "geen";
  if (s === true) return "os";
  const t = String(s ?? "").toLowerCase().trim();
  if (/^(ja|yes|true|in het os|in_os|geintegreerd|geïntegreerd|integrated|live|os)$/.test(t)) return "os";
  return "api";
}

let simpleIcons = new Map();
if (SI) {
  const data = JSON.parse(readFileSync(path.join(SI, "data/simple-icons.json"), "utf8"));
  const versie = JSON.parse(readFileSync(path.join(SI, "package.json"), "utf8")).version;
  for (const icoon of data) simpleIcons.set(icoon.slug, { ...icoon, versie });
  for (const icoon of data) for (const t of [icoon.title, ...(icoon.aliases?.aka || [])].map(slugVan)) if (!simpleIcons.has(`titel:${t}`)) simpleIcons.set(`titel:${t}`, { ...icoon, versie });
}

// Een logo dat volgens het onderzoek alleen met schriftelijke toestemming mag (HubSpot, Cloudflare) of een eigen licentie
// heeft in plaats van CC0 (MiniMax), tonen we niet: die app wordt een teksttegel. Geldt voor elke regel met hetzelfde icoon.
const logoNiet = (app) => /logo[^.]*(toestemming|permission)|alleen na akkoord|tijdelijke vervanger/i.test(`${app.opmerking ?? ""} ${app.logo_licentie ?? ""}`) || /eigen licentie|custom/i.test(String(app.logo_licentie ?? ""));
const geblokkeerd = new Set();
// Een app die een ander merkicoon alleen als tijdelijke vervanger zou lenen (Veo met het Gemini-icoon): geen logo.
const geenLogo = new Set();

function simpleIcoon(app, naam) {
  const bron = String(eerste(app, "simple_icons_slug", "simpleIcons", "simple_icons", "logo_slug") ?? "");
  const logoBron = String(eerste(app, "logo_bron", "logoBron", "logo_source", "logo") ?? "");
  const uitUrl = logoBron.match(/simpleicons\.org\/(?:icons\/)?([a-z0-9]+)/i)?.[1] || logoBron.match(/simple-icons(?:@[\d.]+)?\/icons\/([a-z0-9]+)\.svg/i)?.[1];
  for (const kandidaat of [bron, uitUrl, logoBron && /^[a-z0-9]+$/.test(logoBron) ? logoBron : ""].filter(Boolean)) {
    const gevonden = simpleIcons.get(kandidaat.toLowerCase());
    if (gevonden) return gevonden;
  }
  // Alleen terugvallen op een naamovereenkomst als het onderzoek Simple Icons als bron noemt of niets noemt.
  if (!logoBron || /simple ?icons/i.test(logoBron)) return simpleIcons.get(`titel:${slugVan(naam)}`) || simpleIcons.get(slugVan(naam).replace(/-/g, ""));
  return undefined;
}

// Lichtheid van een merkkleur: te donker op zwart (zoals #000000 voor X of Notion) blijft bij hover wit.
function lichtheid(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Een SVG van buiten Simple Icons (officiële merkpagina) moet lokaal al gedownload zijn: logo_bestand in het onderzoek.
function schoneSvg(svg) {
  return svg.replace(/<\?xml[^>]*>/g, "").replace(/<!DOCTYPE[^>]*>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "").replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "").trim();
}

const apps = new Map();
const bronnen = [];
const zonderCategorie = [];
const ontbrekend = [];
const zonderApi = [];
for (const bestand of BESTANDEN) {
  const pad = path.join(ONDERZOEK, bestand);
  if (!existsSync(pad)) { ontbrekend.push(bestand); continue; }
  for (const app of lijstUit(JSON.parse(readFileSync(pad, "utf8")))) {
    const naam = String(eerste(app, "naam", "name", "titel", "title") ?? "").trim();
    if (!naam) continue;
    const categorie = categorieVan(app);
    if (!categorie) { zonderCategorie.push(`${naam} (${eerste(app, "categorie", "category") ?? "geen"}) in ${bestand}`); continue; }
    const slug = slugVan(eerste(app, "slug", "id") ?? naam);
    const onderzocht = statusVan(app);
    const gecontroleerd = CONTROLE.status?.[slugVan(eerste(app, "slug", "id") ?? naam)]?.status;
    const status = onderzocht === "geen" ? "geen" : onderzocht === "os" ? (gecontroleerd || "aanvraag") : (gecontroleerd === "aanvraag" ? "aanvraag" : "api");
    if (app.simple_icons_slug && logoNiet(app)) {
      if (/alleen na akkoord|tijdelijke vervanger/i.test(String(app.opmerking ?? ""))) geenLogo.add(slugVan(eerste(app, "slug", "id") ?? naam));
      else geblokkeerd.add(app.simple_icons_slug);
    }
    // Zonder officiële API (Midjourney, Suno, CapCut) hoort een app niet op de wand.
    if (status === "geen") { zonderApi.push(naam); continue; }
    const bestaand = apps.get(slug) || [...apps.values()].find((a) => slugVan(a.naam) === slugVan(naam));
    // Dubbel in twee bestanden: "In het OS" wint alleen als één van beide het echt zo noemt.
    const rang = { os: 0, aanvraag: 1, api: 2 };
    if (bestaand) { if (rang[status] < rang[bestaand.status]) bestaand.status = status; continue; }
    apps.set(slug, { naam, slug, categorie, status, notitie: CONTROLE.notities?.[slug], app });
  }
}
if (ontbrekend.length === BESTANDEN.length) { console.error(`Geen onderzoeksbestanden in ${ONDERZOEK}`); process.exit(1); }

mkdirSync(LOGOS, { recursive: true });
const behouden = new Set(["BRONNEN.md"]);
for (const item of apps.values()) {
  const { app, naam, slug } = item;
  const icoonGevonden = simpleIcoon(app, naam);
  const icoon = icoonGevonden && !geblokkeerd.has(icoonGevonden.slug) && !geenLogo.has(slug) ? icoonGevonden : undefined;
  if (icoonGevonden && !icoon) item.merkregel = String(eerste(app, "merkregels_url") ?? icoonGevonden.guidelines ?? "");
  const lokaal = eerste(app, "logo_bestand", "logoBestand");
  const officieel = OFFICIEEL[slug];
  if (officieel && existsSync(path.join(LOGOS, `${slug}.svg`))) {
    item.logo = `/images/apps/${slug}.svg`;
    if (officieel.donker) item.donker = true;
    if (officieel.kleur) item.kleur = officieel.kleur;
    bronnen.push([naam, `${slug}.svg`, `Officieel: ${officieel.bron} (via ${officieel.pagina})`, officieel.licentie, officieel.regels, officieel.datum]);
  } else if (icoon) {
    const svg = readFileSync(path.join(SI, "icons", `${icoon.slug}.svg`), "utf8").replace("<svg ", `<svg fill="#${icoon.hex}" `);
    writeFileSync(path.join(LOGOS, `${slug}.svg`), svg + "\n");
    item.logo = `/images/apps/${slug}.svg`;
    item.donker = lichtheid(icoon.hex) < 0.06;
    if (!item.donker) item.kleur = `#${icoon.hex}`;
    bronnen.push([naam, `${slug}.svg`, `Simple Icons ${icoon.versie}, icoon \`${icoon.slug}\`: ${eerste(app, "logo_svg_bron") ?? `https://cdn.jsdelivr.net/npm/simple-icons@${icoon.versie}/icons/${icoon.slug}.svg`} (tekening van ${icoon.source})`, icoon.license?.type || "CC0-1.0 via Simple Icons; merkrecht bij de eigenaar", String(eerste(app, "merkregels_url") ?? icoon.guidelines ?? "")]);
  } else if (lokaal && existsSync(String(lokaal)) && String(lokaal).endsWith(".svg")) {
    writeFileSync(path.join(LOGOS, `${slug}.svg`), schoneSvg(readFileSync(String(lokaal), "utf8")) + "\n");
    item.logo = `/images/apps/${slug}.svg`;
    bronnen.push([naam, `${slug}.svg`, String(eerste(app, "logo_bron", "logo_source") ?? lokaal), String(eerste(app, "logo_licentie", "logo_license") ?? "merklogo, gebruik volgens de merkrichtlijnen van de eigenaar"), String(eerste(app, "merkrichtlijnen", "guidelines") ?? "")]);
  }
  if (item.logo) behouden.add(`${slug}.svg`);
}
// Logo's van apps die niet meer in de lijst staan, gaan weg.
for (const f of readdirSync(LOGOS)) if (!behouden.has(f)) unlinkSync(path.join(LOGOS, f));

const volgorde = new Map(CATEGORIEEN.map(([id], i) => [id, i]));
const STATUSVOLGORDE = { os: 0, aanvraag: 1, api: 2 };
const lijst = [...apps.values()].sort((a, b) => STATUSVOLGORDE[a.status] - STATUSVOLGORDE[b.status] || volgorde.get(a.categorie) - volgorde.get(b.categorie) || a.naam.localeCompare(b.naam, "nl"));

const ts = `// Gegenereerd door scripts/apps-genereer.mjs op ${DATUM} uit de drie onderzoeksbestanden in
// integraties-onderzoek-20261018. Niet met de hand aanpassen: pas het onderzoek aan en draai de generator opnieuw.
// status "os" = label "In het OS" (klant koppelt zelf, gecontroleerd in de OS-code), "aanvraag" = "Op aanvraag"
// (koppeling bestaat, SocialNow zet hem aan), "api" = "Via API te koppelen". notitie = korte uitleg in de tooltip.
export type AppCategorie = ${CATEGORIEEN.map(([id]) => JSON.stringify(id)).join(" | ")};
// kleur = merkkleur voor de zachte tint van de tegel; donker = logo in eigen kleur is (bijna) zwart, de site toont dan de witte versie.
export type AppNotitie = "review" | "partner" | "betaald" | "psd2" | "odoo" | "zernio";
export type App = { naam: string; slug: string; categorie: AppCategorie; status: "os" | "aanvraag" | "api"; notitie?: AppNotitie; logo?: string; kleur?: string; donker?: boolean };
export const APP_CATEGORIEEN: { id: AppCategorie; label: string }[] = [
${CATEGORIEEN.map(([id, label]) => `  { id: ${JSON.stringify(id)}, label: ${JSON.stringify(label)} },`).join("\n")}
];
export const APPS: App[] = [
${lijst.map(({ naam, slug, categorie, status, notitie, logo, kleur, donker }) => `  ${JSON.stringify({ naam, slug, categorie, status, ...(notitie ? { notitie } : {}), ...(logo ? { logo } : {}), ...(kleur ? { kleur } : {}), ...(donker ? { donker } : {}) })},`).join("\n")}
];
`;
writeFileSync(path.join(ROOT, "proposal/apps.ts"), ts);

const md = `# Bronnen van de applogo's

Gegenereerd door \`scripts/apps-genereer.mjs\` op ${DATUM}. Elk logo is het onveranderde merkteken uit de bron
hieronder. De site toont het in de officiële merkkleur; een merk met een zwart of bijna zwart logo (OpenAI, Notion, X)
staat in de witte versie op de donkere achtergrond. Apps zonder bruikbaar
SVG staan op de appwand als teksttegel met alleen de naam.

Simple Icons is uitgegeven onder CC0-1.0; het merkrecht op elk logo blijft bij de eigenaar
(zie https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md). Waar een merk richtlijnen heeft,
staan ze in de laatste kolom.

| App | Bestand | Bron | Licentie | Merkrichtlijnen | Datum |
|---|---|---|---|---|---|
${bronnen.sort((a, b) => a[0].localeCompare(b[0], "nl")).map((r) => `| ${[...r.slice(0, 5), r[5] || DATUM].map((c) => String(c).replace(/\|/g, "\\|")).join(" | ")} |`).join("\n")}

## Zonder logo (teksttegel)

${lijst.filter((a) => !a.logo).map((a) => `- ${a.naam}${a.merkregel ? ` (wel in Simple Icons, maar logo alleen met toestemming of eigen licentie: ${a.merkregel})` : ""}`).join("\n") || "- geen"}
`;
writeFileSync(path.join(LOGOS, "BRONNEN.md"), md);

console.log(`${lijst.length} apps: ${lijst.filter((a) => a.status === "os").length} in het OS, ${lijst.filter((a) => a.status === "aanvraag").length} op aanvraag, ${lijst.filter((a) => a.status === "api").length} via API; ${lijst.filter((a) => a.logo).length} met logo.`);
if (ontbrekend.length) console.log(`Ontbreekt nog: ${ontbrekend.join(", ")}`);
if (zonderApi.length) console.log(`Niet op de wand, geen officiële API: ${zonderApi.join(", ")}`);
if (zonderCategorie.length) console.log(`Overgeslagen zonder categorie:\n  ${zonderCategorie.join("\n  ")}`);
