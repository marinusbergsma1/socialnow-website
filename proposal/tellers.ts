import { useEffect, useState } from "react";

// 25 september 2026 (Marinus): boven de film twee tellers die optellen. "Bij een nieuwe update moet het
// aantal niet veranderen": de stand hangt daarom niet meer af van het moment dat de pagina laadt, maar
// van een vast startmoment. Iedereen ziet hetzelfde getal en na een herlaadbeurt of nieuwe versie telt
// het gewoon door. Websites: één per 45 minuten. Gratis OS-gebruikers: gemiddeld één per 40 seconden,
// met een vaste, per stap wisselende tussentijd zodat het natuurlijk oogt.
const START = Date.parse("2026-09-25T15:40:00Z");
const WEBSITES_START = 6;
const OS_START = 277;

function osNa(ms: number) {
  // Elke stap duurt 20 tot 60 seconden; de duur volgt uit het stapnummer, dus is overal gelijk.
  let n = 0;
  let t = 0;
  while (true) {
    const stap = 20000 + (((n * 2654435761) >>> 0) % 40000);
    if (t + stap > ms) return n;
    t += stap;
    n++;
  }
}

function stand() {
  const ms = Math.max(0, Date.now() - START);
  return { websites: WEBSITES_START + Math.floor(ms / (45 * 60 * 1000)), os: OS_START + osNa(ms) };
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
