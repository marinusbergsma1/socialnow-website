import React from "react";
import { Action } from "./ui";
import { GRATIS_OS_URL } from "./os-entry";
import "./pricing.css";

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
  // Met een jaarabonnement bespaar je 25%; de maandprijs zie je pas bij betaling in het OS (Marinus, 19 oktober 2026).
  maand?: { prijs: string; per: string };
  tokens?: { aantal: string; waarde: string; goedVoor: string };
  belofte: string;
  // 19 oktober 2026 (Marinus): "De punten moeten altijd overeenkomen. Dus altijd opslag op dezelfde plek bij alle 3." Elke kaart
  // in een rij heeft dezelfde regels in dezelfde volgorde; wat er niet in zit staat er grijs bij (uit).
  // groep: een kopje boven de regel (wordt nu niet gebruikt op de kaarten; 19 oktober 2026, Marinus over de Connect-pakketten: "Juist hier veel meer in details gaan" en
  // "Hulp binnen Odoo. en maak sws de duurdere pakketten met menselijke hulp écht even een stuk uitgebreider met goeie USP'S").
  punten: { tekst: string; erfenis?: boolean; sterk?: boolean; uit?: boolean; groep?: string }[];
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
      { tekst: "Nodig 2 mensen uit", sterk: true },
      { tekst: "10 GB opslag", sterk: true },
      { tekst: "Gratis website en rebranding", sterk: true },
      { tekst: "Studio, 5.000 stockfoto's, social media en boekhouding" },
      { tekst: "Dashboard, CRM en AI agents" },
      { tekst: "Agentic Payments", uit: true },
      { tekst: "Experts met de toegang die jij bepaalt", uit: true },
      { tekst: "Je eigen AI veilig gekoppeld", uit: true },
      { tekst: "Korting op extra tokens", uit: true },
      { tekst: "Persoonlijke uitleg van je systeem", uit: true },
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
    tokens: { aantal: "1.500 tokens per maand", waarde: "t.w.v. €15", goedVoor: "Ruim 50 beelden of 9 video's van 8 seconden" },
    belofte: "Voor een klein team dat samen werkt.",
    punten: [
      { tekst: "2 tot 5 medewerkers", sterk: true },
      { tekst: "50 GB opslag", sterk: true },
      { tekst: "Gratis website en rebranding", sterk: true },
      { tekst: "Studio, 5.000 stockfoto's, social media en boekhouding" },
      { tekst: "Dashboard, CRM en AI agents" },
      { tekst: "Agentic Payments", sterk: true },
      { tekst: "Experts met de toegang die jij bepaalt" },
      { tekst: "Je eigen AI veilig gekoppeld" },
      { tekst: "Korting op extra tokens", uit: true },
      { tekst: "Persoonlijke uitleg van je systeem", uit: true },
    ],
    kleur: "var(--prijs-blauw)",
    actie: "Kies Business",
    href: `${GRATIS_OS_URL}?pakket=business&periode=jaar`,
  },
  {
    id: "enterprise",
    naam: "Enterprise",
    prijs: "€65",
    per: "per maand, jaarlijks",
    tokens: { aantal: "4.000 tokens per maand", waarde: "t.w.v. €40", goedVoor: "Ruim 140 beelden of 25 video's van 8 seconden" },
    belofte: "Voor het hele bedrijf, zonder grenzen aan je opslag.",
    punten: [
      { tekst: "5 tot 10 medewerkers", sterk: true },
      { tekst: "Onbeperkte opslag", sterk: true },
      { tekst: "Gratis website en rebranding", sterk: true },
      { tekst: "Studio, 5.000 stockfoto's, social media en boekhouding" },
      { tekst: "Dashboard, CRM en AI agents" },
      { tekst: "Agentic Payments" },
      { tekst: "Experts met de toegang die jij bepaalt" },
      { tekst: "Je eigen AI veilig gekoppeld" },
      { tekst: "Korting op extra tokens", sterk: true },
      { tekst: "Persoonlijke uitleg van je systeem", sterk: true },
    ],
    kleur: "var(--prijs-geel)",
    actie: "Kies Enterprise",
    href: `${GRATIS_OS_URL}?pakket=enterprise&periode=jaar`,
    vlag: "Meeste waarde",
  },
];


