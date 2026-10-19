import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Action } from "./ui";
import { GRATIS_OS_URL } from "./os-entry";
import { useLanguage } from "./i18n/context";
import "./pricing.css";
import { PlanCallKnop } from "./PlanCall";

// 23 september tot 18 oktober 2026: /prijzen groeide van gratis plus vier maandpakketten naar opslag, tokens per maand en
// pakketten van €4.000 tot €6.000. Marinus vond dat op 19 oktober "nog totaal niet duidelijk".
// 19 oktober 2026 (Marinus): de prijzen staan als één blok onderaan /diensten (#prijzen); /prijzen stuurt door. Na een eerste
// versie: "Alles is veel te veel. Gewoon duidelijk maken, Gratis OS tot 10gb en 2 personen uitnodigen. Daarna €35,- per maand
// pakket 2 tot 5 medewerkers en zoveel credits dat het nog winstgevend blijft en dan 5 tot 10 voor €65,- met nog meer credits.
// [...] Vervolgens Connect Pakketten, vanaf €3.000,- periode 3 maanden dus website, custom os en branding en content en ad
// creatie. Dan de rest met de mensen erbij." En: "De pakketten met mij zijn vanaf 3000,- ik wil pakket met Jos en Sergio er
// graag nog bij en dan dus met Nick ook en met Steef ook". "Pas bij het €35,- per maand pakket is Agentic Payments ook een ding." Aannames: bedragen per maand excl. btw; tokens 1.500 en 4.000 per maand; opslag
// 50 en 100 GB; de naam Business; de vervolgpakketten in dezelfde stappen als op 28 september (+€1.000, +€500, +€500).

type Lid = { naam: string; rol: string; foto: string };
export const TEAM: Record<string, Lid> = {
  marinus: { naam: "Marinus Bergsma", rol: "Founder & CEO", foto: "marinus" },
  jos: { naam: "Jos Hollenberg", rol: "Head of Meta Ads", foto: "jos" },
  sergio: { naam: "Sergio Jovovic", rol: "Head of Meta Ads", foto: "sergio" },
  nick: { naam: "Nick van Keulen", rol: "Head of Google Ads & Search", foto: "nick" },
  steef: { naam: "Steef Komen", rol: "Partner · Head of Finance & Data", foto: "steef" },
};
export const fotoVan = (foto: string) => (foto.startsWith("/") ? foto : `/images/prijzen/${foto}.webp`);

type Pakket = {
  id: string;
  naam: string;
  prijs: string;
  per: string;
  // Maandelijks opzegbaar kost 25% meer dan bij een jaarabonnement (Marinus, 19 oktober 2026); alleen voor het OS.
  maand?: { prijs: string; per: string };
  tokens?: { aantal: string; waarde: string; goedVoor: string };
  belofte: string;
  punten: { tekst: string; erfenis?: boolean; sterk?: boolean }[];
  team?: string[];
  kleur: string;
  actie: string;
  onderwerp?: string;
  href?: string;
  vlag?: string;
};

