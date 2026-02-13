
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Cpu } from 'lucide-react';
import Button from './Button';

interface ProcessSectionProps {
  onOpenBooking?: () => void;
}

const steps = [
  {
    number: "01",
    title: "DISCOVERY CALL",
    description: "30 minuten om jouw ambitie te begrijpen. Gratis en vrijblijvend.",
    detail: "We analyseren jouw markt, doelgroep en concurrentie met AI-tools om direct scherp in kaart te brengen waar de kansen liggen.",
    label: "INTAKE_NODE",
    color: "#25D366"
  },
  {
    number: "02",
    title: "STRATEGIE & CONCEPT",
    description: "AI-ondersteunde analyse + creative concepting. Binnen 1 week een voorstel.",
    detail: "AI genereert wireframes en moodboards op basis van data. Jij kiest de richting, wij verfijnen tot pixel-perfect.",
    label: "AI_ANALYSIS",
    color: "#00A3E0"
  },
  {
    number: "03",
    title: "DESIGN & DEVELOPMENT",
    description: "Iteratief bouwen met wekelijkse updates. Jij ziet elke stap.",
    detail: "Geautomatiseerde code-reviews, real-time quality checks en AI-versnelde design iteraties zorgen voor snelheid zonder compromis.",
    label: "BUILD_ENGINE",
    color: "#F7E644"
  },
  {
    number: "04",
    title: "LAUNCH & GROEI",
    description: "Live gaan is pas het begin. 30 dagen gratis nazorg inbegrepen.",
    detail: "Monitoring dashboards en geautomatiseerde performance alerts houden jouw project scherp na lancering.",
    label: "DEPLOY_OPS",
    color: "#F62961"
  }
];

// 3D tilt hook (reuse pattern from Reviews.tsx)
function useProcessTilt(intensity = 8) {
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
      el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}

const StepCard: React.FC<{ step: typeof steps[0]; index: number; isVisible: boolean }> = ({ step, index, isVisible }) => {
  const { ref: tiltRef, handleMouseMove, handleMouseLeave } = useProcessTilt(10);

  // Staggered 3D flip-in angles (reuse pattern from Team.tsx)
  const flipAngles = [
    { rx: 12, ry: -10 },
    { rx: -8, ry: -12 },
    { rx: 10, ry: 8 },
    { rx: -12, ry: 10 },
  ];
  const angle = flipAngles[index % flipAngles.length];

  return (
    <div
      ref={tiltRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.15]"
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
        transition: 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99), opacity 0.6s ease-out, border-color 0.5s',
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
          : `perspective(600px) rotateX(${angle.rx}deg) rotateY(${angle.ry}deg) translateY(40px) scale3d(0.92, 0.92, 0.92)`,
        transitionDelay: `${index * 150}ms`,
      }}
    >
      {/* Gloss overlay (reuse Reviews.tsx) */}
      <div className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' }}
      />

      {/* Terminal label */}
      <div className="flex items-center gap-2 mb-4" style={{ transform: 'translateZ(10px)' }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: step.color }} />
        <span className="text-[8px] md:text-[9px] font-mono font-bold text-white/30 tracking-widest uppercase">{step.label}_{step.number}</span>
      </div>

      {/* Step number */}
      <div className="flex items-center gap-3 mb-4" style={{ transform: 'translateZ(15px)' }}>
        <span
          className="text-2xl md:text-3xl font-black tracking-tighter leading-none"
          style={{ color: step.color }}
        >
          {step.number}
        </span>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      {/* Title */}
      <h3 className="text-xs md:text-sm font-black uppercase text-white tracking-tight mb-2 leading-tight" style={{ transform: 'translateZ(12px)' }}>
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-[11px] md:text-xs font-medium leading-relaxed mb-3" style={{ transform: 'translateZ(8px)' }}>
        {step.description}
      </p>

      {/* AI automation detail */}
      <div className="border-t border-white/[0.06] pt-3 mt-auto" style={{ transform: 'translateZ(5px)' }}>
        <p className="text-white/25 text-[10px] md:text-[11px] font-medium leading-relaxed italic">
          {step.detail}
        </p>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 40px ${step.color}10, 0 0 30px ${step.color}08` }}
      />
    </div>
  );
};

const ProcessSection: React.FC<ProcessSectionProps> = ({ onOpenBooking }) => {
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
      {/* Animated grid background (reuse Team.tsx) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(37, 211, 102, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(37, 211, 102, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          animation: 'process-grid-scroll 25s linear infinite'
        }}
      />

      {/* Background watermark */}
      <div className="hidden md:block absolute top-0 left-0 w-full text-center pointer-events-none opacity-[0.015] select-none overflow-hidden">
        <h2 className="text-[18vw] font-black uppercase tracking-tighter text-white whitespace-nowrap leading-none">PROCESS</h2>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* AI Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Cpu size={14} className="text-[#25D366]" />
            <span className="text-white/50 font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px]">AI-POWERED WORKFLOW</span>
          </div>
        </div>

        {/* Header — smaller than before */}
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter leading-[0.85] flex flex-wrap justify-center items-center">
            <span className="inline-flex items-center whitespace-nowrap">
              <span className="text-[#F7E644] mr-2 md:mr-4">"</span>
              VAN IDEE TOT
            </span>
            <span className="mx-2 md:mx-3">LANCERING</span>
            <span className="inline-flex items-center whitespace-nowrap">
              IN 4 STAPPEN
              <span className="text-[#F7E644] ml-2 md:ml-4">"</span>
            </span>
          </h2>
        </div>

        {/* Subtitle — explains automation */}
        <p className="text-center text-gray-500 text-xs md:text-sm font-medium max-w-xl mx-auto mb-14 md:mb-20 leading-relaxed">
          Ons AI-versnelde proces bespaart je weken. Van branding en design tot development en lancering — elke stap is geoptimaliseerd met slimme automatisering zodat jij sneller live gaat zonder in te leveren op kwaliteit.
        </p>

        {/* Connection line (desktop only) */}
        <div className="hidden lg:block relative mb-4">
          <div className="absolute top-1/2 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#25D366]/20 via-[#00A3E0]/20 via-[#F7E644]/20 to-[#F62961]/20" />
          <div className="absolute top-1/2 left-[12.5%] right-[12.5%] h-px animate-pulse" style={{ background: 'linear-gradient(90deg, #25D36630, #00A3E030, #F7E64430, #F6296130)' }} />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-14 md:mb-20" style={{ perspective: '1000px' }}>
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} isVisible={isVisible} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Button variant="green" icon onClick={onOpenBooking} triggerOnHover>
            START BIJ STAP 1
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes process-grid-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
      `}</style>
    </section>
  );
};

export default ProcessSection;
