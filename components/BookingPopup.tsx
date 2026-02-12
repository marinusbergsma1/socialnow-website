
import React from 'react';
import { X, Phone, MessageCircle, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BookingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingPopup: React.FC<BookingPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl transition-opacity duration-300" onClick={onClose}></div>
      
      <div className="relative z-10 w-full h-full md:h-auto md:max-w-5xl bg-transparent flex flex-col md:flex-row animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)] shadow-[0_40px_120px_rgba(0,0,0,1)] overflow-y-auto md:overflow-visible custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Sluiten"
          className="absolute top-6 right-6 z-[70] p-4 rounded-full bg-white/5 hover:bg-[#F62961] transition-all text-white border border-white/10 backdrop-blur-md shadow-2xl group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Profile Image Float - Refined for Desktop */}
        <div className="relative md:absolute -mb-20 md:mb-0 mt-16 md:mt-0 md:-top-16 md:-left-16 z-[60] w-32 h-32 md:w-52 md:h-52 self-center md:self-auto shrink-0">
             <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-[#0a0a0a] shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-[#111]">
                  <img src="https://i.ibb.co/Z65DDRMG/Marinus-Bergsma-V2.webp" alt="Marinus Bergsma" className="w-full h-full object-cover" loading="eager" />
             </div>
             <div className="absolute bottom-2 right-2 md:bottom-6 md:right-6 w-7 h-7 md:w-10 md:h-10 bg-[#25D366] rounded-full border-[5px] border-[#0a0a0a] shadow-xl"></div>
        </div>

        {/* Left Section: Info */}
        <div className="w-full md:w-[40%] bg-[#080808] p-10 md:p-16 md:pt-28 flex flex-col relative rounded-t-[3rem] md:rounded-l-[3rem] md:rounded-tr-none shrink-0 border-r border-white/5">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none rounded-t-[3rem] md:rounded-tl-[3rem]"></div>
             
             <div className="relative z-10 text-center md:text-left pt-16 md:pt-4">
                <h3 className="text-white font-black uppercase text-2xl mb-2 tracking-tight">Marinus Bergsma</h3>
                <div className="inline-block bg-[#25D366] text-black px-3 py-1 mb-10 transform -rotate-1 shadow-lg">
                   <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">Founder & Creative Director</p>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black uppercase text-white italic leading-[0.8] mb-12 drop-shadow-2xl tracking-tighter">
                   WIJ<br className="hidden md:block"/> STAAN<br className="hidden md:block"/> AAN!
                </h2>
                
                <div className="space-y-6 text-gray-400 text-sm md:text-base font-medium leading-tight mb-12 max-w-[300px] mx-auto md:mx-0">
                    <p>Wij bouwen aan merken die de status quo uitdagen. Geen gedoe, maar pure impact.</p>
                    <p>Heb je een vraag? <br/><strong className="text-white font-black italic">Ik ben persoonlijk bereikbaar.</strong></p>
                </div>
                
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#25D366]/30 bg-[#25D366]/5 text-[#25D366] text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(37,211,102,0.1)]">
                      <CheckCircle2 size={14} /> 
                      DIRECT BESCHIKBAAR
                    </div>
                </div>
             </div>
        </div>

        {/* Right Section: Channels */}
        <div className="w-full md:w-[60%] bg-[#030303] p-8 md:p-20 flex flex-col justify-center relative rounded-b-[3rem] md:rounded-r-[3rem] md:rounded-bl-none">
             
             <div className="mb-14 text-center md:text-left">
                 <h2 className="text-3xl md:text-5xl font-black uppercase text-white flex flex-wrap md:flex-nowrap items-center justify-center md:justify-start gap-4 md:gap-6 leading-none whitespace-nowrap tracking-tighter">
                    LET'S GET <img src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp" alt="SocialNow" className="h-10 md:h-14 object-contain inline-block" />
                 </h2>
                 <p className="text-gray-600 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mt-6">MAAK DIRECT VERBINDING</p>
             </div>

             {/* Contact Cards - Sized down for Desktop/iPad */}
             <div className="grid grid-cols-1 gap-4 md:gap-5">
                 
                 {/* WhatsApp */}
                 <a href="https://wa.me/31637404577" target="_blank" rel="noopener noreferrer" 
                    className="group flex items-center justify-between p-6 md:p-5 rounded-[2rem] border border-[#25D366]/30 bg-[#25D366]/[0.02] hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-700 hover:shadow-[0_0_50px_rgba(37,211,102,0.2)]"
                 >
                     <div className="flex items-center gap-5 md:gap-6">
                         <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#25D366] text-black flex items-center justify-center shadow-[0_0_25px_rgba(37,211,102,0.4)] group-hover:scale-110 transition-transform duration-500">
                             <MessageCircle size={24} strokeWidth={2.5} />
                         </div>
                         <div>
                             <h4 className="text-white font-black uppercase tracking-wider mb-0.5 text-base md:text-lg">Stuur een appje</h4>
                             <p className="text-[#25D366] text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase">SNELSTE REACTIE</p>
                         </div>
                     </div>
                     <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#25D366] group-hover:text-black group-hover:border-transparent transition-all duration-300">
                         <ArrowRight size={20} />
                     </div>
                 </a>

                 {/* Phone */}
                 <a href="tel:+31637404577" 
                    className="group flex items-center justify-between p-6 md:p-5 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:border-[#0071BC] hover:bg-[#0071BC]/10 transition-all duration-700 hover:shadow-[0_0_50px_rgba(0,113,188,0.2)]"
                 >
                     <div className="flex items-center gap-5 md:gap-6">
                         <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 text-[#0071BC] flex items-center justify-center border border-[#0071BC]/20 group-hover:scale-110 transition-transform duration-500">
                             <Phone size={24} />
                         </div>
                         <div>
                             <h4 className="text-white font-black uppercase tracking-wider mb-0.5 text-base md:text-lg">Even Bellen?</h4>
                             <p className="text-gray-500 text-[10px] md:text-[11px] font-bold tracking-widest uppercase">+31 6 37 40 45 77</p>
                         </div>
                     </div>
                     <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#0071BC] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                         <ArrowRight size={20} />
                     </div>
                 </a>

                 {/* Email */}
                 <a href="mailto:info@socialnow.nl" 
                    className="group flex items-center justify-between p-6 md:p-5 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:border-[#F7E644] hover:bg-[#F7E644]/10 transition-all duration-700 hover:shadow-[0_0_50px_rgba(247,230,68,0.2)]"
                 >
                     <div className="flex items-center gap-5 md:gap-6">
                         <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 text-[#F7E644] flex items-center justify-center border border-[#F7E644]/20 group-hover:scale-110 transition-transform duration-500">
                             <Mail size={24} />
                         </div>
                         <div>
                             <h4 className="text-white font-black uppercase tracking-wider mb-0.5 text-base md:text-lg">Mailen</h4>
                             <p className="text-gray-500 text-[10px] md:text-[11px] font-bold tracking-widest uppercase">info@socialnow.nl</p>
                         </div>
                     </div>
                     <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#F7E644] group-hover:text-black group-hover:border-transparent transition-all duration-300">
                         <ArrowRight size={20} />
                     </div>
                 </a>

             </div>
             
             {/* Bottom Buffer for Mobile */}
             <div className="h-8 md:hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;
