
import React, { useRef, useState, useEffect, memo, useMemo } from 'react';
import { Activity, Volume2, Database, Network, Shield } from 'lucide-react';

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

interface VideoCardProps {
  src: string;
  isFocused: boolean;
  priority: boolean; 
  onEnter: () => void;
  onLeave: () => void;
}

const VideoCard = memo(({ src, isFocused, priority, onEnter, onLeave }: VideoCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasError) return;

    if (priority) {
      if (!video.src || video.src === "" || !video.src.includes(src)) {
        video.src = src;
        video.load();
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (video) {
            video.muted = true;
            video.play().catch(() => {});
          }
        });
      }
    } else {
      video.pause();
      if (video.src !== "") {
        video.src = "";
        video.load();
        setIsLoaded(false);
      }
    }
  }, [priority, src, hasError]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isFocused;
    }
  }, [isFocused]);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`
        shrink-0 w-[220px] md:w-[340px] h-[380px] md:h-[600px] rounded-[2rem] md:rounded-[3rem] 
        relative transition-all duration-700 bg-black border-2 overflow-hidden cursor-pointer snap-center z-10
        ${isFocused 
          ? '!scale-[1.02] !z-20 border-[#25D366] shadow-[0_0_100px_rgba(37,211,102,0.2)]' 
          : 'border-white/5 opacity-40'}
      `}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className={`absolute inset-0 z-10 bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {!hasError && priority && (
          <div className="w-6 h-6 border-2 border-white/5 border-t-[#25D366] rounded-full animate-spin"></div>
        )}
      </div>

      {!hasError && (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none" 
          onError={() => setHasError(true)}
          onPlaying={() => setIsLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-20 transition-opacity ${isFocused ? 'opacity-0' : 'opacity-100'}`}></div>
      
      <div className={`absolute bottom-4 right-4 md:bottom-8 md:right-8 p-2 md:p-3 rounded-full bg-black/50 backdrop-blur-2xl border border-white/10 transition-all duration-500 transform z-30 ${isFocused ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <Volume2 className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] text-[#25D366]" />
      </div>
    </div>
  );
});

const ShortContent: React.FC = () => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.1 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Reduced to 5 optimal loading videos
  const videoSources = useMemo(() => [
    "https://storage.googleapis.com/video-slider/RAVEG%20DYADIUM%20STORY.mp4",
    "https://storage.googleapis.com/video-slider/HD/Supperclub%20x%20SocialNow%20Promotion.mp4",
    "https://storage.googleapis.com/video-slider/HD/VIRAL%20CHO%20LIVE%20NEW.mp4",
    "https://storage.googleapis.com/video-slider/HD/MUSE%20MODE%20TEAM%20VIDEO.mp4",
    "https://storage.googleapis.com/video-slider/HD/Bakboord%20x%20Supperclub%20Cruise%20promotievideo.mp4"
  ], []);

  const duplicatedSources = useMemo(() => [...videoSources, ...videoSources], [videoSources]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const centerX = container.getBoundingClientRect().left + container.offsetWidth / 2;
      const children = Array.from(container.children[0].children) as HTMLElement[];
      
      const distances = children.map((child, index) => {
        const rect = child.getBoundingClientRect();
        const childCenter = rect.left + rect.width / 2;
        return { index, dist: Math.abs(centerX - childCenter) };
      });

      const top3 = distances
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3)
        .map(d => d.index);

      setVisibleIndices(top3);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      const interval = setInterval(handleScroll, 500);
      handleScroll();
      return () => {
        container.removeEventListener('scroll', handleScroll);
        clearInterval(interval);
      };
    }
  }, []);

  return (
    <section className="py-24 md:py-48 bg-black overflow-hidden relative border-t border-white/5">
      <div className="container mx-auto px-6 relative z-10 text-center mb-12 md:mb-32">
        <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full border border-white/10 bg-white/5 mb-10 backdrop-blur-xl">
          <Network size={16} className="text-[#61F6FD]" />
          <span className="text-white font-black uppercase tracking-[0.4em] text-[10px]">CONTENT_OS_SYNC // V3.2</span>
        </div>
        <h2 className="text-5xl md:text-[10rem] font-black uppercase text-white tracking-tighter leading-none mb-10">
          SHORT FORM <br/> <span className="text-[#F7E644]">"</span>CONTENT<span className="text-[#F7E644]">"</span>
        </h2>
      </div>

      <div ref={scrollContainerRef} className="relative w-full overflow-x-auto no-scrollbar py-12 md:py-20 z-10">
        <div className="flex gap-4 md:gap-10 animate-scroll items-center w-max" style={{ animationDuration: '60s' }}>
          {duplicatedSources.map((src, i) => (
            <VideoCard 
              key={`${src}-${i}`} 
              src={src} 
              priority={visibleIndices.includes(i)}
              isFocused={focusedIndex === i} 
              onEnter={() => setFocusedIndex(i)} 
              onLeave={() => setFocusedIndex(null)} 
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 mt-32 md:mt-40 z-10" ref={statsRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {[
            { label: "Followers", end: 2, icon: Activity, color: "#F7E644", id: "01" },
            { label: "Likes", end: 500, icon: Database, color: "#61F6FD", id: "02" },
            { label: "Reach", end: 800, icon: Shield, color: "#F62961", id: "03" }
          ].map((stat, i) => (
             <div key={i} className="relative p-10 md:p-20 rounded-[4rem] bg-[#050505] border border-white/10 transition-all duration-700 flex flex-col items-center overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 blur-[100px] opacity-[0.03] group-hover:opacity-[0.1] transition-opacity" style={{ backgroundColor: stat.color }}></div>
                <div className="flex items-center gap-4 mb-14 opacity-30 group-hover:opacity-60 transition-opacity">
                  <stat.icon size={20} style={{ color: stat.color }} />
                  <span className="text-[12px] font-black tracking-[0.6em] text-white uppercase">METRIC_OS_{stat.id}</span>
                </div>
                <h4 className="text-8xl md:text-[11rem] font-black mb-6 tracking-tighter" style={{ color: stat.color }}>
                  <CountUp end={stat.end} start={statsVisible} suffix="m+" />
                </h4>
                <span className="block text-white uppercase font-black tracking-[0.5em] text-xl">{stat.label}</span>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShortContent;
