import React from "react";
import "./wereldkaart.css";
import { useWereldTellers } from "./tellers";
import type { Bediening } from "./WereldDoek";

// 11 oktober 2026 (stippenproject): de kaart zelf (WereldDoek.tsx) staat in het 32-px-sitegrid en laadt lui, met het
// landraster en de stippenmotor. Hier blijven de tekst, de tellers en de figuur met de juiste verhouding (geen verspringing).
const WereldDoek = React.lazy(() => import("./WereldDoek"));

// 5 oktober 2026 (Marinus): "Een klein kaartje met spreading the message en dan bolletjes waar het systeem gebruikt wordt
// over de hele wereld." Alleen plekken die we kunnen onderbouwen (keuze Marinus: bekende plekken):
// - Amsterdam: hoofdkantoor, klanten als Hajenius en Light Art Collection.
// - Brussel: Odoo Experience 2026, waar SocialNow OS werd gepresenteerd.
// - India: Odoo-implementatiepartners (Waqas van Indexworld via Steef, KoderXpert Technologies van de beurs).
// Nieuwe plek? Voeg hem hier toe, met de bron in een opmerking.
const PLEKKEN = [
  { naam: "Amsterdam", wat: "Hoofdkantoor en klanten", lon: 4.9, lat: 52.37, thuis: true },
  { naam: "Brussel", wat: "Odoo Experience 2026", lon: 4.35, lat: 50.85 },
  { naam: "India", wat: "Odoo-implementatiepartners", lon: 76.5, lat: 21.5 },
];

export default function WereldKaart() {
  const { creators, osGebruikers } = useWereldTellers();
  const getal = (n: number) => n.toLocaleString("nl-NL");
  const figuur = React.useRef<HTMLElement>(null), bediening = React.useRef<Bediening>({});
  // Pas na het monteren: de prerender en de eerste browserweergave blijven gelijk (lege figuur).
  const [klaar, setKlaar] = React.useState(false);
  React.useEffect(() => setKlaar(true), []);
  return (
    <section className="sn-wereld" aria-labelledby="sn-wereld-kop">
      <div className="sn-wereld-in">
        <div className="sn-wereld-tekst">
          <span className="sn-wereld-label" translate="no">Spreading the message</span>
          <h2 id="sn-wereld-kop" translate="no">Let’s keep the world social. Now.</h2>
          <dl className="sn-wereld-tellers" translate="no">
            <div><dt><i className="is-creator" aria-hidden="true" />Live creators</dt><dd>{getal(creators)}</dd></div>
            <div><dt><i className="is-os" aria-hidden="true" />Live OS users</dt><dd>{getal(osGebruikers)}</dd></div>
          </dl>
          <p>Hier zijn we al actief: met klanten, partners en op het podium.</p>
          <ul className="sn-wereld-lijst">
            {PLEKKEN.map((plek) => (
              <li key={plek.naam} onPointerEnter={() => bediening.current.golfVan?.(plek.naam)}>
                <i aria-hidden="true" className={plek.thuis ? "is-thuis" : undefined} />
                <b>{plek.naam}</b>
                <span>{plek.wat}</span>
              </li>
            ))}
          </ul>
          <span className="sn-wereld-voet" translate="no">Built in Amsterdam · Made for Europe</span>
        </div>
        {/* 5 oktober 2026 (Marinus): "Dit balkje hoeft niet zo. DIE BOOG." De gestippelde boog tussen de plekken is weg. */}
        <figure ref={figuur} className="sn-wereld-kaart" data-stap={8}>
          {klaar && (
            <React.Suspense fallback={null}>
              <WereldDoek creators={creators} osGebruikers={osGebruikers} plekken={PLEKKEN} figuur={figuur} bediening={bediening} />
            </React.Suspense>
          )}
        </figure>
      </div>
    </section>
  );
}
