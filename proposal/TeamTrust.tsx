import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { people } from "./content";
import { klein } from "./licht";
import LinkedInMark from "./LinkedInMark";
import PartnerReferences from "./PartnerReferences";

// Iedereen uit people, Marinus voorop; de rest in de volgorde van de muur.
const voorop = ["Marinus Bergsma", "Michelle Yang", "Steef Komen", "Sergio Jovovic", "Elian Coellar", "Nick van Keulen", "Jos Hollenberg", "Carmel Boon", "Emma Peperkamp", "Sam van der Sluis", "Sid van Kalken", "Tristan Slobbe", "Steven Goudsblom"];
const teamOpVolgorde = () => [...people].sort((a, b) => (voorop.indexOf(a.name) + 1 || 99) - (voorop.indexOf(b.name) + 1 || 99));

// 28 september 2026 (Marinus): meer mensen uit het team laten zien, de tekst mag kleiner. Het hele team, even groot.
export default function TeamTrust() {
  return <Link to="/team" className="h-team-trust">
    <span className="h-team-portraits" aria-hidden="true">
      {/* 3 oktober 2026 (Marinus): "ZORG DAT IEDEREEN EROP STAAT". Het hele team uit people, in de volgorde van de muur. */}
      {teamOpVolgorde().map(person => <img key={person.name} {...klein(person.image, 48)} alt="" width="56" height="56" loading="lazy" />)}
    </span>
    <span><strong>Technologie met mensen erachter.</strong><span>Maak kennis met ons team <ArrowUpRight size={13} aria-hidden="true" /></span></span>
  </Link>;
}

// 4 oktober 2026 (Marinus): "onderscheid met mij en Steef met outline erom en Douwe en Sid moet outline en klein het logo
// erbij en rest onderscheid zelfstandige ondernemers". Twee duo's bovenaan: SocialNow (donkerblauw naar zwart, logo op donker)
// en Attesso (roze, ~/a). De rest staat eronder als Independent entrepreneurs. Het zwarte Let's get-vlak en de zwarte balk
// zijn weg ("Die zwarte balk en dat groene blok vind ik ook niet nice"); de uitnodiging is een tekstlink.
const SOCIALNOW_DUO = ["Marinus Bergsma", "Steef Komen"];
const ATTESSO_DUO = ["Sid van Kalken", "Douwe Kramer"];
// 5 oktober 2026 (Marinus): "Michelle, Tristan en Steven wil ik graag groot hebben als bestuursonderdeel." Optie D uit de
// voorbeelden (drie foto's en een tekstkaart in vier gelijke vakken), "graag groen dus".
const BOARD = ["Michelle Yang", "Tristan Slobbe", "Steven Goudsblom"];
const KORTE_ROL: Record<string, string> = {
  "Marinus Bergsma": "Founder & CEO",
  "Steef Komen": "Partner · Finance & Data",
  "Sid van Kalken": "Web Development & AI Payments",
  "Douwe Kramer": "Co-founder",
  "Michelle Yang": "Supply Chain & Operations",
  "Tristan Slobbe": "Data & AI",
  "Steven Goudsblom": "Wealth management",
};

// 5 oktober 2026 (Marinus): "graag bij iedereen Linkedin doorlink". Een foto met een bevestigd LinkedIn-profiel linkt
// daarheen (een link over de hele tegel, met "in" bij de naam); zonder profiel linkt de tegel naar /team.
type Persoon = (typeof people)[number];
function NaarPersoon({ person }: { person: Persoon }) {
  return person.linkedin
    ? <a className="h-persoon-link" href={person.linkedin} target="_blank" rel="noopener" aria-label={`${person.name} on LinkedIn`} />
    : <Link className="h-persoon-link" to="/team" aria-label={`${person.name}, meet the team`} />;
}
const LinkedInTeken = ({ person }: { person: Persoon }) => person.linkedin ? <LinkedInMark /> : null;

