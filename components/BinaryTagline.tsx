
import React, { useState, useEffect } from 'react';

const BinaryTagline: React.FC = () => {
  const text1 = "AI-DRIVEN DEVELOPMENT // ";
  const text2 = "BUILT FOR THE FUTURE";
  const [displayText1, setDisplayText1] = useState("");
  const [displayText2, setDisplayText2] = useState("");
  const [isTypingText1, setIsTypingText1] = useState(false);
  const [isConvertingText2, setIsConvertingText2] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    // Vertraging verhoogd naar 5500ms zodat de animatie later start
    const startDelay = setTimeout(() => {
      setIsStarted(true);
      setIsTypingText1(true);
    }, 5500);
    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (isTypingText1) {
      if (displayText1.length < text1.length) {
        const timeout = setTimeout(() => {
          setDisplayText1(text1.slice(0, displayText1.length + 1));
        }, 25);
        return () => clearTimeout(timeout);
      } else {
        setIsTypingText1(false);
        setIsConvertingText2(true);
      }
    }
  }, [isTypingText1, displayText1]);

  useEffect(() => {
    if (!isStarted || isConvertingText2) return;

    const interval = setInterval(() => {
      setDisplayText2(
        text2.split('').map(char => (char === ' ' ? ' ' : (Math.random() > 0.5 ? "1" : "0"))).join('')
      );
    }, 60);

    return () => clearInterval(interval);
  }, [isStarted, isConvertingText2]);

  useEffect(() => {
    if (isConvertingText2) {
      let iteration = 0;
      const maxIterations = 20;
      
      const resolverInterval = setInterval(() => {
        const resolved = text2.split('').map((char, index) => {
          if (char === ' ') return ' ';
          const revealThreshold = (index / text2.length) * maxIterations;
          if (iteration > revealThreshold + 5) return char;
          return Math.random() > 0.5 ? "1" : "0";
        }).join('');

        setDisplayText2(resolved);
        iteration++;

        if (iteration > maxIterations + 10) {
          clearInterval(resolverInterval);
          setDisplayText2(text2);
        }
      }, 50);
      
      return () => clearInterval(resolverInterval);
    }
  }, [isConvertingText2]);

  return (
    <div className="transition-all duration-1000 mb-6 md:mb-10 mt-2 md:mt-6 min-h-[1.5em] opacity-80">
      <div className="text-[#25D366] text-[11px] sm:text-xs md:text-xl font-black uppercase tracking-[0.4em] drop-shadow-[0_0_12px_rgba(37,211,102,0.4)] px-4 flex justify-center flex-wrap">
        <span className="mr-1 relative inline-block">
          <span className="relative z-0 whitespace-pre">{displayText1}</span>
        </span>
        <span className="relative inline-block font-mono text-white">
          {displayText2}
          {(isTypingText1 || isConvertingText2) && (
            <span className="inline-block w-[3px] h-[0.9em] bg-[#25D366] ml-2 animate-pulse align-middle" />
          )}
        </span>
      </div>
    </div>
  );
};

export default BinaryTagline;
