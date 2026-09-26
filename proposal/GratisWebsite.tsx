import React, { useEffect, useState } from "react";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { useLanguage } from "./i18n/context";
import "./gratis-website.css";

const OPSLAG = "sn-gratis-website-v1";
const WHATSAPP = "https://wa.me/31637404577";
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
  const { t } = useLanguage();
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
    if (!g.voornaam.trim()) { setFout(t("Vul je naam in.")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim())) { setFout(t("Dat e-mailadres klopt nog niet.")); return; }
    if (g.mobiel.replace(/\D/g, "").length < 8) { setFout(t("Vul je telefoonnummer in, dan bellen we je.")); return; }
    if (!g.bedrijf.trim() && !(a.website || "").trim()) { setFout(t("Vul je bedrijfsnaam of je website in.")); return; }
    setFout("");
    const velden: [string, string][] = [
      ["Voornaam", g.voornaam], ["Achternaam", g.achternaam], ["Bedrijfsnaam", g.bedrijf],
      ["E-mailadres", g.email], ["Telefoonnummer", g.mobiel],
      ...VRAGEN.map((v): [string, string] => [v.vraag, a[v.key] || ""]),
    ];
    const bericht = [
      "Hoi Marinus, ik wil graag mijn persoonlijke website samen met jou maken op de beurs.", "",
      ...velden.filter(([, waarde]) => waarde.trim()).map(([vraag, waarde]) => `${vraag}: ${waarde.trim()}`),
    ].join("\n");
    window.location.href = `${WHATSAPP}?text=${encodeURIComponent(bericht)}`;
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
    <h1>Jouw website. <span className="gw-accent">Persoonlijk gemaakt op de beurs.</span></h1>
    <p className="gw-lead">Vertel me over je bedrijf en wat je mooi vindt. Ik lees je antwoorden zelf en maak je nieuwe website samen met jou, live op de beurs.</p>
    <ul className="gw-beloftes"><li><Check size={15} /> In jouw stijl, voor jouw bedrijf</li><li><Check size={15} /> Direct contact met Marinus</li><li><Check size={15} /> Samen live aan de slag op stand C21</li></ul>
    <a className="gw-contactpil" href={`${WHATSAPP}?text=${encodeURIComponent("Hoi Marinus, ik heb een vraag over de persoonlijke website op de beurs.")}`} target="_blank" rel="noopener noreferrer">
      <img className="gw-contact-avatar" src="/images/Marinus-Bergsma-V2.webp" alt="" width="48" height="48" /><span className="gw-contact-tekst"><strong>Marinus Bergsma</strong><small>Vragen? Neem persoonlijk contact op</small></span><MessageCircle size={19} aria-hidden="true" />
    </a>
    <div className="gw-progress" aria-label={t("Voortgang")}><div className="gw-bar"><div className="gw-fill" style={{ width: `${procent}%` }} /></div><div className="gw-meta"><span><i className="gw-dot" />Automatisch bewaard</span><span>{procent}%</span></div></div>
    <form onSubmit={verstuur} noValidate>
      <section className="gw-sec"><div className="gw-sec-head"><span className="gw-num">01</span><h2>Jij</h2></div><div className="gw-card">
        <div className="gw-rij"><label className="gw-fld" htmlFor="gw-voornaam"><span className="gw-l">Voornaam</span><input id="gw-voornaam" autoComplete="given-name" maxLength={40} value={g.voornaam} onChange={(e) => setG({ ...g, voornaam: e.target.value })} /></label><label className="gw-fld" htmlFor="gw-achternaam"><span className="gw-l">Achternaam</span><input id="gw-achternaam" autoComplete="family-name" maxLength={40} value={g.achternaam} onChange={(e) => setG({ ...g, achternaam: e.target.value })} /></label></div>
        <div className="gw-rij"><label className="gw-fld" htmlFor="gw-email"><span className="gw-l">E-mailadres</span><input id="gw-email" type="email" autoComplete="email" inputMode="email" maxLength={254} value={g.email} onChange={(e) => setG({ ...g, email: e.target.value })} /></label><label className="gw-fld" htmlFor="gw-mobiel"><span className="gw-l">Telefoonnummer</span><input id="gw-mobiel" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={g.mobiel} onChange={(e) => setG({ ...g, mobiel: e.target.value })} /></label></div>
        <label className="gw-fld" htmlFor="gw-bedrijf"><span className="gw-l">Bedrijfsnaam</span><input id="gw-bedrijf" autoComplete="organization" maxLength={120} value={g.bedrijf} onChange={(e) => setG({ ...g, bedrijf: e.target.value })} /></label>
      </div></section>
      <section className="gw-sec"><div className="gw-sec-head"><span className="gw-num">02</span><h2>Jouw website</h2></div><div className="gw-card"><div className="gw-rij">{VRAGEN.slice(0, 2).map(veld)}</div>{VRAGEN.slice(2).map(veld)}</div>
        <p className="gw-juridisch">Je aanvraag opent WhatsApp met al je ingevulde antwoorden. Verstuur het bericht daar zelf naar Marinus. Lees ons <a href="/privacy/">privacybeleid</a>.</p>
        {fout ? <p className="gw-fout" role="alert">{fout}</p> : null}
        <button type="submit" className="sn-btn3d h-button gw-verder"><span className="sn-btn3d-sheen" /><span>Stuur mijn aanvraag via WhatsApp</span><span className="h-button-icon"><ArrowUpRight size={16} /></span></button>
      </section>
    </form>
  </div></div>;
}
