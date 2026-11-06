import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// 6 november 2026 (Marinus): "Doe daarnaast maar de Odoo video nog op de website." De film van Odoo Experience 2026 staat in de
// homepage-hero naast de 5-jaarfilm (die blijft de hoofdvideo). Eerder (4 en 5 november) wilde hij hem "automatisch afspelen met
// geluid", maar browsers staan geluid pas na een klik toe. Dus: de korte loop speelt gedempt vanzelf, en de knop Geluid aan start op
// dezelfde plek de volledige aftermovie (38 s) met geluid; de knop is een rond icoon rechtsonder in de video. Na afloop keert de stille loop terug. Lazy: poster eerst, film na het
// laden van de pagina; bij minder beweging blijft de poster staan.
// Terugzetten: tag bewaard/2026-11-06/voor-odoo-film.
const MAP = "/video/odoo-experience/";
const KORT = `${MAP}odoo-experience-kort.mp4`;
const LANG = `${MAP}odoo-experience.mp4`;

export default function OdooFilm() {
  const kort = useRef<HTMLVideoElement>(null);
  const lang = useRef<HTMLVideoElement>(null);
  const [laden, zetLaden] = useState(false);
  const [speelt, zetSpeelt] = useState(false);
  const [fase, zetFase] = useState<"kort" | "lang">("kort");
  const [stil, zetStil] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => zetLaden(true);
    if (document.readyState === "complete") start();
    else {
      window.addEventListener("load", start, { once: true });
      return () => window.removeEventListener("load", start);
    }
  }, []);

  useEffect(() => {
    const v = kort.current;
    if (!laden || !v) return;
    v.load();
    void v.play().catch(() => {});
  }, [laden]);

  const wissel = () => {
    const v = lang.current;
    if (!v) return;
    if (fase === "kort") {
      // Eerste klik: de volledige aftermovie met geluid, vanaf het begin.
      kort.current?.pause();
      zetFase("lang");
      v.muted = false;
      v.currentTime = 0;
      void v.play().catch(() => {});
      zetStil(false);
      return;
    }
    v.muted = !stil;
    zetStil(!stil);
    if (v.paused) void v.play().catch(() => {});
  };
  const klaar = () => {
    zetFase("kort");
    zetStil(true);
    if (laden) void kort.current?.play().catch(() => {});
  };

  return <div className="sn-odoo">
    <figure className={`sn-odoo-film is-${fase}${speelt ? " speelt" : ""}`}>
      <img src={`${MAP}odoo-experience-kort-poster.webp`} alt="Ons team op Odoo Experience 2026 in Brussel" width="720" height="1280" loading="lazy" />
      <video ref={kort} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} onPlaying={() => zetSpeelt(true)}>
        {laden && <source src={KORT} type="video/mp4" />}
      </video>
      <video ref={lang} className="sn-odoo-lang" src={LANG} playsInline preload="none" onEnded={klaar}
        aria-hidden={fase === "kort"} aria-label="Aftermovie Odoo Experience 2026" />
      {/* 6 november 2026 (Marinus): "Geluid icoon mag rechtsonder hier bij de video net als bij de andere". */}
      <button type="button" className="sn-film-geluid" onClick={wissel} aria-pressed={!stil} aria-label={stil ? "Geluid aan" : "Geluid uit"}>
        {stil ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
      </button>
    </figure>
    <p className="sn-film-titel"><span className="sn-alg-klein">Brussel</span><strong>Odoo Experience 2026<span className="sn-alg-punt">.</span></strong></p>
  </div>;
}
