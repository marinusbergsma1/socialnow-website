import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import ExplainerPlayer from "./ExplainerPlayer";
import { WebsiteExamples } from "./FreeWebsite";
import { openPlanCall } from "./PlanCall";
import { GRATIS_OS_URL } from "./os-entry";
import { CONNECT } from "./Pricing";
import { klein } from "./licht";
import { useInBeeld } from "./Bento";
import { Filters } from "./HomeHeader";
import "./free-website.css";
import "./home-landing.css";

// 3 november 2026 (Marinus): "Kan je een versie maken met alleen een grote titel en de video. Wat meer focus op onze partners
// en Odoo hulp met wat video's van de Odoo experience en dan stappenplan websites gelijk als 2e sectie [...] daarna bouwen wij
// een persoonlijk management en operation systeem op basis van al jouw data veilig en lokaal met onze experts dan Douwe, Steef
// en Gijsbert. Gijsbert als eerste [...] en dan nog een animatie daarvan. Daarna bieden wij persoonlijke hulp op maat binnen dit
// systeem dan de os laag en daarna meld je aan of vul de onboarding in!" En: "Echt meer een landingspagina gefocust op conversie".
// Dus één verhaal in drie stappen, na elke stap dezelfde twee knoppen. De vorige homepage staat nu op /os-connect (pages.tsx).

const ONBOARDING_URL = "https://website.socialnow.nl";
const AANMELDEN_URL = `${GRATIS_OS_URL}?pakket=gratis`;

const STAPPEN = [
  { nr: "01", id: "stap-website", kop: "Je website" },
  { nr: "02", id: "stap-systeem", kop: "Je eigen systeem" },
  { nr: "03", id: "stap-hulp", kop: "Hulp op maat" },
];

// Echte beelden van de Odoo Experience in Brussel (24 tot 26 september 2026), geen AI-beelden. De stand- en Atomiumclip komen uit
// 02-SOCIALNOW/ODOO/oxp26-aftermovie/bron/iphone (IMG_0808 en IMG_0932), de beursclip is seconde 9 tot 18 van onze eigen
// Odoo Experience-film (odoo-experience.mp4). Steeds zonder geluid.
const ODOO_FILMS = [
  { src: "/video/odoo-experience/oxp-beurs.mp4", poster: "/video/odoo-experience/oxp-beurs-poster.webp", onderschrift: "Odoo Experience, Brussel" },
  { src: "/video/odoo-experience/oxp-stand.mp4", poster: "/video/odoo-experience/oxp-stand-poster.webp", onderschrift: "Onze stand op de beurs" },
  { src: "/video/odoo-experience/oxp-atomium.mp4", poster: "/video/odoo-experience/oxp-atomium-poster.webp", onderschrift: "Het team in Brussel" },
];

// De rollen zoals in SamenEnVeilig.tsx; Uncanny is Odoo Silver Partner, Indexworld Odoo-partner (nagelezen 19 oktober 2026).
const PARTNERS = [
  { naam: "Indexworld", rol: "Odoo-partner. Bouwt SocialNow OS.", logo: <span className="hl-logo-indexworld" role="img" aria-label="Indexworld" /> },
  { naam: "Uncanny", rol: "Odoo Silver Partner. Bouwt Connect.", logo: <img src="/images/home-header/uncanny.svg" alt="Uncanny" width="1365" height="300" loading="lazy" /> },
  { naam: "Komen Consultancy", rol: "Finance, data en operations.", logo: <img className="hl-logo-komen" src="/images/merken/komen-operation-systems.webp" alt="Komen Consultancy Operation Systems" width="600" height="96" loading="lazy" /> },
  { naam: "Attesso", rol: "Veilige betalingen voor AI-agents.", logo: <code className="hl-logo-attesso" translate="no" aria-label="Attesso">~/attesso</code> },
];

