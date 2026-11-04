import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BarChart3, Boxes, FolderKanban, Globe, Megaphone, Package, Play, Receipt, ShieldCheck, ShoppingCart, Users, Workflow } from "lucide-react";
import { BentoFilm } from "./Bento";
import { openPlanCall } from "./PlanCall";
import "./header-algemeen.css";

// Homepage-header, concept 4 november 2026. MARINUS: "Verder moet de focus bij de header niet liggen op connect en os." en
// "Meer gewoon mooi algemeen houden en duidelijk Odoo en andere ERP hulp. Wat Odoo content erbij die goed werkt."
// Dus links één algemene kop met vier diensten, Odoo en ERP voorop; rechts de aftermovie van Odoo Experience 2026 (onze stand
// in Brussel, dezelfde film als in Bereikt.tsx) met de Odoo-keurmerken van onze bouwpartners en het kWh-resultaat uit Bereikt.
// De vorige header met OS en Connect (HeaderBestaand.tsx) blijft staan voor later.

const DIENSTEN = [
  { icoon: Boxes, kop: "Odoo-implementatie", tekst: "Inrichten, overzetten en je team trainen, samen met Odoo-partners Indexworld en Uncanny." },
  { icoon: Workflow, kop: "Ander ERP-systeem", tekst: "Werk je al met een ander pakket? We koppelen het aan je website, CRM en boekhouding." },
  { icoon: Globe, kop: "Websites en marketing", tekst: "Een snelle website en campagnes waarvan elke aanvraag direct in je systeem landt." },
  { icoon: ShieldCheck, kop: "Veilige, lokale AI", tekst: "AI die op je eigen data werkt, met experts die alles controleren." },
];

const KEURMERKEN = [
  { naam: "Odoo Silver Partner", src: "/images/partners/samen/odoo.svg", via: "Uncanny" },
  { naam: "Odoo-partner", src: "/images/partners/samen/odoo-partner.webp", via: "Indexworld" },
];

// 4 november 2026 (Marinus): "Geef nog even wat opties voor de header". Vier opties met ?header=1 tot 4 in de adresbalk; zonder
// keuze optie 1. Na zijn keuze blijft er één over.
// Optie 4 toont de Odoo-apps die we inrichten, met eigen iconen (geen Odoo-appiconen).
const APPS = [
  { icoon: Users, naam: "CRM" }, { icoon: ShoppingCart, naam: "Verkoop" }, { icoon: Receipt, naam: "Boekhouding" }, { icoon: Package, naam: "Voorraad" },
  { icoon: FolderKanban, naam: "Projecten" }, { icoon: Globe, naam: "Website" }, { icoon: Megaphone, naam: "Marketing" }, { icoon: BarChart3, naam: "Rapportages" },
];
type Optie = "1" | "2" | "3" | "4";
const kiesOptie = (): Optie => {
  const o = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("header");
  return o === "2" || o === "3" || o === "4" ? o : "1";
};

function Kop() {
  return <>
    <p className="sn-alg-label"><i />Odoo · ERP · Websites · AI</p>
    <h1 id="sn-alg-kop">Je bedrijf goed ingericht, van Odoo tot website<span className="sn-alg-punt">.</span></h1>
    <p className="sn-alg-uitleg">We richten Odoo en andere ERP-systemen in, koppelen alles aan elkaar en houden je data veilig. Echte experts, met AI als hulp.</p>
  </>;
}

function Diensten({ kort = false }: { kort?: boolean }) {
  return <ul className={`sn-alg-diensten${kort ? " sn-alg-diensten-kort" : ""}`}>
    {DIENSTEN.map(({ icoon: Icoon, kop, tekst }) => (
      <li key={kop}><Icoon size={18} aria-hidden="true" /><span><strong>{kop}</strong>{!kort && tekst}</span></li>
    ))}
  </ul>;
}

function Acties() {
  // 4 november 2026 (Marinus): "Wij beginnen altijd met een GRATIS WEBSITE DEMO." Dus dat is de eerste knop.
  return <div className="sn-alg-acties">
    <Link className="sn-alg-knop" to="/security"><span>Start met een gratis websitedemo</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
    <button type="button" className="sn-alg-knop sn-alg-knop-rand" aria-haspopup="dialog" onClick={() => openPlanCall({ onderdelen: ["crm", "dashboard"] })}>
      <span>Plan een gesprek</span><ArrowUpRight size={17} aria-hidden="true" />
    </button>
  </div>;
}

