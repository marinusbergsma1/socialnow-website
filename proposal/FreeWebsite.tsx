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
    // 18 oktober 2026 (Marinus): "En de website-tiles gelijk laden." Zodra het blok in de buurt komt, laden alle
    // websites tegelijk, zodat bladeren niet meer op "Website laden…" wacht.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); setOpened(examples.map((_, i) => i)); observer.disconnect(); }
    }, { rootMargin: "1200px" });
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

export const STUDIO_URL = "https://app.socialnow.nl/studio";
const studioStyles = [["mensen-eigenaar", "Mensen"], ["product-flatlay", "Product"], ["plek-gevel", "Plek"], ["sfeer-buiten", "Sfeer"]];
function StudioPreview() {
  return <figure className="sn-studio-preview" aria-label="Studio, je creatieve werkplek">
    <div className="sn-studio-bar"><span className="sn-web-lights" aria-hidden="true"><i /><i /><i /></span><b translate="no">Studio</b><span>Jouw merk</span></div>
    <p className="sn-studio-brand"><small>Uit je website</small><span>logo</span><span>kleuren</span><span>lettertype</span><span>foto’s</span></p>
    <div className="sn-studio-grid">{studioStyles.map(([id, label]) => <figure key={id}><img src={`/images/studio/${id}.webp`} alt="" width="480" height="600" loading="lazy" decoding="async" /><figcaption>{label}</figcaption></figure>)}</div>
    <figcaption className="sn-studio-flow"><span>Bewerken</span><span>Downloaden</span><span>Inplannen</span></figcaption>
  </figure>;
}

export default function FreeWebsite() {
  return <section id="free-website" className="sn-free-website" aria-labelledby="free-website-titel">
    <div className="h-wrap sn-fw-binnen">
      <WebsiteExamples />
      <div className="sn-fw-kop">
        <p className="sn-fw-label">Drie manieren om te beginnen</p>
        <h2 id="free-website-titel">Je bedrijf.<br /><span>Goed geregeld.</span></h2>
        <p className="sn-fw-intro">Gratis starten is het begin. Ontdek wat er nog meer kan.</p>
      </div>
      <div className="sn-fw-offers">
        <article className="sn-fw-accounting" aria-labelledby="free-accounting-title">
          <div className="sn-fw-brand"><img src="/images/partners/odoo.svg" alt="Odoo" width="130" height="51" /></div>
          <p className="sn-fw-offer-label">Bedrijfssoftware · via Odoo</p>
          <h3 id="free-accounting-title">Je hele bedrijf. Eén systeem.</h3>
          <p>Van boekhouding en CRM tot verkoop, voorraad en je website.</p>
          <div className="sn-fw-ledger"><p>Odoo groeit met je mee</p><ul><li><span>Boekhouding</span><b aria-hidden="true">✓</b></li><li><span>CRM en verkoop</span><b aria-hidden="true">✓</b></li><li><span>Website en voorraad</span><b aria-hidden="true">✓</b></li></ul></div>
          <p className="sn-fw-start-note">Eén app gratis. Meer mogelijk met een betaald plan.</p>
          <div className="sn-fw-tile-bottom"><a className="sn-fw-button" href="https://www.odoo.com" target="_blank" rel="noopener noreferrer"><span>Ontdek Odoo</span><b aria-hidden="true">↗</b></a><p className="sn-fw-fine"><a href="https://www.odoo.com/pricing" target="_blank" rel="noopener noreferrer">Bekijk de prijzen en voorwaarden</a></p></div>
        </article>
        <article className="sn-fw-zernio" aria-labelledby="zernio-start-title">
          <div className="sn-fw-brand"><img src="/images/partners/zernio.svg" alt="Zernio" width="220" height="51" /></div>
          <p className="sn-fw-offer-label">Social media · via Zernio</p>
          <h3 id="zernio-start-title">Meer uit je social media.</h3>
          <p>Publiceren, berichten, analyses en advertenties. Samen op één plek.</p>
          <div className="sn-fw-ledger"><p>Van content naar resultaat</p><ul><li><span>Plannen en publiceren</span><b aria-hidden="true">✓</b></li><li><span>Berichten en reacties</span><b aria-hidden="true">✓</b></li><li><span>Analyses en advertenties</span><b aria-hidden="true">✓</b></li></ul></div>
          <p className="sn-fw-start-note">Twee accounts gratis. Meer accounts en extra gebruik zijn betaald.</p>
          <div className="sn-fw-tile-bottom"><a className="sn-fw-button" href={GRATIS_OS_URL}><span>Open je contentagenda</span><b aria-hidden="true">↗</b></a><p className="sn-fw-fine"><a href="https://docs.zernio.com/pricing" target="_blank" rel="noopener noreferrer">Bekijk de prijzen en voorwaarden</a></p></div>
        </article>
        <article className="sn-fw-demo" aria-labelledby="free-website-route-demo">
          <div className="sn-fw-brand"><img src="/images/SocialNow-Logo-2026.webp" alt="SocialNow" width="220" height="34" /></div>
          <p className="sn-fw-offer-label">Websitedemo + Studio</p>
          <h3 id="free-website-route-demo">Jouw merk. Zelf creëren.</h3>
          <p>Een gratis websitedemo van ons team. Maak daarna zelf beelden in jouw merkstijl met Studio.</p>
          <StudioPreview />
          <div className="sn-fw-tile-bottom"><a className="sn-fw-button" href={STUDIO_URL}><span>Open Studio</span><b aria-hidden="true">↗</b></a><a className="sn-fw-studio-button" href={ONBOARDING_URL} target="_blank" rel="noopener noreferrer"><span>Laat mijn gratis websitedemo maken</span><b aria-hidden="true">↗</b></a>
          <p className="sn-fw-fine">De demo is gratis. Daarna beslis je of we verder bouwen.</p></div>
        </article>
      </div>
      <p className="sn-fw-notice">We werken met Odoo en Zernio omdat ze veel bieden voor een eerlijke prijs. Onze experts helpen je er meer uit te halen.</p>
    </div>
  </section>;
}
