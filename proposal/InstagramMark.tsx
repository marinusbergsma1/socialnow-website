import React from "react";

// 10 oktober 2026: zelfde maat en plek als LinkedInMark, voor teamleden die we via Instagram laten zien.
export default function InstagramMark() {
  const kleur = `ig-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      className="h-linkedin-mark h-instagram-mark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="15"
      height="15"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={kleur} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#feda75" />
          <stop offset=".35" stopColor="#fa7e1e" />
          <stop offset=".65" stopColor="#d62976" />
          <stop offset="1" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect width="16" height="16" rx="4" fill={`url(#${kleur})`} />
      <rect x="3.6" y="3.6" width="8.8" height="8.8" rx="2.6" fill="none" stroke="#fff" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="2.1" fill="none" stroke="#fff" strokeWidth="1.3" />
      <circle cx="11.1" cy="4.9" r=".75" fill="#fff" />
    </svg>
  );
}
