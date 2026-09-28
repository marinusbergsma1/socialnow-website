import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Monitor,
  Smartphone,
} from "lucide-react";
import { webShowcaseProjects } from "../data/projects";
import type { Project } from "../types";
import { TextLink } from "./ui";
import { Tegel } from "./Bento";
import { useInView } from "./motion";

// Deze directe websites staan embedding toe (geen X-Frame-Options / frame-ancestors).
// Sites met frame-beperkingen tonen hun same-origin spiegel (previewUrl) of anders
// een directe link, zonder vervangende afbeeldingen.
const EMBED = new Set([
  "kwh-garant-website",
  "ilgordo-website",
  "vdz-brigade-website",
  "divine-machines-website",
  "vintage-watches-website",
  "newblack-website",
  // vastiq.ai staat framing toe voor socialnow.nl (frame-ancestors), niet voor andere hosts.
  "vastiq-website",
]);
// Websites die online staan, of waarvan we een eigen kopie (previewUrl) in het frame
// kunnen tonen. Blokkeert een site iframes, dan tonen we de volledige paginaopname
// scrollbaar in het frame. Offline sites zonder kopie blijven alleen als case bestaan.
const sites = webShowcaseProjects.filter((project) => !project.offline || project.previewUrl);
// Sites die alleen vanaf socialnow.nl in een frame mogen. Elders (localhost, preview)
// tonen we de directe link in plaats van een frame dat de browser toch blokkeert.
const SOCIALNOW_ONLY = new Set(["vastiq-website"]);
const onSocialNow =
  typeof location === "undefined" || /(^|\.)socialnow\.nl$/.test(location.hostname);
