import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import "./vijf-jaar.css";

// 6 november 2026 (Marinus): "Zorg tegelijk dat het SocialNow 5 YEARS logo vanuit de Video ook op de site komt met de video als MAIN
// VIDEO [...] plus die video op die andere plek waar nu de foto staat. Bewaar wel goed deze versies zodat ik m makkelijk terug kan zetten."
// Dus de 5-jaarfilm (video-project/83-vijf-jaar-socialnow) staat in de homepage-hero op de plek van de teamfoto bij het Atomium:
// gedempt, inline en in een lus. Later die avond: "Geluid icoon mag rechtsonder hier bij de video net als bij de andere dan heb je
// mooi Odoo Experience en 5 Jaar SocialNow naast elkaar." Dus geen witte knop en geen venster meer, maar een rond geluidsicoon in de
// video: de eerste klik start de film met geluid vanaf het begin, de volgende zet het geluid weer uit.
// Versie 2: eindrender van 6 november 18:59 (websites in 4K, ERP-logo's, swooshes).
// Terugzetten: tag bewaard/2026-11-06/voor-5years-video (vóór de film) of bewaard/2026-11-06/voor-geluid-icoon (vóór deze versie).
const MAP = "/video/vijf-jaar/";
const VERSIE = 2;

type Bron = { src: string; type: string };
function bronnen(mobiel: boolean): Bron[] {
  const naam = mobiel ? "vijf-jaar-mobiel" : "vijf-jaar";
  return [
    { src: `${MAP}${naam}-hevc.mp4?v=${VERSIE}`, type: 'video/mp4; codecs="hvc1"' },
    { src: `${MAP}${naam}.mp4?v=${VERSIE}`, type: "video/mp4" },
    ...(mobiel ? [] : [{ src: `${MAP}vijf-jaar.webm?v=${VERSIE}`, type: "video/webm" }]),
  ];
}

export default function VijfJaarFilm() {
  const film = useRef<HTMLVideoElement>(null);
  const metGeluid = useRef(false);
  const [mobiel, setMobiel] = useState(false);
  const [laden, setLaden] = useState(false);
  const [speelt, setSpeelt] = useState(false);
  const [stil, setStil] = useState(true);

  // De poster staat er meteen (geen verschuiving, geen zwart vlak); de film komt pas na het laden van de pagina, en niet bij minder beweging.
  useEffect(() => {
    setMobiel(window.matchMedia("(max-width: 767px)").matches);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => setLaden(true);
    if (document.readyState === "complete") start();
    else {
      window.addEventListener("load", start, { once: true });
      return () => window.removeEventListener("load", start);
    }
  }, []);

  useEffect(() => {
    const v = film.current;
    if (!laden || !v) return;
    v.load();
    v.muted = !metGeluid.current;
    void v.play().catch(() => {});
  }, [laden]);

  const wissel = () => {
    const v = film.current;
    if (!v) return;
    if (stil) {
      metGeluid.current = true;
      setStil(false);
      if (!laden) { setLaden(true); return; } // bij minder beweging: de film start pas op deze klik
      v.currentTime = 0;
      v.muted = false;
      void v.play().catch(() => {});
    } else {
      metGeluid.current = false;
      v.muted = true;
      setStil(true);
    }
  };

  const poster = `${MAP}vijf-jaar-poster.webp?v=${VERSIE}`;
  const posterMobiel = `${MAP}vijf-jaar-poster-mobiel.webp?v=${VERSIE}`;
  return <div className="sn-vijf">
    <figure className={`sn-vijf-film${speelt ? " speelt" : ""}`}>
      <img src={poster} srcSet={`${posterMobiel} 540w, ${poster} 720w`} sizes="(max-width: 960px) 220px, 320px"
        alt="Marinus en Steef vieren 5 jaar SocialNow" width="720" height="1280" fetchPriority="high" />
      <video ref={film} muted loop playsInline preload="none" aria-label="5 jaar SocialNow, de film"
        onPlaying={() => setSpeelt(true)}>
        {laden && bronnen(mobiel).map(b => <source key={b.src} src={b.src} type={b.type} />)}
      </video>
      <button type="button" className="sn-film-geluid" onClick={wissel} aria-pressed={!stil} aria-label={stil ? "Geluid aan" : "Geluid uit"}>
        {stil ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
      </button>
    </figure>
    <p className="sn-film-titel"><span className="sn-alg-klein">November 2026</span><strong>5 jaar SocialNow<span className="sn-alg-punt">.</span></strong></p>
  </div>;
}
