import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import { boekingsPlannerUrl } from "./PlanCall";
import { CRAFTURE, DIRECT, VIA_CRAFTURE, merk } from "./ExplainerPlayer";
import "./header-algemeen.css";
import Diepte3D from "./Diepte3D";
import { languagePrefix, useLanguage } from "./i18n/context";

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
// 25 november 2026, laat (Marinus): "Plus mij een beetje 3D live maken en zetten op basis van mousemovement zoals eerder maar dan
// minder extreem." Eerder (#257, teruggedraaid in #258) verschoof het te veel en trok de microfoon. Nu: de achtergrond staat stil
// (anker op de diepte van de muur), microfoon en hand niet verder naar voren dan het lichaam, zachte randen, en een kwart van de
// toenmalige sterkte.
const FILM_DIEPTE = "/video/explainer/socialnow-explainer-5x4-thumb-diepte.webp";

// 26 november 2026 (Black Friday campagne, 07_MARKETING/BLACK-FRIDAY-20261126/BRIEF.md): boven de video een switch Explainer |
// Black Friday Deal. Zonder film (leeg pad) staat er een placeholder met de dealkop en de knop naar /gratis-website. Een link naar
// /#black-friday opent direct de deal; de Black Friday-mail aan leads linkt daarheen (Marinus, 27 nov).
// 27 november 2026: de goedgekeurde NL-film 90-black-friday-5x4-NL-v4 (1350x1080, 5:4 liggend, 27,6 s), webversie 9 MB met faststart.
// Hij past precies in het 5:4-kader. Er is nog geen 9:16 en nog geen EN-versie: alle talen tonen nu deze NL-film en mobiel valt
// terug op de 5:4. Komt er een 9:16, vul DEAL_FILM_9X16 in; dan wordt het mobiele kader 9:16.
const DEAL_FILM_5X4: string = "/video/black-friday/socialnow-black-friday-5x4-nl.mp4";
const DEAL_FILM_9X16: string = "";  // "/video/black-friday/socialnow-black-friday-9x16.mp4"
// 27 november 2026, 11:45 (Marinus, bij de gekozen thumbnail): "Dit mag de Thumbnail zijn ook op het BLACK FRIDAY ONDERDEEL OP DE
// WEBSITE." Dus dit beeld (logo, BLACK FRIDAY DEAL, Marinus en klantwerk; 07_MARKETING/.../thumbnail/gekozen-20261127) is het startbeeld
// en de poster van de dealfilm. De loop hieronder staat daarom uit (DEAL_LOOP_AAN); terugzetten = true.
const DEAL_POSTER = "/video/black-friday/socialnow-black-friday-thumbnail.jpg";
const DEAL_LOOP_AAN: boolean = false;
// 27 november 2026 (Marinus): "Graag de thumbnail video gebruiken die ik heb gestuurd. Kies hier een mooi stukje uit en maak er een loop
// van." Daarna: "Vanaf 19 tot 22 en even color graden nog" en "misschien gwn opnieuw laten afspelen in een loop". Dus IMG_1671 (SDR-versie)
// 19-22 s, gegraded met de SocialNow-rooftop-LUT, gewoon vooruit in een loop: 3 s, 5:4, zonder geluid, 1,1 MB. Speelt stil als startbeeld
// tot iemand de film start; bij reduced motion alleen de stilstaande foto.
const DEAL_LOOP = "/video/black-friday/socialnow-black-friday-loop.mp4";
const DEAL_LOOP_POSTER = "/video/black-friday/socialnow-black-friday-loop-poster.jpg";
const DEAL_PAD = "/gratis-website";
type Modus = "explainer" | "deal";

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
// 25 november 2026 (Marinus): "Deze foto mag in die slider weg omdat ie daaronder al staat." De Atomium-foto staat lager (Stappenplan).
// 25 november 2026, laat (Marinus), bij de fotowissel na de film: "Dit hoeft niet te veranderen zo." "Of doe maar naar deze
// afbeelding" (het team bij het Atomium). Dus na de film één stilstaande foto, geen wissel en geen pauzeknop.
const DIAS = BEURSFOTOS.filter((f) => f.bestand === "team-atomium");

