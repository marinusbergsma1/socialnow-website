
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { TrendingUp, Users, Zap, Activity } from 'lucide-react';
import Button from './Button';

interface ResultsSectionProps {
  onOpenBooking?: () => void;
}

// ─── CountUp (reuse pattern from ShortContent.tsx) ──────────────────────
const CountUp = memo(({ end, duration = 2000, start, prefix = "", suffix = "" }: { end: number; duration?: number; start: boolean; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(easeProgress * end);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, end, duration]);
  return <span>{prefix}{Math.floor(count)}{suffix}</span>;
});

// ─── 3D tilt hook (reuse pattern from Reviews.tsx) ──────────────────────
function useResultsTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * intensity;
      const rotateY = (x - 0.5) * intensity;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}

const results = [
  {
    client: "CHIN CHIN CLUB",
    status: "ACTIVE_PARTNERSHIP",
    context: "Social media strategie + content productie die het restaurant op de kaart zette in Amsterdam.",
    metric1: "Van 0 naar 15K volgers",
    metric2: "in 6 maanden",
    stat: 340,
    statPrefix: "+",
    statSuffix: "%",
    statLabel: "reserveringen",
    color: "#00A3E0",
    icon: Users
  },
  {
    client: "LIGHT ART COLLECTION",
    status: "ONGOING_PROJECT",
    context: "Complete website + branding die internationaal opschaalde naar 8 landen wereldwijd.",
    metric1: "Website bezoekers: +890%",
    metric2: "Internationale expansie",
    stat: 8,
    statPrefix: "",
    statSuffix: "",
    statLabel: "landen bereikt",
    color: "#F7E644",
    icon: TrendingUp
  },
  {
    client: "RAVEG",
    status: "ACTIVE_PARTNERSHIP",
    context: "Van festival branding tot virale campagnes die uitverkochte edities opleveren.",
    metric1: "Volledige rebranding",
    metric2: "Uitverkocht in 48 uur",
    stat: 120,
    statPrefix: "€",
    statSuffix: "K+",
    statLabel: "earned media",
    color: "#F62961",
    icon: Zap
  }
];

// ─── Result Card ────────────────────────────────────────────────────────
const ResultCard: React.FC<{ result: typeof results[0]; index: number; isVisible: boolean }> = ({ result, index, isVisible }) => {
  const { ref: tiltRef, handleMouseMove, handleMouseLeave } = useResultsTilt(10);
  const Icon = result.icon;

  const flipAngles = [
    { rx: 12, ry: -10 },
    { rx: -8, ry: 12 },
    { rx: 10, ry: -8 },
  ];
  const angle = flipAngles[index % flipAngles.length];

  return (
    <div
      ref={tiltRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-8 md:p-10 rounded-2xl md:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.15] flex flex-col"
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
        transition: 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99), opacity 0.6s ease-out, border-color 0.5s',
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
          : `perspective(800px) rotateX(${angle.rx}deg) rotateY(${angle.ry}deg) translateY(40px) scale3d(0.92, 0.92, 0.92)`,
        transitionDelay: `${index * 150}ms`,
      }}
    >
      {/* Gloss overlay (reuse Reviews.tsx) */}
      <div className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' }}
      />

      {/* Status badge + pulse dot */}
      <div className="flex items-center gap-2 mb-5" style={{ transform: 'translateZ(10px)' }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: result.color }} />
        <span className="text-[8px] md:text-[9px] font-mono font-bold text-white/30 tracking-widest uppercase">{result.status}</span>
      </div>

      {/* Client name */}
      <div className="flex items-center gap-3 mb-4" style={{ transform: 'translateZ(15px)' }}>
        <Icon size={14} style={{ color: result.color }} className="opacity-70" />
        <span className="text-xs md:text-sm font-black uppercase tracking-tight text-white leading-tight">
          {result.client}
        </span>
      </div>

      {/* Context description */}
      <p className="text-gray-500 text-[11px] md:text-xs font-medium leading-relaxed mb-5" style={{ transform: 'translateZ(8px)' }}>
        {result.context}
      </p>

      {/* Big stat with CountUp */}
      <div className="mb-2" style={{ transform: 'translateZ(20px)' }}>
        <h3
          className="text-3xl md:text-5xl font-black tracking-tighter leading-none"
          style={{ color: result.color }}
        >
          <CountUp end={result.stat} start={isVisible} prefix={result.statPrefix} suffix={result.statSuffix} />
        </h3>
        <span className="block text-white/25 uppercase font-bold tracking-[0.2em] text-[9px] md:text-[10px] mt-1">
          {result.statLabel}
        </span>
      </div>

      {/* Metrics detail */}
      <div className="border-t border-white/[0.06] pt-4 mt-auto space-y-1" style={{ transform: 'translateZ(5px)' }}>
        <p className="text-white text-xs md:text-sm font-bold leading-snug">{result.metric1}</p>
        <p className="text-white/25 text-[10px] md:text-[11px] font-medium italic">{result.metric2}</p>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 40px ${result.color}10, 0 0 30px ${result.color}08` }}
      />
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────
const ResultsSection: React.FC<ResultsSectionProps> = ({ onOpenBooking }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-36 bg-transparent relative overflow-hidden">
      {/* Animated grid background (reuse Reviews.tsx) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          animation: 'results-grid-scroll 30s linear infinite'
        }}
      />

      {/* Background watermark */}
      <div className="hidden md:block absolute top-0 left-0 w-full text-center pointer-events-none opacity-[0.015] select-none overflow-hidden">
        <h2 className="text-[18vw] font-black uppercase tracking-tighter text-white whitespace-nowrap leading-none">RESULTS</h2>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* AI Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Activity size={14} className="text-[#00A3E0]" />
            <span className="text-white/50 font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px]">MEASURED IMPACT</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter leading-[0.85] flex flex-wrap justify-center items-center">
            <span className="inline-flex items-center whitespace-nowrap">
              <span className="text-[#F7E644] mr-2 md:mr-4">"</span>
              RESULTATEN
            </span>
            <span className="mx-2 md:mx-3">DIE</span>
            <span className="inline-flex items-center whitespace-nowrap">
              SPREKEN
              <span className="text-[#F7E644] ml-2 md:ml-4">"</span>
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-center text-gray-500 text-xs md:text-sm font-medium max-w-xl mx-auto mb-14 md:mb-20 leading-relaxed">
          Van concept tot meetbaar succes. Ontdek wat AI-powered creative oplevert voor onze klanten.
        </p>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-14 md:mb-20" style={{ perspective: '1000px' }}>
          {results.map((result, index) => (
            <ResultCard key={result.client} result={result} index={index} isVisible={isVisible} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Button variant="green" icon onClick={() => {
            const el = document.getElementById('projects');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} triggerOnHover>
            ZIE ALLE CASE STUDIES
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes results-grid-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
      `}</style>
    </section>
  );
};

export default ResultsSection;
