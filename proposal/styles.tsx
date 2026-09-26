import React from "react";
import { LANGUAGES, translate, useLanguage } from "./i18n/context";
import { Link } from "react-router-dom";
import { actieLoopt } from "./ConsentPopup";

// 24 september 2026 (Marinus): "One System for" in plaats van "One OS for", daaronder de winactie
// groen in de VHS-stijl van de kop (versie C). Alle zes talen staan gestapeld op dezelfde plek, zodat
// de pagina niet verspringt als de taal elke 5 seconden wisselt. Schermlezers horen alleen de paginataal.
// 24 september 2026 (Marinus): tweede beursdag, de kop gaat over de gratis website.
// 25 september 2026 (Marinus): optie B, één zin met GRATIS als groen blok (h-kop-gratis).
// 25 september 2026 (Marinus): het pakket is branding, website, Google Ads audit en OS, rustiger gezet.
const KOP_1 = "Branding, website, Google Ads audit en OS";
const KOP_2 = "GRATIS!";
// 24 september 2026 (Marinus): de groene regel gaat vanaf de tweede beursdag over de gratis website.
// 25 september 2026 (Marinus): maximaal 10 nieuwe websites en rebrandings, volledig op maat, vandaag en morgen.
// 25 september 2026 (Marinus): het aantal plekken staat nu groot linksboven de film (plekken.ts).
const WIN = "Nieuwe websites en rebranding, volledig op maat. Alleen vandaag en morgen.";
// 25 september 2026 (Marinus): "of 10 people left", schaarste als plekken in plaats van een maximum.

// 25 september 2026 (Marinus): alleen de getoonde taal neemt ruimte in. Het blok volgt de hoogte van
// die taal met een zachte overgang, zodat er geen lege regel boven of onder de kop blijft staan.
// 25 september 2026 (Marinus): het Google Ads-beeldmerk staat in de kop, direct voor "Google Ads".
function metAdsLogo(tekst: string) {
  const i = tekst.indexOf("Google Ads");
  if (i < 0) return tekst;
  return (
    <>
      {tekst.slice(0, i)}
      <span className="h-kop-ads-groep">
        <svg className="h-kop-ads" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#FBBC04" d="M7.514 4.844 1.565 15.148A4.5 4.5 0 0 1 4 14.43c2.56-.008 4.625 2.158 4.494 4.715l3.217-5.572-3.61-6.25a3.96 3.96 0 0 1-.587-2.479z" />
          <path fill="#4285F4" d="M23.464 16.929 15.463 3.072A4 4 0 0 0 8.534 7.072l8.001 13.857a4 4 0 0 0 6.929-4z" />
          <circle cx="4" cy="18.93" r="4" fill="#34A853" />
        </svg>
        Google
      </span>
      {tekst.slice(i + 6)}
    </>
  );
}

function useHoogteVolgt<T extends HTMLElement>(getoond: string) {
  const ref = React.useRef<T>(null);
  React.useLayoutEffect(() => {
    const blok = ref.current;
    if (!blok) return;
    const zet = () => {
      const aan = blok.querySelector<HTMLElement>(":scope > .is-aan");
      if (aan) blok.style.height = `${aan.offsetHeight}px`;
    };
    zet();
    window.addEventListener("resize", zet);
    void document.fonts?.ready.then(zet);
    return () => window.removeEventListener("resize", zet);
  }, [getoond]);
  return ref;
}

export function HeroTitle() {
  const { language } = useLanguage();
  const getoond = language;
  const kopRef = useHoogteVolgt<HTMLHeadingElement>(getoond);
  const winRef = useHoogteVolgt<HTMLAnchorElement>(getoond);
  const stand = (code: string) => ({
    lang: code,
    className: code === getoond ? "is-aan" : undefined,
    "aria-hidden": code === language ? undefined : (true as const),
  });
  return (
    <>
      <h1 ref={kopRef} className="h-taalwissel h-hoogte" translate="no">
        {LANGUAGES.map((code) => (
          <span key={code} {...stand(code)}>
            {metAdsLogo(translate(KOP_1, code))}{" "}
            <span className="h-kop-gratis">{translate(KOP_2, code)}</span>
          </span>
        ))}
      </h1>
      {actieLoopt() && (
        <p className="h-win-c" translate="no">
          <Link ref={winRef} className="h-taalwissel h-hoogte" to="/gratis-website">
            {LANGUAGES.map((code) => {
              return (
                <span key={code} {...stand(code)}>
                  {translate(WIN, code)}
                </span>
              );
            })}
          </Link>
        </p>
      )}
    </>
  );
}
