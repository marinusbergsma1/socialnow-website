
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import Button from './Button';

interface CTASectionProps {
  onOpenBooking: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onOpenBooking, onVisibilityChange }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true);
        }
        onVisibilityChange?.(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [onVisibilityChange]);

  return (
    <section
      ref={sectionRef}
      className={`py-20 md:py-32 bg-transparent relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hasRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {/* Aurora glow background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
          style={{
            top: '10%', left: '15%',
            background: 'radial-gradient(circle, rgba(37, 211, 102, 0.4) 0%, transparent 70%)',
            animation: 'aurora-float-1 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-25"
          style={{
            top: '30%', right: '10%',
            background: 'radial-gradient(circle, rgba(0, 163, 224, 0.35) 0%, transparent 70%)',
            animation: 'aurora-float-2 15s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-20"
          style={{
            bottom: '5%', left: '40%',
            background: 'radial-gradient(circle, rgba(246, 41, 97, 0.3) 0%, transparent 70%)',
            animation: 'aurora-float-3 10s ease-in-out infinite',
          }}
        />
      </div>

      {/* Background watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none">
        <h2 className="text-[30vw] font-black uppercase tracking-tighter text-white whitespace-nowrap leading-none">LET'S GO</h2>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Main CTA */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
            STOP MET GOKKEN<br />
            <span className="text-[#25D366]">OP SUCCES.</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Eén systeem. Eén team. Website, CRM, content, advertenties én analytics — allemaal geautomatiseerd en op elkaar afgestemd. Actie loopt tot eind maart 2026.
          </p>

          {/* Two offer cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
            <div className="p-6 md:p-8 rounded-2xl border border-[#25D366]/20 bg-[#25D366]/5 text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#25D366] mb-3">GRATIS CONTENT PAKKET</p>
              <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-tight mb-2">10 Story's + 10 Posts</h3>
              <p className="text-gray-400 text-sm mb-4">Compleet in jouw huisstijl of een verbeterde versie daarvan. Binnen 1 week geleverd.</p>
              <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="!text-sm">
                CLAIM JE CONTENT
              </Button>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-[#00A3E0]/20 bg-[#00A3E0]/5 text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A3E0] mb-3">GRATIS WEBSITE DEMO</p>
              <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-tight mb-2">Ter waarde van €10.000</h3>
              <p className="text-gray-400 text-sm mb-4">Complete website met AI-systeem, CRM en analytics. Gratis en vrijblijvend als live demo.</p>
              <Button variant="outline" icon onClick={onOpenBooking} className="!text-sm !border-[#00A3E0]/50 hover:!border-[#00A3E0] !text-[#00A3E0]">
                VRAAG JE DEMO AAN
              </Button>
            </div>
          </div>

          <a
            href="https://wa.me/31637404577"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Of WhatsApp nu
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="p-8 md:p-10 bg-white/[0.02]">
            <Mail size={18} className="text-white/30 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-3">E-mail</h4>
            <a href="mailto:info@socialnow.nl" className="text-white font-bold text-sm hover:text-[#25D366] transition-colors">
              info@socialnow.nl
            </a>
          </div>
          <div className="p-8 md:p-10 bg-white/[0.02] border-y md:border-y-0 md:border-x border-white/[0.06]">
            <Phone size={18} className="text-white/30 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-3">Telefoon</h4>
            <a href="tel:+31637404577" className="text-white font-bold text-sm hover:text-[#25D366] transition-colors">
              +31 6 37 40 45 77
            </a>
          </div>
          <div className="p-8 md:p-10 bg-white/[0.02]">
            <MapPin size={18} className="text-white/30 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-3">Vestiging</h4>
            <p className="text-white font-bold text-sm leading-relaxed">
              Amstelstraat 43G<br />
              1017DA Amsterdam
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
