import React, { useEffect, useRef, useState } from 'react';

const BASE = import.meta.env.BASE_URL;

// iOS/macOS Safari: mix-blend-mode op <video> en VP9-alpha-webm werken daar
// niet → zwarte vlakken achter Milo. Safari krijgt daarom een HEVC-mp4 met
// écht alpha-kanaal (native ondersteund sinds iOS 13); alle andere browsers
// de bestaande alpha-webm met mp4-fallback.
export const IS_SAFARI =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|crios|fxios|edg|android).)*safari/i.test(navigator.userAgent);

/**
 * De bronnen van een Milo-loop. Ze worden pas ingehangen zodra de video bijna
 * in beeld staat: een <video autoplay> haalt zijn bestand anders meteen op,
 * ook als hij drie schermen lager staat. Op de startpagina scheelde dat bijna
 * negen megabyte bij het openen.
 *
 * Het lege <source> bovenaan is het ankerpunt. Daarmee vinden we de <video>
 * eromheen zonder dat de opbouw van de aanroepende schermen verandert.
 */
const MiloSources: React.FC<{ name: string; v?: string; marge?: string; wacht?: boolean }> = ({ name, v, marge = '400px', wacht = false }) => {
  const anker = useRef<HTMLSourceElement>(null);
  const [dichtbij, setDichtbij] = useState(false);

  useEffect(() => {
    if (dichtbij || wacht) return;
    const video = anker.current?.parentElement as HTMLVideoElement | null;
    if (!video || typeof IntersectionObserver === 'undefined') { setDichtbij(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setDichtbij(true); io.disconnect(); }
    }, { rootMargin: marge });
    io.observe(video);
    return () => io.disconnect();
  }, [dichtbij, marge, wacht]);

  // De bronnen zijn er nu pas bij. Sommige browsers pakken ze vanzelf op, en
  // dan zou een tweede load() hetzelfde bestand nog een keer ophalen. Daarom
  // eerst een tel wachten en alleen ingrijpen als er nog niets gekozen is.
  useEffect(() => {
    if (!dichtbij) return;
    let weg = false;
    const id = requestAnimationFrame(() => {
      if (weg) return;
      const video = anker.current?.parentElement as HTMLVideoElement | null;
      if (!video) return;
      const leeg = video.networkState === 0 || video.networkState === 3; // EMPTY of NO_SOURCE
      if (leeg && !video.currentSrc) video.load();
      if (video.autoplay) video.play().catch(() => { /* geeft niet */ });
    });
    return () => { weg = true; cancelAnimationFrame(id); };
  }, [dichtbij]);

  const q = v ? `?v=${v}` : '';

  return (
    <>
      <source ref={anker} />
      {dichtbij && (IS_SAFARI ? (
        <source src={`${BASE}video/${name}-hevc.mp4${q}`} type="video/mp4" />
      ) : (
        <>
          <source src={`${BASE}video/${name}.webm${q}`} type="video/webm" />
          <source src={`${BASE}video/${name}.mp4${q}`} type="video/mp4" />
        </>
      ))}
    </>
  );
};

export default MiloSources;
