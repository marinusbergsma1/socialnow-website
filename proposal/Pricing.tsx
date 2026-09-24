import React from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Action } from "./ui";
import { actieLoopt } from "./ConsentPopup";
import "./pricing.css";

// 23 september 2026 (Marinus): gratis starten is het grote verhaal, de prijzen staan klein en
// helder eronder. Elk maandpakket heeft een custom OS; vanaf drie maanden hoort de complete
// website erbij. Het team per pakket is een rij rondjes die uitklapt.
const PROBEER_URL = "https://app.socialnow.nl/login/?bron=prijzen";

type Lid = { naam: string; rol: string; foto: string };
const TEAM: Record<string, Lid> = {
  marinus: { naam: "Marinus Bergsma", rol: "Founder & Creative Director", foto: "marinus" },
  jos: { naam: "Jos Hollenberg", rol: "Meta Ads", foto: "jos" },
  nick: { naam: "Nick van Keulen", rol: "Google Ads Expert", foto: "nick" },
  steef: { naam: "Steef Komen", rol: "Partner · Accountancy & Data", foto: "steef" },
  sid: { naam: "Sid van Kalken", rol: "Webdeveloper", foto: "sid" },
};

type Pakket = {
  naam: string;
  prijs: string;
  per: string;
  belofte: string;
  punten: { tekst: string; erfenis?: boolean; sterk?: boolean }[];
  team: string[];
  nieuw?: string;
  kleur: string;
  actie: string;
  onderwerp: string;
  top?: boolean;
};

const MAAND: Pakket[] = [
  {
    naam: "Content",
    prijs: "€2.000",
    per: "per maand",
    belofte: "Altijd aanwezig, altijd in je merk.",
    punten: [
      { tekst: "Custom OS met Studio en Milo", sterk: true },
      { tekst: "Content gemaakt in je eigen merk" },
      { tekst: "Voor je gepland en geplaatst" },
    ],
    team: ["marinus"],
    kleur: "var(--prijs-geel)",
    actie: "Kies Content",
    onderwerp: "Pakket Content",
  },
  {
    naam: "Content + Meta",
    prijs: "€3.000",
    per: "per maand",
    belofte: "Bereik de juiste mensen op Instagram en Facebook.",
    punten: [
      { tekst: "Alles uit Content", erfenis: true },
      { tekst: "Meta Ads opgezet en beheerd", sterk: true },
      { tekst: "Leads direct in je CRM" },
    ],
    team: ["marinus", "jos"],
    nieuw: "jos",
    kleur: "var(--prijs-roze)",
    actie: "Kies Meta",
    onderwerp: "Pakket Content + Meta",
  },
  {
    naam: "Meta + Google",
    prijs: "€3.500",
    per: "per maand",
    belofte: "Gevonden worden op het moment dat ze zoeken.",
    punten: [
      { tekst: "Alles uit Content + Meta", erfenis: true },
      { tekst: "Google Ads opgezet en beheerd", sterk: true },
      { tekst: "Eén rapport voor elk kanaal" },
    ],
    team: ["marinus", "jos", "nick"],
    nieuw: "nick",
    kleur: "var(--prijs-blauw)",
    actie: "Kies Meta + Google",
    onderwerp: "Pakket Meta + Google",
  },
  {
    naam: "Compleet",
    prijs: "€4.000",
    per: "per maand",
    belofte: "Marketing en financiën, volledig geregeld.",
    punten: [
      { tekst: "Alles uit Meta + Google", erfenis: true },
      { tekst: "Boekhouding en accounting", sterk: true },
      { tekst: "Complete Odoo-inrichting" },
    ],
    team: ["marinus", "jos", "nick", "steef"],
    nieuw: "steef",
    kleur: "var(--prijs-groen)",
    actie: "Kies Compleet",
    onderwerp: "Pakket Compleet",
    top: true,
  },
];