// Gijsbert vooraan (Marinus). Rollen uit het plan van 26 en 27 oktober: Gijsbert en Douwe code en architectuur, Steef financiën;
// Gijsbert doet bij elke onboarding van een custom OS de veiligheidscheck.
const EXPERTS = [
  { naam: "Gijsbert Westeneng", rol: "Full-Stack AI Engineer", foto: "Gijsbert-Westeneng.webp", tekst: "Doet bij elke onboarding de veiligheidscheck, zodat je data veilig en lokaal blijft." },
  { naam: "Douwe Kramer", rol: "Co-founder · Attesso", foto: "Douwe-Kramer-attesso.webp", tekst: "Code en architectuur van je systeem." },
  { naam: "Steef Komen", rol: "Partner · Head of Finance & Data", foto: "Steef-Komen.webp", tekst: "Je cijfers en administratie op orde, in Odoo." },
];

function Knoppen({ tweede }: { tweede?: React.ReactNode }) {
  return <div className="hl-knoppen">
    <a className="sn-pill hl-pill-groen" href={AANMELDEN_URL}><span>Start gratis</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></a>
    {tweede ?? <a className="sn-pill hl-pill-licht" href={ONBOARDING_URL}><span>Vul de onboarding in</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></a>}
  </div>;
}

function StapKop({ nr, label, kop, tekst }: { nr: string; label: string; kop: string; tekst: string }) {
  return <header className="hl-stapkop">
    <p className="hl-label"><span className="hl-nr">{nr}</span>{label}</p>
    <h2>{kop}</h2>
    <p className="hl-tekst">{tekst}</p>
  </header>;
}

// Een film die alleen speelt als hij in beeld is: zonder geluid, in een lus, en pas laden als je erbij in de buurt komt.
function Lusfilm({ src, poster, onderschrift }: { src: string; poster: string; onderschrift: string }) {
  const film = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = film.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    const stil = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const kijker = new IntersectionObserver(([ingang]) => {
      if (ingang.isIntersecting && !stil) { if (!v.src) v.src = src; v.play().catch(() => {}); } else v.pause();
    }, { rootMargin: "200px" });
    kijker.observe(v);
    return () => kijker.disconnect();
  }, [src]);
  return <figure className="hl-film">
    <video ref={film} poster={poster} muted loop playsInline preload="none" aria-label={onderschrift} />
    <figcaption>{onderschrift}</figcaption>
  </figure>;
}

