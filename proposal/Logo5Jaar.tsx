import React, { useEffect, useRef, useState } from "react";

// 6 november 2026 (Marinus): "het SocialNow 5 YEARS logo vanuit de Video ook op de site ... BEELDMERK ANIMATIE ZOALS OOK IN DE
// VIDEO ALS LOGO INTRO KORT". Logo en animatie zijn de eindtitel van de 5-jaarfilm (83-vijf-jaar-socialnow), zie public/5jaar/BRON.md.
// De video staat als ruwe HTML in de pagina: React schrijft `muted` bij het voorrenderen niet in de HTML, en zonder muted
// speelt geen browser hem vanzelf af.
const INTRO =
  '<video autoplay muted playsinline preload="auto" disablepictureinpicture disableremoteplayback tabindex="-1">' +
  '<source src="/5jaar/logo-intro.webm" type="video/webm"><source src="/5jaar/logo-intro.mp4" type="video/mp4"></video>';

export function Logo5Jaar({ thuis }: { thuis: boolean }) {
  // Alleen als de site op de homepage opent; daarna (ook bij terugnavigeren) staat het logo rustig.
  const [logoIntro, zetLogoIntro] = useState(() => thuis);
  const vak = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!logoIntro) return;
    const video = vak.current?.querySelector("video");
    const klaar = () => zetLogoIntro(false);
    if (!video || video.ended || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video?.pause();
      klaar();
      return;
    }
    const laatsteBron = video.querySelector("source:last-of-type");
    video.addEventListener("ended", klaar);
    laatsteBron?.addEventListener("error", klaar);
    video.play()?.catch(klaar); // bijvoorbeeld iPhone in energiebesparing: meteen het logo
    // Begint hij niet binnen 2 s (traag netwerk), dan geen late intro maar het logo; vangnet na 6 s.
    const nietGestart = window.setTimeout(() => { if (video.currentTime === 0) klaar(); }, 2000);
    const vangnet = window.setTimeout(klaar, 6000);
    return () => {
      video.removeEventListener("ended", klaar);
      laatsteBron?.removeEventListener("error", klaar);
      window.clearTimeout(nietGestart);
      window.clearTimeout(vangnet);
    };
  }, [logoIntro]);
  return (
    <span className={`h-brand-5jaar${logoIntro ? " is-intro" : ""}`} ref={vak}>
      <img src="/5jaar/logo-5years.webp" alt="SocialNow 5 YEARS" width="200" height="56" />
      {logoIntro && <span className="h-brand-intro" aria-hidden="true" dangerouslySetInnerHTML={{ __html: INTRO }} />}
    </span>
  );
}
