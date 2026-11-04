import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// 4 november 2026 (Marinus): "Zet verder de Odoo video achter de header video en zorg dat die ook automatisch daar afspeelt met
// geluid na 3 seconden als de homepage start." In het headervak loopt eerst de korte, stille loop; na 3 seconden volgt op dezelfde
// plek de volledige aftermovie van Odoo Experience 2026 (38 s, met geluid). Browsers staan geluid zonder klik of tik niet toe: lukt
// het niet, dan speelt hij gedempt met een knop Geluid aan, en de eerste klik, tik of toets van de bezoeker zet het geluid aan.
// Scrollen telt voor browsers niet als toestemming, dus daarop zetten we het geluid niet aan (de film zou dan stoppen).
// Na afloop keert de stille loop terug. Bij reduced motion blijft het bij de poster en start niets vanzelf.
const KORT = "/video/odoo-experience/odoo-experience-kort.mp4";
const LANG = "/video/odoo-experience/odoo-experience.mp4";
const WACHT = 3000;

export default function OdooFilm() {
  const kort = useRef<HTMLVideoElement>(null);
  const lang = useRef<HTMLVideoElement>(null);
  const [fase, zetFase] = useState<"kort" | "lang">("kort");
  const [stil, zetStil] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { kort.current?.pause(); return; }
    const klok = window.setTimeout(async () => {
      const v = lang.current;
      if (!v) return;
      zetFase("lang");
      v.currentTime = 0;
      v.muted = false;
      try { await v.play(); zetStil(false); }
      catch {
        v.muted = true;
        zetStil(true);
        try { await v.play(); } catch { zetFase("kort"); }
      }
    }, WACHT);
    return () => window.clearTimeout(klok);
  }, []);

  // Eerste echte handeling van de bezoeker (klik, tik of toets): geluid aan.
  useEffect(() => {
    if (fase !== "lang" || !stil) return;
    const aan = () => { const v = lang.current; if (!v) return; v.muted = false; void v.play().catch(() => {}); zetStil(false); };
    const opties = { once: true, capture: true } as const;
    window.addEventListener("pointerdown", aan, opties);
    window.addEventListener("keydown", aan, opties);
    return () => { window.removeEventListener("pointerdown", aan, opties); window.removeEventListener("keydown", aan, opties); };
  }, [fase, stil]);

  const wissel = () => { const v = lang.current; if (!v) return; v.muted = !stil ? true : false; zetStil(!stil); if (v.paused) void v.play().catch(() => {}); };
  const klaar = () => { zetFase("kort"); zetStil(true); void kort.current?.play().catch(() => {}); };

  return <figure className={`sn-blij-film is-${fase}`}>
    <video ref={kort} src={KORT} poster="/video/odoo-experience/odoo-experience-kort-poster.webp" autoPlay muted loop playsInline aria-hidden={fase === "lang"} aria-label="Ons team op Odoo Experience 2026 in Brussel" />
    <video ref={lang} className="sn-blij-lang" src={LANG} poster="/video/odoo-experience/odoo-experience.jpg" playsInline preload="auto" onEnded={klaar} aria-hidden={fase === "kort"} aria-label="Aftermovie Odoo Experience 2026" />
    {fase === "lang" && <button type="button" className="sn-blij-geluid" onClick={(e) => { e.stopPropagation(); wissel(); }} aria-pressed={!stil}>
      {stil ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}<span>{stil ? "Geluid aan" : "Geluid uit"}</span>
    </button>}
  </figure>;
}
