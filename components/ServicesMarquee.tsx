
import React from 'react';
import { 
  Target, Film, Radio, Smartphone, Eye, Palette, 
  Cpu, Box, Map as MapIcon, Share2, Lightbulb, Layers,
  Zap, MessageSquare, Earth, Camera, Network
} from 'lucide-react';

const row1 = [
  { name: "AI Website Development", icon: Cpu, color: "rgb(97, 246, 253)" },
  { name: "Next-Gen Web Apps", icon: Earth, color: "rgb(37, 211, 102)" },
  { name: "AI Automation", icon: Zap, color: "rgb(246, 41, 97)" },
  { name: "Project Development", icon: Lightbulb, color: "rgb(247, 230, 68)" },
  { name: "UX/UI Design", icon: Palette, color: "rgb(97, 246, 253)" },
  { name: "Brand Strategy", icon: Target, color: "rgb(37, 211, 102)" },
];

const row2 = [
  { name: "Motion Design", icon: Layers, color: "rgb(37, 211, 102)" },
  { name: "Video & Content Production", icon: Camera, color: "rgb(247, 230, 68)" },
  { name: "Short Form Content", icon: Film, color: "rgb(246, 41, 97)" },
  { name: "3D & CGI Design", icon: Box, color: "rgb(97, 246, 253)" },
  { name: "Social Media", icon: Smartphone, color: "rgb(37, 211, 102)" },
  { name: "Campaign Design", icon: Target, color: "rgb(246, 41, 97)" },
];

const row3 = [
  { name: "AI-Powered Branding", icon: Cpu, color: "rgb(247, 230, 68)" },
  { name: "Full-Stack Development", icon: Earth, color: "rgb(97, 246, 253)" },
  { name: "Digital Strategy", icon: Target, color: "rgb(37, 211, 102)" },
  { name: "Creative Direction", icon: Eye, color: "rgb(246, 41, 97)" },
  { name: "Visual Identity", icon: Palette, color: "rgb(247, 230, 68)" },
  { name: "Performance Marketing", icon: Zap, color: "rgb(97, 246, 253)" },
];

const ServicesMarquee: React.FC = () => {
  return (
    <section id="expertise-ecosysteem" className="py-12 md:py-24 bg-transparent overflow-hidden relative border-y border-white/5">
      {/* Background Diagram Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <path d="M0,500 Q250,450 500,500 T1000,500" stroke="white" strokeWidth="1" fill="none" />
              <path d="M500,0 Q450,250 500,500 T500,1000" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="500" cy="500" r="300" stroke="white" strokeWidth="0.5" fill="none" />
              <circle cx="500" cy="500" r="150" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
      </div>

      <div className="container mx-auto px-6 mb-10 md:mb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Network size={14} className="text-[#25D366]" />
            <span className="text-white font-black uppercase tracking-[0.4em] text-[10px]">OS_SERVICE_RESONANCE // V1.2</span>
        </div>
        <h2 className="text-4xl md:text-8xl font-black uppercase text-white tracking-tighter leading-none">
          EXPERTISE <span className="text-[#F7E644]">"</span>ECOSYSTEEM<span className="text-[#F7E644]">"</span>
        </h2>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 relative z-10">
        {/* Row 1 */}
        <div className="flex whitespace-nowrap animate-scroll items-center gap-4 md:gap-6 w-max will-change-transform transform-gpu" style={{ animationDuration: '40s' }}>
          {[...row1, ...row1].map((service, index) => (
            <div key={`row1-${index}`} className="group flex items-center gap-4 px-6 md:px-10 py-4 md:py-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-300 hover:border-white/30 hover:scale-105 cursor-default">
              <service.icon size={20} className="md:size-[22px]" style={{ color: service.color }} />
              <span className="text-white font-black uppercase tracking-widest text-[12px] md:text-sm">{service.name}</span>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex whitespace-nowrap animate-scroll items-center gap-4 md:gap-6 w-max will-change-transform transform-gpu" style={{ animationDirection: 'reverse', animationDuration: '50s' }}>
          {[...row2, ...row2].map((service, index) => (
            <div key={`row2-${index}`} className="group flex items-center gap-4 px-6 md:px-10 py-4 md:py-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-300 hover:border-white/30 hover:scale-105 cursor-default">
              <service.icon size={20} className="md:size-[22px]" style={{ color: service.color }} />
              <span className="text-white font-black uppercase tracking-widest text-[12px] md:text-sm">{service.name}</span>
            </div>
          ))}
        </div>

        {/* Row 3 */}
        <div className="flex whitespace-nowrap animate-scroll items-center gap-4 md:gap-6 w-max will-change-transform transform-gpu" style={{ animationDuration: '45s' }}>
          {[...row3, ...row3].map((service, index) => (
            <div key={`row3-${index}`} className="group flex items-center gap-4 px-6 md:px-10 py-4 md:py-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-300 hover:border-white/30 hover:scale-105 cursor-default">
              <service.icon size={20} className="md:size-[22px]" style={{ color: service.color }} />
              <span className="text-white font-black uppercase tracking-widest text-[12px] md:text-sm">{service.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>
    </section>
  );
};

export default ServicesMarquee;
