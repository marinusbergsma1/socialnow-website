import React from 'react';
import MiloSources from './MiloSources';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MessageCircle } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import Button from './Button';

/**
 * 404 — Milo heeft kortsluiting. Milo staat centraal met een glitch/uitval-
 * animatie (RGB-splits, jitter, flicker + af en toe een "black-out"), met een
 * positieve boodschap en CTA's naar home/contact.
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  useSEO({
    title: 'Pagina niet gevonden',
    description: 'Deze pagina bestaat niet of is verplaatst.',
  });

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 overflow-hidden">
      <style>{`
        /* Jitter + korte black-outs: Milo "valt uit" en herstart steeds */
        @keyframes sn-404-glitch {
          0%, 100% { transform: translate(0, 0) skewX(0deg); opacity: 1; }
          6%  { transform: translate(-3px, 1px) skewX(2deg); }
          7%  { transform: translate(3px, -2px) skewX(-3deg); opacity: 0.6; }
          8%  { transform: translate(0, 0) skewX(0deg); opacity: 1; }
          32% { transform: translate(0, 0); opacity: 1; }
          33% { opacity: 0.15; }           /* black-out */
          34% { opacity: 1; }
          35% { opacity: 0.3; }
          36% { opacity: 1; }
          58% { transform: translate(0, 0) skewX(0deg); }
          60% { transform: translate(4px, 0) skewX(-2deg); opacity: 0.55; }
          61% { transform: translate(-4px, 2px) skewX(3deg); }
          62% { transform: translate(0, 0) skewX(0deg); opacity: 1; }
          85% { opacity: 1; }
          86% { opacity: 0.2; }            /* tweede korte uitval */
          87% { opacity: 1; }
        }
        /* RGB-splits: twee gekleurde echo's die af en toe verschuiven */
        @keyframes sn-404-rgb {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          6%  { transform: translate(-6px, 0); opacity: 0.5; }
          8%  { transform: translate(0, 0); opacity: 0; }
          33% { transform: translate(5px, -2px); opacity: 0.45; }
          36% { transform: translate(0, 0); opacity: 0; }
          60% { transform: translate(7px, 1px); opacity: 0.5; }
          62% { transform: translate(0, 0); opacity: 0; }
        }
        @keyframes sn-404-scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .sn-404-milo { animation: sn-404-glitch 4.5s steps(1, end) infinite; }
        .sn-404-echo { animation: sn-404-rgb 4.5s steps(1, end) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sn-404-milo, .sn-404-echo, .sn-404-scanline { animation: none !important; }
          .sn-404-echo { opacity: 0 !important; }
        }
      `}</style>

      <div className="text-center max-w-lg relative">
        <p className="text-[#25D366] text-sm font-bold tracking-[0.3em] uppercase mb-2">
          Error 404
        </p>

        {/* Milo met kortsluiting — gecentreerd, glitchend */}
        <div className="sn-milo relative w-56 h-56 md:w-72 md:h-72 mx-auto mb-2 select-none" aria-hidden="true">
          {/* RGB-echo's (blauw + roze) achter de hoofd-Milo */}
          <video
            autoPlay muted loop playsInline preload="auto"
            className="sn-404-echo absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ filter: 'sepia(1) saturate(8) hue-rotate(170deg) brightness(0.9)' }}
          >
            <MiloSources name="milo-blink" v="2" />
          </video>
          <video
            autoPlay muted loop playsInline preload="auto"
            className="sn-404-echo absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ filter: 'sepia(1) saturate(8) hue-rotate(-40deg) brightness(0.9)', animationDelay: '0.05s' }}
          >
            <MiloSources name="milo-blink" v="2" />
          </video>
          {/* Hoofd-Milo, jittert en valt af en toe uit */}
          <video
            autoPlay muted loop playsInline preload="auto"
            className="sn-404-milo relative w-full h-full object-contain pointer-events-none"
          >
            <MiloSources name="milo-blink" v="2" />
          </video>
          {/* Scanlijn die over Milo loopt */}
          <div
            className="sn-404-scanline absolute left-[12%] right-[12%] h-[2px] bg-[#25D366]/40 pointer-events-none"
            style={{ animation: 'sn-404-scan 2.8s linear infinite' }}
          />
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-white mb-4 tracking-tight uppercase">
          Oeps, kortsluiting!
        </h1>

        <p className="text-white/60 text-base sm:text-lg mb-10 leading-relaxed">
          Deze pagina bestaat niet (meer) — en daar is Milo heel even van in de war.
          Geen zorgen: alles wat wél werkt is één klik verderop. En werkt iets écht
          niet? Dan horen we het graag!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="green" icon IconComponent={Home} onClick={() => navigate('/')}>
            Naar home
          </Button>
          <Button variant="glass" icon IconComponent={MessageCircle} onClick={() => window.open('https://wa.me/31637404577?text=Hoi%20SocialNow!', '_blank', 'noopener')}>
            Neem contact op
          </Button>
        </div>

        <p className="text-white/25 text-[11px] font-bold uppercase tracking-[0.2em] mt-8">
          <Link to="/projecten" className="hover:text-[#25D366] transition-colors">Of bekijk ons werk →</Link>
        </p>
      </div>
    </main>
  );
};

export default NotFound;
