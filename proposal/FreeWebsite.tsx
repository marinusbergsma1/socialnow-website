import { useEffect, useRef, useState } from "react";
import "./free-website.css";

export const ONBOARDING_URL = "https://website.socialnow.nl";
const examples = [
  { name: "VDZ Brigade", url: "https://vdz-brigade.nl", image: "/screenshots/vdz-brigade-hero.webp", video: "/video/vdz/vdz-house.mp4", poster: "/video/vdz/vdz-house-poster.jpg", film: "Website-animatie" },
  { name: "Il Gordo", url: "https://ilgordo.nl", image: "/screenshots/ilgordo-hero.webp", video: "/video/ilgordo/ilgordo-header.mp4", poster: "/video/ilgordo/ilgordo-header-poster.webp", film: "Websitefilm" },
];

function WebsiteExamples() {
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<"website" | "video">("website");
  const [near, setNear] = useState(false);
  const region = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!region.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    observer.observe(region.current);
    return () => observer.disconnect();
  }, []);
  const project = examples[index];
  return <div className="sn-fw-examples" ref={region}>
    <p className="sn-fw-example-hint">Klik door ons werk. Bekijk de website én de video erachter.</p>
    <div className="sn-fw-projects" role="group" aria-label="Kies een project">
      {examples.map((item, i) => <button type="button" key={item.name} aria-pressed={i === index} onClick={() => { setIndex(i); setView("website"); }}>
        <img src={item.image} alt="" loading="lazy" width="240" height="135" /><strong translate="no">{item.name}</strong>
      </button>)}
    </div>
    <div className="sn-fw-previewbar">
      <div role="group" aria-label="Kies de weergave">
        <button type="button" aria-pressed={view === "website"} onClick={() => setView("website")}>Live website</button>
        {project.video && <button type="button" aria-pressed={view === "video"} onClick={() => setView("video")}>{project.film}</button>}
      </div>
      <a href={project.url} target="_blank" rel="noopener noreferrer">Open website ↗</a>
    </div>
    <div className={`sn-fw-preview ${view === "video" ? "is-video" : ""}`}>
      {near && (view === "website" ? <iframe key={project.url} src={project.url} title={project.name} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" /> : <video key={project.video} controls playsInline preload="metadata" poster={project.poster} aria-label={project.film}><source src={project.video} type="video/mp4" /></video>)}
    </div>
    <p className="sn-fw-example-note">Eerder werk, ter inspiratie voor jouw demo.</p>
  </div>;
}

export default function FreeWebsite() {
  return <section id="free-website" className="sn-free-website" aria-labelledby="free-website-titel">
    <div className="h-wrap sn-fw-binnen">
      <div className="sn-fw-kop">
        <p className="sn-fw-label">Twee gratis starts voor je bedrijf</p>
        <h2 id="free-website-titel">Boekhouding geregeld.<br /><span>Je nieuwe website in beeld.</span></h2>
        <p className="sn-fw-intro">Start gratis met boekhouding in Odoo. Laat ons daarnaast een gratis demo van jouw nieuwe website maken.</p>
      </div>
      <div className="sn-fw-offers">
        <article className="sn-fw-accounting" aria-labelledby="free-accounting-title">
          <p className="sn-fw-offer-label">Gratis boekhouding · Odoo</p>
          <h3 id="free-accounting-title">Alleen boekhouding.<br />Daarom gratis.</h3>
          <p>Facturen, uitgaven en overzicht. Kies de Boekhouding-app binnen Odoo’s One App Free-plan.</p>
          <div className="sn-fw-price"><b translate="no">€0</b><span>/ maand</span></div>
          <div className="sn-fw-ledger">
            <p>Je administratie · alles op één plek</p>
            <ul><li><span>Facturen</span><b aria-hidden="true">✓</b></li><li><span>Uitgaven</span><b aria-hidden="true">✓</b></li><li><span>Financieel overzicht</span><b aria-hidden="true">✓</b></li></ul>
          </div>
          <a className="sn-fw-button" href="https://www.odoo.com/app/accounting" target="_blank" rel="noopener noreferrer"><span>Start gratis met boekhouding</span><b aria-hidden="true">↗</b></a>
          <p className="sn-fw-fine">Blijft gratis zolang je alleen de Boekhouding-app gebruikt binnen One App Free op Odoo Online. Extra apps of maatwerk kunnen betaald zijn. <a href="https://www.odoo.com/pricing" target="_blank" rel="noopener noreferrer">Bekijk de voorwaarden</a></p>
        </article>
        <article className="sn-fw-demo" aria-labelledby="free-website-route-demo">
          <p className="sn-fw-offer-label">Gratis websitedemo · door ons team</p>
          <h3 id="free-website-route-demo">Jouw verhaal.<br />Een eerste website van ons.</h3>
          <p>Deel je wensen, teksten en beelden. Wij maken een gratis demo en bespreken die met je. Bekijk hieronder voorbeelden van ons werk.</p>
          <WebsiteExamples />
          <ol className="sn-fw-shortsteps"><li>Jij vertelt</li><li>Wij ontwerpen</li><li>Samen bespreken</li></ol>
          <a className="sn-fw-button" href={ONBOARDING_URL} target="_blank" rel="noopener noreferrer"><span>Laat mijn gratis websitedemo maken</span><b aria-hidden="true">↗</b></a>
          <p className="sn-fw-fine">De demo is gratis. Daarna beslis je of we verder bouwen.</p>
        </article>
      </div>
      <p className="sn-fw-notice">Odoo verzorgt je gratis boekhouding. De websitedemo maken wij voor je. Je hoeft daarvoor geen extra Website-app aan je Odoo-account toe te voegen.</p>
    </div>
  </section>;
}
