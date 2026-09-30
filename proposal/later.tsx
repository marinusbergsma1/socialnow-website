import React, { Suspense, createElement, startTransition, use, useContext, useEffect, useState, type ComponentProps, type ComponentType } from "react";
import { LanguageContext, laadWoordenboek, woordenboekBinnen, type Language } from "./i18n/context";

// 30 september 2026 (Marinus: "site VEEL SNELLER, WIL ECHT INSTANT LOADING"). Het eerste script draagt alleen de
// header en de hero. Secties onder de vouw en de andere pagina's laden later, elk als eigen bestand, en altijd samen
// met de rest van het woordenboek van de paginataal (scripts/woordenboek-split.mjs), zodat er nooit een
// onvertaalde zin verschijnt. De opmaak laadt niet later: die blijft in het ene css-bestand (zie pages.tsx).

// Gebruik: const Sectie = later(() => import("./Sectie").then((m) => m.default)).
// Renderen in Node (controles, prerender): eerst `await allesVooraf()`, dan rendert alles in één keer.
const laders: Array<() => Promise<void>> = [];
export function later<T extends ComponentType<any>>(laad: () => Promise<T>) {
  let onderdeel: T | undefined;
  let klaar: Promise<void> | undefined;
  const start = () => (klaar ??= Promise.all([laad(), laadWoordenboek()]).then(
    ([geladen]) => { onderdeel = geladen; },
    (fout) => nieuweVersie(fout).catch((blijft) => { console.error(blijft); onderdeel = Niets as unknown as T; }),
  ));
  // Per taal: het onderdeel én de rest van dat woordenboek. Wisselt de taal na de landherkenning, dan wacht een al
  // geladen onderdeel op de rest van de nieuwe taal. In Node staan de woordenboeken al helemaal klaar.
  const wachten = new Map<Language, Promise<void>>();
  const wacht = (taal: Language) => {
    let w = wachten.get(taal);
    if (!w) { w = Promise.all([start(), laadWoordenboek(taal)]).then(() => undefined); wachten.set(taal, w); }
    return w;
  };
  laders.push(start);
  return function Later(props: ComponentProps<T>) {
    const taal = useContext(LanguageContext);
    if (!onderdeel || (!import.meta.env.SSR && !woordenboekBinnen(taal))) use(wacht(taal));
    return createElement(onderdeel as T, props);
  };
}
export function allesVooraf(): Promise<void> {
  return Promise.all(laders.map((start) => start())).then(() => undefined);
}
function Niets() { return null; }

// Na een publicatie bestaan de bestanden van de vorige versie niet meer. Wie de pagina nog open had, krijgt bij de
// eerste latere sectie één keer de nieuwe versie; lukt het daarna nog niet, dan blijft alleen dat stuk leeg.
function nieuweVersie(fout: unknown): Promise<void> {
  if (import.meta.env.SSR) return Promise.reject(fout);
  try {
    const vorige = Number(sessionStorage.getItem("sn-herladen") || 0);
    if (Date.now() - vorige > 60_000) {
      sessionStorage.setItem("sn-herladen", String(Date.now()));
      window.location.reload();
      return new Promise(() => {});
    }
  } catch { /* geen opslag: niet herladen, anders kan het blijven herhalen */ }
  return Promise.reject(fout);
}

// Onder de vouw: laat de hero eerst tekenen en begin daarna, zodra de browser even vrij is. Met een #anker in de
// adresbalk of bij de eerste scroll begint het meteen. Tot die tijd houdt een lege ruimte de voettekst uit beeld
// (ruimte={false} voor de voettekst zelf). In Node rendert alles meteen, en een voorgerenderde pagina (scripts/prerender.mjs)
// heeft alles al als HTML: dan tekent de browser dezelfde boom, zodat React die HTML kan hydrateren zodra het deel binnen is.
let alBegonnen = import.meta.env.SSR || (typeof document !== "undefined" && document.getElementById("root")?.dataset.prerender !== undefined);
export function OnderDeVouw({ children, ruimte = true }: { children: React.ReactNode; ruimte?: boolean }) {
  const [begin, zetBegin] = useState(() => alBegonnen || window.location.hash.length > 1);
  useEffect(() => {
    if (begin) { alBegonnen = true; return; }
    const start = () => startTransition(() => zetBegin(true));
    const venster = window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const idle = venster.requestIdleCallback ? venster.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 200);
    window.addEventListener("scroll", start, { once: true, passive: true });
    return () => {
      if (venster.cancelIdleCallback) venster.cancelIdleCallback(idle); else window.clearTimeout(idle);
      window.removeEventListener("scroll", start);
    };
  }, [begin]);
  const leeg = ruimte ? <div aria-hidden="true" style={{ minHeight: "100vh" }} /> : null;
  if (!begin) return leeg;
  return <Suspense fallback={leeg}>{children}{ruimte && <NaarAnker />}</Suspense>;
}

// De shell scrolt al naar een #anker, maar een anker onder de vouw bestaat dan nog niet.
function NaarAnker() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, []);
  return null;
}
