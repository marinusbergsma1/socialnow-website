import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { aanvraagLink, leesOsGegevens } from "./aanvragen";
import OnboardingBeeld, { gekozenKanaal, useVersie, Verzendkeuze } from "./OnboardingBeeld";
import "./gratis-website.css";

export default function GratisOsDemo() {
  const { language, t } = useLanguage();
  const versie = useVersie();
  const [gegevens, setGegevens] = useState({ voornaam: "", achternaam: "", email: "" });
  const [fout, setFout] = useState("");
  useEffect(() => { const bewaard = leesOsGegevens(); if (bewaard) setGegevens(bewaard); }, []);
  const zet = (veld: keyof typeof gegevens, waarde: string) => setGegevens((oud) => ({ ...oud, [veld]: waarde }));
  const verstuur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gegevens.voornaam.trim() || !gegevens.achternaam.trim()) { setFout(t("Vul je voornaam en achternaam in.")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gegevens.email.trim())) { setFout(t("Dat e-mailadres klopt nog niet.")); return; }
    setFout("");
    window.location.href = aanvraagLink(gekozenKanaal(e), "os", language, gegevens);
  };
  const kop = <>
    <p className="gw-eyebrow"><i className="gw-stipjes"><b /><b /><b /></i>{t("Gratis OS-demo")}</p>
    <h1>{t("Vraag je gratis OS-demo aan.")}</h1>
    <p className="gw-lead">{t("Website, CRM, Studio en Advertenties in één systeem. Vul je naam en e-mailadres in, dan laten we je het OS zien.")}</p>
    <ul className="gw-beloftes"><li><Check size={15} /> {t("Rechtstreeks contact met SocialNow")}</li><li><Check size={15} /> {t("Geen telefoonnummer nodig")}</li></ul>
  </>;
  return <OnboardingBeeld versie={versie} soort="os" kop={kop}>
    <form onSubmit={verstuur} noValidate><section className="gw-sec"><div className="gw-sec-head"><span className="gw-num">01</span><h2>Jouw gegevens</h2></div><div className="gw-card">
      <div className="gw-rij">
        <label className="gw-fld" htmlFor="os-voornaam"><span className="gw-l">Voornaam</span><input id="os-voornaam" autoComplete="given-name" maxLength={80} value={gegevens.voornaam} onChange={e=>zet("voornaam",e.target.value)} /></label>
        <label className="gw-fld" htmlFor="os-achternaam"><span className="gw-l">Achternaam</span><input id="os-achternaam" autoComplete="family-name" maxLength={80} value={gegevens.achternaam} onChange={e=>zet("achternaam",e.target.value)} /></label>
      </div>
      <label className="gw-fld" htmlFor="os-email"><span className="gw-l">E-mailadres</span><input id="os-email" type="email" autoComplete="email" inputMode="email" maxLength={254} value={gegevens.email} onChange={e=>zet("email",e.target.value)} /></label>
    </div>
    <p className="gw-juridisch">{t("Je gegevens staan meteen in het bericht. Verstuur het per e-mail of via WhatsApp, wat jij prettig vindt. Bekijk ons")} <a href={`${languagePrefix(language)}/privacy/`}>{t("privacybeleid")}</a>.</p>
    {fout && <p className="gw-fout" role="alert">{fout}</p>}
    <Verzendkeuze tekst="Vraag mijn OS-demo aan" />
    </section></form>
  </OnboardingBeeld>;
}
