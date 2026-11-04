import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Boxes, Globe, Play, ShieldCheck, Workflow, X } from "lucide-react";
import { openPlanCall } from "./PlanCall";
import { CRAFTURE, DIRECT, VIA_CRAFTURE, merk } from "./ExplainerPlayer";
import "./header-algemeen.css";

// Homepage-header, concept 4 november 2026. MARINUS: "Verder moet de focus bij de header niet liggen op connect en os." en
// "Meer gewoon mooi algemeen houden en duidelijk Odoo en andere ERP hulp. Wat Odoo content erbij die goed werkt."
// Dus links één algemene kop met vier diensten, Odoo en ERP voorop; rechts onze stand op Odoo Experience 2026 in Brussel (beeld uit
// de aftermovie, zie Bereikt.tsx), het resultaat uit Bereikt en onze Odoo-partners met hun keurmerken.
// Uit vier opties koos hij de grote standfoto. De vorige header met OS en Connect (HeaderBestaand.tsx) blijft staan voor later.

const DIENSTEN = [
  { icoon: Boxes, kop: "Odoo-implementatie" },
  { icoon: Workflow, kop: "Ander ERP-systeem" },
  { icoon: Globe, kop: "Websites en marketing" },
  { icoon: ShieldCheck, kop: "Veilige, lokale AI" },
];

// 4 november 2026 (Marinus): "die Partners even beter benoemen en ook weer hun certifacaten etc erbij." Naam, wat ze doen, cijfers
// en keurmerken komen uit SamenEnVeilig.tsx (nagelezen op hun eigen sites, 19 oktober 2026). Claude, Sage en QuickBooks zijn
// partners van Indexworld en geen keurmerken; die staan hier dus niet.
const PARTNERS = [
  {
    naam: "Indexworld", href: "https://indexworld.net", logo: "/images/home-header/indexworld.png", wit: true,
    tekst: "Odoo-partner met boekhouding en ERP als kern.", cijfers: ["150+ klanten", "3 continenten"],
    keur: [{ naam: "Odoo-partner", src: "/images/partners/samen/odoo-partner.webp" }],
  },
  {
    naam: "Uncanny", href: "https://uncannycs.com", logo: "/images/home-header/uncanny-op-zwart.svg", wit: false,
    tekst: "Odoo Silver Partner en Shopify-partner.", cijfers: ["135+ klanten", "250+ projecten"],
    keur: [
      { naam: "Odoo Silver Partner", src: "/images/partners/samen/odoo.svg" },
      { naam: "Shopify Partners", src: "/images/partners/samen/shopify.svg" },
      { naam: "Salesforce ISV-partner", src: "/images/partners/samen/salesforce.svg" },
      { naam: "Adobe Certified Professional", src: "/images/partners/samen/adobe.svg" },
    ],
  },
];

// 4 november 2026 (Marinus): "Deze graag nog erbij. en een knop bekijk de video." Dus de Trusted by-balk uit de oude header
// (zelfde merken en volgorde als het startbeeld in ExplainerPlayer.tsx) en een knop die de SocialNow-film in een venster afspeelt.
const FILM = "/video/os/socialnow-os-explainer.mp4?v=20261021-os04";

export default function HeaderAlgemeen() {
  const venster = useRef<HTMLDialogElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const open = () => { venster.current?.showModal(); void film.current?.play().catch(() => {}); };
  const sluit = () => { film.current?.pause(); venster.current?.close(); };
  return (
    <section className="sn-alg" aria-labelledby="sn-alg-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst">
          <p className="sn-alg-label"><i />Odoo · ERP · Websites · AI</p>
          <h1 id="sn-alg-kop">Je bedrijf goed ingericht, van Odoo tot website<span className="sn-alg-punt">.</span></h1>
          <p className="sn-alg-uitleg">We richten Odoo en andere ERP-systemen in, koppelen alles aan elkaar en houden je data veilig. Echte experts, met AI als hulp.</p>
          <ul className="sn-alg-diensten">
            {DIENSTEN.map(({ icoon: Icoon, kop }) => <li key={kop}><Icoon size={18} aria-hidden="true" /><strong>{kop}</strong></li>)}
          </ul>
          {/* 4 november 2026 (Marinus): "Wij beginnen altijd met een GRATIS WEBSITE DEMO." Dus dat is de eerste knop. */}
          <div className="sn-alg-acties">
            <Link className="sn-alg-knop" to="/security"><span>Start met een gratis websitedemo</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
            <button type="button" className="sn-alg-knop sn-alg-knop-rand" aria-haspopup="dialog" onClick={() => openPlanCall({ onderdelen: ["crm", "dashboard"] })}>
              <span>Plan een gesprek</span><ArrowUpRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="sn-alg-beeld">
          <figure className="sn-alg-foto">
            <img src="/images/odoo-experience-stand.webp" alt="Ons team op de eigen stand op Odoo Experience 2026 in Brussel" />
            <figcaption><span className="sn-alg-klein">Odoo Experience 2026 · Brussel</span><strong>Met een eigen stand<span className="sn-alg-punt">.</span></strong></figcaption>
            <button type="button" className="sn-alg-knop-video" aria-haspopup="dialog" onClick={open}><Play size={15} aria-hidden="true" /><span>Bekijk de video</span></button>
          </figure>
          <div className="sn-alg-kaart sn-alg-zwevend">
            <p className="sn-alg-klein">Resultaat bij een klant</p>
            <p className="sn-alg-groot"><b>100</b> leads in één week<span className="sn-alg-punt">.</span></p>
            <p>Meta en Odoo gekoppeld: elke offerteaanvraag komt direct in hun systeem.</p>
          </div>
          <div className="sn-alg-kaart sn-alg-partners">
            <p className="sn-alg-klein">Onze Odoo-partners</p>
            <ul>
              {PARTNERS.map(p => <li key={p.naam}>
                <div className="sn-alg-partner-kop">
                  <a href={p.href} target="_blank" rel="noopener noreferrer"><img className={p.wit ? "is-wit" : undefined} src={p.logo} alt={p.naam} /></a>
                  <span className="sn-alg-cijfers">{p.cijfers.map(c => <span key={c}>{c}</span>)}</span>
                </div>
                <p>{p.tekst}</p>
                <div className="sn-alg-certs">{p.keur.map(k => <img key={k.naam} src={k.src} alt={k.naam} title={k.naam} loading="lazy" />)}</div>
              </li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className="sn-alg-trusted">
        <span translate="no">Trusted by</span>
        <div className="sn-alg-merken">
          <span className="sn-alg-groep">{DIRECT.map(merk)}</span>
          <span className="sn-alg-groep">{merk(CRAFTURE)}<i className="sn-alg-streep" aria-hidden="true" />{VIA_CRAFTURE.map(merk)}</span>
        </div>
      </div>
      <dialog className="sn-alg-venster" ref={venster} aria-label="SocialNow-film" onClose={() => film.current?.pause()} onClick={e => { if (e.target === venster.current) sluit(); }}>
        <button type="button" className="sn-alg-sluit" onClick={sluit} aria-label="Sluit de film"><X size={20} aria-hidden="true" /></button>
        <video ref={film} src={FILM} poster="/video/os/socialnow-os-explainer-poster.jpg?v=20261021-os04" controls playsInline preload="none" />
      </dialog>
    </section>
  );
}
