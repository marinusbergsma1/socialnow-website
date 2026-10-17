// A/B-test van de homepage-header — 17 oktober 2026.
//
// MARINUS VROEG: "A/B testen wat interessanter is voor mijn omzet ... constant updaten op basis van
// wie bezoekt en wat die persoon te zien krijgt." Variant A is de huidige header (gratis OS voor
// starters), variant B de Custom OS-header (proposal/HeaderCustomOs.tsx).
//
// ZONDER COOKIES
//   Er wordt niets in de browser opgeslagen. De server maakt per bezoeker een id uit IP-adres,
//   browser, de datum en een geheim zout (AB_ZOUT). Dat id wisselt elke dag en is niet terug te
//   rekenen naar een IP-adres. Daardoor ziet iemand binnen een dag steeds dezelfde variant, en is
//   er geen toestemmingsvraag nodig (artikel 11.7a Telecommunicatiewet gaat over opslag op het
//   apparaat). Het PostHog-script komt niet op de site: de metingen gaan via deze functie.
//
// ZELFLEREND
//   Elke zes uur haalt de functie uit PostHog hoe vaak elke variant getoond is en hoe vaak er op
//   "gratis OS" en "Custom OS" geklikt is. Elke klik heeft een waarde in euro's (AB_WAARDE_GRATIS,
//   AB_WAARDE_CUSTOM). Thompson sampling rekent uit hoe groot de kans is dat B per bezoeker meer
//   oplevert dan A, en dat wordt het aandeel bezoekers dat B ziet, tussen 10 en 90 procent zodat
//   beide varianten blijven leren.
//
// INSTELLINGEN (Vercel, project socialnow-website)
//   POSTHOG_KEY            projectsleutel phc_..., dezelfde als in SocialNow OS
//   POSTHOG_PERSONAL_KEY   persoonlijke API-sleutel met leesrecht op query; zonder blijft het 50/50
//   POSTHOG_PROJECT_ID     nummer van het PostHog-project
//   AB_ZOUT                willekeurige tekst van minstens 32 tekens
//   AB_WAARDE_GRATIS       standaard 50
//   AB_WAARDE_CUSTOM       standaard 1000 (10 procent kans op €10.000)
//
// STAIROIDS
//   Komt hier later bij: herkent Stairoids een bedrijf met 10 of meer mensen, dan B met bedrijfsnaam.
//   Dat vraagt toestemming, want Stairoids herkent ook personen; zie Cookiebot.tsx.
import { createHash, randomBytes } from "node:crypto";

export const VARIANTEN = ["a", "b"];
export const GEBEURTENISSEN = ["header_getoond", "header_klik"];
export const DOELEN = ["gratis_os", "custom_os", "connect", "werk", "explainer"];
const MIN = 0.1;
const MAX = 0.9;
const VERNIEUW_MS = 6 * 60 * 60 * 1000;

// Zonder AB_ZOUT een willekeurig zout per serverinstantie: privacy blijft goed, maar een bezoeker kan
// dan op een andere instantie een andere variant krijgen. Zet AB_ZOUT dus wel.
const ZOUT = process.env.AB_ZOUT && process.env.AB_ZOUT.length >= 32 ? process.env.AB_ZOUT : randomBytes(32).toString("hex");

export function bezoekerId(ip, ua, dag = new Date().toISOString().slice(0, 10)) {
  return createHash("sha256").update(`${ZOUT}|${dag}|${ip || ""}|${ua || ""}`).digest("hex").slice(0, 32);
}

export function kiesVariant({ id, gewichtB, utm = "", taal = "nl" }) {
  // Header B is alleen in het Nederlands geschreven.
  if (taal !== "nl") return { variant: "a", reden: "taal" };
  // De belofte van de advertentie moet kloppen met wat iemand ziet.
  if (/custom/i.test(utm)) return { variant: "b", reden: "campagne" };
  if (/gratis|free/i.test(utm)) return { variant: "a", reden: "campagne" };
  const u = parseInt(id.slice(0, 8), 16) / 0x100000000;
  return { variant: u < gewichtB ? "b" : "a", reden: "test" };
}

