import React from "react";
import { BOVEN, RASTER, STAP } from "./wereld-raster";
import { StipScene } from "./StipScene";
import { minderBeweging, type Kleur, type Veld } from "./stippen";

// Het stippenvlak van de wereldkaart (WereldKaart.tsx laadt dit lui, met het landraster en de stippenmotor erbij: de kaart
// staat onder de vouw en hoort niet in het eerste script).
// 5 oktober 2026 (Marinus): "Let's keep the world. En dan Live Creators die zijn groen en business owners blauwe stipjes."
// Elke creator is een groene stip, elke OS-gebruiker (business owner) een blauwe. Het aantal stippen loopt mee met de
// tellers in tellers.ts. De plek van een stip is een spreiding over de markten hieronder, geen echte locatie van iemand.
const OS_MARKTEN: [lon: number, lat: number, gewicht: number, spreiding: number][] = [
  [4.5, 50.8, 16, 2.5], [2.2, 46.6, 10, 3.5], [-3.7, 40.2, 8, 3.5], [10, 51, 6, 3], [12.5, 42.8, 4, 2.5], [-1.5, 52.5, 3, 2.5],
  [77, 22, 18, 6], [-95, 38, 8, 11], [-101, 22, 6, 4.5], [-48, -15, 3, 6], [50, 24, 4, 4], [-7, 32, 2, 2.5], [145, -33, 1, 4],
];
const CREATOR_MARKTEN: [lon: number, lat: number, gewicht: number, spreiding: number][] = [
  [5, 52.2, 20, 2], [4.5, 50.8, 6, 2], [10, 51, 5, 3.5], [2.2, 46.6, 5, 3.5], [-3.7, 40.2, 4, 3.5], [-1.5, 52.5, 5, 2.5],
  [-80, 38, 5, 9], [77, 20, 4, 6], [-48, -15, 3, 6], [145, -33, 2, 4],
];

const kolom = (lon: number) => (lon + 180) / STAP - 0.5;
const rij = (lat: number) => (BOVEN - lat) / STAP;
const BREED = RASTER[0].length;
const HOOG = RASTER.length;

const isLand = (x: number, y: number) => RASTER[Math.round(y)]?.[Math.round(x)] === "1";

// Vaste, herhaalbare spreiding: stip n staat altijd op dezelfde plek, ook in de prerender en na een herlaadbeurt.
// Geeft [lengtegraad, breedtegraad] terug.
function spreiding(markten: [number, number, number, number][], aantal: number, zaadStart: number) {
  let zaad = zaadStart;
  const toeval = () => ((zaad = (zaad * 1664525 + 1013904223) >>> 0) / 4294967296);
  const normaal = () => Math.sqrt(-2 * Math.log(toeval() || 1e-9)) * Math.cos(2 * Math.PI * toeval());
  const totaal = markten.reduce((som, markt) => som + markt[2], 0);
  const punten: [number, number][] = [];
  for (let poging = 0; punten.length < aantal && poging < aantal * 60; poging++) {
    let keuze = toeval() * totaal;
    const markt = markten.find((m) => (keuze -= m[2]) < 0) ?? markten[0];
    const lon = markt[0] + normaal() * markt[3];
    const lat = markt[1] + normaal() * markt[3] * 0.7;
    if (isLand(kolom(lon), rij(lat))) punten.push([lon, lat]);
  }
  return punten;
}
const MAX_STIPPEN = 6000;

// 11 oktober 2026 (stippenproject): de kaart staat in hetzelfde raster als de rest van de site. Geen eigen SVG-stippen meer,
// maar een onderverdeling van 8 px van het sitegrid van 32 px: elke vierde stip valt precies op een stip van het grote raster
// (16 + 32k in documentcoördinaten). Het canvas wordt daarvoor op de pixel uitgelijnd met het document. Land is een vaste,
// zachte belichting; creators groen, OS-gebruikers blauw (helderder naarmate er meer in die cel vallen); de plekken groen.
// De pulsringen zijn kleurgolven door de stippen geworden (geel, blauw, roze, groen); hover op een plek = golf vanaf die plek.
const STIP = 8;
const GOLFKLEUREN: Kleur[] = ["geel", "blauw", "roze", "groen"];
type Kaart = { kol: number; rij: number; land: [number, number][]; isLand: Set<number> };
const sleutel = (i: number, j: number) => j * 4096 + i;
const mod32 = (n: number) => ((Math.round(n) % 32) + 32) % 32;

