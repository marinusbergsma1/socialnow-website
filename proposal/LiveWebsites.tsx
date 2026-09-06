import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Monitor,
  Smartphone,
} from "lucide-react";
import { webShowcaseProjects } from "../data/projects";
import { Heading, TextLink } from "./ui";
import { useInView } from "./motion";

// Deze directe websites staan embedding toe. Sites met frame-beperkingen
// behouden hun eigen ontwerpbeeld en een gewone link naar de website.
const EMBED = new Set([
  "kwh-garant-website",
  "ilgordo-website",
  "vdz-brigade-website",
  "divine-machines-website",
]);
export default function LiveWebsites() {
  const [index, setIndex] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const { ref, visible } = useInView<HTMLElement>();
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (visible) setNear(true);
  }, [visible]);
  const selected = webShowcaseProjects[index];
  const project = selected.slug === "vastiq-website" ? { ...selected, title: "VASTIQ.AI", url: "https://vastiq.ai/" } : selected;
  const live = interactive && EMBED.has(project.slug);
  const choose = (next: number) => {
    setIndex((next + webShowcaseProjects.length) % webShowcaseProjects.length);
    setInteractive(true);
  };
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
            {live ? "Live website" : "Websiteontwerp"} · {index + 1} /{" "}
            {webShowcaseProjects.length}
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
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            Open website
            <ExternalLink size={13} />
          </a>
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
        <div className="h-live-screen" key={`${project.slug}-${live}`}>
          {live && near ? (
            <iframe
              title={`Live website van ${project.title}`}
              src={project.url}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <img
              src={project.fullPageScreenshot || project.image}
              alt={`Websiteontwerp voor ${project.title}`}
              width="1440"
              height="900"
              loading="lazy"
            />
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
        {EMBED.has(project.slug) && (
          <button
            className="h-text-link"
            type="button"
            onClick={() => setInteractive((value) => !value)}
          >
            {live ? "Toon het ontwerpbeeld" : "Bekijk de live website"}
          </button>
        )}
        <TextLink to={`/project/${project.slug}`}>Bekijk de case</TextLink>
      </div>
      <div
        className="h-site-thumbnails"
        role="group"
        aria-label="Kies een website"
      >
        {webShowcaseProjects.map((item, itemIndex) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={index === itemIndex}
            onClick={() => choose(itemIndex)}
          >
            <img
              src={item.image}
              alt=""
              width="240"
              height="150"
              loading="lazy"
            />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
