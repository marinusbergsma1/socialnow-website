import React from 'react';

/**
 * SectionDivider — subtiel, dun groen scheidingslijntje. Een enkele fijne lijn
 * die aan de randen wegvaagt, met een klein oplichtend accent in het midden.
 * Ingetogen: bedoeld om af en toe secties rustig te scheiden.
 */
const SectionDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-full flex items-center justify-center py-10 md:py-14 ${className}`} aria-hidden="true">
    <span className="h-px w-full max-w-[220px] bg-gradient-to-r from-transparent via-[#25D366]/40 to-transparent" />
    <span className="mx-3 w-1.5 h-1.5 rounded-full bg-[#25D366] shadow-[0_0_8px_rgba(37,211,102,0.7)] shrink-0" />
    <span className="h-px w-full max-w-[220px] bg-gradient-to-r from-transparent via-[#25D366]/40 to-transparent" />
  </div>
);

export default SectionDivider;
