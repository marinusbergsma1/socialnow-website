import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, X, ArrowUpRight } from "lucide-react";
import { openPlanCall } from "./PlanCall";
import "./explainer-player.css";

// 21 oktober 2026 (Marinus): de explainer is twee films. De OS-film staat in de header, de Connect-film in het Connect-blok
// (ConnectExperts.tsx), met eigen poster, cachebuster en een blauwe knop.
export default function ExplainerPlayer({ kind = "explainer", compact = false, ctaLabel }: { kind?: "explainer" | "story" | "connect"; compact?: boolean; ctaLabel?: string }) {
  const story = kind === "story", connect = kind === "connect";
  const movie = story ? "/video/verhaal/story-presentatie.mp4?v=story-short-20261013" : connect ? "/video/connect/socialnow-connect-film.mp4?v=20261021-c1" : "/video/os/socialnow-os-explainer.mp4?v=20261021-v9";
  const poster = story ? "/video/verhaal/story-presentatie-poster.jpg" : connect ? "/video/connect/socialnow-connect-film-poster.jpg?v=20261021-c1" : "/video/os/socialnow-os-explainer-poster.jpg?v=20261021-v9";
  const label = ctaLabel ?? (story ? "Bekijk mijn verhaal" : connect ? "Bekijk de Connect-film" : "Bekijk de explainer");
  const naam = story ? "Ons verhaal" : connect ? "SocialNow Connect-film" : "SocialNow OS explainer";
  const [paused, setPaused] = useState(true);
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
    <button className={`sn-explainer-cover${compact ? " sn-video-compact" : ""}${connect ? " sn-explainer-connect" : ""}`} type="button" onClick={open} aria-label={label}>
      {!compact && <img src={poster} alt="" width="1280" height="720" />}
      <span className={`sn-pill${connect ? " sn-pill-connect" : ""}`}><span>{label}</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></span>
    </button>
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
        <video ref={video} controls playsInline controlsList="nofullscreen" disablePictureInPicture preload="metadata" poster={poster} aria-label={story ? "Ons verhaal" : `${naam} (Engels)`} onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onEnded={() => setPaused(true)}><source src={movie} type="video/mp4" /></video>
        {failed && <button className="sn-pill sn-video-retry" type="button" onClick={() => { setFailed(false); video.current?.load(); video.current?.play().catch(() => setFailed(true)); }}><span>Start de video</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></button>}
      </div>
    </dialog>
  </>;
}
