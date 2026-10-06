import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CONTACT_MAIL, heeftWhatsApp, mailLink, whatsappLink } from "./aanvragen";
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
import OsEntry, { CLAIM_URL, GRATIS_OS_URL } from "./os-entry";
import { MiloMotion, miloPoster, type MiloMaat } from "./motion";
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
  const className = `sn-btn3d h-button${secondary ? " h-button-secondary" : ""}${href === CLAIM_URL || href === GRATIS_OS_URL ? " h-try-button" : ""}`;
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
export function MiloPortrait({ role, name, maat }: { role: string; name: string; maat?: MiloMaat }) {
  return (
    <Link
      to={`/het-os#${role}`}
      className="h-agent-visual"
      aria-label={`Ontdek ${name}`}
    >
      <MiloMotion role={role} name={name} maat={maat} />
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
// 28 september 2026 (Marinus, het verhaal): eerst het gratis OS, daarna het OS op maat vanaf €10.000.
export function ConversionBridge() {
  return (
    <div className="h-conversion">
      <div>
        <p className="h-eyebrow">Eerst gratis. Daarna op maat.</p>
        <h3>Begin met je gratis OS.</h3>
        <p>
          Koppel je website, social media en Odoo in één OS. Wil je het rond
          je eigen processen? Dan bouwen we je OS op maat, vanaf €10.000.
        </p>
      </div>
      <div className="h-poc-actions">
        <Action href={GRATIS_OS_URL}>Probeer het OS gratis</Action>
        <TextLink to="/contact?onderwerp=OS%20op%20maat">
          Al geprobeerd? Bespreek je OS op maat
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
export function TeamGrid({ short = false, members = people, expert = true }: { short?: boolean; members?: typeof people; expert?: boolean }) {
  return (
    <div className="h-people-grid">
      {(short ? members.slice(0, 4) : members).map((person) => (
        <figure key={person.name}>
          <div className="h-portrait">
            <img
              src={`/images/${person.image}`}
              className={person.name === "Sergio Jovovic" ? "is-sergio" : undefined}
              alt={person.name}
              width="500"
              height="570"
              loading="lazy"
            />
          </div>
          <figcaption>
            {/* 5 oktober 2026 (Marinus): "graag bij iedereen Linkedin doorlink". */}
            <strong>{person.linkedin ? <a className="h-persoon-linkedin" href={person.linkedin} target="_blank" rel="noopener" aria-label={`${person.name} on LinkedIn`}>{person.name} <span className="h-bouwer-in" aria-hidden="true">in</span></a> : person.name}</strong>
            <span>{person.role}</span>
            {/* 5 oktober 2026 (Marinus): Steven (Fincer) is partner vermogensbeheer, geen system expert. */}
            {expert ? <em className="h-system-expert">{person.role.startsWith("New partner") ? "New partner" : "System Expert"}</em> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
export function ClientLogos({ kort = false }: { kort?: boolean }) {
  // 25 september 2026 (Marinus): de merken lopen schermvullend als strook door. De rij staat er zes
  // keer in, zodat de lus ook op een breed scherm naadloos is; alleen de eerste rij is voor schermlezers.
  const rij = (i: number) =>
    logos.map(([src, name, maat]) => (
      <img
        key={`${i}-${src}`}
        src={`/images/${src}`}
        alt={i ? "" : name}
        aria-hidden={i ? true : undefined}
        width="220"
        height="100"
        // 30 september 2026 (Marinus): "Balk altijd door laten gaan, niet zomaar beginnen" en "Universal stond net uit".
        // Lazy logo's in een strook met overflow hidden laadden pas als ze zichtbaar werden (0 van 60 na 5,6 s), dus de
        // balk begon leeg en logo's verschenen los. In de korte balk laden alle tien bestanden meteen (samen ~70 KB).
        loading={kort ? "eager" : "lazy"}
        decoding="async"
        className={src.startsWith("AZ-") || src.includes("AZ-LOGO") || src.startsWith("partners/") ? "h-logo-eigen" : undefined}
        style={maat ? ({ "--logo-maat": String(maat) } as React.CSSProperties) : undefined}
      />
    ));
  return (
    <div className={kort ? "h-clients h-clients-kort" : "h-clients h-wrap"}>
      {kort ? null : <p className="h-eyebrow">Werk gemaakt voor onder meer</p>}
      <div className="h-clients-strook">
        <div className="h-clients-lus">
          {[0, 1, 2, 3, 4, 5].map((i) => rij(i))}
        </div>
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
      {agents.map(agent=><MiloMotion key={agent.id} role={agent.id} name={agent.name} maat={256} />)}
    </div>
    {/* 28 september 2026 (Marinus, het verhaal): alle data in één OS, gratis te proberen, en het persoonlijke contact blijft. */}
    {/* 5 oktober 2026 (Marinus): "Eén operation and management system. Not to automate but to connect." */}
    <h2 id="final-close-title" translate="no">One operation and management system.<br /><span>Not to automate, but to connect.</span></h2>
    {/* 5 oktober 2026 (Marinus): "Human connection powered by Ai technology vind ik nog wel een mooie toevoeging ook." */}
    <p className="h-final-belofte" translate="no">Human connection, powered by AI technology.</p>
    <p>Je website, social media en Odoo op één plek. Gratis te gebruiken, met mensen erachter.</p>
    <OsEntry showProof={false} />
    <TeamTrust />
    <TextLink to="/contact?onderwerp=OS%20op%20maat">Bespreek je OS op maat</TextLink>
    <TextLink to="/contact#partners">Odoo-implementatiepartner? Praat met Michelle</TextLink>
    <div className="h-final-contact"><a href={mailLink()}>{CONTACT_MAIL}</a>{heeftWhatsApp && <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp <MessageCircle size={14} aria-hidden="true" /></a>}</div>
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
const WHATSAPP = whatsappLink();
const MAIL = mailLink();

export type Bericht = {
  van: "milo" | "bezoeker";
  tekst: string;
  links?: { label: string; href: string }[];
  // Waar het antwoord vandaan kwam: het model dat de Worker noemt, of de eigen vragenlijst.
  bron?: string;
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
  return { van: "milo", tekst: t(beste.answer), links: [{ label: t(heeftWhatsApp ? "App Steef" : "Mail Steef"), href: WHATSAPP }] };
}

// 30 september 2026: de vraag aan Milo als losse functie, zodat de zwevende chat en het vragenblok op de homepage
// (MiloVragen) precies hetzelfde antwoorden. Eerst de Worker; werkt die niet, dan de eigen vragenlijst, dan het team.
export async function vraagMilo(heen: Bericht[], language: string, t: (tekst: string) => string): Promise<Bericht> {
  const team = { label: t(heeftWhatsApp ? "App Steef" : "Mail Steef"), href: WHATSAPP };
  try {
    const stop = new AbortController();
    const klok = setTimeout(() => stop.abort(), 20000);
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
    if (res.ok && data?.text) return { van: "milo", tekst: String(data.text), links: [team], bron: data.model ? String(data.model) : undefined };
  } catch {
    // val netjes terug op de eigen vragenlijst
  }
  const uitLijst = uitVragenlijst(heen[heen.length - 1]?.tekst || "", t);
  if (uitLijst) return { ...uitLijst, bron: "vragenlijst" };
  return {
    van: "milo",
    tekst: t("Daar heb ik nog geen antwoord op. Stel je vraag aan ons team."),
    links: [team, { label: CONTACT_MAIL, href: MAIL }],
  };
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
      const definitief = await vraagMilo(heen, language, t);
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
