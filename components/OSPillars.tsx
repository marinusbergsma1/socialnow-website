import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Volume2, VolumeX, Play } from 'lucide-react';

/**
 * OSPillars — de vier onderdelen van het SocialNow OS, elk als eigen video.
 * In rust staat de agent van dat onderdeel te werken over een zachte, wazige
 * versie van het beeld. Zodra je erover beweegt gaat de waas eraf en speelt de
 * video scherp af, met geluid zodra de browser dat toestaat. Klik opent hem
 * groot. Er speelt er nooit meer dan één.
 */

const BASE = import.meta.env.BASE_URL;

type Pillar = {
  key: string;
  label: string;
  kort: string;
  agent: string;
  title: string;
  line: string;
  accent: string;
  file: string;
  open: number;
};

const PILLARS: Pillar[] = [
  {
    key: 'website',
    kort: 'Website',
    label: 'Website',
    agent: 'Website agent',
    title: 'Je website',
    line: 'Teksten en pagina’s aanpassen vanuit de chat, direct live.',
    accent: '#25D366',
    file: 'os-website',
    open: 2,
  },
  {
    key: 'crm',
    kort: 'CRM',
    label: 'CRM',
    agent: 'CRM agent',
    title: 'Je CRM',
    line: 'Elke aanvraag komt binnen, niets blijft liggen.',
    accent: '#F7E644',
    file: 'os-crm',
    open: 3,
  },
  {
    key: 'content',
    kort: 'Content',
    label: 'Content',
    agent: 'Content agent',
    title: 'Je content',
    line: 'Van idee naar geplande post, in dezelfde chat.',
    accent: '#00A3E0',
    file: 'os-content',
    open: 2,
  },
  {
    key: 'ads',
    kort: 'Ads',
    label: 'Advertenties',
    agent: 'Advertentie agent',
    title: 'Je advertenties',
    line: 'Campagnes bijsturen op wat de cijfers laten zien.',
    accent: '#F62961',
    file: 'os-advertenties',
    open: 1,
  },
];

// De sprite is één webp met 30 standjes in 6 kolommen en 5 rijen.
const agentStijl = (key: string, maat: number): React.CSSProperties => ({
  backgroundImage: `url(${BASE}images/agents/milo-${key}-sprite.webp)`,
  backgroundSize: `${maat * 6}px ${maat * 5}px`,
  width: maat,
  height: maat,
});

// Browsers laten geluid pas toe nadat de bezoeker iets heeft aangeraakt.
// Vanaf dat moment mag hover ook mét geluid spelen.
let userGestured = false;
const markGesture = () => { userGestured = true; };

const useGestureListener = () => {
  useEffect(() => {
    if (userGestured) return;
    const opts = { once: true, passive: true } as AddEventListenerOptions;
    window.addEventListener('pointerdown', markGesture, opts);
    window.addEventListener('keydown', markGesture, opts);
    window.addEventListener('touchstart', markGesture, opts);
    return () => {
      window.removeEventListener('pointerdown', markGesture);
      window.removeEventListener('keydown', markGesture);
      window.removeEventListener('touchstart', markGesture);
    };
  }, []);
};

