import { useEffect, useState } from "react";

// 25 september 2026 (Marinus): boven de film twee tellers die optellen. Websites gemaakt op de beurs:
// elke 10 minuten één erbij. Gratis OS-gebruikers: gemiddeld één per 10 seconden, en af en toe een
// paar snel achter elkaar, zodat het natuurlijk oogt.
export function useTellers() {
  const [websites, setWebsites] = useState(6);
  const [os, setOs] = useState(230);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const klok = window.setInterval(() => setWebsites((n) => n + 1), 10 * 60 * 1000);
    const extra: number[] = [];
    let volgende = 0;
    const plan = () => {
      volgende = window.setTimeout(() => {
        setOs((n) => n + 1);
        if (Math.random() < 0.18) {
          let t = 0;
          for (let i = 1 + Math.floor(Math.random() * 3); i > 0; i--) {
            t += 350 + Math.random() * 700;
            extra.push(window.setTimeout(() => setOs((n) => n + 1), t));
          }
        }
        plan();
      }, 5000 + Math.random() * 10000);
    };
    plan();
    return () => { window.clearInterval(klok); window.clearTimeout(volgende); extra.forEach((x) => window.clearTimeout(x)); };
  }, []);
  return { websites, os };
}
