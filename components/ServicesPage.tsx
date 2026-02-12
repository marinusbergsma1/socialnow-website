
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu, Earth, Zap, Lightbulb, Palette, Target,
  Layers, Camera, Film, Box, Smartphone,
  Eye, ArrowRight, ChevronLeft, MessageCircle
} from 'lucide-react';
import Button from './Button';

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  span?: string; // grid span class
}

const services: ServiceItem[] = [
  {
    title: "AI Website Development",
    description: "Custom websites gebouwd met AI-assistentie. Sneller, slimmer en geoptimaliseerd voor conversie. Van concept tot lancering in weken, niet maanden.",
    icon: Cpu,
    color: "#61F6FD",
    span: "md:col-span-2",
  },
  {
    title: "Brand Strategy",
    description: "Strategische merkpositionering die resoneert met je doelgroep. Data-gedreven beslissingen, geen gokwerk.",
    icon: Target,
    color: "#25D366",
  },
  {
    title: "UX/UI Design",
    description: "Intuitive interfaces die converteren. Elke pixel telt, elke interactie is doordacht.",
    icon: Palette,
    color: "#F7E644",
  },
  {
    title: "Motion Design",
    description: "Van logo-animaties tot volledige brand videos. Dynamische content die je merk tot leven brengt op elk platform.",
    icon: Layers,
    color: "#25D366",
  },
  {
    title: "Short Form Content",
    description: "Scroll-stopping reels en shorts die viral gaan. Wij kennen de algoritmes en maken content die converteert.",
    icon: Film,
    color: "#F62961",
    span: "md:col-span-2",
  },
  {
    title: "3D & CGI",
    description: "Fotorealistische 3D-renders en CGI. Product visualisaties, environments en artist impressions op het hoogste niveau.",
    icon: Box,
    color: "#61F6FD",
  },
  {
    title: "Full-Stack Development",
    description: "Schaalbare web applicaties met moderne tech stacks. React, Node.js, TypeScript — performance en betrouwbaarheid.",
    icon: Earth,
    color: "#61F6FD",
  },
  {
    title: "Video Production",
    description: "Van conceptontwikkeling tot postproductie. Aftermovies, commercials, branded content en meer.",
    icon: Camera,
    color: "#F7E644",
    span: "md:col-span-2",
  },
  {
    title: "AI Automation",
    description: "Automatiseer repetitieve taken met AI. Chatbots, content generatie, data-analyse — meer output met minder effort.",
    icon: Zap,
    color: "#F62961",
  },
  {
    title: "Social Media",
    description: "Strategie, planning en uitvoering. Organisch groeien en betaald adverteren op alle platformen.",
    icon: Smartphone,
    color: "#25D366",
  },
  {
    title: "Creative Direction",
    description: "Creatieve leiding over campagnes en merkuitingen. Consistentie en kwaliteit op elk touchpoint.",
    icon: Eye,
    color: "#F62961",
  },
  {
    title: "Project Development",
    description: "Van idee tot realisatie. Wij begeleiden het volledige traject: planning, development, lancering en optimalisatie.",
    icon: Lightbulb,
    color: "#F7E644",
  },
];

const ServicesPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-36 pb-20">
      {/* Back button */}
      <div className="container mx-auto px-6 max-w-6xl mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <ChevronLeft size={14} />
          Terug
        </button>
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 max-w-6xl mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
          Onze Diensten
        </h1>
        <p className="text-gray-400 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
          Van strategie tot uitvoering. Wij combineren creativiteit met technologie om merken te bouwen die opvallen en resultaat leveren.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={i}
                className={`group relative rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-500 hover:border-white/20 ${service.span || ''}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* Subtle top accent */}
                <div
                  className="absolute top-0 left-6 right-6 h-[1px] opacity-20"
                  style={{ background: `linear-gradient(90deg, transparent, ${service.color}, transparent)` }}
                />

                <div className="flex items-start gap-4 md:gap-5">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${service.color}10`, border: `1px solid ${service.color}20` }}
                  >
                    <Icon size={20} style={{ color: service.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-black uppercase text-white tracking-tight mb-2 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Process section */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter mb-10 md:mb-14">
          Werkwijze
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { step: "01", title: "Discovery", desc: "Analyse van je merk, markt en doelgroep. We identificeren kansen en definiëren de strategie." },
            { step: "02", title: "Concept", desc: "Creatieve richting en ontwerp. Van moodboards tot wireframes en prototypes." },
            { step: "03", title: "Productie", desc: "Development, design en content creatie. Alles wordt gebouwd met oog voor detail." },
            { step: "04", title: "Lancering", desc: "Go-live, optimalisatie en doorlopende ondersteuning. Wij blijven betrokken na lancering." },
          ].map((phase, i) => (
            <div
              key={i}
              className="rounded-2xl md:rounded-3xl p-6 md:p-8 relative"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <span className="text-white/10 text-5xl md:text-6xl font-black absolute top-4 right-6 select-none">{phase.step}</span>
              <div className="relative z-10">
                <h4 className="text-base md:text-lg font-black uppercase text-white tracking-tight mb-3">{phase.title}</h4>
                <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">{phase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div
          className="rounded-2xl md:rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div>
            <h3 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight mb-2">
              Klaar om te starten?
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              Plan een vrijblijvend kennismakingsgesprek en ontdek wat wij voor jouw project kunnen betekenen.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="green" icon onClick={onOpenBooking} className="!h-[48px]">
              Kennismaken
            </Button>
            <a
              href="https://wa.me/31637404577"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