// Connect-pakketten: minimaal drie maanden, en in elk pakket website, custom OS, branding, content en advertenties gemaakt.
// HeaderBestaand.tsx toont dezelfde vier in de Custom OS-tab.
// 19 oktober 2026, avond (Marinus): "Gratis website en rebranding moet bij elk pakket staan." Dus die regel bovenaan bij alle
// zeven pakketten (OS en Connect), sterk; bij Connect staat het custom OS er los onder.
export const CONNECT: Pakket[] = [
  {
    id: "start",
    naam: "Start",
    prijs: "€3.000",
    per: "per maand",
    belofte: "Alles om goed zichtbaar te worden.",
    punten: [
      { tekst: "Gratis website en rebranding", sterk: true },
      { tekst: "Custom OS rond je bedrijf" },
      { tekst: "Content en ad-creatie in je merk" },
      { tekst: "Vast aanspreekpunt uit ons team" },
      { tekst: "Meta Ads en leads in je CRM", uit: true },
      { tekst: "Strategiesessie en wekelijkse optimalisatie", uit: true },
      { tekst: "Google Ads en landingspagina's", uit: true },
      { tekst: "Boekhouding en hulp binnen Odoo", uit: true },
      { tekst: "Geen groei? 1 maand gratis" },
      { tekst: "Geen minimum mediabudget" },
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
      { tekst: "Gratis website en rebranding", sterk: true },
      { tekst: "Custom OS rond je bedrijf" },
      { tekst: "Content en ad-creatie in je merk" },
      { tekst: "Vast aanspreekpunt uit ons team" },
      { tekst: "Meta Ads en leads in je CRM", sterk: true },
      { tekst: "Strategiesessie en wekelijkse optimalisatie" },
      { tekst: "Google Ads en landingspagina's", uit: true },
      { tekst: "Boekhouding en hulp binnen Odoo", uit: true },
      { tekst: "Geen groei? 1 maand gratis", sterk: true },
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
      { tekst: "Gratis website en rebranding", sterk: true },
      { tekst: "Custom OS rond je bedrijf" },
      { tekst: "Content en ad-creatie in je merk" },
      { tekst: "Vast aanspreekpunt uit ons team" },
      { tekst: "Meta Ads en leads in je CRM" },
      { tekst: "Strategiesessie en wekelijkse optimalisatie" },
      { tekst: "Google Ads en landingspagina's", sterk: true },
      { tekst: "Boekhouding en hulp binnen Odoo", uit: true },
      { tekst: "Geen groei? 1 maand gratis" },
      { tekst: "Mediabudget vanaf €1.000 per maand" },
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
      { tekst: "Gratis website en rebranding", sterk: true },
      { tekst: "Custom OS rond je bedrijf" },
      { tekst: "Content en ad-creatie in je merk" },
      { tekst: "Vast aanspreekpunt uit ons team" },
      { tekst: "Meta Ads en leads in je CRM" },
      { tekst: "Strategiesessie en wekelijkse optimalisatie" },
      { tekst: "Google Ads en landingspagina's" },
      { tekst: "Boekhouding en hulp binnen Odoo", sterk: true },
      { tekst: "Geen groei? 1 maand gratis" },
      { tekst: "Mediabudget vanaf €1.000 per maand" },
    ],
    team: ["marinus", "jos", "sergio", "nick", "steef"],
    kleur: "var(--prijs-geel)",
    actie: "Kies Compleet",
    onderwerp: "Connect-pakket Compleet",
  },
];

function Knop({ pakket, maandelijks = false }: { pakket: Pakket; maandelijks?: boolean }) {
  const secundair = !pakket.vlag;
  // De gekozen betaalperiode gaat mee naar de aanmelding van het OS.
  const href = pakket.href && pakket.maand ? `${pakket.href}&periode=${maandelijks ? "maand" : "jaar"}` : pakket.href;
  if (href) return <Action href={href} secondary={secundair}>{pakket.actie}</Action>;
  return <Action to={`/contact?onderwerp=${encodeURIComponent(pakket.onderwerp ?? pakket.naam)}`} secondary={secundair}>{pakket.actie}</Action>;
}

function Kaart({ pakket }: { pakket: Pakket }) {
  return (
    <article className={`prijs-kaart${pakket.vlag ? " is-top" : ""}`} style={{ "--kleur": pakket.kleur } as React.CSSProperties}>
      {pakket.vlag && <span className="prijs-vlag">{pakket.vlag}</span>}
      <div className="prijs-kop">
        <h3>{pakket.naam}</h3>
        <p className="prijs-bedrag">
          <strong>{pakket.prijs}</strong>
          <span>{pakket.per}</span>
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
          <li key={punt.tekst} className={punt.uit ? "is-uit" : punt.erfenis ? "is-erfenis" : punt.sterk ? "is-sterk" : undefined}>{punt.tekst}</li>
        ))}
      </ul>
      <div className="prijs-voet">
        <Knop pakket={pakket} />
      </div>
    </article>
  );
}

// Zelfde abonnementen, inhoud en aanmeldlinks als voorheen, achter een aparte productingang.
export function OsPakketten() {
  return (
    <div className="prijs prijs-diensten prijs-zakelijk">
      <div className="prijs-pakketten prijs-rij prijs-os-pakketten">
        <p>Groeit je team, dan krijg je meer plek, meer opslag en elke maand tokens voor je Studio. Bespaar 25% met een jaarabonnement ten opzichte van maandelijks betalen.</p>
        <div className="prijs-raster prijs-raster-drie">
          {OS.map((pakket) => <Kaart key={pakket.id} pakket={pakket} />)}
        </div>
      </div>
    </div>
  );
}