export function AtomiumFoto() {
  const film = useRef<HTMLVideoElement>(null);
  const [foto, zetFoto] = useState(0);
  const [draait, zetDraait] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [filmAan, zetFilmAan] = useState(true);
  const [speelt, zetSpeelt] = useState(false);
  const [gestart, zetGestart] = useState(false);
  const [vers, zetVers] = useState(false);   // net geklikt: hover vult pas weer na eerst weggaan
  const { language } = useLanguage();
  const deal = useRef<HTMLVideoElement>(null);
  const [modus, zetModus] = useState<Modus>("deal");
  const [dealGestart, zetDealGestart] = useState(false);
  const [mobiel, zetMobiel] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width:700px)").matches);
  useEffect(() => {
    // /#black-friday: na het laden (de prerender toont eerst de explainer) en bij een hashwissel op dezelfde pagina de deal kiezen
    // en naar de video scrollen. De router zet de scroll na het laden terug naar boven, dus twee keer proberen.
    const naarDeal = () => {
      if (window.location.hash !== "#black-friday") return;
      zetModus("deal");
      for (const ms of [400, 1200]) window.setTimeout(() => document.getElementById("black-friday")?.scrollIntoView({ block: "start" }), ms);
    };
    naarDeal();
    window.addEventListener("hashchange", naarDeal);
    const m = window.matchMedia("(max-width:700px)");
    const bij = () => zetMobiel(m.matches);
    m.addEventListener("change", bij);
    return () => { m.removeEventListener("change", bij); window.removeEventListener("hashchange", naarDeal); };
  }, []);
  const dealFilm = mobiel ? DEAL_FILM_9X16 || DEAL_FILM_5X4 : DEAL_FILM_5X4 || DEAL_FILM_9X16;
  const kies = (nieuw: Modus) => {
    if (nieuw === modus) return;
    film.current?.pause();
    deal.current?.pause();
    zetSpeelt(false);
    zetVers(false);
    zetModus(nieuw);
  };

  useEffect(() => {
    if (!draait || filmAan || DIAS.length < 2) return;
    const timer = window.setInterval(() => zetFoto(vorige => (vorige + 1) % DIAS.length), 3000);
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

  const dealWissel = () => {
    const v = deal.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {}); else v.pause();
  };
  const naCall = modus === "deal" ? dealGestart || !dealFilm : gestart;
  const startDeal = () => { zetDealGestart(true); zetVers(true); void deal.current?.play().catch(() => {}); };
  const knop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (modus === "deal") {
      if (dealGestart || !dealFilm) return;   // zonder film, of na de start: gewoon naar de deal
      e.preventDefault();
      startDeal();
      return;
    }
    if (gestart) return;          // tweede klik: naar Call inplannen met Marinus (Marinus 25 nov: "doorlinken naar Call inplannen met mij")
    e.preventDefault();
    zetGestart(true);
    zetVers(true);
    wissel();
  };

  return (
    <div className="sn-alg-filmblok" id="black-friday" data-speelt={speelt}>
    <div className="sn-alg-switch" role="group" aria-label="Kies een video">
      {/* 27 nov (Marinus): "Black Friday Deal mag als eerste afbeelding." Deal standaard open en links. */}
      <button type="button" aria-pressed={modus === "deal"} onClick={() => kies("deal")}>Black Friday Deal</button>
      <button type="button" aria-pressed={modus === "explainer"} onClick={() => kies("explainer")}>Explainer</button>
    </div>
    <figure className="sn-alg-foto is-vijfvier" id="explainer" data-draait={draait && !filmAan && modus === "explainer"} data-film={filmAan} data-modus={modus} data-dealfilm={!!dealFilm} data-staand={!!dealFilm && dealFilm === DEAL_FILM_9X16}>
      {DIAS.map(({ bestand, alt }, index) => {
        const basis = `/images/verhaal/${bestand}`;
        return <div key={bestand} className={bestand === "beurs-marinus" ? "sn-alg-dia is-gesprek" : "sn-alg-dia"} data-actief={foto === index && !filmAan} aria-hidden={foto !== index || filmAan}>
          <img src={`${basis}.webp`} alt={alt} width="900" height="1200" fetchPriority={index === 0 ? "high" : "low"} />
          <Diepte3D src={`${basis}.webp`} diepte={`${basis}-diepte.webp`} actief={foto === index && !filmAan} />
        </div>;
      })}
      {!filmAan && modus === "explainer" && (
        <figcaption>
          <span className="sn-alg-klein">Odoo Experience 2026 · Brussel</span>
          <strong>Ons team<span className="sn-alg-punt">.</span></strong>
        </figcaption>
      )}
      {!filmAan && DIAS.length > 1 && <button type="button" className="sn-alg-knop-fotos" aria-label={draait ? "Pauzeer de fotowissel" : "Speel de fotowissel af"} onClick={() => zetDraait(vorige => !vorige)} />}
      <video ref={film} className="sn-alg-film" src={FILM} poster={FILM_POSTER} playsInline preload="metadata" aria-label="Explainer: dit is SocialNow" aria-hidden={!filmAan}
        onClick={wissel} onPlay={() => zetSpeelt(true)} onPause={() => zetSpeelt(false)} onEnded={klaar} />
      {/* 25 november 2026 (Marinus): "Er mag wel een zwarte overlay over de foto heen nog." Alleen over het startbeeld, weg zodra de film loopt. */}
      {filmAan && <div className="sn-alg-filmstart" data-weg={speelt || gestart || undefined} aria-hidden="true">
        <Diepte3D src={FILM_POSTER} diepte={FILM_DIEPTE} positie={[0.5, 0.45]} actief={!speelt && !gestart} sterkte={0.014} anker={0.06} />
      </div>}
      {filmAan && <span className="sn-alg-filmwaas" data-weg={speelt || gestart || undefined} aria-hidden="true" />}
      {modus === "deal" && DEAL_LOOP_AAN && dealFilm && !dealGestart && <video className="sn-alg-dealloop" src={draait ? DEAL_LOOP : undefined} poster={DEAL_LOOP_POSTER}
        autoPlay={draait} muted loop playsInline preload={draait ? "auto" : "none"} aria-hidden="true" onClick={startDeal} />}
      {modus === "deal" && (dealFilm
        ? <video ref={deal} key={dealFilm} className="sn-alg-dealfilm" src={dealFilm} poster={DEAL_POSTER || undefined} playsInline preload="metadata"
            aria-label="Black Friday Deal: dit is de deal" onClick={dealWissel} onPlay={() => zetSpeelt(true)} onPause={() => zetSpeelt(false)}
            onEnded={() => { zetSpeelt(false); if (deal.current) deal.current.currentTime = 0; }} />
        : <div className="sn-alg-deal-wacht">
            <p className="sn-alg-label"><i />Black Friday Deal</p>
            <strong>Je nieuwe website, gratis gemaakt<span className="sn-alg-punt">.</span></strong>
            <span>De Black Friday-film komt eraan. Claim de deal alvast hieronder.</span>
          </div>)}
    </figure>
    {/* 25 november 2026, avond (Marinus): de pil zoals Website-actie, maar wit. Hover vult wit; na de klik trekt het wit terug en
        veegt groen van rechts naar links erover, en Speel video af wordt Neem contact op. */}
    {/* 26 november 2026 (Black Friday): in de dealstand speelt de knop de dealfilm en wordt daarna Claim de Black Friday Deal
        (naar /gratis-website); zonder film staat hij meteen op Claim. */}
    <a className="sn-alg-filmknop" href={modus === "deal" ? `${languagePrefix(language)}${DEAL_PAD}` : boekingsPlannerUrl} onClick={knop} onMouseLeave={() => zetVers(false)}
      data-stand={naCall ? "call" : "video"} data-vers={vers || undefined} data-modus={modus}
      aria-label={modus === "deal" ? (naCall ? "Claim de Black Friday Deal" : "Bekijk de Black Friday-film") : (naCall ? "Neem contact op" : "Speel video af")}>
      <span className="tekst" aria-hidden="true">
        <span className="lb lb-video">{modus === "deal" ? "Bekijk de Black Friday-film" : "Speel video af"}</span>
        <span className="lb lb-call">{modus === "deal" ? "Claim de Black Friday Deal" : "Neem contact op"}</span>
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