function Film() {
  return <a className="sn-alg-film" href="/video/odoo-experience/odoo-experience.mp4" target="_blank" rel="noopener" aria-label="Bekijk de aftermovie van Odoo Experience 2026">
    <BentoFilm src="/video/odoo-experience/odoo-experience-kort.mp4" poster="/video/odoo-experience/odoo-experience-kort-poster.webp" label="Odoo Experience 2026 in Brussel" geluid={false} />
    <span className="sn-alg-film-label"><Play size={12} aria-hidden="true" />Aftermovie</span>
  </a>;
}

const Stand = () => <div className="sn-alg-kaart">
  <p className="sn-alg-klein">Odoo Experience 2026</p>
  <p className="sn-alg-groot">Met een eigen stand in Brussel<span className="sn-alg-punt">.</span></p>
  <p>Drie dagen gesprekken met bedrijven die Odoo gebruiken of overstappen.</p>
</div>;
const Leads = () => <div className="sn-alg-kaart">
  <p className="sn-alg-klein">Resultaat bij een klant</p>
  <p className="sn-alg-groot"><b>100</b> leads in één week<span className="sn-alg-punt">.</span></p>
  <p>Meta en Odoo gekoppeld: elke offerteaanvraag komt direct in hun systeem.</p>
</div>;
const Keur = () => <div className="sn-alg-kaart sn-alg-keur">
  <p className="sn-alg-klein">Gebouwd met Odoo-partners</p>
  <ul>
    {KEURMERKEN.map(k => <li key={k.via}><img src={k.src} alt={k.naam} loading="lazy" /><small translate="no">via {k.via}</small></li>)}
  </ul>
</div>;

export default function HeaderAlgemeen() {
  const optie = kiesOptie();
  if (optie === "2") return (
    <section className="sn-alg sn-alg-2" aria-labelledby="sn-alg-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst"><Kop /><Acties /></div>
        <Diensten />
        <div className="sn-alg-bewijs">
          <figure className="sn-alg-foto"><img src="/images/odoo-experience-stand.webp" alt="Ons team op de eigen stand op Odoo Experience 2026 in Brussel" /></figure>
          <Stand /><Leads /><Keur />
        </div>
      </div>
    </section>
  );
  if (optie === "3") return (
    <section className="sn-alg sn-alg-3" aria-labelledby="sn-alg-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst"><Kop /><Diensten kort /><Acties /></div>
        <div className="sn-alg-groot-beeld">
          <figure className="sn-alg-foto"><img src="/images/odoo-experience-stand.webp" alt="Ons team op de eigen stand op Odoo Experience 2026 in Brussel" />
            <figcaption><span className="sn-alg-klein">Odoo Experience 2026 · Brussel</span><strong>Met een eigen stand<span className="sn-alg-punt">.</span></strong></figcaption>
          </figure>
          <div className="sn-alg-zwevend"><Leads /></div>
          <Keur />
        </div>
      </div>
    </section>
  );
  if (optie === "4") return (
    <section className="sn-alg sn-alg-4" aria-labelledby="sn-alg-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst"><Kop /><Diensten kort /><Acties /></div>
        <div className="sn-alg-apps">
          <p className="sn-alg-klein">Wat we in Odoo voor je inrichten</p>
          <ul>{APPS.map(({ icoon: Icoon, naam }) => <li key={naam}><span><Icoon size={22} aria-hidden="true" /></span>{naam}</li>)}</ul>
          <p className="sn-alg-ander"><Workflow size={16} aria-hidden="true" /><span><strong>Ander ERP-pakket?</strong> We koppelen het aan je website, CRM en boekhouding.</span></p>
          <Keur />
        </div>
      </div>
    </section>
  );
  return (
    <section className="sn-alg" aria-labelledby="sn-alg-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst"><Kop /><Diensten /><Acties /></div>
        <div className="sn-alg-odoo">
          <Film />
          <div className="sn-alg-kaarten"><Stand /><Leads /><Keur /></div>
        </div>
      </div>
    </section>
  );
}
