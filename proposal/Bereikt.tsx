import React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Bento, BentoFilm, Tegel, useInBeeld } from "./Bento";
import { GRATIS_OS_URL } from "./os-entry";
import { TextLink } from "./ui";
import "./bereikt.css";

// 29 september 2026 (Marinus): "Zet vooral wat ze hebben bereikt met mooie animaties aanwezig op mijn homepage."
// Alleen feiten met een bron:
// - Odoo Experience 2026: posttekst in /Volumes/OS/ODOO EINDVIDEO/EINDRESULTAAT/posttekst.txt ("Hundreds of sign-ups. Five
//   finalists. One winner"), finalisten en winnaar uit /Volumes/OS/oxp26-aftermovie/regie/TREE.md, logo's met bron in
//   oxp26-eindvideo/montage/assets/logos/BRON.md (dezelfde als in Deuren.tsx).
// - Klanten: 02-SOCIALNOW/07_MARKETING/07-WAT-WE-BOUWEN.md (kWh Garant en VDZ Brigade met eigen OS, Il Gordo Lighthouse
//   desktop, mediaan van drie metingen op 28 september 2026) en het verhaal (VASTIQ met Komen Consultancy).
// Geen verzonnen aantallen: "honderden" blijft een woord, de stippen zijn sfeer en geen telling.

const FINALISTEN = [
  { naam: "KoderXpert Technologies", logo: "/images/partners/koderxpert.webp", breed: 242, hoog: 70 },
  { naam: "Envertis", logo: "/images/partners/envertis.webp", breed: 533, hoog: 80 },
  { naam: "AlphaDezine", logo: "/images/partners/alphadezine.svg", breed: 1753, hoog: 280 },
  { naam: "Jantra", logo: "/images/partners/jantra.webp", breed: 240, hoog: 240 },
  { naam: "Eusol", logo: "/images/partners/eusol.png", breed: 338, hoog: 98 },
];
const WINNAAR = 0;

function useMinderBeweging() {
  const [minder, setMinder] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const voorkeur = window.matchMedia("(prefers-reduced-motion: reduce)");
    const zet = () => setMinder(voorkeur.matches);
    zet();
    voorkeur.addEventListener("change", zet);
    return () => voorkeur.removeEventListener("change", zet);
  }, []);
  return minder;
}

