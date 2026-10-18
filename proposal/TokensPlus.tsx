import React from "react";
import { Bento, Tegel } from "./Bento";
import { Action } from "./ui";
import { GRATIS_OS_URL } from "./os-entry";
import "./tokens-plus.css";

// 18 oktober 2026 (Marinus): "tokens kopen moet een groter onderdeel zijn". Dezelfde dag koos hij in de sessie
// "SocialNow header A/B test versies" het model hieronder, boven het conceptmodel met Plus voor €20 (socialnow-app #148):
//   - "Verder is alles maandelijks."
//   - Gratis tot 10 GB. Bij de aanmelding koppel je alvast je rekening met een SEPA-machtiging; onder 10 GB wordt niets
//     afgeschreven.
//   - Tokens per maand: 1.000 / 2.500 / 5.000 tokens voor €10 / €25 / €50.
//   - Hulppakketten vanaf €3.000 per maand: "het is van belang dat het duidelijk is dat je voor 3K een veilig persoonlijk
//     management and operation systeem hebt. Custom is bij alle pakketten naast gratis website inbegrepen."
//   - Geen los blok "OS op maat vanaf €10.000" meer. De prijs per hulppakket heeft hij nog niet gegeven, dus staat er
//     alleen "vanaf €3.000 per maand".
// Op /prijzen staan de drie lagen en het tokenblok. Op de homepage staat een kort tokenblok direct na de vier onderdelen
// van het OS, zonder eurobedragen: in de homepage-header staan bewust geen prijzen ("Die prijzen mag na het account
// aanmaken").
//
// Wat een render kost, komt uit de OS-code (Flyinghighscalingup/socialnow-app, tak os, 18 oktober 2026):
//   api/_studio-tokens.js   één token is één eurocent rendertegoed.
//   api/_prijzen.js         de klant betaalt de normale prijs van het model maal MARGE_FACTOR (2):
//                           Nano Banana Pro 2K 14 → 28, Nano Banana 2 2K 11 → 22, Nano Banana 2 Lite 4 → 8,
//                           GPT Image 2.5 9 → 18; video per seconde Veo 3.1 Fast 10 → 20, Veo 3.1 Lite 5 → 10,
//                           Seedance 2.5 26 → 52, MiniMax H3 8 → 16. HTML: tien per dag gratis.
//   api/_rendertegoed.js    de eerste beeldrenders per werkruimte zijn gratis (aantal per omgeving instelbaar, dus
//                           hier zonder getal).
// Verandert een prijs in het OS, dan verandert hij hier ook. Geen geschatte of verzonnen bedragen.
//
// Btw staat op één plek: excl. of incl. btw wacht nog op Marinus. Alle bedragen hieronder lezen BTW_PER_MAAND.
export const BTW_PER_MAAND = "per maand, excl. btw";

