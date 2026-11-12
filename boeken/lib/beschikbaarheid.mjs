// Beschikbaarheid die Marinus zelf indeelt op os.socialnow.nl (contract: LEESMIJ.md). De boekingskant leest
// alleen; de opslag zit in het OS. Een slot is boekbaar als het binnen een blok valt EN Google dan vrij is.
import { plusDagen } from "./tijd.mjs";

const DAGEN = { 1: "ma", 2: "di", 3: "wo", 4: "do", 5: "vr", 6: "za", 7: "zo" };
const TIJD = /^(?:[01]\d|2[0-3]):[0-5]\d$|^24:00$/;
const DATUM = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const MAX = 400;
const minuten = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

// Blokken van één dag, of null als er iets niet klopt.
function blokken(lijst) {
  if (!Array.isArray(lijst) || lijst.length > 8) return null;
  const uit = [];
  for (const b of lijst) {
    if (!Array.isArray(b) || b.length !== 2 || !TIJD.test(b[0]) || !TIJD.test(b[1]) || minuten(b[0]) >= minuten(b[1])) return null;
    uit.push([b[0], b[1]]);
  }
  uit.sort((a, b) => minuten(a[0]) - minuten(b[0]));
  for (let i = 1; i < uit.length; i++) if (minuten(uit[i][0]) < minuten(uit[i - 1][1])) return null;
  return uit;
}

// Antwoord van het OS controleren en omzetten. Alles wat niet klopt geeft null: dan geldt de vorige of de standaard.
export function leesBeschikbaarheid(j) {
  if (!j || typeof j !== "object" || j.ok !== true || j.versie !== 1) return null;
  if (j.tijdzone !== undefined && j.tijdzone !== "Europe/Amsterdam") return null;
  if (!j.week || typeof j.week !== "object") return null;
  const week = {};
  for (const [nr, dag] of Object.entries(DAGEN)) {
    const b = blokken(j.week[nr] ?? []);
    if (!b) return null;
    week[dag] = b;
  }
  const datums = {};
  const ruweDatums = j.datums ?? {};
  if (typeof ruweDatums !== "object" || Array.isArray(ruweDatums) || Object.keys(ruweDatums).length > MAX) return null;
  for (const [d, lijst] of Object.entries(ruweDatums)) {
    const b = blokken(lijst);
    if (!DATUM.test(d) || !b) return null;
    datums[d] = b;
  }
  const vrijeDagen = new Set();
  const dicht = [];
  const vrij = j.vrij ?? [];
  if (!Array.isArray(vrij) || vrij.length > MAX) return null;
  for (const p of vrij) {
    const van = String(p?.van ?? ""), tot = String(p?.tot ?? "");
    if (DATUM.test(van) && DATUM.test(tot)) {
      if (tot < van) return null;
      for (let d = van, n = 0; d <= tot; d = plusDagen(d, 1), n++) {
        if (n > MAX) return null;
        vrijeDagen.add(d);
      }
    } else {
      const start = Date.parse(van), eind = Date.parse(tot);
      if (!/[+-]\d\d:\d\d$|Z$/.test(van) || !/[+-]\d\d:\d\d$|Z$/.test(tot) || !(start < eind)) return null;
      dicht.push({ start, eind });
    }
  }
  return { week, datums, vrijeDagen: [...vrijeDagen], dicht, bron: j.bron === "standaard" ? "standaard" : "opgeslagen", bijgewerkt: j.bijgewerkt || null };
}

// De config met Marinus' blokken erin. Zolang hij niets heeft opgeslagen blijven de feestdagen uit config.mjs gelden.
export function pasToe(config, b) {
  if (!b) return config;
  return {
    ...config,
    werktijden: b.week,
    datums: b.datums,
    vrijeDagen: b.bron === "standaard" ? [...(config.vrijeDagen || []), ...b.vrijeDagen] : b.vrijeDagen,
    dicht: b.dicht,
  };
}

// Haalt de beschikbaarheid op, hooguit eens per 30 s. Bij een fout, time-out of rare JSON: de laatst goede
// versie, en zonder goede versie null (dan geldt config.mjs).
export function beschikbaarheidsBron({ url, sleutel, fetchImpl = fetch, nu = Date.now, cacheMs = 30_000, tijdslimiet = 3_000 }) {
  let goed = null;
  let opgehaald = -Infinity;
  return async function haal() {
    if (!url || !sleutel) return null;
    if (nu() - opgehaald < cacheMs) return goed;
    opgehaald = nu();
    try {
      const r = await fetchImpl(url, { headers: { authorization: `Bearer ${sleutel}`, accept: "application/json" }, signal: AbortSignal.timeout(tijdslimiet) });
      if (r.ok) {
        const b = leesBeschikbaarheid(await r.json());
        if (b) goed = b;
      }
    } catch {}
    return goed;
  };
}
