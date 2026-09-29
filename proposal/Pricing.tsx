import React from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Action } from "./ui";
import { GRATIS_OS_URL } from "./os-entry";
import { useLanguage } from "./i18n/context";
import "./pricing.css";

// 23 september 2026 (Marinus): gratis starten is het grote verhaal, de prijzen staan klein en
// helder eronder. Elk maandpakket heeft een custom OS; vanaf drie maanden hoort de complete
// website erbij. Het team per pakket is een rij rondjes die uitklapt.
// 28 september 2026 (Marinus): elk pakket €2.000 duurder. Het OS op maat (vanaf €10.000) is het eerste
// en grootste blok; alle andere pakketten zijn een extra laag bovenop de gratis versie. Sergio bij Meta Ads.
// 28 september 2026 (Marinus, het verhaal): "Probeer het OS gratis" gaat rechtstreeks naar de login van het gratis OS.
// 29 september 2026 (Marinus): "10.000 gewoon niet zo schreeuwerig maar juist zakelijk vanaf maken. En daarna die
// goedkopere pakketten met de prijs per maand voor minimaal 3 maanden incl. zo'n custom os en complete rebranding en
// website met persoonlijke call voor systeem uitleg." Het bedrag van het OS op maat is één rustige regel; elk
// maandpakket loopt minimaal drie maanden en bevat custom OS, complete rebranding, website en een uitlegcall. Het losse
// websiteblok vervalt, want de website zit nu in elk pakket.
const PROBEER_URL = GRATIS_OS_URL;

type Lid = { naam: string; rol: string; foto: string };
const TEAM: Record<string, Lid> = {
  marinus: { naam: "Marinus Bergsma", rol: "Founder & CEO", foto: "marinus" },
  jos: { naam: "Jos Hollenberg", rol: "Head of Meta Ads", foto: "jos" },
  sergio: { naam: "Sergio Jovovic", rol: "Meta Ads Specialist", foto: "sergio" },
  nick: { naam: "Nick van Keulen", rol: "Head of Google Ads & Search", foto: "nick" },
  steef: { naam: "Steef Komen", rol: "Partner · Head of Finance, Data & AI Payments", foto: "steef" },
  sid: { naam: "Sid van Kalken", rol: "Head of Web Development & AI Payments · Attesso", foto: "sid" },
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
    prijs: "€4.000",
    per: "per maand",
    belofte: "Altijd aanwezig, altijd in je merk.",
    punten: [
      { tekst: "Bovenop je gratis OS met Studio en Milo", sterk: true },
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
    prijs: "€5.000",
    per: "per maand",
    belofte: "Bereik de juiste mensen op Instagram en Facebook.",
    punten: [
      { tekst: "Alles uit Content", erfenis: true },
      { tekst: "Meta Ads opgezet en beheerd", sterk: true },
      { tekst: "Leads direct in je CRM" },
    ],
    team: ["marinus", "jos", "sergio"],
    nieuw: "sergio",
    kleur: "var(--prijs-roze)",
    actie: "Kies Meta",
    onderwerp: "Pakket Content + Meta",
  },
  {
    naam: "Meta + Google",
    prijs: "€5.500",
    per: "per maand",
    belofte: "Gevonden worden op het moment dat ze zoeken.",
    punten: [
      { tekst: "Alles uit Content + Meta", erfenis: true },
      { tekst: "Google Ads opgezet en beheerd", sterk: true },
      { tekst: "Eén rapport voor elk kanaal" },
    ],
    team: ["marinus", "jos", "sergio", "nick"],
    nieuw: "nick",
    kleur: "var(--prijs-blauw)",
    actie: "Kies Meta + Google",
    onderwerp: "Pakket Meta + Google",
  },
  {
    naam: "Compleet",
    prijs: "€6.000",
    per: "per maand",
    belofte: "Marketing en financiën, volledig geregeld.",
    punten: [
      { tekst: "Alles uit Meta + Google", erfenis: true },
      { tekst: "Boekhouding en accounting", sterk: true },
      { tekst: "Complete Odoo-inrichting" },
    ],
    team: ["marinus", "jos", "sergio", "nick", "steef"],
    nieuw: "steef",
    kleur: "var(--prijs-groen)",
    actie: "Kies Compleet",
    onderwerp: "Pakket Compleet",
    top: true,
  },
];

