import { useEffect, useSyncExternalStore } from "react";
import { LANGUAGES, type Language } from "./i18n/context";

// 24 september 2026 (Marinus): de kop op de homepage wisselt elke 5 seconden van taal, en het
// vlaggetje in de balk wisselt mee. De echte taal van de pagina blijft staan; dit is alleen beeld.
// Opent iemand het taalmenu, dan stopt het wisselen voor de rest van het bezoek.
// Volgorde (Marinus): Engels, een andere taal, terug naar Engels, de volgende taal, enzovoort.
// 26 september 2026 (Marinus): alleen Nederlands, Engels, Duits en Frans in de wissel. Italiaans en
// Spaans blijven gewoon te kiezen in het taalmenu.
const WISSEL: Language[] = ["nl", "de", "fr"];
const VOLGORDE: Language[] = LANGUAGES.filter((t) => WISSEL.includes(t)).flatMap((t) => ["en", t] as Language[]);
let toon: Language | null = null;
let gestopt = false;
const luisteraars = new Set<() => void>();
const zet = (taal: Language | null) => { toon = taal; luisteraars.forEach((f) => f()); };

export function useToonTaal(): Language | null {
  return useSyncExternalStore(
    (f) => { luisteraars.add(f); return () => { luisteraars.delete(f); }; },
    () => toon,
    () => null,
  );
}

export function stopTaalwissel() { gestopt = true; zet(null); }

export function useTaalwissel(taal: Language, ms = 5000): Language {
  const getoond = useToonTaal();
  useEffect(() => {
    if (gestopt || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    zet(VOLGORDE[0]);
    const id = window.setInterval(() => {
      if (gestopt || document.hidden) return;
      i = (i + 1) % VOLGORDE.length;
      zet(VOLGORDE[i]);
    }, ms);
    return () => { window.clearInterval(id); zet(null); };
  }, [taal, ms]);
  return getoond ?? taal;
}
