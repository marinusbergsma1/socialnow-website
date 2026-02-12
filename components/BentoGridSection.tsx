import React, { useEffect, useState } from 'react';
import { 
  X, Layers, Brain, Target, Activity, Workflow, Palette, TrendingUp, Code, Zap, Shield, SearchCode, PieChart, Fingerprint, Send, Rocket, Terminal, BarChart3, CircleDollarSign
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis 
} from 'recharts';
import ScrollTypewriter from './ScrollTypewriter';
import Button from './Button';
import { PixelGlobe } from './PixelGlobe';

interface BentoGridSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const performanceData = [
  { name: 'W1', value: 400 },
  { name: 'W2', value: 300 },
  { name: 'W3', value: 600 },
  { name: 'W4', value: 800 },
  { name: 'W5', value: 1100 },
  { name: 'W6', value: 1600 },
];

const strategyRadarData = [
  { subject: 'Strategie', A: 120, fullMark: 150 },
  { subject: 'Design', A: 145, fullMark: 150 },
  { subject: 'AI Ops', A: 130, fullMark: 150 },
  { subject: 'Data', A: 110, fullMark: 150 },
  { subject: 'Content', A: 140, fullMark: 150 },
];

const cyclingWords = [
  { text: "SYSTEMEN", color: "text-[#61F6FD]" },
  { text: "ENGINES", color: "text-[#25D366]" },
  { text: "PROTOCOLLEN", color: "text-[#F7E644]" },
  { text: "OPLOSSINGEN", color: "text-[#F62961]" }
];

const brandingMethodology = [
  { step: "01", title: "Discovery & Data", icon: SearchCode, desc: "Diepgaande analyse van marktsegmentatie en consumentengedrag via AI-gedreven data-modellen.", color: "#61F6FD", status: "SCANNING" },
  { step: "02", title: "Archetype Coding", icon: Fingerprint, desc: "Definiëren van de psychologische kern en het merk-archetype voor maximale resonantie.", color: "#F62961", status: "ENCODING" },
  { step: "03", title: "Visual OS", icon: Layers, desc: "Bouwen van een visueel besturingssysteem inclusief Identity, Motion en CGI assets.", color: "#25D366", status: "BUILDING" },
  { step: "04", title: "Market Launch", icon: Rocket, desc: "Gecoördineerde lancering met high-velocity content engines en performance targeting.", color: "#F7E644", status: "INITIALIZING" }
];

const services = [
  {
    id: "brand-strategy",
    title: "MERK INTELLIGENTIE",
    category: "Het Fundament",
    icon: Brain,
    color: "#61F6FD",
    label: "Strategische Architectuur",
    impact: "98% Resonantie",
    description: "Wij engineeren de psychologische fundamenten van jouw merk. Geen gokwerk, maar harde data over marktsegmentatie en merk-positionering die jouw doelgroep direct raakt.",
    subServices: ["Psychologische Voorsprong", "Verbale Architectuur", "Sonic Branding", "Culturele Fundamenten"],
    chartType: 'radar'
  },
  {
    id: "visual-vfx",
    title: "VISUELE IDENTITEIT 3.0",
    category: "Het Ambacht",
    icon: Palette,
    color: "#F62961",
    label: "CGI & Motion",
    impact: "92% Visuele Impact",
    description: "High-end design dat functioneert als een visueel besturingssysteem. We creëren dynamische merkidentiteiten die leven in 3D, motion en interactieve omgevingen.",
    subServices: ["Design Systemen", "Product CGI", "Motion Frameworks", "3D Omgevingsontwerp"],
    chartType: 'pulse'
  }
];

