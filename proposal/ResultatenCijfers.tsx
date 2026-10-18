import React from "react";
import { Bento, Tegel } from "./Bento";
import { TextLink } from "./ui";

// 18 oktober 2026 (Marinus): "Bij resultaten graag ook even bovenaan die 100k en de 100 leads in 1 week." Twee grote
// cijfers bovenaan /projecten (in het menu: Resultaten). Alleen wat al op de site staat (Bereikt.tsx, data/projects.ts):
// € 100.000 omzet voor VDZ Brigade en 100 leads in één week voor kWh Garant, elk met een link naar de eigen case.
const CIJFERS = [
  { klant: "VDZ Brigade", waarde: "€100K", eenheid: "omzet voor VDZ", regel: "Van nul online zichtbaarheid naar een merk dat verkoopt.", naar: "/project/vdz-brigade-website" },
  { klant: "kWh Garant", waarde: "100", eenheid: "leads in één week", regel: "Meta en Odoo gekoppeld. Elke offerteaanvraag komt direct in hun OS binnen.", naar: "/project/kwh-garant-website" },
];

export default function ResultatenCijfers() {
  return (
    <Bento id="resultaten-cijfers" className="sn-resultaten-cijfers">
      {CIJFERS.map((c) => (
        <Tegel key={c.klant} kop={c.klant} breed={6} className="sn-resultaat-groot">
          <p className="sn-resultaat-cijfer"><b translate="no">{c.waarde}</b><span>{c.eenheid}</span></p>
          <p className="sn-tegel-tekst">{c.regel}</p>
          <div className="sn-tegel-onder"><TextLink to={c.naar}>Bekijk de case</TextLink></div>
        </Tegel>
      ))}
    </Bento>
  );
}
