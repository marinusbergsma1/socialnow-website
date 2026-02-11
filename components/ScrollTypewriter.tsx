import React, { useState, useEffect, useRef } from 'react';

interface ScrollTypewriterProps {
  text: string;
  className?: string;
  delay?: number;
  start?: boolean;
  glitch?: boolean;
  uppercase?: boolean;
  withHighlight?: boolean;
  suffixQuote?: boolean;
}

const ScrollTypewriter: React.FC<ScrollTypewriterProps> = ({ 
  text, 
  className = "", 
  delay = 0, 
  start,
  uppercase = true,
  withHighlight = false,
  suffixQuote = false
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Handle Typing Trigger
  useEffect(() => {
    if (start !== undefined) {
      if (start && !hasStarted) {
        setTimeout(() => setHasStarted(true), delay);
      }
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setTimeout(() => setHasStarted(true), delay);
          }
        },
        { threshold: 0.1 }
      );
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [start, delay, hasStarted]);

  // Handle Typing Animation
  useEffect(() => {
    if (!hasStarted) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsComplete(true), 150);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [hasStarted, text]);

  const finalText = uppercase ? displayedText.toUpperCase() : displayedText;

  return (
    <span 
      ref={containerRef} 
      className={`relative inline-flex items-center leading-none ${className}`}
    >
      <span className="relative inline-block">
        <span 
          className="relative z-10 whitespace-pre font-inherit text-white"
        >
          {finalText}
          
          {hasStarted && displayedText.length < text.length && (
            <span 
              className="inline-block w-[4px] h-[0.9em] bg-[#25D366] ml-1 align-middle animate-pulse" 
            />
          )}
        </span>
      </span>

      {suffixQuote && (
        <span className={`text-[#F7E644] ml-2 md:ml-6 transition-all duration-700 ease-out transform ${isComplete ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          "
        </span>
      )}
    </span>
  );
};

export default ScrollTypewriter;