import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

const SLEUTEL = "sn-preview-logo-v5";
const VIDEO_VERSIE = 11;

function gezien(): boolean {
  try {
    return sessionStorage.getItem(SLEUTEL) === "seen";
  } catch {
    return false; /* Private mode */
  }
}

/* 9 september 2026 (Marinus): geen frame van de site vóór de intro en zo min mogelijk zwart ervoor.
   De beslissing valt daarom bij de eerste render (niet in een effect na het tekenen), het dialoog
   opent in een layout-effect vóór de eerste tekenbeurt, en de video staat vanaf de eerste render
   in de DOM zodat hij meteen begint te laden; index.html laadt hem bovendien al vooraf. */
export default function LogoIntro() {
  const location = useLocation();
  const [mobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const [open, setOpen] = useState(
    () =>
      !gezien() &&
      location.pathname === "/" &&
      !location.hash &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const close = useCallback(() => {
    video.current?.pause();
    setOpen(false);
    try {
      sessionStorage.setItem(SLEUTEL, "seen");
    } catch {
      /* Private mode */
    }
  }, []);
  useEffect(() => {
    const replay = () => setOpen(true);
    window.addEventListener("sn-preview-logo-replay", replay);
    return () => window.removeEventListener("sn-preview-logo-replay", replay);
  }, []);
  useLayoutEffect(() => {
    if (!open) {
      dialog.current?.close();
      return;
    }
    const oldOverflow = document.body.style.overflow;
    if (!dialog.current?.open) dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(close, 6000);
    void video.current?.play().catch(close);
    return () => {
      clearTimeout(timer);
      video.current?.pause();
      document.body.style.overflow = oldOverflow;
    };
  }, [open, close]);
  return (
    <dialog
      className="h-logo-intro"
      ref={dialog}
      onCancel={close}
      aria-label="SocialNow logo-animatie"
      onClick={close}
    >
      {open && (
        <video
          ref={video}
          src={`/video/header-intro${mobile ? "-mobile" : ""}.mp4?v=${VIDEO_VERSIE}`}
          muted
          playsInline
          autoPlay
          preload="auto"
          onEnded={close}
          onError={close}
          aria-hidden="true"
        />
      )}
      <button type="button" onClick={close} autoFocus>
        Overslaan
        <X size={16} />
      </button>
      <p>Tik om over te slaan</p>
    </dialog>
  );
}