// Een cel is land als minstens 3 van de 9 meetpunten erin op land vallen (fijner dan het Natural Earth-raster mag niet).
function maakKaart(kol: number, rij: number): Kaart {
  const land: [number, number][] = [], isLandCel = new Set<number>();
  for (let j = 0; j < rij; j++) for (let i = 0; i < kol; i++) {
    let raak = 0;
    for (const sy of [1 / 6, 3 / 6, 5 / 6]) for (const sx of [1 / 6, 3 / 6, 5 / 6]) {
      if (RASTER[Math.floor(((j + sy) / rij) * HOOG)]?.[Math.floor(((i + sx) / kol) * BREED)] === "1") raak++;
    }
    if (raak >= 3) { land.push([i, j]); isLandCel.add(sleutel(i, j)); }
  }
  return { kol, rij, land, isLand: isLandCel };
}
const celVan = (k: Kaart, lon: number, lat: number): [number, number] => [
  Math.min(k.kol - 1, Math.max(0, Math.floor((((lon + 180) / STAP) / BREED) * k.kol))),
  Math.min(k.rij - 1, Math.max(0, Math.floor((((BOVEN - lat) / STAP) / HOOG) * k.rij))),
];

export type Plek = { naam: string; wat: string; lon: number; lat: number; thuis?: boolean };
export type Bediening = { golfVan?: (naam: string) => void };

