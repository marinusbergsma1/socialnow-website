import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Pause, Play, X } from "lucide-react";
import { CRAFTURE, DIRECT, VIA_CRAFTURE, merk } from "./ExplainerPlayer";
import "./header-algemeen.css";
import Diepte3D from "./Diepte3D";

// Homepage-header, 4 november 2026. MARINUS: "Verder moet de focus bij de header niet liggen op connect en os." en
// "Meer gewoon mooi algemeen houden en duidelijk Odoo en andere ERP hulp."
// Later die dag: "Deze als main image en hier stappen maken met website and branding, systems and operations, marketing and sales
// en dan finance als de stappen". Dus bovenaan één kop, vier stappen en het team bij het Atomium in Brussel. De standfoto met de
// Odoo-partners stond daarna even als eigen blok lager op de homepage; ook dat mocht weg ("Deze weg"). De vorige header met OS en
// Connect (HeaderBestaand.tsx) staat sinds dezelfde dag op /het-os.

// Samenwerkingen onder de titel, in kleur. Eerst stonden hier Indexworld en Uncanny met hun keurmerken; Marinus: "Haal anders
// Indexworld en Uncanny maar weg en zet alleen de logo's van samenwerking eronder."
const KEURMERKEN = [
  { naam: "Odoo Silver Partner", src: "/images/partners/samen/odoo.svg" },
  { naam: "Shopify Partners", src: "/images/partners/samen/shopify.svg" },
  { naam: "Salesforce-partner", src: "/images/partners/samen/salesforce.svg" },
  { naam: "Adobe-partner", src: "/images/partners/samen/adobe.svg" },
];

const STAPPEN = ["Website en branding", "Systemen en operations", "Marketing en sales", "Finance"];

// 4 november 2026 (Marinus): "Deze graag nog erbij. en een knop bekijk de video." Dus de Trusted by-balk uit de oude header
// (zelfde merken en volgorde als het startbeeld in ExplainerPlayer.tsx) en een knop die een film in een venster afspeelt.
// Later die dag: "de video van de Odoo Experience laten zien". De aftermovie is staand (720 x 1280), het venster dus ook.
const FILM = "/video/odoo-experience/odoo-experience.mp4";

// 4 november 2026 (Marinus): "die technische data en huidige landingspagina mag naar producten gaan dan is dit meer enthousiasmering
// en rest inhoudelijk en technisch." Deze header opent sindsdien /producten; label en kop zijn daar eigen, zodat de homepage
// (HomeEnthousiast.tsx) de enige h1 "Een betrouwbare partner voor groei en cybersecurity." houdt.
// Ook gebruikt in de homepage-hero (HomeEnthousiast.tsx), onder de knoppen.
export function PartnerLogos() {
  return <ul className="sn-alg-keur" aria-label="Partners en specialiteiten">
    {KEURMERKEN.map(k => <li key={k.naam}><img src={k.src} alt={k.naam} title={k.naam} /></li>)}
  </ul>;
}

const BEURSFOTOS = [
  { bestand: "beurs-marinus", alt: "Marinus in gesprek aan tafel" },
  { bestand: "beurs-steef", alt: "Steef aan tafel met bezoekers rond een laptop" },
  { bestand: "team-atomium", alt: "Ons team bij het Atomium in Brussel" },
];

