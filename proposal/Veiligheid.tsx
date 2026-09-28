import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Download, Play, ShieldCheck, X } from "lucide-react";
import { useLanguage } from "./i18n/context";
import { Bento, Tegel } from "./Bento";
import { BELOFTES, STAPPEN, pdfPad, posterPad, videoPad, type Taal } from "./veiligheid-beloftes";
import "./veiligheid.css";

// Veiligheid, 28 september 2026 (Marinus): de veiligheidsvideo en de sleutelbelofte krijgen een
// prominente plek, zodat bezoekers hun API-sleutels durven te koppelen.
// VeiligheidBlok staat op de homepage na de live sites en vóór "Four faces"; die plaatsing doet de
// homepage-regie in Home(). Sinds 28 september in de gedeelde bentotegels. VeiligheidPagina is /veiligheid (Engels zonder voorvoegsel, /nl/veiligheid).
// Stille tv-versie speelt gedempt in een lus; een klik opent de 4:5-versie met de stem van Archie.
// Nederlands krijgt de Nederlandse film en pdf, alle andere talen de Engelse.

function useTaal(): Taal {
  const { language } = useLanguage();
  return language === "nl" ? "nl" : "en";
}

function StilleFilm({ taal, groot = false }: { taal: Taal; groot?: boolean }) {
  const [open, setOpen] = useState(false);
  const knop = useRef<HTMLButtonElement>(null);
  const stil = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // Bij "minder beweging" geen autoplay: de poster blijft staan, de klik werkt gewoon.
    // Speelt alleen zolang de film in beeld is; zo laadt hij niet mee als niemand kijkt.
    const film = stil.current;
    if (!film || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    film.muted = true;
    const kijker = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) film.play().catch(() => {});
      else film.pause();
    }, { threshold: 0.25 });
    kijker.observe(film);
    return () => kijker.disconnect();
  }, [taal]);
  return (
    <>
      <button
        ref={knop}
        type="button"
        className={`vh-film${groot ? " vh-film--groot" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Bekijk de veiligheidsfilm met geluid"
      >
        <video
          ref={stil}
          key={taal}
          src={videoPad(taal, "tv")}
          poster={posterPad(taal, "tv")}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
        <span className="vh-film-knop">
          <Play size={18} aria-hidden="true" />
          <span>Kijk met geluid</span>
        </span>
      </button>
      {open && <FilmMetStem taal={taal} onClose={() => { setOpen(false); knop.current?.focus(); }} />}
    </>
  );
}

function FilmMetStem({ taal, onClose }: { taal: Taal; onClose: () => void }) {
  const sluit = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    sluit.current?.focus();
    const toets = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", toets);
    const oud = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", toets); document.body.style.overflow = oud; };
  }, [onClose]);
  return (
    <div className="vh-venster" role="dialog" aria-modal="true" aria-label="Veiligheidsfilm met geluid" onClick={onClose}>
      <div className="vh-venster-film" onClick={(e) => e.stopPropagation()}>
        <video src={videoPad(taal, "45")} poster={posterPad(taal, "45")} controls autoPlay playsInline preload="auto" />
        <button ref={sluit} type="button" className="vh-sluit" onClick={onClose} aria-label="Sluiten">
          <X size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function PdfKnop({ taal, label }: { taal: Taal; label?: string }) {
  return (
    <a className="vh-knop" href={pdfPad(taal)} target="_blank" rel="noopener" download>
      <Download size={17} aria-hidden="true" />
      <span>{label || "Download de sleutelbelofte (PDF)"}</span>
    </a>
  );
}

function Beloftes() {
  return (
    <ul className="vh-beloftes">
      {BELOFTES.map((b) => (
        <li key={b.kop}>
          <span className="vh-vink"><Check size={15} aria-hidden="true" /></span>
          <span>
            <strong>{b.kop}</strong>
            <span>{b.tekst}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// 28 september 2026: het homepageblok in de gedeelde tegeltaal (proposal/Bento.tsx). De tv-versie is stil, dus de
// pil opent de 4:5-film met stem in een venster in plaats van het geluid aan te zetten.
function FilmTegel({ taal }: { taal: Taal }) {
  const [open, setOpen] = useState(false);
  const knop = useRef<HTMLButtonElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = film.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.muted = true;
    const kijker = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) element.play().catch(() => {});
      else element.pause();
    }, { threshold: 0.25 });
    kijker.observe(element);
    return () => kijker.disconnect();
  }, [taal]);
  return (
    <>
      <video ref={film} key={taal} className="sn-tegel-film" src={videoPad(taal, "tv")} poster={posterPad(taal, "tv")} muted loop playsInline preload="metadata" aria-label="Veiligheidsfilm" />
      <button ref={knop} type="button" className="h-hero-film-geluid" onClick={() => setOpen(true)}>Kijk met geluid</button>
      {open && <FilmMetStem taal={taal} onClose={() => { setOpen(false); knop.current?.focus(); }} />}
    </>
  );
}

const GROEPEN: { kop: string; beloftes: number[] }[] = [
  { kop: "Versleuteld en onzichtbaar", beloftes: [0, 1] },
  { kop: "Alleen wat jij aanzet", beloftes: [2, 3, 4] },
  { kop: "Jij houdt de regie", beloftes: [5, 6] },
];

export default function VeiligheidBlok() {
  const taal = useTaal();
  return (
    <Bento id="veiligheid" label="Sleutelbelofte" titel={<>Jouw sleutels zijn veilig.<br /><span>Zwart op wit.</span></>} className="vh-bento">
      <Tegel kop="Zo beschermen we je sleutels" breed={8} soort="film">
        <FilmTegel taal={taal} />
      </Tegel>
      <Tegel kop="Het officiële document" breed={4} soort="groen">
        <p className="sn-tegel-label">PDF, Nederlands en Engels</p>
        <p className="sn-tegel-titel">Zeven beloftes over je API-sleutels.</p>
        <div className="sn-tegel-onder">
          <PdfKnop taal={taal} label="Download de sleutelbelofte" />
          <Link className="vh-link" to="/veiligheid">
            <span>Alles over veiligheid</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </Tegel>
      {GROEPEN.map((g) => (
        <Tegel key={g.kop} kop={g.kop} breed={4}>
          <ul className="vh-beloftes vh-beloftes--tegel">
            {g.beloftes.map((i) => (
              <li key={i}>
                <span className="vh-vink"><Check size={15} aria-hidden="true" /></span>
                <span><strong>{BELOFTES[i].kop}</strong></span>
              </li>
            ))}
          </ul>
        </Tegel>
      ))}
    </Bento>
  );
}

export function VeiligheidPagina() {
  const taal = useTaal();
  return (
    <div className="vh-pagina">
      <section className="h-wrap vh-kop">
        <p className="vh-kicker"><ShieldCheck size={16} aria-hidden="true" /><span>Veiligheid en sleutelbelofte</span></p>
        <h1>Jouw sleutels zijn veilig. Zwart op wit.</h1>
        <p className="vh-intro">Het OS werkt pas echt als je het koppelt aan je eigen systemen. Daarvoor geef je ons een sleutel. Hier lees je wat we daarmee doen, en vooral wat niet.</p>
        <div className="vh-acties">
          <PdfKnop taal={taal} />
        </div>
      </section>
      <section className="h-wrap">
        <StilleFilm taal={taal} groot />
      </section>
      <section className="h-wrap vh-sectie" aria-labelledby="vh-beloftes-kop">
        <h2 id="vh-beloftes-kop">Onze belofte</h2>
        <Beloftes />
      </section>
      <section className="h-wrap vh-sectie" aria-labelledby="vh-stappen-kop">
        <h2 id="vh-stappen-kop">Zo koppel je veilig</h2>
        <ol className="vh-stappen">
          {STAPPEN.map((s, i) => (
            <li key={s.kop}>
              <span className="vh-nummer" aria-hidden="true">{String(i + 1)}</span>
              <strong>{s.kop}</strong>
              <span>{s.tekst}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="h-wrap vh-sectie vh-documenten" aria-labelledby="vh-doc-kop">
        <h2 id="vh-doc-kop">Het officiële document</h2>
        <p>De sleutelbelofte als pdf, in het Nederlands en in het Engels. Lees verder in onze beveiligingsmaatregelen en de verwerkersovereenkomst.</p>
        <div className="vh-acties">
          <PdfKnop taal="nl" label="Sleutelbelofte, Nederlands (PDF)" />
          <PdfKnop taal="en" label="Sleutelbelofte, Engels (PDF)" />
        </div>
        <div className="vh-acties">
          <Link className="vh-link" to="/beveiliging"><span>Beveiliging en responsible disclosure</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link className="vh-link" to="/verwerkersovereenkomst"><span>Verwerkersovereenkomst</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