// Het OS per team. Tokens zijn rendertegoed tegen de klantprijs (2x inkoop, api/_prijzen.js), dus bij volledig gebruik kost
// 1.500 tokens ons hooguit €7,50 en 4.000 tokens hooguit €20: Team en Business blijven ruim winstgevend. Wat je ermee maakt
// volgt uit dezelfde tabel: een beeld in topkwaliteit kost 28 tokens, een video van 8 seconden 160 (naar beneden afgerond).
// 19 oktober 2026 (Marinus): "Team, Business worden en Business Enterprise met onneindig opslag en dus langer met meer de usp's
// wat maakt ons nou zo uniek." De ids volgen de nieuwe namen; ?pakket=business is €35, ?pakket=enterprise is €65.
const OS: Pakket[] = [
  {
    id: "gratis",
    naam: "Gratis",
    prijs: "€0",
    per: "altijd",
    belofte: "Je eigen OS om mee te beginnen.",
    punten: [
      { tekst: "10 GB opslag", sterk: true },
      { tekst: "Nodig 2 mensen uit", sterk: true },
      { tekst: "Gratis demowebsite", sterk: true },
      { tekst: "Gratis Studio" },
      { tekst: "5.000 gratis stockfoto's" },
      { tekst: "Gratis social media management" },
      { tekst: "Gratis boekhoudpakket" },
      { tekst: "Dashboard, CRM en Milo" },
    ],
    kleur: "var(--prijs-groen)",
    tokens: { aantal: "Geen tokens inbegrepen", waarde: "", goedVoor: "Los bij te kopen: 1.000 tokens voor €10" },
    actie: "Probeer het OS gratis",
    href: `${GRATIS_OS_URL}?pakket=gratis`,
  },
  {
    id: "business",
    naam: "Business",
    prijs: "€35",
    per: "per maand, jaarlijks",
    maand: { prijs: "€43,75", per: "per maand, maandelijks opzegbaar" },
    tokens: { aantal: "1.500 tokens per maand", waarde: "t.w.v. €15", goedVoor: "Ruim 50 beelden of 9 video's van 8 seconden" },
    belofte: "Voor een klein team dat samen werkt.",
    punten: [
      { tekst: "Alles uit Gratis", erfenis: true },
      { tekst: "2 tot 5 medewerkers", sterk: true },
      { tekst: "Agentic Payments", sterk: true },
      { tekst: "50 GB opslag" },
      { tekst: "Experts met de toegang die jij bepaalt" },
      { tekst: "Je eigen AI veilig gekoppeld" },
    ],
    kleur: "var(--prijs-blauw)",
    actie: "Kies Business",
    href: `${GRATIS_OS_URL}?pakket=business`,
  },
  {
    id: "enterprise",
    naam: "Enterprise",
    prijs: "€65",
    per: "per maand, jaarlijks",
    maand: { prijs: "€81,25", per: "per maand, maandelijks opzegbaar" },
    tokens: { aantal: "4.000 tokens per maand", waarde: "t.w.v. €40", goedVoor: "Ruim 140 beelden of 25 video's van 8 seconden" },
    belofte: "Voor het hele bedrijf, zonder grenzen aan je opslag.",
    punten: [
      { tekst: "Alles uit Business", erfenis: true },
      { tekst: "5 tot 10 medewerkers", sterk: true },
      { tekst: "Onbeperkte opslag", sterk: true },
      { tekst: "Gratis website", sterk: true },
      { tekst: "Korting op extra tokens" },
      { tekst: "Persoonlijke uitleg van je systeem" },
    ],
    kleur: "var(--prijs-geel)",
    actie: "Kies Enterprise",
    href: `${GRATIS_OS_URL}?pakket=enterprise`,
    vlag: "Meeste waarde",
  },
];

// Wat al in het gratis OS zit, groot uitgelicht boven de kaarten (Marinus: "Allemaal al vanaf het gratis instapmodel").
// 19 oktober 2026 (Marinus): "Gratis website demo moet er ook overal even bij."
const GRATIS_USPS = [
  { titel: "Gratis demowebsite", tekst: "Een complete website in je merk, klaar om live te gaan." },
  { titel: "Gratis Studio", tekst: "Posts, advertenties en video in je eigen merk." },
  { titel: "5.000 stockfoto's", tekst: "Eigen beelden, gratis te gebruiken." },
  { titel: "Social media management", tekst: "Plannen en posten op al je kanalen." },
  { titel: "Boekhoudpakket", tekst: "Facturen en boekhouding, gratis." },
];

// Wat ons anders maakt dan losse software (positionering 29 september 2026: draait op Odoo, met échte professionals).
const UNIEK = [
  { titel: "Echte mensen achter je OS", tekst: "Experts uit ons team kijken mee, met de toegang die jij bepaalt." },
  { titel: "Je data blijft van jou", tekst: "Je eigen gegevens, je eigen AI, altijd in te trekken." },
  { titel: "Draait op Odoo", tekst: "Je administratie blijft waar hij hoort; wij bouwen erbovenop." },
];


