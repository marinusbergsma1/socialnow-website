import React, { useState, useEffect, useRef } from 'react';
import { Cpu } from 'lucide-react';
import Button from './Button';

interface ProcessSectionProps {
  onOpenBooking?: () => void;
}

const steps = [
  {
    number: '01',
    title: 'DISCOVERY CALL',
    description: '30 minuten om jouw situatie te begrijpen. Gratis en vrijblijvend.',
    detail: 'We analyseren jouw huidige website, content en advertenties. Je ontvangt direct inzicht in waar de grootste kansen liggen voor groei met automation.',
    label: 'INTAKE_NODE',
    color: '#25D366',
  },
  {
    number: '02',
    title: 'WIJ LEVEREN',
    description: 'Binnen 1 week ontvang je je gratis proof of concept.',
    detail: "Binnen 1 week ontvang je je gratis proof of concept: een complete website demo én rebranding. Gratis en vrijblijvend.",
    label: 'DEPLOY_OPS',
    color: '#00A3E0',
  },
];

const StepCard: React.FC<{ step: typeof steps[0]; index: number; isVisible: boolean }> = ({ step, index, isVisible }) => (
  <div
    className="sn-warp-tile group relative p-6 md:p-8 rounded-xl overflow-hidden transition-all duration-500 hover:border-white/25"
    style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'none' : 'translateY(28px)',
      transitionDelay: `${index * 120}ms`,
    }}
  >
    {/* Accent top line in step color */}
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }} />

    {/* Terminal label */}
    <div className="flex items-center gap-2 mb-5">
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: step.color }} />
      <span className="text-[9px] font-mono font-bold text-white/40 tracking-widest uppercase">{step.label}_{step.number}</span>
    </div>

    {/* Step number */}
    <div className="flex items-center gap-3 mb-4">
      <span className="text-3xl md:text-4xl font-black tracking-tighter leading-none" style={{ color: step.color }}>
        {step.number}
      </span>
      <div className="flex-1 h-px bg-white/10" />
    </div>

    {/* Title */}
    <h3 className="text-sm md:text-base font-black uppercase text-white tracking-tight mb-2 leading-tight">{step.title}</h3>

    {/* Description */}
    <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed mb-4">{step.description}</p>

    {/* AI automation detail */}
    <div className="border-t border-white/[0.08] pt-4">
      <p className="text-white/45 text-[11px] md:text-xs font-medium leading-relaxed">{step.detail}</p>
    </div>

    {/* Hover glow */}
    <div
      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ boxShadow: `inset 0 0 40px ${step.color}12` }}
    />
  </div>
);

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
    <section ref={sectionRef} className="py-20 md:py-28 relative">
      <div className="container mx-auto max-w-5xl px-4 md:px-6 relative z-10">
        {/* AI Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-[#0e0e12]">
            <Cpu size={14} className="text-[#25D366]" />
            <span className="text-white/50 font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px]">AI-POWERED WORKFLOW</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none inline-flex flex-wrap justify-center items-center gap-x-3">
            <span className="inline-flex items-center">
              <span className="text-[#F7E644] mr-2 md:mr-3">"</span>ZO SIMPEL
            </span>
            <span>IS HET</span>
            <span className="text-[#F7E644] ml-2 md:ml-3">"</span>
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-center text-neutral-400 text-sm md:text-base font-medium max-w-xl mx-auto mb-12 md:mb-14 leading-relaxed">
          Geen wekenlange trajecten, geen eindeloze meetings. Eén gesprek, en wij leveren. Binnen 1 week zie je resultaat — gratis en vrijblijvend.
        </p>

        {/* Steps — bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto mb-12">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} isVisible={isVisible} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Button variant="green" icon onClick={onOpenBooking} triggerOnHover>
            PLAN JE GRATIS CALL
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