// Wat elk maandpakket meekrijgt (minimaal drie maanden). Het losse websitepakket is hierin opgegaan.
const INBEGREPEN = [
  "Custom OS",
  "Complete rebranding",
  "Je website",
  "Persoonlijke call met uitleg van je systeem",
];

const MAATWERK = {
  punten: [
    { titel: "Je eigen OS op je eigen Odoo", tekst: "Gebouwd rond hoe jouw bedrijf echt werkt, niet andersom." },
    { titel: "Dashboard, CRM, Studio en website", tekst: "Elk onderdeel ingericht op je eigen processen en koppelingen." },
    { titel: "Milo-agents op je eigen data", tekst: "AI die je verkoop, klanten en cijfers kent en meedenkt." },
    { titel: "Developers en dataspecialisten", tekst: "Ons team en onze partners bouwen, koppelen en begeleiden." },
  ],
  team: ["marinus", "steef", "sid"],
};

const GRATIS = [
  { titel: "Een complete demowebsite", tekst: "Geen schets. Een volledige website in je merk, klaar om live te gaan." },
  { titel: "Een basic rebranding", tekst: "Kleuren, logo en stijl, strak neergezet." },
  { titel: "Je eigen OS", tekst: "Verkoop, merk, social en website op één scherm, met je eigen data." },
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
  const { t } = useLanguage();
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
            <p className="prijs-lead">{t("Waar anderen duizenden euro’s voor vragen, betaal jij €0. Log in op je gratis OS of vraag een gratis demowebsite aan; daarna bespreken we samen de volgende stap.")}</p>
            <div className="prijs-knoppen">
              <a className="os-claim sn-btn3d h-button" href={PROBEER_URL}>
                <span className="sn-btn3d-sheen" />
                <span>Probeer het OS gratis</span>
                <span className="h-button-icon">
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </a>
              <Action to="/gratis-website" secondary>
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

        <div className="prijs-inhoud">
          <div className="prijs-inhoud-kop">
            <h2>Dit zit al in je gratis OS</h2>
            <a className="prijs-link" href={PROBEER_URL}>
              <span>Probeer het OS gratis</span>
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

      <section className="prijs-maatwerk" aria-labelledby="prijs-maatwerk-titel">
        <div className="prijs-maatwerk-kop">
          <p className="h-eyebrow">Operating System op maat</p>
          <h2 id="prijs-maatwerk-titel">
            Jouw eigen OS,
            <br />
            <em>gebouwd rond je bedrijf.</em>
          </h2>
          <p className="prijs-maatwerk-bedrag">Vanaf €10.000 · prijs op aanvraag</p>
          <p className="prijs-maatwerk-lead">Het gratis OS laat zien wat kan. Het OS op maat maakt het van jou: je eigen data, je eigen processen en je eigen agents, in één systeem.</p>
          <p className="prijs-waarom"><b>Waarom het OS gratis kan.</b> We verdienen aan het OS op maat en aan de pakketten van ons team. Partners als Komen Consultancy helpen het OS schaalbaar te maken, en Odoo-implementatiepartners brengen het naar hun klanten.</p>
          <div className="prijs-knoppen">
            <Action to={`/contact?onderwerp=${encodeURIComponent("OS op maat")}`}>Plan je OS op maat</Action>
          </div>
        </div>
        <ul className="prijs-maatwerk-punten">
          {MAATWERK.punten.map((punt) => (
            <li key={punt.titel}>
              <b>{punt.titel}</b>
              <span>{punt.tekst}</span>
            </li>
          ))}
        </ul>
        <div className="prijs-maatwerk-team">
          <Team ids={MAATWERK.team} />
        </div>
      </section>

      <section className="prijs-pakketten" aria-labelledby="prijs-pakketten-titel">
        <div className="prijs-pakketten-kop">
          <div>
            <p className="h-eyebrow">Maandpakketten · minimaal 3 maanden</p>
            <h2 id="prijs-pakketten-titel">Bovenop je gratis OS</h2>
          </div>
          <p>
            Elk pakket is een extra laag bovenop de gratis versie en loopt minimaal drie maanden. <strong>In elk pakket inbegrepen:</strong>
          </p>
        </div>
        <ul className="prijs-inbegrepen">
          {INBEGREPEN.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="prijs-raster">
          {MAAND.map((pakket) => (
            <Kaart key={pakket.naam} pakket={pakket} />
          ))}
        </div>
      </section>
    </div>
  );
}
