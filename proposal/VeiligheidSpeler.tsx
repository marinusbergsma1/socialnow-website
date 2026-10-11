import React, { useState } from "react";
import { FILMS as VEILIGHEIDSFILMS, filmPad as veiligheidFilm, filmPosterPad as veiligheidPoster } from "./veiligheid-beloftes";
import { useDichtbij } from "./licht";
import { useLanguage } from "./i18n/context";

// Uit pages.tsx gehaald (11 oktober 2026), zodat de veiligheidsfilms niet in het eerste script zitten.
export default function VeiligheidSpeler({ geluid, zetGeluid }: { geluid: boolean; zetGeluid: (aan: boolean) => void }) {
  const { language } = useLanguage();
  const taal = language === "nl" ? "nl" : "en";
  const [nummer, setNummer] = useState(0);
  const ref = React.useRef<HTMLVideoElement>(null);
  const film = VEILIGHEIDSFILMS[nummer];
  React.useEffect(() => { if (ref.current) ref.current.muted = !geluid; }, [geluid, nummer, taal]);
  // 30 september 2026 (Marinus): "WIL ECHT INSTANT LOADING". Onder de vouw: poster en film laden pas als het blok dichtbij komt
  // (preload="none" zonder autoPlay haalt niets op tot play()).
  const { ref: vak, dichtbij } = useDichtbij<HTMLDivElement>();
  React.useEffect(() => { if (dichtbij && ref.current) void ref.current.play().catch(() => {}); }, [dichtbij, nummer, taal]);
  // Een nieuw nummer geeft een nieuw videovak (key), dat het effect hierboven start.
  const kies = (index: number) => setNummer(index);
  const wissel = () => {
    const video = ref.current;
    if (video && !geluid) { video.currentTime = 0; void video.play().catch(() => {}); }
    zetGeluid(!geluid);
  };
  return (
    <div className="h-film-veilig">
      <p className="h-film-titel">Veiligheid en databescherming</p>
      <div className="h-film-vak" ref={vak}>
        <video
          ref={ref}
          key={`${film.slug}-${taal}`}
          src={veiligheidFilm(film.slug, taal)}
          poster={dichtbij ? veiligheidPoster(film.slug, taal) : undefined}
          muted
          playsInline
          preload="none"
          onEnded={() => kies((nummer + 1) % VEILIGHEIDSFILMS.length)}
          aria-label={film.kop}
        />
        <button type="button" className="h-hero-film-geluid" onClick={wissel} aria-pressed={geluid}>
          {geluid ? "Geluid uit" : "Geluid aan"}
        </button>
      </div>
      <ol className="h-veilig-nummers">
        {VEILIGHEIDSFILMS.map((item, index) => (
          <li key={item.slug}>
            <button type="button" onClick={() => kies(index)} aria-current={index === nummer ? "true" : undefined}>
              <b>{index + 1}</b>
              <span>{item.kop}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
