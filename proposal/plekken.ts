import { useEffect, useSyncExternalStore } from "react";

// 25 september 2026 (Marinus): de teller voor de gratis websites op de beurs. Begint op 18; elke klik
// op het scherm (niet op een knop, link of veld) haalt er één af. Met de toets + komt er één bij,
// voor als er per ongeluk geklikt is. De stand blijft in deze browser bewaard.
const SLEUTEL = "sn-plekken";
const START = 18;
let stand = START;
try { const w = Number(localStorage.getItem(SLEUTEL)); if (Number.isFinite(w) && w > 0 && localStorage.getItem(SLEUTEL) !== null) stand = w; } catch {}
const luisteraars = new Set<() => void>();
const zet = (n: number) => {
  stand = Math.max(1, Math.min(99, n));
  try { localStorage.setItem(SLEUTEL, String(stand)); } catch {}
  luisteraars.forEach((f) => f());
};

export function usePlekken(): number {
  const n = useSyncExternalStore(
    (f) => { luisteraars.add(f); return () => { luisteraars.delete(f); }; },
    () => stand,
    () => START,
  );
  useEffect(() => {
    const klik = (e: MouseEvent) => {
      const doel = e.target as Element | null;
      if (e.button !== 0 || doel?.closest("a, button, input, textarea, select, label, summary, video, [role=button], dialog")) return;
      zet(stand - 1);
    };
    const toets = (e: KeyboardEvent) => {
      if ((e.target as Element | null)?.closest("input, textarea, select")) return;
      if (e.key === "+" || e.key === "=") zet(stand + 1);
    };
    document.addEventListener("click", klik);
    document.addEventListener("keydown", toets);
    return () => { document.removeEventListener("click", klik); document.removeEventListener("keydown", toets); };
  }, []);
  return n;
}
