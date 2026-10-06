import React from "react";
import { BOVEN, RASTER, STAP } from "./wereld-raster";
import "./wereldkaart.css";
import { useWereldTellers } from "./tellers";

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

// 5 oktober 2026 (Marinus): "Let's keep the world. En dan Live Creators die zijn groen en business owners blauwe stipjes."
// Elke creator is een groene stip, elke OS-gebruiker (business owner) een blauwe. Het aantal stippen loopt mee met de
// tellers in tellers.ts. De plek van een stip is een spreiding over de markten hieronder, geen echte locatie van iemand.
const OS_MARKTEN: [lon: number, lat: number, gewicht: number, spreiding: number][] = [
  [4.5, 50.8, 16, 2.5], [2.2, 46.6, 10, 3.5], [-3.7, 40.2, 8, 3.5], [10, 51, 6, 3], [12.5, 42.8, 4, 2.5], [-1.5, 52.5, 3, 2.5],
  [77, 22, 18, 6], [-95, 38, 8, 11], [-101, 22, 6, 4.5], [-48, -15, 3, 6], [50, 24, 4, 4], [-7, 32, 2, 2.5], [145, -33, 1, 4],
];
const CREATOR_MARKTEN: [lon: number, lat: number, gewicht: number, spreiding: number][] = [
  [5, 52.2, 20, 2], [4.5, 50.8, 6, 2], [10, 51, 5, 3.5], [2.2, 46.6, 5, 3.5], [-3.7, 40.2, 4, 3.5], [-1.5, 52.5, 5, 2.5],
  [-80, 38, 5, 9], [77, 20, 4, 6], [-48, -15, 3, 6], [145, -33, 2, 4],
];

const kolom = (lon: number) => (lon + 180) / STAP - 0.5;
const rij = (lat: number) => (BOVEN - lat) / STAP;
const BREED = RASTER[0].length;
const HOOG = RASTER.length;

const LAND = RASTER.flatMap((regel, y) =>
  [...regel].flatMap((teken, x) => (teken === "1" ? [`M${x} ${y}h0`] : [])),
).join("");

const isLand = (x: number, y: number) => RASTER[Math.round(y)]?.[Math.round(x)] === "1";

// Vaste, herhaalbare spreiding: stip n staat altijd op dezelfde plek, ook in de prerender en na een herlaadbeurt.
function spreiding(markten: [number, number, number, number][], aantal: number, zaadStart: number) {
  let zaad = zaadStart;
  const toeval = () => ((zaad = (zaad * 1664525 + 1013904223) >>> 0) / 4294967296);
  const normaal = () => Math.sqrt(-2 * Math.log(toeval() || 1e-9)) * Math.cos(2 * Math.PI * toeval());
  const totaal = markten.reduce((som, markt) => som + markt[2], 0);
  const punten: string[] = [];
  for (let poging = 0; punten.length < aantal && poging < aantal * 60; poging++) {
    let keuze = toeval() * totaal;
    const markt = markten.find((m) => (keuze -= m[2]) < 0) ?? markten[0];
    const x = kolom(markt[0] + normaal() * markt[3]);
    const y = rij(markt[1] + normaal() * markt[3] * 0.7);
    if (isLand(x, y)) punten.push(`M${x.toFixed(2)} ${y.toFixed(2)}h0`);
  }
  return punten;
}
const MAX_STIPPEN = 6000;

export default function WereldKaart() {
  const { creators, osGebruikers } = useWereldTellers();
  const alleCreators = React.useMemo(() => spreiding(CREATOR_MARKTEN, MAX_STIPPEN, 356), []);
  const alleOs = React.useMemo(() => spreiding(OS_MARKTEN, MAX_STIPPEN, 1125), []);
  const getal = (n: number) => n.toLocaleString("nl-NL");
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
              <li key={plek.naam}>
                <i aria-hidden="true" className={plek.thuis ? "is-thuis" : undefined} />
                <b>{plek.naam}</b>
                <span>{plek.wat}</span>
              </li>
            ))}
          </ul>
          <span className="sn-wereld-voet" translate="no">Built in Amsterdam · Made for Europe</span>
        </div>
        <figure className="sn-wereld-kaart">
          <svg viewBox={`-1 -1 ${BREED + 2} ${HOOG + 2}`} role="img" aria-label="Wereldkaart met de plekken waar SocialNow actief is">
            <path d={LAND} className="sn-wereld-land" />
            <path d={alleOs.slice(0, osGebruikers).join("")} className="sn-wereld-gebruikers is-os" />
            <path d={alleCreators.slice(0, creators).join("")} className="sn-wereld-gebruikers is-creator" />
            {/* 5 oktober 2026 (Marinus): "Dit balkje hoeft niet zo. DIE BOOG." De gestippelde boog tussen de plekken is weg. */}
            {PLEKKEN.map((plek) => (
              <g key={plek.naam} transform={`translate(${kolom(plek.lon)} ${rij(plek.lat)})`} className={plek.thuis ? "sn-wereld-stip is-thuis" : "sn-wereld-stip"}>
                <circle className="sn-wereld-puls" r="1.6" />
                <circle r={plek.thuis ? 1.15 : 0.95} />
              </g>
            ))}
          </svg>
        </figure>
      </div>
    </section>
  );
}