// Connect-pakketten: minimaal drie maanden, en in elk pakket website, custom OS, branding, content en advertenties gemaakt.
// HeaderBestaand.tsx toont dezelfde vier in de Custom OS-tab.
export const CONNECT: Pakket[] = [
  {
    id: "start",
    naam: "Start",
    prijs: "€3.000",
    per: "per maand",
    belofte: "Alles om goed zichtbaar te worden.",
    punten: [
      { tekst: "Website, custom OS en branding", sterk: true },
      { tekst: "Content en advertenties gemaakt" },
      { tekst: "Persoonlijke call met uitleg van je systeem" },
    ],
    team: ["marinus"],
    kleur: "var(--prijs-groen)",
    actie: "Kies Start",
    onderwerp: "Connect-pakket Start",
  },
  {
    id: "meta",
    naam: "Meta",
    prijs: "€4.000",
    per: "per maand",
    belofte: "Bereik de juiste mensen op Instagram en Facebook.",
    punten: [
      { tekst: "Alles uit Start", erfenis: true },
      { tekst: "Meta Ads opgezet en beheerd", sterk: true },
      { tekst: "Leads direct in je CRM" },
      { tekst: "Geen winst? 1 maand gratis", sterk: true },
      { tekst: "Mediabudget vanaf €1.000 per maand" },
    ],
    team: ["marinus", "jos", "sergio"],
    kleur: "var(--prijs-roze)",
    actie: "Kies Meta",
    onderwerp: "Connect-pakket Meta",
    // 19 oktober 2026 (Marinus): "Doe maar 4K meest gekozen."
    vlag: "Meest gekozen",
  },
  {
    id: "meta-google",
    naam: "Meta + Google",
    prijs: "€4.500",
    per: "per maand",
    belofte: "Gevonden worden op het moment dat ze zoeken.",
    punten: [
      { tekst: "Alles uit Meta", erfenis: true },
      { tekst: "Google Ads opgezet en beheerd", sterk: true },
      { tekst: "Eén rapport voor elk kanaal" },
    ],
    team: ["marinus", "jos", "sergio", "nick"],
    kleur: "var(--prijs-blauw)",
    actie: "Kies Meta + Google",
    onderwerp: "Connect-pakket Meta + Google",
  },
  {
    id: "compleet",
    naam: "Compleet",
    prijs: "€5.000",
    per: "per maand",
    belofte: "Marketing en financiën, volledig geregeld.",
    punten: [
      { tekst: "Alles uit Meta + Google", erfenis: true },
      { tekst: "Boekhouding en accounting", sterk: true },
      { tekst: "Odoo-inrichting als je die nodig hebt" },
    ],
    team: ["marinus", "jos", "sergio", "nick", "steef"],
    kleur: "var(--prijs-geel)",
    actie: "Kies Compleet",
    onderwerp: "Connect-pakket Compleet",
  },
];

