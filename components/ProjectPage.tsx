
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectBySlug, getAdjacentProjects, allProjects } from '../data/projects';
import Button from './Button';
import ProgressiveImage from './ProgressiveImage';
import {
  User, Calendar, Layers, ChevronLeft, ChevronRight,
  ExternalLink, Globe, Monitor, MousePointer
} from 'lucide-react';

// Simple video for gallery items
const GalleryVideo: React.FC<{ src: string }> = ({ src }) => (
  <video
    src={src}
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-auto block"
  />
);

// Scrollable website preview — swipe through the full page, click to visit
const WebsitePreview: React.FC<{ screenshot: string; url: string; title: string }> = ({ screenshot, url, title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isAutoScrolling) return;

    let animationId: number;
    let startTime: number | null = null;
    const duration = 8000; // 8 seconds to auto-scroll down

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      if (container) {
        const maxScroll = container.scrollHeight - container.clientHeight;
        container.scrollTop = eased * maxScroll * 0.3; // Only scroll 30% down
      }

      if (progress < 1 && isAutoScrolling) {
        animationId = requestAnimationFrame(animate);
      }
    };

    const timeout = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 1500);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationId);
    };
  }, [isAutoScrolling]);

  const handleScroll = () => {
    setIsAutoScrolling(false);
    const container = scrollRef.current;
    if (!container) return;
    const maxScroll = container.scrollHeight - container.clientHeight;
    setScrollProgress(maxScroll > 0 ? container.scrollTop / maxScroll : 0);
  };

  return (
    <div className="relative group">
      {/* Browser chrome frame */}
      <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-[#111] shadow-2xl">
        {/* Browser top bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-1.5 text-xs text-white/40 font-mono max-w-[400px] w-full">
              <Globe size={12} className="text-white/30 shrink-0" />
              <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold uppercase tracking-widest hover:bg-[#25D366]/20 transition-all"
          >
            <ExternalLink size={10} />
            Live
          </a>
        </div>

        {/* Scrollable screenshot container */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onTouchStart={() => setIsAutoScrolling(false)}
            className="overflow-y-auto overflow-x-hidden cursor-grab active:cursor-grabbing"
            style={{ maxHeight: '70vh' }}
          >
            <a href={url} target="_blank" rel="noopener noreferrer" className="block">
              <img
                src={screenshot}
                alt={`${title} - Full website preview`}
                className="w-full h-auto block"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>

          {/* Scroll progress indicator */}
          <div className="absolute top-2 right-2 bottom-2 w-1 rounded-full bg-white/5 z-10">
            <div
              className="w-full rounded-full bg-[#61F6FD]/40 transition-all duration-150"
              style={{ height: `${Math.max(10, (1 / 6) * 100)}%`, transform: `translateY(${scrollProgress * 500}%)` }}
            ></div>
          </div>

          {/* Gradient overlays for scroll hint */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#111] to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Bottom bar with hint */}
        <div className="flex items-center justify-center gap-3 px-4 py-3 bg-[#1a1a1a] border-t border-white/10">
          <MousePointer size={12} className="text-white/30 animate-bounce" />
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Scroll om door de site te bladeren — Klik om te bezoeken</span>
        </div>
      </div>
    </div>
  );
};

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
      {/* Fixed Project Counter */}
      <div className="fixed top-6 right-6 z-50">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-lg">
          <button
            onClick={() => navigate(`/project/${prev.slug}`)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 min-w-[50px] text-center">
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
      <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20"></div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-4 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#61F6FD] bg-white/5 backdrop-blur-md">
              {project.category}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase text-white leading-[0.9] tracking-tighter mb-5">
              {project.title}
            </h1>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] text-xs font-bold uppercase tracking-widest hover:bg-[#25D366]/20 transition-all backdrop-blur-md"
              >
                <Globe size={14} />
                Bekijk live website
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
          {/* Left: Description */}
          <div className="lg:w-[60%]">
            <p className="text-gray-300 leading-relaxed text-base md:text-lg border-l-2 border-white/20 pl-6">
              {project.description}
            </p>
          </div>

          {/* Right: Metadata */}
          <div className="lg:w-[40%]">
            <div className="grid grid-cols-2 gap-y-6 gap-x-6 border-t border-b border-white/10 py-6">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <User size={12} className="text-[#61F6FD]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Klant</span>
                </div>
                <p className="text-white font-bold text-sm uppercase tracking-tight">{project.client || "Confidential"}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar size={12} className="text-[#F62961]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Jaar</span>
                </div>
                <p className="text-white font-bold text-sm uppercase tracking-tight">{project.year || "2024"}</p>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2 text-gray-500 mb-3">
                  <Layers size={12} className="text-[#F7E644]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Services</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.services?.map((service, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="green" icon onClick={onOpenBooking} className="w-full justify-center !h-[52px]">
                Start jouw project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-page scrollable website preview */}
      {project.fullPageScreenshot && project.url && (
        <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20">
          <div className="flex items-center gap-3 mb-6">
            <Monitor size={16} className="text-[#61F6FD]" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Website Preview</h2>
          </div>
          <WebsitePreview
            screenshot={project.fullPageScreenshot}
            url={project.url}
            title={project.title}
          />
        </div>
      )}

      {/* Gallery - naast elkaar, niet inkorten */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 md:px-12 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
            {project.gallery.map((item, idx) => (
              <div key={idx} className="rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 bg-[#0a0a0a] group relative">
                {item.endsWith('.mp4') ? (
                  <GalleryVideo src={item} />
                ) : (
                  <img
                    alt={`${project.title} detail ${idx + 1}`}
                    className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
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
      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20">
        <div className="border-t border-white/10 pt-10 flex flex-col items-center gap-10">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">Navigeer door onze cases</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Previous Case */}
            <button
              onClick={() => navigate(`/project/${prev.slug}`)}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 cursor-pointer hover:bg-white/10 hover:border-[#F62961] transition-all overflow-hidden text-left"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#F62961]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <span className="text-[#F62961] text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 opacity-60 group-hover:opacity-100 transition-opacity">Vorige Case</span>
                <h3 className="text-lg md:text-xl font-black uppercase text-white flex items-center gap-3 tracking-tighter">
                  <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform text-[#F62961]" />
                  {prev.title}
                </h3>
              </div>
            </button>

            {/* Next Case */}
            <button
              onClick={() => navigate(`/project/${next.slug}`)}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 cursor-pointer hover:bg-white/10 hover:border-[#61F6FD] transition-all overflow-hidden text-left md:text-right"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-[#61F6FD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <span className="text-[#61F6FD] text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 opacity-60 group-hover:opacity-100 transition-opacity">Volgende Case</span>
                <h3 className="text-lg md:text-xl font-black uppercase text-white flex items-center md:justify-end gap-3 tracking-tighter">
                  {next.title}
                  <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform text-[#61F6FD]" />
                </h3>
              </div>
            </button>
          </div>

          <button
            onClick={() => navigate('/projecten')}
            className="text-white/40 hover:text-[#61F6FD] font-bold uppercase tracking-[0.3em] text-[10px] transition-colors mt-2"
          >
            Alle projecten bekijken
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
