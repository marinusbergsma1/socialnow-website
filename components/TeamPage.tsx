
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Send, Zap, MessagesSquare, UserCheck } from 'lucide-react';
import Button from './Button';
import ProgressiveImage from './ProgressiveImage';
import { useSEO } from '../hooks/useSEO';

interface TeamPageProps {
  /** Optioneel: opent de booking-popup. */
  onOpenBooking?: () => void;
}

const BASE = import.meta.env.BASE_URL;

const founder = {
  name: 'Marinus Bergsma',
  role: 'Founder & Creative Art Director',
  tag: 'FOUNDER_OS',
  color: '#F7E644',
  image: `${BASE}images/Marinus-Bergsma-V2.webp`,
  quote:
    '"Ik startte SocialNow met één overtuiging: de beste merken worden gebouwd door mensen die technologie omarmen, niet vrezen."',
  sub:
    'Van Amsterdam Light Festival en AZ Alkmaar tot een eigen studio. Marinus richtte SocialNow op in 2021 en bewaakt elk concept persoonlijk, zonder accountmanager ertussen.',
};

interface CrewMember {
  id: number;
  name: string;
  role: string;
  tag: string;
  line: string;
  color: string;
  image: string;
  imgCustomClass?: string;
}

const crew: CrewMember[] = [
  {
    id: 2,
    name: 'Jos Hollenberg',
    role: 'Marketeer / SEO Engineer',
    tag: 'SEO_ENGINE',
    line: 'Zorgt dat je gevonden wordt vóór je concurrent.',
    color: '#25D366',
    image: `${BASE}images/Jos-Hollenberg-1.webp`,
  },
  {
    id: 3,
    name: 'Sergio Jovovic',
    role: 'Creative Marketing Designer',
    tag: 'DESIGN_LAB',
    line: 'Maakt merken die je niet kunt negeren.',
    color: '#F62961',
    image: `${BASE}images/Sergio-Jovovic.webp`,
  },
  {
    id: 4,
    name: 'Carmel Boon',
    role: 'Video & Motion Editor',
    tag: 'MOTION_LAB',
    line: 'Knipt aandacht uit elke seconde beeld.',
    color: '#F7E644',
    image: `${BASE}images/Carmel-Boon-V2.webp`,
  },
  {
    id: 5,
    name: 'Emma Peperkamp',
    role: 'Social Media Strategist',
    tag: 'SOCIAL_OPS',
    line: 'Spreekt vloeiend algoritme.',
    color: '#00A3E0',
    image: `${BASE}images/Emma-Peperkamp-V2.webp`,
  },
  {
    id: 6,
    name: 'Nick van Keulen',
    role: 'Google Ads Expert',
    tag: 'ADS_OPS',
    line: 'Elke euro adspend moet zichzelf terugverdienen.',
    color: '#25D366',
    image: `${BASE}images/Nick-VK.webp`,
  },
  {
    id: 7,
    name: 'Sid van Kalken',
    role: 'Webdeveloper',
    tag: 'WEB_STACK',
    line: 'Bouwt sites die laden voor je knippert.',
    color: '#F62961',
    image: `${BASE}images/Sid-van-Kalken.webp`,
    imgCustomClass:
      '[&>img]:!object-[50%_10%] [&>img]:!scale-[1.3] group-hover:[&>img]:!scale-[1.35]',
  },
  {
    id: 8,
    name: 'Michel Pluister',
    role: 'Software Engineer',
    tag: 'CODE_CORE',
    line: 'Koppelt je CRM, chat en data aan elkaar.',
    color: '#00A3E0',
    image: `${BASE}images/Michel-Pluister.webp`,
  },
];

