import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Boxes, Check, Globe, Play, ShieldCheck, Workflow, X } from "lucide-react";
import { openPlanCall } from "./PlanCall";
import { CRAFTURE, DIRECT, VIA_CRAFTURE, merk } from "./ExplainerPlayer";
import "./header-algemeen.css";

// Homepage-header, concept 4 november 2026. MARINUS: "Verder moet de focus bij de header niet liggen op connect en os." en
// "Meer gewoon mooi algemeen houden en duidelijk Odoo en andere ERP hulp. Wat Odoo content erbij die goed werkt."
// Dus links één algemene kop met vier diensten, Odoo en ERP voorop; rechts onze stand op Odoo Experience 2026 in Brussel (beeld uit
// de aftermovie, zie Bereikt.tsx) en onze Odoo-partners met hun keurmerken.
// Uit vier opties koos hij de grote standfoto. De vorige header met OS en Connect (HeaderBestaand.tsx) blijft staan voor later.

const DIENSTEN = [
  { icoon: Boxes, kop: "Odoo-implementatie" },
  { icoon: Workflow, kop: "Ander ERP-systeem" },
  { icoon: Globe, kop: "Websites en marketing" },
  { icoon: ShieldCheck, kop: "Veilige, lokale AI" },
];

// 4 november 2026 (Marinus): "die Partners even beter benoemen en ook weer hun certifacaten etc erbij." en daarna "verder alleen de
// logo's Uncanny en Indexworld met alle certificaties etc erbij." Dus per partner alleen het logo en hun keurmerken en partners uit
// SamenEnVeilig.tsx (nagelezen op hun eigen sites, 19 oktober 2026), zonder tekst of cijfers. Het Claude-logo van Indexworld staat
// hier niet: geen modelnamen in klantgerichte teksten.
const PARTNERS = [
  {
    naam: "Indexworld", href: "https://indexworld.net", logo: "/images/home-header/indexworld.png", wit: true,
    keur: [
      { naam: "Odoo-partner", src: "/images/partners/samen/odoo-partner.webp" },
      { naam: "Sage", src: "/images/partners/samen/sage.svg" },
      { naam: "QuickBooks", src: "/images/partners/samen/quickbooks.png" },
    ],
  },
  {
    naam: "Uncanny", href: "https://uncannycs.com", logo: "/images/home-header/uncanny-op-zwart.svg", wit: false,
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
  const keuze = typeof window === "undefined" ? 1 : Number(new URLSearchParams(window.location.search).get("diensten"));
  const variant = keuze >= 1 && keuze <= 4 ? keuze : 1;
  return (
    <section className="sn-alg" aria-labelledby="sn-alg-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst">
          <p className="sn-alg-label"><i />Odoo · ERP · Websites · AI</p>
          {/* 4 november 2026 (Marinus): "Een betrouwbare partner voor groei en cybersecurity. Doelgerichte totaaloplossingen, met experts
              en AI. Veilig lokaal en in eigen beheer." */}
          <h1 id="sn-alg-kop">Een betrouwbare partner voor groei en cybersecurity<span className="sn-alg-punt">.</span></h1>
          <p className="sn-alg-uitleg">Doelgerichte totaaloplossingen, met experts en AI. Veilig, lokaal en in eigen beheer.</p>
          {/* 4 november 2026 (Marinus) over de vier tegels: "Dit moet anders". Vier opties via ?diensten=1..4: 1 tekstregel,
              2 vinkjes, 3 pillen, 4 genummerd met dunne lijnen. Na zijn keuze blijft er één over. */}
          <ul className={`sn-alg-diensten sn-alg-d${variant}`}>
            {DIENSTEN.map(({ icoon: Icoon, kop }, i) => <li key={kop}>
              {variant === 2 ? <Check size={16} aria-hidden="true" /> : variant === 4 ? <span className="sn-alg-nr">0{i + 1}</span> : variant === 3 ? <Icoon size={15} aria-hidden="true" /> : null}
              <strong>{kop}</strong>
            </li>)}
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
          {/* 4 november 2026 (Marinus): "Resultaat bij de klant mag weg." */}
          <div className="sn-alg-kaart sn-alg-partners">
            <p className="sn-alg-klein">Onze Odoo-partners</p>
            <ul>
              {PARTNERS.map(p => <li key={p.naam}>
                <a className="sn-alg-partner-logo" href={p.href} target="_blank" rel="noopener noreferrer"><img className={p.wit ? "is-wit" : undefined} src={p.logo} alt={p.naam} /></a>
                <div className="sn-alg-certs">{p.keur.map(k => <img key={k.naam} src={k.src} alt={k.naam} title={k.naam} loading="lazy" />)}</div>
              </li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className="sn-alg-trusted">
        {/* 4 november 2026 (Marinus): "Verder mag er wel our branding en advertisement is trusted by". */}
        <span translate="no">Our branding and advertising is trusted by</span>
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
