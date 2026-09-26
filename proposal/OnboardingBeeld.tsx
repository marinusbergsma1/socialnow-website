import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { Kanaal } from "./aanvragen";
import BrandGlobe from "./BrandGlobe";
import { agents } from "./content";
import { MiloMotion, useMotion } from "./motion";
import { useTellers } from "./tellers";

// 26 september 2026 (Marinus): "een mooie animatie van het systeem, dezelfde die ook op de homepage staan.
// Maak van zowel website als OS 4 nieuwe versies". Elke onboarding heeft nu vier versies, te kiezen met
// ?versie=1 tot en met 4. Alle beelden komen van de homepage: de OS-film uit de hero, de drie bollen van
// het beeldmerk, de vier Milo's uit "Vier gezichten" en de vier onderdeelfilms van het OS.
export type Versie = 1 | 2 | 3 | 4;
export type Soort = "website" | "os";
export const VERSIES: { nr: Versie; naam: string }[] = [
  { nr: 1, naam: "Film" },
  { nr: 2, naam: "Bollen" },
  { nr: 3, naam: "Vier gezichten" },
  { nr: 4, naam: "Onderdelen" },
];

export function useVersie(): Versie {
  const [params] = useSearchParams();
  const nr = Number(params.get("versie"));
  // 26 september 2026 (Marinus): "zet de laatste live". Versie 4 is de standaard; 1 tot en met 3 blijven
  // bereikbaar via ?versie=, zonder versieknop op de pagina.
  return nr === 1 || nr === 2 || nr === 3 ? nr : 4;
}

function useWissel(aantal: number, ms: number) {
  const { enabled } = useMotion();
  const [nu, setNu] = useState(0);
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const klok = window.setInterval(() => setNu((n) => (n + 1) % aantal), ms);
    return () => window.clearInterval(klok);
  }, [aantal, ms, enabled]);
  return [nu, setNu] as const;
}

// Versie 1: de OS-film uit de hero, met de twee tellers erboven.
function Film() {
  const { websites, os } = useTellers();
  return <div className="ob-film">
    <div className="h-tellers">
      <p><strong key={websites}><i />{websites}</strong><span>websites gemaakt op de beurs</span></p>
      <p><strong key={os}><i />{os}</strong><span>gratis OS-gebruikers</span></p>
    </div>
    <video src="/video/os/os-booth-en.mp4" poster="/video/os/os-booth-en.jpg" autoPlay muted loop playsInline preload="auto" aria-label="SocialNow OS explainer" />
  </div>;
}

// Versie 3: de vier Milo's lichten om de beurt op, zoals de onderdelen samen één OS vormen.
function Gezichten() {
  const [nu, setNu] = useWissel(agents.length, 2600);
  return <div className="ob-gezichten" aria-label="Website, CRM, Studio en Advertenties in SocialNow OS">
    {agents.map((agent, i) => (
      <button type="button" key={agent.id} className={i === nu ? "is-aan" : ""} style={{ "--accent": agent.color } as React.CSSProperties} onClick={() => setNu(i)} aria-pressed={i === nu}>
        <MiloMotion role={agent.id} name={agent.name} />
        <strong>{agent.title}</strong>
        <span>{agent.promise}</span>
      </button>
    ))}
    <i className="ob-gezichten-lijn" aria-hidden="true" />
  </div>;
}

// Versie 4: de vier onderdeelfilms van het OS wisselen elkaar af in een scherm, met tabs eronder.
function Onderdelen({ soort }: { soort: Soort }) {
  const volgorde = soort === "website" ? agents : [agents[1], agents[2], agents[3], agents[0]];
  const [nu, setNu] = useWissel(volgorde.length, 6000);
  const films = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    films.current.forEach((film, i) => {
      if (!film) return;
      if (i === nu) { film.currentTime = 0; void film.play().catch(() => {}); } else film.pause();
    });
  }, [nu]);
  return <div className="ob-onderdelen">
    <div className="ob-scherm">
      <div className="ob-scherm-balk"><i /><i /><i /><span>socialnow.os / {volgorde[nu].title.toLowerCase()}</span></div>
      <div className="ob-scherm-vlak">
        {volgorde.map((agent, i) => (
          <video key={agent.id} ref={(el) => { films.current[i] = el; }} className={i === nu ? "is-aan" : ""} src={`/video/os/${agent.video}.mp4`} poster={`/video/os/${agent.video}.webp`} muted loop playsInline preload={i === 0 ? "auto" : "metadata"} aria-hidden={i !== nu} />
        ))}
      </div>
    </div>
    <div className="ob-tabs" role="tablist">
      {volgorde.map((agent, i) => (
        <button type="button" role="tab" key={agent.id} aria-selected={i === nu} className={i === nu ? "is-aan" : ""} style={{ "--accent": agent.color } as React.CSSProperties} onClick={() => setNu(i)}>
          <span>{agent.title}</span><i><b key={nu} /></i>
        </button>
      ))}
    </div>
  </div>;
}

export function VersieKiezer({ versie }: { versie: Versie }) {
  const [params, setParams] = useSearchParams();
  const kies = (nr: Versie) => { const p = new URLSearchParams(params); p.set("versie", String(nr)); setParams(p, { replace: true }); };
  return <nav className="ob-kiezer" aria-label="Versie van deze pagina">
    <span>Versie</span>
    {VERSIES.map((v) => <button type="button" key={v.nr} className={v.nr === versie ? "is-aan" : ""} aria-pressed={v.nr === versie} title={v.naam} onClick={() => kies(v.nr)}>{v.nr}</button>)}
  </nav>;
}

// De layout rond het formulier. `kop` is de titel met intro, `children` het formulier.
export default function OnboardingBeeld({ versie, soort, kop, children }: { versie: Versie; soort: Soort; kop: React.ReactNode; children: React.ReactNode }) {
  const kiezer = null;
  if (versie === 2) return <div className="gw ob ob-v2">
    <div className="ob-bollen" aria-hidden="true"><BrandGlobe /></div>
    <div className="gw-sheet">{kop}<div className="ob-glas">{children}</div></div>{kiezer}
  </div>;
  if (versie === 3) return <div className="gw ob ob-v3">
    <div className="gw-sheet ob-v3-sheet">{kop}<Gezichten />{children}</div>{kiezer}
  </div>;
  return <div className={`gw ob ob-v${versie}`}>
    <div className="gw-breed ob-duo">
      <div className="ob-links">{kop}{children}</div>
      <aside className="ob-rechts">{versie === 1 ? <Film /> : <Onderdelen soort={soort} />}</aside>
    </div>{kiezer}
  </div>;
}

// Twee gelijkwaardige manieren om te versturen. Geen van beide is verplicht.
export function Verzendkeuze({ tekst }: { tekst: string }) {
  return <div className="ob-verzend">
    <button type="submit" name="kanaal" value="mail" className="sn-btn3d h-button gw-verder"><span className="sn-btn3d-sheen" /><span>{tekst}</span><span className="h-button-icon"><ArrowUpRight size={16} /></span></button>
    <button type="submit" name="kanaal" value="whatsapp" className="ob-tweede"><MessageCircle size={17} aria-hidden="true" /><span>Liever via WhatsApp</span></button>
  </div>;
}
export function gekozenKanaal(e: React.FormEvent): Kanaal {
  const knop = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
  return knop?.value === "whatsapp" ? "whatsapp" : "mail";
}
