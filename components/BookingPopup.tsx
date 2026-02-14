
import React, { useState, useEffect, useCallback } from 'react';
import { X, Phone, MessageCircle, Mail, ArrowRight, CheckCircle2, Send, User, Building2 } from 'lucide-react';

interface BookingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'contact' | 'form';

const BookingPopup: React.FC<BookingPopupProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('contact');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', budget: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Reset closing state when popup opens
  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 400);
  }, [onClose]);

  if (!isOpen && !isClosing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Projectaanvraag van ${formData.name}${formData.company ? ` (${formData.company})` : ''}`);
    const body = encodeURIComponent(
      `Naam: ${formData.name}\nE-mail: ${formData.email}\nBedrijf: ${formData.company || '-'}\nBudget: ${formData.budget || '-'}\n\nBericht:\n${formData.message}`
    );
    try {
      window.open(`mailto:info@socialnow.nl?subject=${subject}&body=${body}`, '_self');
      setSubmitted(true);
    } catch {
      window.location.href = `mailto:info@socialnow.nl?subject=${subject}&body=${body}`;
      setSubmitted(true);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Contact opnemen" className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
      <div className={`absolute inset-0 bg-black/95 backdrop-blur-3xl transition-opacity duration-400 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose}></div>

      <div className={`relative z-10 w-full h-full md:h-auto md:max-w-5xl bg-transparent flex flex-col md:flex-row shadow-[0_40px_120px_rgba(0,0,0,1)] overflow-y-auto md:overflow-visible custom-scrollbar transition-all duration-400 ${isClosing ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100 animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)]'}`}>

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Sluiten"
          className="absolute top-6 right-6 z-[70] p-4 rounded-full bg-white/5 hover:bg-[#F62961] transition-all text-white border border-white/10 backdrop-blur-md shadow-2xl group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Profile Image Float - Refined for Desktop */}
        <div className="relative md:absolute -mb-20 md:mb-0 mt-16 md:mt-0 md:-top-16 md:-left-16 z-[60] w-32 h-32 md:w-52 md:h-52 self-center md:self-auto shrink-0">
             <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-[#0a0a0a] shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-[#111]">
                  <img src="https://i.ibb.co/Z65DDRMG/Marinus-Bergsma-V2.webp" alt="Marinus Bergsma" className="w-full h-full object-cover" loading="eager" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
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

        {/* Right Section: Tabs */}
        <div className="w-full md:w-[60%] bg-[#030303] p-8 md:p-20 flex flex-col justify-center relative rounded-b-[3rem] md:rounded-r-[3rem] md:rounded-bl-none">

             <div className="mb-10 text-center md:text-left">
                 <h2 className="text-3xl md:text-5xl font-black uppercase text-white flex flex-wrap md:flex-nowrap items-center justify-center md:justify-start gap-4 md:gap-6 leading-none whitespace-nowrap tracking-tighter">
                    LET'S GET <img src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp" alt="SocialNow" className="h-10 md:h-14 object-contain inline-block" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                 </h2>
             </div>

             {/* Tab Switcher */}
             <div className="flex gap-2 mb-8">
               <button
                 onClick={() => setActiveTab('contact')}
                 className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                   activeTab === 'contact'
                     ? 'bg-[#25D366] text-black'
                     : 'bg-white/5 text-white/40 border border-white/10 hover:text-white hover:border-white/20'
                 }`}
               >
                 Direct Contact
               </button>
               <button
                 onClick={() => { setActiveTab('form'); setSubmitted(false); }}
                 className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                   activeTab === 'form'
                     ? 'bg-[#00A3E0] text-black'
                     : 'bg-white/5 text-white/40 border border-white/10 hover:text-white hover:border-white/20'
                 }`}
               >
                 Projectaanvraag
               </button>
             </div>

             {activeTab === 'contact' ? (
               <>
                 <p className="text-gray-600 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mb-6">MAAK DIRECT VERBINDING</p>

                 {/* Contact Cards */}
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
                        className="group flex items-center justify-between p-6 md:p-5 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:border-[#0077CC] hover:bg-[#0077CC]/10 transition-all duration-700 hover:shadow-[0_0_50px_rgba(0,119,204,0.2)]"
                     >
                         <div className="flex items-center gap-5 md:gap-6">
                             <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 text-[#0077CC] flex items-center justify-center border border-[#0077CC]/20 group-hover:scale-110 transition-transform duration-500">
                                 <Phone size={24} />
                             </div>
                             <div>
                                 <h4 className="text-white font-black uppercase tracking-wider mb-0.5 text-base md:text-lg">Even Bellen?</h4>
                                 <p className="text-gray-500 text-[10px] md:text-[11px] font-bold tracking-widest uppercase">+31 6 37 40 45 77</p>
                             </div>
                         </div>
                         <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#0077CC] group-hover:text-white group-hover:border-transparent transition-all duration-300">
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
               </>
             ) : (
               <>
                 {submitted ? (
                   <div className="flex flex-col items-center justify-center py-12 text-center">
                     <div className="w-16 h-16 rounded-full bg-[#25D366]/20 flex items-center justify-center mb-6">
                       <CheckCircle2 size={32} className="text-[#25D366]" />
                     </div>
                     <h3 className="text-2xl font-black uppercase text-white mb-3 tracking-tight">Verstuurd!</h3>
                     <p className="text-gray-400 text-sm font-medium max-w-sm">
                       Je e-mailclient opent met je projectaanvraag. We nemen binnen 1 werkdag contact op.
                     </p>
                     <button
                       onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', company: '', budget: '', message: '' }); }}
                       className="mt-8 text-[#00A3E0] text-[11px] font-black uppercase tracking-widest hover:underline"
                     >
                       Nog een aanvraag versturen
                     </button>
                   </div>
                 ) : (
                   <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Naam *</label>
                         <div className="relative">
                           <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                           <input
                             type="text"
                             required
                             value={formData.name}
                             onChange={(e) => setFormData(d => ({ ...d, name: e.target.value }))}
                             placeholder="Je volledige naam"
                             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pl-11 py-3 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:border-[#00A3E0]/50 focus:bg-white/[0.07] transition-all"
                           />
                         </div>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">E-mail *</label>
                         <div className="relative">
                           <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                           <input
                             type="email"
                             required
                             value={formData.email}
                             onChange={(e) => setFormData(d => ({ ...d, email: e.target.value }))}
                             placeholder="je@bedrijf.nl"
                             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pl-11 py-3 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:border-[#00A3E0]/50 focus:bg-white/[0.07] transition-all"
                           />
                         </div>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Bedrijf</label>
                         <div className="relative">
                           <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                           <input
                             type="text"
                             value={formData.company}
                             onChange={(e) => setFormData(d => ({ ...d, company: e.target.value }))}
                             placeholder="Bedrijfsnaam"
                             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pl-11 py-3 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:border-[#00A3E0]/50 focus:bg-white/[0.07] transition-all"
                           />
                         </div>
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Budget indicatie</label>
                         <select
                           value={formData.budget}
                           onChange={(e) => setFormData(d => ({ ...d, budget: e.target.value }))}
                           className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-[#00A3E0]/50 focus:bg-white/[0.07] transition-all appearance-none"
                         >
                           <option value="" className="bg-[#111]">Selecteer budget</option>
                           <option value="< €1.500" className="bg-[#111]">&lt; €1.500</option>
                           <option value="€1.500 - €5.000" className="bg-[#111]">€1.500 - €5.000</option>
                           <option value="€5.000 - €15.000" className="bg-[#111]">€5.000 - €15.000</option>
                           <option value="€15.000+" className="bg-[#111]">€15.000+</option>
                         </select>
                       </div>
                     </div>

                     <div>
                       <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Vertel over je project *</label>
                       <textarea
                         required
                         rows={4}
                         value={formData.message}
                         onChange={(e) => setFormData(d => ({ ...d, message: e.target.value }))}
                         placeholder="Waar kan SocialNow je mee helpen? Beschrijf kort je project, doelen en timeline."
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:border-[#00A3E0]/50 focus:bg-white/[0.07] transition-all resize-none"
                       />
                     </div>

                     <button
                       type="submit"
                       className="w-full flex items-center justify-center gap-3 bg-[#00A3E0] hover:bg-[#0092C7] text-black font-black uppercase tracking-widest text-sm py-4 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,163,224,0.3)] mt-2"
                     >
                       <Send size={16} />
                       Verstuur Aanvraag
                     </button>
                   </form>
                 )}
               </>
             )}

             {/* Bottom Buffer for Mobile */}
             <div className="h-8 md:hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;
