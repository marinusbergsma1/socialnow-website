import React, { useEffect, useRef, useState } from 'react';
import MiloSources from './MiloSources';
import { Code2, Blocks, Workflow, Rocket } from 'lucide-react';

/**
 * CodeSection — "Software & Development" spotlight op de homepage.
 * Links: pitch dat coderen/software-ontwikkeling een kernpijler is.
 * Rechts: codeer-Milo loop-video (zwarte achtergrond → smelt in de pagina).
 * Video lazy: laadt pas wanneer de sectie in beeld komt.
 */

const pillars = [
  {
    icon: Blocks,
    title: 'Maatwerk software',
    text: 'Webapps, portalen en tools die exact doen wat jouw bedrijf nodig heeft. Geen standaard template.',
  },
  {
    icon: Workflow,
    title: 'Koppelingen & automatisering',
    text: 'CRM, betalingen, planning, AI: wij verbinden je systemen tot één geautomatiseerde workflow.',
  },
  {
    icon: Rocket,
    title: 'Van idee naar live',
    text: 'Dankzij AI-gedreven development staat een eerste werkende versie in dagen, niet maanden.',
  },
];

const CodeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="software-development" className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Tekst */}
          <div>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Code2 size={13} className="text-[#25D366]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
                Software & Development
              </span>
            </div>

            <h2 className="font-black uppercase tracking-tighter text-white leading-none text-4xl md:text-6xl mb-5">
              WIJ <span className="text-[#25D366]">CODEREN</span> HET.
            </h2>

            <p className="text-neutral-400 max-w-xl mb-8">
              Marketing zonder techniek is half werk. Daarom bouwen wij zelf: maatwerk software,
              webapps en slimme koppelingen die jouw marketing, sales en operatie aan elkaar knopen.
              Eén team voor strategie, creatie én code.
            </p>

            <div className="space-y-5">
              {pillars.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#25D366]/10 border border-[#25D366]/25">
                    <Icon size={18} className="text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white">{title}</h3>
                    <p className="text-sm text-neutral-500 mt-0.5">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Codeer-Milo loop — zwarte video op zwarte pagina, geen kader nodig */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="sn-milo relative w-full max-w-[480px] aspect-square">
              <div className="absolute inset-0 rounded-full bg-[#25D366]/[0.06] blur-3xl pointer-events-none" />
              {inView && (
                <video
                  ref={videoRef}
                  autoPlay muted loop playsInline preload="metadata" aria-hidden="true"
                  className="relative w-full h-full object-contain"
                >
                  <MiloSources name="milo-coder" v="1" />
                </video>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CodeSection;
