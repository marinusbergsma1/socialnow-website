
import React, { useRef } from 'react';
import { TeamMember } from '../types';
import { Plus, Shield, PieChart, Activity, Cpu, Terminal } from 'lucide-react';
import ScrollTypewriter from './ScrollTypewriter';
import Button from './Button';
import ProgressiveImage from './ProgressiveImage';

interface TeamItem extends Partial<TeamMember> {
  type?: 'member' | 'hiring';
  specialRole?: boolean;
  imgCustomClass?: string;
}

interface TeamProps {
  onOpenBooking?: () => void;
}

const team: TeamItem[] = [
  { 
    id: 1, 
    type: 'member',
    name: "Marinus Bergsma", 
    role: "Founder & Creative Art Director", 
    specialRole: true,
    image: "https://i.ibb.co/Z65DDRMG/Marinus-Bergsma-V2.webp" 
  },
  { 
    id: 2, 
    type: 'member',
    name: "Jos Hollenberg", 
    role: "Marketeer / SEO Engineer", 
    image: "https://i.ibb.co/BH6HsfGv/Jos-Hollenberg-1.webp" 
  },
  { 
    id: 3, 
    type: 'member',
    name: "Sergio Jovovic", 
    role: "Creative Marketing Designer", 
    image: "https://i.ibb.co/NgSnWFM6/Sergio-Jovovic.webp" 
  },
  { 
    id: 4, 
    type: 'member',
    name: "Carmel Boon", 
    role: "Video & Motion Editor", 
    image: "https://i.ibb.co/zWVR40Qr/Carmel-Boon-V2.webp" 
  },
  { 
    id: 5, 
    type: 'member',
    name: "Emma Peperkamp", 
    role: "Social Media Strategist", 
    image: "https://i.ibb.co/8nTGbKXz/Emma-Peperkamp-V2.webp" 
  },
  {
    id: 6,
    type: 'member',
    name: "Nick van Keulen",
    role: "Google Ads Expert", 
    image: "https://i.ibb.co/nMgfTpCz/Nick-VK.webp"
  },
  {
    id: 7,
    type: 'member',
    name: "Sid van Kalken",
    role: "Webdeveloper",
    image: "https://storage.googleapis.com/socialnow-team/Sid%20van%20Kalken.png",
    imgCustomClass: "[&>img]:!object-[50%_10%] [&>img]:!scale-[1.3] group-hover:[&>img]:!scale-[1.35]"
  }
];

const Team: React.FC<TeamProps> = ({ onOpenBooking }) => {
  const founder = team.find(m => m.name === "Marinus Bergsma");
  const otherMembers = team.filter(m => m.name !== "Marinus Bergsma" && m.type === 'member');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <section id="team" className="py-12 md:py-48 bg-transparent text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(37, 211, 102, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(37, 211, 102, 0.4) 1px, transparent 1px)`, 
          backgroundSize: '40px 40px', 
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)', 
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
          animation: 'team-grid-scroll 20s linear infinite'
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-24 scroll-reveal">
          <h2 className="text-3xl md:text-8xl font-black uppercase mb-6 flex justify-center items-center tracking-tighter leading-none flex-wrap">
            <span className="inline-flex items-center whitespace-nowrap">
              <span className="text-[#F7E644] mr-2 md:mr-6 leading-none">"</span>
              WIJ ZIJN SOCIALNOW!
              <span className="text-[#F7E644] ml-2 md:ml-6 leading-none">"</span>
            </span>
          </h2>
        </div>

        {/* Founder Section Wrapped in OS Card */}
        {founder && (
            <div className="mb-12 md:mb-24 flex justify-center px-0 md:px-4">
                <div className="w-full max-w-6xl bg-white/[0.02] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#5BA4F5]/5 via-transparent to-[#F62961]/5 opacity-40"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        <div className="w-full md:w-[40%] h-[350px] md:h-[500px] relative rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shrink-0">
                            <ProgressiveImage 
                                src={founder.image || ""} 
                                alt={founder.name || ""} 
                                className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-6 left-6">
                                <h3 className="text-xl md:text-2xl font-black uppercase text-white leading-none">{founder.name}</h3>
                                <p className="text-[#F7E644] font-bold tracking-widest text-[9px] md:text-[10px] uppercase mt-2">{founder.role}</p>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-3xl md:text-5xl font-black uppercase text-white mb-6 tracking-tighter leading-none">
                              Marinus Bergsma
                            </h3>
                            
                            <p className="text-gray-400 text-base md:text-2xl leading-relaxed mb-6 md:mb-12 font-medium italic">
                                "Onze missie: merken laten groeien door creatieve kracht en slimme technologie te combineren."
                            </p>
                            
                            <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="w-full md:w-auto">Kennismaken</Button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto px-1 md:px-0">
            {otherMembers.map((member) => (
                <div key={member.id} className="group relative h-[240px] md:h-[400px] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-white/30 hover:-translate-y-2">
                    <ProgressiveImage 
                        src={member.image || ""} 
                        alt={member.name || ""} 
                        className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${member.imgCustomClass || ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 pr-4">
                        <h4 className="text-sm md:text-xl font-black uppercase text-white mb-1 tracking-tight leading-none">{member.name}</h4>
                        <div className="flex items-center gap-2">
                            <div className="w-2 md:w-4 h-[1px] bg-[#5BA4F5]"></div>
                            <p className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-[#5BA4F5] transition-colors line-clamp-1">{member.role}</p>
                        </div>
                    </div>
                </div>
            ))}
            <div className="group relative h-[240px] md:h-[400px] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border-2 border-dashed border-[#25D366]/30 hover:border-[#25D366] bg-white/[0.02] transition-all duration-500 flex flex-col items-center justify-center text-center cursor-pointer" onClick={onOpenBooking}>
               <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#25D366] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(37,211,102,0.4)] group-hover:scale-110 transition-transform"><Plus size={16} className="text-black" strokeWidth={3} /></div>
               <h4 className="text-sm md:text-xl font-black uppercase text-white mb-1 leading-none group-hover:text-[#25D366] transition-colors">JOIN THE TEAM</h4>
               <p className="text-gray-400 font-bold text-[8px] md:text-[10px] max-w-[80%] leading-relaxed">Sluit je aan bij het OS.</p>
            </div>
        </div>
      </div>
      <style>{`
        @keyframes team-grid-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 80px 80px; }
        }
      `}</style>
    </section>
  );
};

export default Team;