// Gamma(k, 1) volgens Marsaglia en Tsang; Beta(a, b) = X / (X + Y).
function gamma(k, rng) {
  if (k < 1) return gamma(k + 1, rng) * Math.pow(rng(), 1 / k);
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do {
      const u1 = rng() || 1e-12, u2 = rng();
      x = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x ** 4 || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}
function beta(a, b, rng) { const x = gamma(a, rng); return x / (x + gamma(b, rng)); }

// stats: { a: { getoond, gratis_os, custom_os }, b: { ... } }; waarden: { gratis_os, custom_os }.
// Geeft het aandeel bezoekers dat B moet zien.
export function berekenGewicht(stats, waarden, trekkingen = 4000, rng = Math.random) {
  let bWint = 0;
  for (let i = 0; i < trekkingen; i++) {
    const w = {};
    for (const v of VARIANTEN) {
      const s = stats[v] || {}, n = Math.max(0, s.getoond || 0);
      w[v] = 0;
      for (const [doel, euro] of Object.entries(waarden)) {
        const k = Math.min(n, Math.max(0, s[doel] || 0));
        w[v] += beta(1 + k, 1 + n - k, rng) * euro;
      }
    }
    if (w.b > w.a) bWint++;
  }
  return Math.min(MAX, Math.max(MIN, bWint / trekkingen));
}

export function waarden() {
  const g = Number(process.env.AB_WAARDE_GRATIS), c = Number(process.env.AB_WAARDE_CUSTOM);
  return { gratis_os: g > 0 ? g : 50, custom_os: c > 0 ? c : 1000 };
}

async function leesStats() {
  const sleutel = process.env.POSTHOG_PERSONAL_KEY, project = process.env.POSTHOG_PROJECT_ID;
  if (!sleutel || !/^\d+$/.test(project || "")) return null;
  const query = `SELECT properties.variant, event, properties.doel, count(DISTINCT distinct_id)
    FROM events
    WHERE event IN ('header_getoond', 'header_klik') AND properties.bron = 'socialnow.nl'
      AND timestamp > now() - INTERVAL 30 DAY
    GROUP BY properties.variant, event, properties.doel`;
  const r = await fetch(`https://eu.posthog.com/api/projects/${project}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${sleutel}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) return null;
  const { results = [] } = await r.json();
  const stats = { a: { getoond: 0 }, b: { getoond: 0 } };
  for (const [v, gebeurtenis, doel, n] of results) {
    if (!stats[v]) continue;
    if (gebeurtenis === "header_getoond") stats[v].getoond += Number(n) || 0;
    else if (doel) stats[v][doel] = (stats[v][doel] || 0) + (Number(n) || 0);
  }
  return stats;
}

let cache = { gewichtB: 0.5, stats: null, op: 0 };
export async function gewichtB() {
  if (Date.now() - cache.op < VERNIEUW_MS) return cache;
  try {
    const stats = await leesStats();
    cache = { gewichtB: stats ? berekenGewicht(stats, waarden()) : 0.5, stats, op: Date.now() };
  } catch {
    // PostHog niet bereikbaar: vorige verdeling houden en over een kwartier opnieuw proberen.
    cache = { ...cache, op: Date.now() - VERNIEUW_MS + 15 * 60 * 1000 };
  }
  return cache;
}

export async function stuurNaarPostHog(gebeurtenis, id, eigenschappen) {
  const sleutel = process.env.POSTHOG_KEY;
  if (!/^phc_[A-Za-z0-9]{20,80}$/.test(sleutel || "")) return false;
  const r = await fetch("https://eu.i.posthog.com/i/v0/e/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: sleutel,
      event: gebeurtenis,
      distinct_id: id,
      properties: { ...eigenschappen, bron: "socialnow.nl", $process_person_profile: false, $geoip_disable: true },
    }),
    signal: AbortSignal.timeout(3000),
  });
  return r.ok;
}