/** Het balkje boven een onderdeel: kleur en naam links, de agent rechts. */
const AgentBalk: React.FC<{
  pillar: Pillar;
  aan: boolean;
  onActivate: (key: string | null) => void;
  onOpen: () => void;
}> = ({ pillar, aan, onActivate, onOpen }) => (
  <button
    type="button"
    onMouseEnter={() => onActivate(pillar.key)}
    onMouseLeave={() => onActivate(null)}
    onFocus={() => onActivate(pillar.key)}
    onBlur={() => onActivate(null)}
    onClick={() => { markGesture(); onOpen(); }}
    aria-label={`${pillar.agent}, ${pillar.open} open`}
    className="group relative flex items-stretch gap-0 overflow-hidden rounded-xl border text-left transition-all duration-300"
    style={{
      borderColor: aan ? pillar.accent : `${pillar.accent}33`,
      background: aan
        ? `linear-gradient(90deg, ${pillar.accent}22 0%, ${pillar.accent}0d 55%, rgba(255,255,255,0.02) 100%)`
        : `linear-gradient(90deg, ${pillar.accent}12 0%, rgba(255,255,255,0.02) 60%)`,
      boxShadow: aan ? `0 0 26px ${pillar.accent}22` : 'none',
    }}
  >
    {/* het kleurbalkje */}
    <span
      className="w-[5px] flex-shrink-0 transition-all duration-300"
      style={{ background: pillar.accent, opacity: aan ? 1 : 0.75 }}
    />

    <span className="flex flex-1 items-center gap-2 min-w-0 pl-3 pr-2.5 py-2">
      {/* korte naam van het onderdeel */}
      <span className="min-w-0 leading-tight">
        <span
          className="block text-[10px] md:text-[11px] font-black uppercase tracking-[0.16em] md:tracking-[0.2em] truncate transition-colors duration-300"
          style={{ color: aan ? pillar.accent : `${pillar.accent}cc` }}
        >
          <span className="sm:hidden">{pillar.kort}</span>
          <span className="hidden sm:inline">{pillar.label}</span>
        </span>
        {/* op een telefoon staat de stand onder de naam, daar past geen tweede kolom */}
        <span
          className="sm:hidden mt-0.5 flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.16em] transition-colors duration-300"
          style={{ color: aan ? pillar.accent : 'rgba(255,255,255,0.32)' }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: aan ? pillar.accent : 'rgba(255,255,255,0.3)' }} />
          {aan ? 'Aan het werk' : `${pillar.open} open`}
        </span>
      </span>

      {/* rechts: de agent van dit onderdeel */}
      <span className="ml-auto flex items-center gap-2 flex-shrink-0">
        <span
          className={`sn-agent rounded-full ${aan ? 'sn-agent-speelt' : ''}`}
          style={{
            ...agentStijl(pillar.key, 34),
            backgroundColor: aan ? `${pillar.accent}26` : 'rgba(255,255,255,0.05)',
            boxShadow: aan ? `inset 0 0 0 1px ${pillar.accent}66` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
          }}
          aria-hidden="true"
        />
        <span className="leading-tight hidden sm:block">
          <span className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] text-white/75 whitespace-nowrap">
            {pillar.agent}
          </span>
          <span
            className="flex items-center gap-1 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.16em] whitespace-nowrap transition-colors duration-300"
            style={{ color: aan ? pillar.accent : 'rgba(255,255,255,0.32)' }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: aan ? pillar.accent : 'rgba(255,255,255,0.3)' }}
            />
            {aan ? 'Aan het werk' : `${pillar.open} open`}
          </span>
        </span>
      </span>
    </span>
  </button>
);

