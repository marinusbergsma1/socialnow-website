// Welke begintijden bieden we aan? Alles volgt uit config.mjs plus de bezette tijden uit de agenda.
import { datumInZone, plusDagen, weekdag, minutenVan, tijdVan, zoneNaarUtc } from "./tijd.mjs";

const DAGEN = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const MINUUT = 60_000;

export function overlapt(aStart, aEind, bStart, bEind) {
  return aStart < bEind && bStart < aEind;
}

// Bezet-lijsten uit Google (ISO-tekst) of de nep-agenda (getallen) naar milliseconden.
export function normaliseer(bezet = []) {
  const ms = (w) => (typeof w === "number" ? w : Date.parse(w));
  return bezet
    .map((b) => ({ start: ms(b.start), eind: ms(b.eind ?? b.end) }))
    .filter((b) => Number.isFinite(b.start) && Number.isFinite(b.eind) && b.eind > b.start);
}

// Haalt één interval uit een bezet-lijst (bij verzetten telt de eigen afspraak niet als bezet).
export function trekAf(bezet, weg) {
  const uit = [];
  for (const b of normaliseer(bezet)) {
    if (!overlapt(b.start, b.eind, weg.start, weg.eind)) { uit.push(b); continue; }
    if (b.start < weg.start) uit.push({ start: b.start, eind: weg.start });
    if (b.eind > weg.eind) uit.push({ start: weg.eind, eind: b.eind });
  }
  return uit;
}

export function isVrij(start, eind, bezet, bufferMinuten) {
  const buf = bufferMinuten * MINUUT;
  return !normaliseer(bezet).some((b) => overlapt(start - buf, eind + buf, b.start, b.eind));
}

// Alle begintijden volgens het rooster, nog zonder naar de agenda te kijken.
export function kandidaten(config, soortId, nu = new Date()) {
  const soort = config.soorten?.[soortId];
  if (!soort) return [];
  const tz = config.tijdzone;
  const duur = soort.minuten;
  const stap = config.stapMinuten || 30;
  const vroegst = +nu + config.minimaleVooruitboektijdUren * 60 * MINUUT;
  const vandaag = datumInZone(nu, tz);
  const vrij = new Set(config.vrijeDagen || []);
  const uit = [];
  for (let i = 0; i <= config.maximaleDagenVooruit; i++) {
    const datum = plusDagen(vandaag, i);
    if (vrij.has(datum)) continue;
    for (const [van, tot] of config.werktijden[DAGEN[weekdag(datum)]] || []) {
      for (let m = minutenVan(van); m + duur <= minutenVan(tot); m += stap) {
        const start = zoneNaarUtc(datum, tijdVan(m), tz);
        if (+start >= vroegst) uit.push(+start);
      }
    }
  }
  return uit;
}

// Vrije begintijden als ISO-tekst (UTC), oplopend.
export function berekenSlots({ config, soortId, nu = new Date(), bezet = [] }) {
  const soort = config.soorten?.[soortId];
  if (!soort) return [];
  const duur = soort.minuten * MINUUT;
  const lijst = normaliseer(bezet);
  return kandidaten(config, soortId, nu)
    .filter((s) => isVrij(s, s + duur, lijst, config.bufferMinuten))
    .map((s) => new Date(s).toISOString());
}

// Het venster waarvoor de pagina vrij/bezet moet ophalen.
export function venster(config, nu = new Date()) {
  return { van: new Date(+nu), tot: new Date(+nu + (config.maximaleDagenVooruit + 2) * 24 * 60 * MINUUT) };
}
