
import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';

interface CTASectionProps {
  onOpenBooking: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onOpenBooking, onVisibilityChange }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true);
        }
        onVisibilityChange?.(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [onVisibilityChange]);

  return (
    <section
      ref={sectionRef}
      className={`pt-10 pb-20 md:pt-20 md:pb-32 bg-transparent relative overflow-visible transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hasRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <div
          className="rounded-2xl md:rounded-3xl p-8 md:p-14 relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-4">
                Klaar om te starten?
              </h2>
              <p className="text-gray-500 text-sm md:text-base font-medium max-w-md">
                Plan een vrijblijvend kennismakingsgesprek en ontdek wat wij voor jouw project kunnen betekenen.
              </p>
            </div>

            <div className="flex justify-center md:justify-end shrink-0">
              <Button
                variant="green"
                icon={true}
                onClick={onOpenBooking}
                triggerOnHover
              >
                Kennismaken
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
