import React from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Action } from "./ui";
import { GRATIS_OS_URL } from "./os-entry";
import { useLanguage } from "./i18n/context";
import "./pricing.css";
import { openPlanCall } from "./PlanCall";

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

// Wat al in het gratis OS zit, groot uitgelicht boven de kaarten (Marinus: "Allemaal al vanaf het gratis instapmodel").
// 19 oktober 2026 (Marinus): "Gratis website demo moet er ook overal even bij."
const GRATIS_USPS = [
  { titel: "Gratis website en rebranding", tekst: "Een complete website in je merk, klaar om live te gaan." },
  { titel: "Gratis Studio", tekst: "Posts, advertenties en video in je eigen merk." },
  { titel: "5.000 stockfoto's", tekst: "Eigen beelden, gratis te gebruiken." },
  { titel: "Social media management", tekst: "Plannen en posten op al je kanalen." },
  { titel: "Boekhoudpakket", tekst: "Facturen en boekhouding, gratis." },
];

// Alles wat in de Connect-pakketten zit, als uitklapbare tabel onder de kaarten. vanaf: 0 Start, 1 Meta, 2 Meta + Google, 3 Compleet.
// 19 oktober 2026 (Marinus): eerst "Juist hier veel meer in details gaan", daarna "Deze zijn nu wel écht te lang." Dus korte kaarten
// en de details hier.
const VERGELIJK: { groep: string; regels: [string, number][] }[] = [
  { groep: "Merk en website", regels: [["Website ontworpen en gebouwd", 0], ["Custom OS ingericht rond je bedrijf", 0], ["Complete branding: logo, kleuren en stijl", 0]] },
  { groep: "Content", regels: [["Content in je merk, gepland en geplaatst", 0], ["Ad-creatie: beeld en video voor je advertenties", 0], ["Short-form video en motion design", 0]] },
  { groep: "Advertenties", regels: [["Meta Ads: campagnes, doelgroepen en retargeting", 1], ["Leads direct in je CRM", 1], ["A/B-tests op je advertenties", 1], ["Google Ads: Search, Shopping en Performance Max", 2], ["Landingspagina's voor je campagnes", 2], ["Eén rapport voor elk kanaal", 2]] },
  { groep: "Begeleiding", regels: [["Vast aanspreekpunt uit ons team", 0], ["Persoonlijke call met uitleg van je systeem", 0], ["Maandelijkse strategiesessie", 1], ["Wekelijkse optimalisatie van je campagnes", 1]] },
  { groep: "Financiën", regels: [["Boekhouding en accounting", 3], ["Hulp binnen Odoo: inrichting en vragen", 3]] },
  // 21 oktober 2026 (Marinus): groeigarantie, "Geen groei? 1 maand gratis" bij elk pakket, ook Start; afgebakend in voorwaarden artikel 8.
  { groep: "Afspraken", regels: [["Geen groei? 1 maand gratis", 0]] },
];

