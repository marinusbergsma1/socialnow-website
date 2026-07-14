
import React, { useEffect, useState } from 'react';
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
    'Van campagnes voor Amsterdam Light Festival en AZ Alkmaar tot een eigen AI-studio. Marinus richtte SocialNow op in 2021 en bewaakt elk project persoonlijk. Voor de uitvoering schakelt hij per opdracht de scherpste specialisten en zzp\'ers uit zijn netwerk in — precies de juiste vakmensen, precies wanneer jouw project erom vraagt. Geen accountmanager, geen ruis: je werkt direct met de maker.',
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
    copy: 'Geen junioren die op jouw project leren. Ervaren zzp-specialisten uit ons netwerk, elk in hun eigen vakgebied — precies ingezet waar jouw project ze nodig heeft, nul overhead.',
  },
];

const tickerValues = [
  'GEEN POESPAS',
  'DIRECTE LIJNEN',
  'AI-FIRST',
  'ELKE DAG POSTEN',
  'SINDS 2021',
  '500+ PROJECTEN',
  'AMSTERDAM',
];

/** Dagen tot het 5-jarig bestaan (1 november 2026). */
const daysToFive = () => {
  const target = new Date('2026-11-01T00:00:00+01:00').getTime();
  return Math.max(0, Math.ceil((target - Date.now()) / 86_400_000));
};

