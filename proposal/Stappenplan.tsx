import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import { people } from "./content";
import { klein } from "./licht";
import { BEURSFOTOS } from "./HeaderAlgemeen";
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
// 25 november 2026 (Marinus, bij de foto van Femke Oostendorp): "Kan deze weg van de slider?" Alleen uit de slider; /team blijft gelijk.
const NIET_IN_SLIDER = ["Femke Oostendorp"];

export function TeamSlider() {
  const mensen = people.filter((p) => !NIET_IN_SLIDER.includes(p.name));
  const rij = [...mensen, ...mensen];
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
        {rij.map((p, i) => <li key={`${p.name}-${i}`} aria-hidden={i >= mensen.length}>
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

// 25 november 2026 (Marinus, bij stap 03 met de staande Odoo-film en veel lege ruimte): "Deze en de stappen eronder wil ik graag met
// de afbeeldingen die eerste bij de header stonden en meer als 1 geheel. Nu ziet het er erg lelijk uit." Stap 03, 04 en 05 zijn daarom
// één blok van kaarten: 03 met Steef aan tafel, 04 met de nieuwe OS- en Connect-film (87-custom-os-connect-20261125: zonder gratis
// onderdelen, prijzen of Odoo), 05 breed met het team bij het Atomium. Dezelfde beursfoto's als de fotowissel in de header.
const FILM_OS_CONNECT = "/video/explainer/socialnow-os-connect.mp4";
const POSTER_OS_CONNECT = "/video/explainer/socialnow-os-connect.jpg";

function Punten({ items }: { items: string[] }) {
  return <ul className="st-punten">{items.map((p) => <li key={p}>{p}</li>)}</ul>;
}

// Later die dag (Marinus, bij de foto van stap 03): "Deze foto mag constant veranderen op dezelfde manier als ie dat al deed bij de
// header." Dezelfde beursfoto's, elke 3 seconden een overvloei en een langzame zoom; begint bij Steef aan tafel. Stopt bij reduced motion.
const STAP3_FOTOS = [...BEURSFOTOS.filter((f) => f.bestand === "beurs-steef"), ...BEURSFOTOS.filter((f) => f.bestand !== "beurs-steef")];

function Fotowissel() {
  const [foto, zetFoto] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => zetFoto((vorige) => (vorige + 1) % STAP3_FOTOS.length), 3000);
    return () => window.clearInterval(timer);
  }, []);
  return <div className="st-kaart-beeld st-wissel">
    {STAP3_FOTOS.map(({ bestand, alt }, index) => <img key={bestand} src={`/images/verhaal/${bestand}.webp`} alt={alt} width="900" height="1200" loading="lazy"
      data-actief={foto === index} aria-hidden={foto !== index} className={bestand === "beurs-marinus" ? "is-gesprek" : undefined} />)}
  </div>;
}

export function StappenSlot() {
  const film = useRef<HTMLVideoElement>(null);
  const [speelt, zetSpeelt] = useState(false);
  const wissel = () => {
    const v = film.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };
  return <section className="st-wrap st-geheel" aria-label="Stap 03 tot en met 05">
    <article className="st-kaart" id="stap-operations">
      <Fotowissel />
      <div className="st-kaart-tekst">
        <p className="st-label"><i />Stap 03 · Management en operations</p>
        <h3>Grip op je processen, systemen en cijfers.</h3>
        <p>Je CRM, sales en finance komen samen op een stevige basis, zoals Odoo, AFAS, Exact of HubSpot. Wij richten het in rond hoe jouw bedrijf werkt en blijven verantwoordelijk tot het loopt.</p>
        <Punten items={["Doorlichting van processen, rollen en knelpunten", "Werkafspraken en een overzicht van de cijfers", "Invoering en begeleiding van je team"]} />
        <Link className="sn-pill" to="/contact?onderwerp=management-operations"><span>Bespreek je operatie</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </article>

    <article className="st-kaart is-film" id="stap-os">
      <figure className="st-kaart-beeld st-film" data-speelt={speelt}>
        <video ref={film} src={FILM_OS_CONNECT} poster={POSTER_OS_CONNECT} playsInline preload="metadata" aria-label="Uitleg: SocialNow OS en Connect"
          onClick={wissel} onPlay={() => zetSpeelt(true)} onPause={() => zetSpeelt(false)} onEnded={() => zetSpeelt(false)} />
        {!speelt && <button type="button" className="sn-alg-knop-video st-film-knop" onClick={wissel}><Play size={15} aria-hidden="true" /><span>Bekijk de uitleg</span></button>}
      </figure>
      <div className="st-kaart-tekst">
        <p className="st-label"><i />Stap 04 · Eén OS met Connect</p>
        <h3>Je hele bedrijf in één systeem.</h3>
        <p>Website, marketing, CRM en finance komen samen in één eigen, lokaal AI-systeem op maat. Met SocialNow Connect schakel je daarin echte experts in, en jij bepaalt tot welke informatie zij toegang krijgen.</p>
        <Punten items={["Custom OS rond jouw bedrijf, veilig en in eigen beheer", "Je team en AI-agents werken op één plek", "Connect: experts uit ons netwerk, met toegang die jij kiest"]} />
        <Link className="sn-pill" to="/contact?onderwerp=os"><span>Bespreek je Custom OS</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </article>

    <article className="st-kaart is-breed" id="stap-contact">
      <div className="st-kaart-beeld">
        <img src="/images/verhaal/team-atomium.webp" alt="Ons team bij het Atomium in Brussel" width="900" height="1200" loading="lazy" />
      </div>
      <div className="st-kaart-tekst">
        <p className="st-label"><i />Stap 05 · Kennismaken</p>
        <h3>Benieuwd wat dit voor jou betekent?</h3>
        <p>Plan een gesprek en we bespreken samen alle details. Alles is maatwerk: je krijgt vooraf een voorstel met een vaste prijs.</p>
        <div className="st-knoppen">
          <Link className="sn-pill" to="/contact"><span>Neem contact op</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
          <a className="sn-pill sn-pill-blauw" href="/afspraak"><span>Plan een call</span><ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </article>
  </section>;
}