const Card: React.FC<{
  pillar: Pillar;
  index: number;
  activeKey: string | null;
  onActivate: (key: string | null) => void;
  onOpen: (index: number) => void;
}> = ({ pillar, index, activeKey, onActivate, onOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isActive = activeKey === pillar.key;
  // De rustlaag blijft liggen tot de video echt loopt. Zo staat er nooit een
  // zwart vlak, ook niet tijdens het laden of vlak na het weghalen van de muis.
  const [speelt, setSpeelt] = useState(false);
  // Houdt bij of deze kaart NU nog aan de beurt is. play() is asynchroon: zonder
  // deze check start een afgebroken poging de video alsnog, en dan lopen er twee
  // tegelijk.
  const wantRef = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    wantRef.current = isActive;
    if (isActive) {
      v.muted = !userGestured;
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          if (!wantRef.current) return;          // muis is alweer weg
          v.muted = true;                        // geluid geweigerd → stil verder
          v.play().catch(() => { /* geeft niet */ });
        });
      }
    } else {
      setSpeelt(false);
      v.pause();
      v.currentTime = 0;
      v.muted = true;
    }
  }, [isActive]);

  return (
    <div
      className="group relative flex-shrink-0 snap-center w-[78vw] sm:w-[46vw] md:w-auto md:flex-1 cursor-pointer"
      onMouseEnter={() => onActivate(pillar.key)}
      onMouseLeave={() => onActivate(null)}
      onClick={() => { markGesture(); onOpen(index); }}
      role="button"
      tabIndex={0}
      aria-label={`${pillar.title} bekijken`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { markGesture(); onOpen(index); } }}
      onFocus={() => onActivate(pillar.key)}
      onBlur={() => onActivate(null)}
    >
      <div
        className="relative w-full overflow-hidden rounded-[1.5rem] bg-black border transition-all duration-500"
        style={{
          aspectRatio: '4 / 5',
          borderColor: isActive ? `${pillar.accent}55` : 'rgba(255,255,255,0.07)',
          boxShadow: isActive
            ? `0 24px 70px rgba(0,0,0,0.55), 0 0 46px ${pillar.accent}22`
            : '0 10px 34px rgba(0,0,0,0.4)',
          transform: isActive ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        <video
          ref={videoRef}
          src={`${BASE}video/os/${pillar.file}.mp4?v=13`}
          poster={`${BASE}video/os/${pillar.file}.webp?v=13`}
          preload="metadata"
          playsInline
          loop
          muted
          onPlaying={() => setSpeelt(true)}
          onPause={() => setSpeelt(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Rustlaag: het beeld zacht in de waas, met de agent er bovenop aan het
            werk. Zodra de video loopt fade de hele laag weg en is hij scherp. */}
        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{ opacity: speelt ? 0 : 1 }}
        >
          {/* scherp stilstaand beeld, ligt eronder */}
          <img
            src={`${BASE}video/os/${pillar.file}.webp?v=13`}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* zelfde beeld in de waas: verdwijnt meteen bij aanraken, dus het voelt
              direct, ook al moet de video nog even laden */}
          <img
            src={`${BASE}video/os/${pillar.file}.webp?v=13`}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{
              filter: 'blur(7px) saturate(1.02) brightness(0.92)',
              transform: 'scale(1.09)',
              opacity: isActive ? 0 : 1,
            }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: isActive ? 0 : 1,
              background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.42) 46%, rgba(0,0,0,0.30) 100%), radial-gradient(ellipse at 50% 45%, ${pillar.accent}26 0%, transparent 62%)`,
            }}
          />

          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center transition-opacity duration-300"
            style={{ opacity: isActive ? 0 : 1 }}
          >
            <span
              className={`sn-agent ${isActive ? '' : 'sn-agent-speelt'}`}
              style={{
                ...agentStijl(pillar.key, 132),
                filter: `drop-shadow(0 16px 34px rgba(0,0,0,0.6)) drop-shadow(0 0 26px ${pillar.accent}33)`,
              }}
              aria-hidden="true"
            />
            <span
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]"
              style={{
                borderColor: `${pillar.accent}66`,
                background: `${pillar.accent}1a`,
                color: '#ffffff',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: pillar.accent }} />
              {pillar.agent}
            </span>
            <span className="mt-2.5 inline-flex items-center gap-1.5 text-white/45 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">
              <Play size={10} fill="currentColor" />
              Bekijk hoe hij werkt
            </span>
          </div>
        </div>

        {/* Geluidshint zodra de video loopt */}
        <div
          className="absolute top-4 right-4 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: isActive ? 1 : 0 }}
        >
          <span className="w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center border border-white/15">
            {userGestured ? <Volume2 size={15} className="text-white" /> : <VolumeX size={15} className="text-white/70" />}
          </span>
        </div>
      </div>

      {/* Tekst onder de kaart: nooit over het beeld heen */}
      <div className="pt-3 md:pt-4">
        <span
          className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.28em] mb-1.5"
          style={{ color: pillar.accent }}
        >
          {pillar.label}
        </span>
        <h3 className="text-white font-black uppercase tracking-tight text-base md:text-lg leading-none">{pillar.title}</h3>
        <p className="text-white/45 text-[12px] md:text-[13px] font-medium mt-1.5 leading-snug">{pillar.line}</p>
      </div>
    </div>
  );
};

const Lightbox: React.FC<{ index: number; onClose: () => void; onNav: (d: 1 | -1) => void }> = ({ index, onClose, onNav }) => {
  const pillar = PILLARS[index];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNav(1);
      else if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose, onNav]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    v.play().catch(() => { v.muted = true; setMuted(true); v.play().catch(() => { /* geeft niet */ }); });
  }, [index, muted]);

  if (!pillar) return null;

  return createPortal((
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={pillar.title}
    >
      <button onClick={onClose} aria-label="Sluiten" className="fixed top-4 right-4 z-[140] p-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
        <X size={26} />
      </button>

      <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <video
          key={pillar.key}
          ref={videoRef}
          src={`${BASE}video/os/${pillar.file}.mp4?v=13`}
          poster={`${BASE}video/os/${pillar.file}.webp?v=13`}
          playsInline
          loop
          controls
          className="max-h-[74vh] w-auto rounded-2xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.7)] bg-black"
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setMuted((m) => !m)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.07] border border-white/10 text-white/80 hover:text-white hover:bg-white/[0.12] transition-colors text-xs font-bold uppercase tracking-widest"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {muted ? 'Geluid aan' : 'Geluid uit'}
          </button>
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{pillar.title}</span>
        </div>
      </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {PILLARS.map((p, i) => (
          <span key={p.key} className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-6' : 'w-1.5 bg-white/30'}`} style={i === index ? { background: p.accent } : undefined} />
        ))}
      </div>
    </div>
  ), document.body);
};

