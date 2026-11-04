import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { AmbientVideo } from "./motion";
import { MediaDialog, type MediaItem } from "./MediaSliders";
import "./explainer-slider.css";

// 4 november 2026 (Marinus): eerst "Ik wil graag een Explainers slider met alle verschillende explainer video's." en "Animations
// and explainers doe maar". Daarna, met See it in motion en die slider onder elkaar: "Doe hier maar gewoon 1 slider van groot met
// de mooiste klantwerk animaties". Dus één rij grote filmtegels met alleen klantwerk: de films spelen stil mee, geluid bij hover
// (zoals See it in motion), klikken opent ze groot. De OS- en Connect-explainers staan hier niet meer; /projecten houdt
// ShowcaseFilms.
const FILMS: (MediaItem & { klant: string; wat: string })[] = [
  { title: "BetCity", klant: "BetCity", wat: "Branded motion", src: "https://storage.googleapis.com/video-slider/FEATURED/BetCity-branded%20bumper%20ad%20-%20.mp4", kind: "video" },
  { title: "Hajenius", klant: "Hajenius", wat: "Het pand aan het Rokin, opnieuw getekend", src: "/video/hajenius/hajenius-pand.mp4", poster: "/video/hajenius/hajenius-pand-poster.webp", kind: "video" },
  { title: "VASTIQ", klant: "VASTIQ", wat: "Van één grachtenpand naar heel Amsterdam", src: "/video/vastiq/vastiq-uitzoom.mp4", poster: "/video/vastiq/vastiq-uitzoom-poster.webp", kind: "video" },
  { title: "VDZ Brigade", klant: "VDZ Brigade", wat: "Vier specialisten onder één dak", src: "/video/vdz/vdz-animatie.mp4", poster: "/video/vdz/vdz-animatie-poster.webp", kind: "video" },
  { title: "Il Gordo", klant: "Il Gordo", wat: "Headerfilm van ilgordo.nl", src: "/video/ilgordo/ilgordo-header.mp4", poster: "/video/ilgordo/ilgordo-header-poster.webp", kind: "video" },
  { title: "Next Gen Webdesign", klant: "Websites", wat: "Design en development", src: "/videos/nextgen-webdesign.mp4", kind: "video" },
  { title: "VASTIQ", klant: "VASTIQ", wat: "Inzoomen op een grachtenpand", src: "/video/vastiq/vastiq-inzoom.mp4", poster: "/video/vastiq/vastiq-inzoom-poster.webp", kind: "video" },
  { title: "VDZ Brigade", klant: "VDZ Brigade", wat: "Het pand", src: "/video/vdz/vdz-house.mp4", poster: "/video/vdz/vdz-house-poster.jpg", kind: "video" },
];

export default function ExplainerSlider() {
  const rij = useRef<HTMLUListElement>(null);
  const [film, setFilm] = useState<MediaItem | null>(null);
  const schuif = (richting: number) => {
    const el = rij.current;
    const kaart = el?.querySelector("li");
    if (el && kaart) el.scrollBy({ left: richting * (kaart.getBoundingClientRect().width + 16), behavior: "smooth" });
  };
  return <section className="sn-explainers h-wrap" aria-labelledby="explainers-kop">
    <div className="sn-explainers-kop">
      <div>
        <p className="sn-explainers-label" translate="no"><i />Animations</p>
        <h2 id="explainers-kop">Klantwerk in beweging.</h2>
      </div>
      <div className="sn-explainers-pijlen">
        <button type="button" onClick={() => schuif(-1)} aria-label="Vorige film"><ChevronLeft size={18} aria-hidden="true" /></button>
        <button type="button" onClick={() => schuif(1)} aria-label="Volgende film"><ChevronRight size={18} aria-hidden="true" /></button>
      </div>
    </div>
    <ul ref={rij} className="sn-explainers-rij">
      {FILMS.map((f) => <li key={f.src}>
        <button type="button" onClick={() => setFilm(f)}>
          <span className="sn-explainers-beeld">
            <AmbientVideo src={f.src} poster={f.poster} label={f.wat} hoverSound suspended={!!film} preloadMargin="200px" />
            <span className="sn-explainers-groot" aria-hidden="true"><Expand size={16} /></span>
          </span>
          <strong translate="no">{f.klant}</strong>
          <span>{f.wat}</span>
        </button>
      </li>)}
    </ul>
    <MediaDialog item={film} close={() => setFilm(null)} />
  </section>;
}
