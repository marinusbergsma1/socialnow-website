
import React, { useRef, useCallback } from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'green' | 'pink' | 'glass';
  onClick?: () => void;
  className?: string;
  icon?: boolean;
  IconComponent?: LucideIcon; // Custom icon component
  triggerOnHover?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  icon = false,
  IconComponent = ArrowRight, // Default to ArrowRight
  triggerOnHover = false
}) => {
  const isGreen = variant === 'green';
  const isPink = variant === 'pink';
  const isGlass = variant === 'glass';
  const btnRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef<number>(0);

  // Magnetic hover effect — button subtly pulls toward cursor
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    el.style.transform = 'translate(0px, 0px)';
  }, []);

  // STRENG: Vaste hoogte aangepast voor mobiel (h-[46px]) vs desktop (h-[54px])
  const baseClasses = "relative overflow-hidden rounded-full group cursor-pointer transition-all duration-300 border-2 active:scale-95 h-[46px] md:h-[54px] !py-0 min-w-[160px] md:min-w-[200px] flex items-center justify-center";

  let variantClasses = "";
  if (isGreen) {
    variantClasses = "bg-transparent backdrop-blur-md border-[#25D366] text-white hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] neon-glow-green";
  } else if (isPink) {
    variantClasses = "bg-transparent backdrop-blur-md border-[#F62961] text-white hover:shadow-[0_0_25px_rgba(246,41,97,0.5)]";
  } else if (isGlass) {
    variantClasses = "bg-white/5 backdrop-blur-md border-white/10 text-white hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]";
  } else if (variant === 'primary') {
    variantClasses = "bg-white text-black border-white";
  } else if (variant === 'outline') {
    variantClasses = "bg-transparent border-white text-white hover:border-white hover:text-black";
  } else if (variant === 'ghost') {
    variantClasses = "bg-transparent border-transparent text-white hover:text-[#00A3E0]";
  }

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease, color 0.3s ease' }}
    >
      {/* Background Fill Layer */}
      {isGreen && <div className="absolute inset-0 bg-[#25D366] translate-x-[-101%] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 z-0"></div>}
      {isPink && <div className="absolute inset-0 bg-[#F62961] translate-x-[-101%] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 z-0"></div>}
      {variant === 'outline' && <div className="absolute inset-0 bg-white translate-x-[-101%] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 z-0"></div>}
      {isGlass && <div className="absolute inset-0 bg-white/20 translate-x-[-101%] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 z-0"></div>}
      
      {/* Content wrapper */}
      <div className={`relative z-10 flex items-center justify-between w-full h-full font-black uppercase tracking-widest text-[10px] md:text-xs ${icon ? 'pl-4 md:pl-6 pr-1.5' : 'px-6 md:px-8'}`}>
        <span className="transition-colors duration-300 flex-grow text-center">
          {children}
        </span>

        {icon && (
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white shadow-md ml-2 md:ml-4 ${isGreen ? 'bg-[#25D366]' : isPink ? 'bg-[#F62961]' : 'bg-white/10'}`}>
            <IconComponent size={18} className={`transition-colors duration-300 ${isGreen || isPink ? 'text-white group-hover:text-black' : 'text-white'}`} />
          </div>
        )}
      </div>
    </button>
  );
};

export default Button;
