import React, { useEffect, useId, useRef, useState } from "react";
import { Play, Pause, X, ArrowUpRight } from "lucide-react";
import { openPlanCall } from "./PlanCall";
import "./explainer-player.css";

// 21 oktober 2026 (Marinus): de explainer is twee films. De OS-film staat in de header, de Connect-film in het Connect-blok
// (ConnectExperts.tsx), met eigen poster, cachebuster en een blauwe knop.
// 22 oktober 2026 (Marinus): geen filmframe meer als voorbeeldbeeld van de OS-film (water dat in een zwembad spat) maar een
// startbeeld in HTML/CSS dat vertrouwen wekt vóór iemand de film start: donker vlak met een dunne witte rand.
//   Boven: SocialNow OS x Indexworld en SocialNow Connect x Uncanny, zoals de partnerkaarten op de site (PR #125). Marinus wil hier
//   wél de partners; dat gaat op deze plek voor de regel "geen partnerlogo's" van 19 oktober. Het Connect-logo is het logo van de
//   site zonder schuine streep, bijgesneden en in de blauwtint van de site; met 1,02 x de hoogte van het OS-logo is het woord
//   SocialNow in beide even breed en dus even groot (gemeten: woordbreedte/hoogte OS 3,955, Connect 3,889).
//   Midden: de afspeelknop, groot, met daaronder één zin. Onder: Trusted by, eerlijk met de route: AZ en Supperclub direct,
//   Universal, Warner Bros., MOJO, IMAX en Marvel via Crafture (werkervaring Marinus). Bestaande logobestanden, rustig van kleur, optisch even hoog.
// Hetzelfde startbeeld ligt in de speler over de film tot die speelt, dus nergens meer het zwembadframe.
const STARTZIN = "In ruim twee minuten: wat je met het OS doet, wie het bouwt en wat het kost.";
const DIRECT = [
  { naam: "AZ", src: "/images/merken/AZ-LOGO-KLEUR.svg", w: 235, h: 115, kleur: true, maat: 1.15 },
  { naam: "Supperclub", src: "/images/merken/SUPPERCLUB-LOGO.webp", w: 109, h: 120, maat: 1.55 },
];
const VIA_CRAFTURE = [
  { naam: "Universal", src: "/images/merken/UNIVERSAL-LOGO.svg", w: 128, h: 79, maat: 1.55 },
  { naam: "Warner Bros.", src: "/images/merken/WARNER-BROS-LOGO.svg", w: 57, h: 80, maat: 1.3 },
  { naam: "MOJO", src: "/images/merken/MOJO-LOGO.webp", w: 441, h: 120, maat: .8 },
  { naam: "IMAX", src: "/images/merken/IMAX-LOGO.svg", w: 151, h: 33, maat: .7 },
  { naam: "Marvel", src: "/images/merken/MARVEL-LOGO.svg", w: 1000, h: 402, kleur: true, maat: .85 },
];
// Optisch even hoog: vierkante merken iets hoger, brede woordmerken iets lager (zelfde aanpak als de Trusted by-balk in content.ts).
const merk = (m: { naam: string; src: string; w: number; h: number; kleur?: boolean; maat: number }) =>
  <img key={m.naam} className={m.kleur ? "is-kleur" : undefined} src={m.src} alt={m.naam} translate="no" width={m.w} height={m.h} loading="lazy" decoding="async" style={{ "--maat": m.maat } as React.CSSProperties} />;
function Startbeeld({ label, zinId }: { label: string; zinId: string }) {
  return <span className="sn-startbeeld">
    <span className="sn-startbeeld-paren" aria-hidden="true">
      <img className="sn-startbeeld-os" src="/images/merk/socialnow-os-bijgesneden.webp" alt="" width="596" height="88" decoding="async" />
      <X className="sn-startbeeld-x" size={14} aria-hidden="true" />
      <img className="sn-startbeeld-partner is-wit" src="/images/home-header/indexworld.png" alt="" width="725" height="176" decoding="async" />
      <img className="sn-startbeeld-connect" src="/images/merk/socialnow-connect.webp" alt="" width="782" height="88" decoding="async" />
      <X className="sn-startbeeld-x" size={14} aria-hidden="true" />
      <img className="sn-startbeeld-partner" src="/images/home-header/uncanny-op-zwart.svg" alt="" width="1365" height="300" decoding="async" />
    </span>
    <span className="sn-startbeeld-midden">
      <span className="sn-pill sn-startbeeld-knop"><span>{label}</span><span className="h-button-icon"><ArrowUpRight size={20} aria-hidden="true" /></span></span>
      <span className="sn-startbeeld-zin" id={zinId}>{STARTZIN}</span>
    </span>
    <span className="sn-startbeeld-trusted" aria-hidden="true">
      <span className="sn-startbeeld-label" translate="no">Trusted by</span>
      <span className="sn-startbeeld-merken">
        <span className="sn-startbeeld-groep">{DIRECT.map(merk)}</span>
        <span className="sn-startbeeld-groep"><span className="sn-startbeeld-via" translate="no">via Crafture</span>{VIA_CRAFTURE.map(merk)}</span>
      </span>
    </span>
  </span>;
}

