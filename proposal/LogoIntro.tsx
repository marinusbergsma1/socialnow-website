import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

export default function LogoIntro() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const close = useCallback(() => {
    video.current?.pause();
    setOpen(false);
    try {
      sessionStorage.setItem("sn-preview-logo-v5", "seen");
    } catch {
      /* Private mode */
    }
  }, [location.pathname, location.hash]);
  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    let seen = false;
    try {
      seen = sessionStorage.getItem("sn-preview-logo-v5") === "seen";
    } catch {
      /* Private mode */
    }
    if (
      !seen &&
      location.pathname === "/" &&
      !location.hash &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      setOpen(true);
    const replay = () => setOpen(true);
    window.addEventListener("sn-preview-logo-replay", replay);
    return () => window.removeEventListener("sn-preview-logo-replay", replay);
  }, []);
  useEffect(() => {
    if (!open) {
      dialog.current?.close();
      return;
    }
    const oldOverflow = document.body.style.overflow;
    dialog.current?.showModal();
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
          src={`/video/header-intro${mobile ? "-mobile" : ""}.mp4?v=10`}
          muted
          playsInline
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
