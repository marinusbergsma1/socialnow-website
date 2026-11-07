// Gedeeld door de pagina en de proeven: zet UTC-slots om naar dagen en tijden in de zone van de bezoeker.
const cache = new Map();

function fmt(tz, opties) {
  const sleutel = tz + JSON.stringify(opties);
  if (!cache.has(sleutel)) cache.set(sleutel, new Intl.DateTimeFormat("en-GB", { timeZone: tz, ...opties }));
  return cache.get(sleutel);
}

function delen(iso, tz) {
  const p = {};
  const opties = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" };
  for (const { type, value } of fmt(tz, opties).formatToParts(new Date(iso))) p[type] = value;
  return { datum: `${p.year}-${p.month}-${p.day}`, tijd: `${p.hour}:${p.minute}` };
}

// [{ datum: "2026-10-26", tijden: [{ iso, tijd: "09:00" }] }] in de volgorde van de slots.
export function groepeerPerDag(slots, tz) {
  const dagen = new Map();
  for (const iso of slots) {
    const { datum, tijd } = delen(iso, tz);
    if (!dagen.has(datum)) dagen.set(datum, { datum, tijden: [] });
    dagen.get(datum).tijden.push({ iso, tijd });
  }
  return [...dagen.values()];
}

export function tijdIn(iso, tz) {
  return delen(iso, tz).tijd;
}

// Datumlabel voor een dag ("2026-10-26") in de taal van de pagina.
export function dagLabel(datum, taal, opties = { weekday: "short", day: "numeric", month: "short" }) {
  const [j, m, d] = datum.split("-").map(Number);
  return new Intl.DateTimeFormat(taal === "nl" ? "nl-NL" : "en-GB", { timeZone: "UTC", ...opties }).format(new Date(Date.UTC(j, m - 1, d, 12)));
}

export function eigenZone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Amsterdam"; } catch { return "Europe/Amsterdam"; }
}

export function geldigeZone(tz) {
  try { new Intl.DateTimeFormat("en-GB", { timeZone: tz }); return true; } catch { return false; }
}