function Team({ ids }: { ids: string[] }) {
  const leden = ids.map((id) => TEAM[id]);
  return (
    <details className="prijs-team">
      <summary>
        <span className="prijs-rondjes" aria-hidden="true">
          {leden.map((lid) => (
            <img key={lid.foto} src={fotoVan(lid.foto)} alt="" width="28" height="28" />
          ))}
        </span>
        <span className="prijs-namen" translate="no">{leden.map((lid) => lid.naam.split(" ")[0]).join(" · ")}</span>
        <ChevronDown className="prijs-pijl" size={15} aria-hidden="true" />
      </summary>
      <ul className="prijs-leden">
        {leden.map((lid) => (
          <li key={lid.foto}>
            <img src={fotoVan(lid.foto)} alt="" width="30" height="30" />
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

function Knop({ pakket, maandelijks = false }: { pakket: Pakket; maandelijks?: boolean }) {
  const secundair = !pakket.vlag;
  // De gekozen betaalperiode gaat mee naar de aanmelding van het OS.
  const href = pakket.href && pakket.maand ? `${pakket.href}&periode=${maandelijks ? "maand" : "jaar"}` : pakket.href;
  if (href) return <Action href={href} secondary={secundair}>{pakket.actie}</Action>;
  return <Action to={`/contact?onderwerp=${encodeURIComponent(pakket.onderwerp ?? pakket.naam)}`} secondary={secundair}>{pakket.actie}</Action>;
}

function Kaart({ pakket, maandelijks = false }: { pakket: Pakket; maandelijks?: boolean }) {
  const bedrag = maandelijks && pakket.maand ? pakket.maand : pakket;
  return (
    <article className={`prijs-kaart${pakket.vlag ? " is-top" : ""}`} style={{ "--kleur": pakket.kleur } as React.CSSProperties}>
      {pakket.vlag && <span className="prijs-vlag">{pakket.vlag}</span>}
      <div className="prijs-kop">
        <h3>{pakket.naam}</h3>
        <p className="prijs-bedrag">
          <strong>{bedrag.prijs}</strong>
          <span>{bedrag.per}</span>
        </p>
        <p className="prijs-belofte">{pakket.belofte}</p>
        {pakket.tokens && (
          <div className={`prijs-tokenbox${pakket.tokens.waarde ? "" : " is-leeg"}`}>
            <p>
              <b>{pakket.tokens.aantal}</b>
              {pakket.tokens.waarde && <span>{pakket.tokens.waarde}</span>}
            </p>
            <p className="prijs-tokenbox-uitleg">{pakket.tokens.goedVoor}</p>
          </div>
        )}
      </div>
      <ul className="prijs-punten">
        {pakket.punten.map((punt) => (
          <li key={punt.tekst} className={punt.erfenis ? "is-erfenis" : punt.sterk ? "is-sterk" : undefined}>
            {punt.tekst}
          </li>
        ))}
      </ul>
      <div className="prijs-voet">
        {pakket.team && <Team ids={pakket.team} />}
        <Knop pakket={pakket} maandelijks={maandelijks} />
      </div>
    </article>
  );
}

function Rij({ id, label, titel, tekst, pakketten, children, maandelijks = false }: { id: string; label: string; titel: string; tekst: string; pakketten: Pakket[]; children?: React.ReactNode; maandelijks?: boolean }) {
  return (
    <section className="prijs-pakketten prijs-rij" aria-labelledby={`prijs-${id}-titel`}>
      <div className="prijs-pakketten-kop">
        <div>
          <p className="h-eyebrow">{label}</p>
          <h3 id={`prijs-${id}-titel`}>{titel}</h3>
        </div>
        <p>{tekst}</p>
      </div>
      {children}
      <div className={`prijs-raster${pakketten.length === 3 ? " prijs-raster-drie" : ""}`}>
        {pakketten.map((pakket) => (
          <Kaart key={pakket.id} pakket={pakket} maandelijks={maandelijks} />
        ))}
      </div>
    </section>
  );
}

// bovenaan: het prijsblok opent de pagina (19 oktober 2026: "Bij diensten moeten de pakketten boven [...] de diensten komen"),
// dus de kop is dan de h1 van de pagina.
export default function Pricing({ bovenaan = false }: { bovenaan?: boolean }) {
  useLanguage();
  const [maandelijks, zetMaandelijks] = useState(false);
  const Kop = bovenaan ? "h1" : "h2";
  return (
    <div id="prijzen" className={`prijs prijs-diensten h-wrap${bovenaan ? " is-bovenaan" : ""}`}>
      <div className="prijs-diensten-kop">
        <p className="h-eyebrow prijs-groen-tekst">Diensten en prijzen</p>
        <Kop>
          Software gratis.
          <br />
          <em>Echt werk voor een vaste prijs.</em>
        </Kop>
        <p>Alle bedragen zijn exclusief btw.</p>
      </div>

      <Rij
        id="os"
        label="01 / Het OS"
        titel="Begin gratis. Betaal pas als je team groeit."
        tekst="Je software is gratis. Groeit je team, dan krijg je meer plek, meer opslag en elke maand tokens voor je Studio. Jaarlijks betaal je het minst; maandelijks opzegbaar kost 25% meer."
        pakketten={OS}
        maandelijks={maandelijks}
      >
        <div className="prijs-periode" role="group" aria-label="Betaalperiode">
          <button type="button" aria-pressed={!maandelijks} onClick={() => zetMaandelijks(false)}>Jaarlijks</button>
          <button type="button" aria-pressed={maandelijks} onClick={() => zetMaandelijks(true)}>Maandelijks</button>
        </div>
        <div className="prijs-usps">
          <p className="prijs-usps-label">Al in je gratis OS</p>
          <ul>
            {GRATIS_USPS.map((usp) => (
              <li key={usp.titel}>
                <b>{usp.titel}</b>
                <span>{usp.tekst}</span>
              </li>
            ))}
          </ul>
        </div>
      </Rij>
      <ul className="prijs-uniek" aria-label="Wat ons anders maakt">
        {UNIEK.map((punt) => (
          <li key={punt.titel}>
            <b>{punt.titel}</b>
            <span>{punt.tekst}</span>
          </li>
        ))}
      </ul>
      <Rij
        id="connect"
        label="02 / Connect-pakketten · per periode van 3 maanden"
        titel="Wij doen het werk, met échte mensen"
        tekst="In elk pakket maken we je website, custom OS, branding, content en advertenties. Hoe verder je gaat, hoe meer mensen er voor je werken."
        pakketten={CONNECT}
      >
        {/* 19 oktober 2026 (Marinus): "altijd een periode van 3 maanden en bij geen winst 1 maand gratis. Vanaf Meta pakketten.
            Minimaal €1000,- ad spend wel voor ads per maand bij alles vanaf Meta." */}
        <ul className="prijs-voorwaarden">
          <li><b>Altijd 3 maanden</b><span>Elk pakket loopt per periode van 3 maanden.</span></li>
          <li><b>Geen winst? 1 maand gratis</b><span>Vanaf Meta: levert je periode geen winst op, dan werken we 1 maand gratis door.</span></li>
          <li><b>Mediabudget vanaf €1.000</b><span>Vanaf Meta betaal je zelf minimaal €1.000 per maand aan advertenties.</span></li>
        </ul>
      </Rij>

      <div className="prijs-maatwerk-regel">
        <p>
          <b>Liever één ding?</b> Een gratis demowebsite, je website voor €2.000 tot €5.000 eenmalig, of alleen een custom OS vanaf €10.000 eenmalig.
        </p>
        <PlanCallKnop className="sn-pill sn-btn3d h-button h-button-secondary" label="Plan een call" />
      </div>
    </div>
  );
}
