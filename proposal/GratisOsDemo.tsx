import React, { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { aanvraagWhatsApp } from "./aanvragen";
import "./gratis-website.css";

export default function GratisOsDemo() {
  const { language, t } = useLanguage();
  const [gegevens, setGegevens] = useState({ voornaam: "", achternaam: "", email: "" });
  const [fout, setFout] = useState("");
  const zet = (veld: keyof typeof gegevens, waarde: string) => setGegevens((oud) => ({ ...oud, [veld]: waarde }));
  const verstuur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gegevens.voornaam.trim() || !gegevens.achternaam.trim()) { setFout(t("Vul je voornaam en achternaam in.")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gegevens.email.trim())) { setFout(t("Dat e-mailadres klopt nog niet.")); return; }
    setFout("");
    window.location.href = aanvraagWhatsApp("os", language, gegevens);
  };
  return <div className="gw"><div className="gw-sheet">
    <p className="gw-eyebrow"><i className="gw-stipjes"><b /><b /><b /></i>{t("Gratis OS-demo")}</p>
    <h1>{t("Vraag je gratis OS-demo aan.")}</h1>
    <p className="gw-lead">{t("Vul alleen je naam en e-mailadres in. WhatsApp opent met een ingevuld bericht dat je nog kunt aanpassen.")}</p>
    <ul className="gw-beloftes"><li><Check size={15} /> {t("Rechtstreeks contact met SocialNow")}</li><li><Check size={15} /> {t("Geen telefoonnummer nodig")}</li></ul>
    <form onSubmit={verstuur} noValidate><section className="gw-sec"><div className="gw-sec-head"><span className="gw-num">01</span><h2>Jouw gegevens</h2></div><div className="gw-card">
      <div className="gw-rij">
        <label className="gw-fld" htmlFor="os-voornaam"><span className="gw-l">Voornaam</span><input id="os-voornaam" autoComplete="given-name" maxLength={80} value={gegevens.voornaam} onChange={e=>zet("voornaam",e.target.value)} /></label>
        <label className="gw-fld" htmlFor="os-achternaam"><span className="gw-l">Achternaam</span><input id="os-achternaam" autoComplete="family-name" maxLength={80} value={gegevens.achternaam} onChange={e=>zet("achternaam",e.target.value)} /></label>
      </div>
      <label className="gw-fld" htmlFor="os-email"><span className="gw-l">E-mailadres</span><input id="os-email" type="email" autoComplete="email" inputMode="email" maxLength={254} value={gegevens.email} onChange={e=>zet("email",e.target.value)} /></label>
    </div>
    <p className="gw-juridisch">{t("Je opent WhatsApp met een ingevuld conceptbericht. De aanvraag is pas verzonden nadat je daar op verzenden drukt. Bekijk ons")} <a href={`${languagePrefix(language)}/privacy/`}>{t("privacybeleid")}</a>.</p>
    {fout && <p className="gw-fout" role="alert">{fout}</p>}
    <button type="submit" className="sn-btn3d h-button gw-verder"><span className="sn-btn3d-sheen" /><span>{t("Vraag je OS-demo aan via WhatsApp")}</span><span className="h-button-icon"><ArrowUpRight size={16} /></span></button>
    </section></form>
  </div></div>;
}
