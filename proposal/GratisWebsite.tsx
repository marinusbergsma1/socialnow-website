import React, { useEffect, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { aanvraagLink, WHATSAPP_NUMMER } from "./aanvragen";
import OnboardingBeeld, { gekozenKanaal, useVersie, Verzendkeuze } from "./OnboardingBeeld";
import "./gratis-website.css";

const OPSLAG = "sn-gratis-website-v1";
const WHATSAPP = `https://wa.me/${WHATSAPP_NUMMER}`;
type Gegevens = { voornaam: string; achternaam: string; bedrijf: string; email: string; mobiel: string };
type Vraag = { key: string; vraag: string; hint: string; type?: "text" };
const LEEG: Gegevens = { voornaam: "", achternaam: "", bedrijf: "", email: "", mobiel: "" };
const VRAGEN: Vraag[] = [
  { key: "website", vraag: "Huidige website", hint: "Plak de link. Leeg laten als je nog geen site hebt.", type: "text" },
  { key: "voorbeeld", vraag: "Een website die je mega mooi vindt", hint: "Plak de link. Mag uit elke branche komen.", type: "text" },
  { key: "wat", vraag: "Wat doet je bedrijf, in één zin?", hint: "Bijvoorbeeld: wij installeren zonnepanelen voor bedrijven in de regio Utrecht." },
  { key: "nietgoed", vraag: "Wat zou je graag anders willen aan je website?", hint: "Vertel wat je mist of wat beter bij jouw bedrijf mag passen." },
];
function laad(): { a: Record<string, string>; g: Gegevens } {
  try { const j = JSON.parse(localStorage.getItem(OPSLAG) || "null"); if (j?.a && j?.g && "voornaam" in j.g) return j; } catch {}
  return { a: {}, g: LEEG };
}

export default function GratisWebsite() {
  const { language, t } = useLanguage();
  const versie = useVersie();
  const [a, setA] = useState<Record<string, string>>({});
  const [g, setG] = useState<Gegevens>(LEEG);
  const [geladen, setGeladen] = useState(false);
  const [fout, setFout] = useState("");
  useEffect(() => { const x = laad(); setA(x.a); setG(x.g); setGeladen(true); }, []);
  useEffect(() => { if (geladen) try { localStorage.setItem(OPSLAG, JSON.stringify({ a, g })); } catch {} }, [a, g, geladen]);
  const zet = (k: string, v: string) => setA((x) => ({ ...x, [k]: v }));
  const gevuld = VRAGEN.filter((v) => (a[v.key] || "").trim()).length + Object.values(g).filter((x) => x.trim()).length;
  const procent = Math.round((gevuld / (VRAGEN.length + 5)) * 100);
  const verstuur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!g.voornaam.trim() || !g.achternaam.trim()) { setFout(t("Vul je voor- en achternaam in.")); return; }
    if (!g.bedrijf.trim()) { setFout(t("Vul je bedrijfsnaam in.")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim())) { setFout(t("Dat e-mailadres klopt nog niet.")); return; }
    setFout("");
    window.location.href = aanvraagLink(gekozenKanaal(e), "website", language, { ...g, website: a.website, voorbeeld: a.voorbeeld, wat: a.wat, nietgoed: a.nietgoed });
  };
  const veld = (v: Vraag) => (
    <label className="gw-fld" key={v.key} htmlFor={`gw-${v.key}`}>
      <span className="gw-l">{t(v.vraag)}</span><span className="gw-h">{t(v.hint)}</span>
      {v.type === "text" ? <input id={`gw-${v.key}`} value={a[v.key] || ""} maxLength={200} inputMode="url" autoCapitalize="none" autoCorrect="off" onChange={(e) => zet(v.key, e.target.value)} />
        : <textarea id={`gw-${v.key}`} rows={3} value={a[v.key] || ""} maxLength={1500} onChange={(e) => zet(v.key, e.target.value)} />}
    </label>
  );
  const kop = <>
    <p className="gw-eyebrow"><i className="gw-stipjes"><b /><b /><b /></i>Gratis website / Odoo Experience, stand C21</p>
    <h1>Wij maken jouw website <span className="gw-accent">live op de Odoo-beurs.</span></h1>
    <p className="gw-lead">Vertel ons over je bedrijf en wat je mooi vindt. Wij lezen je antwoorden zelf en maken een website die echt bij je past, samen met jou op stand C21.</p>
    <ul className="gw-beloftes"><li><Check size={15} /> Persoonlijk gemaakt voor jouw bedrijf</li><li><Check size={15} /> Direct contact met Marinus</li><li><Check size={15} /> Live gebouwd op de Odoo-beurs</li></ul>
    <a className="gw-contactpil" href={`${WHATSAPP}?text=${encodeURIComponent(t("Hoi Marinus, ik heb een vraag over de websites die jullie live maken op de Odoo-beurs."))}`} target="_blank" rel="noopener noreferrer">
      <img className="gw-contact-avatar" src="/images/marinus-profiel-blauw.webp" alt="" width="48" height="48" /><span className="gw-contact-tekst"><strong>Marinus Bergsma</strong><small>Vragen? Neem persoonlijk contact op</small></span><MessageCircle size={19} aria-hidden="true" />
    </a>
  </>;
  return <OnboardingBeeld versie={versie} soort="website" kop={kop}>
    <div className="gw-progress" aria-label={t("Voortgang")}><div className="gw-bar"><div className="gw-fill" style={{ width: `${procent}%` }} /></div><div className="gw-meta"><span><i className="gw-dot" />Automatisch bewaard</span><span>{procent}%</span></div></div>
    <form onSubmit={verstuur} noValidate>
      <section className="gw-sec"><div className="gw-sec-head"><span className="gw-num">01</span><h2>Jij</h2></div><div className="gw-card">
        <div className="gw-rij"><label className="gw-fld" htmlFor="gw-voornaam"><span className="gw-l">Voornaam *</span><input id="gw-voornaam" autoComplete="given-name" maxLength={40} required value={g.voornaam} onChange={(e) => setG({ ...g, voornaam: e.target.value })} /></label><label className="gw-fld" htmlFor="gw-achternaam"><span className="gw-l">Achternaam *</span><input id="gw-achternaam" autoComplete="family-name" maxLength={40} required value={g.achternaam} onChange={(e) => setG({ ...g, achternaam: e.target.value })} /></label></div>
        <div className="gw-rij"><label className="gw-fld" htmlFor="gw-email"><span className="gw-l">E-mailadres *</span><input id="gw-email" type="email" autoComplete="email" inputMode="email" maxLength={254} required value={g.email} onChange={(e) => setG({ ...g, email: e.target.value })} /></label><label className="gw-fld" htmlFor="gw-mobiel"><span className="gw-l">Telefoonnummer</span><input id="gw-mobiel" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={g.mobiel} onChange={(e) => setG({ ...g, mobiel: e.target.value })} /></label></div>
        <label className="gw-fld" htmlFor="gw-bedrijf"><span className="gw-l">Bedrijfsnaam *</span><input id="gw-bedrijf" autoComplete="organization" maxLength={120} required value={g.bedrijf} onChange={(e) => setG({ ...g, bedrijf: e.target.value })} /></label>
      </div></section>
      <section className="gw-sec"><div className="gw-sec-head"><span className="gw-num">02</span><h2>Jouw website</h2></div><div className="gw-card"><div className="gw-rij">{VRAGEN.slice(0, 2).map(veld)}</div>{VRAGEN.slice(2).map(veld)}</div>
        <p className="gw-juridisch">Je antwoorden staan meteen in het bericht. Verstuur het per e-mail of via WhatsApp, wat jij prettig vindt. Lees ons <a href={`${languagePrefix(language)}/privacy/`}>privacybeleid</a>.</p>
        {fout ? <p className="gw-fout" role="alert">{fout}</p> : null}
        <Verzendkeuze tekst="Verstuur mijn aanvraag" />
      </section>
    </form>
  </OnboardingBeeld>;
}