const PAKKETTEN = [
  { prijs: "€10", tokens: "1.000 tokens per maand", beeld: "Tot 35 beelden per maand met Nano Banana Pro", video: "of 6 video's van 8 seconden met Veo 3.1 Fast", soort: "vlak" as const },
  { prijs: "€25", tokens: "2.500 tokens per maand", beeld: "Tot 89 beelden per maand met Nano Banana Pro", video: "of 15 video's van 8 seconden met Veo 3.1 Fast", soort: "groen" as const },
  { prijs: "€50", tokens: "5.000 tokens per maand", beeld: "Tot 178 beelden per maand met Nano Banana Pro", video: "of 31 video's van 8 seconden met Veo 3.1 Fast", soort: "vlak" as const },
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

// De integrator koppelt dit bij het samenvoegen aan de boekingsroute van de sessie "Plan a call".
const PLAN_CALL = `/contact?onderwerp=${encodeURIComponent("Plan een call: hulppakket")}`;

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

// De machtigingszin staat op één plek, zodat hij op de homepage en op /prijzen altijd hetzelfde zegt. Hij volgt de
// homepage-header (variant B, proposal/HeaderBestaand.tsx).
function Machtiging() {
  return <p className="tp-juridisch">Bij je aanmelding koppel je alvast je rekening met een SEPA-machtiging. Zolang je onder 10 GB blijft, schrijven we niets af. Er wordt pas iets afgeschreven nadat je daar zelf uitdrukkelijk akkoord voor geeft, en alles is maandelijks opzegbaar.</p>;
}

// /prijzen: het aanbod in drie lagen.
export function PrijsLagen() {
  return (
    <Bento id="prijs-lagen" label="Ons aanbod in drie lagen" titel={<>Gratis beginnen.<br /><span>Alles verder per maand.</span></>} className="tp">
      <Tegel kop="Gratis" breed={4} className="tp-laag">
        <Bedrag prijs="€0" per="tot 10 GB opslag" />
        <Regels items={["Het OS met Studio, CRM, Social en Milo", "Connect: de juiste experts voor jouw bedrijf", "Je eerste beeldrenders zijn gratis", "Tien HTML-uitingen per dag zijn gratis"]} />
        <Machtiging />
        <div className="sn-tegel-onder"><Action href={GRATIS_OS_URL}>Probeer het OS gratis</Action></div>
      </Tegel>
      <Tegel kop="Tokens" breed={4} soort="groen" className="tp-laag is-plus">
        <Bedrag prijs="€10" per={BTW_PER_MAAND} vanaf />
        <p className="tp-start">1.000, 2.500 of 5.000 tokens per maand</p>
        <Regels items={["Rendertegoed in je merkgetrainde Studio", "Beeld, video en premium modellen", "Eén token is één cent rendertegoed", "Maandelijks opzegbaar"]} />
        <div className="sn-tegel-onder"><a className="tp-link" href="#tokens">Wat krijg je per pakket</a></div>
      </Tegel>
      <Tegel kop="Hulppakketten" breed={4} className="tp-laag">
        <Bedrag prijs="€3.000" per={BTW_PER_MAAND} vanaf />
        <p className="tp-start">Bij elk pakket: je eigen veilige management &amp; operations systeem en een gratis website.</p>
        <Regels items={["Custom OS, gebouwd rond je bedrijf", "Gratis website", "Connect: echte experts per pakket", "Persoonlijke call met uitleg van je systeem"]} />
        <div className="sn-tegel-onder">
          <Action to={PLAN_CALL}>Plan een call</Action>
          <a className="tp-link" href="#hulppakketten">Bekijk de pakketten</a>
        </div>
      </Tegel>
    </Bento>
  );
}

// /prijzen: tokens per maand, met wat je per pakket krijgt en wat een render kost.
export function TokenPakketten() {
  return (
    <Bento id="tokens" label="Tokens voor de Studio" titel={<>Tokens per maand.<br /><span>Meer maken in je eigen merk.</span></>} className="tp">
      {PAKKETTEN.map((pakket) => (
        <Tegel key={pakket.prijs} kop={pakket.tokens} breed={4} soort={pakket.soort} className="tp-pakket">
          <Bedrag prijs={pakket.prijs} per={BTW_PER_MAAND} />
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
        <Regels items={["Je kiest het model, de Studio laat de prijs zien voordat je rendert", "Je eerste beeldrenders zijn gratis", "Tien HTML-uitingen per dag zijn gratis", "Maandelijks opzegbaar"]} />
        <div className="sn-tegel-onder"><Action href={GRATIS_OS_URL}>Kies je tokenpakket in je OS</Action></div>
      </Tegel>
    </Bento>
  );
}

// Homepage: kort tokenblok direct na de vier onderdelen van het OS, zonder eurobedragen.
export function TokensHome() {
  return (
    <Bento id="studio-tokens" label="Renderen in de Studio" titel={<>Maak meer in je merk.<br /><span>Met tokens per maand.</span></>} className="tp tp-home">
      <Tegel kop="Wat kost een render?" breed={5} soort="groen">
        <RenderLijst titel="Voorbeelden" items={[BEELD[3], BEELD[0], VIDEO[2]]} />
        <p className="tp-klein">Je eerste beeldrenders zijn gratis.</p>
      </Tegel>
      <Tegel kop="Tokens per maand" breed={4}>
        <ul className="tp-pakjes">
          {PAKKETTEN.map((pakket) => (
            <li key={pakket.prijs}>
              <span>{pakket.tokens}</span>
              <small>{pakket.beeld}</small>
            </li>
          ))}
        </ul>
        <div className="sn-tegel-onder"><Action to="/prijzen#tokens" secondary>Bekijk alle prijzen</Action></div>
      </Tegel>
      <Tegel kop="Gratis tot 10 GB" breed={3} className="tp-laag">
        <Regels items={["Het OS met Studio, CRM, Social en Milo", "Je eerste beeldrenders zijn gratis", "Maandelijks opzegbaar"]} />
        <Machtiging />
        <div className="sn-tegel-onder"><Action href={GRATIS_OS_URL}>Probeer het OS gratis</Action></div>
      </Tegel>
    </Bento>
  );
}
