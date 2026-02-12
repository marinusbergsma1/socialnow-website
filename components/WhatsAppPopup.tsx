
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Smartphone, ArrowRight } from 'lucide-react';

const WhatsAppPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [showPromo, setShowPromo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    setShowPromo(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowPromo(false);
    }, 3000);
  };

  const handleMouseLeave = () => {};

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
      <style>{`
        @keyframes ripple-glow {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); transform: scale(1); }
          50% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); transform: scale(1); }
        }
        .animate-ripple {
          animation: ripple-glow 3s infinite;
          animation-delay: 2s;
        }
      `}</style>

      {/* Popup Window */}
      {isOpen && (
        <div className="mb-4 w-72 md:w-80 bg-[#0a0a0a] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-[fadeInUp_0.3s_ease-out] border border-white/10">
          {/* Header — with PixelGlobe beeldmerk */}
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden relative bg-black/50 flex items-center justify-center p-1.5">
                <img src={`${import.meta.env.BASE_URL}beeldmerk-v6.png`} alt="SocialNow" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-black text-white text-sm uppercase tracking-tight">SocialNow</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></div>
                  <p className="text-[#25D366] text-[10px] font-bold uppercase tracking-widest">Online</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <X size={16} />
            </button>
          </div>

          {/* Body — message bubble */}
          <div className="p-4 min-h-[120px] flex flex-col justify-center">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-sm max-w-[90%]">
              <p className="text-gray-200 text-sm leading-relaxed">Hey! Hoe kunnen we je helpen met je project?</p>
              <span className="text-[10px] text-gray-600 block text-right mt-2 font-bold">Nu</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="p-4 pt-0">
            <a
              href="https://wa.me/31637404577"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-wider text-xs py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.15)] hover:shadow-[0_0_30px_rgba(37,211,102,0.3)] group"
            >
              <Send size={14} className="group-hover:-rotate-12 transition-transform" />
              Start WhatsApp Chat
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          bg-[#25D366] rounded-full flex items-center justify-center text-white
          shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)]
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative group overflow-hidden
          ${showPromo ? 'w-[320px] h-14 md:h-16 px-6' : 'w-14 h-14 md:w-16 md:h-16 hover:scale-110'}
          ${!isOpen && !showPromo && isAtTop ? 'animate-ripple' : ''}
        `}
      >
        {showPromo ? (
          <div className="flex items-center gap-3 whitespace-nowrap animate-[fadeIn_0.3s_ease-out]">
            <Smartphone size={24} className="shrink-0 text-white" />
            <span className="text-xs font-bold text-left leading-tight text-white">
              Let op: Boekingen voor Q1 2026<br/>stromen momenteel snel vol!
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </div>
        )}
      </button>
    </div>
  );
};

export default WhatsAppPopup;
