import React from "react";
import { LANGUAGES, translate, useLanguage } from "./i18n/context";
import { Link } from "react-router-dom";
import { actieLoopt } from "./ConsentPopup";
import { useTaalwissel } from "./taalwissel";

// 24 september 2026 (Marinus): "One System for" in plaats van "One OS for", daaronder de winactie
// groen in de VHS-stijl van de kop (versie C). Alle zes talen staan gestapeld op dezelfde plek, zodat
// de pagina niet verspringt als de taal elke 5 seconden wisselt. Schermlezers horen alleen de paginataal.
// 24 september 2026 (Marinus): tweede beursdag, de kop gaat over de gratis website.
const KOP_1 = "Je nieuwe website.";
const KOP_2 = "Gratis.";
// 24 september 2026 (Marinus): de groene regel gaat vanaf de tweede beursdag over de gratis website.
const WIN = "{bedrag} Wij bellen je en presenteren hem live op de beurs.";
const BEDRAG = "Dezelfde dag.";

export function HeroTitle() {
  const { language } = useLanguage();
  const getoond = useTaalwissel(language);
  const stand = (code: string) => ({
    lang: code,
    className: code === getoond ? "is-aan" : undefined,
    "aria-hidden": code === language ? undefined : (true as const),
  });
  return (
    <>
      <h1 className="h-taalwissel" translate="no">
        {LANGUAGES.map((code) => (
          <span key={code} {...stand(code)}>
            {translate(KOP_1, code)}
            <br />
            {translate(KOP_2, code)}
          </span>
        ))}
      </h1>
      {actieLoopt() && (
        <p className="h-win-c" translate="no">
          <Link className="h-taalwissel" to="/gratis-website">
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
