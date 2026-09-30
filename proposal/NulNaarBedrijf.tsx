import React from "react";
import { ShieldCheck } from "lucide-react";
import { Bento, Tegel, useInBeeld } from "./Bento";
import { OdooLogo } from "./Verhaal";
import { useTeller } from "./Bereikt";
import { useLanguage } from "./i18n/context";

// 29 september 2026 (Marinus): "wij hebben het beste management- en operatiesysteem gebouwd waarmee je vanaf nul binnen een
// uur een bedrijf kunt bouwen". Verdedigbaar geformuleerd, zonder "#1 ter wereld" en zonder partnerclaim richting Odoo.
// Wat nog niet in het live OS staat, draagt de pil "Binnenkort": de tien vragen, de koppeling met je eigen AI en de
// marketingchat. Zet BESCHIKBAAR hieronder op true zodra een onderdeel live is.
const BESCHIKBAAR = { vragen: false, ai: false, marketing: false };

const VRAGEN = [
  "Hoe heet je bedrijf?",
  "Wat verkoop je?",
  "Voor wie?",
  "Waar werk je?",
  "Je doel dit kwartaal?",
  "Je aanbod en prijzen?",
  "Je karakter en toon?",
  "Je kleuren en beeldstijl?",
  "Je kanalen en ritme?",
  "Wat moet een klant doen?",
];

function Status({ live }: { live: boolean }) {
  return live ? <span className="h-pil-status">Nu in je OS</span> : <span className="h-pil-status is-binnenkort">Binnenkort</span>;
}

function TienVragen() {
  const { ref, aan } = useInBeeld<HTMLDivElement>();
  const klaar = useTeller(VRAGEN.length, aan, 4200);
  const minuten = Math.round((klaar / VRAGEN.length) * 60);
  return (
    <div ref={ref} className="h-vragen">
      <ol>
        {VRAGEN.map((vraag, index) => (
          <li key={vraag} className={index < klaar ? "is-klaar" : undefined}>{vraag}</li>
        ))}
      </ol>
      <div className="h-klok" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <circle className="h-klok-baan" cx="32" cy="32" r="27" />
          <circle className="h-klok-voortgang" cx="32" cy="32" r="27" pathLength="100" style={{ strokeDashoffset: 100 - (minuten / 60) * 100 }} />
        </svg>
        <div>
          <b>{minuten}</b>
          <small>van 60 min</small>
        </div>
      </div>
    </div>
  );
}

function Koppelingen() {
  return (
    <div className="h-koppel" aria-hidden="true">
      <svg viewBox="0 0 300 190" preserveAspectRatio="none">
        <path className="h-koppel-lijn" pathLength="1" d="M48 34 C60 110 110 148 150 148" />
        <path className="h-koppel-lijn" pathLength="1" d="M150 27 L150 148" />
        <path className="h-koppel-lijn" pathLength="1" d="M252 34 C240 110 190 148 150 148" />
      </svg>
      <span className="h-koppel-knoop is-a"><OdooLogo /></span>
      <span className="h-koppel-knoop is-b">Studio</span>
      <span className="h-koppel-knoop is-c" translate="no">Zernio</span>
      <span className="h-koppel-knoop is-os">OS</span>
    </div>
  );
}

// De terminal typt de koppeling zoals het OS die per soort AI-assistent laat zien (api/_mcp-core.js, clientSetup).
// 30 september 2026: geen modelnamen in sitecopy, dus de tabs heten naar de plek waar je AI draait.
const AI_SCRIPTS = [
  { naam: "Terminal", commando: "mcp add socialnow https://app.socialnow.nl/api/mcp" },
  { naam: "Editor", commando: '"socialnow": { "url": "https://app.socialnow.nl/api/mcp" }' },
  { naam: "App", commando: "connector: https://app.socialnow.nl/api/mcp" },
];