const BentoGridSection: React.FC<BentoGridSectionProps> = ({ isOpen, onClose }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const startTimeout = setTimeout(() => {
        setShowWord(true);
        const interval = setInterval(() => {
          setShowQuote(false);
          setWordIndex(prev => (prev + 1) % cyclingWords.length);
          setTimeout(() => setShowQuote(true), 400);
        }, 2000);
        setTimeout(() => setShowQuote(true), 400);
        return () => clearInterval(interval);
      }, 1000);
      return () => {
        document.body.style.overflow = originalOverflow;
        clearTimeout(startTimeout);
      };
    }
  }, [isOpen]);

  const renderChart = (type: string, color: string) => {
    switch (type) {
      case 'radar':
        return (
          <div className="h-48 w-full mt-6 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={strategyRadarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }} />
                <Radar name="Strategy" dataKey="A" stroke={color} fill={color} fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'pulse':
        return (
          <div className="h-48 w-full mt-6 flex items-center justify-center gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div 
                key={i} 
                className="w-2 rounded-full bg-white/5 relative overflow-hidden" 
                style={{ height: '80%', animation: `pulse-bar 1.2s ease-in-out infinite ${i * 0.1}s` }}
              >
                <div className="absolute bottom-0 left-0 w-full rounded-full transition-all duration-300" style={{ backgroundColor: color, height: '50%' }}></div>
              </div>
            ))}
          </div>
        );
      case 'area':
        return (
          <div className="h-48 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id={`colorValue-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.5}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke={color} strokeWidth={4} fillOpacity={1} fill={`url(#colorValue-${color})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/99 backdrop-blur-[120px] animate-fade-in-up" onClick={onClose}></div>

      <button 
        onClick={onClose} 
        className="absolute top-8 right-8 z-[210] p-6 rounded-full bg-white/5 hover:bg-[#F62961] transition-all text-white border border-white/10 flex items-center justify-center shadow-3xl group backdrop-blur-md"
      >
        <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>

      <div className="relative z-[180] w-full h-full overflow-y-auto overflow-x-hidden py-12 md:py-32 px-4 md:px-8 custom-scrollbar">
        <div className="container mx-auto max-w-7xl pb-40">
          
          <div className="mb-20 md:mb-24 text-center px-4">
             <div className="relative z-10">
                <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
                  <Workflow size={18} className="text-[#61F6FD]" />
                  <span className="text-white font-black uppercase tracking-[0.6em] text-[11px]">INTEGRATED BRAND ARCHITECTURE OS</span>
                </div>

                <h2 className="font-black uppercase tracking-tighter text-white leading-[0.75] mb-10">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 flex items-center justify-center">
                    <span className="text-[#F7E644] mr-4 md:mr-8">"</span>
                    <ScrollTypewriter text='ONZE EXPERTISE' delay={300} start={true} withHighlight={false} />
                  </div>
                  <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-[-0.1em] flex justify-center items-center h-[1.1em]">
                    {showWord ? (
                      <span key={wordIndex} className={`${cyclingWords[wordIndex].color} animate-fade-in-up transition-all duration-700 flex items-center`}>
                        {cyclingWords[wordIndex].text}
                        <span className={`text-[#F7E644] ml-4 md:ml-10 transition-all duration-400 ${showQuote ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                          "
                        </span>
                      </span>
                    ) : (
                      <span className="opacity-0">BRANDING</span>
                    )}
                  </div>
                </h2>
             </div>
          </div>

          <div className="mb-32 md:mb-36 flex justify-center px-2">
              <div className="w-full max-w-7xl bg-white/[0.005] border border-white/10 rounded-[4rem] p-10 md:p-16 relative overflow-hidden group shadow-3xl backdrop-blur-3xl">
                  <div className="relative z-10">
                      <div className="text-center mb-20 md:mb-24">
                          <h4 className="text-[#61F6FD] font-black uppercase tracking-[0.8em] text-[11px] mb-6">INTERNAL WORKFLOW // PROTOCOL V.2</h4>
                          <h3 className="text-4xl md:text-7xl font-black uppercase text-white tracking-tighter leading-[0.8] mb-8">
                              DE <span className="text-[#F7E644]">OS FLOW</span>
                          </h3>
                          <div className="h-1.5 w-48 bg-white/10 mx-auto rounded-full"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                          {brandingMethodology.map((m, i) => {
                              const Icon = m.icon;
                              return (
                                  <div key={i} className="relative z-10 bg-[#030303] border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-3xl group/card hover:border-white/20 transition-all duration-700 min-h-[380px] flex flex-col justify-between shadow-3xl overflow-hidden border-t-2" style={{ borderTopColor: m.color }}>
                                      <div className="absolute -bottom-6 -right-6 text-[10rem] font-black text-white/[0.03] pointer-events-none italic tracking-tighter select-none">{m.step}</div>
                                      <div className="relative z-10">
                                          <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover/card:scale-110 group-hover/card:bg-white/10 transition-all duration-700 mb-8 shadow-2xl">
                                              <Icon size={32} style={{ color: m.color }} />
                                          </div>
                                          <h4 className="text-white font-black uppercase text-xl md:text-2xl mb-5 tracking-tighter group-hover/card:text-[#F7E644] transition-colors">{m.title}</h4>
                                          <p className="text-gray-400 text-sm font-bold leading-relaxed italic">"{m.desc}"</p>
                                      </div>
                                      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                                          <Terminal size={14} className="text-white/20" />
                                          <span className="text-[9px] font-mono text-white/20 tracking-[0.4em] uppercase">SYSTEM_NODE_{m.step}</span>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mb-32 md:mb-36">
              {services.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                      <div
                        key={service.id}
                        className="group relative bg-[#040404] border border-white/[0.05] rounded-[3.5rem] p-10 md:p-14 overflow-hidden transition-all duration-700 hover:border-white/15 shadow-3xl"
                      >
                          <div className="relative z-10">
                              <div className="flex justify-between items-start mb-10">
                                  <div className="w-20 h-20 rounded-[2rem] bg-white/[0.03] flex items-center justify-center group-hover:bg-white/[0.08] transition-all duration-700 border border-white/[0.1] shadow-3xl">
                                      <Icon size={40} style={{ color: service.color }} />
                                  </div>
                                  <div className="text-right">
                                      <span className="text-[10px] font-black uppercase tracking-[0.5em] block opacity-40 mb-2">RESONANCE METRIC</span>
                                      <div className="flex items-center justify-end gap-3 mt-1">
                                          <TrendingUp size={16} className="text-[#25D366]" />
                                          <span className="text-sm font-black text-white uppercase tracking-widest">{service.impact}</span>
                                      </div>
                                  </div>
                              </div>
                              <h3 className="text-3xl md:text-4xl font-black text-white leading-none uppercase tracking-tighter mb-6">{service.title}</h3>
                              <p className="text-gray-400 text-base leading-relaxed mb-10 font-medium italic border-l-4 border-white/10 pl-6">"{service.description}"</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-3">
                                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 block mb-3">Kern Componenten</span>
                                      {service.subServices.map((f, i) => (
                                          <div key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors duration-300">
                                              <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: service.color, color: service.color }}></div>
                                              {f}
                                          </div>
                                      ))}
                                  </div>
                                  <div className="bg-black/60 border border-white/[0.05] rounded-[3rem] p-8 shadow-inner overflow-hidden">
                                      <div className="flex items-center justify-between mb-4">
                                          <span className="text-[9px] font-mono text-white/20">DATA_VIZ_BETA</span>
                                          <Activity size={12} className="text-white/20" />
                                      </div>
                                      {renderChart(service.chartType, service.color)}
                                  </div>
                              </div>
                          </div>
                      </div>
                  )
              })}
          </div>

          <div className="mb-32 md:mb-36 flex justify-center px-4 overflow-visible">
              <div className="w-full max-w-6xl bg-white/[0.01] border border-white/10 rounded-[4rem] p-10 md:p-20 relative overflow-visible group transition-all duration-1000 shadow-3xl backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#61F6FD]/5 via-transparent to-[#F62961]/5 opacity-30 rounded-[5rem]"></div>
                
                {/* PixelGlobe Beeldmerk */}
                <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-64 h-64 md:w-[28rem] md:h-[28rem] opacity-40 pointer-events-none">
                  <PixelGlobe scaleMultiplier={0.35} type="all" opacity={0.8} glowEnabled={true} largeParticles={true} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-20 overflow-visible">
                    <div className="flex-1 text-center lg:text-left z-30">
                        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-md">
                            <Shield size={18} className="text-[#61F6FD]" />
                            <span className="text-white font-black uppercase tracking-[0.6em] text-[11px]">INTEGRATED BRAND OS V.4</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-[0.8] mb-10">
                            KLAAR OM TE <br/> <span className="text-[#25D366]">SYNCEN?</span>
                        </h2>

                        <p className="text-gray-400 font-bold text-xl md:text-2xl leading-tight mb-12 italic">
                            Wij vertalen rauwe ambitie naar <span className="text-white">visuele monumenten</span>. Onze strategie is gecodeerd voor totale markt-dominantie.
                        </p>

                        <Button variant="green" icon={true} IconComponent={Send} onClick={onClose} className="!px-14 !h-16 !text-base shadow-[0_0_50px_rgba(37,211,102,0.4)]">LANCEER JOUW MERK</Button>
                    </div>

                </div>
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                  { icon: TrendingUp, color: "#25D366", label: "Markt Groei", value: "+124%", desc: "Gemiddelde Performance" },
                  { icon: CircleDollarSign, color: "#F7E644", label: "Maandelijkse ROI", value: "€14.5k", desc: "Per Campagne" },
                  { icon: BarChart3, color: "#F62961", label: "Conversie", value: "4.8%", desc: "Direct Verkeer" },
                  { icon: Target, color: "#61F6FD", label: "System Uptime", value: "99.9%", desc: "Operationeel 24/7" }
              ].map((stat, i) => (
                <div
                    key={i}
                    className="bg-[#050505] border border-white/10 rounded-[2rem] p-8 md:p-10 group hover:border-white/30 transition-all duration-700 shadow-3xl animate-fade-in-up hover:-translate-y-3"
                >
                    <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/5 transition-all duration-700 shadow-2xl">
                        <stat.icon size={22} style={{ color: stat.color }} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2 block">{stat.label}</span>
                    <div className="text-3xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.desc}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-bar {
          0%, 100% { height: 40%; opacity: 0.2; }
          50% { height: 95%; opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default BentoGridSection;