import React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Bento, BentoFilm, Tegel, useInBeeld } from "./Bento";
import { GRATIS_OS_URL } from "./os-entry";
import { StipScene } from "./StipScene";
import { minderBeweging } from "./stippen";
import { TextLink } from "./ui";
import "./bereikt.css";

// 29 september 2026 (Marinus): "Zet vooral wat ze hebben bereikt met mooie animaties aanwezig op mijn homepage."
// Alleen feiten met een bron:
// - Odoo Experience 2026: posttekst in /Volumes/OS/ODOO EINDVIDEO/EINDRESULTAAT/posttekst.txt ("Hundreds of sign-ups. Five
//   finalists. One winner"), finalisten en winnaar uit /Volumes/OS/oxp26-aftermovie/regie/TREE.md, logo's met bron in
//   oxp26-eindvideo/montage/assets/logos/BRON.md (dezelfde als in Deuren.tsx).
// - Klanten: 02-SOCIALNOW/07_MARKETING/07-WAT-WE-BOUWEN.md (kWh Garant en VDZ Brigade met eigen OS, Il Gordo Lighthouse
//   desktop, mediaan van drie metingen op 28 september 2026) en het verhaal (VASTIQ met Komen Consultancy).
// Geen verzonnen aantallen: "honderden" blijft een woord, de stippen zijn sfeer en geen telling. Lighthouse 100/100/93 is echt.

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

