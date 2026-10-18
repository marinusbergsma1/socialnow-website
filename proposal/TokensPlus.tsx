import React from "react";
import { Bento, Tegel } from "./Bento";
import { Action } from "./ui";
import { GRATIS_OS_URL } from "./os-entry";
import "./tokens-plus.css";

// 18 oktober 2026 (Marinus): "tokens kopen moet een groter onderdeel zijn". Het aanbod in vier lagen: Gratis tot 10 GB,
// Plus voor €20 per maand (start pas boven 10 GB, met maandelijks rendertegoed in de merkgetrainde Studio), Tokens voor
// extra renders, en het OS op maat vanaf €10.000. Op /prijzen staan de vier lagen en het tokenblok; op de homepage staat
// een kort tokenblok direct na de vier onderdelen van het OS, waar de Studio zit.
//
// Alle tokenbedragen komen uit de OS-code (Flyinghighscalingup/socialnow-app, tak os, 18 oktober 2026):
//   api/_studio-tokens.js   TOKEN_BUNDLES: €10 = 1.000 tokens, €25 = 2.500, €50 = 5.000. Eén token is één eurocent
//                           rendertegoed. Afrekenen via Stripe, btw exclusief (tax_behavior exclusive).
//   api/_prijzen.js         de klant betaalt de normale prijs van het model maal MARGE_FACTOR (2):
//                           Nano Banana Pro 2K 14 → 28, Nano Banana 2 2K 11 → 22, Nano Banana 2 Lite 4 → 8,
//                           GPT Image 2.5 9 → 18; video per seconde Veo 3.1 Fast 10 → 20, Veo 3.1 Lite 5 → 10,
//                           Seedance 2.5 26 → 52, MiniMax H3 8 → 16. HTML: tien per dag gratis.
//   api/_rendertegoed.js    de eerste beeldrenders per werkruimte zijn gratis (aantal per omgeving instelbaar, dus
//                           hier zonder getal).
// Verandert een prijs in het OS, dan verandert hij hier ook. Geen geschatte of verzonnen bedragen.
//
// VOORLOPIG: Plus. Alleen "€20 per maand" stond al op de site. Hoeveel opslag en hoeveel rendertegoed Plus per maand
// geeft, bevestigt de sessie "Prijsmodel en marges"; tot dan staan die zonder getal op de site. Vul ze hier in zodra
// ze vastliggen, en voeg de zinnen toe aan proposal/i18n/*.json.
export const PLUS = { prijs: "€20", opslagGB: null as number | null, tegoedTokens: null as number | null };

const PAKKETTEN = [
  { prijs: "€10", tokens: "1.000 tokens", beeld: "Tot 35 beelden met Nano Banana Pro", video: "of 6 video's van 8 seconden met Veo 3.1 Fast", soort: "vlak" as const },
  { prijs: "€25", tokens: "2.500 tokens", beeld: "Tot 89 beelden met Nano Banana Pro", video: "of 15 video's van 8 seconden met Veo 3.1 Fast", soort: "groen" as const },
  { prijs: "€50", tokens: "5.000 tokens", beeld: "Tot 178 beelden met Nano Banana Pro", video: "of 31 video's van 8 seconden met Veo 3.1 Fast", soort: "vlak" as const },
];

const BEELD = [
  { wat: "Nano Banana 2 Lite", maat: "Snelle schets", tokens: "8 tokens" },
  { wat: "GPT Image 2.5", maat: "Beeld met je merkreferenties", tokens: "18 tokens" },
  { wat: "Nano Banana 2", maat: "Beeld in 2K", tokens: "22 tokens" },
  { wat: "Nano Banana Pro", maat: "Merkbeeld in 2K", tokens: "28 tokens" },
];

const VIDEO = [
  { wat: "Veo 3.1 Lite", maat: "Video van 8 seconden", tokens: "80 tokens" },
  { wat: "MiniMax H3", maat: "Video van 5 seconden", tokens: "80 tokens" },
  { wat: "Veo 3.1 Fast", maat: "Video van 8 seconden met geluid", tokens: "160 tokens" },
  { wat: "Seedance 2.5", maat: "Video van 5 seconden met geluid", tokens: "260 tokens" },
];

const PLAN_CALL = `/contact?onderwerp=${encodeURIComponent("Plan een call: OS op maat")}`;

