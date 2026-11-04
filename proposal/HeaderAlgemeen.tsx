import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Play, X } from "lucide-react";
import { openPlanCall } from "./PlanCall";
import { CRAFTURE, DIRECT, VIA_CRAFTURE, merk } from "./ExplainerPlayer";
import "./header-algemeen.css";

// Homepage-header, 4 november 2026. MARINUS: "Verder moet de focus bij de header niet liggen op connect en os." en
// "Meer gewoon mooi algemeen houden en duidelijk Odoo en andere ERP hulp."
// Later die dag: "Deze als main image en hier stappen maken met website and branding, systems and operations, marketing and sales
// en dan finance als de stappen" en over de header met de standfoto: "Want die is wel heel mooi maar te verwarrend merk ik." en
// "De huidige header mag naar een andere plek." Dus bovenaan één kop, vier stappen en het team bij het Atomium in Brussel; de
// standfoto met de Odoo-partners staat nu als OdooPartners lager op de homepage. De vorige header met OS en Connect
// (HeaderBestaand.tsx) blijft staan voor later.

const STAPPEN = ["Website en branding", "Systemen en operations", "Marketing en sales", "Finance"];

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
          {/* 4 november 2026 (Marinus): "Een betrouwbare partner voor groei en cybersecurity. Doelgerichte totaaloplossingen, met experts
              en AI. Veilig lokaal en in eigen beheer." */}
          <h1 id="sn-alg-kop">Een betrouwbare partner voor groei en cybersecurity<span className="sn-alg-punt">.</span></h1>
          <p className="sn-alg-uitleg">Doelgerichte totaaloplossingen, met experts en AI. Veilig, lokaal en in eigen beheer.</p>
          <ol className="sn-alg-stappen">
            {STAPPEN.map((kop, i) => <li key={kop}><span className="sn-alg-nr">0{i + 1}</span><strong>{kop}</strong></li>)}
          </ol>
          {/* 4 november 2026 (Marinus): "Wij beginnen altijd met een GRATIS WEBSITE DEMO." Dus dat is de eerste knop. */}
          <div className="sn-alg-acties">
            <Link className="sn-alg-knop" to="/security"><span>Start met een gratis websitedemo</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
            <button type="button" className="sn-alg-knop sn-alg-knop-rand" aria-haspopup="dialog" onClick={() => openPlanCall({ onderdelen: ["crm", "dashboard"] })}>
              <span>Plan een gesprek</span><ArrowUpRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
        <figure className="sn-alg-foto">
          <img src="/images/verhaal/team-atomium.webp" alt="Ons team bij het Atomium in Brussel" width="900" height="1200" fetchPriority="high" />
          <figcaption><span className="sn-alg-klein">Odoo Experience 2026 · Brussel</span><strong>Ons team<span className="sn-alg-punt">.</span></strong></figcaption>
          <button type="button" className="sn-alg-knop-video" aria-haspopup="dialog" onClick={open}><Play size={15} aria-hidden="true" /><span>Bekijk de video</span></button>
        </figure>
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

// 4 november 2026 (Marinus): "die Partners even beter benoemen en ook weer hun certifacaten etc erbij." en daarna "verder alleen de
// logo's Uncanny en Indexworld met alle certificaties etc erbij." en "En die logo's in kleur graag." Dus per partner alleen het logo
// en hun keurmerken en partners uit SamenEnVeilig.tsx (nagelezen op hun eigen sites, 19 oktober 2026), in kleur. Het Claude-logo van
// Indexworld staat hier niet: geen modelnamen in klantgerichte teksten.
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

// De vorige header (standfoto en Odoo-partners) als eigen blok na het team en de voorbeelden. MARINUS: "en dan bij read more bij
// odoo partners eronder de focus leggen op het blok wat nu in de footer is." Dus Lees meer springt naar Groei en cybersecurity
// (SamenEnVeilig, #groei) in de footer.
export function OdooPartners() {
  const naarGroei = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const doel = document.getElementById("groei");
    if (!doel) return;
    e.preventDefault();
    doel.scrollIntoView({ behavior: "smooth", block: "start" });
    doel.focus({ preventScroll: true });
  };
  return (
    <section className="sn-alg sn-alg-odoo" aria-labelledby="sn-odoo-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst">
          <p className="sn-alg-label"><i />Odoo en ERP</p>
          <h2 id="sn-odoo-kop">Odoo en ander ERP, met sterke partners<span className="sn-alg-punt">.</span></h2>
          <p className="sn-alg-uitleg">We implementeren Odoo en helpen met andere ERP-systemen, samen met gecertificeerde partners. Met een eigen stand op Odoo Experience 2026 in Brussel.</p>
          <div className="sn-alg-kaart sn-alg-partners">
            <p className="sn-alg-klein">Partners en specialiteiten</p>
            <ul>
              {PARTNERS.map(p => <li key={p.naam}>
                <a className="sn-alg-partner-logo" href={p.href} target="_blank" rel="noopener noreferrer"><img className={p.wit ? "is-wit" : undefined} src={p.logo} alt={p.naam} loading="lazy" /></a>
                <div className="sn-alg-certs">{p.keur.map(k => <img key={k.naam} src={k.src} alt={k.naam} title={k.naam} loading="lazy" />)}</div>
              </li>)}
            </ul>
          </div>
          <a className="sn-alg-meer" href="#groei" onClick={naarGroei}><span>Lees meer</span><ArrowDown size={16} aria-hidden="true" /></a>
        </div>
        <figure className="sn-alg-foto sn-alg-foto-breed">
          <img src="/images/odoo-experience-stand.webp" alt="Ons team op de eigen stand op Odoo Experience 2026 in Brussel" loading="lazy" />
          <figcaption><span className="sn-alg-klein">Odoo Experience 2026 · Brussel</span><strong>Met een eigen stand<span className="sn-alg-punt">.</span></strong></figcaption>
        </figure>
      </div>
    </section>
  );
}
