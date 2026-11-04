import React from "react";
import { ArrowUpRight } from "lucide-react";
import "./experts-geloof.css";

// /producten ("wat wij doen"), direct onder de header. 4 november 2026 (avond, Marinus): "meer focus over de connectie en ons geloof in
// dat experts altijd nodig zullen zijn plus de partners die helpen bouwen en attesso en hun allemaal met de logo's".
// Alleen feiten die al op de site staan (SamenEnVeilig.tsx, ConnectExperts.tsx). Geen modelnamen.
const PUNTEN = [
  { kop: "Echte mensen.", tekst: "Strategen, developers, designers, ad-specialisten en financiële experts die je bij naam kent." },
  { kop: "In je eigen OS.", tekst: "Experts doen het werk in je eigen OS, per maand of per opdracht." },
  { kop: "AI helpt, mensen beslissen.", tekst: "AI neemt werk uit handen. Doelen stellen, kiezen en verantwoordelijkheid nemen doen mensen." },
];

const PARTNERS = [
  { naam: "Indexworld", rol: "Bouwt SocialNow OS", href: "https://indexworld.net", logo: "/images/home-header/indexworld.png", wit: true },
  { naam: "Uncanny", rol: "Bouwt SocialNow Connect", href: "https://uncannycs.com", logo: "/images/home-header/uncanny-op-zwart.svg" },
  { naam: "Komen Consultancy", rol: "Finance, data en operations", href: "https://www.komenconsultancy.com/", logo: "/images/merken/komen-operation-systems.webp" },
  { naam: "Attesso", rol: "Advertentiegeld binnen jouw budget", href: "https://www.attesso.com/", logo: "" },
];

export default function ExpertsGeloof() {
  return <section className="sn-geloof h-wrap" aria-labelledby="sn-geloof-kop">
    <div className="sn-geloof-kop">
      <p className="sn-geloof-label"><i />Ons geloof</p>
      <h2 id="sn-geloof-kop">Experts blijven altijd nodig<span className="sn-alg-punt">.</span></h2>
      <p className="sn-geloof-uitleg">Daarom verbindt SocialNow Connect je met echte experts, en bouwen we het OS samen met partners die elk een eigen vak beheersen.</p>
      <a className="sn-pill sn-pill-blauw" href="#team"><span>Vind je expert</span><ArrowUpRight size={17} aria-hidden="true" /></a>
    </div>
    <ul className="sn-geloof-punten">
      {PUNTEN.map((p) => <li key={p.kop}><strong>{p.kop}</strong><span>{p.tekst}</span></li>)}
    </ul>
    <div className="sn-geloof-partners">
      <p className="sn-geloof-label">Partners die meebouwen</p>
      <ul>
        {PARTNERS.map((p) => <li key={p.naam}>
          <a href={p.href} target="_blank" rel="noopener noreferrer">
            {p.logo ? <img className={p.wit ? "is-wit" : undefined} src={p.logo} alt={p.naam} loading="lazy" /> : <code translate="no" aria-label={p.naam}>~/attesso</code>}
            <small>{p.rol}</small>
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}
