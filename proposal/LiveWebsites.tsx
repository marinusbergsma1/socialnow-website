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
import { Heading, TextLink } from "./ui";
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
  "primefone-website",
]);
// Websites die online staan, of waarvan we een eigen kopie (previewUrl) in het frame
// kunnen tonen. Offline sites zonder kopie blijven alleen als case bestaan.
const sites = webShowcaseProjects.filter((project) => !project.offline || project.previewUrl);
const frameSrcOf = (project: Project) =>
  project.previewUrl || (EMBED.has(project.slug) ? project.url : undefined);
// Alle frames worden vooraf geladen zodra het onderdeel in de buurt komt: eerst de
// actieve site, daarna een voor een de rest. Wisselen is dan direct, zonder herladen.
const PRELOAD_TIMEOUT = 2500;
export default function LiveWebsites() {
  const [index, setIndex] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const interactionTimer = useRef<number | undefined>(undefined);
  const frame = useRef<HTMLIFrameElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const stopInteraction = () => {
    window.clearTimeout(interactionTimer.current);
    setInteractive(false);
    if (document.activeElement === frame.current) control.current?.focus({preventScroll:true});
  };
  const startInteraction = () => {
    window.clearTimeout(interactionTimer.current);
    setInteractive(true);
    interactionTimer.current = window.setTimeout(stopInteraction, 2500);
  };
  // Ruime marge: het laden begint ruim voordat de bezoeker bij dit onderdeel is.
  const { ref, visible } = useInView<HTMLElement>("1500px 0px");
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (visible) setNear(true);
  }, [visible]);
  useEffect(() => {
    stopInteraction();
    return () => window.clearTimeout(interactionTimer.current);
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
  return (
    <section
      className="h-section h-wrap h-live-websites"
      ref={ref}
      aria-labelledby="live-websites-title"
    >
      <Heading
        id="live-websites-title"
        label="Webdesign & full-stack development"
        title={
          <>
            Gemaakt om
            <br />
            <span>te gebruiken.</span>
          </>
        }
        text="Bekijk onze websites van dichtbij. Blader door het werk, scroll door een website en ontdek hoe ontwerp en techniek samenkomen."
      >
        <TextLink to="/projecten">Alle projecten</TextLink>
      </Heading>
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
        <div className="h-live-screen"
          onPointerEnter={event => { if (live && event.pointerType === "mouse") startInteraction(); }}
          onPointerLeave={stopInteraction}
        >
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
          {(!live || !activeLoaded) && (
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
        {live && <button ref={control} type="button" className="h-text-link" aria-pressed={interactive}
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
    </section>
  );
}
