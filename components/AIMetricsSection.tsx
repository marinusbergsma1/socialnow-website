import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, Zap, Star, Globe, BarChart3 } from 'lucide-react';

interface Metric {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  color: string;
  status: string;
  desc: string;
}

const metrics: Metric[] = [
  {
    icon: Users,
    label: "SOCIAAL BEREIK",
    value: 2,
    suffix: "M+",
    color: "#25D366",
    status: "LIVE",
    desc: "Maandelijks bereik"
  },
  {
    icon: TrendingUp,
    label: "ENGAGEMENT BOOST",
    value: 340,
    suffix: "%",
    prefix: "+",
    color: "#00A3E0",
    status: "ACTIEF",
    desc: "Gemiddeld per campagne"
  },
  {
    icon: Zap,
    label: "CONVERSIE STIJGING",
    value: 180,
    suffix: "%",
    prefix: "+",
    color: "#F7E644",
    status: "VERIFIED",
    desc: "Lead-to-sale ratio"
  },
  {
    icon: Star,
    label: "CLIENT RATING",
    value: 4.9,
    suffix: "/5",
    color: "#F62961",
    status: "CERTIFIED",
    desc: "Op basis van 50+ reviews"
  },
  {
    icon: Globe,
    label: "LOAD TIJD",
    value: 1.8,
    suffix: "s",
    prefix: "<",
    color: "#00A3E0",
    status: "OPTIMAL",
    desc: "Gemiddelde pagina snelheid"
  },
  {
    icon: BarChart3,
    label: "PROJECTEN",
    value: 50,
    suffix: "+",
    color: "#25D366",
    status: "DEPLOYED",
    desc: "Succesvol afgerond"
  }
];

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const isFloat = !Number.isInteger(target);
    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isFloat ? Math.round(start * 10) / 10 : Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

const MetricCard: React.FC<{ metric: Metric; started: boolean; delay: number }> = ({ metric, started, delay }) => {
  const [visible, setVisible] = useState(false);
  const count = useCountUp(metric.value, 1200, started && visible);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [started, delay]);

  const Icon = metric.icon;
  const displayValue = Number.isInteger(metric.value) ? count : (Math.round(count * 10) / 10);

  return (
    <div
      className={`relative bg-[#050505] border border-white/8 rounded-[2rem] p-7 md:p-8 flex flex-col gap-4 overflow-hidden group hover:border-white/20 transition-all duration-700 hover:-translate-y-2 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, border-color 0.3s',
        borderTopColor: metric.color,
        borderTopWidth: '2px'
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"
        style={{ background: `radial-gradient(ellipse at top left, ${metric.color}08 0%, transparent 60%)` }}
      />

      {/* Status badge */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
          <Icon size={18} style={{ color: metric.color }} />
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: metric.color }}
          />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: metric.color }}>
            {metric.status}
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="relative z-10">
        <div className="font-black tracking-tighter leading-none text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
          {metric.prefix && <span style={{ color: metric.color }}>{metric.prefix}</span>}
          {displayValue}
          <span style={{ color: metric.color }}>{metric.suffix}</span>
        </div>
      </div>

      {/* Labels */}
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-1">
          {metric.label}
        </div>
        <div className="text-[11px] font-bold text-gray-500">{metric.desc}</div>
      </div>

      {/* Terminal footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-auto">
        <span className="text-[8px] font-mono text-white/15 tracking-[0.3em] uppercase">
          SYS_{metric.label.replace(/\s+/g, '_')}_OK
        </span>
      </div>
    </div>
  );
};

const AIMetricsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14 md:mb-18 scroll-reveal">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <BarChart3 size={14} className="text-[#25D366]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">
              REAL-TIME RESULTATEN // VERIFIED DATA
            </span>
          </div>
          <h2 className="font-black uppercase tracking-tighter text-white leading-none text-5xl md:text-6xl lg:text-7xl mb-4">
            BEWEZEN <span className="text-[#25D366]">IMPACT</span>
          </h2>
          <p className="text-gray-400 font-bold text-lg md:text-xl max-w-2xl mx-auto">
            Geen mooie beloftes — alleen <span className="text-white">harde cijfers</span> van echte projecten.
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {metrics.map((metric, i) => (
            <MetricCard key={i} metric={metric} started={started} delay={i * 80} />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex items-center justify-center gap-3 text-center">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="text-[10px] font-mono text-white/20 tracking-[0.4em] uppercase">
            DATA_STREAM_ACTIVE // LAST_SYNC: Q1_2026
          </span>
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default AIMetricsSection;
