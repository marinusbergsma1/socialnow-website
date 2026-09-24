import React from "react";
import { LANGUAGES, translate, useLanguage } from "./i18n/context";
import { actieLoopt } from "./ConsentPopup";
import { CLAIM_URL } from "./os-entry";
import { useTaalwissel } from "./taalwissel";

// 24 september 2026 (Marinus): "One System for" in plaats van "One OS for", daaronder de winactie
// groen in de VHS-stijl van de kop (versie C). Alle zes talen staan gestapeld op dezelfde plek, zodat
// de pagina niet verspringt als de taal elke 5 seconden wisselt. Schermlezers horen alleen de paginataal.
const KOP_1 = "Eén systeem voor";
const KOP_2 = "je bedrijf.";
const WIN = "Probeer nu gratis en win een Custom OS ter waarde van {bedrag}";
const BEDRAG = "€10.000,-";

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
          <a className="h-taalwissel" href={CLAIM_URL}>
            {LANGUAGES.map((code) => {
              const [voor, na] = translate(WIN, code).split("{bedrag}");
              return (
                <span key={code} {...stand(code)}>
                  {voor}<span className="h-win-bedrag">{BEDRAG}</span>{na}
                </span>
              );
            })}
          </a>
        </p>
      )}
    </>
  );
}
