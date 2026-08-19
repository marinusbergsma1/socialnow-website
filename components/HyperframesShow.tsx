import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import GenerateButton from './GenerateButton';

/**
 * HyperframesShow — de header-intro die Milo vervangt.
 * 1. Grote Genereer-knop, daarachter de vier schermen van het OS in ruststand.
 * 2. Klik → in zes seconden schuiven de vier onderdelen één voor één in beeld
 *    (website, CRM, content, advertenties) terwijl de headline woord voor woord
 *    meebouwt, exact op dezelfde plek als de echte hero-h1.
 * 3. Aan het eind schuiven de vier kaarten samen tot één chat: alles in één plek.
 *    Daarna cascadet de hero in en blijft de headline gewoon staan.
 * 1× per sessie; bij reduced-motion direct de hero.
 */

type Phase = 'sleep' | 'playing' | 'done';

const KEY = 'hf-show';
const BASE = import.meta.env.BASE_URL;

const initialPhase = (): Phase => {
  try {
    if (sessionStorage.getItem(KEY) === 'done') return 'done';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'done';
  } catch { /* SSR/privacy mode */ }
  return 'sleep';
};

export const useHyperframesShow = () => {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const finish = useCallback(() => {
    try { sessionStorage.setItem(KEY, 'done'); } catch { /* noop */ }
    setPhase('done');
    // GridBackground wacht op dit signaal voordat de globe start
    window.dispatchEvent(new Event('milo-show-done'));
    window.dispatchEvent(new Event('hyperframes-show-done'));
  }, []);
  return { phase, setPhase, finish };
};

// Woord-beats: elk gekleurd woord licht op zodra zijn kaart in beeld staat.
const LINES: { words: { text: string; t: number; accent: string }[]; green?: boolean }[] = [
  { words: [{ text: 'JE WEBSITE,', t: 1.8, accent: '#FFFFFF' }, { text: 'CRM,', t: 2.4, accent: '#F7E644' }] },
  { words: [{ text: 'CONTENT', t: 3.4, accent: '#00A3E0' }, { text: '& ADS', t: 4.6, accent: '#F62961' }] },
  { words: [{ text: 'IN ÉÉN AI CHAT.', t: 5.6, accent: '#25D366' }], green: true },
];
const ALL_TIMES = LINES.flatMap((l) => l.words.map((w) => w.t)).sort((a, b) => a - b);
const LINE_CLASS = 'block text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5.5rem]';

const DUUR = 6.6;

// De vier schermen. `t` is het moment waarop de kaart in beeld schuift.
const FRAMES = [
  { key: 'website', file: 'os-website', label: 'Website', accent: '#25D366', t: 1.45 },
  { key: 'crm', file: 'os-crm', label: 'CRM', accent: '#F7E644', t: 2.1 },
  { key: 'content', file: 'os-content', label: 'Content', accent: '#00A3E0', t: 3.1 },
  { key: 'ads', file: 'os-advertenties', label: 'Ads', accent: '#F62961', t: 4.3 },
];

// Samenkomen tot één chat
const MERGE = 5.35;

interface Props {
  phase: Phase;
  onStart: () => void;
  onFinish: () => void;
}

