import { useEffect, useState } from "react";

// Stand vanaf 26 september 2026, 08:21 in Nederland. Het vaste startmoment houdt de
// tellers gelijk voor alle bezoekers en laat ze na een herlaadbeurt doorlopen.
const START = Date.parse("2026-09-26T06:21:00Z");
const WEBSITES_START = 10;
const OS_START = 400;

function osNa(ms: number) {
  // Elke stap duurt 60 tot 120 seconden; de duur volgt uit het stapnummer.
  let n = 0;
  let t = 0;
  while (true) {
    const stap = 60000 + (((n * 2654435761) >>> 0) % 60000);
    if (t + stap > ms) return n;
    t += stap;
    n++;
  }
}

function stand() {
  const ms = Math.max(0, Date.now() - START);
  return { websites: WEBSITES_START + Math.floor(ms / (2 * 60 * 60 * 1000)), os: OS_START + osNa(ms) };
}

export function useTellers() {
  const [tellers, setTellers] = useState(stand);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const klok = window.setInterval(() => {
      const nu = stand();
      setTellers((oud) => (oud.websites === nu.websites && oud.os === nu.os ? oud : nu));
    }, 1000);
    return () => window.clearInterval(klok);
  }, []);
  return tellers;
}
