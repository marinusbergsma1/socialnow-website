import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const NotFound: React.FC = () => {
  useSEO({
    title: 'Pagina niet gevonden',
    description: 'Deze pagina bestaat niet of is verplaatst.',
  });

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="text-[#25D366] text-sm font-bold tracking-[0.3em] uppercase mb-4">
          Error 404
        </p>

        <h1 className="text-6xl sm:text-8xl font-black text-white mb-4 tracking-tight">
          OOPS
        </h1>

        <p className="text-white/60 text-base sm:text-lg mb-10 leading-relaxed">
          Deze pagina bestaat niet of is verplaatst.<br />
          Geen zorgen — we brengen je terug.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group flex items-center gap-2.5 bg-[#25D366] text-black text-xs font-bold uppercase tracking-[0.15em] px-7 py-3.5 rounded-full hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Naar Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2.5 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.15em] px-7 py-3.5 rounded-full hover:border-white/40 hover:bg-white/5 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Ga Terug
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