const HyperframesShow: React.FC<Props> = ({ phase, onStart, onFinish }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [framesGone, setFramesGone] = useState(false);
  const [t, setT] = useState(0);
  const [headlineRect, setHeadlineRect] = useState<{ top: number; left: number; width: number } | null>(null);

  // Positie van de echte hero-h1 meten, zodat de kloon er pixelgelijk op ligt
  const measure = useCallback(() => {
    const root = rootRef.current;
    const target = document.getElementById('hero-headline');
    if (!root || !target) return;
    const rr = root.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    setHeadlineRect({ top: tr.top - rr.top, left: tr.left - rr.left, width: tr.width });
  }, []);

  useLayoutEffect(() => {
    if (phase === 'done') return;
    measure();
    window.addEventListener('resize', measure);
    const to = setTimeout(measure, 600);
    return () => { window.removeEventListener('resize', measure); clearTimeout(to); };
  }, [phase, measure]);

  const handleEnded = useCallback(() => {
    setFramesGone(true);
    setTimeout(() => {
      onFinish();
      setLeaving(true);
      setTimeout(() => setLeaving(false), 800);
    }, 450);
  }, [onFinish]);

  // Eigen klok: geen video nodig, dus niets kan hier blijven hangen
  useEffect(() => {
    if (phase !== 'playing') return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const el = (now - start) / 1000;
      setT(el);
      if (el >= DUUR) { handleEnded(); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, handleEnded]);

  if (phase === 'done' && !leaving) return null;

  const playing = phase === 'playing';
  const latestTime = ALL_TIMES.filter((x) => t >= x).pop();
  const merge = playing ? Math.min(1, Math.max(0, (t - MERGE) / 0.85)) : 0;

  return (
    <div
      ref={rootRef}
      className={`absolute inset-x-0 top-0 h-[100svh] z-[60] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ${leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Headline — exacte kloon van de hero-h1, op de gemeten h1-positie */}
      {headlineRect && (
        <div
          className={`absolute transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: headlineRect.top, left: headlineRect.left, width: headlineRect.width }}
        >
          <h1 className="sn-vhs font-black uppercase tracking-tighter text-white leading-[1.08] text-center" aria-hidden="true">
            {LINES.map((line) => (
              <div key={line.words[0].text} className={`${LINE_CLASS} ${line.green ? 'text-[#25D366]' : ''}`}>
                {line.words.map((w, wi) => {
                  const shown = t >= w.t;
                  const isLatest = w.t === latestTime;
                  const color = line.green ? undefined : (shown && isLatest ? w.accent : '#FFFFFF');
                  return (
                    <React.Fragment key={w.text}>
                      <span
                        className="inline-block will-change-transform"
                        style={{
                          color,
                          opacity: shown ? 1 : 0,
                          transform: shown ? 'translateY(0)' : 'translateY(0.35em)',
                          transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1), color 0.4s ease',
                        }}
                      >
                        {w.text}
                      </span>
                      {wi < line.words.length - 1 ? ' ' : null}
                    </React.Fragment>
                  );
                })}
              </div>
            ))}
          </h1>
        </div>
      )}

      {/* Genereer-knop — verdwijnt zodra de show loopt */}
      <div className={`relative z-10 my-6 md:my-8 scale-125 md:scale-150 origin-center transition-all duration-300 ${playing ? 'opacity-0 scale-100 pointer-events-none' : 'opacity-100'}`}>
        <GenerateButton onClick={onStart} />
      </div>

      {/* De vier schermen, onderin verankerd */}
      <div
        className={`absolute inset-x-0 bottom-0 flex items-end justify-center gap-3 md:gap-6 px-4 pb-6 md:pb-10 transition-opacity duration-500 ${framesGone ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      >
        {FRAMES.map((f, i) => {
          const mid = (FRAMES.length - 1) / 2;
          const shown = !playing || t >= f.t;
          const k = playing ? Math.min(1, Math.max(0, (t - f.t) / 0.55)) : 1;
          const ease = 1 - Math.pow(1 - k, 3);
          // rust: licht gekanteld naast elkaar. finale: alles schuift naar het midden op één stapel
          const tilt = (i - mid) * 3;
          const slide = (mid - i) * 46 * merge;
          const lift = playing ? (1 - ease) * 34 : 0;
          return (
            <div
              key={f.key}
              className="relative flex-1 max-w-[168px] md:max-w-[210px]"
              style={{
                opacity: playing ? (shown ? 1 - 0.62 * merge : 0) : 0.55,
                transform: `translate3d(${slide}px, ${lift + merge * 10}px, 0) rotate(${tilt * (1 - merge)}deg) scale(${(0.94 + 0.06 * ease) * (1 - merge * 0.06)})`,
                transition: 'opacity 0.45s ease',
                zIndex: 10 + i,
              }}
            >
              <div
                className="relative w-full overflow-hidden rounded-2xl bg-[#0b0b0b] border"
                style={{
                  aspectRatio: '9 / 16',
                  borderColor: `${f.accent}${playing && shown ? '66' : '22'}`,
                  boxShadow: playing && shown ? `0 18px 50px rgba(0,0,0,0.6), 0 0 34px ${f.accent}22` : '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={`${BASE}video/os/${f.file}.webp?v=1`}
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)' }} />
                <span
                  className="absolute bottom-2.5 left-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.22em] px-2 py-1 rounded-full"
                  style={{ color: f.accent, background: 'rgba(0,0,0,0.55)', border: `1px solid ${f.accent}40` }}
                >
                  {f.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* De chatbalk waar alles in samenkomt */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-2 md:bottom-4 w-[min(560px,88vw)]"
          style={{ opacity: Math.min(1, merge * 1.6), transform: `translate(-50%, ${(1 - merge) * 16}px)`, zIndex: 40 }}
        >
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#0b0b0d] border border-[#25D366]/40 shadow-[0_22px_60px_rgba(0,0,0,0.85)]">
            <span className="w-2 h-2 rounded-full bg-[#25D366] flex-shrink-0" />
            <span className="text-white/70 text-[12px] md:text-sm font-medium truncate">Stel je vraag over je website, cijfers of planning</span>
            <span className="ml-auto w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </div>
        </div>
      </div>

      {/* Overslaan */}
      {playing && (
        <button
          onClick={handleEnded}
          className="absolute top-24 right-5 md:top-28 md:right-8 z-20 text-white/35 hover:text-white/80 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors"
        >
          Overslaan
        </button>
      )}
    </div>
  );
};

export default HyperframesShow;
