
import React, { useEffect, useState } from 'react';
import { 
  X, Shield, PieChart, TrendingUp, Zap, Fingerprint,
  Terminal, Network, Cpu, Code, Layers, Globe,
  Linkedin, Mail, ArrowRight, UserCheck, Activity,
  Database, HardDrive, BarChart3, Send, CircleDollarSign, Target
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import Button from './Button';
import ScrollTypewriter from './ScrollTypewriter';
import ProgressiveImage from './ProgressiveImage';
import { PixelGlobe } from './PixelGlobe';

interface TeamPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const teamDetailed = [
  { 
    id: 1, 
    name: "Marinus Bergsma", 
    role: "FOUNDER & CREATIVE ART DIRECTOR", 
    image: "https://i.ibb.co/Z65DDRMG/Marinus-Bergsma-V2.webp",
    bio: "Met meer dan 10 jaar ervaring in high-end design en digitale strategie. Marinus is de architect achter de visuele identiteit van SocialNow en bewaakt de creatieve integriteit van elk project.",
    expertise: [
      { subject: 'Strategy', A: 150 },
      { subject: 'VFX', A: 130 },
      { subject: 'Brand DNA', A: 145 },
      { subject: 'Ops', A: 110 },
      { subject: 'CGI', A: 140 }
    ],
    status: "CORE_ACTIVE",
    color: "#61F6FD",
    meta: { CPU: "98%", LATENCY: "12ms", UPTIME: "99.9%" }
  },
  { 
    id: 2, 
    name: "Jos Hollenberg", 
    role: "MARKETEER / SEO ENGINEER", 
    image: "https://i.ibb.co/BH6HsfGv/Jos-Hollenberg-1.webp",
    bio: "De data-engine van het team. Jos vertaalt complexe algoritmes naar vindbare strategieën en zorgt dat merken niet alleen mooi zijn, maar ook dominant in de zoekresultaten.",
    expertise: [
      { subject: 'SEO', A: 150 },
      { subject: 'Data', A: 145 },
      { subject: 'Ads', A: 120 },
      { subject: 'Logic', A: 130 },
      { subject: 'Growth', A: 140 }
    ],
    status: "DATA_SYNC",
    color: "#25D366",
    meta: { CPU: "84%", LATENCY: "5ms", UPTIME: "100%" }
  },
  { 
    id: 3, 
    name: "Sergio Jovovic", 
    role: "CREATIVE DIRECTOR", 
    image: "https://i.ibb.co/NgSnWFM6/Sergio-Jovovic.webp",
    bio: "Sergio brengt rauwe creativiteit naar het digitale spectrum. Zijn focus ligt op het doorbreken van conventies en het bouwen van visuele ecosystemen die blijven hangen.",
    expertise: [
      { subject: 'Art Dir', A: 145 },
      { subject: 'Motion', A: 140 },
      { subject: 'Concepts', A: 150 },
      { subject: 'Design', A: 135 },
      { subject: 'Story', A: 130 }
    ],
    status: "CREATIVE_RUN",
    color: "#F62961",
    meta: { CPU: "92%", LATENCY: "25ms", UPTIME: "99.4%" }
  },
  { 
    id: 4, 
    name: "Carmel Boon", 
    role: "VIDEO & MOTION EDITOR", 
    image: "https://i.ibb.co/zWVR40Qr/Carmel-Boon-V2.webp",
    bio: "Verantwoordelijk voor de high-velocity content. Carmel snijdt door de ruis met video-montages die geoptimaliseerd zijn voor aandacht en conversie op elk platform.",
    expertise: [
      { subject: 'Editing', A: 150 },
      { subject: 'Speed', A: 145 },
      { subject: 'Audio', A: 120 },
      { subject: 'Color', A: 130 },
      { subject: 'VFX', A: 110 }
    ],
    status: "RENDER_LIVE",
    color: "#F7E644",
    meta: { CPU: "95%", LATENCY: "40ms", UPTIME: "98.9%" }
  },
  { 
    id: 5, 
    name: "Emma Peperkamp", 
    role: "SOCIAL MEDIA STRATEGIST", 
    image: "https://i.ibb.co/8nTGbKXz/Emma-Peperkamp-V2.webp",
    bio: "De stem van het merk in de digitale arena. Emma beheerst de taal van algoritmes en trends, en vertaalt merkwaarden naar virale content die échte connecties bouwt op elk platform.",
    expertise: [
      { subject: 'Viral', A: 150 },
      { subject: 'Community', A: 140 },
      { subject: 'Content', A: 145 },
      { subject: 'Trends', A: 135 },
      { subject: 'Strategy', A: 130 }
    ],
    status: "COMM_STABLE",
    color: "#61F6FD",
    meta: { CPU: "89%", LATENCY: "30ms", UPTIME: "99.7%" }
  },
  { 
    id: 6, 
    name: "Nick Van Keulen", 
    role: "PERFORMANCE ENGINEER", 
    image: "https://i.ibb.co/nMgfTpCz/Nick-VK.webp",
    bio: "Performance specialist met een laserfocus op conversie. Nick beheert complexe Google Ads ecosystemen en zorgt dat elke klik wordt omgezet in meetbare waarde en schaalbare groei.",
    expertise: [
      { subject: 'SEM', A: 150 },
      { subject: 'Tracking', A: 145 },
      { subject: 'Analytics', A: 140 },
      { subject: 'ROI', A: 150 },
      { subject: 'Scaling', A: 135 }
    ],
    status: "PERF_SYNC",
    color: "#25D366",
    meta: { CPU: "96%", LATENCY: "8ms", UPTIME: "99.9%" }
  },
  {
    id: 7,
    name: "Sid van Kalken",
    role: "WEBDEVELOPER",
    image: "https://storage.googleapis.com/socialnow-team/Sid%20van%20Kalken.png",
    bio: "De architect achter de code. Sid bouwt razendsnelle, schaalbare web-ecosystemen die design naadloos verbinden met functionaliteit. Code is zijn taal, performance zijn religie.",
    expertise: [
      { subject: 'React', A: 150 },
      { subject: 'Next.js', A: 145 },
      { subject: 'Perf', A: 150 },
      { subject: 'Logic', A: 140 },
      { subject: 'Backend', A: 125 }
    ],
    status: "SYSTEM_ARCH",
    color: "#F7E644",
    meta: { CPU: "99%", LATENCY: "1ms", UPTIME: "100%" },
    imgCustomClass: "[&>img]:!object-[50%_10%] [&>img]:!scale-[1.3] group-hover:[&>img]:!scale-[1.35]"
  }
];

const TeamPage: React.FC<TeamPageProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fixed inset-0 z-[150] bg-black overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isClosing ? 'opacity-0 scale-95 blur-2xl' : 'opacity-100 scale-100 blur-0'
    }`}>
      
      <div className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`, backgroundSize: '80px 80px' }}></div>
      <div className="fixed top-0 left-0 w-full h-[2px] bg-[#61F6FD] shadow-[0_0_20px_#61F6FD] z-[160] opacity-30 animate-[scan-sweep_4s_linear_infinite]"></div>

      <div className="sticky top-0 z-[170] w-full px-6 py-6 md:px-12 md:py-8 flex items-center justify-between backdrop-blur-3xl border-b border-white/5 bg-black/80">
          <div className="flex items-center gap-6">
              <img src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp" alt="Logo" className="w-32 md:w-44" />
              <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-6">
                  <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></div>
                      <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">SYNC_V4.0</span>
                  </div>
              </div>
          </div>
          <button onClick={handleClose} className="group relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#F62961] transition-all overflow-hidden shadow-2xl">
             <X size={24} className="group-hover:rotate-90 transition-transform duration-500 relative z-10" />
             <div className="absolute inset-0 bg-gradient-to-tr from-[#F62961] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl pt-24 pb-48 px-6">
          <div className="text-center mb-32 relative px-4">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
                <Network size={16} className="text-[#61F6FD]" />
                <span className="text-white font-black uppercase tracking-[0.6em] text-[10px]">HUMAN ARCHITECTURE INDEX</span>
              </div>
              {/* PixelGlobe Beeldmerk */}
              <div className="absolute right-0 top-0 w-72 h-72 md:w-96 md:h-96 opacity-15 pointer-events-none">
                <PixelGlobe scaleMultiplier={0.25} type="all" opacity={0.5} glowEnabled={true} largeParticles={true} />
              </div>

              <h1 className="text-5xl md:text-9xl font-black uppercase text-white tracking-tighter leading-[0.8] mb-12">
                 THE <br/> <span className="text-white">TEAM</span>
              </h1>
              <p className="text-gray-400 font-bold text-xl md:text-3xl max-w-4xl mx-auto italic leading-tight">
                 "Gecentreerde intelligentie, schaalbaar talent. Wij zijn het besturingssysteem van moderne groei."
              </p>
          </div>

          <div className="space-y-24 md:space-y-48">
              {teamDetailed.map((member, idx) => (
                  <div key={member.id} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-stretch bg-[#050505] border border-white/10 rounded-[4rem] p-8 md:p-16 relative overflow-hidden group hover:border-white/20 transition-all duration-700 shadow-3xl`}>
                      <div className="w-full md:w-[40%] relative shrink-0">
                          <div className="relative w-full h-[450px] md:h-full min-h-[500px] rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl group-hover:border-white/30 transition-all duration-700">
                             <ProgressiveImage 
                                src={member.image} 
                                alt={member.name} 
                                className={`w-full h-full transition-transform duration-1000 group-hover:scale-105 ${(member as any).imgCustomClass || ""}`} 
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80"></div>
                             <div className="absolute bottom-8 left-8 right-8">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
                                        <div className="w-3 h-3 rounded-full bg-[#25D366] animate-pulse"></div>
                                        <div>
                                            <span className="text-[10px] font-mono text-white/40 block mb-1 uppercase tracking-widest">NODE_ID</span>
                                            <span className="text-xs font-mono text-white font-black uppercase">SN_CR_{member.id}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.entries(member.meta).map(([key, val]) => (
                                            <div key={key} className="bg-white/5 border border-white/5 p-2 rounded-xl text-center">
                                                <span className="text-[8px] text-white/30 block mb-1 uppercase tracking-tighter">{key}</span>
                                                <span className="text-[10px] text-white font-black uppercase">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </div>
                          </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-6">
                          <div className="space-y-12">
                              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                  <div className="w-full">
                                      <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-[0.9] mb-8 px-1 break-words">{member.name}</h2>
                                      <div className="flex items-center gap-6">
                                          <div className="h-[3px] w-16" style={{ backgroundColor: member.color }}></div>
                                          <span className="text-sm font-black uppercase tracking-[0.4em]" style={{ color: member.role === 'FOUNDER & CREATIVE ART DIRECTOR' ? member.color : '#61F6FD' }}>{member.role}</span>
                                      </div>
                                  </div>
                                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
                                      <div className="flex items-center gap-3 mb-3">
                                          <Activity size={16} className="text-[#25D366]" />
                                          <span className="text-[10px] font-black text-[#25D366] uppercase tracking-[0.2em]">{member.status}</span>
                                      </div>
                                      <div className="flex gap-1 items-end h-6">
                                          {[0.3, 0.8, 0.5, 0.9, 0.4, 0.7, 0.6].map((h, i) => (
                                              <div key={i} className="w-1.5 bg-white/20 rounded-full" style={{ height: `${h * 100}%` }}></div>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                              <p className="text-gray-400 text-xl md:text-3xl font-medium leading-tight max-w-4xl border-l-4 border-white/10 pl-10 italic">
                                 {member.bio}
                              </p>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-white/10">
                                  <div className="h-80 relative bg-black/40 rounded-[3rem] border border-white/10 p-6 group/radar">
                                      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                                          <BarChart3 size={18} className="text-[#61F6FD]" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">NEURAL_METRICS</span>
                                      </div>
                                      <ResponsiveContainer width="100%" height="100%">
                                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={member.expertise}>
                                              <PolarGrid stroke="#333" />
                                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10, fontWeight: '900' }} />
                                              <Radar name={member.name} dataKey="A" stroke={member.color} fill={member.color} fillOpacity={0.6} />
                                          </RadarChart>
                                      </ResponsiveContainer>
                                  </div>
                                  <div className="flex flex-col justify-center gap-10">
                                      <div className="flex flex-wrap items-center gap-6">
                                          <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 hover:border-[#61F6FD] transition-all cursor-pointer group/link shadow-xl">
                                              <Linkedin size={24} className="text-white/60 group-hover/link:text-white transition-colors" />
                                          </div>
                                          <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 hover:border-[#F62961] transition-all cursor-pointer group/link shadow-xl">
                                              <Mail size={24} className="text-white/60 group-hover/link:text-white transition-colors" />
                                          </div>
                                          <a href="https://wa.me/31637404577" target="_blank" className="flex-1 flex items-center justify-center gap-5 h-16 rounded-[1.5rem] bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366] transition-all group/chat shadow-xl">
                                              <Terminal size={20} className="text-[#25D366]/60 group-hover/chat:text-[#25D366] transition-colors" />
                                              <span className="text-xs font-black uppercase tracking-widest text-[#25D366]">ESTABLISH LINK</span>
                                          </a>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          <div className="mt-48 mb-24 flex justify-center px-4 overflow-visible">
              <div className="w-full max-w-6xl bg-white/[0.02] border border-white/10 rounded-[4rem] p-10 md:p-24 relative overflow-visible group transition-all duration-1000 scale-100 opacity-100 shadow-3xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#61F6FD]/5 via-transparent to-[#F62961]/5 opacity-40 rounded-[4rem]"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16 overflow-visible">
                    <div className="flex-1 text-center md:text-left z-30">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
                            <Shield size={14} className="text-[#61F6FD]" />
                            <span className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px]">INTEGRATED BRAND OS</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-8xl font-black uppercase text-white tracking-tighter leading-[0.8] mb-12">
                            LET'S GET <br/> <span className="text-[#25D366]">SOCIALNOW</span>
                        </h2>
                        
                        <p className="text-gray-400 font-bold text-lg md:text-2xl leading-tight mb-12">
                            Wij vertalen rauwe ambitie naar <span className="text-white">geïntegreerde visuele ecosystemen</span>. Onze strategie is gecodeerd voor dominantie.
                        </p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-12">
                            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                                <Shield size={18} className="text-[#61F6FD]" />
                                <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Brand Protection</span>
                            </div>
                            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                                <PieChart size={18} className="text-[#25D366]" />
                                <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Market Analytics</span>
                            </div>
                        </div>

                        <Button variant="green" icon={true} IconComponent={Send} onClick={handleClose} className="!px-14 !text-lg shadow-[0_0_30px_rgba(37,211,102,0.2)]">Neem Contact Op</Button>
                    </div>
                    
                </div>
              </div>
          </div>

          {/* STATS GRID - ANIMATED STAGGERED */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                  { icon: TrendingUp, color: "#25D366", label: "Impact", value: "+124%", desc: "Groei Rate" },
                  { icon: CircleDollarSign, color: "#F7E644", label: "ROI", value: "€14.5k", desc: "Gemiddeld / mnd" },
                  { icon: BarChart3, color: "#F62961", label: "Conversion", value: "4.8%", desc: "Opt-in Rate" },
                  { icon: Target, color: "#61F6FD", label: "Performance", value: "99.8%", desc: "Peak Efficiency" }
              ].map((stat, i) => (
                <div 
                    key={i} 
                    className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 group hover:border-white/20 transition-all shadow-3xl animate-fade-in-up"
                    style={{ animationDelay: `${0.5 + (i * 0.1)}s` }}
                >
                    <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2 block">{stat.label}</span>
                    <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.desc}</div>
                </div>
              ))}
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
