import React, { useEffect, useState } from "react";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { aanvraagWhatsApp, WHATSAPP_NUMMER } from "./aanvragen";
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
// De velden van "Jij" in de volgorde waarin ze op het scherm staan; elk krijgt een segment in de voortgangsbalk.
const JIJ: (keyof Gegevens)[] = ["voornaam", "achternaam", "email", "mobiel", "bedrijf"];
const TOTAAL = JIJ.length + VRAGEN.length;
function laad(): { a: Record<string, string>; g: Gegevens } {
  try { const j = JSON.parse(localStorage.getItem(OPSLAG) || "null"); if (j?.a && j?.g && "voornaam" in j.g) return j; } catch {}
  return { a: {}, g: LEEG };
}

export default function GratisWebsite() {
  const { language, t } = useLanguage();
  const [a, setA] = useState<Record<string, string>>({});
  const [g, setG] = useState<Gegevens>(LEEG);
  const [geladen, setGeladen] = useState(false);
  const [fout, setFout] = useState("");
  // Telt geslaagde bewaarmomenten. Nul zolang er niets echt in de browser staat, zodat "Automatisch bewaard"
  // nooit iets belooft dat niet gebeurd is (privévenster, geblokkeerde opslag).
  const [bewaard, setBewaard] = useState(0);
  // Hoogte van de plakkende header; de balk plakt er net onder in plaats van erachter te verdwijnen.
  const [kop, setKop] = useState(0);
  useEffect(() => { const x = laad(); setA(x.a); setG(x.g); setGeladen(true); }, []);
  useEffect(() => {
    if (!geladen) return;
    try { localStorage.setItem(OPSLAG, JSON.stringify({ a, g })); setBewaard((n) => n + 1); } catch { setBewaard(0); }
  }, [a, g, geladen]);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".h-header");
    if (!header) return;
    const meet = () => setKop(Math.round(header.getBoundingClientRect().height + (parseFloat(getComputedStyle(header).top) || 0)));
    meet();
    const ro = new ResizeObserver(meet);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);
  const zet = (k: string, v: string) => setA((x) => ({ ...x, [k]: v }));
  const segmenten = [...JIJ.map((k) => !!g[k].trim()), ...VRAGEN.map((v) => !!(a[v.key] || "").trim())];
  const gevuld = segmenten.filter(Boolean).length;
  const volgende = segmenten.indexOf(false);
  const naam = !!(g.voornaam.trim() && g.achternaam.trim());
  const bedrijf = !!g.bedrijf.trim();
  const verzendklaar = naam && bedrijf;
  // Zegt alleen wat echt nog ontbreekt om te kunnen versturen; zonder invoer een uitnodiging in plaats van "0%".
  const status = gevuld === TOTAAL ? "Alles ingevuld. Verstuur je aanvraag via WhatsApp."
    : verzendklaar ? "Klaar om te versturen. Elk extra antwoord maakt je website beter."
    : !gevuld ? "Een paar korte vragen, ongeveer twee minuten."
    : naam ? "Nog je bedrijfsnaam, dan kun je versturen."
    : bedrijf ? "Nog je voor- en achternaam, dan kun je versturen."
    : "Vul je naam en bedrijf in, dan kun je versturen.";
  const segment = (aan: boolean, i: number) => <i key={i} className={aan ? "is-aan" : i === volgende ? "is-volgende" : undefined} />;
  const verstuur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!g.voornaam.trim() || !g.achternaam.trim()) { setFout(t("Vul je voor- en achternaam in.")); return; }
    if (!g.bedrijf.trim()) { setFout(t("Vul je bedrijfsnaam in.")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim())) { setFout(t("Dat e-mailadres klopt nog niet.")); return; }
    setFout("");
    window.location.href = aanvraagWhatsApp("website", language, { ...g, website: a.website, voorbeeld: a.voorbeeld, wat: a.wat, nietgoed: a.nietgoed });
  };
  const veld = (v: Vraag) => (
    <label className="gw-fld" key={v.key} htmlFor={`gw-${v.key}`}>
      <span className="gw-l">{t(v.vraag)}</span><span className="gw-h">{t(v.hint)}</span>
      {v.type === "text" ? <input id={`gw-${v.key}`} value={a[v.key] || ""} maxLength={200} inputMode="url" autoCapitalize="none" autoCorrect="off" onChange={(e) => zet(v.key, e.target.value)} />
        : <textarea id={`gw-${v.key}`} rows={3} value={a[v.key] || ""} maxLength={1500} onChange={(e) => zet(v.key, e.target.value)} />}
    </label>
  );
  return <div className="gw"><div className="gw-sheet">
    <p className="gw-eyebrow"><i className="gw-stipjes"><b /><b /><b /></i>Gratis website / Odoo Experience, stand C21</p>
    <h1>Wij maken jouw website <span className="gw-accent">live op de Odoo-beurs.</span></h1>
    <p className="gw-lead">Vertel ons over je bedrijf en wat je mooi vindt. Wij lezen je antwoorden zelf en maken een website die echt bij je past, samen met jou op stand C21.</p>
    <ul className="gw-beloftes"><li><Check size={15} /> Persoonlijk gemaakt voor jouw bedrijf</li><li><Check size={15} /> Direct contact met Marinus</li><li><Check size={15} /> Live gebouwd op de Odoo-beurs</li></ul>
    <a className="gw-contactpil" href={`${WHATSAPP}?text=${encodeURIComponent(t("Hoi Marinus, ik heb een vraag over de websites die jullie live maken op de Odoo-beurs."))}`} target="_blank" rel="noopener noreferrer">
      <img className="gw-contact-avatar" src="/images/marinus-profiel-blauw.webp" alt="" width="48" height="48" /><span className="gw-contact-tekst"><strong>Marinus Bergsma</strong><small>Vragen? Neem persoonlijk contact op</small></span><MessageCircle size={19} aria-hidden="true" />
    </a>
    <div className={`gw-voortgang${verzendklaar ? " is-klaar" : ""}${gevuld === TOTAAL ? " is-compleet" : ""}`} style={{ "--gw-kop": `${kop}px` } as React.CSSProperties}>
      <span className="gw-vg-tel">{gevuld === TOTAAL ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : null}<b>{gevuld}</b>/{TOTAAL}</span>
      <span className="gw-vg-tekst" aria-live="polite">{status}</span>
      {bewaard > 0 && gevuld > 0 ? <span className="gw-vg-bewaard"><i className="gw-dot" key={bewaard} />Automatisch bewaard</span> : null}
      <div className="gw-vg-balk" role="progressbar" aria-label="Voortgang" aria-valuemin={0} aria-valuemax={TOTAAL} aria-valuenow={gevuld} aria-valuetext={`${gevuld} / ${TOTAAL}`}>
        <span className="gw-vg-groep" style={{ flex: JIJ.length }}>{segmenten.slice(0, JIJ.length).map(segment)}</span>
        <span className="gw-vg-groep" style={{ flex: VRAGEN.length }}>{segmenten.slice(JIJ.length).map((aan, i) => segment(aan, i + JIJ.length))}</span>
      </div>
    </div>
    <form onSubmit={verstuur} noValidate>
      <section className="gw-sec"><div className="gw-sec-head"><span className="gw-num">01</span><h2>Jij</h2></div><div className="gw-card">
        <div className="gw-rij"><label className="gw-fld" htmlFor="gw-voornaam"><span className="gw-l">Voornaam *</span><input id="gw-voornaam" autoComplete="given-name" maxLength={40} required value={g.voornaam} onChange={(e) => setG({ ...g, voornaam: e.target.value })} /></label><label className="gw-fld" htmlFor="gw-achternaam"><span className="gw-l">Achternaam *</span><input id="gw-achternaam" autoComplete="family-name" maxLength={40} required value={g.achternaam} onChange={(e) => setG({ ...g, achternaam: e.target.value })} /></label></div>
        <div className="gw-rij"><label className="gw-fld" htmlFor="gw-email"><span className="gw-l">E-mailadres *</span><input id="gw-email" type="email" autoComplete="email" inputMode="email" maxLength={254} required value={g.email} onChange={(e) => setG({ ...g, email: e.target.value })} /></label><label className="gw-fld" htmlFor="gw-mobiel"><span className="gw-l">Telefoonnummer</span><input id="gw-mobiel" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={g.mobiel} onChange={(e) => setG({ ...g, mobiel: e.target.value })} /></label></div>
        <label className="gw-fld" htmlFor="gw-bedrijf"><span className="gw-l">Bedrijfsnaam *</span><input id="gw-bedrijf" autoComplete="organization" maxLength={120} required value={g.bedrijf} onChange={(e) => setG({ ...g, bedrijf: e.target.value })} /></label>
      </div></section>
      <section className="gw-sec"><div className="gw-sec-head"><span className="gw-num">02</span><h2>Jouw website</h2></div><div className="gw-card"><div className="gw-rij">{VRAGEN.slice(0, 2).map(veld)}</div>{VRAGEN.slice(2).map(veld)}</div>
        <p className="gw-juridisch">Je aanvraag opent WhatsApp met al je ingevulde antwoorden. Verstuur het bericht daar zelf naar Marinus. Lees ons <a href={`${languagePrefix(language)}/privacy/`}>privacybeleid</a>.</p>
        {fout ? <p className="gw-fout" role="alert">{fout}</p> : null}
        <button type="submit" className="sn-btn3d h-button gw-verder"><span className="sn-btn3d-sheen" /><span>Stuur mijn aanvraag via WhatsApp</span><span className="h-button-icon"><ArrowUpRight size={16} /></span></button>
      </section>
    </form>
  </div></div>;
}
