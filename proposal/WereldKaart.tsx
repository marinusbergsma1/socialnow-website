import React from "react";
import { BOVEN, RASTER, STAP } from "./wereld-raster";
import "./wereldkaart.css";

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

const kolom = (lon: number) => (lon + 180) / STAP - 0.5;
const rij = (lat: number) => (BOVEN - lat) / STAP;
const BREED = RASTER[0].length;
const HOOG = RASTER.length;

const LAND = RASTER.flatMap((regel, y) =>
  [...regel].flatMap((teken, x) => (teken === "1" ? [`M${x} ${y}h0`] : [])),
).join("");

export default function WereldKaart() {
  const thuis = PLEKKEN.find((plek) => plek.thuis)!;
  const tx = kolom(thuis.lon);
  const ty = rij(thuis.lat);
  return (
    <section className="sn-wereld" aria-labelledby="sn-wereld-kop">
      <div className="sn-wereld-in">
        <div className="sn-wereld-tekst">
          <span className="sn-wereld-label" translate="no">Spreading the message</span>
          <h2 id="sn-wereld-kop" translate="no">Let’s keep Europe social. Now.</h2>
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
            {PLEKKEN.filter((plek) => !plek.thuis).map((plek) => {
              const x = kolom(plek.lon);
              const y = rij(plek.lat);
              const midden = { x: (tx + x) / 2, y: Math.min(ty, y) - Math.max(3, Math.abs(x - tx) * 0.18) };
              return <path key={plek.naam} className="sn-wereld-boog" d={`M${tx} ${ty}Q${midden.x} ${midden.y} ${x} ${y}`} />;
            })}
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
