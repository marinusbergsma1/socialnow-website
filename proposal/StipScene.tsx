import React, { useEffect, useRef } from "react";
import { Veld, type VeldOpties } from "./stippen";

// Een stippenvlak in een tegel, zoals de scènes in de explainer: een raster dat pas iets doet als de tegel in beeld komt.
// `speel` krijgt het veld en doet één scène (golf, balken, cijfers uit stippen, burst). Eén keer per bezoek automatisch;
// `opnieuw` = de scène nog eens bij hover op de tegel (niet vaker dan elke 4 s). Geen beweging zonder reden: na de scène
// staat het vlak stil.
export function StipScene({ speel, opnieuw = false, licht = false, stap, raster = false, className = "", label, children }: {
  speel: (v: Veld, el: HTMLElement) => void | Promise<unknown>;
  opnieuw?: boolean; licht?: boolean; stap?: number; raster?: boolean; className?: string; label?: string; children?: React.ReactNode;
}) {
  const doek = useRef<HTMLCanvasElement>(null), vlak = useRef<HTMLDivElement>(null);
  const speelRef = useRef(speel); speelRef.current = speel;
  useEffect(() => {
    const c = doek.current, el = vlak.current; if (!c || !el) return;
    // Zonder `raster` tekent het vlak alleen wat de scène aanzet: het sitebrede raster van 32 px loopt er ongestoord achter door.
    const opties: VeldOpties = { licht, ...(stap ? { stap } : {}), ...(raster ? {} : { basis: null }) };
    const v = new Veld(c, opties);
    let bezig = false, laatst = 0;
    const doe = async () => {
      if (bezig) return; bezig = true; laatst = performance.now();
      try { v.wis(); await speelRef.current(v, el); } finally { bezig = false; }
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); setTimeout(doe, 150); } }, { threshold: .45 });
    io.observe(el);
    // Zonder `opnieuw` blijft er na de scène niets aan het vlak hangen; het veld zelf tekent alleen in beeld.
    const hover = () => { if (performance.now() - laatst > 4000) doe(); };
    if (opnieuw) el.addEventListener("pointerenter", hover);
    return () => { io.disconnect(); el.removeEventListener("pointerenter", hover); v.stop(); };
  }, [licht, stap, opnieuw, raster]);
  return (
    <div ref={vlak} className={`sn-stipscene${licht ? " is-licht" : ""} ${className}`} role={label ? "img" : undefined} aria-label={label}>
      <canvas ref={doek} aria-hidden="true" />
      {children}
    </div>
  );
}
