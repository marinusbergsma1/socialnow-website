import React from "react";

// Types
interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
}

export interface DockIcon {
  src: string;
  alt: string;
  onClick?: () => void;
  label?: string;
}

// Glass Effect Wrapper Component
export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
}) => {
  const glassStyle: React.CSSProperties = {
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.2)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  const content = (
    <div
      className={`relative flex font-semibold overflow-hidden cursor-pointer transition-all duration-700 glass-effect-container ${className}`}
      style={glassStyle}
    >
      {/* Glass Layers */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      {/* Subtle dark overlay for dark theme compatibility */}
      <div
        className="absolute inset-0 z-10 rounded-[inherit]"
        style={{ background: "rgba(255, 255, 255, 0.07)" }}
      />
      {/* Inner highlight rim */}
      <div
        className="absolute inset-0 z-20 rounded-[inherit] overflow-hidden"
        style={{
          boxShadow:
            "inset 1px 1px 0px 0 rgba(255, 255, 255, 0.25), inset -1px -1px 0px 0 rgba(255, 255, 255, 0.08)",
        }}
      />
      {/* Content */}
      <div className="relative z-30">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
};

// Dock Component
export const GlassDock: React.FC<{ icons: DockIcon[]; href?: string }> = ({
  icons,
  href,
}) => (
  <GlassEffect
    href={href}
    className="rounded-3xl p-3 hover:p-4 hover:rounded-[28px]"
  >
    <div className="flex items-center justify-center gap-2 rounded-3xl py-0 px-0.5 overflow-hidden">
      {icons.map((icon, index) => (
        <img
          key={index}
          src={icon.src}
          alt={icon.alt}
          className="w-14 h-14 transition-all duration-700 hover:scale-110 cursor-pointer"
          style={{
            transformOrigin: "center center",
            transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
          }}
          onClick={icon.onClick}
        />
      ))}
    </div>
  </GlassEffect>
);

// Button Component
export const GlassButton: React.FC<{
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}> = ({ children, href, onClick, className = "" }) => {
  const inner = (
    <GlassEffect
      href={href}
      className={`rounded-2xl px-6 py-3 hover:px-7 hover:py-3.5 hover:rounded-[18px] overflow-hidden ${className}`}
    >
      <div
        className="transition-all duration-700 hover:scale-95 text-white"
        style={{
          transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
        }}
      >
        {children}
      </div>
    </GlassEffect>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="block">
        {inner}
      </button>
    );
  }

  return inner;
};

// SVG Filter Component — render once per page
export const GlassFilter: React.FC = () => (
  <svg
    style={{ display: "none", position: "absolute", width: 0, height: 0 }}
    aria-hidden="true"
  >
    <defs>
      <filter
        id="glass-distortion"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.001 0.005"
          numOctaves="1"
          seed="17"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting
          in="softMap"
          surfaceScale="5"
          specularConstant="1"
          specularExponent="100"
          lightingColor="white"
          result="specLight"
        >
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="1"
          k4="0"
          result="litImage"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="80"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);
