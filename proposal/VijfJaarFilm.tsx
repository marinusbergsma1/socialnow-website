import React, { useEffect, useRef, useState } from "react";
import { Volume2, X } from "lucide-react";
import "./vijf-jaar.css";

// 6 november 2026 (Marinus): "Zorg tegelijk dat het SocialNow 5 YEARS logo vanuit de Video ook op de site komt met de video als MAIN
// VIDEO [...] plus die video op die andere plek waar nu de foto staat. Bewaar wel goed deze versies zodat ik m makkelijk terug kan zetten."
// Dus de 5-jaarfilm (video-project/83-vijf-jaar-socialnow, render van 6 november 18:13) staat in de homepage-hero op de plek van de
// teamfoto bij het Atomium: gedempt, inline en in een lus, en de knop eronder speelt de hele film met geluid in een venster.
// Terugzetten: tag bewaard/2026-11-06/voor-5years-video, of in HomeEnthousiast.tsx VijfJaarFilm weer door AtomiumFoto vervangen.
const MAP = "/video/vijf-jaar/";
const VERSIE = 1;

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
  const voorbeeld = useRef<HTMLVideoElement>(null);
  const venster = useRef<HTMLDialogElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [mobiel, setMobiel] = useState(false);
  const [laden, setLaden] = useState(false);
  const [speelt, setSpeelt] = useState(false);

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
    const v = voorbeeld.current;
    if (!laden || !v) return;
    v.load();
    void v.play().catch(() => {});
  }, [laden]);

  const openen = () => {
    voorbeeld.current?.pause();
    venster.current?.showModal();
    const f = film.current;
    if (!f) return;
    if (!f.currentSrc) f.load();
    f.muted = false;
    f.currentTime = 0;
    void f.play().catch(() => {});
  };
  const sluiten = () => {
    film.current?.pause();
    if (venster.current?.open) venster.current.close();
  };
  const naSluiten = () => {
    film.current?.pause();
    if (laden) void voorbeeld.current?.play().catch(() => {});
  };

  const poster = `${MAP}vijf-jaar-poster.webp?v=${VERSIE}`;
  const posterMobiel = `${MAP}vijf-jaar-poster-mobiel.webp?v=${VERSIE}`;
  return <>
    <div className="sn-vijf">
      <figure className={`sn-vijf-film${speelt ? " speelt" : ""}`}>
        <img src={poster} srcSet={`${posterMobiel} 540w, ${poster} 720w`} sizes="(max-width: 960px) 380px, 360px"
          alt="Marinus en Steef vieren 5 jaar SocialNow" width="720" height="1280" fetchPriority="high" />
        <video ref={voorbeeld} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}
          onPlaying={() => setSpeelt(true)}>
          {laden && bronnen(mobiel).map(b => <source key={b.src} src={b.src} type={b.type} />)}
        </video>
      </figure>
      <div className="sn-vijf-onder">
        <p><span className="sn-alg-klein">November 2026</span><strong>5 jaar SocialNow<span className="sn-alg-punt">.</span></strong></p>
        <button type="button" className="sn-vijf-geluid" aria-haspopup="dialog" onClick={openen}>
          <Volume2 size={16} aria-hidden="true" /><span>Bekijk met geluid</span>
        </button>
      </div>
    </div>
    <dialog className="sn-alg-venster sn-vijf-venster" ref={venster} aria-label="5 jaar SocialNow, de film" onClose={naSluiten}
      onClick={e => { if (e.target === venster.current) sluiten(); }}>
      <button type="button" className="sn-alg-sluit" onClick={sluiten} aria-label="Sluit de film"><X size={20} aria-hidden="true" /></button>
      <video ref={film} key={mobiel ? "m" : "d"} controls playsInline preload="none" poster={poster}>
        {bronnen(mobiel).map(b => <source key={b.src} src={b.src} type={b.type} />)}
      </video>
    </dialog>
  </>;
}