// 5 oktober 2026 (Marinus): de muur per functie, optie D (filterpillen). "zowel ik als Attesso en management moet behalve
// management er nog bij ook in het onderverdelen terugkomen": het hele team staat hier, ook wie bovenaan al groot staat.
const FUNCTIES: { functie: string; mensen: string[] }[] = [
  // 5 oktober 2026 (Marinus): "Ai development is meer Tristan an Douwe. Antony Soosaipillaj is voor Webdevelopment."
  // Marinus staat bij Sales & partnerships; Sid (Web Development & AI Payments) bij Web development.
  { functie: "AI development", mensen: ["Tristan Slobbe", "Douwe Kramer"] },
  { functie: "Web development", mensen: ["Sid van Kalken", "Antony Soosaipillaj"] },
  { functie: "Finance & operations", mensen: ["Steef Komen", "Michelle Yang", "Steven Goudsblom"] },
  { functie: "Ads & search", mensen: ["Jos Hollenberg", "Sergio Jovovic", "Nick van Keulen"] },
  { functie: "Video, photo & design", mensen: ["Carmel Boon", "Sam van der Sluis", "Emma Peperkamp", "Pepijn Bos", "Armando van Bruggen"] },
  { functie: "Sales & partnerships", mensen: ["Marinus Bergsma", "Elian Coellar", "Aren", "Youri van der Donk", "Pieter Bergsma", "Isaak Munster"] },
];

// 6 oktober 2026 (Marinus): "Hier ook nog even iets van hierarchie", bij optie H3 "liever vierkantjes omdat iedereen een
// plek verdient". Onder All staat het team in lagen: Partners en Board groot bovenaan, daarna iedereen in even grote vierkanten.
const LAGEN: [string, string[]][] = [
  ["Partner", ["Marinus Bergsma", "Steef Komen", "Sid van Kalken", "Douwe Kramer"]],
  ["Board", ["Michelle Yang", "Tristan Slobbe", "Steven Goudsblom"]],
  ["Head", ["Jos Hollenberg", "Nick van Keulen", "Carmel Boon", "Elian Coellar"]],
  ["Specialist", ["Sergio Jovovic", "Sam van der Sluis", "Emma Peperkamp", "Antony Soosaipillaj", "Pepijn Bos", "Armando van Bruggen"]],
  ["Sales & network", ["Aren", "Youri van der Donk", "Pieter Bergsma", "Isaak Munster"]],
];

function LaagTegel({ naam, laag }: { naam: string; laag: string }) {
  const person = people.find(p => p.name === naam);
  if (!person) return null;
  return <div>
    <figure><img {...klein(person.image, "(max-width: 900px) 25vw, 180px", [160, 320])} alt="" width="180" height="180" loading="lazy" /></figure>
    <span className={`h-laag${laag === "Partner" ? " is-partner" : ""}`}>{laag}</span>
    <span className="h-functie-naam"><span>{person.name} <LinkedInTeken person={person} /></span><i>{KORTE_ROL[naam] ?? person.role}</i></span>
    <PartnerReferences personName={person.name} compact />
    <NaarPersoon person={person} />
  </div>;
}

function TeamInLagen() {
  const [top, rest] = [LAGEN.slice(0, 2), LAGEN.slice(2)];
  const tegels = (lagen: typeof LAGEN) => lagen.flatMap(([laag, namen]) => namen.map(naam => <LaagTegel key={naam} naam={naam} laag={laag} />));
  return <>
    <div className="h-lagen-muur h-lagen-top">{tegels(top)}</div>
    <div className="h-lagen-muur">{tegels(rest)}</div>
  </>;
}

