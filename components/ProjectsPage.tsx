import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Globe, ArrowUpRight } from 'lucide-react';
import { allProjects } from '../data/projects';
import ProgressiveImage from './ProgressiveImage';
import Button from './Button';
import { useSEO } from '../hooks/useSEO';

const accentColors = ['#00A3E0', '#F62961', '#F7E644', '#25D366'];

const ProjectsPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const navigate = useNavigate();

  useSEO({
    title: 'Projecten',
    description: 'Bekijk ons portfolio van AI-gedreven websites, branding projecten en digitale campagnes. Van concept tot resultaat.',
    path: '/projecten',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Header */}
      <div className="relative pt-32 md:pt-48 pb-16 md:pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto scroll-reveal">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
            <Layers size={16} className="text-[#F7E644]" />
            <span className="text-white font-black uppercase tracking-[0.5em] text-[10px]">PROJECT ARCHIVE</span>
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-8">
            ONZE <span className="text-[#25D366]">PROJECTEN</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
            Van branding tot AI-gedreven webontwikkeling — bekijk ons portfolio van visuele oplossingen die resultaat leveren.
          </p>
        </div>
      </div>

      {/* Project Grid - Clean 2-column masonry-style */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {allProjects.map((project, idx) => {
            const accentColor = accentColors[idx % accentColors.length];
            const isLarge = idx === 0 || idx === 3; // First and fourth are large

            return (
              <button
                key={project.id}
                onClick={() => navigate(`/project/${project.slug}`)}
                className={`group relative rounded-[2rem] overflow-hidden border border-white/5 bg-[#050505] text-left transition-all duration-500 hover:border-white/15 hover:bg-[#080808] focus:outline-none scroll-reveal ${isLarge ? 'md:col-span-2' : ''}`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                {/* Image */}
                <div className={`relative w-full overflow-hidden ${isLarge ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
                  <ProgressiveImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full transition-transform duration-1000 group-hover:scale-105"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent" />

                  {/* Category pill */}
                  <div className="absolute top-5 left-5">
                    <span
                      className="inline-block px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border text-[10px] font-black uppercase tracking-widest text-white/90"
                      style={{ borderColor: `${accentColor}40` }}
                    >
                      {project.category}
                    </span>
                  </div>

                  {/* Live badge */}
                  {project.url && (
                    <div className="absolute top-5 right-5">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 text-[10px] font-black uppercase tracking-widest text-[#25D366] backdrop-blur-md">
                        <Globe size={12} />
                        Live
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-3xl font-black uppercase text-white tracking-tighter leading-none mb-3 group-hover:text-[#25D366] transition-colors duration-500">
                    {project.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-5 max-w-xl">
                    {project.description}
                  </p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.services?.slice(0, 3).map((s, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                        {s}
                      </span>
                    ))}
                    {(project.services?.length || 0) > 3 && (
                      <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                        +{(project.services?.length || 0) - 3}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-white/30 uppercase tracking-widest group-hover:text-[#25D366]/60 transition-colors">
                      Bekijk case
                    </span>
                    <div
                      className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-transparent transition-all duration-500"
                      style={{ backgroundColor: undefined }}
                    >
                      <ArrowUpRight size={14} className="text-white/40 group-hover:text-black transition-colors" style={{ }} />
                    </div>
                  </div>
                </div>

                {/* Hover accent glow */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: accentColor }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-32 scroll-reveal">
        <div className="relative rounded-[3rem] md:rounded-[4rem] border border-white/10 bg-white/[0.02] p-10 md:p-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/5 via-transparent to-[#00A3E0]/5 opacity-50" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
              Klaar voor <span className="text-[#25D366]">jouw project</span>?
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Wij vertalen ambitie naar visuele resultaten. Neem contact op en ontdek wat wij voor jouw merk kunnen betekenen.
            </p>
            <Button variant="green" icon onClick={onOpenBooking} className="!px-12 !h-[56px] !text-base shadow-[0_0_30px_rgba(37,211,102,0.2)]">
              Neem Contact Op
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
