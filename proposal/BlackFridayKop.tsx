import React, { useEffect, useRef } from "react";

// 27 november 2026 (Marinus): "Dit mogen ook nog wel even wat meer gekke teksten zijn zoals de video ZOALS FLINK BLACK MET AI MOUSE
// ICONEN DIE AF EN TOE IETS SELECTEREN EEN TEKST DIE INFADE EN KAPITALS EN BLACK EN ECHT ÉN REBRANDING EN AD CREATIVES!"
// Dus: kop in kapitalen en zwaar, de regels faden na elkaar in, en drie muisjes met een naamlabel (zoals "Developer" in de film)
// schuiven af en toe naar een woord en selecteren het (groen vlak, witte tekst). Bij reduced motion: alleen de tekst, geen muisjes.
const MUIZEN = [
  { naam: "AI", kleur: "#00a3e0" },
  { naam: "Designer", kleur: "#25d366" },
  { naam: "Developer", kleur: "#f59e0b" },
];
// Volgorde: welke muis welk woord pakt (index in de woorden hieronder).
const ROUTE: [number, number][] = [[0, 1], [1, 2], [2, 3], [0, 0], [1, 3], [2, 2]];

function Pijl({ kleur }: { kleur: string }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill={kleur} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}

export default function BlackFridayKop() {
  const vak = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = vak.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const woorden = [...root.querySelectorAll<HTMLElement>(".gw2-held-woord")];
    const muizen = [...root.querySelectorAll<HTMLElement>(".gw2-muis")];
    let stap = 0, wacht = 0;
    const zet = () => {
      const [m, w] = ROUTE[stap % ROUTE.length];
      stap++;
      const muis = muizen[m], woord = woorden[w];
      if (!muis || !woord) return;
      const r = root.getBoundingClientRect(), b = woord.getBoundingClientRect();
      muis.style.transform = `translate(${b.right - r.left - 8}px, ${b.bottom - r.top - 10}px)`;
      muis.dataset.zichtbaar = "true";
      window.clearTimeout(wacht);
      wacht = window.setTimeout(() => {
        woorden.forEach((x) => x.classList.remove("gekozen"));
        woord.classList.add("gekozen");
        woord.style.setProperty("--muiskleur", MUIZEN[m].kleur);
      }, 750);
    };
    const start = window.setTimeout(zet, 1600);   // eerst de tekst laten infaden
    const t = window.setInterval(zet, 2600);
    return () => { window.clearTimeout(start); window.clearTimeout(wacht); window.clearInterval(t); };
  }, []);
  return <div className="gw2-held-vak" ref={vak}>
    <h1 id="gw2-kop" className="gw2-held">
      <span className="gw2-held-regel" style={{ "--i": 0 } as React.CSSProperties}><span className="gw2-held-woord">GRATIS</span></span>
      <span className="gw2-held-regel" style={{ "--i": 1 } as React.CSSProperties}><span className="gw2-held-woord">WEBSITEDEMO</span></span>
      <span className="gw2-held-regel" style={{ "--i": 2 } as React.CSSProperties}>ÉN <span className="gw2-held-woord">REBRANDING</span></span>
      <span className="gw2-held-regel" style={{ "--i": 3 } as React.CSSProperties}>ÉN <span className="gw2-held-woord">AD CREATIVES</span><span className="sn-alg-punt">!</span></span>
    </h1>
    {MUIZEN.map((m) => <span key={m.naam} className="gw2-muis" aria-hidden="true">
      <Pijl kleur={m.kleur} /><b style={{ background: m.kleur }}>{m.naam}</b>
    </span>)}
  </div>;
}
