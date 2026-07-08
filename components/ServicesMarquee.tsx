import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, Search, Target, Clapperboard, Sparkles, LineChart, LucideIcon } from 'lucide-react';

/**
 * ServicesMarquee — herzien als bento-grid van dienst-categorieën.
 * Vervangt de oude zwevende/scrollende pills-cloud door 6 overzichtelijke
 * categorie-tiles (zelfde stijl als de "WAT WIJ BOUWEN" bento).
 */

interface Category {
  title: string;
  icon: LucideIcon;
  color: string;
  services: string[];
}

const categories: Category[] = [
  {
    title: 'Websites & Development',
    icon: Code2,
    color: '#25D366',
    services: ['AI Website Development', 'Website & UI/UX Design', 'Full-Stack Development', 'Core Web Vitals', 'Digital Experience'],
  },
  {
    title: 'SEO',
    icon: Search,
    color: '#00A3E0',
    services: ['SEO-optimalisatie', 'Technische SEO', 'Lokale SEO', 'Zoekwoordstrategie', 'Link Building', 'Google Mijn Bedrijf'],
  },
  {
    title: 'Advertising',
    icon: Target,
    color: '#F7E644',
    services: ['Google Ads', 'Meta Ads', 'Performance Max', 'Google Shopping', 'Retargeting', 'Geo-targeting', 'Media Buying'],
  },
  {
    title: 'Content & Video',
    icon: Clapperboard,
    color: '#F62961',
    services: ['Short Form Content', 'Video & Content Production', 'Motion Design', '3D & CGI Design', 'Motion Branding', 'Social Media', 'Print & Offline Media'],
  },
  {
    title: 'Branding & Strategie',
    icon: Sparkles,
    color: '#25D366',
    services: ['Brand Strategy', 'Visual Identity', 'Verbal Identity', 'Creative Direction', 'Brand Psychology', 'Neuro-marketing', 'Campaign Design'],
  },
  {
    title: 'AI, Data & Optimalisatie',
    icon: LineChart,
    color: '#00A3E0',
    services: ['AI Automation', 'AI Coding & Algorithmic Ads', 'Analytics & Tracking', 'Conversie-optimalisatie', 'A/B Testing'],
  },
];

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  const { title, icon: Icon, color, services } = category;
  return (
    <div
      className="sn-warp-tile group relative p-6 md:p-7 rounded-xl transition-all duration-300"
      style={{ ['--cat' as string]: color } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="h-11 w-11 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors duration-300"
          style={{ backgroundColor: `${color}1A`, borderColor: `${color}40` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-white leading-none">{title}</h3>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#25D366]/70 mt-1">Inbegrepen</p>
        </div>
      </div>

      {/* Service-tags */}
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <span
            key={service}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] transition-colors duration-300 group-hover:border-white/[0.14]"
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-white/60 group-hover:text-white/85 font-bold uppercase tracking-[0.08em] text-[10px] transition-colors whitespace-nowrap">
              {service}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

const ServicesMarquee: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="expertise-ecosysteem" className="py-16 md:py-24 relative">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-[10px] font-mono text-[#25D366]">&lt;/&gt;</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
              Geen losse offertes // Alles inbegrepen
            </span>
          </div>
          <h2 className="font-black uppercase tracking-tighter text-white leading-none text-4xl md:text-6xl">
            ÉÉN VOORSTEL. <span className="text-[#25D366]">ALLES ERIN.</span>
          </h2>
          <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
            Website, CRM, content en advertenties werken als één systeem, aangestuurd via één AI chat. Dit zit er allemaal in.
          </p>
        </div>

        {/* Bento-grid van categorieën */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} category={cat} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/diensten')}
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/10 bg-white/5 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-[#25D366]/50 transition-all group"
          >
            Bekijk het volledige voorstel
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesMarquee;