const TeamPage: React.FC<TeamPageProps> = ({ onOpenBooking }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const activeMember = crew[active];

  useSEO({
    title: 'Team',
    description:
      'Een compacte kern in Amsterdam plus een flexibel netwerk van zzp-specialisten — developers, motion, ads en design — per project ingezet en versterkt door één AI-systeem. Geen managementlagen, geen vaste overhead, direct contact met de makers.',
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
      {/* Back button */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <ChevronLeft size={14} />
          Terug
        </button>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto pb-12 px-6">
        {/* 1. HERO — VHS-titel + stats + countdown */}
        <div className="mb-14 md:mb-20 animate-fade-in-up">
          <span className="font-mono text-[10px] tracking-[0.4em] text-[#25D366] uppercase block mb-6">
            /// CREW_DOSSIER · AMSTERDAM
          </span>
          <h1 className="sn-vhs text-5xl md:text-8xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
            EEN NETWERK<br />VAN <span className="text-[#25D366]">SPECIALISTEN</span>
          </h1>
          <p className="text-gray-400 font-bold text-lg md:text-2xl max-w-2xl leading-tight mb-8">
            Een compacte kern in Amsterdam plus een flexibel netwerk van specialisten en zzp'ers. Per project schakelen we
            precies de juiste vakmensen in — developers, motion, ads, design — versterkt door één AI-systeem dat het zware werk doet.
            Geen managementlagen, geen vaste overhead: je betaalt voor talent, niet voor een kantoor vol mensen.
          </p>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {['500+ PROJECTEN', 'SINDS 2021', 'NETWERK VAN ZZP-SPECIALISTEN', 'PER PROJECT GESCHAALD'].map((stat) => (
              <span
                key={stat}
                className="sn-warp-tile rounded-full px-4 py-2 md:px-5 md:py-2.5 font-mono text-[9px] md:text-[10px] tracking-widest text-white/80 uppercase"
              >
                {stat}
              </span>
            ))}
            <span className="sn-warp-tile rounded-full px-4 py-2 md:px-5 md:py-2.5 font-mono text-[9px] md:text-[10px] tracking-widest uppercase !border-[#F7E644]/30 text-[#F7E644]" style={{ '--sn-glow': 'rgba(247,230,68,0.45)' } as React.CSSProperties}>
              {daysToFive()} DAGEN TOT 5 JAAR SOCIALNOW
            </span>
          </div>
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

        {/* 3. WAARDEN-TICKER — geen glas hierbinnen (transform-wrapper) */}
        <div className="relative overflow-hidden mb-16 md:mb-24 py-4 border-y border-white/10">
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'tickerSlide 32s linear infinite', width: 'max-content' }}
          >
            {[0, 1].map((dup) => (
              <span key={dup} className="flex items-center" aria-hidden={dup === 1}>
                {tickerValues.map((v, i) => (
                  <span key={`${dup}-${v}`} className="flex items-center">
                    <span className="font-black uppercase tracking-tighter text-2xl md:text-4xl text-white/90 px-4">
                      {v}
                    </span>
                    <span
                      className="text-2xl md:text-4xl px-4"
                      style={{ color: ['#25D366', '#00A3E0', '#F62961', '#F7E644'][i % 4] }}
                    >
                      ·
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* 4. CREW INDEX — interactief dossier: lijst links, live preview rechts */}
        <div className="mb-16 md:mb-24">
          <div className="mb-8 md:mb-12">
            <div className="flex items-end justify-between">
              <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
                DE <span className="text-[#00A3E0]">SPECIALISTEN</span>
              </h2>
              <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase hidden md:block">
                INDEX 02 → 08
              </span>
            </div>
            <p className="text-gray-400 font-medium text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
              De vakmensen uit ons netwerk waarmee we het vaakst werken. Elk een eigen specialisme, elk zelfstandig ondernemer of vaste partner — per opdracht ingezet, nooit als overhead.
            </p>
          </div>

          {/* Desktop: index + preview */}
          <div className="hidden lg:grid grid-cols-[1fr_1.05fr] gap-6 items-stretch">
            <div className="sn-warp-tile rounded-[2rem] p-3 flex flex-col justify-center">
              {crew.map((member, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={member.id}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className={`group/row flex items-center gap-5 text-left px-5 py-4 rounded-2xl transition-colors duration-300 ${
                      isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <span
                      className="w-1 self-stretch rounded-full transition-all duration-300"
                      style={{ background: isActive ? member.color : 'rgba(255,255,255,0.08)' }}
                    ></span>
                    <span className="font-mono text-[11px] text-white/25 w-7 shrink-0">
                      {String(index + 2).padStart(2, '0')}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span
                        className={`block font-black uppercase tracking-tight text-lg leading-none truncate transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-white/55'
                        }`}
                      >
                        {member.name}
                      </span>
                      <span className="block text-[10px] font-bold uppercase tracking-widest mt-1.5 text-white/30">
                        {member.role}
                      </span>
                    </span>
                    <span
                      className="font-mono text-[9px] tracking-widest px-2.5 py-1 rounded-md border shrink-0 transition-opacity duration-300"
                      style={{
                        borderColor: `${member.color}55`,
                        color: member.color,
                        opacity: isActive ? 1 : 0.35,
                      }}
                    >
                      {member.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="sn-warp-tile rounded-[2rem] overflow-hidden relative min-h-[560px]" style={{ '--sn-glow': `${activeMember.color}66` } as React.CSSProperties}>
              <div key={activeMember.id} className="absolute inset-0 animate-fade-in group">
                <ProgressiveImage
                  src={activeMember.image}
                  alt={activeMember.name}
                  className={`w-full h-full absolute inset-0 ${activeMember.imgCustomClass || ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                <span
                  className="absolute top-6 left-6 font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-md bg-black/70 border"
                  style={{ borderColor: `${activeMember.color}55`, color: activeMember.color }}
                >
                  {activeMember.tag}
                </span>
                <span className="absolute top-6 right-6 font-mono text-[11px] text-white/30">
                  {String(active + 2).padStart(2, '0')} / 08
                </span>
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tighter leading-none mb-2">
                    {activeMember.name}
                  </h3>
                  <p
                    className="text-[11px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: activeMember.color }}
                  >
                    {activeMember.role}
                  </p>
                  <p className="text-gray-300 text-sm font-medium leading-snug max-w-sm">
                    {activeMember.line}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobiel: kaart-grid */}
          <div className="grid lg:hidden grid-cols-2 gap-3">
            {crew.map((member, index) => (
              <div
                key={member.id}
                className="sn-warp-tile group relative h-[260px] rounded-[1.5rem] overflow-hidden"
                style={{ '--sn-glow': `${member.color}66` } as React.CSSProperties}
              >
                <ProgressiveImage
                  src={member.image}
                  alt={member.name}
                  className={`w-full h-full absolute inset-0 ${member.imgCustomClass || ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-90"></div>
                <span
                  className="absolute top-3 left-3 z-10 font-mono text-[8px] tracking-widest px-2 py-1 rounded-md bg-black/70 border"
                  style={{ borderColor: `${member.color}55`, color: member.color }}
                >
                  {member.tag}
                </span>
                <span className="absolute top-3 right-3 z-10 font-mono text-[9px] text-white/25">
                  {String(index + 2).padStart(2, '0')}
                </span>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h3 className="text-sm font-black uppercase text-white tracking-tight leading-none mb-1.5">
                    {member.name}
                  </h3>
                  <p className="text-[7px] font-bold uppercase tracking-widest" style={{ color: member.color }}>
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Talent-kaart */}
          <button
            onClick={handleCta}
            className="sn-warp-tile group relative w-full mt-6 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden !border-2 !border-dashed !border-[#25D366]/30 hover:!border-[#25D366] transition-all duration-500 flex items-center justify-center gap-5 py-8 md:py-10 cursor-pointer"
          >
            <span className="absolute top-3 left-4 font-mono text-[8px] md:text-[10px] tracking-widest text-[#25D366]/70">
              OPEN_SLOT
            </span>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] group-hover:scale-110 transition-transform">
              <Plus size={16} className="text-black" strokeWidth={3} />
            </div>
            <div className="text-left">
              <h3 className="text-sm md:text-xl font-black uppercase text-white leading-none group-hover:text-[#25D366] transition-colors">
                GROW WITH US
              </h3>
              <p className="text-gray-400 font-bold text-[8px] md:text-[10px] mt-1.5">
                Amsterdam's snelstgroeiende creative studio zoekt talent.
              </p>
            </div>
          </button>
        </div>

        {/* 5. 8 MENSEN + 1 AI-SYSTEEM */}
        <div className="mb-16 md:mb-24">
          <div className="max-w-3xl mb-10 md:mb-14">
            <span className="font-mono text-[10px] tracking-[0.4em] text-[#00A3E0] uppercase block mb-5">
              /// WAAROM_KLEIN_WERKT
            </span>
            <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.9]">
              KERN <span className="text-[#25D366]">+ NETWERK + AI</span>
            </h2>
            <p className="text-gray-400 font-bold text-base md:text-xl mt-5 leading-tight">
              Een klein vast team, een groot netwerk van zzp-specialisten en één AI-systeem. Daarom leveren wij meer dan een bureau van veertig man — zonder de overhead van veertig man.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.tag}
                className="sn-warp-tile rounded-[1.5rem] md:rounded-[2rem] p-7 md:p-9 animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.1}s`, '--sn-glow': `${pillar.color}66` } as React.CSSProperties}
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

        {/* 6. CTA */}
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

    </div>
  );
};

export default TeamPage;
