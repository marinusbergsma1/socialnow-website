import React, { useRef, useState, useEffect, memo } from 'react';
import { Activity, Database, Shield, Network } from 'lucide-react';

// ─── CountUp ────────────────────────────────────────────────────────────
const CountUp = memo(({ end, duration = 2000, start, suffix = "m+" }: { end: number; duration?: number; start: boolean; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(easeProgress * end);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, end, duration]);
  return <span>{Math.floor(count)}{suffix}</span>;
});

// ─── Simple Video Card ──────────────────────────────────────────────────
const VideoCard: React.FC<{ src: string; title: string; subtitle: string }> = memo(({ src, title, subtitle }) => {
  return (
    <div className="flex-shrink-0 w-[220px] md:w-[300px] snap-center">
      <div className="w-full h-[380px] md:h-[530px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 bg-black relative group hover:border-[#25D366]/40 transition-all duration-500">
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <p className="text-white font-black uppercase text-sm md:text-base tracking-tight leading-tight">{title}</p>
          <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
});

// ─── Main Component ─────────────────────────────────────────────────────
const ShortContent: React.FC = () => {
  const base = import.meta.env.BASE_URL;
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const videos = [
    { src: `${base}videos/raveg-dyadium.mp4`, title: "RAVEG DYADIUM", subtitle: "Story Campaign" },
    { src: `${base}videos/viral-cho.mp4`, title: "VIRAL CHO", subtitle: "Live Content" },
    { src: `${base}videos/muse-mode.mp4`, title: "MUSE MODE", subtitle: "Team Video" },
    { src: `${base}videos/bakboord.mp4`, title: "BAKBOORD", subtitle: "x Supperclub" },
  ];

  // Stats observer
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.1 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-48 bg-black overflow-hidden relative border-t border-white/5">
      {/* Header */}
      <div className="container mx-auto px-6 relative z-10 text-center mb-12 md:mb-24">
        <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full border border-white/10 bg-white/5 mb-10 backdrop-blur-xl">
          <Network size={16} className="text-[#61F6FD]" />
          <span className="text-white font-black uppercase tracking-[0.4em] text-[10px]">CONTENT_OS_SYNC // V3.2</span>
        </div>
        <h2 className="text-5xl md:text-[10rem] font-black uppercase text-white tracking-tighter leading-none mb-10">
          SHORT FORM <br/> <span className="text-[#F7E644]">&ldquo;</span>CONTENT<span className="text-[#F7E644]">&rdquo;</span>
        </h2>
      </div>

      {/* Simple Horizontal Scroll Slider */}
      <div className="relative px-6 md:px-12">
        <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 scroll-smooth">
          {/* Spacer for centering on desktop */}
          <div className="flex-shrink-0 w-[calc(50vw-160px)] md:w-[calc(50vw-200px)]" />

          {videos.map((video, i) => (
            <VideoCard key={i} src={video.src} title={video.title} subtitle={video.subtitle} />
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-[calc(50vw-160px)] md:w-[calc(50vw-200px)]" />
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 mt-32 md:mt-40 z-10" ref={statsRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {[
            { label: "Followers", end: 2, icon: Activity, color: "#F7E644", id: "01" },
            { label: "Likes", end: 500, icon: Database, color: "#61F6FD", id: "02" },
            { label: "Reach", end: 800, icon: Shield, color: "#F62961", id: "03" }
          ].map((stat, i) => (
            <div key={i} className="relative p-8 md:p-14 rounded-[3rem] bg-[#050505] border border-white/10 transition-all duration-700 flex flex-col items-center group">
              <div className="absolute top-0 right-0 w-40 h-40 blur-[100px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" style={{ backgroundColor: stat.color }} />
              <div className="flex items-center gap-3 mb-8 opacity-30 group-hover:opacity-50 transition-opacity">
                <stat.icon size={16} style={{ color: stat.color }} />
                <span className="text-[10px] font-bold tracking-[0.4em] text-white/60 uppercase">METRIC_OS_{stat.id}</span>
              </div>
              <h4 className="text-7xl md:text-[8rem] font-black mb-4 tracking-tighter" style={{ color: stat.color }}>
                <CountUp end={stat.end} start={statsVisible} suffix="m+" />
              </h4>
              <span className="block text-white uppercase font-bold tracking-[0.3em] text-base">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShortContent;
