import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import { boekingsPlannerUrl } from "./PlanCall";
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
// Later die dag: "de video van de Odoo Experience laten zien". De aftermovie is staand (720 x 1280).
// 25 november 2026 (Marinus): "Kan je voor nu vooral even deze op de homepage zetten waar nu de Odoo video staat?" Dus hier nu de
// lange explainer (06-SocialNow-lang, 2:18, 07_MARKETING/EXPLAINER-VIDEO-MARINUS-20261124), liggend 16:9.
// 25 november 2026, avond (Marinus): "Zet deze maar alvast live op socialnow.nl als versie. Ipv die er nu live staat." Dus nu de lange
// explainer in 5:4 met hem in beeld, tegels en OS-schermen (19-SocialNow-OS-Connect-lang-5x4-eigen-beeld-animatie-v1, 2:25, bron
// 04_OS-VIDEO/video-project/92-os-connect-lang-beeld-animatie). Het kader is daarom 5:4 (is-vijfvier), zodat er niets wegvalt.
const FILM = "/video/explainer/socialnow-explainer-5x4.mp4";
// 25 november 2026, avond (Marinus): "Graag deze als thumbnail met de knop voor afspelen onder de video met de breedte van de video en
// die transitioneert op een hele mooie animatie manier [...] nadat je klikt met een mooie filling of slide naar een plan een call in."
// Dus: startbeeld = Marinus die naar beneden wijst (naar de knop), de knop staat onder het kader, even breed. Na de klik start de film,
// veegt een groene vulling over de knop en schuift "Bekijk de video" omhoog weg en "Plan een call" van onder in (link naar /afspraak).
const FILM_POSTER = "/video/explainer/socialnow-explainer-5x4-thumb.jpg";

// 4 november 2026 (Marinus): "die technische data en huidige landingspagina mag naar producten gaan dan is dit meer enthousiasmering
// en rest inhoudelijk en technisch." Deze header opent sindsdien /producten; label en kop zijn daar eigen, zodat de homepage
// (HomeEnthousiast.tsx) de enige h1 "Een betrouwbare partner voor groei en cybersecurity." houdt.
// Ook gebruikt in de homepage-hero (HomeEnthousiast.tsx), onder de knoppen.
export function PartnerLogos() {
  // 25 november 2026 (Marinus): "Kan dit een slider zijn?" De logo's lopen als band; drie gelijke sets, de band schuift één set op.
  return <div className="sn-alg-keur" role="region" aria-label="Partners en specialiteiten">
    <ul className="sn-alg-keur-baan">
      {[0, 1, 2].flatMap(set => KEURMERKEN.map(k => <li key={`${set}-${k.naam}`} aria-hidden={set > 0 || undefined}>
        <img src={k.src} alt={set > 0 ? "" : k.naam} title={k.naam} /></li>))}
    </ul>
  </div>;
}

// 12 november 2026 (Marinus): "Begin altijd met deze foto": de wissel start met het team bij het Atomium.
export const BEURSFOTOS = [
  { bestand: "team-atomium", alt: "Ons team bij het Atomium in Brussel" },
  { bestand: "beurs-marinus", alt: "Marinus in gesprek aan tafel" },
  { bestand: "beurs-steef", alt: "Steef aan tafel met bezoekers rond een laptop" },
];