function TeamPerFunctie() {
  const [keuze, setKeuze] = React.useState("");
  const alle = FUNCTIES.flatMap(groep => groep.mensen.map(naam => ({ naam, functie: groep.functie })));
  const getoond = alle.filter(x => !keuze || x.functie === keuze);
  // 6 oktober 2026 (Marinus): "Benoem ook de groei van het team in de afgelopen week". Telt wie de laatste 7 dagen bijkwam.
  // Bereken de weekgrens na het monteren: de browser kan dagen na deze statische build openen.
  const [nieuw, setNieuw] = React.useState(0);
  React.useEffect(() => {
    setNieuw(people.filter(p => p.sinds && Date.now() - Date.parse(p.sinds) < 7 * 864e5).length);
  }, []);
  const pil = (functie: string, label: string, aantal: number) =>
    <button key={label} type="button" aria-pressed={keuze === functie} onClick={() => setKeuze(functie)}>{label}<small>{aantal}</small></button>;
  return <div className="h-zelf">
    <div className="h-zelf-kop"><b>Team by function</b><span>Independent entrepreneurs, each runs their own business</span></div>
    <div className="h-functie-pillen" role="group" aria-label="Filter by function">
      {pil("", "All", alle.length)}
      {FUNCTIES.map(groep => pil(groep.functie, groep.functie, groep.mensen.length))}
      {nieuw > 0 ? <span className="h-team-groei"><b>+{nieuw}</b> this week · {people.length} people</span> : null}
    </div>
    {!keuze ? <TeamInLagen /> : <div className="h-functie-muur">
      {getoond.map(({ naam }) => {
        const person = people.find(p => p.name === naam);
        if (!person) return null;
        return <div key={naam}>
          <figure><img {...klein(person.image, "(max-width: 900px) 25vw, 120px", [96, 160])} alt="" width="120" height="120" loading="lazy" /></figure>
          <span className="h-functie-naam"><span>{person.name} <LinkedInTeken person={person} /></span><i>{KORTE_ROL[naam] ?? person.role}</i></span>
          <PartnerReferences personName={person.name} compact />
          <NaarPersoon person={person} />
        </div>;
      })}
    </div>}
    <Link to="/vacatures" className="h-team-netwerk">Running your own business too? <b>Join the network &rarr;</b></Link>
  </div>;
}

function DuoTegel({ naam }: { naam: string }) {
  const person = people.find(p => p.name === naam);
  if (!person) return null;
  return <figure>
    <img {...klein(person.image, "(max-width: 900px) 40vw, 200px", [160, 320])} alt="" width="200" height="200" loading="lazy" />
    <figcaption>{person.name} <LinkedInTeken person={person} /><i>{KORTE_ROL[naam] ?? person.role}</i></figcaption>
    <NaarPersoon person={person} />
  </figure>;
}

export function TeamJoin() {
  return <div className="h-team-sectie" translate="no">
    <div className="h-team-kern">
      <div className="h-duo is-sn">
        <div className="h-duo-kop"><span className="h-duo-merk"><Link to="/" aria-label="SocialNow"><img src="/images/klein/SocialNow-Logo-2026-400.webp" alt="SocialNow" width="200" height="38" loading="lazy" /></Link></span><span>Advertisement &amp; Consultancy</span></div>
        <div className="h-duo-rij">{SOCIALNOW_DUO.map(naam => <DuoTegel key={naam} naam={naam} />)}</div>
      </div>
      <div className="h-duo is-attesso">
        <div className="h-duo-kop"><span className="h-duo-merk"><a href="https://www.attesso.com/" target="_blank" rel="noopener noreferrer"><b>~/a</b> Attesso</a></span><span>AI Payments</span></div>
        <div className="h-duo-rij">{ATTESSO_DUO.map(naam => <DuoTegel key={naam} naam={naam} />)}</div>
      </div>
      <div className="h-duo is-fincer">
        <div className="h-duo-kop"><span className="h-duo-merk"><a href="https://www.linkedin.com/in/steven-goudsblom-bb3ab0197/" target="_blank" rel="noopener noreferrer" aria-label="Fincer, Steven Goudsblom on LinkedIn"><img src="/images/merken/fincer.png" alt="Fincer" width="130" height="40" loading="lazy" /></a></span><span>Wealth management</span></div>
        <div className="h-duo-rij"><DuoTegel naam="Steven Goudsblom" /><div className="h-fincer-toelichting"><strong>Wealth management, with personal contact.</strong><p>Steven is our wealth partner, for SocialNow and our clients.</p></div></div>
      </div>
    </div>
    <div className="h-board">
      <div className="h-board-tekst"><b>Board</b><strong>Operations, data and wealth.</strong><span>Michelle, Tristan and Steven</span></div>
      {BOARD.map(naam => <DuoTegel key={naam} naam={naam} />)}
    </div>
    <TeamPerFunctie />
    <Bedrijfsreferenties />
  </div>;
}

