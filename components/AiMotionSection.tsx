
import React, { useRef, useState, useEffect, useCallback } from 'react';
import ScrollTypewriter from './ScrollTypewriter';
import { Volume2, VolumeX } from 'lucide-react';
import { muteGlobalVideo } from './ShortContent';
import { useScrollProgress } from '../hooks/useScrollProgress';

const AiMotionSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isUnmuted, setIsUnmuted] = useState(false);

    const handleTap = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isUnmuted) {
            video.muted = true;
            setIsUnmuted(false);
        } else {
            muteGlobalVideo();
            video.muted = false;
            video.volume = 0.5;
            video.play().catch(() => {});
            setIsUnmuted(true);
        }
    };

    // Scroll Scale Animation — uses CSS custom properties to avoid re-renders
    const scrollCallback = useCallback((rect: DOMRect, viewportHeight: number) => {
        const elementCenter = rect.top + (rect.height / 2);
        const center = viewportHeight / 2;
        const distance = Math.abs(center - elementCenter);
        let newScale = 1.05 - (distance / viewportHeight) * 0.35;
        if (Number.isFinite(newScale)) {
            newScale = Math.max(0.85, Math.min(newScale, 1.05));
            containerRef.current?.style.setProperty('--video-scale', String(newScale));
        }
    }, []);
    useScrollProgress(containerRef, scrollCallback);

    return (
        <section className="pt-12 pb-24 bg-transparent relative overflow-visible">
            {/* --- THE GRID OVERLAY --- */}
            <div 
              className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
              style={{ 
                backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`, 
                backgroundSize: '40px 40px', 
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)', 
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)' 
              }}
            ></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-8xl font-black uppercase text-white tracking-tighter mb-6 leading-none flex items-center justify-center">
                        <span className="text-[#F7E644] mr-2 md:mr-6">"</span>
                        <div className="flex items-center whitespace-nowrap">
                            <ScrollTypewriter text="AI IN MOTION" withHighlight={true} />
                        </div>
                        <span className="text-[#F7E644] ml-2 md:ml-6">"</span>
                    </h2>
                </div>

                <div 
                    ref={containerRef}
                    className="relative w-full max-w-6xl mx-auto group cursor-pointer flex justify-center"
                >
                    {/* Blue Glow Background */}
                    <div 
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#0077CC] rounded-full blur-[120px] opacity-30 pointer-events-none transition-opacity duration-700"
                       style={{ transform: `translate(-50%, -50%) scale(var(--video-scale, 0.85))`, willChange: 'transform' }}
                    ></div>
                    
                    {/* Video Container */}
                    <div
                        className="relative z-10 w-full aspect-video rounded-none overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,119,204,0.5)] bg-black transition-transform duration-100 ease-out cursor-pointer"
                        style={{ transform: `scale(var(--video-scale, 0.85))`, willChange: 'transform' }}
                        onClick={handleTap}
                    >
                        <video
                            ref={videoRef}
                            src={`${import.meta.env.BASE_URL}videos/ai-showcase.mp4`}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        {/* Sound indicator */}
                        <div className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isUnmuted ? 'bg-[#25D366] scale-110' : 'bg-black/60 scale-90'
                        }`}
                            style={{ backdropFilter: isUnmuted ? 'none' : 'blur(8px)' }}
                        >
                            {isUnmuted
                                ? <Volume2 size={16} className="text-black" />
                                : <VolumeX size={16} className="text-white/70" />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AiMotionSection;
