import React from "react";
import { Bento, Tegel } from "./Bento";
import { ClientLogos, TextLink } from "./ui";
import TeamTrackrecord from "./TeamTrackrecord";

// 18 oktober 2026 (Marinus): "Bij resultaten graag ook even bovenaan die 100k en de 100 leads in 1 week" en daarna over
// de oude opening ("Ons werk / Ideeën die vorm hebben gekregen", een groot gat, dan nog een intro): "Dit triggert mij niet
// zo." Nu één opening: label Resultaten, een kop over resultaten, de cijfers als blikvanger, de merkenbalk en dan meteen
// de cases. Alleen cijfers die al op de site staan (Bereikt.tsx, data/projects.ts), elk met een link naar de eigen case.
// De merkenbalk is de bestaande ClientLogos (content.ts): Sony, RAVEG en VASTIQ hebben geen logobestand en staan er dus niet in.
const CIJFERS = [
  { klant: "VDZ Brigade", waarde: "€100K", eenheid: "omzet voor VDZ", regel: "Van nul online zichtbaarheid naar een merk dat verkoopt.", naar: "/project/vdz-brigade-website" },
  { klant: "kWh Garant", waarde: "100", eenheid: "leads in één week", regel: "Meta en Odoo gekoppeld. Elke offerteaanvraag komt direct in hun OS binnen.", naar: "/project/kwh-garant-website" },
  { klant: "Il Gordo", waarde: "100", eenheid: "Lighthouse SEO", regel: "Snel, vindbaar, gebouwd door ons team.", naar: "/project/ilgordo-website" },
];

export default function ResultatenHero() {
  return (
    <div className="sn-resultaten-hero">
      <header className="h-page-heading h-wrap sn-resultaten-kop">
        <p className="h-eyebrow">Resultaten</p>
        <h1>Wat ons werk oplevert.<br /><span>In cijfers.</span></h1>
      </header>
      <Bento id="resultaten-cijfers" className="sn-resultaten-cijfers" swipe>
        {CIJFERS.map((c) => (
          <Tegel key={c.klant} kop={c.klant} breed={4} className="sn-resultaat-groot">
            <p className="sn-resultaat-cijfer"><b translate="no">{c.waarde}</b><span translate={c.eenheid === "Lighthouse SEO" ? "no" : undefined}>{c.eenheid}</span></p>
            <p className="sn-tegel-tekst">{c.regel}</p>
            <div className="sn-tegel-onder"><TextLink to={c.naar}>Bekijk de case</TextLink></div>
          </Tegel>
        ))}
      </Bento>
      {/* 18 oktober 2026 (Marinus): "Neem daarbij ook andere resultaten van mijn team mee." */}
      <TeamTrackrecord />
      <ClientLogos />
    </div>
  );
}
