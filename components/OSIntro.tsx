import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';

/**
 * OSIntro — de uitlegvideo als eerste wat je ziet.
 * De pagina staat stil tot de video klaar is of tot je hem wegklikt. Daarna
 * schuift de rest van de site in beeld. Hij is een gewone speler: pauzeren,
 * terugspoelen, opnieuw beginnen en geluid aan of uit, zo vaak je wilt.
 * Vanzelf komt hij één keer per bezoek, daarna via de knop bij de onderdelen.
 */

const BASE = import.meta.env.BASE_URL;
const SRC = `${BASE}video/os/os-master-en.mp4?v=14`;
const POSTER = `${BASE}video/os/os-master-en.webp?v=14`;
const SLEUTEL = 'sn-os-intro';

const klok = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r < 10 ? '0' : ''}${r}`;
};

const OSIntro: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [weg, setWeg] = useState(false);       // aan het uitfaden
  const [stil, setStil] = useState(true);
  const [speelt, setSpeelt] = useState(false);
  const [tijd, setTijd] = useState(0);
  const [duur, setDuur] = useState(0);
  const [sleept, setSleept] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const baanRef = useRef<HTMLDivElement>(null);
  const metGeluidRef = useRef(false);

  const deel = duur > 0 ? Math.min(tijd / duur, 1) : 0;

  // Alleen bij het eerste bezoek van deze sessie, en niet als je met een anker binnenkomt
  useEffect(() => {
    let gezien = false;
    try { gezien = sessionStorage.getItem(SLEUTEL) === 'ja'; } catch { /* privémodus */ }
    const anker = window.location.hash && window.location.hash.length > 1;
    const minderBeweging = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!gezien && !anker && !minderBeweging) setOpen(true);
  }, []);

  // Ergens anders op de pagina kan hij opnieuw geopend worden. Wie daarop klikt
  // heeft de pagina aangeraakt, dus dan mag het geluid meteen aan.
  useEffect(() => {
    const opnieuw = () => {
      metGeluidRef.current = true;
      setWeg(false);
      setStil(false);
      setTijd(0);
      setOpen(true);
    };
    window.addEventListener('sn-intro-open', opnieuw);
    return () => window.removeEventListener('sn-intro-open', opnieuw);
  }, []);

  const sluiten = useCallback(() => {
    try { sessionStorage.setItem(SLEUTEL, 'ja'); } catch { /* privémodus */ }
    window.dispatchEvent(new Event('sn-intro-done'));
    setWeg(true);
    const v = videoRef.current;
    if (v) { v.pause(); try { v.currentTime = 0; } catch { /* geeft niet */ } }
    window.setTimeout(() => setOpen(false), 420);
  }, []);

  // Zolang hij open staat: geen scroll, geen sprong in de pagina
  useEffect(() => {
    if (!open) return;
    const vorigeOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    const tegenhouden = (e: Event) => { e.preventDefault(); };
    window.addEventListener('wheel', tegenhouden, { passive: false });
    window.addEventListener('touchmove', tegenhouden, { passive: false });
    return () => {
      document.body.style.overflow = vorigeOverflow;
      window.removeEventListener('wheel', tegenhouden);
      window.removeEventListener('touchmove', tegenhouden);
    };
  }, [open]);

  // Elke keer dat hij opengaat begint hij bij nul.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !open) return;
    try { v.currentTime = 0; } catch { /* nog niet klaar met laden */ }
    setTijd(0);
    v.muted = !metGeluidRef.current;
    setStil(v.muted);
    v.play().catch(() => {
      v.muted = true;
      setStil(true);
      v.play().catch(() => { /* geeft niet, dan staat de poster er */ });
    });
  }, [open]);

  const spelenOfPauze = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => { /* geeft niet */ });
    else v.pause();
  }, []);

  const vanafBegin = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setTijd(0);
    v.play().catch(() => { /* geeft niet */ });
  }, []);

  const geluid = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const nieuw = !v.muted;
    v.muted = nieuw;
    setStil(nieuw);
    if (!nieuw) metGeluidRef.current = true;
    if (v.paused) v.play().catch(() => { /* geeft niet */ });
  }, []);

  // Slepen over de balk om terug of vooruit te gaan
  const naarPunt = useCallback((klientX: number) => {
    const baan = baanRef.current;
    const v = videoRef.current;
    if (!baan || !v || !v.duration) return;
    const r = baan.getBoundingClientRect();
    const f = Math.min(Math.max((klientX - r.left) / r.width, 0), 1);
    v.currentTime = f * v.duration;
    setTijd(v.currentTime);
  }, []);

  useEffect(() => {
    if (!sleept) return;
    const beweeg = (e: PointerEvent) => naarPunt(e.clientX);
    const los = () => setSleept(false);
    window.addEventListener('pointermove', beweeg);
    window.addEventListener('pointerup', los);
    window.addEventListener('pointercancel', los);
    return () => {
      window.removeEventListener('pointermove', beweeg);
      window.removeEventListener('pointerup', los);
      window.removeEventListener('pointercancel', los);
    };
  }, [sleept, naarPunt]);

  // Toetsen: spatie pauzeert, pijltjes springen tien tellen, esc sluit
  useEffect(() => {
    if (!open) return;
    const opToets = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (e.key === 'Escape') { sluiten(); return; }
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); spelenOfPauze(); return; }
      if (!v) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); v.currentTime = Math.min(v.currentTime + 10, v.duration || 0); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); v.currentTime = Math.max(v.currentTime - 10, 0); }
      if (e.key === 'm') { geluid(); }
    };
    window.addEventListener('keydown', opToets);
    return () => window.removeEventListener('keydown', opToets);
  }, [open, sluiten, spelenOfPauze, geluid]);

  if (!open) return null;

  const knop = 'w-10 h-10 rounded-full border border-white/15 bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.12] flex items-center justify-center transition-colors';

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

      <button
        onClick={sluiten}
        className="absolute top-5 right-5 md:top-7 md:right-8 z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.12] transition-colors text-[11px] font-black uppercase tracking-[0.24em]"
        aria-label="Overslaan en naar de site"
      >
        Overslaan
        <X size={15} />
      </button>

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
            onLoadedMetadata={(e) => setDuur(e.currentTarget.duration || 0)}
            onTimeUpdate={(e) => { if (!sleept) setTijd(e.currentTarget.currentTime); }}
            onPlay={() => setSpeelt(true)}
            onPause={() => setSpeelt(false)}
            onEnded={sluiten}
            onClick={spelenOfPauze}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          />

          {/* groot teken als hij stilstaat */}
          {!speelt && (
            <button
              onClick={spelenOfPauze}
              aria-label="Afspelen"
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
            >
              <span className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_10px_40px_rgba(37,211,102,0.45)]">
                <Play size={22} className="text-white ml-1" fill="white" />
              </span>
            </button>
          )}

          {/* bediening onderin */}
          <div className="absolute left-0 right-0 bottom-0 px-3 md:px-5 pb-3 md:pb-4 pt-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
            <div
              ref={baanRef}
              onPointerDown={(e) => { e.preventDefault(); setSleept(true); naarPunt(e.clientX); }}
              role="slider"
              tabIndex={0}
              aria-label="Positie in de video"
              aria-valuemin={0}
              aria-valuemax={Math.round(duur)}
              aria-valuenow={Math.round(tijd)}
              className="group relative h-4 flex items-center cursor-pointer select-none"
            >
              <span className="absolute left-0 right-0 h-[3px] rounded-full bg-white/20" />
              <span className="absolute left-0 h-[3px] rounded-full bg-[#25D366]" style={{ width: `${(deel * 100).toFixed(2)}%` }} />
              <span
                className="absolute w-3 h-3 rounded-full bg-white shadow transition-transform group-hover:scale-125"
                style={{ left: `calc(${(deel * 100).toFixed(2)}% - 6px)` }}
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button onClick={spelenOfPauze} className={knop} aria-label={speelt ? 'Pauze' : 'Afspelen'} title={speelt ? 'Pauze' : 'Afspelen'}>
                {speelt ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
              <button onClick={vanafBegin} className={knop} aria-label="Opnieuw vanaf het begin" title="Opnieuw vanaf het begin">
                <RotateCcw size={16} />
              </button>
              <button
                onClick={geluid}
                className={stil
                  ? 'w-10 h-10 rounded-full border border-[#25D366]/60 bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 flex items-center justify-center transition-colors'
                  : knop}
                aria-label={stil ? 'Geluid aan' : 'Geluid uit'}
                title={stil ? 'Geluid aan' : 'Geluid uit'}
              >
                {stil ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <span className="ml-1 text-white/55 text-[11px] font-bold tabular-nums tracking-wide">
                {klok(tijd)} <span className="text-white/25">/ {klok(duur)}</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-white/35 text-[11px] md:text-xs font-medium mt-4">
          Je kunt hem pauzeren, terugspoelen en opnieuw starten. De site komt in beeld zodra de video klaar is, of eerder als je hem wegklikt.
        </p>
      </div>
    </div>
  ), document.body);
};

export default OSIntro;
