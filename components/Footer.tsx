import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import Button from './Button';

interface FooterProps {
  onOpenBooking?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer id="contact" className="bg-black text-white pt-12 pb-12 border-t border-zinc-900 overflow-hidden relative">
      {/* Decorative Glow Pink */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-[#F62961] to-transparent opacity-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="md:col-span-1">
             <a href="#" className="block w-56 mb-8">
              <img 
                src="https://i.ibb.co/RkXjxKLb/Social-Now-Logo-Breed-Wit.webp" 
                alt="SocialNow Logo" 
                className="w-full h-auto"
              />
            </a>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#F62961] transition-colors cursor-pointer text-white">
                 <Facebook size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#F62961] transition-colors cursor-pointer text-white">
                 <Instagram size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#61F6FD] transition-colors cursor-pointer text-white">
                 <Linkedin size={18} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold uppercase mb-6 text-xs tracking-[0.2em] text-gray-500">Contact</h4>
            <p className="mb-2 hover:text-[#61F6FD] transition-colors cursor-pointer font-medium">info@socialnow.nl</p>
            <p className="mb-1 hover:text-[#61F6FD] transition-colors cursor-pointer font-medium">06 37 40 45 77</p>
            <p 
              onClick={onOpenBooking} 
              className="text-[#25D366] hover:text-white transition-colors cursor-pointer font-black uppercase tracking-widest text-[10px] md:text-xs"
            >
              Kennismaken
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold uppercase mb-6 text-xs tracking-[0.2em] text-gray-500">Menu</h4>
            <ul className="space-y-4 text-sm font-bold uppercase">
              <li><a href="#" className="hover:text-[#F62961] transition-colors">Werk</a></li>
              <li><a href="#" className="hover:text-[#F62961] transition-colors">Diensten</a></li>
              <li><a href="#" className="hover:text-[#F62961] transition-colors">Team</a></li>
              <li><a href="#" className="hover:text-[#F62961] transition-colors">Over Ons</a></li>
              <li><a href="#" className="hover:text-[#F62961] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Location */}
          <div>
             <h4 className="font-bold uppercase mb-6 text-xs tracking-[0.2em] text-gray-500">Vestiging</h4>
             <p className="text-sm leading-relaxed text-gray-300 font-medium">
               AMSTELSTRAAT 43 G<br/>
               1017DA AMSTERDAM<br/>
               NEDERLAND
             </p>
              <h4 className="font-bold uppercase mt-8 mb-4 text-xs tracking-[0.2em] text-gray-500">Links</h4>
              <a href="https://storage.googleapis.com/video-slider/Algemene%20Voorwaarden%20SocialNow.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Algemene Voorwaarden</a><br/>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</a>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 uppercase tracking-widest">
          <p>Copyright © 2000, SocialNow All Rights Reserved</p>
          <p>Designed by us</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;