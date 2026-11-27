import React, { useRef, useState } from "react";
import { Play } from "lucide-react";
import { MediaRail, mengen, portfolioImages, klantwerkFilms } from "./MediaSliders";

// 27 november 2026 (Marinus): "Ik wil graag ook hier de contentsliders etc BLACK FRIDAY LOGO met een countdown timer." Einde gekozen door
// Marinus: 31 december 23:59. Vervangt op /gratis-website de twee websitetegels. Sinds 27 nov (later) staat de film op de plek van de
// countdown, zie hieronder.
const RIJ_WERK = [
  { src: "/images/AZ-Boadu-Bedankt-Post.webp", alt: "AZ: Bedankt-post" },
  { src: "/images/C4-FEED-30-korting.webp", alt: "C4: kortingscampagne" },
  { src: "/images/AZ-25-K-Volgers-Post.webp", alt: "AZ: 25K volgers" },
  { src: "/images/AZ-Champions-Leageu-Header.webp", alt: "AZ: Champions League-header" },
  { src: "/images/Bannert.webp", alt: "Campagnebeeld" },
];
const RIJ_SITES = [
  { src: "/screenshots/newblack-hero.webp", alt: "Website NEW BLACK" },
  { src: "/screenshots/divine-machines-hero.webp", alt: "Website Divine Machines" },
  { src: "/images/cases/vastiq-desktop.webp", alt: "Website VASTIQ" },
  { src: "/screenshots/kwhgarant-hero.webp", alt: "Website kWh Garant" },
  { src: "/images/cases/ilgordo-desktop.webp", alt: "Website Il Gordo" },
  { src: "/screenshots/vdz-brigade-hero.webp", alt: "Website De Verduurzaming Brigade" },
];

function Rij({ beelden, soort }: { beelden: { src: string; alt: string }[]; soort: "werk" | "sites" }) {
  // Twee gelijke sets; de baan schuift precies één set op, zodat de loop naadloos is. De tweede set is voor schermlezers verborgen.
  return <div className={`gw2-bf-rij is-${soort}`}>
    <ul className="gw2-bf-baan">
      {[0, 1].flatMap(set => beelden.map(b => <li key={`${set}-${b.src}`} aria-hidden={set > 0 || undefined}>
        <img src={b.src} alt={set > 0 ? "" : b.alt} decoding="async" /></li>))}
    </ul>
  </div>;
}

// 27 november 2026 (Marinus): "Die moet ook ipv de timer mijn video laten zien. Dus video en daaronder die slider." De countdown en het
// losse logo zijn weg: de film met de thumbnail als startbeeld (die heeft het logo al). Klik speelt af met geluid, nog een klik pauzeert,
// en na afloop staat de thumbnail er weer ("Eindig de Nederlandse versie weer gwn op de Thumbnail").
const FILM = "/video/black-friday/socialnow-black-friday-5x4-nl.mp4";
const POSTER = "/video/black-friday/socialnow-black-friday-thumbnail.jpg";

export default function BlackFridayBlok() {
  const film = useRef<HTMLVideoElement>(null);
  const [speelt, zetSpeelt] = useState(false);
  const wissel = () => {
    const v = film.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {}); else v.pause();
  };
  return <div className="gw2-bf">
    <div className="gw2-bf-film" data-speelt={speelt}>
      <video ref={film} src={FILM} poster={POSTER} playsInline preload="metadata" aria-label="Black Friday Deal: de film" onClick={wissel}
        onPlay={() => zetSpeelt(true)} onPause={() => zetSpeelt(false)} onEnded={() => { zetSpeelt(false); film.current?.load(); }} />
      {!speelt && <button type="button" className="gw2-bf-speel" onClick={wissel} aria-label="Speel de Black Friday-film af">
        <Play size={22} aria-hidden="true" /><span>Bekijk de film</span></button>}
    </div>
    {/* 27 nov (Marinus): "Hier liever deze row." De twee portfoliorijen van de homepage (beelden en films om en om). */}
    <div className="gw2-bf-rails h-image-showcase">
      {/* 27 nov: "Graag 1 slide en die mag wat sneller gaan." */}
      <MediaRail items={mengen(portfolioImages, klantwerkFilms)} label="Portfolio" snelheid={45} doorlopen />
    </div>
  </div>;
}
