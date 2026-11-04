import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { aanvraagWhatsApp, heeftWhatsApp, whatsappLink } from "./aanvragen";
import "./gratis-website-wit.css";

// 28 september 2026: de beurs is voorbij. De gratis demowebsite blijft (zie /prijzen), zonder stand C21 en live bouwen.
// 4 november 2026 (Marinus): "onboarding graag op een witte pagina met mooiere voorbeelden en leuker om in te vullen." Dus wit
// (wit = mens), één vraag per stap, echte voorbeelden van ons werk om uit te kiezen en klikbare antwoorden in plaats van lege
// vakken. Voorbeelden staan alleen als grijze hint in een veld, nooit als ingevulde data. Liever praten: Steef, direct (mensroute).
// De aanvraag gaat zoals altijd als ingevuld bericht naar Steef (aanvragen.ts).

const OPSLAG = "sn-gratis-website-v2";
const STIJLEN = [
  { id: "vastiq", naam: "VASTIQ", wat: "Strak en zakelijk", beeld: "/images/cases/vastiq-desktop.webp" },
  { id: "kwh", naam: "kWh Garant", wat: "Licht en helder", beeld: "/images/cases/kwhgarant-desktop.webp" },
  { id: "vdz", naam: "VDZ Brigade", wat: "Stoer en vakkundig", beeld: "/images/cases/vdz-brigade-desktop.webp" },
  { id: "ilgordo", naam: "Il Gordo", wat: "Warm en sfeervol", beeld: "/images/cases/ilgordo-desktop.webp" },
];
const DOELEN = ["Meer aanvragen", "Professioneler uitstralen", "Beter vindbaar in Google", "Online verkopen", "Afspraken laten maken", "Vacatures vullen"];

type Antwoorden = { wat: string; stijlen: string[]; link: string; doelen: string[]; anders: string; website: string; voornaam: string; achternaam: string; bedrijf: string; email: string; mobiel: string };
const LEEG: Antwoorden = { wat: "", stijlen: [], link: "", doelen: [], anders: "", website: "", voornaam: "", achternaam: "", bedrijf: "", email: "", mobiel: "" };
function laad(): Antwoorden {
  try { const j = JSON.parse(localStorage.getItem(OPSLAG) || "null"); if (j && typeof j === "object" && Array.isArray(j.stijlen)) return { ...LEEG, ...j }; } catch {}
  return LEEG;
}

