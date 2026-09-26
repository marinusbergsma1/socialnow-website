import React, { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { aanvraagWhatsApp } from "./aanvragen";
import "./gratis-website.css";

export default function GratisWebsite() {
  const { language, t } = useLanguage();
  const [gegevens, setGegevens] = useState({ voornaam: "", achternaam: "", email: "", bedrijf: "", website: "", wens: "" });
  const [fout, setFout] = useState("");
  const zet = (veld: keyof typeof gegevens, waarde: string) => setGegevens((oud) => ({ ...oud, [veld]: waarde }));
  const verstuur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gegevens.voornaam.trim() || !gegevens.achternaam.trim()) { setFout(t("Vul je voornaam en achternaam in.")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gegevens.email.trim())) { setFout(t("Dat e-mailadres klopt nog niet.")); return; }
    setFout("");
    window.location.href = aanvraagWhatsApp("website", language, gegevens);
  };
  return <div className="gw"><div className="gw-sheet">
    <p className="gw-eyebrow"><i className="gw-stipjes"><b /><b /><b /></i>Gratis website aanvragen</p>
    <h1>Je nieuwe website. <span className="gw-accent">Gratis.</span></h1>
    <p className="gw-lead">Vul je gegevens in en open je aanvraag in WhatsApp. Je kunt het bericht daar nog aanpassen voordat je het verstuurt.</p>
    <ul className="gw-beloftes"><li><Check size={15} /> Rechtstreeks contact met SocialNow</li><li><Check size={15} /> Je gegevens alvast in het bericht</li></ul>
    <form onSubmit={verstuur} noValidate>
      <section className="gw-sec"><div className="gw-sec-head"><span className="gw-num">01</span><h2>Jouw gegevens</h2></div><div className="gw-card">
        <div className="gw-rij">
          <label className="gw-fld" htmlFor="gw-voornaam"><span className="gw-l">Voornaam</span><input id="gw-voornaam" autoComplete="given-name" maxLength={80} value={gegevens.voornaam} onChange={e=>zet("voornaam",e.target.value)} /></label>
          <label className="gw-fld" htmlFor="gw-achternaam"><span className="gw-l">Achternaam</span><input id="gw-achternaam" autoComplete="family-name" maxLength={80} value={gegevens.achternaam} onChange={e=>zet("achternaam",e.target.value)} /></label>
        </div>
        <label className="gw-fld" htmlFor="gw-email"><span className="gw-l">E-mailadres</span><input id="gw-email" type="email" autoComplete="email" inputMode="email" maxLength={254} value={gegevens.email} onChange={e=>zet("email",e.target.value)} /></label>
        <label className="gw-fld" htmlFor="gw-bedrijf"><span className="gw-l">Bedrijfsnaam <small>{t("(optioneel)")}</small></span><input id="gw-bedrijf" autoComplete="organization" maxLength={120} value={gegevens.bedrijf} onChange={e=>zet("bedrijf",e.target.value)} /></label>
      </div></section>
      <section className="gw-sec"><div className="gw-sec-head"><span className="gw-num">02</span><h2>Je website</h2></div><div className="gw-card">
        <label className="gw-fld" htmlFor="gw-website"><span className="gw-l">Huidige website <small>{t("(optioneel)")}</small></span><input id="gw-website" type="url" inputMode="url" autoCapitalize="none" maxLength={200} value={gegevens.website} onChange={e=>zet("website",e.target.value)} /></label>
        <label className="gw-fld" htmlFor="gw-wens"><span className="gw-l">Wat wil je graag? <small>{t("(optioneel)")}</small></span><textarea id="gw-wens" rows={3} maxLength={1000} value={gegevens.wens} onChange={e=>zet("wens",e.target.value)} /></label>
      </div>
      <p className="gw-juridisch">{t("Je opent WhatsApp met een ingevuld conceptbericht. De aanvraag is pas verzonden nadat je daar op verzenden drukt. Bekijk ons")} <a href={`${languagePrefix(language)}/privacy/`}>{t("privacybeleid")}</a>.</p>
      {fout && <p className="gw-fout" role="alert">{fout}</p>}
      <button type="submit" className="sn-btn3d h-button gw-verder"><span className="sn-btn3d-sheen" /><span>Gratis website aanvragen via WhatsApp</span><span className="h-button-icon"><ArrowUpRight size={16} /></span></button>
      </section>
    </form>
  </div></div>;
}
