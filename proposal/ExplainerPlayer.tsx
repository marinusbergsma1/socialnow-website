import React, { useEffect, useRef, useState } from "react";
import { Play, X, ArrowUpRight } from "lucide-react";
import "./explainer-player.css";

const movie = "/video/os/socialnow-os-explainer.mp4?v=20261012-player2";
export default function ExplainerPlayer() {
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
    <button className="sn-explainer-cover" type="button" onClick={open} aria-label="Bekijk de explainer">
      <img src="/video/os/socialnow-os-explainer-poster.jpg" alt="" width="1280" height="720" />
      <span><Play size={20} aria-hidden="true" />Bekijk de explainer</span>
    </button>
    <dialog className="sn-video-dialog" ref={dialog} onClose={restore} aria-label="SocialNow OS explainer" onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      <div className="sn-video-shell">
        <header className="sn-video-toolbar">
          <button className="sn-video-close" type="button" aria-label="Video sluiten" onClick={() => dialog.current?.close()}><X size={24} aria-hidden="true" /></button>
          <a className="sn-video-try" href="https://app.socialnow.nl/login/" translate="no">Try it yourself<span><ArrowUpRight size={21} aria-hidden="true" /></span></a>
        </header>
        <video ref={video} controls playsInline controlsList="nofullscreen" disablePictureInPicture preload="metadata" poster="/video/os/socialnow-os-explainer-poster.jpg" aria-label="SocialNow OS explainer (Engels)"><source src={movie} type="video/mp4" /></video>
        {failed && <button className="sn-video-retry" type="button" onClick={() => { setFailed(false); video.current?.load(); video.current?.play().catch(() => setFailed(true)); }}>Start de video</button>}
      </div>
    </dialog>
  </>;
}