// 25 november 2026 (Marinus): eerst "Doe maar even alleen de video ipv die slideshow", daarna "Dit balkje wil ik niet. Ik wil gewoon
// dat als je op de video klikt de video op pauze gaat." en "Nadat de video eindigt wil ik graag dat de slider weer komt. Verder mag de
// video ook vierkant worden gemaakt." Dus: het kader is vierkant en toont de fotowissel. Bekijk de video speelt de explainer in hetzelfde
// kader, zonder bedieningsbalk; een klik op de film pauzeert of speelt verder. Als de film afloopt, komt de fotowissel terug.
// Daarna (Marinus): "Hij is terug en ik zie nogsteeds niet de explainer video op mijn homepage." Dus bij binnenkomst staat de
// explainer (startbeeld met knop) in het kader; de fotowissel komt pas na afloop, en Bekijk de video start de film daarna opnieuw.
// De naam AtomiumFoto blijft, omdat HomeEnthousiast.tsx hem zo importeert.
export function AtomiumFoto() {
  const film = useRef<HTMLVideoElement>(null);
  const [foto, zetFoto] = useState(0);
  const [draait, zetDraait] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [filmAan, zetFilmAan] = useState(true);
  const [speelt, zetSpeelt] = useState(false);
  const [gestart, zetGestart] = useState(false);

  useEffect(() => {
    if (!draait || filmAan) return;
    const timer = window.setInterval(() => zetFoto(vorige => (vorige + 1) % BEURSFOTOS.length), 3000);
    return () => window.clearInterval(timer);
  }, [draait, filmAan]);

  const wissel = () => {
    const v = film.current;
    if (!v) return;
    zetFilmAan(true);
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };
  const klaar = () => {
    zetSpeelt(false);
    zetFilmAan(false);
    zetFoto(0);
    if (film.current) film.current.currentTime = 0;
  };

  const knop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (gestart) {                // tweede klik: naar het contactblok op deze pagina, anders gewoon naar de afsprakenplanner
      const doel = document.getElementById("contact");
      if (!doel) return;
      e.preventDefault();
      doel.scrollIntoView({ behavior: "smooth", block: "center" });
      doel.focus({ preventScroll: true });
      return;
    }
    e.preventDefault();
    zetGestart(true);
    wissel();
  };

  return (
    <div className="sn-alg-filmblok" data-speelt={speelt}>
    <figure className="sn-alg-foto is-vijfvier" id="explainer" data-draait={draait && !filmAan} data-film={filmAan}>
      {BEURSFOTOS.map(({ bestand, alt }, index) => {
        const basis = `/images/verhaal/${bestand}`;
        return <div key={bestand} className={bestand === "beurs-marinus" ? "sn-alg-dia is-gesprek" : "sn-alg-dia"} data-actief={foto === index && !filmAan} aria-hidden={foto !== index || filmAan}>
          <img src={`${basis}.webp`} alt={alt} width="900" height="1200" fetchPriority={index === 0 ? "high" : "low"} />
          <Diepte3D src={`${basis}.webp`} diepte={`${basis}-diepte.webp`} actief={foto === index && !filmAan} />
        </div>;
      })}
      {!filmAan && BEURSFOTOS[foto].bestand !== "team-atomium" && (
        <figcaption>
          <span className="sn-alg-klein" lang="en" translate="no">Presenting at the Odoo Experience 2026</span>
          <strong>In gesprek op de beurs<span className="sn-alg-punt">.</span></strong>
        </figcaption>
      )}
      {!filmAan && <button type="button" className="sn-alg-knop-fotos" aria-label={draait ? "Pauzeer de fotowissel" : "Speel de fotowissel af"} onClick={() => zetDraait(vorige => !vorige)} />}
      <video ref={film} className="sn-alg-film" src={FILM} poster={FILM_POSTER} playsInline preload="metadata" aria-label="Explainer: dit is SocialNow" aria-hidden={!filmAan}
        onClick={wissel} onPlay={() => zetSpeelt(true)} onPause={() => zetSpeelt(false)} onEnded={klaar} />
    </figure>
    {/* 25 november 2026, avond (Marinus): de pil zoals Website-actie, maar wit. Hover vult wit; na de klik trekt het wit terug en
        veegt groen van rechts naar links erover, en Speel video af wordt Neem contact op. */}
    <a className="sn-alg-filmknop" href={boekingsPlannerUrl} onClick={knop} data-stand={gestart ? "call" : "video"}
      aria-label={gestart ? "Neem contact op" : "Speel video af"}>
      <span className="tekst" aria-hidden="true">
        <span className="lb lb-video">Speel video af</span>
        <span className="lb lb-call">Neem contact op</span>
      </span>
      <span className="rond" aria-hidden="true"><Play size={16} className="ic ic-video" /><ArrowUpRight size={18} className="ic ic-call" /></span>
    </a>
    </div>
  );
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
          <p className="sn-alg-uitleg"><strong>Wij helpen je met management en operations.</strong> Doelgerichte totaaloplossingen, met experts en AI. Veilig, lokaal en in eigen beheer.</p>
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
