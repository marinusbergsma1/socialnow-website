import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX, X } from 'lucide-react';

/**
 * OSIntro — de uitlegvideo als eerste wat je ziet.
 * De pagina staat stil tot de video klaar is of tot je hem wegklikt. Daarna
 * schuift de rest van de site in beeld. Per bezoek wordt hij één keer getoond.
 */

const BASE = import.meta.env.BASE_URL;
const SRC = `${BASE}video/os/os-master-en.mp4?v=12`;
const POSTER = `${BASE}video/os/os-master-en.webp?v=12`;
const SLEUTEL = 'sn-os-intro';

const OSIntro: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [weg, setWeg] = useState(false);       // aan het uitfaden
  const [stil, setStil] = useState(true);
  const [deel, setDeel] = useState(0);         // 0 tot 1, hoever de video is
  const videoRef = useRef<HTMLVideoElement>(null);

  // Alleen bij het eerste bezoek van deze sessie, en niet als je met een anker binnenkomt
  useEffect(() => {
    let gezien = false;
    try { gezien = sessionStorage.getItem(SLEUTEL) === 'ja'; } catch { /* privémodus */ }
    const anker = window.location.hash && window.location.hash.length > 1;
    const kleinScherm = window.matchMedia('(max-width: 640px)').matches;
    const minderBeweging = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!gezien && !anker && !minderBeweging) {
      setOpen(true);
      // op een telefoon start hij ook, maar dan zonder het grote kader
      void kleinScherm;
    }
  }, []);

  // Ergens anders op de pagina kan hij opnieuw geopend worden
  useEffect(() => {
    const opnieuw = () => {
      setWeg(false);
      setStil(true);
      setDeel(0);
      setOpen(true);
      window.setTimeout(() => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = 0;
        v.muted = true;
        v.play().catch(() => { /* geeft niet */ });
      }, 40);
    };
    window.addEventListener('sn-intro-open', opnieuw);
    return () => window.removeEventListener('sn-intro-open', opnieuw);
  }, []);

  // Zolang hij open staat: geen scroll, geen sprong in de pagina
  useEffect(() => {
    if (!open) return;
    const vorigeOverflow = document.body.style.overflow;
    const vorigePos = window.scrollY;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    const tegenhouden = (e: Event) => { e.preventDefault(); };
    const opToets = (e: KeyboardEvent) => { if (e.key === 'Escape') sluiten(); };
    window.addEventListener('wheel', tegenhouden, { passive: false });
    window.addEventListener('touchmove', tegenhouden, { passive: false });
    window.addEventListener('keydown', opToets);
    return () => {
      document.body.style.overflow = vorigeOverflow;
      window.removeEventListener('wheel', tegenhouden);
      window.removeEventListener('touchmove', tegenhouden);
      window.removeEventListener('keydown', opToets);
      void vorigePos;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Stil starten mag altijd, met geluid pas na een aanraking
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !open) return;
    v.muted = true;
    v.play().catch(() => { /* geeft niet, dan staat de poster er */ });
  }, [open]);

  const sluiten = useCallback(() => {
    try { sessionStorage.setItem(SLEUTEL, 'ja'); } catch { /* privémodus */ }
    window.dispatchEvent(new Event('sn-intro-done'));
    setWeg(true);
    const v = videoRef.current;
    if (v) v.pause();
    window.setTimeout(() => setOpen(false), 420);
  }, []);

  const geluidAan = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setStil(false);
    v.play().catch(() => { v.muted = true; setStil(true); });
  }, []);

  if (!open) return null;

  return createPortal((
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black px-4 transition-opacity duration-[420ms]"
      style={{ opacity: weg ? 0 : 1 }}
      role="dialog"
      aria-modal="true"
      aria-label="SocialNow OS in het kort"
    >
      {/* rustige gloed op de achtergrond */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(37,211,102,0.10), transparent 62%)' }}
      />

      <div className="absolute top-5 right-5 md:top-7 md:right-8 z-10 flex items-center gap-2">
        <button
          onClick={stil ? geluidAan : () => { const v = videoRef.current; if (!v) return; v.muted = true; setStil(true); }}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
            stil
              ? 'border-[#25D366]/60 bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25'
              : 'border-white/15 bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.12]'
          }`}
          aria-label={stil ? 'Geluid aan' : 'Geluid uit'}
          title={stil ? 'Geluid aan' : 'Geluid uit'}
        >
          {stil ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          onClick={sluiten}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.12] transition-colors text-[11px] font-black uppercase tracking-[0.24em]"
          aria-label="Overslaan en naar de site"
        >
          Overslaan
          <X size={15} />
        </button>
      </div>

      <div className="relative w-full max-w-[1180px]">
        <div className="text-center mb-4 md:mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.10] text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            Eerst even dit, één minuut
          </span>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl md:rounded-[1.75rem] bg-[#050505] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
          style={{ aspectRatio: '16 / 9' }}
        >
          <video
            ref={videoRef}
            src={SRC}
            poster={POSTER}
            playsInline
            muted
            preload="auto"
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setDeel(v.currentTime / v.duration);
            }}
            onEnded={sluiten}
            onClick={stil ? geluidAan : undefined}
            className={`absolute inset-0 w-full h-full object-cover ${stil ? 'cursor-pointer' : ''}`}
          />

          {/* voortgang */}
          <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-white/10">
            <div className="h-full bg-[#25D366] transition-[width] duration-200" style={{ width: `${(deel * 100).toFixed(1)}%` }} />
          </div>
        </div>

        <p className="text-center text-white/35 text-[11px] md:text-xs font-medium mt-4">
          De site komt in beeld zodra de video klaar is, of eerder als je hem wegklikt.
        </p>
      </div>
    </div>
  ), document.body);
};

export default OSIntro;