// Telt van 0 naar het doel zodra de tegel in beeld is. Zonder beweging staat het doel er direct.
export function useTeller(doel: number, aan: boolean, duur = 1600) {
  const minder = useMinderBeweging();
  const [waarde, setWaarde] = React.useState(0);
  React.useEffect(() => {
    if (!aan) return;
    if (minder) { setWaarde(doel); return; }
    let frame = 0;
    const start = performance.now();
    const stap = (nu: number) => {
      const t = Math.min(1, (nu - start) / duur);
      setWaarde(Math.round(doel * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(stap);
    };
    frame = requestAnimationFrame(stap);
    return () => cancelAnimationFrame(frame);
  }, [aan, doel, duur, minder]);
  return waarde;
}

// De trekking uit de winnaarsfilm: de markering loopt langs de vijf finalisten, vertraagt en stopt bij de winnaar.
function Trekking() {
  const { ref, aan } = useInBeeld<HTMLDivElement>();
  const minder = useMinderBeweging();
  const [plek, setPlek] = React.useState(-1);
  const [klaar, setKlaar] = React.useState(false);
  React.useEffect(() => {
    if (!aan) return;
    if (minder) { setPlek(WINNAAR); setKlaar(true); return; }
    const stappen = FINALISTEN.length * 2 + WINNAAR + 1;
    const timers: number[] = [];
    let tijd = 300;
    for (let i = 0; i < stappen; i++) {
      tijd += 90 + Math.pow(i / stappen, 3) * 520;
      timers.push(window.setTimeout(() => setPlek(i % FINALISTEN.length), tijd));
    }
    timers.push(window.setTimeout(() => setKlaar(true), tijd + 420));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [aan, minder]);
  return (
    <div ref={ref} className={`h-trekking${klaar ? " is-klaar" : ""}`}>
      <ul className="h-trekking-rij" aria-label="Vijf finalisten">
        {FINALISTEN.map((finalist, index) => (
          <li key={finalist.naam} className={`${index === plek ? "is-aan" : ""}${klaar && index === WINNAAR ? " is-winnaar" : ""}`}>
            <span className="h-trekking-logo">
              <img src={finalist.logo} alt={finalist.naam} width={finalist.breed} height={finalist.hoog} loading="lazy" />
            </span>
          </li>
        ))}
      </ul>
      <p className="h-trekking-uitslag" aria-live="polite">
        <span className="h-trekking-beker" aria-hidden="true"><Check size={16} /></span>
        {klaar ? (
          <span>
            Winnaar: <b translate="no">KoderXpert Technologies</b>
            <small translate="no">Dhvanil Trivedi, Founder & CEO</small>
          </span>
        ) : (
          <span className="h-trekking-bezig">De trekking loopt</span>
        )}
      </p>
    </div>
  );
}

// Honderden stippen die oplichten: sfeer bij "honderden aanmeldingen", geen telling.
function Aanmeldingen() {
  const stippen = React.useMemo(() => Array.from({ length: 180 }, (_, i) => ((i * 37) % 180) / 180), []);
  return (
    <div className="h-aanmeld-stippen" aria-hidden="true">
      {stippen.map((vertraging, i) => (
        <i key={i} style={{ "--d": `${(vertraging * 2.4).toFixed(2)}s` } as React.CSSProperties} />
      ))}
    </div>
  );
}

function ScoreRing({ label, doel, aan }: { label: string; doel: number; aan: boolean }) {
  const waarde = useTeller(doel, aan, 1800);
  return (
    <figure className="h-score">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle className="h-score-baan" cx="32" cy="32" r="27" />
        <circle className="h-score-voortgang" cx="32" cy="32" r="27" pathLength="100" style={{ strokeDashoffset: 100 - waarde }} />
      </svg>
      <b>{waarde}</b>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function IlGordoScores() {
  const { ref, aan } = useInBeeld<HTMLDivElement>();
  return (
    <div ref={ref} className="h-scores">
      <ScoreRing label="SEO" doel={100} aan={aan} />
      <ScoreRing label="Best practices" doel={100} aan={aan} />
      <ScoreRing label="Prestaties" doel={93} aan={aan} />
    </div>
  );
}

// 5 oktober 2026 (Marinus): "Deze vind ik nog heel lelijk", "Ik wil graag iets meer tech en minder schreeuwerig" en de
// resultaten: "Ik verdiende 100.000 euro's voor VDZ met complete animatie vanuit 0 online zichtbaarheid en foto's, alleen
// een door to door team. Zelfde voor kWh 100 leads in 1 week." Een resultaattegel: één cijfer in mono, een rustige lijn
// die oploopt (tekent zich bij binnenkomst) en wat we bouwden als kleine labels. Vervangt de stroom en de browser.
function lijnPad(punten: number[], vlak: boolean) {
  const stap = 200 / (punten.length - 1);
  const xy = punten.map((p, i) => `${(i * stap).toFixed(1)} ${(46 - p * 42).toFixed(1)}`);
  const lijn = `M${xy.join(" L")}`;
  return vlak ? `${lijn} L200 48 L0 48 Z` : lijn;
}
function Resultaat({ waarde, eenheid, punten, labels }: { waarde: string; eenheid: string; punten: number[]; labels: string[] }) {
  const { ref, aan } = useInBeeld<HTMLDivElement>();
  return (
    <div ref={ref} className={`h-resultaat${aan ? " is-aan" : ""}`}>
      <p className="h-resultaat-cijfer"><b translate="no">{waarde}</b><span>{eenheid}</span></p>
      <svg className="h-resultaat-lijn" viewBox="0 0 200 48" preserveAspectRatio="none" aria-hidden="true">
        <path className="is-vlak" d={lijnPad(punten, true)} />
        <path className="is-lijn" d={lijnPad(punten, false)} pathLength="1" />
      </svg>
      <ul className="h-resultaat-labels" translate="no">{labels.map((label) => <li key={label}>{label}</li>)}</ul>
    </div>
  );
}

export default function Bereikt() {
  return (
    <Bento
      id="bereikt"
      className="h-bereikt"
      label="Wat we bereikten"
      titel={<>Van Brussel<br /><span>tot bedrijven die draaien.</span></>}
    >
      <Tegel kop="Odoo Experience 2026 · Brussel" breed={8} soort="groen" className="h-bereikt-beurs">
        <div className="h-beurs-boven">
          <div>
            <p className="h-beurs-groot">Honderden aanmeldingen.</p>
            <p className="sn-tegel-titel">Vijf finalisten. Eén winnaar.</p>
          </div>
          <Aanmeldingen />
        </div>
        <Trekking />
      </Tegel>
      <Tegel kop="Uitgenodigd" breed={4} className="h-bereikt-sec">
        <svg className="h-vink-groot" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" pathLength="1" />
          <path d="M15 27 L23 35 L38 18" pathLength="1" />
        </svg>
        <p className="sn-tegel-titel">Om te presenteren bij de Student Entrepreneurs Club.</p>
        <p className="sn-tegel-tekst">Na drie dagen op de beurs in Brussel. Dank je, Michelle.</p>
      </Tegel>
      <Tegel kop="kWh Garant" breed={4} className="h-bereikt-kwh">
        <Resultaat waarde="100" eenheid="leads in één week" punten={[0.02, 0.06, 0.12, 0.2, 0.34, 0.5, 0.66, 0.82, 1]} labels={["Meta ads", "Odoo CRM", "Eigen OS"]} />
        <p className="sn-tegel-titel">Eigen OS live.</p>
        <p className="sn-tegel-tekst">Meta en Odoo gekoppeld. Elke offerteaanvraag komt direct in hun OS binnen.</p>
      </Tegel>
      <Tegel kop="VDZ Brigade" breed={4} className="h-bereikt-vdz">
        <Resultaat waarde="€ 100.000" eenheid="omzet voor VDZ" punten={[0, 0.01, 0.03, 0.08, 0.16, 0.3, 0.48, 0.7, 1]} labels={["Website", "Huisstijl", "Animatie", "Fotografie", "Eigen OS"]} />
        <p className="sn-tegel-titel">Van nul online zichtbaarheid naar een merk dat verkoopt.</p>
        <p className="sn-tegel-tekst">Daarvoor had VDZ alleen een deur-aan-deurteam.</p>
        {/* 30 september 2026 (Marinus): de reactie van VDZ in alle talen in het Engels. Origineel (Google-review, Nederlands):
            "Wat deze mannen neerzetten in zo’n korte tijd ongelofelijk." */}
        <p className="sn-tegel-tekst" translate="no">“What these guys delivered in such a short time is unbelievable.”</p>
      </Tegel>
      <Tegel kop="Il Gordo" breed={4} className="h-bereikt-ilgordo">
        <IlGordoScores />
        <p className="sn-tegel-titel">Snel, vindbaar, gebouwd door ons team.</p>
        <p className="sn-tegel-tekst">Lighthouse op desktop, mediaan van drie metingen op 28 september 2026.</p>
      </Tegel>
      <Tegel kop="VASTIQ" breed={6} soort="foto" className="h-bereikt-vastiq">
        {/* 30 september 2026 (Marinus): "bij VASTIQ wil ik graag de animatievideo zien", de headerfilm van vastiq.ai opnieuw
            gemaakt: begin- en eindbeeld met GPT Image 2.5, beweging met Cinema Studio Video 3.0 (Higgsfield). Bron en beelden in
            01-KLANTEN/vastiq/04_CONTENT/VIDEO/vastiq-zoom-v2*. */}
        {/* 30 september 2026 (Marinus): "Verkeerde afbeelding", "Ik wilde die uitzoom video". Dezelfde film omgekeerd: van het
            grachtenpand met zijn waarde naar de wolken boven Amsterdam. 1280 px, 2,0 MB (was 7,5 MB). */}
        <BentoFilm src="/video/vastiq/vastiq-uitzoom.mp4" poster="/video/vastiq/vastiq-uitzoom-poster.webp" label="VASTIQ: van één grachtenpand met zijn waarde uitzoomen naar heel Amsterdam" geluid={false} />
        <span className="h-foto-onderschrift">
          <b>Platform en merk uit één hand.</b>
          <span>Samen met Komen Consultancy gebouwd.</span>
        </span>
      </Tegel>
      <Tegel kop="Jij bent de volgende" breed={6} soort="groen" className="h-bereikt-jij">
        <p className="sn-tegel-titel">Wat zij bereikten, begint voor jou met tien vragen.</p>
        <p className="sn-tegel-tekst">Start een nieuw bedrijf of koppel je bestaande. Gratis te gebruiken, met ons team erachter.</p>
        <div className="sn-tegel-onder">
          <a className="os-claim sn-btn3d h-button" href={GRATIS_OS_URL}>
            <span className="sn-btn3d-sheen" />
            <span>Begin gratis</span>
            <span className="h-button-icon"><ArrowUpRight size={16} aria-hidden="true" /></span>
          </a>
          <TextLink to="/projecten">Bekijk al ons werk</TextLink>
        </div>
      </Tegel>
    </Bento>
  );
}
