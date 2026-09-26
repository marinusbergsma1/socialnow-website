import React, { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { aanvraagWhatsApp } from "./aanvragen";
import "./gratis-website.css";

export default function GratisWebsite() {
  const { language, t } = useLanguage();
  const [gegevens, setGegevens] = useState({ voornaam: "", achternaam: "", email: "", bedrijf: "", website: "", voorbeeld: "", wat: "", nietgoed: "" });
  const [fout, setFout] = useState("");
  const zet = (veld: keyof typeof gegevens, waarde: string) => setGegevens((oud) => ({ ...oud, [veld]: waarde }));
  const verstuur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gegevens.voornaam.trim() || !gegevens.achternaam.trim()) { setFout(t("Vul je voornaam en achternaam in.")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gegevens.email.trim())) { setFout(t("Dat e-mailadres klopt nog niet.")); return; }
    if (!gegevens.bedrijf.trim() && !gegevens.website.trim()) { setFout(t("Vul je bedrijfsnaam of je website in.")); return; }
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
        <div className="gw-rij">
          <label className="gw-fld" htmlFor="gw-website"><span className="gw-l">{t("Huidige website")}</span><span className="gw-h">{t("Plak de link. Leeg laten als je nog geen site hebt.")}</span><input id="gw-website" type="url" inputMode="url" autoCapitalize="none" maxLength={200} value={gegevens.website} onChange={e=>zet("website",e.target.value)} /></label>
          <label className="gw-fld" htmlFor="gw-voorbeeld"><span className="gw-l">{t("Een website die je mega mooi vindt")}</span><span className="gw-h">{t("Plak de link. Mag uit elke branche komen.")}</span><input id="gw-voorbeeld" type="url" inputMode="url" autoCapitalize="none" maxLength={200} value={gegevens.voorbeeld} onChange={e=>zet("voorbeeld",e.target.value)} /></label>
        </div>
        <label className="gw-fld" htmlFor="gw-wat"><span className="gw-l">{t("Wat doet je bedrijf, in één zin?")}</span><span className="gw-h">{t("Bijvoorbeeld: wij installeren zonnepanelen voor bedrijven in de regio Utrecht.")}</span><textarea id="gw-wat" rows={3} maxLength={750} value={gegevens.wat} onChange={e=>zet("wat",e.target.value)} /></label>
        <label className="gw-fld" htmlFor="gw-nietgoed"><span className="gw-l">{t("Waar loop je tegenaan met je huidige site?")}</span><span className="gw-h">{t("Verouderd, traag, niet vindbaar, levert geen aanvragen op, past niet meer bij je.")}</span><textarea id="gw-nietgoed" rows={3} maxLength={750} value={gegevens.nietgoed} onChange={e=>zet("nietgoed",e.target.value)} /></label>
      </div>
      <p className="gw-juridisch">{t("Je opent WhatsApp met een ingevuld conceptbericht. De aanvraag is pas verzonden nadat je daar op verzenden drukt. Bekijk ons")} <a href={`${languagePrefix(language)}/privacy/`}>{t("privacybeleid")}</a>.</p>
      {fout && <p className="gw-fout" role="alert">{fout}</p>}
      <button type="submit" className="sn-btn3d h-button gw-verder"><span className="sn-btn3d-sheen" /><span>Gratis website aanvragen via WhatsApp</span><span className="h-button-icon"><ArrowUpRight size={16} /></span></button>
      </section>
    </form>
  </div></div>;
}
