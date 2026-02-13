
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from './Button';

interface NavLink {
  name: string;
  href: string;
  action?: string;
}

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenContact?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenContact }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isHomePage = location.pathname === '/' || location.pathname === '';

  // Animated pill indicator
  const navContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({ left: 0, width: 0, opacity: 0 });

  const updatePill = useCallback((el: HTMLAnchorElement | null) => {
    if (!el || !navContainerRef.current) {
      setPillStyle(prev => ({ ...prev, opacity: 0 }));
      return;
    }
    const containerRect = navContainerRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - containerRect.left - 10,
      width: elRect.width + 20,
      opacity: 1,
    });
  }, []);

  const handleNavMouseEnter = useCallback((idx: number) => {
    updatePill(linkRefs.current[idx]);
  }, [updatePill]);

  const handleNavMouseLeave = useCallback(() => {
    setPillStyle(prev => ({ ...prev, opacity: 0 }));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { name: 'Home', href: '#home' },
    { name: 'Projecten', href: '/projecten', action: 'navigate' },
    { name: 'Diensten', href: '/diensten', action: 'navigate' },
    { name: 'Prijzen', href: '/prijzen', action: 'navigate' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact', action: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: NavLink) => {
      e.preventDefault();

      if (link.action === 'contact') {
          onOpenContact?.();
          setIsOpen(false);
          return;
      }

      if (link.action === 'booking') {
          onOpenBooking();
          setIsOpen(false);
          return;
      }

      if (link.action === 'navigate') {
          navigate(link.href);
          setIsOpen(false);
          return;
      }

      if (link.href.startsWith('#')) {
          const targetId = link.href.substring(1);
          if (targetId === 'home') {
            if (!isHomePage) {
              navigate('/');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setIsOpen(false);
            return;
          }
          // If not on home page, navigate to home first then scroll
          if (!isHomePage) {
            navigate('/');
            // Let it render, then scroll after a short delay
            setTimeout(() => {
              const target = document.getElementById(targetId);
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          } else {
            const target = document.getElementById(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }
          setIsOpen(false);
      }
  };

  return (
    <>
      <nav
        className={`fixed z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between ${
          scrolled
            ? 'top-0 left-0 w-full bg-black/90 md:bg-black/80 md:backdrop-blur-3xl border-b border-white/10 px-6 md:px-12 py-5 md:shadow-2xl'
            : 'top-0 left-0 w-full bg-transparent px-6 md:px-12 py-10 border-transparent'
        }`}
      >
          <a href="#home" onClick={(e) => { e.preventDefault(); if (!isHomePage) { navigate('/'); } else { window.scrollTo({top: 0, behavior: 'smooth'}); } }} className={`block transition-all duration-500 ${scrolled ? 'w-32' : 'w-40 md:w-56'}`}>
            <img
              src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp"
              alt="SocialNow Logo"
              width={224}
              height={40}
              className="w-full h-auto object-contain"
            />
          </a>

          <div className="hidden lg:flex items-center gap-10">
            <div ref={navContainerRef} className="relative flex items-center gap-10 mr-4" onMouseLeave={handleNavMouseLeave}>
              {/* Animated pill indicator */}
              <div
                className="nav-pill"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                  height: '32px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: pillStyle.opacity,
                }}
              />
              {navLinks.map((link, idx) => (
                <a
                  key={link.name}
                  ref={(el) => { linkRefs.current[idx] = el; }}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  onMouseEnter={() => handleNavMouseEnter(idx)}
                  className="relative group text-[11px] font-black uppercase text-gray-400 hover:text-white transition-all tracking-[0.2em] z-10"
                >
                  <span className="relative inline-block">
                    {link.name}
                    <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#00A3E0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_#00A3E0]"></span>
                  </span>
                </a>
              ))}
            </div>
            <Button variant="green" icon onClick={onOpenBooking} className="scale-90 origin-right !h-[48px]" triggerOnHover>Kennismaken</Button>
          </div>

          <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Menu sluiten' : 'Menu openen'}>
            {isOpen ? <X /> : <Menu />}
          </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[90] bg-black flex flex-col pt-32 px-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`block text-4xl font-black uppercase text-white tracking-tighter border-b border-white/5 pb-6 hover:text-[#00A3E0] transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: isOpen ? `${i * 60 + 100}ms` : '0ms' }}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className={`mt-8 lg:mt-16 transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: isOpen ? `${navLinks.length * 60 + 200}ms` : '0ms' }}>
            <Button variant="green" icon onClick={() => { setIsOpen(false); onOpenBooking(); }} triggerOnHover className="w-full !h-[50px] !text-sm">Kennismaken</Button>
          </div>
      </div>
    </>
  );
};

export default Navbar;
