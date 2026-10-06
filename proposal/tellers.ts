import { useEffect, useState } from "react";

// Stand vanaf 26 september 2026, 08:21 in Nederland. Het vaste startmoment houdt de
// tellers gelijk voor alle bezoekers en laat ze na een herlaadbeurt doorlopen.
const START = Date.parse("2026-09-26T06:21:00Z");
const WEBSITES_START = 10;
const OS_START = 400;

function osNa(ms: number) {
  // Elke stap duurt 60 tot 120 seconden; de duur volgt uit het stapnummer.
  let n = 0;
  let t = 0;
  while (true) {
    const stap = 60000 + (((n * 2654435761) >>> 0) % 60000);
    if (t + stap > ms) return n;
    t += stap;
    n++;
  }
}

function stand() {
  const ms = Math.max(0, Date.now() - START);
  return { websites: WEBSITES_START + Math.floor(ms / (2 * 60 * 60 * 1000)), os: OS_START + osNa(ms) };
}

export function useTellers() {
  const [tellers, setTellers] = useState(stand);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const klok = window.setInterval(() => {
      const nu = stand();
      setTellers((oud) => (oud.websites === nu.websites && oud.os === nu.os ? oud : nu));
    }, 1000);
    return () => window.clearInterval(klok);
  }, []);
  return tellers;
}

// 5 oktober 2026 (Marinus): "aanmeldingen creators 356 en elke dag komen er ongeveer 12 bij en live os gebruikers 1125 met
// elke dag er 215 bij." Stand op 5 oktober 2026, 00:00 in Nederland. Elke stap duurt tussen de halve en anderhalve
// gemiddelde stap (volgt uit het stapnummer), zodat de tellers onregelmatig tikken maar per dag op het juiste aantal uitkomen.
const WERELD_START = Date.parse("2026-10-04T22:00:00Z");
const DAG = 24 * 60 * 60 * 1000;
export const CREATORS_START = 356;
export const CREATORS_PER_DAG = 12;
export const OS_GEBRUIKERS_START = 1125;
export const OS_GEBRUIKERS_PER_DAG = 215;

function stappenNa(ms: number, perDag: number, zout: number) {
  const gemiddeld = DAG / perDag;
  const heleDagen = Math.floor(ms / DAG);
  let n = heleDagen * perDag;
  let t = heleDagen * DAG;
  while (true) {
    const stap = gemiddeld * (0.5 + (((n * 2654435761 + zout) >>> 0) % 1000) / 1000);
    if (t + stap > ms) return Math.min(n, (heleDagen + 1) * perDag);
    t += stap;
    n++;
  }
}

function wereldStand() {
  const ms = Math.max(0, Date.now() - WERELD_START);
  return {
    creators: CREATORS_START + stappenNa(ms, CREATORS_PER_DAG, 7),
    osGebruikers: OS_GEBRUIKERS_START + stappenNa(ms, OS_GEBRUIKERS_PER_DAG, 13),
  };
}

export function useWereldTellers() {
  // De prerender en de eerste browserweergave moeten gelijk zijn. Een berekening met Date.now()
  // in de initializer wijkt na de build af en breekt hydratatie. Werk pas na het monteren bij.
  const [stand, setStand] = useState({ creators: CREATORS_START, osGebruikers: OS_GEBRUIKERS_START });
  useEffect(() => {
    if (typeof window === "undefined") return;
    setStand(wereldStand());
    const klok = window.setInterval(() => {
      const nu = wereldStand();
      setStand((oud) => (oud.creators === nu.creators && oud.osGebruikers === nu.osGebruikers ? oud : nu));
    }, 1000);
    return () => window.clearInterval(klok);
  }, []);
  return stand;
}
