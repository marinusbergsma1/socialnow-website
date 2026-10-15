import { useEffect, useRef, useState } from "react";
import "./free-website.css";
import { webShowcaseProjects } from "../data/projects";

export const ONBOARDING_URL = "https://website.socialnow.nl";
const examples = webShowcaseProjects
  .filter(project => project.slug !== "kwh-garant-website" && project.slug !== "vintage-watches-website" && project.url && (!project.offline || project.previewUrl))
  .map(project => ({ name: project.title, url: project.url!, slug: project.slug,
    recording: `/images/website-previews/${project.slug}.mp4`,
    poster: `/images/website-previews/${project.slug}.webp` }));

function WebsiteExamples() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const region = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);
  const choose = (next: number) => setIndex((next + examples.length) % examples.length);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update(); preference.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 });
    if (region.current) observer.observe(region.current);
    return () => { observer.disconnect(); preference.removeEventListener("change", update); };
  }, []);
  useEffect(() => {
    const update = () => videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === index && visible && !reducedMotion && !paused && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    });
    update(); document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [index, visible, reducedMotion, paused]);
  return <div className="sn-fw-examples" ref={region} role="region" aria-label="Live websitevoorbeelden" aria-roledescription="carrousel">
    <div className="sn-fw-showcase-head"><div><p className="sn-fw-label">Ons werk · live websites</p><h3>Bekijk wat we maken.</h3></div><p>Eerder werk, ter inspiratie voor jouw demo.</p></div>
    <div className="sn-web-deck" tabIndex={0} aria-label="Websitevoorbeelden. Gebruik de pijltjestoetsen om te bladeren."
      onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); choose(index + (event.key === "ArrowRight" ? 1 : -1)); } }}
      onPointerDown={event => { pointer.current = { x: event.clientX, y: event.clientY }; dragged.current = false; }}
      onPointerMove={event => { if (pointer.current && Math.abs(event.clientX - pointer.current.x) > 12) dragged.current = true; }}
      onPointerUp={event => {
        if (!pointer.current) return;
        const dx = event.clientX - pointer.current.x, dy = event.clientY - pointer.current.y;
        pointer.current = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { dragged.current = true; choose(index + (dx < 0 ? 1 : -1)); }
      }} onPointerCancel={() => { pointer.current = null; }}>
      {examples.map((item, i) => {
        let offset = (i - index + examples.length) % examples.length;
        if (offset > examples.length / 2) offset -= examples.length;
        const active = offset === 0;
        return <article key={item.slug} className={`sn-web-tile${active ? " is-active" : ""}`} data-offset={offset}
          style={{ "--offset": offset, "--distance": Math.abs(offset) } as import("react").CSSProperties}>
          <div className="sn-web-address"><span className="sn-web-lights" aria-hidden="true"><i /><i /><i /></span><span className="sn-web-host" translate="no">{new URL(item.url).hostname.replace(/^www\./, "")}</span>
            {active && <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={event => { if (dragged.current) event.preventDefault(); }}>Bekijk live <span aria-hidden="true">↗</span></a>}
          </div>
          <button type="button" className="sn-web-preview" tabIndex={active ? -1 : 0} aria-label={item.name}
            onClick={() => { if (!dragged.current && !active) choose(i); }}>
            <video ref={element => { videos.current[i] = element; }} src={visible && active && !reducedMotion ? item.recording : undefined}
              poster={item.poster} muted loop playsInline preload="none" aria-hidden="true" />
          </button>
        </article>;
      })}
    </div>
    <div className="sn-web-navigation">
      <button type="button" aria-label="Vorige website" onClick={() => choose(index - 1)}>←</button>
      <div className="sn-web-pagination" role="group" aria-label="Kies een website">{examples.map((item, i) => <button type="button" key={item.slug} aria-label={item.name} aria-pressed={i === index} onClick={() => choose(i)}><span /></button>)}</div>
      <button type="button" aria-label="Volgende website" onClick={() => choose(index + 1)}>→</button>
      {!reducedMotion && <button type="button" className="sn-web-pause" aria-label={paused ? "Opname afspelen" : "Opname pauzeren"} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "▷" : "Ⅱ"}</button>}
    </div>
    <p className="sn-web-announcement" aria-live="polite" translate="no">{examples[index].name} · {index + 1} / {examples.length}</p>
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
