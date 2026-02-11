
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Smartphone } from 'lucide-react';

const WhatsAppPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [showPromo, setShowPromo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track scroll position to only animate during "Title and Header" (Top of page)
  useEffect(() => {
    const handleScroll = () => {
      // Check if we are roughly within the first viewport height (Hero/Header area)
      if (window.scrollY < window.innerHeight * 0.8) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    setShowPromo(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Auto revert after 3 seconds as requested
    timerRef.current = setTimeout(() => {
      setShowPromo(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    // We let the timer finish to fulfill the "animeert na 3 seconden weer terug" requirement
    // even if the mouse leaves early, providing a consistent experience.
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
      {/* Custom Keyframes for the "Occasional Glow" effect */}
      <style>{`
        @keyframes ripple-glow {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); transform: scale(1); }
          50% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); transform: scale(1); }
        }
        .animate-ripple {
          animation: ripple-glow 3s infinite;
          animation-delay: 2s; /* Wait 2s between pulses */
        }
      `}</style>

      {/* Popup Window */}
      {isOpen && (
        <div className="mb-4 w-72 md:w-80 bg-[#050505] rounded-2xl shadow-2xl overflow-hidden animate-[fadeInUp_0.3s_ease-out] border border-white/10 backdrop-blur-xl">
          {/* Header */}
          <div className="bg-black/80 p-4 flex items-center justify-between border-b border-white/10 h-24">
            <div className="flex items-center gap-4">
              {/* Logo Increased Size from w-20 to w-24 */}
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center overflow-hidden border border-[#25D366]/30 shadow-lg -ml-4">
                 <img 
                   src="https://i.ibb.co/RkXjxKLb/Social-Now-Logo-Breed-Wit.webp" 
                   alt="SocialNow" 
                   className="w-full h-full object-contain scale-110" 
                 />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">SocialNow Support</h4>
                <p className="text-[#25D366] text-xs font-medium">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors self-start mt-1">
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="bg-[#0a0a0a] p-4 h-64 overflow-y-auto flex flex-col gap-3 relative">
             <div className="absolute inset-0 opacity-5 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]"></div>
             
             {/* Message from support */}
             <div className="bg-[#111] border border-white/10 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl max-w-[85%] shadow-sm relative z-10 self-start">
                <p className="text-gray-200 text-sm">Hi! 👋 Hoe kunnen we je helpen met je branding of marketing?</p>
                <span className="text-[10px] text-gray-500 block text-right mt-1">10:00</span>
             </div>
          </div>

          {/* Footer / Input (Fake) */}
          <div className="bg-black/80 p-3 border-t border-white/10 flex gap-2">
             <a 
               href="https://wa.me/31637404577" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex-grow bg-[#25D366] hover:bg-[#20bd5a] text-black font-black uppercase tracking-wider text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
             >
               <Send size={16} /> Start Chat
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
            <Smartphone size={24} className="shrink-0 text-black" />
            <span className="text-xs font-bold text-left leading-tight text-black">
              Let op: Boekingen voor Q1 2026<br/>stromen momenteel snel vol!
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
             {isOpen ? <X size={28} /> : <MessageCircle size={32} />}
          </div>
        )}
      </button>
    </div>
  );
};

export default WhatsAppPopup;
