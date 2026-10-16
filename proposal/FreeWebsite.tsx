import { useEffect, useRef, useState } from "react";
import "./free-website.css";
import { GRATIS_OS_URL } from "./os-entry";
import { webShowcaseProjects } from "../data/projects";

export const ONBOARDING_URL = "https://website.socialnow.nl";
const examples = webShowcaseProjects
  .filter(project => project.slug !== "kwh-garant-website" && project.slug !== "vintage-watches-website" && project.url && (!project.offline || project.previewUrl))
  .map(project => ({ name: project.title, url: project.url!, slug: project.slug,
    previewUrl: project.previewUrl || (project.slug === "vdz-brigade-website" ? "https://www.vdz-brigade.nl/" : undefined), image: project.image }));

function WebsiteExamples() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [productionHost, setProductionHost] = useState(true);
  const [opened, setOpened] = useState<number[]>([0]);
  const [loadedFrames, setLoadedFrames] = useState<Record<number, boolean>>({});
  const [previewScale, setPreviewScale] = useState(1);
  const region = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);
  const choose = (next: number) => {
    const target = (next + examples.length) % examples.length;
    setOpened(previous => previous.includes(target) ? previous : [...previous, target]);
    setIndex(target);
  };
  useEffect(() => {
    setProductionHost(["socialnow.nl", "www.socialnow.nl"].includes(window.location.hostname));
    const element = region.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "400px" });
    observer.observe(element);
    const tile = element.querySelector(".sn-web-preview");
    const resize = new ResizeObserver(([entry]) => setPreviewScale(entry.contentRect.width / 1280));
    if (tile) resize.observe(tile);
    return () => { observer.disconnect(); resize.disconnect(); };
  }, []);
  return <div className="sn-fw-examples" ref={region} role="region" aria-label="Live websitevoorbeelden" aria-roledescription="carrousel">
    <div className="sn-fw-showcase-head"><div><p className="sn-fw-label">Onze websites</p><h3>Altijd een gratis websitedemo.</h3></div><p>Persoonlijk gemaakt. Geen AI-slop.</p></div>
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
        const canEmbed = item.slug !== "vastiq-website" || productionHost;
        return <article key={item.slug} className={`sn-web-tile${active ? " is-active" : ""}`} data-offset={offset}
          style={{ "--offset": offset, "--distance": Math.abs(offset), "--preview-scale": previewScale } as import("react").CSSProperties}>
          <div className="sn-web-address"><span className="sn-web-lights" aria-hidden="true"><i /><i /><i /></span><span className="sn-web-host" translate="no">{new URL(item.url).hostname.replace(/^www\./, "")}</span>
            {active && <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={event => { if (dragged.current) event.preventDefault(); }}>Bekijk live <span aria-hidden="true">↗</span></a>}
          </div>
          <div className="sn-web-preview" role={active ? undefined : "button"} tabIndex={active ? undefined : 0} aria-label={active ? undefined : item.name}
            onKeyDown={event => { if (!active && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); choose(i); } }}
            onClick={event => { if ((!dragged.current || event.detail === 0) && !active) choose(i); }}>
            <img className="sn-web-thumbnail" src={item.image} alt="" aria-hidden="true" width="1280" height="800" decoding="async" />
            {active && canEmbed && !loadedFrames[i] && <span className="sn-web-loading" role="status">Website laden…</span>}
            {visible && canEmbed && opened.includes(i) && <iframe src={item.previewUrl || item.url} title={item.name} tabIndex={active ? 0 : -1}
              inert={!active ? true : undefined} aria-hidden={!active ? true : undefined} loading="eager"
              data-ready={loadedFrames[i] ? "true" : "false"} onLoad={() => setLoadedFrames(previous => ({ ...previous, [i]: true }))}
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" />}
          </div>
        </article>;
      })}
    </div>
    <div className="sn-web-navigation">
      <button type="button" aria-label="Vorige website" onClick={() => choose(index - 1)}>←</button>
      <div className="sn-web-pagination" role="group" aria-label="Kies een website">{examples.map((item, i) => <button type="button" key={item.slug} aria-label={item.name} aria-pressed={i === index} onClick={() => choose(i)}><span /></button>)}</div>
      <button type="button" aria-label="Volgende website" onClick={() => choose(index + 1)}>→</button>
    </div>
    <p className="sn-web-announcement" aria-live="polite" translate="no">{examples[index].name} · {index + 1} / {examples.length}</p>
  </div>;
}

export default function FreeWebsite() {
  return <section id="free-website" className="sn-free-website" aria-labelledby="free-website-titel">
    <div className="h-wrap sn-fw-binnen">
      <WebsiteExamples />
      <div className="sn-fw-kop">
        <p className="sn-fw-label">Drie manieren om te beginnen</p>
        <h2 id="free-website-titel">Je bedrijf.<br /><span>Goed geregeld.</span></h2>
        <p className="sn-fw-intro">Een gratis websitedemo van ons team, boekhouding via Odoo en social media via Zernio. Kies waar je begint.</p>
      </div>
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
        <article className="sn-fw-zernio" aria-labelledby="zernio-start-title">
          <div className="sn-fw-brand"><img src="/images/partners/zernio.svg" alt="Zernio" width="220" height="51" /></div>
          <p className="sn-fw-offer-label">Social media · via Zernio</p>
          <h3 id="zernio-start-title">Je socials.<br />Eén agenda.</h3>
          <p>Plan en publiceer je content via Zernio. Houd je kanalen en publicaties overzichtelijk bij elkaar.</p>
          <div className="sn-fw-ledger"><p>Van idee naar publicatie</p><ul><li><span>Content voorbereiden</span><b aria-hidden="true">✓</b></li><li><span>Publicaties plannen</span><b aria-hidden="true">✓</b></li><li><span>Kanalen verbinden</span><b aria-hidden="true">✓</b></li></ul></div>
          <div className="sn-fw-tile-bottom"><a className="sn-fw-button" href={GRATIS_OS_URL}><span>Open je contentagenda</span><b aria-hidden="true">↗</b></a><p className="sn-fw-fine"><a href="https://zernio.com/social-media-api" target="_blank" rel="noopener noreferrer">Meer over Zernio</a></p></div>
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
      <p className="sn-fw-notice">Odoo voor je boekhouding, Zernio voor je socials en ons team voor je website. Je OS brengt de onderdelen samen.</p>
    </div>
  </section>;
}
