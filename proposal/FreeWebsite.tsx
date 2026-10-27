import { useEffect, useRef, useState } from "react";
import "./free-website.css";
import { webShowcaseProjects } from "../data/projects";

const examples = webShowcaseProjects
  .filter(project => project.slug !== "kwh-garant-website" && project.slug !== "vintage-watches-website" && project.url && (!project.offline || project.previewUrl))
  .map(project => ({ name: project.title, url: project.url!, slug: project.slug,
    previewUrl: project.previewUrl || (project.slug === "vdz-brigade-website" ? "https://www.vdz-brigade.nl/" : undefined), image: project.image }));

export function WebsiteExamples() {
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
    // 20 oktober 2026 (Marinus): "ALTIJD ALLEMAAL LADEN". Niet pas als het blok in beeld komt: direct na het laden van de
    // pagina starten alle sites, zodat ze klaar zijn voordat iemand bij de websites is.
    const allesLaden = () => { setVisible(true); setOpened(examples.map((_, i) => i)); };
    const start = () => window.setTimeout(allesLaden, 300);
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
    const tile = element.querySelector(".sn-web-preview");
    const resize = new ResizeObserver(([entry]) => setPreviewScale(entry.contentRect.width / 1280));
    if (tile) resize.observe(tile);
    return () => { observer.disconnect(); resize.disconnect(); window.removeEventListener("load", start); };
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
    {/* 27 oktober 2026 (Marinus): de dikke groene cirkels "niet zo mooi"; variant A, dun en strak, zoals in de onboarding. */}
    <div className="sn-web-navigation">
      <button type="button" aria-label="Vorige website" onClick={() => choose(index - 1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg></button>
      <div className="sn-web-pagination" role="group" aria-label="Kies een website">{examples.map((item, i) => <button type="button" key={item.slug} aria-label={item.name} aria-pressed={i === index} onClick={() => choose(i)}><span /></button>)}</div>
      <button type="button" aria-label="Volgende website" onClick={() => choose(index + 1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
    </div>
    <p className="sn-web-announcement" aria-live="polite" translate="no">{examples[index].name} · {index + 1} / {examples.length}</p>
  </div>;
}

// 19 oktober 2026 (Marinus): op Resultaten vervangt deze websitetegel de oude LiveWebsites-tegel.
export function WebsiteTegel() {
  return <section className="sn-free-website sn-fw-resultaten">
    <div className="h-wrap sn-fw-binnen"><WebsiteExamples /></div>
  </section>;
}

export default function FreeWebsite() {
  return <section id="free-website" className="sn-free-website" aria-labelledby="free-website-titel">
    <div className="h-wrap sn-fw-binnen">
      <WebsiteExamples />
      {/* 20 oktober 2026 (Marinus): "Apps is misschien iets voor os zelf niet voor de homepage." De appwand staat niet meer op de
          homepage; AppWand.tsx, apps.ts en public/images/apps blijven voor het OS. */}
    </div>
  </section>;
}
