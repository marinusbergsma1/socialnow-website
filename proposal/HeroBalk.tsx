import React, { useEffect, useRef, useState } from "react";
import { useLanguage, type Language } from "./i18n/context";
import { useToonTaal } from "./taalwissel";

// 26 september 2026 (Marinus): de vier pakkettegels onder de hero zijn vervangen door zinnen die woord
// voor woord omhoog komen; daarna kleurt het deel tussen sterretjes groen. Zes zinnen van 5 seconden,
// samen 30 seconden. De balk wisselt op dezelfde tel als de taal van de hero. Staat de taalwissel stil
// (taalmenu geopend of minder beweging), dan loopt de balk zelf door in de getoonde taal.
const ZINNEN: Record<Language, string[]> = {
  en: [
    "Human creativity *powered by AI technology*",
    "*5 years of experience* combining Odoo with your content and advertisements",
    "Automations with *a real team ready to help*",
    "Create your own ads and *stay in control*",
    "Automations *made secure*",
    "Because managing a business *shouldn’t be complicated*",
  ],
  nl: [
    "Menselijke creativiteit, *aangedreven door AI-technologie*",
    "*5 jaar ervaring* in Odoo samen met je content en advertenties",
    "Automatiseringen met *een echt team dat klaarstaat*",
    "Maak je eigen advertenties en *houd de regie*",
    "Automatiseringen, *veilig opgezet*",
    "Want een bedrijf runnen *hoort niet ingewikkeld te zijn*",
  ],
  de: [
    "Menschliche Kreativität, *angetrieben von KI-Technologie*",
    "*5 Jahre Erfahrung* mit Odoo, Ihren Inhalten und Anzeigen",
    "Automatisierungen mit *einem echten Team an Ihrer Seite*",
    "Erstellen Sie eigene Anzeigen und *behalten Sie die Kontrolle*",
    "Automatisierungen, *sicher umgesetzt*",
    "Denn ein Unternehmen zu führen *sollte nicht kompliziert sein*",
  ],
  fr: [
    "La créativité humaine, *propulsée par l’IA*",
    "*5 ans d’expérience* pour relier Odoo à vos contenus et publicités",
    "Des automatisations avec *une vraie équipe prête à aider*",
    "Créez vos propres publicités et *gardez le contrôle*",
    "Des automatisations *sécurisées*",
    "Parce que gérer une entreprise *ne devrait pas être compliqué*",
  ],
};

const SLAG = 5000;
const STAP = 55;
const UIT_STAP = 28;
const GROEN_STAP = 110;

const VONK = (
  <svg className="h-balk-icoon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 1.8l2.3 7.2 7.3 2.3-7.3 2.3L12 20.8l-2.3-7.2-7.3-2.3 7.3-2.3z" />
  </svg>
);
const SLOT = (
  <svg className="h-balk-icoon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.6" />
    <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
    <path d="M12 14.6v2.4" />
  </svg>
);
// Het sterretje hoort bij de AI-zin, het slotje bij de zin over veiligheid.
const ICONEN: (React.ReactNode | null)[] = [VONK, null, null, null, SLOT, null];

function woorden(zin: string) {
  const uit: { woord: string; groen: boolean }[] = [];
  let groen = false;
  for (const stuk of zin.split("*")) {
    for (const woord of stuk.split(/\s+/)) if (woord) uit.push({ woord, groen });
    groen = !groen;
  }
  return uit;
}

export default function HeroBalk({ paginaTaal }: { paginaTaal: Language }) {
  const { language: getoond } = useLanguage();
  const toon = useToonTaal();
  const [zin, setZin] = useState({ stap: 0, taal: getoond, nr: 0, uit: false });
  const taalRef = useRef(getoond);
  taalRef.current = getoond;
  const zinRef = useRef(zin);
  zinRef.current = zin;
  const vorigeToon = useRef(toon);
  const timers = useRef<number[]>([]);

  const woordenNu = woorden(ZINNEN[zin.taal][zin.stap]);
  const uitDuur = 450 + woordenNu.length * UIT_STAP;

  const wis = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };
  const later = (f: () => void, ms: number) => { timers.current.push(window.setTimeout(f, ms)); };
  const volgende = () => setZin((z) => ({ stap: (z.stap + 1) % ZINNEN.en.length, taal: taalRef.current, nr: z.nr + 1, uit: false }));
  const wissel = () => {
    wis();
    if (zinRef.current.uit) volgende();
    else { setZin((z) => ({ ...z, uit: true })); later(volgende, uitDuur); }
  };

  // Elke nieuwe zin gaat vlak voor de volgende tel weg. Komt die tel niet (taalwissel staat stil of het
  // tabblad ligt op de achtergrond), dan schuift de balk zelf door.
  useEffect(() => {
    later(() => setZin((z) => ({ ...z, uit: true })), SLAG - uitDuur - 60);
    later(volgende, SLAG + 400);
    return wis;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zin.nr]);

  useEffect(() => {
    const vorige = vorigeToon.current;
    vorigeToon.current = toon;
    if (toon === vorige || toon === null) return;
    // De eerste tel start het wisselen; de zin die er al staat neemt dan alleen de getoonde taal over.
    if (vorige === null) { setZin((z) => ({ ...z, taal: toon })); return; }
    wissel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toon]);

  let groenNr = 0;
  const basis = woordenNu.length * STAP + 450;
  const icoon = ICONEN[zin.stap];
  return (
    <div className="h-balk" translate="no">
      <p key={zin.nr} className={`h-balk-zin${zin.uit ? " is-uit" : ""}`} lang={zin.taal} aria-hidden="true">
        {icoon && <span className="h-balk-w" style={{ "--d": "0ms", "--x": "0ms" } as React.CSSProperties}><span>{icoon}</span></span>}
        {woordenNu.map(({ woord, groen }, i) => {
          const k = i + (icoon ? 1 : 0);
          const stijl = { "--d": `${k * STAP}ms`, "--x": `${k * UIT_STAP}ms`, "--s": `${basis + (groen ? groenNr++ : 0) * GROEN_STAP}ms` } as React.CSSProperties;
          return <span key={i} className={`h-balk-w${groen ? " is-groen" : ""}`} style={stijl}><span>{woord}</span></span>;
        })}
      </p>
      <ul className="h-balk-sr" lang={paginaTaal}>
        {ZINNEN[paginaTaal].map((z) => <li key={z}>{z.replace(/\*/g, "")}</li>)}
      </ul>
    </div>
  );
}