const pillars = [
  {
    tag: 'DIRECT_LINE',
    icon: MessagesSquare,
    color: '#25D366',
    title: 'Geen tussenlagen',
    copy: 'Je praat direct met de specialist die je werk maakt. Vandaag gevraagd, vandaag geschakeld.',
  },
  {
    tag: 'AI_CORE',
    icon: Zap,
    color: '#00A3E0',
    title: 'AI doet het zware werk',
    copy: 'Je website, CRM, content en advertenties: allemaal samen in 1 overzichtelijke AI chat. Wij nemen de beslissingen, het systeem doet de rest.',
  },
  {
    tag: 'SENIOR_ONLY',
    icon: UserCheck,
    color: '#F62961',
    title: 'Alleen specialisten',
    copy: 'Geen junioren die op jouw project leren. Acht mensen, acht vakgebieden, nul overhead.',
  },
];

const TeamPage: React.FC<TeamPageProps> = ({ onOpenBooking }) => {
  const navigate = useNavigate();

  useSEO({
    title: 'Team',
    description:
      'Het team achter de AI: acht specialisten in Amsterdam plus één AI-systeem dat het zware werk doet. Geen managementlagen, geen ruis — direct contact met de makers.',
    path: '/team',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCta = () => {
    onOpenBooking?.();
  };

  return (
    <div className="min-h-screen text-white pt-28 md:pt-36 pb-20 relative">
      {/* Subtiel raster + scanlijn — terminal-esthetiek */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#25D366] shadow-[0_0_20px_#25D366] z-0 opacity-20 animate-[scan-sweep_5s_linear_infinite] pointer-events-none"></div>

      {/* Back button */}
      <div className="relative z-10 container mx-auto px-6 max-w-6xl mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <ChevronLeft size={14} />
          Terug
        </button>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl pb-12 px-6">
        {/* 1. HERO — compact */}
        <div className="mb-16 md:mb-24 animate-fade-in-up">
          <span className="font-mono text-[10px] tracking-[0.4em] text-[#25D366] uppercase block mb-6">
            /// 8_SPECIALISTEN + 1_AI
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
            HET TEAM<br />ACHTER <span className="text-[#25D366]">DE AI</span>
          </h1>
          <p className="text-gray-400 font-bold text-lg md:text-2xl max-w-2xl leading-tight">
            Acht specialisten in Amsterdam. Eén AI-systeem dat het zware werk doet. Geen managementlagen, geen ruis.
          </p>
        </div>

        {/* 2. FOUNDER */}
        <div className="mb-16 md:mb-24 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="sn-warp-tile rounded-[2rem] md:rounded-[3rem] overflow-hidden">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="relative w-full md:w-[42%] h-[380px] md:h-auto md:min-h-[520px] shrink-0 group">
                <ProgressiveImage
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80"></div>
                <span
                  className="absolute top-5 left-5 font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-md bg-black/70 border"
                  style={{ borderColor: `${founder.color}55`, color: founder.color }}
                >
                  {founder.tag}
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center p-8 md:p-14">
                <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-4 block">01 / FOUNDER</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none mb-3">
                  {founder.name}
                </h2>
                <p className="text-[#F7E644] font-bold tracking-widest text-[10px] uppercase mb-8">{founder.role}</p>
                <p className="text-white text-xl md:text-3xl font-bold italic leading-tight mb-6">
                  {founder.quote}
                </p>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-lg">
                  {founder.sub}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CREW GRID */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
              DE <span className="text-[#00A3E0]">CREW</span>
            </h2>
            <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase hidden md:block">
              INDEX 02 → 08
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {crew.map((member, index) => (
              <div
                key={member.id}
                className="sn-warp-tile group relative h-[260px] md:h-[380px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.06}s` }}
              >
                <ProgressiveImage
                  src={member.image}
                  alt={member.name}
                  className={`w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105 ${member.imgCustomClass || ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-90"></div>
                <span
                  className="absolute top-3 left-3 md:top-5 md:left-5 z-10 font-mono text-[8px] md:text-[10px] tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-md bg-black/70 border"
                  style={{ borderColor: `${member.color}55`, color: member.color }}
                >
                  {member.tag}
                </span>
                <span className="absolute top-3 right-3 md:top-5 md:right-5 z-10 font-mono text-[9px] md:text-[11px] text-white/25">
                  {String(index + 2).padStart(2, '0')}
                </span>
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 z-10">
                  <h3 className="text-sm md:text-xl font-black uppercase text-white tracking-tight leading-none mb-1.5">
                    {member.name}
                  </h3>
                  <p
                    className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest mb-2 transition-colors"
                    style={{ color: member.color }}
                  >
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-[9px] md:text-[11px] font-medium leading-snug md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0 transition-all duration-500">
                    {member.line}
                  </p>
                </div>
              </div>
            ))}

            {/* Talent-kaart */}
            <button
              onClick={handleCta}
              className="group relative h-[260px] md:h-[380px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-2 border-dashed border-[#25D366]/30 hover:border-[#25D366] bg-white/[0.02] transition-all duration-500 flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <span className="absolute top-3 left-3 md:top-5 md:left-5 font-mono text-[8px] md:text-[10px] tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-md bg-black/70 border border-[#25D366]/30 text-[#25D366]">
                OPEN_SLOT
              </span>
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#25D366] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(37,211,102,0.4)] group-hover:scale-110 transition-transform">
                <Plus size={16} className="text-black" strokeWidth={3} />
              </div>
              <h3 className="text-sm md:text-xl font-black uppercase text-white mb-1 leading-none group-hover:text-[#25D366] transition-colors">
                GROW WITH US
              </h3>
              <p className="text-gray-400 font-bold text-[8px] md:text-[10px] max-w-[80%] leading-relaxed">
                Amsterdam's snelstgroeiende creative studio zoekt talent.
              </p>
            </button>
          </div>
        </div>

        {/* 4. 8 MENSEN + 1 AI-SYSTEEM */}
        <div className="mb-16 md:mb-24">
          <div className="max-w-3xl mb-10 md:mb-14">
            <span className="font-mono text-[10px] tracking-[0.4em] text-[#00A3E0] uppercase block mb-5">
              /// WAAROM_KLEIN_WERKT
            </span>
            <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.9]">
              8 MENSEN <span className="text-[#25D366]">+ 1 AI-SYSTEEM</span>
            </h2>
            <p className="text-gray-400 font-bold text-base md:text-xl mt-5 leading-tight">
              Daarom leveren wij meer dan een bureau van veertig man.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.tag}
                className="sn-warp-tile rounded-[1.5rem] md:rounded-[2rem] p-7 md:p-9 animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-11 h-11 rounded-xl bg-black border flex items-center justify-center"
                    style={{ borderColor: `${pillar.color}44` }}
                  >
                    <pillar.icon size={18} style={{ color: pillar.color }} />
                  </div>
                  <span className="font-mono text-[9px] tracking-widest" style={{ color: pillar.color }}>
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase text-white tracking-tight mb-3">
                  {pillar.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{pillar.copy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. CTA */}
        <div className="sn-warp-tile rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/5 via-transparent to-[#00A3E0]/5 pointer-events-none"></div>
          <div className="relative z-10">
            <span className="font-mono text-[10px] tracking-[0.4em] text-[#25D366] uppercase block mb-6">
              /// ESTABLISH_LINK
            </span>
            <h2 className="text-4xl md:text-7xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
              KENNIS<wbr />MAKEN?
            </h2>
            <p className="text-gray-400 font-bold text-base md:text-xl max-w-xl mx-auto leading-tight mb-10">
              Plan een gesprek met Marinus. Binnen 30 minuten weet je wat AI voor jouw merk kan doen.
            </p>
            <div className="flex flex-col items-center gap-6">
              <Button variant="green" icon IconComponent={Send} onClick={handleCta} triggerOnHover className="!px-12 !text-base shadow-[0_0_30px_rgba(37,211,102,0.2)]">
                Plan een gesprek
              </Button>
              <a
                href="https://wa.me/31637404577"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] tracking-widest text-white/40 uppercase hover:text-[#25D366] transition-colors"
              >
                OF APP DIRECT → +31 6 37 40 45 77
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan-sweep {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default TeamPage;