export default function GratisWebsite() {
  const { language, t } = useLanguage();
  const [a, zetA] = useState<Antwoorden>(LEEG);
  const [stap, zetStap] = useState(0);
  const [geladen, zetGeladen] = useState(false);
  const [fout, zetFout] = useState("");
  useEffect(() => { zetA(laad()); zetGeladen(true); }, []);
  useEffect(() => { if (geladen) try { localStorage.setItem(OPSLAG, JSON.stringify(a)); } catch {} }, [a, geladen]);
  const zet = <K extends keyof Antwoorden>(k: K, v: Antwoorden[K]) => zetA((x) => ({ ...x, [k]: v }));
  const wissel = (k: "stijlen" | "doelen", v: string) => zet(k, a[k].includes(v) ? a[k].filter((x) => x !== v) : [...a[k], v]);

  const STAPPEN = ["Wat doet je bedrijf?", "Welke stijl spreekt je aan?", "Wat moet je website vooral doen?", "Heb je al een website?", "Hoe bereiken we je?"];
  const laatste = STAPPEN.length - 1;
  const controle = () => {
    if (stap === 0 && !a.wat.trim()) return t("Vertel in één zin wat je bedrijf doet.");
    if (stap === laatste) {
      if (!a.voornaam.trim() || !a.achternaam.trim()) return t("Vul je voor- en achternaam in.");
      if (!a.bedrijf.trim()) return t("Vul je bedrijfsnaam in.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email.trim())) return t("Dat e-mailadres klopt nog niet.");
    }
    return "";
  };
  const verder = (e: React.FormEvent) => {
    e.preventDefault();
    const melding = controle();
    zetFout(melding);
    if (melding) return;
    if (stap < laatste) { zetStap(stap + 1); return; }
    const voorbeeld = [...a.stijlen.map((id) => STIJLEN.find((s) => s.id === id)?.naam || id), a.link.trim()].filter(Boolean).join(", ");
    const nietgoed = [...a.doelen.map((d) => t(d)), a.anders.trim()].filter(Boolean).join(". ");
    window.location.href = aanvraagWhatsApp("website", language, { voornaam: a.voornaam, achternaam: a.achternaam, bedrijf: a.bedrijf, email: a.email, mobiel: a.mobiel, website: a.website, voorbeeld, wat: a.wat, nietgoed });
  };

  return <div className="gw2"><div className="gw2-vel">
    <p className="gw2-label"><i />Website-actie</p>
    <h1>Wij maken jouw website, gratis<span className="gw2-punt">.</span></h1>
    <p className="gw2-intro">Vijf korte vragen. Wij lezen je antwoorden zelf en maken een demo die echt bij je past. Gratis en zonder verplichting.</p>
    <a className="gw2-steef" href={whatsappLink(t("Hoi Steef, ik heb een vraag over de gratis website."))} target="_blank" rel="noopener noreferrer">
      <img src="/images/Steef-Komen.webp" alt="" width="40" height="40" /><span><strong translate="no">Steef Komen</strong><small>Liever even praten? Stuur Steef een bericht.</small></span><ArrowUpRight size={16} aria-hidden="true" />
    </a>

    <div className="gw2-voortgang" aria-hidden="true">{STAPPEN.map((_, i) => <span key={i} className={i <= stap ? "aan" : ""} />)}</div>

    <form className="gw2-kaart" onSubmit={verder} noValidate>
      <p className="gw2-stap">Vraag {stap + 1} van {STAPPEN.length}</p>
      <h2>{STAPPEN[stap]}</h2>

      {stap === 0 && <label className="gw2-veld"><span className="gw2-verborgen">{STAPPEN[0]}</span>
        <textarea rows={3} maxLength={600} value={a.wat} onChange={(e) => zet("wat", e.target.value)} placeholder="Bijvoorbeeld: wij installeren zonnepanelen voor bedrijven in de regio Utrecht." />
      </label>}

      {stap === 1 && <>
        <p className="gw2-uitleg">Kies er gerust meer. Dit is werk dat we eerder maakten.</p>
        <div className="gw2-stijlen">{STIJLEN.map((s) => <label key={s.id} className={`gw2-stijl${a.stijlen.includes(s.id) ? " aan" : ""}`}>
          <input type="checkbox" checked={a.stijlen.includes(s.id)} onChange={() => wissel("stijlen", s.id)} />
          <span className="gw2-stijl-beeld"><img src={s.beeld} alt="" loading="lazy" /><i aria-hidden="true"><Check size={16} /></i></span>
          <strong translate="no">{s.naam}</strong><span>{s.wat}</span>
        </label>)}</div>
        <label className="gw2-veld"><span>Of plak een website die je mooi vindt <em>(optioneel)</em></span>
          <input value={a.link} maxLength={200} inputMode="url" autoCapitalize="none" autoCorrect="off" onChange={(e) => zet("link", e.target.value)} placeholder="https://" />
        </label>
      </>}

      {stap === 2 && <>
        <div className="gw2-chips">{DOELEN.map((d) => <label key={d} className={`gw2-chip${a.doelen.includes(d) ? " aan" : ""}`}>
          <input type="checkbox" checked={a.doelen.includes(d)} onChange={() => wissel("doelen", d)} /><Check size={14} aria-hidden="true" /><span>{d}</span>
        </label>)}</div>
        <label className="gw2-veld"><span>Nog iets wat je mist? <em>(optioneel)</em></span>
          <textarea rows={2} maxLength={800} value={a.anders} onChange={(e) => zet("anders", e.target.value)} placeholder="Bijvoorbeeld: klanten moeten makkelijk een offerte kunnen aanvragen." />
        </label>
      </>}

      {stap === 3 && <label className="gw2-veld"><span>Link naar je huidige website <em>(optioneel)</em></span>
        <input value={a.website} maxLength={200} inputMode="url" autoCapitalize="none" autoCorrect="off" onChange={(e) => zet("website", e.target.value)} placeholder="https://" />
        <small>Nog geen website? Laat dit leeg, dan beginnen we vanaf nul.</small>
      </label>}

      {stap === 4 && <>
        <div className="gw2-rij">
          <label className="gw2-veld"><span>Voornaam</span><input autoComplete="given-name" maxLength={40} value={a.voornaam} onChange={(e) => zet("voornaam", e.target.value)} /></label>
          <label className="gw2-veld"><span>Achternaam</span><input autoComplete="family-name" maxLength={40} value={a.achternaam} onChange={(e) => zet("achternaam", e.target.value)} /></label>
        </div>
        <label className="gw2-veld"><span>Bedrijfsnaam</span><input autoComplete="organization" maxLength={120} value={a.bedrijf} onChange={(e) => zet("bedrijf", e.target.value)} /></label>
        <div className="gw2-rij">
          <label className="gw2-veld"><span>E-mailadres</span><input type="email" autoComplete="email" inputMode="email" maxLength={254} value={a.email} onChange={(e) => zet("email", e.target.value)} /></label>
          <label className="gw2-veld"><span>Telefoonnummer <em>(optioneel)</em></span><input type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={a.mobiel} onChange={(e) => zet("mobiel", e.target.value)} /></label>
        </div>
        <p className="gw2-klein">{heeftWhatsApp ? "Je aanvraag opent WhatsApp met al je antwoorden. Verstuur het bericht daar zelf naar Steef." : "Je aanvraag opent je e-mailapp met al je antwoorden. Verstuur de mail daar zelf naar Steef."} Lees ons <a href={`${languagePrefix(language)}/privacy/`}>privacybeleid</a>.</p>
      </>}

      {fout && <p className="gw2-fout" role="alert">{fout}</p>}
      <div className="gw2-knoppen">
        {stap > 0 && <button type="button" className="gw2-terug" onClick={() => { zetFout(""); zetStap(stap - 1); }}><ArrowLeft size={16} aria-hidden="true" /><span>Terug</span></button>}
        <button type="submit" className="gw2-verder"><span>{stap < laatste ? "Volgende" : heeftWhatsApp ? "Stuur mijn aanvraag via WhatsApp" : "Stuur mijn aanvraag per e-mail"}</span><ArrowUpRight size={17} aria-hidden="true" /></button>
      </div>
      <p className="gw2-bewaard"><i />Automatisch bewaard</p>
    </form>
  </div></div>;
}
