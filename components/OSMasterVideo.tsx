import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

/**
 * OSMasterVideo — de grote uitlegvideo bovenaan de pagina.
 * Komt stil op gang zodra hij in beeld staat, met een knop om hem met geluid
 * vanaf het begin te bekijken. Engels gesproken, ruim een minuut.
 */

const BASE = import.meta.env.BASE_URL;
const SRC = `${BASE}video/os/os-master-en.mp4?v=2`;
const POSTER = `${BASE}video/os/os-master-en.webp?v=2`;

const OSMasterVideo: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [gestart, setGestart] = useState(false);   // met geluid, door de bezoeker gestart
  const [stil, setStil] = useState(true);

  // Pas laden en stil starten zodra de sectie in beeld komt
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || inView) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '300px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !inView || gestart) return;
    v.muted = true;
    v.play().catch(() => { /* stille voorvertoning mag mislukken */ });
  }, [inView, gestart]);

  const startMetGeluid = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.controls = true;
    setStil(false);
    setGestart(true);
    v.play().catch(() => { v.muted = true; setStil(true); v.play().catch(() => { /* geeft niet */ }); });
  }, []);

  const wisselGeluid = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setStil(v.muted);
  }, []);

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-7 md:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">
              Het hele systeem in ruim een minuut
            </span>
          </div>
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter leading-none mb-3">
            ÉÉN CHAT VOOR <span className="text-[#25D366]">JE HELE BEDRIJF</span>
          </h2>
          <p className="text-gray-500 text-xs md:text-base font-medium max-w-xl mx-auto">
            Je website, CRM, content en advertenties in één gesprek. Engels gesproken.
          </p>
        </div>

        <div ref={wrapRef} className="relative max-w-5xl mx-auto">
          <div
            className="relative overflow-hidden rounded-2xl md:rounded-[1.75rem] bg-[#0b0b0b] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
            style={{ aspectRatio: '16 / 9' }}
          >
            <video
              ref={videoRef}
              src={inView ? SRC : undefined}
              poster={POSTER}
              preload="none"
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Startlaag: verdwijnt zodra de bezoeker met geluid start */}
            {!gestart && (
              <button
                onClick={startMetGeluid}
                aria-label="Bekijk de uitleg met geluid"
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.35))' }}
              >
                <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_16px_44px_rgba(37,211,102,0.35)] transition-transform duration-300 group-hover:scale-110">
                  <Play size={26} className="text-white ml-1" fill="white" />
                </span>
                <span className="text-white text-[11px] md:text-xs font-black uppercase tracking-[0.28em]">
                  Bekijk met geluid
                </span>
              </button>
            )}

            {/* Geluidsknop zodra hij loopt */}
            {gestart && (
              <button
                onClick={wisselGeluid}
                aria-label={stil ? 'Geluid aan' : 'Geluid uit'}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/55 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/75 transition-colors"
              >
                {stil ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            )}
          </div>

          <p className="text-center text-white/25 text-[11px] font-medium mt-4">
            Voorbeeldweergave van het systeem, met verzonnen gegevens.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OSMasterVideo;