const LOS: Pakket[] = [
  {
    naam: "Website",
    prijs: "vanaf €1.500",
    per: "eenmalig",
    belofte: "Een complete website die klanten oplevert.",
    punten: [
      { tekst: "Complete website in je eigen merk", sterk: true },
      { tekst: "De data live in je OS" },
      { tekst: "SEO en snelheid goed ingericht" },
    ],
    team: ["marinus", "sid"],
    nieuw: "sid",
    kleur: "var(--prijs-groen)",
    actie: "Begin met een website",
    onderwerp: "Website",
  },
  {
    naam: "Custom OS",
    prijs: "Op aanvraag",
    per: "samen afgestemd",
    belofte: "Een systeem gebouwd rond één bedrijf.",
    punten: [
      { tekst: "Je eigen OS op je eigen Odoo", sterk: true },
      { tekst: "Dashboard, CRM, Studio en website" },
      { tekst: "Milo-agents op je eigen data" },
    ],
    team: ["marinus", "steef"],
    kleur: "var(--prijs-roze)",
    actie: "Laten we praten",
    onderwerp: "Custom OS",
  },
];

const GRATIS = [
  { titel: "Een complete demowebsite", tekst: "Geen schets. Een volledige website in je merk, klaar om live te gaan." },
  { titel: "Een basic rebranding", tekst: "Kleuren, logo en stijl, strak neergezet." },
  { titel: "Je OS als proof of concept", tekst: "Verkoop, merk, social en website op één scherm, met je eigen data." },
];

const IN_OS = [
  { kleur: "var(--prijs-groen)", titel: "Dashboard", tekst: "Live verkoop, offertes en klanten uit je Odoo." },
  { kleur: "var(--prijs-blauw)", titel: "Branding", tekst: "Scant je site: kleuren, logo en beeld als één merkprofiel." },
  { kleur: "var(--prijs-geel)", titel: "Studio", tekst: "Posts en advertenties in je eigen merk. Download als jpg, mp4 of html." },
  { kleur: "var(--prijs-roze)", titel: "Social", tekst: "Koppel je kanalen, plan in de agenda en post." },
  { kleur: "var(--prijs-blauw)", titel: "CRM", tekst: "Leads, opvolging, offertes en facturen op één plek." },
  { kleur: "var(--prijs-groen)", titel: "Website", tekst: "Pas je Odoo-site aan vanuit de chat, of krijg een gratis demosite." },
  { kleur: "var(--prijs-geel)", titel: "Milo", tekst: "Vier AI-agents die je eigen data lezen en de volgende stap voorstellen." },
  { kleur: "var(--prijs-roze)", titel: "Overal", tekst: "Browser en telefoon, zes talen, je data blijft van jou." },
];

