import React, { useEffect, useRef } from "react";

// 27 november 2026 (Marinus): "Dit mogen ook nog wel even wat meer gekke teksten zijn zoals de video ... KAPITALS ... ÉN REBRANDING
// EN AD CREATIVES!" Kop in kapitalen en zwaar, de regels faden na elkaar in.
// Daarna (Marinus): "Doe maar 1 pijltje die elke keer een ander stuk tekst selecteerd. Deze." met een plaatje van de I-beam-
// tekstcursor. Dus één tekstcursor: hij schuift naar het begin van een woord en sleept dan naar het eind, terwijl de groene
// selectie meegroeit. Elke keer een ander stuk. Bij reduced motion: alleen de tekst.
const BEWEEG = 650, SLEEP = 650, RUST = 1500;

function IBeam() {
  return <svg className="gw2-ibeam" width="26" height="40" viewBox="0 0 26 40" aria-hidden="true">
    <path d="M6 3c4 0 7 1.5 7 5v24c0 3.5-3 5-7 5M20 3c-4 0-7 1.5-7 5v24c0 3.5 3 5 7 5M9 20h8" fill="none" stroke="#000" strokeWidth="5.5" strokeLinecap="round" />
    <path d="M6 3c4 0 7 1.5 7 5v24c0 3.5-3 5-7 5M20 3c-4 0-7 1.5-7 5v24c0 3.5 3 5 7 5M9 20h8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
  </svg>;
}

export default function BlackFridayKop() {
  const vak = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = vak.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const woorden = [...root.querySelectorAll<HTMLElement>(".gw2-held-woord")];
    const muis = root.querySelector<HTMLElement>(".gw2-muis");
    if (!muis || !woorden.length) return;
    let vorige = -1;
    const timers: number[] = [];
    const later = (f: () => void, ms: number) => timers.push(window.setTimeout(f, ms));
    const plek = (el: HTMLElement, kant: "left" | "right") => {
      const r = root.getBoundingClientRect(), b = el.getBoundingClientRect();
      return `translate(${b[kant] - r.left - 13}px, ${b.top - r.top + b.height / 2 - 20}px)`;
    };
    const ronde = () => {
      // Elke keer een ander stuk tekst, nooit twee keer hetzelfde achter elkaar.
      let i = Math.floor(Math.random() * woorden.length);
      if (i === vorige) i = (i + 1) % woorden.length;
      vorige = i;
      const woord = woorden[i];
      woorden.forEach((w) => w.classList.remove("gekozen"));
      muis.style.transition = `transform ${BEWEEG}ms cubic-bezier(.45,.05,.2,1), opacity .4s ease`;
      muis.style.transform = plek(woord, "left");
      muis.dataset.zichtbaar = "true";
      later(() => {
        muis.style.transition = `transform ${SLEEP}ms linear, opacity .4s ease`;
        muis.style.transform = plek(woord, "right");
        woord.classList.add("gekozen");
      }, BEWEEG + 120);
      later(ronde, BEWEEG + SLEEP + RUST);
    };
    later(ronde, 1700);   // eerst de tekst laten infaden
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);
  return <div className="gw2-held-vak" ref={vak}>
    <h1 id="gw2-kop" className="gw2-held">
      <span className="gw2-held-regel" style={{ "--i": 0 } as React.CSSProperties}><span className="gw2-held-woord">GRATIS</span></span>
      <span className="gw2-held-regel" style={{ "--i": 1 } as React.CSSProperties}><span className="gw2-held-woord">WEBSITEDEMO</span></span>
      <span className="gw2-held-regel" style={{ "--i": 2 } as React.CSSProperties}>ÉN <span className="gw2-held-woord">REBRANDING</span></span>
      <span className="gw2-held-regel" style={{ "--i": 3 } as React.CSSProperties}>ÉN <span className="gw2-held-woord">AD CREATIVES</span><span className="sn-alg-punt">!</span></span>
    </h1>
    <span className="gw2-muis" aria-hidden="true"><IBeam /></span>
  </div>;
}
