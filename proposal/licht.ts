import React from "react";

// 30 september 2026 (Marinus): "site VEEL SNELLER, WIL ECHT INSTANT LOADING". Beelden in de maat waarin ze getoond
// worden en films die pas laden als ze nodig zijn. De kleine bestanden maakt scripts/media-licht.py; de proef is
// scripts/proef-media-licht.mjs.

// Een foto uit public/images in de kleine varianten uit public/images/klein (96 en 160 px voor gezichten). Ontbreekt
// een variant, bijvoorbeeld bij een nieuw teamlid voordat het script gedraaid heeft, dan valt het beeld terug op het origineel.
export function klein(bestand: string, sizes: number | string, maten: number[] = [96, 160], origineelBreed?: number) {
  const naam = bestand.replace(/^\/?images\//, "");
  const stam = naam.replace(/\.[a-z]+$/i, "");
  const origineel = `/images/${naam}`;
  const kandidaten = maten.map((m) => `/images/klein/${stam}-${m}.webp ${m}w`);
  if (origineelBreed) kandidaten.push(`${origineel} ${origineelBreed}w`);
  return {
    src: `/images/klein/${stam}-${maten[0]}.webp`,
    srcSet: kandidaten.join(", "),
    sizes: typeof sizes === "number" ? `${sizes}px` : sizes,
    onError: (event: React.SyntheticEvent<HTMLImageElement>) => {
      const beeld = event.currentTarget;
      if (beeld.dataset.origineel) return;
      beeld.dataset.origineel = "1";
      beeld.removeAttribute("srcset");
      beeld.src = origineel;
    },
  };
}

// Hero-films starten pas als het eerste beeld (de poster) binnen is: tot dan krijgt de poster alle bandbreedte.
// Na uiterlijk zes seconden start de film toch, voor het geval de poster niet laadt.
export function useNaBeeld(url: string, uiterlijk = 6000) {
  const [klaar, setKlaar] = React.useState(false);
  React.useEffect(() => {
    let weg = false;
    const zet = () => requestAnimationFrame(() => requestAnimationFrame(() => { if (!weg) setKlaar(true); }));
    const binnen = (lijst: PerformanceEntryList) => lijst.some((ingang) => ingang.name.endsWith(url));
    if (typeof performance !== "undefined" && binnen(performance.getEntriesByType("resource"))) { zet(); return () => { weg = true; }; }
    let kijker: PerformanceObserver | undefined;
    try {
      kijker = new PerformanceObserver((lijst) => { if (binnen(lijst.getEntries())) zet(); });
      kijker.observe({ type: "resource", buffered: true });
    } catch { /* zonder PerformanceObserver start de klok hieronder de film */ }
    const klok = window.setTimeout(zet, uiterlijk);
    return () => { weg = true; kijker?.disconnect(); window.clearTimeout(klok); };
  }, [url, uiterlijk]);
  return klaar;
}

// Waar voor een film onder de vouw: true zodra het element binnen `marge` van het scherm komt, en dan blijvend.
export function useDichtbij<T extends Element>(marge = "600px") {
  const ref = React.useRef<T>(null);
  const [dichtbij, setDichtbij] = React.useState(false);
  React.useEffect(() => {
    const element = ref.current;
    if (!element || dichtbij) return;
    if (typeof IntersectionObserver === "undefined") { setDichtbij(true); return; }
    const kijker = new IntersectionObserver(([ingang]) => {
      if (ingang.isIntersecting) { setDichtbij(true); kijker.disconnect(); }
    }, { rootMargin: `${marge} 0px` });
    kijker.observe(element);
    return () => kijker.disconnect();
  }, [marge, dichtbij]);
  return { ref, dichtbij };
}