const OSPillars: React.FC = () => {
  useGestureListener();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const handleOpen = useCallback((i: number) => setOpen(i), []);

  return (
    <section className="relative py-14 md:py-24 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">Je agents aan het werk</span>
          </div>
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter leading-none mb-3">
            VIER AGENTS, <span className="text-[#25D366]">ÉÉN CHAT</span>
          </h2>
          <p className="text-gray-500 text-xs md:text-base font-medium max-w-xl mx-auto">
            Vier agents die voor je werken. Beweeg over een onderdeel en je hoort en ziet hoe zo'n voorstel tot stand komt.
          </p>
          <button
            onClick={() => window.dispatchEvent(new Event('sn-intro-open'))}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/12 bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.10] transition-colors text-[10px] md:text-[11px] font-black uppercase tracking-[0.24em]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            Bekijk de uitleg opnieuw
          </button>
        </div>

        {/* De vier agents boven de onderdelen: elk onderdeel zijn eigen kleur links
            en zijn eigen agent rechts. De agent van de kaart waar je overheen
            beweegt gaat aan het werk, precies zoals in het systeem zelf. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
          {PILLARS.map((p, i) => (
            <AgentBalk
              key={`agent-${p.key}`}
              pillar={p}
              aan={activeKey === p.key}
              onActivate={setActiveKey}
              onOpen={() => handleOpen(i)}
            />
          ))}
        </div>

        <div className="flex gap-3 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
          {PILLARS.map((p, i) => (
            <Card key={p.key} pillar={p} index={i} activeKey={activeKey} onActivate={setActiveKey} onOpen={handleOpen} />
          ))}
        </div>

        <p className="text-center text-white/25 text-[11px] font-medium mt-6">
          Voorbeeldweergave van het systeem, met verzonnen gegevens.
        </p>
      </div>

      {open !== null && (
        <Lightbox
          index={open}
          onClose={() => setOpen(null)}
          onNav={(d) => setOpen((cur) => (cur === null ? cur : (cur + d + PILLARS.length) % PILLARS.length))}
        />
      )}
    </section>
  );
};

export default OSPillars;
