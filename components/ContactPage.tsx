
import React, { useEffect, useState } from 'react';
import { 
  X, Mail, Phone, MessageSquare, Send, Globe, MapPin, 
  Terminal, Shield, Zap, TrendingUp, Activity, PieChart,
  Linkedin, Instagram, Twitter, Facebook, ArrowRight
} from 'lucide-react';
import Button from './Button';
import { PixelGlobe } from './PixelGlobe';

interface ContactPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const nodeColors = ["#61F6FD", "#25D366", "#F62961", "#F7E644", "#61F6FD", "#25D366"];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fixed inset-0 z-[200] bg-black overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isClosing ? 'opacity-0 scale-95 blur-2xl' : 'opacity-100 scale-100 blur-0'
    }`}>
      
      {/* Moving Amsterdam Map Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
          <div 
            className="absolute inset-0 w-[200%] h-[200%] -left-1/2 -top-1/2 animate-[slow-map-move_120s_linear_infinite]"
            style={{
                backgroundImage: `url('https://i.ibb.co/LdtFKCpG/BG-Social-Now-Scherm.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(1) contrast(1.2) invert(1)',
                mixBlendMode: 'screen'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black"></div>
      </div>

      <div className="sticky top-0 z-[210] w-full px-6 py-6 md:px-12 md:py-8 flex items-center justify-between backdrop-blur-3xl border-b border-white/5 bg-black/80">
          <img src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp" alt="Logo" className="w-32 md:w-44" />
          <button onClick={handleClose} className="group relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#F62961] transition-all overflow-hidden shadow-2xl">
             <X size={24} className="group-hover:rotate-90 transition-transform duration-500 relative z-10" />
          </button>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl pt-24 pb-48 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
              
              {/* Left Side: Info & Visuals */}
              <div className="space-y-16">
                  <div>
                      <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
                        <Terminal size={16} className="text-[#61F6FD]" />
                        <span className="text-white font-black uppercase tracking-[0.6em] text-[10px]">CONTACT_NODE_V1</span>
                      </div>
                      <h1 className="text-5xl md:text-9xl font-black uppercase text-white tracking-tighter leading-[0.8] mb-12">
                         LET'S <br/> <span className="text-[#25D366]">CONNECT</span>
                      </h1>
                      <p className="text-gray-400 font-bold text-xl md:text-3xl max-w-xl italic leading-tight">
                         "Wij vertalen ambitie naar resultaat. Jouw merk is onze blauwdruk voor groei."
                      </p>
                  </div>

                  {/* UNIFIED HIGH-END VISUAL CORE */}
                  <div className="relative w-full flex items-center justify-center p-12 overflow-visible">
                      <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center overflow-visible">
                          {/* 3 ORBITAL CIRCLES - UPDATED TO BE MORE VISIBLE */}
                          <div className="absolute w-[160%] md:w-[190%] aspect-square border-[4px] border-[#61F6FD]/70 rounded-full animate-[spin_55s_linear_infinite] shadow-[0_0_50px_rgba(97,246,253,0.4)]"></div>
                          <div className="absolute w-[130%] md:w-[155%] aspect-square border-[4px] border-[#F62961]/70 rounded-full animate-[spin_45s_linear_infinite_reverse] shadow-[0_0_50px_rgba(246,41,97,0.4)]"></div>
                          <div className="absolute w-[100%] md:w-[120%] aspect-square border-[3px] border-dashed border-[#F7E644]/80 rounded-full animate-[spin_35s_linear_infinite] shadow-[0_0_50px_rgba(247,230,68,0.4)]"></div>
                          
                          {/* PIXEL GLOBE CORE */}
                          <div className="absolute inset-0 flex items-center justify-center z-10 overflow-visible">
                              <PixelGlobe scaleMultiplier={0.3} />
                              <div className="absolute w-[250%] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 opacity-10 pointer-events-none"></div>
                              <div className="absolute w-[250%] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-45 opacity-10 pointer-events-none"></div>
                          </div>

                          {/* PIXEL NODES - 230PX TRANSLATION */}
                          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                              <div 
                                  key={deg} 
                                  className="absolute w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 z-20"
                                  style={{ transform: `rotate(${deg}deg) translate(230px) rotate(-${deg}deg)` }}
                              >
                                  <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full" style={{ backgroundColor: nodeColors[i] }}></div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Address & Direct info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] space-y-4">
                          <MapPin className="text-[#F7E644]" size={24} />
                          <h4 className="text-white font-black uppercase text-lg">HQ AMSTERDAM</h4>
                          <p className="text-gray-400 font-medium">AMSTELSTRAAT 43 G<br/>1017DA AMSTERDAM</p>
                      </div>
                      <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] space-y-4">
                          <Shield className="text-[#61F6FD]" size={24} />
                          <h4 className="text-white font-black uppercase text-lg">VERIFIED AGENCY</h4>
                          <p className="text-gray-400 font-medium">CLUTCH TOP RATED 2024<br/>GOOGLE PARTNER</p>
                      </div>
                  </div>
              </div>

              {/* Right Side: Contact Channels */}
              <div className="space-y-12">
                  <div className="bg-[#050505] border border-white/10 rounded-[4rem] p-10 md:p-16 shadow-3xl">
                      <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">NEEM <span className="text-[#F7E644]">DIRECT</span> CONTACT OP</h3>
                      
                      <div className="space-y-6">
                          {/* WhatsApp */}
                          <a href="https://wa.me/31637404577" target="_blank" className="group flex items-center justify-between p-8 rounded-[2.5rem] border border-[#25D366]/20 bg-[#25D366]/[0.02] hover:bg-[#25D366]/10 transition-all duration-500">
                              <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 rounded-2xl bg-[#25D366] text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                      <MessageSquare size={28} />
                                  </div>
                                  <div>
                                      <h4 className="text-white font-black uppercase text-xl">WHATSAPP</h4>
                                      <p className="text-[#25D366] text-[10px] font-black tracking-widest uppercase">Direct antwoord</p>
                                  </div>
                              </div>
                              <ArrowRight className="text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all" />
                          </a>

                          {/* Email */}
                          <a href="mailto:info@socialnow.nl" className="group flex items-center justify-between p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500">
                              <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 rounded-2xl bg-white/5 text-[#61F6FD] flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                      <Mail size={28} />
                                  </div>
                                  <div>
                                      <h4 className="text-white font-black uppercase text-xl">MAIL ONS</h4>
                                      <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase">info@socialnow.nl</p>
                                  </div>
                              </div>
                              <ArrowRight className="text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all" />
                          </a>

                          {/* Phone */}
                          <a href="tel:+31637404577" className="group flex items-center justify-between p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500">
                              <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 rounded-2xl bg-white/5 text-[#F62961] flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                      <Phone size={28} />
                                  </div>
                                  <div>
                                      <h4 className="text-white font-black uppercase text-xl">BELLEN</h4>
                                      <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase">+31 6 37 40 45 77</p>
                                  </div>
                              </div>
                              <ArrowRight className="text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all" />
                          </a>
                      </div>

                      <div className="mt-16 pt-16 border-t border-white/5">
                          <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.6em] mb-10 text-center">VOLG HET ECOSYSTEEM</h4>
                          <div className="flex justify-center gap-6">
                              {[Linkedin, Instagram, Twitter, Facebook].map((Icon, i) => (
                                  <div key={i} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all cursor-pointer shadow-xl">
                                      <Icon size={20} />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <style>{`
        @keyframes slow-map-move {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-30px, -30px); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
