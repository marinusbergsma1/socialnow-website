import React from 'react';
import { Code2 } from 'lucide-react';

interface TechItem {
  name: string;
  category: string;
  color: string;
}

const techStack: TechItem[] = [
  { name: "React", category: "FRONTEND", color: "#00A3E0" },
  { name: "TypeScript", category: "TAAL", color: "#00A3E0" },
  { name: "Tailwind CSS", category: "STYLING", color: "#25D366" },
  { name: "Vite", category: "BUILD", color: "#F7E644" },
  { name: "n8n", category: "AUTOMATION", color: "#F62961" },
  { name: "Make.com", category: "AUTOMATION", color: "#F62961" },
  { name: "OpenAI", category: "AI", color: "#25D366" },
  { name: "Figma", category: "DESIGN", color: "#00A3E0" },
  { name: "Cloudflare", category: "HOSTING", color: "#F7E644" },
  { name: "HubSpot", category: "CRM", color: "#F62961" },
  { name: "Meta Ads", category: "ADVERTISING", color: "#00A3E0" },
  { name: "Google Ads", category: "ADVERTISING", color: "#F7E644" },
  { name: "TikTok Ads", category: "ADVERTISING", color: "#F62961" },
  { name: "Webflow", category: "CMS", color: "#25D366" },
  { name: "Three.js", category: "3D", color: "#00A3E0" },
  { name: "Node.js", category: "BACKEND", color: "#25D366" },
  { name: "Recharts", category: "DATA VIZ", color: "#F7E644" },
  { name: "Framer Motion", category: "ANIMATIE", color: "#F62961" },
];

// Duplicate for seamless loop
const doubledStack = [...techStack, ...techStack];

const TechItem: React.FC<{ item: TechItem }> = ({ item }) => (
  <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-500 group cursor-default shrink-0">
    <div
      className="w-1.5 h-1.5 rounded-full group-hover:scale-150 transition-transform duration-300"
      style={{ backgroundColor: item.color }}
    />
    <div>
      <span className="text-white font-black text-sm uppercase tracking-tight">{item.name}</span>
      <span className="text-[9px] font-black uppercase tracking-[0.35em] block" style={{ color: item.color, opacity: 0.7 }}>
        {item.category}
      </span>
    </div>
  </div>
);

const TechStackSection: React.FC = () => {
  return (
    <section className="py-14 md:py-20 overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 mb-8 md:mb-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Code2 size={16} className="text-[#00A3E0]" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40">
                TECH STACK // TOOLS WE GEBRUIKEN
              </span>
            </div>
            <div className="flex-1 h-px bg-white/5" />
          </div>
        </div>
      </div>

      {/* Row 1 — left to right */}
      <div className="relative mb-4">
        <div
          className="flex gap-3"
          style={{
            animation: 'tickerSlide 35s linear infinite',
            width: 'max-content',
          }}
        >
          {doubledStack.map((item, i) => (
            <TechItem key={`row1-${i}`} item={item} />
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>

      {/* Row 2 — right to left (reversed) */}
      <div className="relative">
        <div
          className="flex gap-3"
          style={{
            animation: 'tickerSlide 28s linear infinite reverse',
            width: 'max-content',
          }}
        >
          {[...doubledStack].reverse().map((item, i) => (
            <TechItem key={`row2-${i}`} item={item} />
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
};

export default TechStackSection;
