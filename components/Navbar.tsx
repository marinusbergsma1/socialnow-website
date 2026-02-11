
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Button from './Button';

interface NavLink {
  name: string;
  href: string;
  subItems: string[];
}

interface NavbarProps {
  onOpenBooking: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { name: 'Home', href: '#home', subItems: ['Statement', 'Klanten en Partners', 'Featured work'] },
    { name: 'Projecten', href: '#projecten', subItems: ['Case Studies', 'Ai in motion', 'SHORT FORM "CONTENT"'] },
    { name: 'Diensten', href: '#expertise-ecosysteem', subItems: ['BRANDING', 'DESIGN', 'MARKETING', 'STRATEGY', 'AI SOLUTIONS'] },
    { name: 'Team', href: '#team', subItems: ['CREATIVES', 'CONTENT SPECIALISTS', 'MARKETEERS', 'JOIN THE TEAM'] },
    { name: 'Contact', href: '#contact', subItems: ['NUMMER', 'EMAIL', 'ADRES', 'SOCIALS'] },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: NavLink) => {
      if (link.name === 'Contact') {
          e.preventDefault();
          onOpenBooking();
          setIsOpen(false);
          return;
      }
      
      if (link.href.startsWith('#')) {
          e.preventDefault();
          const targetId = link.href.substring(1);
          if (targetId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsOpen(false);
            return;
          }
          const target = document.getElementById(targetId);
          if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
              setIsOpen(false);
          }
      }
  };

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  return (
    <>
      <nav 
        className={`fixed z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between ${
          scrolled 
            ? 'top-0 left-0 w-full bg-black/80 backdrop-blur-3xl border-b border-white/10 px-6 md:px-12 py-5 shadow-2xl' 
            : 'top-0 left-0 w-full bg-transparent px-6 md:px-12 py-10 border-transparent'
        }`}
      >
          <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }} className={`block transition-all duration-500 ${scrolled ? 'w-32' : 'w-40 md:w-56'}`}>
            <img 
              src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp" 
              alt="SocialNow Logo" 
              className="w-full h-auto object-contain"
            />
          </a>

          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-10 mr-4">
              {navLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="relative group h-full py-2"
                  onMouseEnter={() => handleMouseEnter(link.name)}
                  onMouseLeave={handleMouseLeave}
                >
                    <a 
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link)}
                      className="flex items-center gap-2 text-[11px] font-black uppercase text-gray-400 hover:text-white transition-all tracking-[0.2em]"
                    >
                      <span className="relative inline-block">
                        {link.name}
                        <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#61F6FD] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_#61F6FD]"></span>
                      </span>
                      <ChevronDown size={12} className={`transition-transform duration-500 ${activeDropdown === link.name ? 'rotate-180 text-[#61F6FD]' : 'opacity-20'}`} />
                    </a>

                    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 transition-all duration-500 ${activeDropdown === link.name ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                        <div className="bg-[#080808]/95 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] min-w-[260px]">
                            <div className="flex flex-col gap-5">
                                {link.subItems.map((sub, i) => (
                                    <a 
                                      key={i} 
                                      href={link.href}
                                      onClick={(e) => handleLinkClick(e, link)}
                                      className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-[#61F6FD] transition-all group/sub"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/5 group-hover/sub:bg-[#61F6FD] group-hover/sub:scale-125 transition-all shadow-[0_0_8px_transparent] group-hover/sub:shadow-[#61F6FD]"></div>
                                        {sub}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              ))}
            </div>
            <Button variant="green" icon onClick={onOpenBooking} className="scale-90 origin-right !h-[48px]" triggerOnHover>Kennismaken</Button>
          </div>

          <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[90] bg-black/98 backdrop-blur-3xl flex flex-col pt-32 px-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="flex flex-col gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col gap-4 border-b border-white/5 pb-8">
                <button 
                  onClick={() => setMobileExpanded(mobileExpanded === link.name ? null : link.name)}
                  className="flex items-center justify-between w-full"
                >
                  <span className="text-4xl font-black uppercase text-white tracking-tighter">
                    {link.name}
                  </span>
                  <ChevronDown className={`transition-transform duration-500 ${mobileExpanded === link.name ? 'rotate-180 text-[#61F6FD]' : 'opacity-20'}`} size={28} />
                </button>
                
                <div className={`flex flex-col gap-5 overflow-hidden transition-all duration-500 ${mobileExpanded === link.name ? 'max-h-80 opacity-100 mt-5' : 'max-h-0 opacity-0'}`}>
                   {link.subItems.map((sub, i) => (
                      <a 
                        key={i} 
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link)}
                        className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-[#61F6FD] transition-all flex items-center gap-5 pl-4"
                      >
                         <div className="w-2 h-2 rounded-full bg-[#61F6FD] shadow-[0_0_8px_#61F6FD]"></div>
                         {sub}
                      </a>
                   ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 lg:mt-16">
            <Button variant="green" icon onClick={() => { setIsOpen(false); onOpenBooking(); }} triggerOnHover className="w-full !h-[50px] !text-sm">Kennismaken</Button>
          </div>
      </div>
    </>
  );
};

export default Navbar;