const frameSrcOf = (project: Project) => {
  if (SOCIALNOW_ONLY.has(project.slug) && !onSocialNow) return undefined;
  return project.previewUrl || (EMBED.has(project.slug) ? project.url : undefined);
};
// Alle frames worden vooraf geladen zodra het onderdeel in de buurt komt: eerst de
// actieve site, daarna een voor een de rest. Wisselen is dan direct, zonder herladen.
const PRELOAD_TIMEOUT = 2500;
export default function LiveWebsites() {
  const [index, setIndex] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [klaar, setKlaar] = useState(false);
  useEffect(() => setKlaar(true), []);
  const frame = useRef<HTMLIFrameElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const stopInteraction = () => {
    setInteractive(false);
    if (document.activeElement === frame.current) control.current?.focus({preventScroll:true});
  };
  // 28 september 2026 (Marinus): "ik wil niet dat die stoppen met scrollen als je met je muis erop bent, maar het scrollen
  // door de live sites moet wel mogelijk blijven". Met de muis erboven scrolt de pagina gewoon door. Wie door een site wil
  // scrollen klikt eerst; weg met de muis, Escape of de knop eronder geeft de pagina terug.
  const startInteraction = () => setInteractive(true);
  // Ruime marge: het laden begint ruim voordat de bezoeker bij dit onderdeel is.
  const { ref, visible } = useInView<HTMLElement>("1500px 0px");
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (visible) setNear(true);
  }, [visible]);
  useEffect(() => {
    stopInteraction();
  }, [index, visible]);
  const project = sites[index];
  const frameSrc = frameSrcOf(project);
  const live = !!frameSrc;
  const choose = (next: number) => {
    setIndex((next + sites.length) % sites.length);
  };
  // Welke frames in de DOM staan (in laadvolgorde) en welke klaar zijn.
  const [mounted, setMounted] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<string[]>([]);
  const mountNext = () =>
    setMounted((current) => {
      const next = sites.find((site) => frameSrcOf(site) && !current.includes(site.slug));
      return next ? [...current, next.slug] : current;
    });
  useEffect(() => {
    if (!near || !live) return;
    setMounted((current) => (current.includes(project.slug) ? current : [...current, project.slug]));
  }, [near, live, project.slug]);
  useEffect(() => {
    if (!near) return;
    // Vangnet: laadt een site traag of nooit, dan gaat de volgende toch van start.
    const timer = window.setTimeout(mountNext, PRELOAD_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [near, mounted.length]);
  const activeLoaded = loaded.includes(project.slug);
  const bedienbaar = live ? activeLoaded : !!project.fullPageScreenshot;
  return (
    <section
      className="sn-bento h-wrap h-live-websites"
      ref={ref}
      aria-labelledby="live-websites-title"
    >
      <div className="sn-bento-kop">
        <p className="h-eyebrow"><i />Webdesign & full-stack development</p>
        <h2 id="live-websites-title">
          Gemaakt om
          <br />
          <span>te gebruiken.</span>
        </h2>
      </div>
      <div className={`sn-bento-rooster${klaar ? " is-klaar" : ""}`}>
      <Tegel kop="Live website" breed={8} className="h-live-tegel">
      <div className="h-live-toolbar">
        <div className="h-live-title" aria-live="polite">
          <strong>{project.title}</strong>
          <span>
            Live website · {index + 1} /{" "}
            {sites.length}
          </span>
        </div>
        <div className="h-live-tools">
          <button
            type="button"
            aria-label="Desktopweergave"
            aria-pressed={!mobile}
            onClick={() => setMobile(false)}
          >
            <Monitor size={17} />
          </button>
          <button
            type="button"
            aria-label="Mobiele weergave"
            aria-pressed={mobile}
            onClick={() => setMobile(true)}
          >
            <Smartphone size={16} />
          </button>
          {!project.offline && (
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              Open live website
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
      <div className={`h-live-device${mobile ? " is-mobile" : ""}`}>
        <div className="h-browser-bar">
          <span aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>{new URL(project.url!).hostname}</span>
        </div>
        <div className={`h-live-screen${interactive ? " is-actief" : ""}`}
          onPointerLeave={event => { if (event.pointerType === "mouse") stopInteraction(); }}
          onKeyDown={event => { if (event.key === "Escape") stopInteraction(); }}
        >
          {bedienbaar && !interactive && (
            <button type="button" className="h-live-activeer" onClick={startInteraction}>
              <span>Klik om door deze website te scrollen</span>
            </button>
          )}
          {near && sites.map((site) => {
            const src = frameSrcOf(site);
            if (!src || !mounted.includes(site.slug)) return null;
            const active = site.slug === project.slug;
            const show = active && loaded.includes(site.slug);
            return (
              <iframe
                key={site.slug}
                ref={active ? frame : undefined}
                hidden={!show}
                tabIndex={show && interactive ? 0 : -1}
                style={{pointerEvents: show && interactive ? "auto" : "none"}}
                title={`Live website van ${site.title}`}
                src={src}
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                onLoad={() => {
                  setLoaded((current) => (current.includes(site.slug) ? current : [...current, site.slug]));
                  mountNext();
                }}
              />
            );
          })}
          {!live && project.fullPageScreenshot && (
            <img
              src={project.fullPageScreenshot}
              alt={`Volledige paginaopname van de website van ${project.title}`}
              loading="lazy"
              decoding="async"
            />
          )}
          {((!live && !project.fullPageScreenshot) || (live && !activeLoaded)) && (
            <div className="h-live-direct">
              <strong>{project.title}</strong>
              {!project.offline && (
                <a className="sn-btn3d h-button" href={project.url} target="_blank" rel="noopener noreferrer">
                  Open live website <ExternalLink size={18} />
                </a>
              )}
              <span>{live ? "De live website wordt geladen." : "Deze website opent in een nieuw tabblad."}</span>
            </div>
          )}
        </div>
      </div>
      </Tegel>
      <Tegel kop={project.title} breed={4} className="h-live-info">
        <p className="sn-tegel-label">{project.category}</p>
        <p className="sn-tegel-tekst">{project.description}</p>
        {project.metrics && (
          <dl className="h-live-cijfers">
            {project.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd style={{ color: metric.color }}>{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="h-live-bottom">
        <div className="h-rail-arrows">
          <button
            type="button"
            onClick={() => choose(index - 1)}
            aria-label="Vorige website"
          >
            <ChevronLeft size={19} />
          </button>
          <button
            type="button"
            onClick={() => choose(index + 1)}
            aria-label="Volgende website"
          >
            <ChevronRight size={19} />
          </button>
        </div>
        {bedienbaar && <button ref={control} type="button" className="h-text-link" aria-pressed={interactive}
          onClick={interactive ? stopInteraction : startInteraction}>
          {interactive ? "Verder op deze pagina" : "Website bedienen"}
        </button>}
        <TextLink to={`/project/${project.slug}`}>Bekijk de case</TextLink>
      </div>
      <div
        className="h-site-thumbnails"
        role="group"
        aria-label="Kies een website"
      >
        {sites.map((item, itemIndex) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={index === itemIndex}
            onClick={() => choose(itemIndex)}
          >
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      </Tegel>
      </div>
    </section>
  );
}
