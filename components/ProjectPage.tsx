
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectBySlug, getAdjacentProjects, allProjects } from '../data/projects';
import Button from './Button';
import ProgressiveImage from './ProgressiveImage';
import {
  ArrowLeft, User, Calendar, Layers, ChevronLeft, ChevronRight,
  ExternalLink, Globe, Terminal
} from 'lucide-react';

const ProjectPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Project niet gevonden</h1>
        <Button variant="green" icon onClick={() => navigate('/')}>
          TERUG NAAR HOME
        </Button>
      </div>
    );
  }

  const { prev, next } = getAdjacentProjects(project.slug);
  const currentIndex = allProjects.findIndex(p => p.slug === slug);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate('/')}
          className="bg-black/60 backdrop-blur-xl border border-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg hover:scale-110 active:scale-95"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Fixed Project Counter */}
      <div className="fixed top-6 right-6 z-50">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-lg">
          <button
            onClick={() => navigate(`/project/${prev.slug}`)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest px-2 min-w-[50px] text-center">
            {currentIndex + 1} / {allProjects.length}
          </span>
          <button
            onClick={() => navigate(`/project/${next.slug}`)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        {project.image.endsWith('.mp4') ? (
          <video
            src={project.image}
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <ProgressiveImage
            src={project.image}
            alt={project.title}
            className="w-full h-full"
            objectFit="cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-24">
          <div className="max-w-6xl mx-auto">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#F62961] bg-white/5 backdrop-blur-md">
              {project.category}
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase text-white leading-[0.85] tracking-tighter mb-6">
              {project.title}
            </h1>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] text-sm font-black uppercase tracking-widest hover:bg-[#25D366]/20 transition-all backdrop-blur-md"
              >
                <Globe size={16} />
                Bekijk live website
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left: Description */}
          <div className="lg:w-[60%]">
            <p className="text-gray-300 leading-relaxed font-medium text-lg md:text-xl border-l-2 border-white/20 pl-6 italic">
              {project.description}
            </p>
          </div>

          {/* Right: Metadata */}
          <div className="lg:w-[40%]">
            <div className="grid grid-cols-2 gap-y-8 gap-x-6 border-t border-b border-white/10 py-8">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <User size={12} className="text-[#61F6FD]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Klant</span>
                </div>
                <p className="text-white font-bold text-sm uppercase tracking-tight">{project.client || "Confidential"}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar size={12} className="text-[#F62961]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Jaar</span>
                </div>
                <p className="text-white font-bold text-sm uppercase tracking-tight">{project.year || "2024"}</p>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <Layers size={12} className="text-[#F7E644]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Services</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.services?.map((service, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] text-gray-300 font-black uppercase tracking-widest">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="green" icon onClick={onOpenBooking} className="w-full justify-center !h-[60px]">
                Start jouw project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="flex flex-col gap-8 md:gap-16">
            {project.gallery.map((item, idx) => (
              <div key={idx} className="w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 shadow-lg bg-[#0a0a0a] group relative">
                {item.endsWith('.mp4') ? (
                  <video
                    src={item}
                    autoPlay loop muted playsInline
                    className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-[1.01]"
                  />
                ) : (
                  <img
                    alt={`${project.title} detail ${idx + 1}`}
                    className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-[1.01]"
                    loading="lazy"
                    decoding="async"
                    src={item}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation to Adjacent Projects */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <div className="border-t border-white/10 pt-12 flex flex-col items-center gap-12">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Navigeer door onze cases</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Previous Case */}
            <div
              onClick={() => navigate(`/project/${prev.slug}`)}
              className="group relative rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10 cursor-pointer hover:bg-white/10 hover:border-[#F62961] transition-all overflow-hidden backdrop-blur-md text-left"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#F62961]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <span className="text-[#F62961] text-[10px] font-black uppercase tracking-[0.3em] block mb-3 opacity-60 group-hover:opacity-100 transition-opacity">Vorige Case</span>
                <h3 className="text-xl md:text-2xl font-black uppercase text-white flex items-center gap-3 tracking-tighter">
                  <ChevronLeft size={24} className="group-hover:-translate-x-2 transition-transform text-[#F62961]" />
                  {prev.title}
                </h3>
              </div>
            </div>

            {/* Next Case */}
            <div
              onClick={() => navigate(`/project/${next.slug}`)}
              className="group relative rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10 cursor-pointer hover:bg-white/10 hover:border-[#61F6FD] transition-all overflow-hidden backdrop-blur-md text-left md:text-right"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-[#61F6FD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <span className="text-[#61F6FD] text-[10px] font-black uppercase tracking-[0.3em] block mb-3 opacity-60 group-hover:opacity-100 transition-opacity">Volgende Case</span>
                <h3 className="text-xl md:text-2xl font-black uppercase text-white flex items-center md:justify-end gap-3 tracking-tighter">
                  {next.title}
                  <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform text-[#61F6FD]" />
                </h3>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-white/40 hover:text-[#61F6FD] font-black uppercase tracking-[0.4em] text-[10px] transition-colors mt-4"
          >
            Terug naar overzicht
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