function AiTerminal() {
  const { t } = useLanguage();
  const { ref, aan } = useInBeeld<HTMLDivElement>();
  const [ai, setAi] = React.useState(0);
  const [getypt, setGetypt] = React.useState(0);
  const [fase, setFase] = React.useState(0);
  const [minder, setMinder] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) setMinder(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const commando = AI_SCRIPTS[ai].commando;
  React.useEffect(() => {
    if (!aan) return;
    if (minder) { setGetypt(commando.length); setFase(3); return; }
    if (getypt < commando.length) {
      const timer = window.setTimeout(() => setGetypt((n) => n + 2), 28);
      return () => window.clearTimeout(timer);
    }
    if (fase < 3) {
      const timer = window.setTimeout(() => setFase((f) => f + 1), 700);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => { setAi((i) => (i + 1) % AI_SCRIPTS.length); setGetypt(0); setFase(0); }, 3200);
    return () => window.clearTimeout(timer);
  }, [aan, getypt, fase, commando, minder]);
  return (
    <div ref={ref} className="h-terminal" aria-hidden="true">
      <div className="h-terminal-balk">
        <i /><i /><i />
        <span className="h-terminal-tabs" translate="no">
          {AI_SCRIPTS.map((script, index) => <span key={script.naam} className={index === ai ? "is-aan" : undefined}>{script.naam}</span>)}
        </span>
      </div>
      <p className="h-terminal-regels">
        <span className="is-prompt">$ </span>
        <span translate="no">{commando.slice(0, getypt)}</span>
        {fase === 0 && <span className="h-terminal-cursor" />}
        {fase >= 1 && <>{"\n"}<span className="is-ok">{t("✓ Verbonden met jouw OS, alleen jouw werkruimte")}</span></>}
        {fase >= 2 && <>{"\n"}<span className="is-vraag">{t("> Zet mijn nieuwe bedrijf op")}</span></>}
        {fase >= 3 && <>{"\n"}<span className="is-ok">{t("✓ Voorstel klaar. Keur het goed in je OS.")}</span><span className="h-terminal-cursor" /></>}
      </p>
    </div>
  );
}

function MarketingChat() {
  const { ref, aan } = useInBeeld<HTMLDivElement>();
  const [stap, setStap] = React.useState(0);
  React.useEffect(() => {
    if (!aan) return;
    const timers = [400, 1500, 2600].map((tijd, index) => window.setTimeout(() => setStap(index + 1), tijd));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [aan]);
  const besteed = useTeller(240, stap >= 3, 1400);
  return (
    <div ref={ref} className="h-mchat" aria-hidden="true">
      <p className={`h-mchat-bericht is-jij${stap >= 1 ? " is-zichtbaar" : ""}`}>Plan mijn campagne voor oktober.</p>
      <p className={`h-mchat-bericht is-os${stap >= 2 ? " is-zichtbaar" : ""}`}>Twaalf posts klaar in jouw merkstijl, ingepland via Zernio. De advertenties blijven binnen je budget.</p>
      <div className="h-budget">
        <div className="h-budget-kop"><span>Goedgekeurd maandbudget</span><b>€ {besteed} / € 500</b></div>
        <div className="h-budget-balk"><span style={{ width: `${(besteed / 500) * 100}%` }} /></div>
        <span className="h-budget-slot"><ShieldCheck size={14} />Niets boven jouw limiet</span>
      </div>
    </div>
  );
}

export default function NulNaarBedrijf() {
  return (
    <Bento
      id="nul-naar-bedrijf"
      className="h-nul"
      label="Van nul naar een draaiend bedrijf"
      titel={<>Tien vragen.<br /><span>Eén uur. Een compleet bedrijf.</span></>}
    >
      <Tegel kop="Nieuw bedrijf of bestaand bedrijf" breed={7} soort="groen" className="h-nul-vragen">
        <Status live={BESCHIKBAAR.vragen} />
        <p className="sn-tegel-titel">Beantwoord tien vragen. Het OS zet je bedrijf neer.</p>
        <TienVragen />
      </Tegel>
      <Tegel kop="Alles gekoppeld" breed={5} className="h-nul-koppel">
        <span className="h-pil-status">Nu in je OS</span>
        <Koppelingen />
        <p className="sn-tegel-tekst">Boekhouding in Odoo, gratis met één Odoo-app. De Studio maakt content in jouw merkstijl en Zernio plaatst die automatisch op je kanalen.</p>
      </Tegel>
      <Tegel kop="Of laat je eigen AI het doen" breed={6} className="h-nul-ai">
        <Status live={BESCHIKBAAR.ai} />
        <p className="sn-tegel-tekst">Altijd met de allerbeste AI-modellen, in een team van AI-developers.</p>
        <AiTerminal />
        <ul className="h-slot-regels">
          <li><ShieldCheck size={16} aria-hidden="true" />Je eigen AI-assistent koppel je met een beveiligde sleutel voor alleen jouw werkruimte.</li>
          <li><ShieldCheck size={16} aria-hidden="true" />Je AI ziet nooit onze code of de gegevens van anderen.</li>
          <li><ShieldCheck size={16} aria-hidden="true" />Niets verandert zonder jouw akkoord in het OS.</li>
        </ul>
      </Tegel>
      <Tegel kop="Marketing op de automatische piloot" breed={6} soort="roze" className="h-nul-marketing">
        <Status live={BESCHIKBAAR.marketing} />
        <MarketingChat />
        <p className="sn-tegel-tekst">Een eigen marketingchat plant, maakt en post. Betaalde acties gaan alleen door binnen het budget dat jij vooraf goedkeurt, via onze betaalpartner.</p>
      </Tegel>
    </Bento>
  );
}
