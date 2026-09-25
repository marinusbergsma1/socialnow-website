import React from "react";
import { LANGUAGES, translate, useLanguage } from "./i18n/context";
import { Link } from "react-router-dom";
import { actieLoopt } from "./ConsentPopup";

// 24 september 2026 (Marinus): "One System for" in plaats van "One OS for", daaronder de winactie
// groen in de VHS-stijl van de kop (versie C). Alle zes talen staan gestapeld op dezelfde plek, zodat
// de pagina niet verspringt als de taal elke 5 seconden wisselt. Schermlezers horen alleen de paginataal.
// 24 september 2026 (Marinus): tweede beursdag, de kop gaat over de gratis website.
// 25 september 2026 (Marinus): optie B, één zin met GRATIS als groen blok (h-kop-gratis).
const KOP_1 = "Je nieuwe website, beheer en branding";
const KOP_2 = "gratis!";
// 24 september 2026 (Marinus): de groene regel gaat vanaf de tweede beursdag over de gratis website.
// 25 september 2026 (Marinus): maximaal 10 nieuwe websites en rebrandings, volledig op maat, vandaag en morgen.
const WIN = "{bedrag} Nieuwe websites en rebranding, volledig op maat. Alleen vandaag en morgen.";
// 25 september 2026 (Marinus): "of 10 people left", schaarste als plekken in plaats van een maximum.
const BEDRAG = "Nog 10 plekken.";

// 25 september 2026 (Marinus): alleen de getoonde taal neemt ruimte in. Het blok volgt de hoogte van
// die taal met een zachte overgang, zodat er geen lege regel boven of onder de kop blijft staan.
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
  // 25 september 2026 (Marinus): de taalwissel staat uit; de kop blijft in de taal van de pagina.
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
            {translate(KOP_1, code)}{" "}
            <span className="h-kop-gratis">{translate(KOP_2, code)}</span>
          </span>
        ))}
      </h1>
      {actieLoopt() && (
        <p className="h-win-c" translate="no">
          <Link ref={winRef} className="h-taalwissel h-hoogte" to="/gratis-website">
            {LANGUAGES.map((code) => {
              const [voor, na] = translate(WIN, code).split("{bedrag}");
              return (
                <span key={code} {...stand(code)}>
                  {voor}<span className="h-win-bedrag">{translate(BEDRAG, code)}</span>{na}
                </span>
              );
            })}
          </Link>
        </p>
      )}
    </>
  );
}