export default function WereldDoek({ creators, osGebruikers, plekken: PLEKKEN, figuur, bediening }: {
  creators: number; osGebruikers: number; plekken: Plek[];
  figuur: React.RefObject<HTMLElement | null>; bediening: React.MutableRefObject<Bediening>;
}) {
  const alleCreators = React.useMemo(() => spreiding(CREATOR_MARKTEN, MAX_STIPPEN, 356), []);
  const alleOs = React.useMemo(() => spreiding(OS_MARKTEN, MAX_STIPPEN, 1125), []);
  const vak = React.useRef<HTMLDivElement>(null);
  const veld = React.useRef<Veld | null>(null), kaart = React.useRef<Kaart | null>(null);
  const stand = React.useRef({ creators, osGebruikers }); stand.current = { creators, osGebruikers };
  const zichtbaar = React.useRef(false), laatsteGolf = React.useRef(new Map<string, number>());

  // Alle vaste belichting opnieuw: land, gebruikers, plekken.
  const belicht = React.useCallback(() => {
    const v = veld.current, k = kaart.current; if (!v || !k) return;
    v.wis();
    for (const [i, j] of k.land) v.zet(i, j, "wit", 0.04);
    const tel = (punten: [number, number][], n: number) => {
      const m = new Map<number, number>();
      for (const [lon, lat] of punten.slice(0, n)) {
        const [i, j] = celVan(k, lon, lat), c = sleutel(i, j);
        if (k.isLand.has(c)) m.set(c, (m.get(c) || 0) + 1);
      }
      return m;
    };
    const os = tel(alleOs, stand.current.osGebruikers), cr = tel(alleCreators, stand.current.creators);
    for (const [c, n] of os) if (!cr.has(c)) v.zet(c % 4096, Math.floor(c / 4096), "blauw", Math.min(0.95, 0.45 + 0.1 * n));
    for (const [c, n] of cr) v.zet(c % 4096, Math.floor(c / 4096), "groen", Math.min(0.95, 0.55 + 0.1 * n));
    for (const plek of PLEKKEN) {
      const [i, j] = celVan(k, plek.lon, plek.lat);
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) v.zet(i + di, j + dj, "groen", 0.35);
      v.zet(i, j, plek.thuis ? "wit" : "groen", 1);
    }
  }, [alleOs, alleCreators]);

  const plekPunt = (naam: string): [number, number] | null => {
    const v = veld.current, k = kaart.current, plek = PLEKKEN.find((p) => p.naam === naam);
    return v && k && plek ? v.pos(...celVan(k, plek.lon, plek.lat)) : null;
  };
  // Hover op een plek (op de kaart of in de lijst): geel, blauw, roze, groen vanaf die plek.
  const golfVan = (naam: string) => {
    const nu = performance.now(); if (nu - (laatsteGolf.current.get(naam) || 0) < 1800) return;
    const punt = plekPunt(naam); if (!punt || !veld.current) return;
    laatsteGolf.current.set(naam, nu);
    GOLFKLEUREN.forEach((kleur, n) => veld.current!.golf(punt[0], punt[1], kleur, { straal: 420, duur: 1.9, breed: 40, sterkte: 0.9, wacht: n * 0.22 }));
  };

  // Uitlijnen op het sitegrid: het vak met het canvas schuift 0–7 px zodat zijn stippen op 16 + 8k in het document vallen.
  React.useLayoutEffect(() => {
    const fig = figuur.current, el = vak.current; if (!fig || !el) return;
    const lijn = () => {
      const r = fig.getBoundingClientRect();
      const mod = (n: number) => ((n % STIP) + STIP) % STIP;
      const dx = mod(STIP / 2 - (r.left + scrollX)), dy = mod(STIP / 2 - (r.top + scrollY));
      const kol = Math.max(1, Math.floor((r.width - dx) / STIP)), rij = Math.max(1, Math.floor((r.height - dy) / STIP));
      Object.assign(el.style, { left: `${dx}px`, top: `${dy}px`, width: `${kol * STIP}px`, height: `${rij * STIP}px` });
      const nieuw = kaart.current?.kol !== kol || kaart.current?.rij !== rij;
      if (nieuw) { kaart.current = maakKaart(kol, rij); belicht(); }
      // Masker: golven lopen alleen door land en, op zee, door de stippen van het grote raster (16 + 32k). Zo verschijnt de
      // fijne onderverdeling nooit op zee. Eén maskerpixel per cel; het masker rekt mee met het vak.
      const fase = [mod32(r.left + scrollX + dx + STIP / 2), mod32(r.top + scrollY + dy + STIP / 2)].join();
      if (nieuw || el.dataset.fase !== fase) {
        el.dataset.fase = fase;
        const k = kaart.current!, m = document.createElement("canvas"); m.width = kol; m.height = rij;
        const ctx = m.getContext("2d")!, beeld = ctx.createImageData(kol, rij);
        const [fx, fy] = fase.split(",").map(Number);
        for (let j = 0; j < rij; j++) for (let i = 0; i < kol; i++) {
          const groot = mod32(fx + i * STIP) === 16 && mod32(fy + j * STIP) === 16;
          if (groot || k.isLand.has(sleutel(i, j))) beeld.data[(j * kol + i) * 4 + 3] = 255;
        }
        ctx.putImageData(beeld, 0, 0);
        const url = `url(${m.toDataURL()})`;
        el.style.setProperty("mask-image", url); el.style.setProperty("-webkit-mask-image", url);
      }
    };
    lijn();
    const ro = new ResizeObserver(lijn); ro.observe(fig); ro.observe(document.body);
    addEventListener("resize", lijn);
    return () => { ro.disconnect(); removeEventListener("resize", lijn); };
  }, [belicht]);

  // Tellers lopen op: belichting bijwerken.
  React.useEffect(() => { belicht(); }, [creators, osGebruikers, belicht]);

  // Rustige golven vanaf de plekken (waren de pulsringen): één per 3,2 s, alleen als de kaart in beeld is.
  React.useEffect(() => {
    const fig = figuur.current; if (!fig || minderBeweging()) return;
    const io = new IntersectionObserver(([e]) => { zichtbaar.current = e.isIntersecting; });
    io.observe(fig);
    let n = 0;
    const klok = window.setInterval(() => {
      const v = veld.current; if (!v || !zichtbaar.current || document.hidden) return;
      const plek = PLEKKEN[n % PLEKKEN.length], punt = plekPunt(plek.naam);
      if (punt) v.golf(punt[0], punt[1], GOLFKLEUREN[n % GOLFKLEUREN.length], { straal: 150, duur: 1.6, breed: 48, sterkte: 0.85 });
      n++;
    }, 3200);
    return () => { io.disconnect(); window.clearInterval(klok); };
  }, []);

  // Binnenkomst: het land vult zich, dan de gebruikers en een kleurgolf vanaf Amsterdam.
  const speel = React.useCallback(async (v: Veld) => {
    veld.current = v;
    const k = kaart.current; if (!k) return;
    await v.vul(k.land, "wit", { a: 0.04, duur: 1 });
    belicht();
    const punt = plekPunt("Amsterdam");
    if (punt) GOLFKLEUREN.forEach((kleur, n) => v.golf(punt[0], punt[1], kleur, { straal: 520, duur: 2.2, breed: 44, wacht: n * 0.3 }));
  }, [belicht]);

  bediening.current.golfVan = golfVan;
  const opKaart = (e: PointerEvent) => {
    if (e.pointerType === "touch" || !vak.current) return;
    const r = vak.current.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    for (const plek of PLEKKEN) {
      const punt = plekPunt(plek.naam);
      if (punt && Math.hypot(punt[0] - x, punt[1] - y) < 28) golfVan(plek.naam);
    }
  };

  React.useEffect(() => {
    const fig = figuur.current; if (!fig) return;
    fig.addEventListener("pointermove", opKaart);
    return () => fig.removeEventListener("pointermove", opKaart);
  });

  return (
    <div ref={vak} className="sn-wereld-vak">
      <StipScene speel={speel} stap={STIP} className="sn-wereld-doek" label="Wereldkaart met de plekken waar SocialNow actief is" />
    </div>
  );
}
