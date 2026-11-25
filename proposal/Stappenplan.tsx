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
  // 25 november 2026 (Marinus): "Kennismaken moet op 1." Eerst het gesprek, daarna de vier vakgebieden.
  { nr: "01", id: "stap-contact", titel: "Kennismaken", regel: "Een gesprek over jouw situatie. Alles is maatwerk." },
  { nr: "02", id: "stap-website", titel: "Website en branding", regel: "We beginnen bij je website en je merk. Altijd eerst een gratis websitedemo." },
  { nr: "03", id: "stap-marketing", titel: "Marketing en advertenties", regel: "Content en advertenties die werken. Wat rendeert, schalen we op." },
  { nr: "04", id: "stap-operations", titel: "Management en operations", regel: "CRM, processen en cijfers op een stevige basis." },
  { nr: "05", id: "stap-os", titel: "Eén OS met Connect", regel: "Je hele bedrijf in één systeem, met de juiste experts erbij." },
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

// 25 november 2026 (Marinus, via een andere sessie): "Hier is teveel tekst op een klein stuk. Maak van die 5 punten mini animaties
// zodat er minder tekst nodig is en elke stap duidelijk is." Elke kaart heeft nu een kleine, rustige loop in SVG (stippen, groen,
// zwart) met alleen nummer en titel; de animatie toont de stap. Bij reduced motion staat het eindbeeld stil (zie stappenplan.css).
function Mini({ id }: { id: string }) {
  const lijn = "#ffffff38", vlak = "#ffffff12", groen = "#25d366";
  if (id === "stap-website") return <svg viewBox="0 0 160 100" className="st-mini st-mini-web" aria-hidden="true">
    <rect x="16" y="10" width="128" height="80" rx="8" fill="none" stroke={lijn} />
    <line x1="16" y1="24" x2="144" y2="24" stroke={lijn} />
    <circle cx="25" cy="17" r="2" fill={lijn} /><circle cx="32" cy="17" r="2" fill={lijn} /><circle cx="39" cy="17" r="2" fill={lijn} />
    <rect className="st-a1" x="26" y="33" width="70" height="8" rx="3" fill="#fff" opacity=".85" />
    <rect className="st-a2" x="26" y="46" width="50" height="5" rx="2.5" fill={lijn} />
    <rect className="st-a3" x="26" y="60" width="34" height="11" rx="5.5" fill={groen} />
    <rect className="st-a4" x="104" y="33" width="30" height="40" rx="5" fill={vlak} stroke={lijn} />
  </svg>;
  if (id === "stap-marketing") return <svg viewBox="0 0 160 100" className="st-mini st-mini-ads" aria-hidden="true">
    <rect x="16" y="12" width="56" height="76" rx="8" fill={vlak} stroke={lijn} />
    <rect x="24" y="20" width="40" height="34" rx="4" fill="#ffffff1f" />
    <rect x="24" y="60" width="30" height="5" rx="2.5" fill={lijn} /><rect x="24" y="70" width="22" height="5" rx="2.5" fill={lijn} />
    <line x1="84" y1="84" x2="146" y2="84" stroke={lijn} /><line x1="84" y1="20" x2="84" y2="84" stroke={lijn} />
    <polyline className="st-a-lijn" points="88,76 102,68 114,72 126,50 140,30" fill="none" stroke={groen} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
    <circle className="st-a-punt" cx="140" cy="30" r="4" fill={groen} />
  </svg>;
  if (id === "stap-operations") return <svg viewBox="0 0 160 100" className="st-mini st-mini-crm" aria-hidden="true">
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(0 ${16 + i * 19})`}>
      <circle cx="26" cy="6" r="5" fill={vlak} stroke={lijn} />
      <rect x="38" y="3" width="90" height="6" rx="3" fill={vlak} />
      <rect className={`st-a-rij st-r${i}`} x="38" y="3" width={[80, 56, 70, 44][i]} height="6" rx="3" fill={i === 3 ? groen : "#ffffff59"} />
      <circle className={`st-a-vink st-r${i}`} cx="140" cy="6" r="4" fill={groen} />
    </g>)}
  </svg>;
  if (id === "stap-os") return <svg viewBox="0 0 160 100" className="st-mini st-mini-os" aria-hidden="true">
    <rect className="st-a-kader" x="50" y="18" width="60" height="64" rx="10" fill="none" stroke={groen} strokeOpacity=".6" />
    <rect className="st-a-blok st-b0" x="58" y="26" width="20" height="20" rx="4" fill="#fff" opacity=".85" />
    <rect className="st-a-blok st-b1" x="82" y="26" width="20" height="20" rx="4" fill={groen} />
    <rect className="st-a-blok st-b2" x="58" y="54" width="20" height="20" rx="4" fill="#ffffff59" />
    <rect className="st-a-blok st-b3" x="82" y="54" width="20" height="20" rx="4" fill="#ffffff2e" stroke={lijn} />
  </svg>;
  return <svg viewBox="0 0 160 100" className="st-mini st-mini-chat" aria-hidden="true">
    <rect className="st-a-bel1" x="18" y="18" width="78" height="22" rx="11" fill={vlak} stroke={lijn} />
    <rect className="st-a-bel1" x="28" y="27" width="44" height="4" rx="2" fill={lijn} />
    <rect className="st-a-bel2" x="64" y="48" width="78" height="22" rx="11" fill={groen} />
    <rect className="st-a-bel2" x="74" y="57" width="50" height="4" rx="2" fill="#03140a" opacity=".6" />
    <g className="st-a-typen"><circle cx="30" cy="86" r="3" fill={lijn} /><circle cx="40" cy="86" r="3" fill={lijn} /><circle cx="50" cy="86" r="3" fill={lijn} /></g>
  </svg>;
}

export function StappenOverzicht() {
  return <section className="st-wrap st-overzicht" aria-labelledby="st-overzicht-kop">
    <p className="st-label"><i />Zo werken we</p>
    <h2 id="st-overzicht-kop">Van je website tot één systeem voor je hele bedrijf.</h2>
    <p className="st-intro">Vijf stappen, één team dat verantwoordelijk is voor het geheel.</p>
    <ol className="st-lijst">
      {STAPPEN.map((s) => <li key={s.id}>
        <a href={`#${s.id}`} onClick={naar(s.id)} title={s.regel}>
          <Mini id={s.id} />
          <span className="st-nr">{s.nr}</span>
          <b>{s.titel}</b>
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
// 25 november 2026 (Marinus): "Deze mag uit de slider had ik al gezegd": de Atomium-teamfoto staat al elders, dus niet in deze wissel.
const STAP3_FOTOS = [...BEURSFOTOS.filter((f) => f.bestand === "beurs-steef"), ...BEURSFOTOS.filter((f) => f.bestand !== "beurs-steef" && f.bestand !== "team-atomium")];

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
  return <section className="st-wrap st-geheel" aria-label="Management, het OS met Connect en kennismaken">
    <article className="st-kaart" id="stap-operations">
      <Fotowissel />
      <div className="st-kaart-tekst">
        <p className="st-label"><i />Stap 04 · Management en operations</p>
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
        <p className="st-label"><i />Stap 05 · Eén OS met Connect</p>
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
        <p className="st-label"><i />Stap 01 · Kennismaken</p>
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
