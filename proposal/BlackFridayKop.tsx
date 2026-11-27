import React, { useEffect, useRef, useState } from "react";

// 27 november 2026 (Marinus): "Dit mogen ook nog wel even wat meer gekke teksten zijn zoals de video ... KAPITALS ... ÉN REBRANDING
// EN AD CREATIVES!" Kop in kapitalen en zwaar.
// Daarna (Marinus): "Doe maar 1 pijltje die elke keer een ander stuk tekst selecteerd. Deze." (de I-beam-tekstcursor), en: "Deze niet
// zo groot en iets rustiger selecteren en het selecteren in meerdere kleuren en infaden zoals de teksten bij het ELT project." en
// "na selecteren moet ie weer terug veranderen in een muis." Dus: één kleine cursor. Onderweg een muispijl; bij het woord wordt het
// een I-beam die van begin naar eind sleept, terwijl de selectie meegroeit in een van de logokleuren; daarna weer een pijl.
// De woorden faden in met blur, zoals de koppen op de ELT-site (blur-kop .bw). Bij reduced motion: alleen de tekst.
// 27 nov (Marinus): "Het selecteren van de woorden mag nog iets sneller gaan."
const BEWEEG = 700, OMSLAG = 160, SLEEP = 750, RUST = 1900;
const KLEUREN = ["#25d366", "#00a3e0", "#e5397a", "#f59e0b"];   // groen, en blauw, roze en oranje uit het SocialNow-logo

function Pijl() {
  return <svg className="gw2-pijl" width="16" height="22" viewBox="0 0 16 22" aria-hidden="true">
    <path d="M1.5 1.5v16.2l4.3-4.1 2.9 6.6 2.6-1.1-2.9-6.5h6z" fill="#fff" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>;
}
function IBeam() {
  return <svg className="gw2-ibeam" width="16" height="26" viewBox="0 0 26 40" aria-hidden="true">
    <path d="M6 3c4 0 7 1.5 7 5v24c0 3.5-3 5-7 5M20 3c-4 0-7 1.5-7 5v24c0 3.5 3 5 7 5M9 20h8" fill="none" stroke="#000" strokeWidth="5.5" strokeLinecap="round" />
    <path d="M6 3c4 0 7 1.5 7 5v24c0 3.5-3 5-7 5M20 3c-4 0-7 1.5-7 5v24c0 3.5 3 5 7 5M9 20h8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
  </svg>;
}

// Eén woord dat infadet; i bepaalt de vertraging.
const W = ({ i, children }: { i: number; children: React.ReactNode }) =>
  <span className="gw2-bw" style={{ "--i": i } as React.CSSProperties}>{children}</span>;

// De cursor die steeds een ander woord selecteert. Start pas als `actief` waar is (de showcase: zodra hij in beeld komt).
function useSelectie(vak: React.RefObject<HTMLDivElement | null>, actief = true) {
  useEffect(() => {
    const root = vak.current;
    if (!actief || !root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const woorden = [...root.querySelectorAll<HTMLElement>(".gw2-held-woord")];
    const muis = root.querySelector<HTMLElement>(".gw2-muis");
    if (!muis || !woorden.length) return;
    let vorige = -1, kleur = 0;
    const timers: number[] = [];
    const later = (f: () => void, ms: number) => timers.push(window.setTimeout(f, ms));
    const naar = (x: number, y: number, ms: number, curve: string) => {
      muis.style.transition = `transform ${ms}ms ${curve}, opacity .4s ease`;
      muis.style.transform = `translate(${x}px, ${y}px)`;
    };
    const ronde = () => {
      // Elke keer een ander stuk tekst, nooit twee keer hetzelfde achter elkaar.
      let i = Math.floor(Math.random() * woorden.length);
      if (i === vorige) i = (i + 1) % woorden.length;
      vorige = i;
      const woord = woorden[i];
      const r = root.getBoundingClientRect(), b = woord.getBoundingClientRect();
      const midden = b.top - r.top + b.height / 2;
      woorden.forEach((w) => w.classList.remove("gekozen"));
      muis.dataset.vorm = "pijl";
      muis.dataset.zichtbaar = "true";
      naar(b.left - r.left + 4, midden, BEWEEG, "cubic-bezier(.45,.05,.2,1)");
      later(() => { muis.dataset.vorm = "tekst"; }, BEWEEG);
      later(() => {
        woord.style.setProperty("--selectie", KLEUREN[kleur++ % KLEUREN.length]);
        woord.classList.add("gekozen");
        naar(b.right - r.left - 4, midden, SLEEP, "linear");
      }, BEWEEG + OMSLAG);
      later(() => {
        muis.dataset.vorm = "pijl";
        naar(b.right - r.left + 22, midden + 26, 700, "ease-out");
      }, BEWEEG + OMSLAG + SLEEP + 250);
      later(ronde, BEWEEG + OMSLAG + SLEEP + RUST);
    };
    later(ronde, 1800);   // eerst de tekst laten infaden
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [vak, actief]);
}

export default function BlackFridayKop() {
  const vak = useRef<HTMLDivElement>(null);
  useSelectie(vak);
  return <div className="gw2-held-vak" ref={vak}>
    <h1 id="gw2-kop" className="gw2-held">
      <span className="gw2-held-regel"><span className="gw2-held-woord"><W i={0}>GRATIS</W></span></span>
      <span className="gw2-held-regel"><span className="gw2-held-woord"><W i={1}>WEBSITEDEMO</W></span></span>
      <span className="gw2-held-regel"><W i={2}>ÉN</W> <span className="gw2-held-woord"><W i={3}>REBRANDING</W></span></span>
      <span className="gw2-held-regel"><W i={4}>ÉN</W> <span className="gw2-held-woord"><W i={5}>AD CREATIVES</W></span><W i={6}><span className="sn-alg-punt">!</span></W></span>
    </h1>
    <span className="gw2-muis" data-vorm="pijl" aria-hidden="true"><Pijl /><IBeam /></span>
  </div>;
}

// 27 november 2026 (Marinus), bij GROWTH PACKAGE SHOWCASE: "Nog meer BLACK zelfde soort effect als bij de titel zelf met het selecteren
// etc ... En teksten ook infaden." Zelfde cursor en blur-fade, maar pas als de showcase in beeld komt.
export function ShowcaseKop() {
  const vak = useRef<HTMLDivElement>(null);
  const [inBeeld, zetInBeeld] = useState(false);
  useEffect(() => {
    const sectie = vak.current?.closest<HTMLElement>(".gw2-showcase");
    if (!sectie) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { sectie.classList.add("in-beeld"); zetInBeeld(true); io.disconnect(); } }, { rootMargin: "0px 0px -25% 0px" });
    io.observe(sectie);
    return () => io.disconnect();
  }, []);
  useSelectie(vak, inBeeld);
  return <div className="gw2-held-vak gw2-showcase-vak" ref={vak}>
    <h2 id="gw2-showcase-kop" translate="no">
      <span className="gw2-held-regel"><span className="gw2-held-woord"><W i={0}>GROWTH</W></span> <span className="gw2-held-woord"><W i={1}>PACKAGE</W></span></span>
      <span className="gw2-held-regel"><span className="gw2-held-woord"><W i={2}>SHOWCASE</W></span><W i={3}><span className="gw2-punt">.</span></W></span>
    </h2>
    <span className="gw2-muis" data-vorm="pijl" aria-hidden="true"><Pijl /><IBeam /></span>
  </div>;
}
