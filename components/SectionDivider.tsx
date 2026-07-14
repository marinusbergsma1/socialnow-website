import React from 'react';

/**
 * SectionDivider — decoratieve sectie-scheiding: twee schuine trapezia aan de
 * uiteinden met een opening in het midden (aangeleverde SVG-vorm), in de
 * SocialNow-groene merkkleur met subtiele glow. Volle breedte, dun.
 */
const SectionDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-full max-w-6xl mx-auto px-6 py-10 md:py-16 ${className}`} aria-hidden="true">
    <svg
      viewBox="0 0 1035.78 22.73"
      preserveAspectRatio="none"
      className="w-full h-[10px] md:h-[14px] block"
      style={{ filter: 'drop-shadow(0 0 10px rgba(37,211,102,0.55))' }}
    >
      <polygon fill="#25D366" points="782.1 0 774.31 22.73 1035.78 22.73 1035.78 0 782.1 0" />
      <polygon fill="#25D366" points="0 0 0 22.73 236.37 22.73 228.55 0 0 0" />
    </svg>
  </div>
);

export default SectionDivider;
