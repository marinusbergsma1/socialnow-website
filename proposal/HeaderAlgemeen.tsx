import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Boxes, Globe, Play, ShieldCheck, Workflow } from "lucide-react";
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

export default function HeaderAlgemeen() {
  return (
    <section className="sn-alg" aria-labelledby="sn-alg-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst">
          <p className="sn-alg-label"><i />Odoo · ERP · Websites · AI</p>
          <h1 id="sn-alg-kop">Je bedrijf goed ingericht, van Odoo tot website<span className="sn-alg-punt">.</span></h1>
          <p className="sn-alg-uitleg">We richten Odoo en andere ERP-systemen in, koppelen alles aan elkaar en houden je data veilig. Echte experts, met AI als hulp.</p>
          <ul className="sn-alg-diensten">
            {DIENSTEN.map(({ icoon: Icoon, kop, tekst }) => (
              <li key={kop}><Icoon size={18} aria-hidden="true" /><span><strong>{kop}</strong>{tekst}</span></li>
            ))}
          </ul>
          {/* 4 november 2026 (Marinus): "Wij beginnen altijd met een GRATIS WEBSITE DEMO." Dus dat is de eerste knop. */}
          <div className="sn-alg-acties">
            <Link className="sn-alg-knop" to="/security"><span>Start met een gratis websitedemo</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
            <button type="button" className="sn-alg-knop sn-alg-knop-rand" aria-haspopup="dialog" onClick={() => openPlanCall({ onderdelen: ["crm", "dashboard"] })}>
              <span>Plan een gesprek</span><ArrowUpRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="sn-alg-odoo">
          <a className="sn-alg-film" href="/video/odoo-experience/odoo-experience.mp4" target="_blank" rel="noopener" aria-label="Bekijk de aftermovie van Odoo Experience 2026">
            <BentoFilm src="/video/odoo-experience/odoo-experience-kort.mp4" poster="/video/odoo-experience/odoo-experience-kort-poster.webp" label="Odoo Experience 2026 in Brussel" geluid={false} />
            <span className="sn-alg-film-label"><Play size={12} aria-hidden="true" />Aftermovie</span>
          </a>
          <div className="sn-alg-kaarten">
            <div className="sn-alg-kaart">
              <p className="sn-alg-klein">Odoo Experience 2026</p>
              <p className="sn-alg-groot">Met een eigen stand in Brussel<span className="sn-alg-punt">.</span></p>
              <p>Drie dagen gesprekken met bedrijven die Odoo gebruiken of overstappen.</p>
            </div>
            <div className="sn-alg-kaart">
              <p className="sn-alg-klein">Resultaat bij een klant</p>
              <p className="sn-alg-groot"><b>100</b> leads in één week<span className="sn-alg-punt">.</span></p>
              <p>Meta en Odoo gekoppeld: elke offerteaanvraag komt direct in hun systeem.</p>
            </div>
            <div className="sn-alg-kaart sn-alg-keur">
              <p className="sn-alg-klein">Gebouwd met Odoo-partners</p>
              <ul>
                {KEURMERKEN.map(k => <li key={k.via}><img src={k.src} alt={k.naam} loading="lazy" /><small translate="no">via {k.via}</small></li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
