import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  X,
  MessageCircle,
} from "lucide-react";
import { agents, faqs, logos, people } from "./content";
import TeamTrust from "./TeamTrust";
import OsEntry, { CLAIM_URL } from "./os-entry";
import { MiloMotion, miloPoster } from "./motion";
import type { Project } from "../types";
import { useLanguage } from "./i18n/context";

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
      aria-label="Website, CRM, content en advertenties in SocialNow OS"
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
          Je website, CRM, content en advertenties in één omgeving.
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
        {logos.map(([src, name, maat]) => (
          <img
            key={src}
            src={`/images/${src}`}
            alt={name}
            width="220"
            height="100"
            loading="lazy"
            style={maat ? ({ "--logo-maat": String(maat) } as React.CSSProperties) : undefined}
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
  return <section className="h-final-close" aria-labelledby="final-close-title">
    <img className="h-final-logo" src="/images/SocialNow-OS-Komen-Consultancy.webp" alt="SocialNow OS in samenwerking met Komen Consultancy" width="640" height="180" loading="lazy" />
    <div className="h-final-characters">
      {agents.map(agent=><MiloMotion key={agent.id} role={agent.id} name={agent.name} />)}
    </div>
    <h2 id="final-close-title">Ervaar het gemak.<br /><span>Probeer het zelf.</span></h2>
    <p>Je website, CRM, content en advertenties. In één chat.</p>
    <OsEntry showProof={false} />
    <TeamTrust />
    <TextLink to="/contact?onderwerp=Custom%20OS">Samen verder met jouw Custom OS</TextLink>
    <div className="h-final-contact"><a href="mailto:info@socialnow.nl">info@socialnow.nl</a><a href="https://wa.me/31637404577" target="_blank" rel="noopener noreferrer">WhatsApp <MessageCircle size={14} aria-hidden="true" /></a></div>
  </section>;
}
// Woorden die in elke vraag voorkomen en dus niets onderscheiden.
const STOPWOORDEN = new Set([
  "aan", "als", "bij", "dat", "de", "een", "en", "het", "hoe", "ik", "iets",
  "is", "je", "kan", "kun", "mijn", "met", "moet", "van", "voor", "waar",
  "wat", "welke", "wil", "zelf",
  "a", "about", "an", "and", "any", "are", "can", "do", "does", "for", "how",
  "i", "is", "it", "me", "my", "of", "the", "to", "what", "when", "where",
  "which", "you", "your",
]);

// Wat een bezoeker typt en wat er in de antwoorden staat, is zelden hetzelfde
// woord. Links het getypte woord, rechts waar het ook op mag aanslaan.
const SYNONIEMEN: Record<string, string[]> = {
  pricing: ["kosten", "cost"],
  price: ["kosten", "cost"],
  prices: ["kosten", "cost"],
  cost: ["kosten"],
  costs: ["kosten"],
  budget: ["kosten", "cost"],
  prijs: ["kosten", "cost"],
  prijzen: ["kosten", "cost"],
  tarief: ["kosten", "cost"],
  kosten: ["cost"],
  euro: ["kosten", "cost"],
  begin: ["start"],
  beginnen: ["start"],
  start: ["begin"],
  starten: ["begin"],
  ads: ["advertenties", "advertising"],
  advertising: ["advertenties"],
  advertenties: ["advertising", "ads"],
  install: ["installeer", "installeren"],
  installeren: ["install", "installeer"],
  site: ["website"],
  webshop: ["website"],
};

// De losse, betekenisvolle woorden uit een zin, plus hun synoniemen.
function zoekwoorden(zin: string): string[][] {
  return zin
    .toLocaleLowerCase("nl")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((woord) => woord.length > 1 && !STOPWOORDEN.has(woord))
    .map((woord) => [woord, ...(SYNONIEMEN[woord] ?? [])]);
}


// De Worker die met Gemini praat. Deze URL is niet geheim; de Google-sleutel
// staat uitsluitend als secret in de Worker zelf en komt nooit in de browser.
// Zie worker/README.md.
const MILO_API = "https://milo-chat.socialnow-marinus.workers.dev";
const WHATSAPP = "https://wa.me/31637404577";
const MAIL = "mailto:info@socialnow.nl";

type Bericht = {
  van: "milo" | "bezoeker";
  tekst: string;
  links?: { label: string; href: string }[];
};

// Antwoord uit de eigen vragenlijst. Dit is het vangnet: werkt de Worker niet,
// dan blijft Milo alsnog antwoorden in plaats van er stil bij te staan.
function uitVragenlijst(vraag: string, t: (tekst: string) => string): Bericht | null {
  const woorden = zoekwoorden(vraag);
  if (!woorden.length) return null;
  let beste: (typeof faqs)[number] | null = null;
  let besteScore = 0;
  for (const faq of faqs) {
    const tekst =
      `${faq.question} ${faq.answer} ${t(faq.question)} ${t(faq.answer)}`.toLocaleLowerCase("nl");
    const raak = woorden.filter((varianten) =>
      varianten.some((woord) => tekst.includes(woord)),
    ).length;
    if (raak > besteScore) {
      besteScore = raak;
      beste = faq;
    }
  }
  if (!beste) return null;
  return { van: "milo", tekst: t(beste.answer), links: [{ label: t("App Marinus"), href: WHATSAPP }] };
}

export function MiloGuide() {
  const [open, setOpen] = useState(false);
  const [vraag, setVraag] = useState("");
  const [denkt, setDenkt] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const lijst = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  const groet = t(
    "Hoi, ik ben Milo. Vraag me alles over het OS, onze diensten of hoe we samen verder gaan.",
  );
  const [berichten, setBerichten] = useState<Bericht[]>([]);
  // Het gesprek begint leeg en krijgt de groet in de taal van de bezoeker.
  // Wisselt hij van taal, dan wisselt een nog ongestart gesprek mee.
  const gesprek = berichten.length ? berichten : [{ van: "milo" as const, tekst: groet }];

  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      input.current?.focus();
    } else dialog.current?.close();
  }, [open]);

  useEffect(() => {
    lijst.current?.scrollTo({ top: lijst.current.scrollHeight, behavior: "smooth" });
  }, [berichten, denkt]);

  const stel = useCallback(
    async (ruw: string) => {
      const q = ruw.trim();
      if (!q || denkt) return;
      const heen: Bericht[] = [...gesprek, { van: "bezoeker", tekst: q }];
      setBerichten(heen);
      setVraag("");
      setDenkt(true);
      let antwoord: Bericht | null = null;
      try {
        const stop = new AbortController();
        const klok = setTimeout(() => stop.abort(), 15000);
        const res = await fetch(MILO_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language,
            messages: heen.map((b) => ({ role: b.van === "bezoeker" ? "user" : "milo", text: b.tekst })),
          }),
          signal: stop.signal,
        });
        clearTimeout(klok);
        const data = await res.json().catch(() => null);
        if (res.ok && data?.text) {
          antwoord = {
            van: "milo",
            tekst: String(data.text),
            links: [{ label: t("App Marinus"), href: WHATSAPP }],
          };
        }
      } catch {
        antwoord = null; // val netjes terug op de eigen vragenlijst
      }
      const definitief: Bericht = antwoord ||
        uitVragenlijst(q, t) || {
          van: "milo",
          tekst: t("Daar heb ik nog geen antwoord op. Stel je vraag aan ons team."),
          links: [
            { label: t("App Marinus"), href: WHATSAPP },
            { label: "info@socialnow.nl", href: MAIL },
          ],
        };
      setDenkt(false);
      setBerichten([...heen, definitief]);
    },
    [gesprek, denkt, language, t],
  );

  const suggesties = faqs.slice(0, 3).map((faq) => faq.question);

  return (
    <>
      <button
        className="h-milo-launcher"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open de SocialNow-hulp"
      >
        <img src="/proposal/milo/website.webp" alt="" width="70" height="70" />
        <span>
          Kan ik je helpen?
          <MessageCircle size={14} aria-hidden="true" />
        </span>
      </button>
      <dialog
        className="h-milo-dialog h-milo-gesprek"
        ref={dialog}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        aria-labelledby="milo-title"
      >
        <div className="h-milo-top">
          <img src="/proposal/milo/website.webp" alt="SocialNow" width="64" height="64" />
          <div>
            <h2 id="milo-title">Waar kunnen we je mee helpen?</h2>
            <p>Je wegwijzer bij SocialNow.</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Hulp sluiten">
            <X size={20} />
          </button>
        </div>

        <div className="h-milo-gesprekslijst" ref={lijst} aria-live="polite" translate="no">
          {gesprek.map((bericht, i) => (
            <div
              key={i}
              className={bericht.van === "bezoeker" ? "h-milo-bericht is-bezoeker" : "h-milo-bericht"}
            >
              <p>{bericht.tekst}</p>
              {bericht.links && (
                <div className="h-milo-links">
                  {bericht.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {denkt && (
            <div className="h-milo-bericht h-milo-denkt">
              <i />
              <i />
              <i />
            </div>
          )}
        </div>

        {berichten.length === 0 && !denkt && (
          <div className="h-milo-suggesties" translate="no">
            {suggesties.map((suggestie) => (
              <button key={suggestie} type="button" onClick={() => stel(t(suggestie))}>
                {t(suggestie)}
              </button>
            ))}
          </div>
        )}

        <form
          className="h-milo-composer"
          onSubmit={(event) => {
            event.preventDefault();
            stel(vraag);
          }}
        >
          <label className="sr-only" htmlFor="milo-search">
            Stel je vraag aan Milo
          </label>
          <input
            ref={input}
            id="milo-search"
            type="text"
            autoComplete="off"
            maxLength={500}
            value={vraag}
            onChange={(event) => setVraag(event.target.value)}
            placeholder="Bijvoorbeeld: wat kost een Custom OS?"
          />
          <button type="submit" disabled={!vraag.trim() || denkt} aria-label="Versturen">
            <ArrowUp size={18} />
          </button>
        </form>

        <p className="h-milo-voetnoot">
          Milo kan fouten maken.{" "}
          <Link to="/contact" onClick={() => setOpen(false)}>
            Praat met het team
          </Link>
        </p>
      </dialog>
    </>
  );
}
