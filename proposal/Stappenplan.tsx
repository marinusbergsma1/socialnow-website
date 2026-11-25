import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import { people } from "./content";
import { klein } from "./licht";
import OdooFilm from "./OdooFilm";
import "./vijf-jaar.css";
import "./stappenplan.css";

// Homepage als stappenplan, 25 november 2026. MARINUS bij "Onze websites / Altijd een gratis websitedemo": "Kan deze tekst meer op
// basis van de stappen vanuit de video zelf? Dan kan je er een stappenplan van maken die eigenlijk voor iedereen geld. Zonder veel te
// veranderen want de clientcases etc kunnen dan zijn voor branding en operations en management kan dan het de Odoo Experience zijn en
// misschien een explainer video zoals die van OS en CONNECT [...] en daarna gwn de contactpagina." en "Verder misschien nog het team
// als slider ook boven de websitestap nog."
// De stappen volgen de explainer (06-SocialNow-lang): website en branding, social media en advertenties, CRM en backend, alles in één
// zelflerend lokaal AI-systeem met Connect, en dan een gesprek. De bestaande secties (websites, branding, video) blijven staan; ze
// krijgen alleen een stapkop. Volgorde staat in Home() in pages.tsx.

export const STAPPEN = [
  { nr: "01", id: "stap-website", titel: "Website en branding", regel: "We beginnen bij je website en je merk. Altijd eerst een gratis websitedemo." },
  { nr: "02", id: "stap-marketing", titel: "Marketing en advertenties", regel: "Content en advertenties die werken. Wat rendeert, schalen we op." },
  { nr: "03", id: "stap-operations", titel: "Management en operations", regel: "CRM, processen en cijfers op een stevige basis." },
  { nr: "04", id: "stap-os", titel: "Eén OS met Connect", regel: "Je hele bedrijf in één systeem, met de juiste experts erbij." },
  { nr: "05", id: "stap-contact", titel: "Kennismaken", regel: "Een gesprek over jouw situatie. Alles is maatwerk." },
] as const;

const naar = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  const doel = document.getElementById(id);
  if (!doel) return;
  e.preventDefault();
  doel.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Teamslider boven de websitestap: alle mensen uit content.ts in een rustig doorlopende rij; stopt bij aanwijzen en bij reduced motion.
export function TeamSlider() {
  const rij = [...people, ...people];
  return <section className="st-team" aria-labelledby="st-team-kop">
    <div className="st-wrap st-team-kop">
      <div>
        <p className="st-label"><i />Ons team</p>
        <h2 id="st-team-kop">De mensen die het werk doen.</h2>
      </div>
      <Link className="st-link" to="/team">Ontmoet het hele team<ArrowUpRight size={15} aria-hidden="true" /></Link>
    </div>
    <div className="st-team-baan">
      <ul className="st-team-rij">
        {rij.map((p, i) => <li key={`${p.name}-${i}`} aria-hidden={i >= people.length}>
          <img {...klein(p.image, "180px", [160, 320])} alt="" width="180" height="225" loading="lazy" />
          <strong translate="no">{p.name}</strong>
          <span>{p.role}</span>
        </li>)}
      </ul>
    </div>
  </section>;
}

export function StappenOverzicht() {
  return <section className="st-wrap st-overzicht" aria-labelledby="st-overzicht-kop">
    <p className="st-label"><i />Zo werken we</p>
    <h2 id="st-overzicht-kop">Van je website tot één systeem voor je hele bedrijf.</h2>
    <p className="st-intro">Software alleen laat je bedrijf niet groeien; duidelijkheid en samenwerking wel. Daarom nemen we als team verantwoordelijkheid voor de hele oplossing, in vijf stappen.</p>
    <ol className="st-lijst">
      {STAPPEN.map((s) => <li key={s.id}>
        <a href={`#${s.id}`} onClick={naar(s.id)}>
          <span className="st-nr">{s.nr}</span>
          <b>{s.titel}</b>
          <span>{s.regel}</span>
        </a>
      </li>)}
    </ol>
  </section>;
}

// Kop boven een bestaande sectie, zodat die sectie een stap in het plan wordt.
export function StapKop({ nr, titel, kop, tekst }: { nr: string; titel: string; kop: string; tekst: string }) {
  const stap = STAPPEN.find((s) => s.nr === nr)!;
  return <header className="st-wrap st-stapkop" id={stap.id}>
    <p className="st-label"><i />Stap {nr} · {titel}</p>
    <h2>{kop}</h2>
    <p className="st-intro">{tekst}</p>
  </header>;
}