function Vergelijk() {
  return (
    <details className="prijs-vergelijk">
      <summary>
        <span>Vergelijk alles wat erin zit</span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <div className="prijs-vergelijk-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">Onderdeel</span></th>
              {CONNECT.map((p) => <th key={p.id} scope="col" translate="no">{p.naam}</th>)}
            </tr>
          </thead>
          {VERGELIJK.map((blok) => (
            <tbody key={blok.groep}>
              <tr className="prijs-vergelijk-groep"><th scope="rowgroup" colSpan={CONNECT.length + 1}>{blok.groep}</th></tr>
              {blok.regels.map(([tekst, vanaf]) => (
                <tr key={tekst}>
                  <th scope="row">{tekst}</th>
                  {CONNECT.map((p, i) => (
                    <td key={p.id} className={i >= vanaf ? "is-ja" : "is-nee"}>
                      {i >= vanaf ? <span aria-label="ja">✓</span> : <span aria-label="nee">–</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </details>
  );
}

// Losse producten, buiten de abonnementen en pakketten om. 19 oktober 2026 (Marinus): "Helft aanbetaling vooraf andere helft bij
// oplevering." Dat geldt voor de eenmalige website en het custom OS.
const LOS = [
  { naam: "Demowebsite", prijs: "€0", per: "gratis", tekst: "Een complete website in je merk, klaar om live te gaan. Geen verplichting.", actie: "Vraag je demo aan", to: "/gratis-website", kleur: "var(--prijs-groen)" },
  { naam: "Website realisatie en ontwikkeling", prijs: "€2.000 tot €5.000", per: "eenmalig", tekst: "Ontworpen en gebouwd in je merk. De prijs hangt af van pagina's en koppelingen.", betaling: true, actie: "Bespreek je website", to: "/contact?onderwerp=Website", kleur: "var(--prijs-blauw)" },
  { naam: "Custom OS", prijs: "vanaf €10.000", per: "eenmalig", tekst: "Alleen het systeem, gebouwd rond je bedrijf en je processen.", betaling: true, actie: "Plan een call", call: true, kleur: "var(--prijs-geel)" },
];

// Wat ons anders maakt dan losse software (positionering 29 september 2026: draait op Odoo, met échte professionals).
const UNIEK = [
  { titel: "Echte mensen achter je OS", tekst: "Experts uit ons team kijken mee, met de toegang die jij bepaalt." },
  { titel: "Je data blijft van jou", tekst: "Je eigen gegevens, je eigen AI, altijd in te trekken." },
  { titel: "Draait op Odoo", tekst: "Je administratie blijft waar hij hoort; wij bouwen erbovenop." },
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
          <React.Fragment key={punt.tekst}>
            {punt.groep && <li className="prijs-groep">{punt.groep}</li>}
            <li className={punt.uit ? "is-uit" : punt.erfenis ? "is-erfenis" : punt.sterk ? "is-sterk" : undefined}>{punt.tekst}</li>
          </React.Fragment>
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
  const maandelijks = false;
  const Kop = bovenaan ? "h1" : "h2";
  return (
    <div id="prijzen" className={`prijs prijs-diensten h-wrap${bovenaan ? " is-bovenaan" : ""}`}>
      <div className="prijs-diensten-kop">
        <p className="h-eyebrow prijs-groen-tekst">Diensten en prijzen</p>
        {/* 19 oktober 2026 (Marinus): "Software, studio, socialmedia management, boekhouding en Ai agents gratis. Dat is wel belangrijk
            ipv alleen software. Bij ons betaal je voor winst en expertise". Daarna: "Je betaalt voor onze expertise in jouw winstgevend maken." */}
        {/* Variant A "klein en rustig" (Marinus, 19 oktober 2026): wat gratis is klein erboven, waar je voor betaalt groot. */}
        <Kop className="prijs-kop-a">
          <span className="prijs-kop-r1">Software, Studio, social media, boekhouding en AI agents gratis.</span>
          <em>Je betaalt voor onze expertise om jou winstgevend te maken.</em>
        </Kop>
        <p>Alle bedragen zijn exclusief btw.</p>
      </div>

      <Rij
        id="os"
        label="01 / Het OS"
        titel="Begin gratis. Betaal pas als je team groeit."
        tekst="Je software is gratis. Groeit je team, dan krijg je meer plek, meer opslag en elke maand tokens voor je Studio. Bespaar 25% met een jaarabonnement."
        pakketten={OS}
        maandelijks={maandelijks}
      >
        {/* 19 oktober 2026 (Marinus): "Ik wil dat je die duurdere prijzen pas ziet bij betaling." Geen schakelaar meer; de maandprijzen
            (€46,67 en €86,67) staan alleen in de betaalstap van het OS. */}
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
          {/* 21 oktober 2026 (Marinus): "As a growth partner we garentee growth. If not you still own everything and even get one month of." Voor elk pakket, ook Start. */}
          <li><b>Geen groei? 1 maand gratis</b><span>Bij elk pakket garanderen we groei. Groei je in je periode niet, dan werken we 1 maand gratis door.</span></li>
          <li><b>Mediabudget vanaf €1.000</b><span>Vanaf Meta betaal je zelf minimaal €1.000 per maand aan advertenties.</span></li>
        </ul>
      </Rij>
      <Vergelijk />

      {/* 19 oktober 2026 (Marinus): "De prijs voor websites moeten er ook staan." Drie losse producten met de prijs groot. */}
      <section className="prijs-los" aria-labelledby="prijs-los-titel">
        <div className="prijs-pakketten-kop">
          <div>
            <p className="h-eyebrow">03 / Los</p>
            <h3 id="prijs-los-titel">Liever één ding?</h3>
          </div>
          <p>Een website of alleen je eigen systeem, voor een vaste prijs vooraf.</p>
        </div>
        <ul>
          {LOS.map((item) => (
            <li key={item.naam} style={{ "--kleur": item.kleur } as React.CSSProperties}>
              <h4>{item.naam}</h4>
              <p className="prijs-bedrag"><strong>{item.prijs}</strong><span>{item.per}</span></p>
              <p className="prijs-belofte">{item.tekst}</p>
              {item.betaling && <p className="prijs-betaling">Helft vooraf, helft bij oplevering.</p>}
              {item.call ? (
                <button type="button" className="sn-pill sn-btn3d h-button h-button-secondary" aria-haspopup="dialog" onClick={() => openPlanCall()}>
                  <span className="sn-btn3d-sheen" />
                  <span>{item.actie}</span>
                  <span className="h-button-icon"><ArrowUpRight size={16} aria-hidden="true" /></span>
                </button>
              ) : (
                <Action to={item.to!} secondary>{item.actie}</Action>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