export function AtomiumFoto() {
  const venster = useRef<HTMLDialogElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [foto, zetFoto] = useState(0);
  const [speelt, zetSpeelt] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [filmOpen, zetFilmOpen] = useState(false);
  const open = () => {
    venster.current?.showModal();
    zetFilmOpen(true);
    void film.current?.play().catch(() => {});
  };
  const sluit = () => venster.current?.close();
  const naSluiten = () => {
    film.current?.pause();
    zetFilmOpen(false);
  };

  useEffect(() => {
    if (!speelt || filmOpen) return;
    const timer = window.setInterval(() => zetFoto(vorige => (vorige + 1) % BEURSFOTOS.length), 3000);
    return () => window.clearInterval(timer);
  }, [speelt, filmOpen]);

  return <>
    <figure className="sn-alg-foto" id="odoo-experience" data-draait={speelt && !filmOpen}>
      {BEURSFOTOS.map(({ bestand, alt }, index) => {
        const basis = `/images/verhaal/${bestand}`;
        return <div key={bestand} className={bestand === "beurs-marinus" ? "sn-alg-dia is-gesprek" : "sn-alg-dia"} data-actief={foto === index} aria-hidden={foto !== index}>
          <img src={`${basis}.webp`} alt={alt} width="900" height="1200" fetchPriority={index === 0 ? "high" : "low"} />
          <Diepte3D src={`${basis}.webp`} diepte={`${basis}-diepte.webp`} actief={foto === index && !filmOpen} />
        </div>;
      })}
      {BEURSFOTOS[foto].bestand !== "team-atomium" && (
        <figcaption>
          <span className="sn-alg-klein" lang="en" translate="no">Presenting at the Odoo Experience 2026</span>
          <strong>In gesprek op de beurs<span className="sn-alg-punt">.</span></strong>
        </figcaption>
      )}
      <button type="button" className="sn-alg-knop-fotos" aria-label={speelt ? "Pauzeer de fotowissel" : "Speel de fotowissel af"} onClick={() => zetSpeelt(!speelt)}>
        {speelt ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
      <button type="button" className="sn-alg-knop-video" aria-haspopup="dialog" onClick={open}><Play size={15} aria-hidden="true" /><span>Bekijk de video</span></button>
    </figure>
    <dialog className="sn-alg-venster" ref={venster} aria-label="Aftermovie Odoo Experience 2026" onClose={naSluiten} onClick={e => { if (e.target === venster.current) sluit(); }}>
      <button type="button" className="sn-alg-sluit" onClick={sluit} aria-label="Sluit de film"><X size={20} aria-hidden="true" /></button>
      <video ref={film} src={FILM} poster="/video/odoo-experience/odoo-experience.jpg" controls playsInline preload="none" />
    </dialog>
  </>;
}

export default function HeaderAlgemeen({ label = "Management · Operations · Odoo", kop = "Een betrouwbare partner voor groei en cybersecurity" }: { label?: string; kop?: string }) {
  const naarContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const doel = document.getElementById("contact");
    if (!doel) return;
    e.preventDefault();
    doel.scrollIntoView({ behavior: "smooth", block: "center" });
    doel.focus({ preventScroll: true });
  };
  return (
    <section className="sn-alg" aria-labelledby="sn-alg-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst">
          <p className="sn-alg-label"><i />{label}</p>
          {/* 4 november 2026 (Marinus): "Een betrouwbare partner voor groei en cybersecurity. Doelgerichte totaaloplossingen, met experts
              en AI. Veilig lokaal en in eigen beheer." */}
          <h1 id="sn-alg-kop">{kop}<span className="sn-alg-punt">.</span></h1>
          {/* 4 november 2026 (Marinus): "Ik wil dat het écht duidelijk is gelijk BAM Ze kunnen mij helpen met management en operations
              en Odoo." en "zet alleen de logo's van samenwerking eronder. Odoo Silver partner, Shopify Parners SalesForce en Adove
              Partners onder de header titel." */}
          <p className="sn-alg-uitleg"><strong>Wij helpen je met management, operations en Odoo.</strong> Doelgerichte totaaloplossingen, met experts en AI. Veilig, lokaal en in eigen beheer.</p>
          <PartnerLogos />
          <ol className="sn-alg-stappen">
            {STAPPEN.map((kop, i) => <li key={kop}><span className="sn-alg-nr">0{i + 1}</span><strong>{kop}</strong></li>)}
          </ol>
          {/* 4 november 2026 (Marinus): "Wij beginnen altijd met een GRATIS WEBSITE DEMO." Dus dat is de eerste knop. */}
          <div className="sn-alg-acties">
            {/* 4 november 2026 (Marinus): "Deze knoppen wil ik ook met die filling en met die style zoals die", met de knop Inloggen
                gratis OS rechtsboven als voorbeeld. Dus dezelfde goedgekeurde pillknop (sn-pill, button-design.css). */}
            <Link className="sn-pill" to="/security"><span>Start met een gratis websitedemo</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
            {/* 4 november 2026 (Marinus): "Zonder gesprek inplannen, ze kunnen wel gewoon een mail sturen of bellen." Dus de knop
                springt naar de contacttegels onderaan de homepage (ContactSlot.tsx). */}
            <a className="sn-pill" href="#contact" onClick={naarContact}><span>Neem contact op</span><ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
        <AtomiumFoto />
      </div>
      <TrustedBy />
    </section>
  );
}

// 4 november 2026 (Marinus): "Verder mag er wel our branding en advertisement is trusted by". Ook op de homepage (HomeEnthousiast.tsx).
export function TrustedBy() {
  return <div className="sn-alg-trusted">
    <span id="sn-alg-trusted-label" translate="no">Our branding and advertising is trusted by</span>
    <div className="sn-alg-merken" role="group" aria-labelledby="sn-alg-trusted-label" tabIndex={0}>
      <div className="sn-alg-merken-rij">
        <span className="sn-alg-groep">{DIRECT.map(merk)}</span>
        <span className="sn-alg-groep">{merk(CRAFTURE)}<i className="sn-alg-streep" aria-hidden="true" />{VIA_CRAFTURE.map(merk)}</span>
      </div>
    </div>
  </div>;
}