function Team({ ids, nieuw }: { ids: string[]; nieuw?: string }) {
  const leden = ids.map((id) => TEAM[id]);
  const namen = leden.map((lid) => lid.naam.split(" ")[0]);
  return (
    <details className="prijs-team">
      <summary>
        <span className="prijs-rondjes" aria-hidden="true">
          {leden.map((lid, i) => (
            <img key={lid.foto} className={ids[i] === nieuw ? "is-nieuw" : undefined} src={`/images/prijzen/${lid.foto}.webp`} alt="" width="28" height="28" />
          ))}
        </span>
        <span className="prijs-namen" translate="no">{namen.join(" · ")}</span>
        <ChevronDown className="prijs-pijl" size={15} aria-hidden="true" />
      </summary>
      <ul className="prijs-leden">
        {leden.map((lid) => (
          <li key={lid.foto}>
            <img src={`/images/prijzen/${lid.foto}.webp`} alt="" width="30" height="30" />
            <span>
              <b translate="no">{lid.naam}</b>
              <small>{lid.rol}</small>
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}

function Kaart({ pakket, breed = false }: { pakket: Pakket; breed?: boolean }) {
  return (
    <article className={`prijs-kaart${pakket.top ? " is-top" : ""}${breed ? " is-breed" : ""}`} style={{ "--kleur": pakket.kleur } as React.CSSProperties}>
      {pakket.top && <span className="prijs-vlag">Meest compleet</span>}
      <div className="prijs-kop">
        <h3>{pakket.naam}</h3>
        <p className="prijs-bedrag">
          <strong>{pakket.prijs}</strong>
          <span>{pakket.per}</span>
        </p>
        <p className="prijs-belofte">{pakket.belofte}</p>
      </div>
      <ul className="prijs-punten">
        {pakket.punten.map((punt) => (
          <li key={punt.tekst} className={punt.erfenis ? "is-erfenis" : punt.sterk ? "is-sterk" : undefined}>
            {punt.tekst}
          </li>
        ))}
      </ul>
      <div className="prijs-voet">
        <Team ids={pakket.team} nieuw={pakket.nieuw} />
        <Action to={`/contact?onderwerp=${encodeURIComponent(pakket.onderwerp)}`} secondary={!pakket.top}>
          {pakket.actie}
        </Action>
      </div>
    </article>
  );
}

export default function Pricing() {
  const actie = actieLoopt();
  return (
    <div className="prijs h-wrap">
      <section className="prijs-gratis" aria-labelledby="prijs-gratis-titel">
        <div className="prijs-gratis-boven">
          <div>
            <p className="h-eyebrow prijs-groen-tekst">Hier begin je · 100% gratis</p>
            <h1 id="prijs-gratis-titel">
              We beginnen
              <br />
              <em>gratis.</em>
            </h1>
          </div>
          <div className="prijs-gratis-tekst">
            <p className="prijs-echt">
              Helemaal gratis. <em>Echt waar.</em>
            </p>
            <p className="prijs-lead">Waar anderen duizenden euro’s voor vragen, betaal jij €0. Wij bouwen je demowebsite en rebranding, en je eigen OS draait vandaag al op je eigen data. Daarna beslis jij.</p>
            <div className="prijs-knoppen">
              <a className="os-claim sn-btn3d h-button" href={PROBEER_URL}>
                <span className="sn-btn3d-sheen" />
                <span>Probeer het OS</span>
                <span className="h-button-icon">
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </a>
              <Action to={`/contact?onderwerp=${encodeURIComponent("Gratis demowebsite")}`} secondary>
                Gratis demowebsite aanvragen
              </Action>
            </div>
            <p className="prijs-klein">Geen creditcard. Geen verplichting. Geen addertje.</p>
          </div>
        </div>

        <div className="prijs-cadeaus">
          {GRATIS.map((item) => (
            <div className="prijs-cadeau" key={item.titel}>
              <p className="prijs-nul">
                €0 <span>Gratis</span>
              </p>
              <h3>{item.titel}</h3>
              <p>{item.tekst}</p>
            </div>
          ))}
        </div>

        {actie && (
          <div className="prijs-actie">
            <span className="prijs-actie-label">Winactie</span>
            <p>
              <strong>Win een custom OS ter waarde van <b className="prijs-bedrag-groot">€10.000</b></strong>
              <span>Maak een post in je gratis OS, plaats hem op LinkedIn en tag SocialNow.nl en Komen Consultancy, dan doe je mee. Dat kan tot en met zaterdag 26 september. De winnaar maken we zondag 27 september bekend.</span>
            </p>
          </div>
        )}

        <div className="prijs-inhoud">
          <div className="prijs-inhoud-kop">
            <h2>Dit zit al in je gratis OS</h2>
            <a className="prijs-link" href={PROBEER_URL}>
              <span translate="no">app.socialnow.nl</span>
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
          <ul className="prijs-os">
            {IN_OS.map((item) => (
              <li key={item.titel} style={{ "--kleur": item.kleur } as React.CSSProperties}>
                <i aria-hidden="true" />
                <b>{item.titel}</b>
                <span>{item.tekst}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="prijs-pakketten" aria-labelledby="prijs-pakketten-titel">
        <div className="prijs-pakketten-kop">
          <div>
            <p className="h-eyebrow">Maandpakketten</p>
            <h2 id="prijs-pakketten-titel">Groei met je team</h2>
          </div>
          <p>
            Elk maandpakket heeft je eigen custom OS. <strong>Drie maanden of langer? Dan hoort je complete website erbij.</strong>
          </p>
        </div>
        <div className="prijs-raster">
          {MAAND.map((pakket) => (
            <Kaart key={pakket.naam} pakket={pakket} />
          ))}
        </div>
        <div className="prijs-raster-los">
          {LOS.map((pakket) => (
            <Kaart key={pakket.naam} pakket={pakket} breed />
          ))}
        </div>
      </section>
    </div>
  );
}