function Regels({ items }: { items: string[] }) {
  return (
    <ul className="tp-regels">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function Bedrag({ prijs, per, vanaf = false }: { prijs: string; per: string; vanaf?: boolean }) {
  return (
    <p className="tp-bedrag">
      {vanaf && <small>vanaf</small>}
      <strong>{prijs}</strong>
      <span>{per}</span>
    </p>
  );
}

function RenderLijst({ titel, items }: { titel: string; items: { wat: string; maat: string; tokens: string }[] }) {
  return (
    <div className="tp-lijst">
      <h3>{titel}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.wat}>
            <span className="tp-lijst-wat">
              <b translate="no">{item.wat}</b>
              <small>{item.maat}</small>
            </span>
            <span className="tp-lijst-prijs">{item.tokens}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// De incassozin staat op één plek, zodat hij op de homepage en op /prijzen altijd hetzelfde zegt.
function Incasso() {
  return <p className="tp-juridisch">De incasso start alleen nadat je daar zelf akkoord voor hebt gegeven. Zolang je onder 10 GB blijft, schrijven we niets af. Plus is maandelijks opzegbaar.</p>;
}

// /prijzen: het aanbod in vier lagen.
export function PrijsLagen() {
  return (
    <Bento id="prijs-lagen" label="Ons aanbod in vier lagen" titel={<>Gratis beginnen.<br /><span>Betalen als je groeit.</span></>} className="tp">
      <Tegel kop="Gratis" breed={3} className="tp-laag">
        <Bedrag prijs="€0" per="tot 10 GB opslag" />
        <Regels items={["Het OS met Studio, CRM, Social en Milo", "Connect: de juiste experts voor jouw bedrijf", "Je eerste beeldrenders zijn gratis", "Tien HTML-uitingen per dag zijn gratis"]} />
        <div className="sn-tegel-onder"><Action href={GRATIS_OS_URL}>Probeer het OS gratis</Action></div>
      </Tegel>
      <Tegel kop="Plus" breed={3} soort="groen" className="tp-laag is-plus">
        <Bedrag prijs={PLUS.prijs} per="per maand" />
        <p className="tp-start">Start vanzelf zodra je boven 10 GB komt</p>
        <Regels items={["Meer opslag voor je merk en je content", "Maandelijks rendertegoed in je merkgetrainde Studio", "Automatische incasso via je bank", "Maandelijks opzegbaar"]} />
        <Incasso />
      </Tegel>
      <Tegel kop="Tokens" breed={3} className="tp-laag">
        <Bedrag prijs="€10" per="voor 1.000 tokens" vanaf />
        <Regels items={["Extra renders bovenop je tegoed", "Video en premium modellen", "Eenmalig, geen abonnement", "Eén token is één cent rendertegoed"]} />
        <div className="sn-tegel-onder"><a className="tp-link" href="#tokens">Wat krijg je per pakket</a></div>
      </Tegel>
      <Tegel kop="OS op maat" breed={3} className="tp-laag">
        {/* 29 september 2026 (Marinus): het OS op maat zakelijk, geen reuzencijfer (scripts/check-aanbod.mjs). */}
        <p className="tp-zakelijk">Vanaf €10.000 · prijs op aanvraag</p>
        <Regels items={["Je eigen OS rond je bedrijf", "Milo-agents op je eigen data", "Developers en dataspecialisten van ons team"]} />
        <div className="sn-tegel-onder"><Action to={PLAN_CALL} secondary>Plan een call</Action></div>
      </Tegel>
    </Bento>
  );
}

// /prijzen: tokens kopen, met wat je per pakket krijgt en wat een render kost.
export function TokenPakketten() {
  return (
    <Bento id="tokens" label="Tokens voor de Studio" titel={<>Tokens kopen.<br /><span>Meer maken in je eigen merk.</span></>} className="tp">
      {PAKKETTEN.map((pakket) => (
        <Tegel key={pakket.prijs} kop={pakket.tokens} breed={4} soort={pakket.soort} className="tp-pakket">
          <Bedrag prijs={pakket.prijs} per="eenmalig, excl. btw" />
          <p className="tp-krijg">{pakket.beeld}</p>
          <p className="tp-of">{pakket.video}</p>
        </Tegel>
      ))}
      <Tegel kop="Wat kost een render?" breed={8} className="tp-kosten">
        <div className="tp-kosten-raster">
          <RenderLijst titel="Beeld" items={BEELD} />
          <RenderLijst titel="Video" items={VIDEO} />
        </div>
      </Tegel>
      <Tegel kop="Zo werkt het" breed={4} className="tp-hoe">
        <Regels items={["Je kiest het model, de Studio laat de prijs zien voordat je rendert", "Je betaalt alleen voor wat je rendert", "Tien HTML-uitingen per dag zijn gratis"]} />
        <div className="sn-tegel-onder"><Action href={GRATIS_OS_URL}>Tokens kopen in je OS</Action></div>
      </Tegel>
    </Bento>
  );
}

// Homepage: kort tokenblok direct na de vier onderdelen van het OS.
export function TokensHome() {
  return (
    <Bento id="studio-tokens" label="Renderen in de Studio" titel={<>Maak meer in je merk.<br /><span>Betaal alleen per render.</span></>} className="tp tp-home">
      <Tegel kop="Wat kost een render?" breed={5} soort="groen">
        <RenderLijst titel="Voorbeelden" items={[BEELD[3], BEELD[0], VIDEO[2]]} />
        <p className="tp-klein">Eén token is één cent. Je eerste beeldrenders zijn gratis.</p>
      </Tegel>
      <Tegel kop="Tokens kopen" breed={4}>
        <ul className="tp-pakjes">
          {PAKKETTEN.map((pakket) => (
            <li key={pakket.prijs}>
              <strong>{pakket.prijs}</strong>
              <span>{pakket.tokens}</span>
              <small>{pakket.beeld}</small>
            </li>
          ))}
        </ul>
        <div className="sn-tegel-onder"><Action to="/prijzen#tokens" secondary>Bekijk alle prijzen</Action></div>
      </Tegel>
      <Tegel kop="Plus" breed={3} className="tp-laag is-plus">
        <Bedrag prijs={PLUS.prijs} per="per maand" />
        <p className="tp-start">Start vanzelf zodra je boven 10 GB komt</p>
        <Regels items={["Meer opslag", "Maandelijks rendertegoed", "Maandelijks opzegbaar"]} />
        <Incasso />
      </Tegel>
    </Bento>
  );
}
