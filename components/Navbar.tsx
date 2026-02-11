
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './Button';

interface NavLink {
  name: string;
  href: string;
  action?: string;
}

interface NavbarProps {
  onOpenBooking: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { name: 'Home', href: '#home' },
    { name: 'Projecten', href: '#projecten' },
    { name: 'Diensten', href: '#expertise-ecosysteem' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact', action: 'booking' },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: NavLink) => {
      if (link.action === 'booking') {
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
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="relative group text-[11px] font-black uppercase text-gray-400 hover:text-white transition-all tracking-[0.2em]"
                >
                  <span className="relative inline-block">
                    {link.name}
                    <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#61F6FD] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_#61F6FD]"></span>
                  </span>
                </a>
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
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="block text-4xl font-black uppercase text-white tracking-tighter border-b border-white/5 pb-6 hover:text-[#61F6FD] transition-colors"
              >
                {link.name}
              </a>
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
