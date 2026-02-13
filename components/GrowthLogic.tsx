
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { Activity, Shield, Zap, TrendingUp, Cpu, Database } from 'lucide-react';

const growthData = [
  { name: 'Jan', impact: 400, roi: 240 },
  { name: 'Feb', impact: 300, roi: 139 },
  { name: 'Mar', impact: 600, roi: 980 },
  { name: 'Apr', impact: 800, roi: 390 },
  { name: 'Mei', impact: 1200, roi: 480 },
  { name: 'Jun', impact: 1500, roi: 1200 },
];

const strategyData = [
  { subject: 'Branding', A: 120, fullMark: 150 },
  { subject: 'Strategy', A: 145, fullMark: 150 },
  { subject: 'Design', A: 150, fullMark: 150 },
  { subject: 'Growth', A: 110, fullMark: 150 },
  { subject: 'AI Ops', A: 130, fullMark: 150 },
];

const GrowthLogic: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const el = document.getElementById('growth-logic');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="growth-logic" className="py-24 md:py-48 bg-transparent relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00A3E0]/30 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-24 md:mb-40 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
            <Cpu size={14} className="text-[#F7E644]" />
            <span className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px]">MARKET LOGIC // ARCHITECTURE</span>
          </div>
          
          <h2 className="text-5xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] mb-12 text-white">
            GEEN <span className="text-[#F7E644]">GOKKEN.</span><br/>
            <span className="text-[#00A3E0]">ALLEEN DATA.</span>
          </h2>

          <p className="max-w-4xl mx-auto text-gray-400 text-lg md:text-3xl font-medium leading-tight italic">
            "Elk pixel heeft een reden. Elk besluit is onderbouwd. Wij bouwen merken op een fundament van <span className="text-white font-black italic">data, niet onderbuikgevoel.</span>"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 mb-32">
          {/* Chart 1: Market Impact */}
          <div className={`bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter mb-2">MARKT IMPACT</h3>
                <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-widest">Gecumuleerde Groei per Kwartaal</p>
              </div>
              <Activity className="text-[#25D366] opacity-40" />
            </div>
            
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#25D366" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#25D366" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                    itemStyle={{ color: '#25D366' }}
                  />
                  <Area type="monotone" dataKey="impact" stroke="#25D366" strokeWidth={4} fillOpacity={1} fill="url(#colorImpact)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Strategic Radar */}
          <div className={`bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter mb-2">STRATEGISCH DNA</h3>
                <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-widest">Kwaliteitswaarborging per discipline</p>
              </div>
              <Shield className="text-[#00A3E0] opacity-40" />
            </div>
            
            <div className="h-64 md:h-80 w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={strategyData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar name="Strategy" dataKey="A" stroke="#00A3E0" fill="#00A3E0" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Technical Data Readout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {[
            { label: 'OS UPTIME', value: '100%', icon: Database, color: '#25D366' },
            { label: 'ROI FACTOR', value: '12.4x', icon: Zap, color: '#F7E644' },
            { label: 'LATENCY', value: '4ms', icon: Cpu, color: '#00A3E0' },
            { label: 'CONVERSION', value: '98%', icon: TrendingUp, color: '#F62961' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className={`p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] flex flex-col items-center group hover:bg-white/[0.06] transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${500 + i * 100}ms` }}
            >
              <stat.icon size={24} className="mb-6" style={{ color: stat.color }} />
              <span className="text-3xl md:text-5xl font-black text-white mb-2" style={{ color: stat.color }}>{stat.value}</span>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GrowthLogic;