// Stap 2 als stippenscène: alleen de bestaande rasterstippen lichten op (golven-geen-vormen). Vanaf vijf bronnen aan de rand
// lopen lichtpuntjes over het raster naar het midden, waar een blok stippen groen wordt: jouw systeem, lokaal.
const BRONNEN = ["Odoo", "Mail", "Website", "Ads", "Bestanden"];
const KLEUREN = ["#25D366", "#1f6fd1", "#F5C518", "#EC1670", "#ffffff"];
function DataScene() {
  const doek = useRef<HTMLCanvasElement>(null);
  const { ref, aan } = useInBeeld<HTMLDivElement>();
  useEffect(() => {
    const c = doek.current;
    if (!c || !aan) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const stil = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const STAP = 24;
    let b = 0, h = 0, kol = 0, rij = 0, frame = 0, start = performance.now();
    const meet = () => {
      const r = c.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      b = r.width; h = r.height; c.width = b * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      kol = Math.floor(b / STAP); rij = Math.floor(h / STAP);
    };
    meet();
    const rs = new ResizeObserver(meet); rs.observe(c);
    const teken = (nu: number) => {
      const t = (nu - start) / 1000;
      ctx.clearRect(0, 0, b, h);
      const mk = Math.floor(kol * .68), mr = Math.floor(rij / 2), blokB = Math.max(6, Math.floor(kol * .2)), blokH = Math.max(4, Math.floor(rij * .46));
      const vul = Math.min(1, t / 6);
      for (let x = 0; x < kol; x++) for (let y = 0; y < rij; y++) {
        const px = x * STAP + STAP / 2, py = y * STAP + STAP / 2;
        const inBlok = Math.abs(x - mk) <= blokB / 2 && Math.abs(y - mr) <= blokH / 2;
        let kleur = "rgba(255,255,255,.13)";
        if (inBlok) {
          const volgorde = ((x - mk + blokB) * 7 + (y - mr + blokH) * 3) % 10 / 10;
          if (stil || volgorde < vul) kleur = `rgba(37,211,102,${.55 + .35 * Math.sin(t * 1.6 + x * .5 + y * .4) ** 2})`;
        }
        ctx.fillStyle = kleur; ctx.beginPath(); ctx.arc(px, py, kleur.startsWith("rgba(37") ? 2.6 : 1.6, 0, Math.PI * 2); ctx.fill();
      }
      // Lichtpuntjes: per bron een rij, van links naar het blok.
      if (!stil) BRONNEN.forEach((_, i) => {
        const y = Math.round((i + 1) * rij / (BRONNEN.length + 1));
        for (let k = 0; k < 3; k++) {
          const fase = ((t * .35 + i * .21 + k / 3) % 1);
          const x = Math.floor(3 + fase * (mk - blokB / 2 - 3));
          const ty = Math.round(y + (mr - y) * Math.max(0, (fase - .55) / .45));
          const px = x * STAP + STAP / 2, py = ty * STAP + STAP / 2;
          ctx.fillStyle = KLEUREN[i]; ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        }
      });
      if (!stil) frame = requestAnimationFrame(teken);
    };
    frame = requestAnimationFrame(teken);
    return () => { cancelAnimationFrame(frame); rs.disconnect(); };
  }, [aan]);
  return <div className="hl-scene" ref={ref} aria-hidden="true">
    <canvas ref={doek} />
    <ul className="hl-bronnen">{BRONNEN.map((naam, i) => <li key={naam} style={{ "--kleur": KLEUREN[i], top: `${(i + 1) * 100 / (BRONNEN.length + 1)}%` } as React.CSSProperties}>{naam}</li>)}</ul>
    <span className="hl-scene-os"><ShieldCheck size={16} aria-hidden="true" />Jouw systeem · lokaal</span>
  </div>;
}