// 4 oktober 2026 (Marinus): "de volgende grote tools als AFAS etc top 5 Salesforce", met de echte logo's, "currently build",
// Odoo live "because of their proven free accounting and website layer", en "We believe that AGI is about Universal ERP
// connections". Gebouwd door Tristan (KLM, BearingPoint) en Douwe (ByteChat, ByteVision).
export const INTEGRATIES = [
  { naam: "Salesforce", src: "/images/partners/salesforce.svg", hoog: 26, url: "https://www.salesforce.com" },
  { naam: "AFAS", src: "/images/partners/integraties/afas.png", hoog: 16, url: "https://www.afas.nl" },
  { naam: "Exact", src: "/images/partners/integraties/exact.svg", hoog: 18, url: "https://www.exact.com" },
  { naam: "HubSpot", src: "/images/partners/integraties/hubspot.svg", hoog: 20, url: "https://www.hubspot.com" },
  { naam: "Microsoft Dynamics 365", src: "/images/partners/integraties/dynamics-365.svg", hoog: 22, url: "https://dynamics.microsoft.com" },
];

// 4 oktober 2026 (Marinus): "Zorg dat er Linkedin Links staan bij zowel Tris als Douwe en dat ze beide via de bedrijven ook
// echt doorlinken naar die grote websites."
const extern = { target: "_blank", rel: "noopener noreferrer" } as const;

function Bouwer({ naam, rol, linkedin, nieuw }: { naam: string; rol: string; linkedin: string; nieuw?: boolean }) {
  const person = people.find(p => p.name === naam);
  return <div className="h-bouwer">
    {person && <img className="h-bouwer-foto" {...klein(person.image, 40)} alt="" width="40" height="40" loading="lazy" />}
    <a className="h-bouwer-naam" href={linkedin} {...extern} aria-label={`${person?.name ?? naam} on LinkedIn`}>
      <strong>{person?.name ?? naam} <LinkedInMark />{nieuw && <span className="h-bouwer-nieuw">New partner</span>}</strong><i>{rol}</i>
    </a>
    <PartnerReferences personName={naam} />
  </div>;
}

export function Integraties() {
  return <div className="h-integraties">
    <div className="h-integraties-kop"><b>Currently building</b><span>The big five, after Odoo</span></div>
    <ul className="h-integraties-rij">
      <li className="is-live"><img src="/images/partners/odoo.svg" alt="Odoo" height="20" loading="lazy" /><small>Live</small></li>
      {INTEGRATIES.map(i => <li key={i.naam}><a href={i.url} target="_blank" rel="noopener"><img src={i.src} alt={i.naam} style={{ height: i.hoog }} loading="lazy" /></a></li>)}
    </ul>
    <p><strong>Odoo is live</strong>, because of their <strong>proven free accounting and website layer</strong>.</p>
    <p><strong>We believe AGI is about universal ERP connections.</strong> So as a business owner you have a choice. <strong>You are not guessing, you are choosing.</strong></p>
    <p>A free economy, where experts reach each other through one network. <strong>Like Fiverr, but for businesses</strong>, with their own or custom integrations.</p>
    <p className="h-integraties-belofte"><strong>One central platform.</strong> Your system, free or custom, <b>always stays yours.</b> Not only now, but forever.</p>
  </div>;
}

// De bedrijfsreferenties horen bij het team; ERP-koppelingen staan na het persoonlijke verhaal.
export function Bedrijfsreferenties() {
  return <div className="h-bouwers" role="group" aria-label="Team track record">
    <Bouwer naam="Marinus Bergsma" rol="Founder & CEO" linkedin="https://www.linkedin.com/in/marinus-bergsma-20b81a144/" />
    <Bouwer naam="Tristan Slobbe" rol="Data & AI Engineer" linkedin="https://www.linkedin.com/in/tristan-slobben-105056159/" />
    <Bouwer naam="Douwe Kramer" rol="Co-founder" linkedin="https://www.linkedin.com/in/douwekramer/" />
    <Bouwer naam="Steven Goudsblom" rol="Founder · Wealth management" linkedin="https://www.linkedin.com/in/steven-goudsblom-bb3ab0197/" nieuw />
  </div>;
}
