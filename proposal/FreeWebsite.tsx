import { useEffect, useRef, useState } from "react";
import "./free-website.css";
import { webShowcaseProjects } from "../data/projects";

export const ONBOARDING_URL = "https://website.socialnow.nl";
const websiteFilms: Record<string, { video: string; poster: string; film: string }> = {
  "vdz-brigade-website": { video: "/video/vdz/vdz-house.mp4", poster: "/video/vdz/vdz-house-poster.jpg", film: "Website-animatie" },
  "ilgordo-website": { video: "/video/ilgordo/ilgordo-header.mp4", poster: "/video/ilgordo/ilgordo-header-poster.webp", film: "Websitefilm" },
};
// Dezelfde websites en volgorde als de eerdere balk, zonder kWh Garant.
const examples = webShowcaseProjects
  .filter(project => project.slug !== "kwh-garant-website" && project.url && (!project.offline || project.previewUrl))
  .map(project => ({ name: project.title, url: project.url!, image: project.image, previewUrl: project.previewUrl, slug: project.slug, ...websiteFilms[project.slug] }));
const frameSource = (project: typeof examples[number]) => project.previewUrl ||
  (project.slug === "vastiq-website" && import.meta.env.DEV ? "http://127.0.0.1:4330/" : project.url);

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
  const choose = (next: number) => { setIndex(Math.max(0, Math.min(examples.length - 1, next))); setView("website"); };
  return <div className="sn-fw-examples" ref={region} role="region" aria-label="Live websitevoorbeelden" aria-roledescription="carrousel">
    <div className="sn-fw-showcase-head"><div><p className="sn-fw-label">Ons werk · live websites</p><h3>Bekijk wat we maken.</h3></div><p>Eerder werk, ter inspiratie voor jouw demo.</p></div>
    <div className="sn-fw-previewbar">
      <strong translate="no">{project.name}</strong>
      <div role="group" aria-label="Kies de weergave"><button type="button" aria-pressed={view === "website"} onClick={() => setView("website")}>Live website</button>{project.video && <button type="button" aria-pressed={view === "video"} onClick={() => setView("video")}>{project.film}</button>}</div>
      <a href={project.url} target="_blank" rel="noopener noreferrer">Open website ↗</a>
    </div>
    <div className={`sn-fw-slider-window ${view === "video" ? "is-video" : ""}`}>
      {view === "website" ? <div className="sn-fw-live-track" style={{transform: `translateX(-${index * 100}%)`}}>
        {examples.map((item, i) => <div className="sn-fw-live-tile" key={item.url} aria-hidden={i !== index} inert={i !== index ? true : undefined}>
          {near && <iframe src={frameSource(item)} title={item.name} loading="lazy" tabIndex={-1} referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" />}
        </div>)}
      </div> : near && <video key={project.video} controls playsInline preload="metadata" poster={project.poster} aria-label={project.film}><source src={project.video} type="video/mp4" /></video>}
    </div>
    <div className="sn-fw-slider-nav">
      <button type="button" aria-label="Vorige website" disabled={index === 0} onClick={() => choose(index - 1)}>←</button>
      <div className="sn-fw-position"><input type="range" min="0" max={examples.length - 1} step="1" value={index} aria-label="Kies een website" aria-valuetext={project.name} onChange={event => choose(Number(event.target.value))} /><div className="sn-fw-site-labels">{examples.map((item, i) => <button type="button" key={item.name} aria-pressed={i === index} onClick={() => choose(i)} translate="no">{item.name}</button>)}</div></div>
      <button type="button" aria-label="Volgende website" disabled={index === examples.length - 1} onClick={() => choose(index + 1)}>→</button>
    </div>
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
      <WebsiteExamples />
      <div className="sn-fw-offers">
        <article className="sn-fw-accounting" aria-labelledby="free-accounting-title">
          <div className="sn-fw-brand"><img src="/images/partners/odoo.svg" alt="Odoo" width="130" height="51" /></div>
          <p className="sn-fw-offer-label">Gratis boekhouding</p>
          <h3 id="free-accounting-title">Alleen boekhouding.<br />Daarom gratis.</h3>
          <p>Facturen, uitgaven en overzicht. Kies de Boekhouding-app binnen Odoo’s One App Free-plan.</p>
          <div className="sn-fw-price"><b translate="no">€0</b><span>/ maand</span></div>
          <div className="sn-fw-ledger">
            <p>Je administratie · alles op één plek</p>
            <ul><li><span>Facturen</span><b aria-hidden="true">✓</b></li><li><span>Uitgaven</span><b aria-hidden="true">✓</b></li><li><span>Financieel overzicht</span><b aria-hidden="true">✓</b></li></ul>
          </div>
          <div className="sn-fw-tile-bottom"><a className="sn-fw-button" href="https://www.odoo.com/app/accounting" target="_blank" rel="noopener noreferrer"><span>Start gratis met boekhouding</span><b aria-hidden="true">↗</b></a>
          <p className="sn-fw-fine">Blijft gratis zolang je alleen de Boekhouding-app gebruikt binnen One App Free op Odoo Online. Extra apps of maatwerk kunnen betaald zijn. <a href="https://www.odoo.com/pricing" target="_blank" rel="noopener noreferrer">Bekijk de voorwaarden</a></p></div>
        </article>
        <article className="sn-fw-demo" aria-labelledby="free-website-route-demo">
          <div className="sn-fw-brand"><img src="/images/SocialNow-Logo-2026.webp" alt="SocialNow" width="220" height="34" /></div>
          <p className="sn-fw-offer-label">Gratis websitedemo · door ons team</p>
          <h3 id="free-website-route-demo">Jouw verhaal.<br />Een eerste website van ons.</h3>
          <p>Deel je wensen, teksten en beelden. Wij maken een gratis demo en bespreken die persoonlijk met je.</p>
          <ol className="sn-fw-shortsteps"><li><strong>Jij vertelt</strong><span>Je wensen, teksten, logo en beelden.</span></li><li><strong>Wij ontwerpen</strong><span>Een eerste website in jouw merkstijl.</span></li><li><strong>Samen bespreken</strong><span>Je ziet de demo en kiest de volgende stap.</span></li></ol>
          <div className="sn-fw-tile-bottom"><a className="sn-fw-button" href={ONBOARDING_URL} target="_blank" rel="noopener noreferrer"><span>Laat mijn gratis websitedemo maken</span><b aria-hidden="true">↗</b></a>
          <p className="sn-fw-fine">De demo is gratis. Daarna beslis je of we verder bouwen.</p></div>
        </article>
      </div>
      <p className="sn-fw-notice">Odoo verzorgt je gratis boekhouding. De websitedemo maken wij voor je. Je hoeft daarvoor geen extra Website-app aan je Odoo-account toe te voegen.</p>
    </div>
  </section>;
}
