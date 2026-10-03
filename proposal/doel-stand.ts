// 3 oktober 2026 (Marinus): doelmeter met einddoel €1.000.000, geld voor scholen bouwen in ontwikkelingslanden en mensen
// verbinden. Dit bestand is de enige bron voor de stand op de site. Geen nepstand: zolang een waarde null is, toont de
// meter "Stand volgt" en verschijnt de sectie niet in de productiebuild (zie proposal/Doel.tsx en scripts/proef-doel.mjs).
// live gaat pas op true na akkoord van Marinus, ook als alle waarden zijn ingevuld.
// Bijwerken: zet de echte waarden hieronder en de datum van de stand, en laat Marinus ze bevestigen.
export const DOEL = {
  live: false,
  einddoel: 1000000,
  // Opgehaald bedrag in euro, de echte stand. null = nog niet bevestigd door Marinus.
  opgehaald: null as number | null,
  // Aantal mensen dat meedoet (werkgevers en werkzoekenden). null = nog niet bevestigd.
  deelnemers: null as number | null,
  // Datum van de stand als "jjjj-mm-dd", bv. "2026-10-03".
  bijgewerkt: null as string | null,
  // Waar het geld heen gaat (stichting, ANBI of deel van de omzet), één Nederlandse zin; ook in proposal/i18n en, de en fr.
  bestemming: null as string | null,
};

export const doelBevestigd = DOEL.opgehaald !== null && DOEL.deelnemers !== null && DOEL.bijgewerkt !== null && DOEL.bestemming !== null;
