import React from 'react';

const BASE = import.meta.env.BASE_URL;

// iOS/macOS Safari: mix-blend-mode op <video> en VP9-alpha-webm werken daar
// niet → zwarte vlakken achter Milo. Safari krijgt daarom een HEVC-mp4 met
// écht alpha-kanaal (native ondersteund sinds iOS 13); alle andere browsers
// de bestaande alpha-webm met mp4-fallback.
export const IS_SAFARI =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|crios|fxios|edg|android).)*safari/i.test(navigator.userAgent);

const MiloSources: React.FC<{ name: string; v?: string }> = ({ name, v }) => {
  const q = v ? `?v=${v}` : '';
  return IS_SAFARI ? (
    <source src={`${BASE}video/${name}-hevc.mp4${q}`} type="video/mp4" />
  ) : (
    <>
      <source src={`${BASE}video/${name}.webm${q}`} type="video/webm" />
      <source src={`${BASE}video/${name}.mp4${q}`} type="video/mp4" />
    </>
  );
};

export default MiloSources;
