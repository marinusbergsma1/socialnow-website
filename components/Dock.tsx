
import React, { useState, useEffect } from 'react';
import { 
  Home, Layers, Cpu, Users, Phone, Calendar 
} from 'lucide-react';

interface DockProps {
  onOpenBooking: () => void;
}

const Dock: React.FC<DockProps> = ({ onOpenBooking }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerHeight - e.clientY < 100) {
        setIsVisible(true);
      } else if (window.innerHeight - e.clientY > 250 && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible]);

  const dockItems = [
    { id: 'home', icon: Home, label: 'HOME', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }), color: 'white' },
    { id: 'projects', icon: Layers, label: 'PROJECTEN', action: () => document.getElementById('projecten')?.scrollIntoView({ behavior: 'smooth' }), color: '#F7E644' },
    { id: 'services', icon: Cpu, label: 'DIENSTEN', action: () => document.getElementById('expertise-ecosysteem')?.scrollIntoView({ behavior: 'smooth' }), color: '#00A3E0' },
    { id: 'team', icon: Users, label: 'TEAM', action: () => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' }), color: '#F62961' },
    { id: 'contact', icon: Phone, label: 'CONTACT', action: onOpenBooking, color: 'white' },
    { id: 'book', icon: Calendar, label: 'START', action: onOpenBooking, color: '#25D366', special: true },
  ];

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
    >
      <div className="relative group/dock">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] -z-10 group-hover/dock:border-white/20 transition-all duration-500"></div>
        
        <div className="flex items-end gap-2 px-4 py-3 h-20">
          {dockItems.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = hoveredIndex === idx;
            const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - idx) === 1;
            
            let scale = 1;
            if (isHovered) scale = 1.4;
            else if (isNeighbor) scale = 1.15;

            return (
              <div 
                key={item.id}
                className="relative flex flex-col items-center group/item"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={item.action}
              >
                <div className={`absolute -top-12 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all duration-300 pointer-events-none ${
                  isHovered ? 'opacity-100 -translate-y-2' : 'opacity-0 translate-y-2'
                }`}>
                  {item.label}
                </div>

                <div 
                  className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    item.special ? 'bg-[#25D366]/10 border border-[#25D366]/30' : 'bg-white/5 border border-white/5'
                  }`}
                  style={{ 
                    width: `${48 * scale}px`, 
                    height: `${48 * scale}px`,
                    transform: `translateY(${isHovered ? -15 : isNeighbor ? -5 : 0}px)`
                  }}
                >
                  <Icon 
                    size={22} 
                    strokeWidth={2.5}
                    style={{ color: item.color }}
                    className={`transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
                  />
                  {item.special && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#25D366] animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dock;
