
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const servicesRow1 = [
  { name: "DIGITAL EXPERIENCE", color: "#00A3E0" },
  { name: "CAMPAIGN DESIGN", color: "#25D366" },
  { name: "SOCIAL MEDIA", color: "#F7E644" },
  { name: "BRAND STRATEGY", color: "#25D366" },
  { name: "VISUAL IDENTITY", color: "#F62961" },
  { name: "WEBSITE & UI/UX DESIGN", color: "#00A3E0" },
  { name: "AI WEBSITE DEVELOPMENT", color: "#25D366" },
  { name: "CREATIVE DIRECTION", color: "#F7E644" },
];

const servicesRow2 = [
  { name: "SHORT FORM CONTENT", color: "#F62961" },
  { name: "MOTION DESIGN", color: "#25D366" },
  { name: "VIDEO & CONTENT PRODUCTION", color: "#F62961" },
  { name: "3D & CGI DESIGN", color: "#25D366" },
  { name: "PRINT & OFFLINE MEDIA", color: "#25D366" },
  { name: "EVENT & ENVIRONMENTAL DESIGN", color: "#00A3E0" },
  { name: "FULL-STACK DEVELOPMENT", color: "#F7E644" },
];

const servicesRow3 = [
  { name: "AI CODING & ALGORITHMIC ADS", color: "#F7E644" },
  { name: "BRAND PSYCHOLOGY", color: "#25D366" },
  { name: "NEURO-MARKETING", color: "#F62961" },
  { name: "MOTION BRANDING", color: "#25D366" },
  { name: "VERBAL IDENTITY", color: "#F7E644" },
  { name: "MEDIA BUYING", color: "#00A3E0" },
  { name: "AI AUTOMATION", color: "#25D366" },
];

const MarqueeRow: React.FC<{ services: typeof servicesRow1; duration: string; reverse?: boolean }> = ({ services, duration, reverse }) => {
  const doubled = [...services, ...services];
  return (
    <div className="flex whitespace-nowrap items-center gap-3 md:gap-4 w-max will-change-transform transform-gpu"
      style={{
        animation: `${reverse ? 'scroll-reverse' : 'scroll'} ${duration} linear infinite`,
      }}
    >
      {doubled.map((service, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-3 rounded-full border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 cursor-default group flex-shrink-0"
        >
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: service.color }} />
          <span className="text-white/50 group-hover:text-white/80 font-black uppercase tracking-[0.1em] text-[10px] md:text-xs transition-colors whitespace-nowrap">
            {service.name}
          </span>
        </div>
      ))}
    </div>
  );
};

const ServicesMarquee: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="expertise-ecosysteem" className="py-10 md:py-16 bg-transparent overflow-hidden relative border-y border-white/5">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

      {/* Row 1 */}
      <div className="mb-3 md:mb-4 overflow-hidden">
        <MarqueeRow services={servicesRow1} duration="45s" />
      </div>

      {/* Row 2 — reverse */}
      <div className="mb-3 md:mb-4 overflow-hidden">
        <MarqueeRow services={servicesRow2} duration="50s" reverse />
      </div>

      {/* Row 3 */}
      <div className="mb-8 md:mb-10 overflow-hidden">
        <MarqueeRow services={servicesRow3} duration="42s" />
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <button
          onClick={() => navigate('/diensten')}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all group"
        >
          Bekijk al onze diensten
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default ServicesMarquee;
