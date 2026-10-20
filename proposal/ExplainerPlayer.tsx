import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, X, ArrowUpRight } from "lucide-react";
import "./explainer-player.css";

export default function ExplainerPlayer({ kind = "explainer", compact = false, ctaLabel }: { kind?: "explainer" | "story"; compact?: boolean; ctaLabel?: string }) {
  const story = kind === "story";
  const movie = story ? "/video/verhaal/story-presentatie.mp4?v=story-short-20261013" : "/video/os/socialnow-os-explainer.mp4?v=20261020-v8";
  const poster = story ? "/video/verhaal/story-presentatie-poster.jpg" : "/video/os/socialnow-os-explainer-poster.jpg?v=20261020-v8";
  const label = ctaLabel ?? (story ? "Bekijk mijn verhaal" : "Bekijk de explainer");
  const [paused, setPaused] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const overflow = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);
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
    <button className={`sn-explainer-cover${compact ? " sn-video-compact" : ""}`} type="button" onClick={open} aria-label={label}>
      {!compact && <img src={poster} alt="" width="1280" height="720" />}
      <span className="sn-pill"><span>{label}</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></span>
    </button>
    <dialog className="sn-video-dialog" ref={dialog} onClose={restore} aria-label={story ? "Ons verhaal" : "SocialNow OS explainer"} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      <div className="sn-video-shell">
        <header className="sn-video-toolbar">
          <button className="sn-video-close" type="button" aria-label="Video sluiten" onClick={() => dialog.current?.close()}><X size={24} aria-hidden="true" /></button>
          <button className="sn-video-toggle" type="button" onClick={() => {
            if (video.current?.paused) video.current.play().catch(() => setFailed(true));
            else video.current?.pause();
          }}>
            {paused ? <Play size={20} aria-hidden="true" /> : <Pause size={20} aria-hidden="true" />}{paused ? "Afspelen" : "Pauzeren"}
          </button>
          <a className="sn-pill sn-video-try" href="https://app.socialnow.nl/login/" translate="no"><span>Try it yourself</span><span className="h-button-icon"><ArrowUpRight size={21} aria-hidden="true" /></span></a>
        </header>
        <video ref={video} controls playsInline controlsList="nofullscreen" disablePictureInPicture preload="metadata" poster={poster} aria-label={story ? "Ons verhaal" : "SocialNow OS explainer (Engels)"} onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onEnded={() => setPaused(true)}><source src={movie} type="video/mp4" /></video>
        {failed && <button className="sn-pill sn-video-retry" type="button" onClick={() => { setFailed(false); video.current?.load(); video.current?.play().catch(() => setFailed(true)); }}><span>Start de video</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></button>}
      </div>
    </dialog>
  </>;
}
