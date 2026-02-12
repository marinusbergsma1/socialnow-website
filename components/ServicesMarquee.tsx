
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const services = [
  "AI Website Development", "Brand Strategy", "UX/UI Design", "Motion Design",
  "Short Form Content", "3D & CGI", "Full-Stack Development", "Video Production",
  "AI Automation", "Social Media", "Creative Direction", "Project Development",
];

const ServicesMarquee: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="expertise-ecosysteem" className="py-10 md:py-16 bg-transparent overflow-hidden relative border-y border-white/5">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

      {/* Marquee row */}
      <div className="flex whitespace-nowrap animate-scroll items-center gap-6 md:gap-10 w-max will-change-transform transform-gpu mb-8 md:mb-10" style={{ animationDuration: '40s' }}>
        {[...services, ...services].map((service, index) => (
          <span
            key={index}
            className="text-white/20 font-black uppercase tracking-wider text-sm md:text-lg hover:text-white/50 transition-colors duration-300 cursor-default"
          >
            {service}
            <span className="text-white/10 mx-4 md:mx-6">/</span>
          </span>
        ))}
      </div>

      {/* CTA to services page */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <button
          onClick={() => navigate('/diensten')}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all group"
        >
          Bekijk al onze diensten
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default ServicesMarquee;