const wacht = (s: number) => new Promise((af) => setTimeout(af, s * 1000));
// Vaste toeval (zelfde beeld bij elk bezoek): mulberry32.
function toeval(zaad: number) {
  return () => { zaad = (zaad + 0x6d2b79f5) | 0; let t = Math.imul(zaad ^ (zaad >>> 15), 1 | zaad); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// Een ring van rasterstippen rond (ci, cj): de cirkel wordt op het raster gelegd, kloksgewijs vanaf boven, zonder dubbele.
function ringCellen(ci: number, cj: number, straal: number): [number, number][] {
  const uit: [number, number][] = [], gezien = new Set<string>();
  for (let n = 0; n < 360; n++) {
    const a = (n / 360) * Math.PI * 2, c: [number, number] = [Math.round(ci + Math.sin(a) * straal), Math.round(cj - Math.cos(a) * straal)];
    if (!gezien.has(c.join())) { gezien.add(c.join()); uit.push(c); }
  }
  return uit;
}

// 11 oktober 2026 (Marinus: optie D "vet", "het echte verhaal"): de markering over de logo's en de puntjes zijn weg. Het verhaal
// staat nu in stippen: het vlak vult zich met aanmeldingen (sfeer, geen telling: "honderden" blijft een woord), die dunnen in
// drie rondes uit tot vijf stippen, één per finalist, in de volgorde van de logo's eronder. De trekking uit de winnaarsfilm loopt langs die
// vijf, vertraagt en stopt bij de winnaar: die wordt groen met een kleurburst door de stippen.
function useSmal() {
  const [smal, setSmal] = React.useState(() => typeof window !== "undefined" && !!window.matchMedia?.("(max-width: 760px)").matches);
  React.useEffect(() => {
    const m = window.matchMedia?.("(max-width: 760px)"); if (!m) return;
    const zet = () => setSmal(m.matches); m.addEventListener("change", zet); return () => m.removeEventListener("change", zet);
  }, []);
  return smal;
}
// Op de telefoon het fijne raster (8 px, onderverdeling van 32), zodat er ook daar honderden stippen in het vlak passen.
function BeursStippen({ klaar }: { klaar: (aan: boolean) => void }) {
  const [fase, setFase] = React.useState(0), smal = useSmal();
  const klaarRef = React.useRef(klaar); klaarRef.current = klaar;
  return (
    <div className="h-beurs-scene">
      <StipScene className="h-beurs-stippen" stap={smal ? 8 : 16} opnieuw label="Honderden aanmeldingen dunnen uit tot vijf finalisten en één winnaar" speel={async (v) => {
        const mid = Math.floor((v.rij - 1) / 2), sleutel = (i: number, j: number) => j * 4096 + i;
        const vijf = FINALISTEN.map((_, k) => [Math.floor(v.kol * (k + .5) / FINALISTEN.length), mid] as [number, number]);
        const vast = new Set(vijf.map(([i, j]) => sleutel(i, j))), r = toeval(26);
        const rest: [number, number][] = [];
        for (let j = 0; j < v.rij; j++) for (let i = 0; i < v.kol; i++) if (!vast.has(sleutel(i, j)) && r() < .62) rest.push([i, j]);
        for (let n = rest.length - 1; n > 0; n--) { const m = Math.floor(r() * (n + 1)); [rest[n], rest[m]] = [rest[m], rest[n]]; }
        const winnaar = vijf[WINNAAR];
        setFase(0); klaarRef.current(false);
        if (minderBeweging()) {
          vijf.forEach(([i, j]) => v.zet(i, j, "wit", .35)); v.zet(winnaar[0], winnaar[1], "groen", 1);
          setFase(2); klaarRef.current(true); return;
        }
        const alle = [...rest]; vijf.forEach((c, k) => alle.splice(Math.floor(r() * alle.length * (k + 1) / 6), 0, c));
        await v.vul(alle, "wit", { a: .42, duur: 1.4 });
        await wacht(.5);
        // Uitdunnen: eerst het grootste deel, dan de meeste van wat over is, dan de laatste tientallen. Elke stip dimt kort en gaat uit.
        const rondes = [rest.slice(0, Math.round(rest.length * .6)), rest.slice(Math.round(rest.length * .6), Math.round(rest.length * .92)), rest.slice(Math.round(rest.length * .92))];
        for (const ronde of rondes) {
          const stappen = 12; let vorige: [number, number][] = [];
          for (let s = 0; s < stappen; s++) {
            const deel = ronde.slice(Math.floor(s * ronde.length / stappen), Math.floor((s + 1) * ronde.length / stappen));
            deel.forEach(([i, j]) => v.zet(i, j, "wit", .14)); vorige.forEach(([i, j]) => v.zet(i, j, "wit", 0)); vorige = deel;
            await wacht(.05);
          }
          vorige.forEach(([i, j]) => v.zet(i, j, "wit", 0));
          await wacht(.35);
        }
        setFase(1);
        vijf.forEach(([i, j]) => v.zet(i, j, "wit", .9));
        await wacht(.6);
        // De trekking: twee rondjes langs de vijf, steeds trager, stop bij de winnaar.
        const stappen = FINALISTEN.length * 2 + WINNAAR + 1;
        let vorig = -1;
        for (let s = 0; s < stappen; s++) {
          const k = s % FINALISTEN.length;
          if (vorig >= 0) v.zet(vijf[vorig][0], vijf[vorig][1], "wit", .9);
          v.zet(vijf[k][0], vijf[k][1], "groen", 1); vorig = k;
          await wacht((90 + Math.pow(s / stappen, 3) * 520) / 1000);
        }
        vijf.forEach(([i, j], k) => { if (k !== WINNAAR) v.zet(i, j, "wit", .3); });
        setFase(2); klaarRef.current(true);
        const [x, y] = v.pos(winnaar[0], winnaar[1]); await v.burst(x, y, { straal: 420, duur: 1.1 });
      }} />
      <p className="sn-stipscene-uitleg h-beurs-fase" aria-hidden="true">
        <span className={fase === 0 ? "is-aan" : ""}>Aanmeldingen</span>
        <span className={fase === 1 ? "is-aan" : ""}>Vijf finalisten</span>
        <span className={fase === 2 ? "is-aan" : ""}>Eén winnaar</span>
      </p>
    </div>
  );
}

// De vijf finalisten op een rij; na de trekking in de stippen staat de winnaar groen omrand en dimmen de anderen.
function Finalisten({ klaar }: { klaar: boolean }) {
  return (
    <div className={`h-trekking${klaar ? " is-klaar" : ""}`}>
      <ul className="h-trekking-rij" aria-label="Vijf finalisten">
        {FINALISTEN.map((finalist, index) => (
          <li key={finalist.naam} className={klaar && index === WINNAAR ? "is-winnaar" : ""}>
            <span className="h-trekking-logo">
              <img src={finalist.logo} alt={finalist.naam} width={finalist.breed} height={finalist.hoog} loading="lazy" />
            </span>
          </li>
        ))}
      </ul>
      <p className="h-trekking-uitslag">
        <span className="h-trekking-beker" aria-hidden="true"><Check size={16} /></span>
        <span>
          Winnaar: <b translate="no">KoderXpert Technologies</b>
          <small translate="no">Dhvanil Trivedi, Founder & CEO</small>
        </span>
      </p>
    </div>
  );
}

function Beurs() {
  const [klaar, setKlaar] = React.useState(false);
  return (
    <>
      <div className="h-beurs-boven">
        <div className="h-beurs-links">
          <p className="h-beurs-groot">Honderden aanmeldingen.</p>
          <p className="sn-tegel-titel">Vijf finalisten. Eén winnaar.</p>
          <BeursStippen klaar={setKlaar} />
        </div>
        {/* 5 oktober 2026 (Marinus): "Dat groene blok is een beetje nikszeggend." Geen stippen meer: twaalf seconden uit de
            aftermovie van de beurs, zonder geluid; een klik opent de hele film. 11 oktober: links ervan staan weer stippen, nu met
            het echte verhaal (zie BeursStippen). */}
        <a className="h-beurs-film" href="/video/odoo-experience/odoo-experience.mp4" target="_blank" rel="noopener" aria-label="Bekijk de aftermovie van Odoo Experience 2026">
          <BentoFilm src="/video/odoo-experience/odoo-experience-kort.mp4" poster="/video/odoo-experience/odoo-experience-kort-poster.webp" label="Odoo Experience 2026 in Brussel" geluid={false} />
          <span className="h-beurs-film-label">&#9654; Aftermovie</span>
        </a>
      </div>
      <Finalisten klaar={klaar} />
    </>
  );
}

// 11 oktober 2026: de Lighthouse-ringen als ringen van rasterstippen (8 px, een onderverdeling van het grote raster). De ring
// heeft straal 4; het deel dat groen wordt is de echte score, afgerond (bij 93 blijven de laatste stippen grijs).
function ScoreRing({ label, doel, aan }: { label: string; doel: number; aan: boolean }) {
  const waarde = useTeller(doel, aan, 1800);
  return (
    <figure className="h-score">
      <StipScene className="h-score-stippen" stap={8} speel={async (v) => {
        const ring = ringCellen(Math.floor((v.kol - 1) / 2), Math.floor((v.rij - 1) / 2), 4);
        ring.forEach(([i, j]) => v.zet(i, j, "wit", .16));
        await v.vul(ring.slice(0, Math.round(ring.length * doel / 100)), "groen", { duur: 1.6 });
      }} />
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
// 11 oktober 2026 (Marinus: "animaties zoals D vet", stippen zoals in de explainer): de verzonnen oplopende lijn is weg. Het
// echte cijfer staat nu in stippen: 1 stip = 1 lead of € 1.000. De stippen lichten rij voor rij op, de laatste geeft een
// korte kleurburst (confetti via de stippen, geen snippers).
function Resultaat({ waarde, eenheid, aantal, uitleg, labels }: { waarde: string; eenheid: string; aantal: number; uitleg: string; labels: string[] }) {
  return (
    <div className="h-resultaat">
      <p className="h-resultaat-cijfer"><b translate="no">{waarde}</b><span>{eenheid}</span></p>
      <StipScene className="h-resultaat-stippen" stap={14} opnieuw speel={async (v) => {
        const kol = Math.min(25, v.kol - 1), rij = Math.ceil(aantal / kol), j0 = Math.max(0, Math.floor((v.rij - rij) / 2));
        const cellen: [number, number][] = [];
        for (let n = 0; n < aantal; n++) cellen.push([n % kol, j0 + Math.floor(n / kol)]);
        cellen.forEach(([i, j]) => v.zet(i, j, "wit", .22));  // eerst de plekken, zoals de 500 stoelen
        await v.vul(cellen, "groen", { duur: 1.4 });
        const [x, y] = v.pos(...cellen[cellen.length - 1]); await v.burst(x, y, { straal: 260, duur: .9 });
      }} />
      <p className="sn-stipscene-uitleg">{uitleg}</p>
      <ul className="h-resultaat-labels" translate="no">{labels.map((label) => <li key={label}>{label}</li>)}</ul>
    </div>
  );
}

// Vinkje uit stippen (11 oktober 2026 mooier afgemaakt, zoals de oude vink die zichzelf tekende): op het fijne raster van 8 px
// tekent eerst een ring van stippen zich kloksgewijs, dan het vinkje in groen, daarna kleurt de ring groen mee en gaat er
// één groene golf door het vlak.
const VINK: [number, number][] = [[-3, 0], [-2, 1], [-1, 2], [0, 1], [1, 0], [2, -1], [3, -2]];
function VinkStippen() {
  return (
    <StipScene className="h-vink-stippen" stap={8} opnieuw label="Uitgenodigd" speel={async (v) => {
      const ci = 6, cj = Math.floor((v.rij - 1) / 2), ring = ringCellen(ci, cj, 5);
      await v.vul(ring, "wit", { a: .45, duur: .7 });
      await v.vul(VINK.map(([i, j]) => [ci + i, cj + j] as [number, number]), "groen", { a: 1, duur: .45 });
      await v.vul(ring, "groen", { a: .8, duur: .5 });
      const [x, y] = v.pos(ci, cj); await v.golf(x, y, "groen", { straal: 520, duur: 1.4 });
    }} />
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
        <Beurs />
      </Tegel>
      <Tegel kop="Uitgenodigd" breed={4} className="h-bereikt-sec">
        <VinkStippen />
        <p className="sn-tegel-titel">Om te presenteren bij de Student Entrepreneurs Club.</p>
        <p className="sn-tegel-tekst">Na drie dagen op de beurs in Brussel. Dank je, Michelle.</p>
      </Tegel>
      <Tegel kop="kWh Garant" breed={4} className="h-bereikt-kwh">
        <Resultaat waarde="100" eenheid="leads in één week" aantal={100} uitleg="1 stip = 1 lead" labels={["Meta ads", "Odoo CRM", "Eigen OS"]} />
        <p className="sn-tegel-titel">Eigen OS live.</p>
        <p className="sn-tegel-tekst">Meta en Odoo gekoppeld. Elke offerteaanvraag komt direct in hun OS binnen.</p>
      </Tegel>
      <Tegel kop="VDZ Brigade" breed={4} className="h-bereikt-vdz">
        {/* 5 oktober 2026 (Marinus): "Graag ook nog bij VDZ hun animatie." De overzichtsanimatie (vier brigades onder één dak)
            uit 01-KLANTEN/vdz-brigade/videos/vdz-brigades-overzicht-motion, v4, 1280 px zonder geluid. */}
        <div className="h-ilgordo-film">
          <BentoFilm src="/video/vdz/vdz-animatie.mp4" poster="/video/vdz/vdz-animatie-poster.webp" label="VDZ Brigade: vier specialisten onder één dak" geluid={false} />
        </div>
        <Resultaat waarde="€ 100.000" eenheid="omzet voor VDZ" aantal={100} uitleg="1 stip = € 1.000" labels={["Website", "Huisstijl", "Animatie", "Fotografie", "Eigen OS"]} />
        <p className="sn-tegel-titel">Van nul online zichtbaarheid naar een merk dat verkoopt.</p>
        <p className="sn-tegel-tekst">Daarvoor had VDZ alleen een deur-aan-deurteam.</p>
        {/* 30 september 2026 (Marinus): de reactie van VDZ in alle talen in het Engels. Origineel (Google-review, Nederlands):
            "Wat deze mannen neerzetten in zo’n korte tijd ongelofelijk." */}
        <p className="sn-tegel-tekst" translate="no">“What these guys delivered in such a short time is unbelievable.”</p>
      </Tegel>
      <Tegel kop="Il Gordo" breed={4} className="h-bereikt-ilgordo">
        {/* 5 oktober 2026 (Marinus): "Kan je voor Il gordo ook die video laten zien?" De headerfilm van ilgordo.nl
            (01_WEBSITE/ilgordo-nl/site/header-video.mp4, 11 s, 1280 px, 0,6 MB) boven de scores, zonder geluid. */}
        <div className="h-ilgordo-film">
          <BentoFilm src="/video/ilgordo/ilgordo-header.mp4" poster="/video/ilgordo/ilgordo-header-poster.webp" label="Il Gordo: de headerfilm van ilgordo.nl" geluid={false} />
        </div>
        <IlGordoScores />
        <p className="sn-tegel-titel">Snel, vindbaar, gebouwd door ons team.</p>
        <p className="sn-tegel-tekst">Lighthouse op desktop, mediaan van drie metingen op 28 september 2026.</p>
      </Tegel>
      {/* 5 oktober 2026 (Marinus): "en van Hajenius van het huis". Het pand aan het Rokin als wireframe dat oplicht, uit
          01-KLANTEN/hajenius/02_WERK/SocialNow.Hajenius (gevel-wireframe-reveal-header), 1280 px zonder geluid. */}
      <Tegel kop="Hajenius" breed={6} soort="foto" className="h-bereikt-hajenius">
        <BentoFilm src="/video/hajenius/hajenius-pand.mp4" poster="/video/hajenius/hajenius-pand-poster.webp" label="Hajenius: het pand aan het Rokin als wireframe" geluid={false} />
        <span className="h-foto-onderschrift">
          <b>Een eigen OS voor een Amsterdams icoon.</b>
          <span>Het pand aan het Rokin, opnieuw getekend.</span>
        </span>
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
      <Tegel kop="Jij bent de volgende" breed={12} soort="groen" className="h-bereikt-jij">
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