export function StapOperations() {
  return <section className="st-wrap st-blok" id="stap-operations" aria-labelledby="st-ops-kop">
    <div className="st-blok-tekst">
      <p className="st-label"><i />Stap 03 · Management en operations</p>
      <h2 id="st-ops-kop">Grip op je processen, systemen en cijfers.</h2>
      <p className="st-intro">Je CRM, sales en finance komen samen op een stevige basis, zoals Odoo, AFAS, Exact of HubSpot. Wij richten het in rond hoe jouw bedrijf werkt en blijven verantwoordelijk tot het loopt.</p>
      <ul className="st-punten">
        <li>Doorlichting van processen, rollen en knelpunten</li>
        <li>Werkafspraken en een overzicht van de cijfers</li>
        <li>Invoering en begeleiding van je team</li>
      </ul>
      <Link className="sn-pill" to="/contact?onderwerp=management-operations"><span>Bespreek je operatie</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
    </div>
    <div className="st-blok-film">
      <OdooFilm />
      <p className="st-onderschrift">Ons team op Odoo Experience 2026 in Brussel.</p>
    </div>
  </section>;
}

// De OS- en Connect-explainer. De bestaande OS-film noemt nog het gratis aanbod en Odoo; Marinus wil hier een film zonder. Zolang die
// nieuwe film er niet is, staat FILM_OS_CONNECT op null en toont deze stap alleen tekst. Zet hier het pad zodra de film klaar is.
const FILM_OS_CONNECT: string | null = null;
const POSTER_OS_CONNECT = "";

export function StapOsConnect() {
  const film = useRef<HTMLVideoElement>(null);
  const [speelt, zetSpeelt] = useState(false);
  const wissel = () => {
    const v = film.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };
  return <section className={`st-wrap st-blok${FILM_OS_CONNECT ? " is-omgekeerd" : ""}`} id="stap-os" aria-labelledby="st-os-kop">
    <div className="st-blok-tekst">
      <p className="st-label"><i />Stap 04 · Eén OS met Connect</p>
      <h2 id="st-os-kop">Je hele bedrijf in één systeem.</h2>
      <p className="st-intro">Website, marketing, CRM en finance komen samen in één eigen, lokaal AI-systeem op maat. Met SocialNow Connect schakel je daarin echte experts in, en jij bepaalt tot welke informatie zij toegang krijgen.</p>
      <ul className="st-punten">
        <li>Custom OS rond jouw bedrijf, veilig en in eigen beheer</li>
        <li>Je team en AI-agents werken op één plek</li>
        <li>Connect: experts uit ons netwerk, met toegang die jij kiest</li>
      </ul>
      <Link className="sn-pill" to="/contact?onderwerp=os"><span>Bespreek je Custom OS</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
    </div>
    {FILM_OS_CONNECT && <figure className="st-film" data-speelt={speelt}>
      <video ref={film} src={FILM_OS_CONNECT} poster={POSTER_OS_CONNECT} playsInline preload="metadata" aria-label="Uitleg: SocialNow OS en Connect"
        onClick={wissel} onPlay={() => zetSpeelt(true)} onPause={() => zetSpeelt(false)} onEnded={() => zetSpeelt(false)} />
      {!speelt && <button type="button" className="sn-alg-knop-video st-film-knop" onClick={wissel}><Play size={15} aria-hidden="true" /><span>Bekijk de uitleg</span></button>}
    </figure>}
  </section>;
}

export function StapContact() {
  return <section className="st-wrap st-slot" id="stap-contact" aria-labelledby="st-slot-kop">
    <p className="st-label"><i />Stap 05 · Kennismaken</p>
    <h2 id="st-slot-kop">Benieuwd wat dit voor jou betekent?</h2>
    <p className="st-intro">Plan een gesprek en we bespreken samen alle details. Alles is maatwerk: je krijgt vooraf een voorstel met een vaste prijs.</p>
    <div className="st-knoppen">
      <Link className="sn-pill" to="/contact"><span>Neem contact op</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
      <a className="sn-pill sn-pill-blauw" href="/afspraak"><span>Plan een call</span><ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>
  </section>;
}
