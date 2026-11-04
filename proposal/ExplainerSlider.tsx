import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { MediaDialog, type MediaItem } from "./MediaSliders";
import "./explainer-slider.css";

// 4 november 2026 (Marinus): "Ik wil graag een Explainers slider met alle verschillende explainer video's.", met de tegels van
// Hajenius en VASTIQ uit Wat we bereikten als voorbeeld. Dus alle explainers die al op de site staan, in één rij die opzij schuift;
// klikken speelt de film met geluid in het bestaande venster (MediaDialog). Hajenius, VASTIQ en VDZ stonden in Wat we bereikten, dat
// van de homepage af is, en staan nu hier. Daarna: "Animations and explainers doe maar dan kunnen ze er allemaal gewoon in." Dus
// die naam boven de rij, en alle animaties erbij (Il Gordo, VASTIQ inzoomen, VDZ-pand).
const EXPLAINERS: (MediaItem & { soort: string; duur: string })[] = [
  { title: "SocialNow OS", soort: "Explainer", duur: "2:11", src: "/video/os/socialnow-os-explainer.mp4?v=20261021-os04", poster: "/video/os/socialnow-os-explainer-poster.jpg?v=20261021-os04", kind: "video" },
  { title: "Meet SocialNow OS", soort: "Explainer", duur: "1:06", src: "/video/os/os-master-en.mp4", poster: "/video/os/os-master-en.webp", kind: "video" },
  { title: "SocialNow Connect", soort: "Explainer", duur: "1:02", src: "/video/connect/socialnow-connect-film.mp4", poster: "/video/connect/socialnow-connect-film-poster.jpg", kind: "video" },
  { title: "Odoo in je OS", soort: "Explainer", duur: "2:33", src: "/video/os/os-odoo.mp4", poster: "/video/os/os-odoo.webp", kind: "video" },
  { title: "kWh Garant", soort: "Case", duur: "2:17", src: "/video/os/os-kwh-case.mp4", poster: "/video/os/os-kwh-case.webp", kind: "video" },
  { title: "Website", soort: "OS-onderdeel", duur: "0:21", src: "/video/os/os-website.mp4", poster: "/video/os/os-website.webp", kind: "video" },
  { title: "CRM", soort: "OS-onderdeel", duur: "0:21", src: "/video/os/os-crm.mp4", poster: "/video/os/os-crm.webp", kind: "video" },
  { title: "Content", soort: "OS-onderdeel", duur: "0:21", src: "/video/os/os-content.mp4", poster: "/video/os/os-content.webp", kind: "video" },
  { title: "Advertenties", soort: "OS-onderdeel", duur: "0:21", src: "/video/os/os-advertenties.mp4", poster: "/video/os/os-advertenties.webp", kind: "video" },
  { title: "Hajenius", soort: "Een eigen OS voor een Amsterdams icoon", duur: "0:10", src: "/video/hajenius/hajenius-pand.mp4", poster: "/video/hajenius/hajenius-pand-poster.webp", kind: "video" },
  { title: "VASTIQ", soort: "Platform en merk uit één hand", duur: "0:10", src: "/video/vastiq/vastiq-uitzoom.mp4", poster: "/video/vastiq/vastiq-uitzoom-poster.webp", kind: "video" },
  { title: "VDZ Brigade", soort: "Vier specialisten onder één dak", duur: "0:10", src: "/video/vdz/vdz-animatie.mp4", poster: "/video/vdz/vdz-animatie-poster.webp", kind: "video" },
  { title: "VDZ Brigade", soort: "Het pand", duur: "0:13", src: "/video/vdz/vdz-house.mp4", poster: "/video/vdz/vdz-house-poster.jpg", kind: "video" },
  { title: "VASTIQ", soort: "Inzoomen op een grachtenpand", duur: "0:10", src: "/video/vastiq/vastiq-inzoom.mp4", poster: "/video/vastiq/vastiq-inzoom-poster.webp", kind: "video" },
  { title: "Il Gordo", soort: "Headerfilm van ilgordo.nl", duur: "0:11", src: "/video/ilgordo/ilgordo-header.mp4", poster: "/video/ilgordo/ilgordo-header-poster.webp", kind: "video" },
];

export default function ExplainerSlider() {
  const rij = useRef<HTMLUListElement>(null);
  const [film, setFilm] = useState<MediaItem | null>(null);
  const schuif = (richting: number) => rij.current?.scrollBy({ left: richting * rij.current.clientWidth * 0.8, behavior: "smooth" });
  return <section className="sn-explainers h-wrap" aria-labelledby="explainers-kop">
    <div className="sn-explainers-kop">
      <div>
        <p className="sn-explainers-label" translate="no"><i />Animations and explainers</p>
        <h2 id="explainers-kop">Zie hoe het werkt.</h2>
      </div>
      <div className="sn-explainers-pijlen">
        <button type="button" onClick={() => schuif(-1)} aria-label="Vorige explainers"><ChevronLeft size={18} aria-hidden="true" /></button>
        <button type="button" onClick={() => schuif(1)} aria-label="Volgende explainers"><ChevronRight size={18} aria-hidden="true" /></button>
      </div>
    </div>
    <ul ref={rij} className="sn-explainers-rij">
      {EXPLAINERS.map((e) => <li key={e.src}>
        <button type="button" onClick={() => setFilm(e)}>
          <span className="sn-explainers-beeld">
            <img src={e.poster} alt="" loading="lazy" decoding="async" />
            <span className="sn-explainers-play" aria-hidden="true"><Play size={16} /></span>
            <span className="sn-explainers-duur" translate="no">{e.duur}</span>
          </span>
          <strong translate="no">{e.title}</strong>
          <span>{e.soort}</span>
        </button>
      </li>)}
    </ul>
    <MediaDialog item={film} close={() => setFilm(null)} />
  </section>;
}
