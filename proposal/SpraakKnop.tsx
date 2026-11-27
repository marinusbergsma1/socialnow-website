import React, { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

// 27 november 2026 (Marinus): "Geef de mensen ook een audio optie bij het invullen van het formulier." Inspreken in plaats van typen:
// de browser zet spraak om in tekst (Web Speech API), die achter het veld wordt gezet. Er gaat geen audio naar SocialNow; alleen de tekst
// in het veld. Browsers zonder spraakherkenning (o.a. Firefox) zien de knop niet.
type Herkenner = { lang: string; continuous: boolean; interimResults: boolean; start(): void; stop(): void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

export default function SpraakKnop({ tekst, zet, taal = "nl-NL" }: { tekst: string; zet: (t: string) => void; taal?: string }) {
  const [kan, zetKan] = useState(false);
  const [luistert, zetLuistert] = useState(false);
  const h = useRef<Herkenner | null>(null);
  const basis = useRef("");
  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => Herkenner; webkitSpeechRecognition?: new () => Herkenner };
    zetKan(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => h.current?.stop();
  }, []);
  if (!kan) return null;
  const wissel = () => {
    if (luistert) { h.current?.stop(); return; }
    const w = window as unknown as { SpeechRecognition?: new () => Herkenner; webkitSpeechRecognition?: new () => Herkenner };
    const R = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!R) return;
    const r = new R();
    r.lang = taal; r.continuous = true; r.interimResults = true;
    basis.current = tekst ? tekst.replace(/\s*$/, " ") : "";
    r.onresult = (e) => {
      let s = "";
      for (let i = 0; i < e.results.length; i++) s += e.results[i][0].transcript;
      zet((basis.current + s).trimStart());
    };
    r.onend = () => zetLuistert(false);
    r.onerror = () => zetLuistert(false);
    h.current = r;
    r.start();
    zetLuistert(true);
  };
  return <button type="button" className="gw2-spraak" aria-pressed={luistert} onClick={wissel}
    aria-label={luistert ? "Stop met inspreken" : "Spreek je antwoord in"} title={luistert ? "Stop met inspreken" : "Spreek je antwoord in"}>
    {luistert ? <Square size={16} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
  </button>;
}
