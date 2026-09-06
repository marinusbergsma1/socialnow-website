import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Play,
  X,
  MessageCircle,
} from "lucide-react";
import { agents, faqs, logos, people } from "./content";
import OsEntry, { CLAIM_URL } from "./os-entry";
import { MiloMotion, MotionControl } from "./motion";
import type { Project } from "../types";

export function Action({
  children,
  to,
  href,
  secondary = false,
}: {
  children: React.ReactNode;
  to?: string;
  href?: string;
  secondary?: boolean;
}) {
  const className = `sn-btn3d h-button${secondary ? " h-button-secondary" : ""}${href === CLAIM_URL ? " h-try-button" : ""}`;
  const body = (
    <>
      <span className="sn-btn3d-sheen" />
      <span>{children}</span>
      <span className="h-button-icon">
        <ArrowUpRight size={16} aria-hidden="true" />
      </span>
    </>
  );
  return to ? (
    <Link className={className} to={to}>
      {body}
    </Link>
  ) : (
    <a className={className} href={href}>
      {body}
    </a>
  );
}
export function TextLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="h-text-link" to={to}>
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function Heading({
  id,
  label,
  title,
  text,
  children,
}: {
  id?: string;
  label: string;
  title: React.ReactNode;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="h-section-heading">
      <div>
        <p className="h-eyebrow">{label}</p>
        <h2 id={id}>{title}</h2>
        {text && <p className="h-intro">{text}</p>}
      </div>
      {children}
    </div>
  );
}
export function PageHeading({
  label,
  title,
  text,
}: {
  label: string;
  title: React.ReactNode;
  text: string;
}) {
  return (
    <header className="h-page-heading h-wrap">
      <p className="h-eyebrow">{label}</p>
      <h1>{title}</h1>
      <p className="h-intro">{text}</p>
    </header>
  );
}
export function VideoBlock({
  file,
  title,
  note,
}: {
  file: string;
  title: string;
  note: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="h-video-block"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        <span className="h-play">
          <Play size={17} aria-hidden="true" />
        </span>
        <span>
          <strong>{title}</strong>
          <small>Bekijk de video</small>
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      {open && (
        <div className="h-video-body">
          <video
            src={`/video/os/${file}.mp4`}
            poster={`/video/os/${file}.webp`}
            controls
            playsInline
            preload="metadata"
            aria-label={title}
          />
          <p>{note}</p>
        </div>
      )}
    </details>
  );
}
export function MiloPortrait({ role, name }: { role: string; name: string }) {
  return (
    <Link
      to={`/het-os#${role}`}
      className="h-agent-visual"
      aria-label={`Ontdek ${name}`}
    >
      <MiloMotion role={role} name={name} />
    </Link>
  );
}
export function HeroMilos() {
  return (
    <div
      className="h-hero-milos"
      aria-label="De vier Milo-specialisten uit SocialNow OS"
    >
      {agents.map((agent) => (
        <Link
          to={`/het-os#${agent.id}`}
          key={agent.id}
          style={{ "--accent": agent.color } as React.CSSProperties}
        >
          <MiloMotion role={agent.id} name={agent.name} />
          <strong>{agent.title}</strong>
          <span>{agent.promise}</span>
        </Link>
      ))}
      <div className="h-hero-motion">
        <MotionControl />
      </div>
    </div>
  );
}
export function AgentCards() {
  return (
    <div className="h-agent-grid">
      {agents.map((agent, index) => (
        <article
          className="h-agent-card"
          key={agent.id}
          style={{ "--accent": agent.color } as React.CSSProperties}
        >
          <span className="h-agent-number">
            0{index + 1} / {agent.label}
          </span>
          <MiloPortrait role={agent.id} name={agent.name} />
          <h3>{agent.title}</h3>
          <strong className="h-agent-promise">{agent.promise}</strong>
          <p>{agent.text}</p>
          <TextLink to={`/het-os#${agent.id}`}>Ontdek dit onderdeel</TextLink>
        </article>
      ))}
    </div>
  );
}
export function ConversionBridge() {
  return (
    <div className="h-conversion">
      <div>
        <p className="h-eyebrow">Eerst proberen. Daarna op maat.</p>
        <h3>Ontdek hoe het werkt.</h3>
        <p>
          Ontdek hoe de vier Milo’s en één overzichtelijke omgeving samenkomen.
          Vanuit jouw ervaring bespreken we daarna wat je bedrijf nodig heeft.
        </p>
      </div>
      <div className="h-poc-actions">
        <Action href={CLAIM_URL}>Probeer het OS</Action>
        <TextLink to="/contact?onderwerp=Custom%20OS">
          Al geprobeerd? Bespreek jouw Custom OS
        </TextLink>
      </div>
    </div>
  );
}
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="h-project">
      <Link to={`/project/${project.slug}`}>
        <div className="h-project-image">
          <img
            src={project.image}
            alt={`${project.title} — werk van SocialNow`}
            width="900"
            height="600"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="h-project-caption">
          <div>
            <small>{project.client || project.category}</small>
            <h3>{project.title}</h3>
          </div>
          <ArrowUpRight size={22} aria-hidden="true" />
        </div>
      </Link>
      <p>{project.services?.slice(0, 3).join(" · ")}</p>
    </article>
  );
}
export function TeamGrid({ short = false }: { short?: boolean }) {
  return (
    <div className="h-people-grid">
      {(short ? people.slice(0, 4) : people).map((person) => (
        <figure key={person.name}>
          <div className="h-portrait">
            <img
              src={`/images/${person.image}`}
              alt={person.name}
              width="500"
              height="570"
              loading="lazy"
            />
          </div>
          <figcaption>
            <strong>{person.name}</strong>
            <span>{person.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
export function ClientLogos() {
  return (
    <div className="h-clients h-wrap">
      <p className="h-eyebrow">Werk gemaakt voor onder meer</p>
      <div>
        {logos.map(([src, name]) => (
          <img
            key={src}
            src={`/images/${src}`}
            alt={name}
            width="220"
            height="100"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
export function Questions() {
  return (
    <div className="h-questions">
      {faqs.map((faq) => (
        <details key={faq.question}>
          <summary>
            {faq.question}
            <ChevronDown size={17} aria-hidden="true" />
          </summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
export function Closing() {
  return (
    <section className="h-closing h-wrap">
      <div className="h-closing-milos">
        {agents.map((agent) => (
          <img
            key={agent.id}
            src={`/proposal/milo/${agent.id}.webp`}
            alt={agent.name}
            width="84"
            height="84"
            loading="lazy"
          />
        ))}
      </div>
      <p className="h-eyebrow">Jouw eerste stap / Zelf ervaren</p>
      <h2>
        Ervaar het gemak.
        <br />
        <span>Probeer het zelf.</span>
      </h2>
      <p>
        Ontdek wat één systeem voor jouw bedrijf kan betekenen.
        <br />
        Daarna bepalen we samen hoe we verder bouwen.
      </p>
      <div className="h-closing-try">
        <OsEntry />
      </div>
      <TextLink to="/contact?onderwerp=Custom%20OS">
        Het OS geprobeerd? Bespreek jouw Custom OS
      </TextLink>
    </section>
  );
}
export function MiloGuide() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      input.current?.focus();
    } else dialog.current?.close();
  }, [open]);
  const matches = search.trim()
    ? faqs.filter((faq) =>
        `${faq.question} ${faq.answer}`
          .toLocaleLowerCase("nl")
          .includes(search.trim().toLocaleLowerCase("nl")),
      )
    : faqs.slice(0, 3);
  return (
    <>
      <button
        className="h-milo-launcher"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Milo, je wegwijzer op deze website"
      >
        <img src="/proposal/milo/website.webp" alt="" width="70" height="70" />
        <span>
          Kan ik je helpen?
          <MessageCircle size={14} aria-hidden="true" />
        </span>
      </button>
      <dialog
        className="h-milo-dialog"
        ref={dialog}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        aria-labelledby="milo-title"
      >
        <div className="h-milo-top">
          <img
            src="/proposal/milo/website.webp"
            alt="Milo"
            width="64"
            height="64"
          />
          <div>
            <h2 id="milo-title">Hoi, ik ben Milo.</h2>
            <p>Je wegwijzer bij SocialNow.</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Milo sluiten"
          >
            <X size={20} />
          </button>
        </div>
        <p>
          Zoek in de antwoorden over het OS en onze diensten. Liever een mens
          spreken? Ons team helpt je verder.
        </p>
        <label htmlFor="milo-search">Waar wil je meer over weten?</label>
        <input
          ref={input}
          id="milo-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Bijvoorbeeld: website, Odoo of kosten"
        />
        <div className="h-milo-results" aria-live="polite">
          {matches.length ? (
            matches.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <ChevronDown size={16} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))
          ) : (
            <p>Daar heb ik nog geen antwoord op. Stel je vraag aan ons team.</p>
          )}
        </div>
        <Link
          className="h-text-link"
          to="/contact"
          onClick={() => setOpen(false)}
        >
          Praat met het team
          <ArrowRight size={16} />
        </Link>
      </dialog>
    </>
  );
}