export default function HomeLanding() {
  return <div className="hl">
    <Filters />
    {/* Hero: alleen de grote titel en de film. */}
    <section className="hl-hero" id="home">
      <div className="hl-wrap">
        <h1>Een betrouwbare partner voor groei en cybersecurity.</h1>
        <p className="hl-onder">De software is gratis. Onze experts doen het echte werk.</p>
        <Knoppen />
        <div className="hl-video"><ExplainerPlayer ctaLabel="Ontdek SocialNow" /></div>
        <nav className="hl-route" aria-label="Zo werkt het">
          {STAPPEN.map(s => <a key={s.id} href={`#${s.id}`}><span className="hl-nr">{s.nr}</span>{s.kop}</a>)}
        </nav>
      </div>
    </section>

    {/* Partners en Odoo-hulp: mensen, dus wit (wit-mens-zwart-tech). */}
    <section className="hl-wit" id="partners">
      <div className="hl-wrap hl-partners">
        <header className="hl-stapkop">
          <p className="hl-label">Partners en Odoo</p>
          <h2>Gebouwd met Odoo-partners.</h2>
          <p className="hl-tekst">Je systeem draait op Odoo. We bouwen het samen met vaste partners en helpen je persoonlijk op weg, van de eerste koppeling tot je administratie.</p>
        </header>
        <ul className="hl-partnerlijst">
          {PARTNERS.map(p => <li key={p.naam}><span className="hl-partnerlogo">{p.logo}</span><span>{p.rol}</span></li>)}
        </ul>
        <div className="hl-films">{ODOO_FILMS.map(f => <Lusfilm key={f.src} {...f} />)}</div>
        <div className="hl-knoppen">
          <button type="button" className="sn-pill" aria-haspopup="dialog" onClick={() => openPlanCall()}><span>Hulp met Odoo? Plan een call</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></button>
        </div>
      </div>
    </section>

    {/* Stap 1: websites. */}
    <section className="hl-stap" id="stap-website">
      <div className="hl-wrap">
        <StapKop nr="01" label="Je website" kop="We maken je website veilig, met gratis updates." tekst="Je krijgt eerst een gratis demo in je eigen merk, zonder verplichting. Daarna houden we je website gratis up-to-date en veilig." />
        <div className="sn-free-website hl-websites"><WebsiteExamples /></div>
        <Knoppen tweede={<Link className="sn-pill hl-pill-licht" to="/security"><span>Gratis securityscan</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></Link>} />
      </div>
    </section>

    {/* Stap 2: het eigen systeem, met de stippenscène en de drie experts. */}
    <section className="hl-stap" id="stap-systeem">
      <div className="hl-wrap">
        <StapKop nr="02" label="Je eigen systeem" kop="Daarna bouwen we je eigen management- en operationsysteem." tekst="Op basis van al je data, veilig en lokaal. Jij bepaalt wat erin komt en wie wat ziet." />
        <DataScene />
        <ul className="hl-experts">
          {EXPERTS.map((e, i) => <li key={e.naam} className={i === 0 ? "hl-expert-eerst" : undefined}>
            <img {...klein(e.foto, i === 0 ? 120 : 72, [160, 320], undefined, "20261103")} alt={e.naam} width={i === 0 ? 120 : 72} height={i === 0 ? 120 : 72} loading="lazy" />
            <div><strong translate="no">{e.naam}</strong><span className="hl-rol">{e.rol}</span><p>{e.tekst}</p></div>
          </li>)}
        </ul>
        <Knoppen tweede={<button type="button" className="sn-pill hl-pill-licht" aria-haspopup="dialog" onClick={() => openPlanCall()}><span>Plan een call</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></button>} />
      </div>
    </section>

    {/* Stap 3: persoonlijke hulp binnen het systeem (de OS-laag en Connect). */}
    <section className="hl-stap" id="stap-hulp">
      <div className="hl-wrap">
        <StapKop nr="03" label="Hulp op maat" kop="Daarna helpen we je persoonlijk, in je eigen systeem." tekst="Begin gratis met het OS. Wil je dat wij het werk doen, dan werken echte experts in je OS, met de toegang die jij bepaalt." />
        <div className="hl-lagen">
          <article className="hl-laag">
            <img src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" width="600" height="92" loading="lazy" />
            <p className="hl-prijs"><strong>Gratis</strong> voor jou en 2 teamleden</p>
            <ul>{["Gratis website en rebranding", "Studio, social media en boekhouding", "Dashboard, CRM en AI agents"].map(p => <li key={p}><Check size={15} strokeWidth={3} aria-hidden="true" />{p}</li>)}</ul>
          </article>
          <article className="hl-laag hl-laag-connect">
            <img src="/images/home-header/socialnow-connect.png" alt="SocialNow Connect" width="1362" height="171" loading="lazy" />
            <p className="hl-prijs"><strong>Vanaf {CONNECT[0].prijs}</strong> per maand</p>
            <ul>{CONNECT.map(p => <li key={p.id}><Check size={15} strokeWidth={3} aria-hidden="true" /><span translate="no">{p.naam}</span><b>{p.prijs}</b></li>)}</ul>
            <Link className="hl-meer" to="/diensten#prijzen">Bekijk wat erin zit <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </article>
        </div>
        <Knoppen />
      </div>
    </section>

    {/* Slot: aanmelden of de onboarding. */}
    <section className="hl-slot" id="aanmelden">
      <div className="hl-wrap">
        <h2>Begin vandaag.</h2>
        <div className="hl-keuzes">
          <a className="hl-keuze" href={AANMELDEN_URL}><strong>Meld je aan</strong><span>Je eigen OS, gratis voor jou en 2 teamleden.</span><ArrowUpRight size={22} aria-hidden="true" /></a>
          <a className="hl-keuze" href={ONBOARDING_URL}><strong>Vul de onboarding in</strong><span>Een gratis websitedemo in je eigen merk.</span><ArrowUpRight size={22} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  </div>;
}