export default function ExplainerPlayer({ kind = "explainer", compact = false, ctaLabel }: { kind?: "explainer" | "story" | "connect"; compact?: boolean; ctaLabel?: string }) {
  const story = kind === "story", connect = kind === "connect";
  const movie = story ? "/video/verhaal/story-presentatie.mp4?v=story-short-20261013" : connect ? "/video/connect/socialnow-connect-film.mp4?v=20261021-c2" : "/video/os/socialnow-os-explainer.mp4?v=20261021-os04";
  const poster = story ? "/video/verhaal/story-presentatie-poster.jpg" : connect ? "/video/connect/socialnow-connect-film-poster.jpg?v=20261021-c2" : "/video/os/socialnow-os-explainer-poster.jpg?v=20261021-os04";
  const label = ctaLabel ?? (story ? "Bekijk mijn verhaal" : connect ? "Bekijk de Connect-film" : "Bekijk de explainer");
  const naam = story ? "Ons verhaal" : connect ? "SocialNow Connect-film" : "SocialNow OS explainer";
  const start = kind === "explainer" && !compact;
  const zinId = useId();
  const [paused, setPaused] = useState(true);
  const [started, setStarted] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const overflow = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);
  // 21 oktober 2026: restore ook direct bij sluiten (knop, klik naast de film, Escape); niet elke browser stuurt het close-event.
  const restore = () => {
    video.current?.pause();
    if (overflow.current !== null) { document.body.style.overflow = overflow.current; overflow.current = null; }
  };
  useEffect(() => () => restore(), []);
  const open = () => {
    setFailed(false);
    if (!dialog.current || dialog.current.open) return;
    overflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.showModal();
    video.current?.play().catch(() => setFailed(true));
  };
  return <>
    {start
      ? <button className="sn-explainer-cover sn-explainer-start" type="button" onClick={open} aria-label={label} aria-describedby={zinId}><Startbeeld label={label} zinId={zinId} /></button>
      : <button className={`sn-explainer-cover${compact ? " sn-video-compact" : ""}${connect ? " sn-explainer-connect" : ""}`} type="button" onClick={open} aria-label={label}>
        {!compact && <img src={poster} alt="" width="1280" height="720" />}
        <span className={`sn-pill${connect ? " sn-pill-connect" : ""}`}><span>{label}</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></span>
      </button>}
    <dialog className="sn-video-dialog" ref={dialog} onClose={restore} onCancel={restore} aria-label={naam} onClick={e => { if (e.target === dialog.current) { dialog.current.close(); restore(); } }}>
      <div className="sn-video-shell">
        <header className="sn-video-toolbar">
          <button className="sn-video-close" type="button" aria-label="Video sluiten" onClick={() => { dialog.current?.close(); restore(); }}><X size={24} aria-hidden="true" /></button>
          <button className="sn-video-toggle" type="button" onClick={() => {
            if (video.current?.paused) video.current.play().catch(() => setFailed(true));
            else video.current?.pause();
          }}>
            {paused ? <Play size={20} aria-hidden="true" /> : <Pause size={20} aria-hidden="true" />}{paused ? "Afspelen" : "Pauzeren"}
          </button>
          {connect
            ? <button type="button" className="sn-pill sn-video-try sn-pill-connect" aria-haspopup="dialog" onClick={() => { dialog.current?.close(); restore(); openPlanCall(); }}><span>Plan een call</span><span className="h-button-icon"><ArrowUpRight size={21} aria-hidden="true" /></span></button>
            : <a className="sn-pill sn-video-try" href="https://app.socialnow.nl/login/" translate="no"><span>Try it yourself</span><span className="h-button-icon"><ArrowUpRight size={21} aria-hidden="true" /></span></a>}
        </header>
        <div className="sn-video-stage">
          <video ref={video} controls playsInline controlsList="nofullscreen" disablePictureInPicture preload="metadata" poster={start ? undefined : poster} aria-label={story ? "Ons verhaal" : `${naam} (Engels)`} onPlay={() => { setPaused(false); setStarted(true); }} onPause={() => setPaused(true)} onEnded={() => setPaused(true)}><source src={movie} type="video/mp4" /></video>
          {start && !started && <button className="sn-explainer-cover sn-explainer-start sn-video-startlaag" type="button" aria-label={label} aria-describedby={`${zinId}-speler`} onClick={() => { setFailed(false); video.current?.play().catch(() => setFailed(true)); }}><Startbeeld label={label} zinId={`${zinId}-speler`} /></button>}
        </div>
        {failed && !start && <button className="sn-pill sn-video-retry" type="button" onClick={() => { setFailed(false); video.current?.load(); video.current?.play().catch(() => setFailed(true)); }}><span>Start de video</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></button>}
      </div>
    </dialog>
  </>;
}
