
import React, { useEffect, useRef, useState, useMemo } from 'react';

/**
 * Animerende groei-grafiek in SocialNow-stijl (donker glas + merkgroen).
 * De lijn tekent zich in zodra de kaart in beeld scrollt. Klantgerichte
 * boodschap: de groei die een klant mag verwachten.
 */
const GrowthChart: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // stijgende trend, genormaliseerd naar de 640×220 viewBox
  const { line, area, dot } = useMemo(() => {
    const vals = [8, 14, 12, 22, 31, 38, 34, 47, 52, 61, 72, 100];
    const W = 640, H = 220, padY = 18, top = 24;
    const pts = vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * W;
      const y = H - padY - (v / 100) * (H - padY - top);
      return [Math.round(x), Math.round(y)] as [number, number];
    });
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const mx = (pts[i - 1][0] + pts[i][0]) / 2;
      const my = (pts[i - 1][1] + pts[i][1]) / 2;
      d += ` Q${pts[i - 1][0]},${pts[i - 1][1]} ${mx},${my} T${pts[i][0]},${pts[i][1]}`;
    }
    const last = pts[pts.length - 1];
    return { line: d, area: `${d} L${W},${H} L0,${H} Z`, dot: last };
  }, []);

  return (
    <div className="container mx-auto px-6 max-w-2xl mb-20 md:mb-28 scroll-reveal">
      <div
        ref={ref}
        className={`overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.6)] ${inView ? 'gc-run' : ''}`}
      >
        <style>{`
          .gc-line { stroke-dasharray: 1; stroke-dashoffset: 1; }
          .gc-area { opacity: 0; }
          .gc-dot  { opacity: 0; }
          .gc-run .gc-line { animation: gc-draw 1.9s cubic-bezier(.22,1,.36,1) forwards; }
          .gc-run .gc-area { animation: gc-fade .9s ease-out .9s forwards; }
          .gc-run .gc-dot  { animation: gc-dot 1.9s cubic-bezier(.22,1,.36,1) forwards; }
          @keyframes gc-draw { to { stroke-dashoffset: 0; } }
          @keyframes gc-fade { to { opacity: 1; } }
          @keyframes gc-dot  { 0%,82%{opacity:0} 100%{opacity:1} }
          @media (prefers-reduced-motion: reduce) {
            .gc-line { stroke-dashoffset: 0; } .gc-area,.gc-dot { opacity: 1; }
            .gc-run .gc-line,.gc-run .gc-area,.gc-run .gc-dot { animation: none; }
          }
        `}</style>

        {/* header */}
        <div className="flex items-start justify-between gap-3 p-4 md:p-5 border-b border-white/8">
          <div>
            <h3 className="text-base md:text-lg font-black text-white tracking-tight">De groei die je mag verwachten</h3>
            <p className="mt-1 text-[11px] md:text-xs text-white/45 font-medium">Gemiddelde stijging in bereik &amp; aanvragen bij onze klanten.</p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-2.5 py-1 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-[#25D366]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366]" />
            +38% in jaar 1
          </span>
        </div>

        {/* chart */}
        <div className="p-3 md:p-4">
          <svg viewBox="0 0 640 220" preserveAspectRatio="none" className="w-full h-[150px] md:h-[180px] block" aria-hidden="true">
            <defs>
              <linearGradient id="gc-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#25D366" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#25D366" stopOpacity="0" />
              </linearGradient>
              <filter id="gc-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <g stroke="rgba(255,255,255,.07)" strokeWidth="1">
              <line x1="0" y1="45" x2="640" y2="45" /><line x1="0" y1="95" x2="640" y2="95" />
              <line x1="0" y1="145" x2="640" y2="145" /><line x1="0" y1="195" x2="640" y2="195" />
            </g>
            <path className="gc-area" d={area} fill="url(#gc-area-grad)" />
            <path className="gc-line" d={line} fill="none" stroke="#25D366" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} filter="url(#gc-glow)" />
            <circle className="gc-dot" cx={dot[0] - 3} cy={dot[1]} r="5" fill="#25D366" filter="url(#gc-glow)" />
          </svg>
          <div className="flex justify-between px-1 pt-2 text-[10px] md:text-[11px] font-semibold text-white/40">
            <span>jan</span><span>mrt</span><span>mei</span><span>jul</span><span>sep</span><span>nov</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthChart;
