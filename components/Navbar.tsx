
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from './Button';
import { GlassFilter } from './ui/liquid-glass';

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
      left: elRect.left - containerRect.left,
      width: elRect.width,
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
    { name: 'Diensten & Prijzen', href: '/diensten', action: 'navigate' },
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

  const isScrolledOrSubPage = scrolled || !isHomePage;

  return (
    <>
      {/* GlassFilter SVG — rendered once, reused by all glass components on the page */}
      <GlassFilter />
      <nav
        className={`fixed z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between ${
          isScrolledOrSubPage
            ? 'top-0 left-0 w-full bg-black/80 border-b border-white/10 px-6 md:px-12 py-5 md:shadow-2xl'
            : 'top-0 left-0 w-full bg-transparent px-6 md:px-12 py-10 border-transparent'
        }`}
      >
        {/* Liquid glass background layer — desktop only, visible when scrolled */}
        {isScrolledOrSubPage && (
          <div
            className="absolute inset-0 z-0 pointer-events-none hidden md:block"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              filter: 'url(#glass-distortion)',
              background: 'rgba(0, 0, 0, 0.55)',
              isolation: 'isolate',
            }}
          />
        )}
          <a href="#home" onClick={(e) => { e.preventDefault(); if (!isHomePage) { navigate('/'); } else { window.scrollTo({top: 0, behavior: 'smooth'}); } }} className={`relative z-10 flex items-center transition-all duration-500`}>
            {/* Mobile: beeldmerk only */}
            <img
              src={`${import.meta.env.BASE_URL}beeldmerk-v6.webp`}
              alt="SocialNow"
              width={40}
              height={40}
              className={`md:hidden transition-all duration-500 ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}`}
            />
            {/* Desktop: full logo with text */}
            <img
              src={`${import.meta.env.BASE_URL}images/Logo-Social-Now-Lengte.webp`}
              alt="SocialNow"
              width={200}
              height={50}
              className={`hidden md:block transition-all duration-500 ${scrolled ? 'h-8' : 'h-10'} w-auto`}
            />
          </a>

          <div className="relative z-10 hidden lg:flex items-center gap-10">
            <div ref={navContainerRef} className="relative flex items-center gap-10 mr-4" onMouseLeave={handleNavMouseLeave}>
              {/* Animated underline indicator */}
              <div
                className="nav-pill"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                  height: '2px',
                  bottom: '-6px',
                  top: 'auto',
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
                  {link.name}
                </a>
              ))}
            </div>
            <Button variant="green" icon onClick={onOpenBooking} className="scale-90 origin-right !h-[48px]" triggerOnHover>Kennismaken</Button>
          </div>

          <button className="relative z-10 lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Menu sluiten' : 'Menu openen'}>
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
