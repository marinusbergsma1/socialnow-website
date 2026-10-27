import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Calendar, Check, Mail, X } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { AGENDA_LINK, CONTACT_MAIL, conceptLink, heeftAgenda, heeftWhatsApp, mailLink } from "./aanvragen";
import type { CallVoorinvulling } from "./PlanCall";

// Algemene kennismaking. Bestaande OS-links houden hun context, zonder verplichte budgetselectie.
export default function PlanCallPaneel({ voor, sluit }: { voor: CallVoorinvulling; sluit: () => void }) {
  const { language, t } = useLanguage();
  const dialoog = useRef<HTMLDialogElement>(null);
  const resultaat = useRef<HTMLHeadingElement>(null);
  const [link, zetLink] = useState("");
  const [gegevens, zetGegevens] = useState({ naam: "", email: "", bedrijf: voor.bedrijf || "", vraag: "", moment: "" });
  const zet = (veld: keyof typeof gegevens, waarde: string) => zetGegevens(g => ({ ...g, [veld]: waarde }));
  useEffect(() => {
    const element = dialoog.current;
    if (!element) return;
    const focus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => { document.body.style.overflow = overflow; focus?.focus(); };
  }, []);
  useEffect(() => { if (link) resultaat.current?.focus(); }, [link]);
  const maakConcept = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const regels = [t("Ik wil graag kennismaken met SocialNow."), "", `${t("Naam")}: ${gegevens.naam.trim()}`, `${t("E-mailadres")}: ${gegevens.email.trim()}`];
    if (gegevens.bedrijf.trim()) regels.push(`${t("Bedrijf")}: ${gegevens.bedrijf.trim()}`);
    if (gegevens.vraag.trim()) regels.push("", gegevens.vraag.trim());
    if (gegevens.moment.trim()) regels.push("", `${t("Voorkeursmoment")}: ${gegevens.moment.trim()}`);
    if (voor.onderdelen?.length) regels.push(`OS: ${voor.onderdelen.join(", ")}`);
    if (voor.budget) regels.push(`${t("Budgetindicatie")}: ${voor.budget}`);
    if (voor.bron) regels.push(`${t("Bron")}: SocialNow OS`);
    if (voor.ref) regels.push(`${t("Referentie")}: ${voor.ref}`);
    // Alleen een expliciete klik op de conceptlink opent de mailapp of WhatsApp.
    zetLink(conceptLink(t("Kennismaken met SocialNow"), regels.join("\n")));
  };
  return <dialog ref={dialoog} className="sn-call sn-call-general" aria-labelledby="sn-call-titel" onClose={sluit} onClick={e => { if (e.target === dialoog.current) dialoog.current.close(); }}>
    <form className="sn-call-vel" onSubmit={maakConcept}>
      <header className="sn-call-kop"><p className="sn-call-eyebrow">Persoonlijk contact</p><button type="button" className="sn-call-sluit" aria-label="Sluiten" onClick={() => dialoog.current?.close()}><X size={22} aria-hidden="true" /></button><h2 id="sn-call-titel">Laten we kennismaken.</h2><p className="sn-call-uitleg">Een vraag, een idee of een concreet project. Vertel waar je mee verder wilt.</p></header>
      <div className="sn-call-inhoud">
        {link ? <div className="sn-call-klaar" role="status"><Check size={26} aria-hidden="true" /><h3 ref={resultaat} tabIndex={-1}>Je bericht staat klaar.</h3><p>Open je bericht en druk daar op verzenden. Daarna neemt Steef contact met je op om kennis te maken of een moment af te spreken.</p><a className="pill" href={link}><span>{t(heeftWhatsApp ? "Open WhatsApp" : "Open je e-mailapp")}</span><ArrowUpRight size={17} aria-hidden="true" /></a><button type="button" className="sn-call-terug" onClick={() => zetLink("")}>Bericht aanpassen</button></div> : <>
          <a className="sn-call-direct" href={mailLink()}><Mail size={18} aria-hidden="true" /><span>Mail Steef direct <b translate="no">{CONTACT_MAIL}</b></span><ArrowUpRight size={17} aria-hidden="true" /></a>
          {heeftAgenda && <a className="sn-call-direct" href={AGENDA_LINK} target="_blank" rel="noopener noreferrer"><Calendar size={18} aria-hidden="true" /><span>Kies een moment in de agenda</span><ArrowUpRight size={17} aria-hidden="true" /></a>}
          <div className="sn-call-rij"><label className="sn-call-veld"><span>Naam</span><input required pattern={".*\\S.*"} autoComplete="name" maxLength={120} value={gegevens.naam} onChange={e => zet("naam", e.target.value)} /></label><label className="sn-call-veld"><span>E-mailadres</span><input required type="email" autoComplete="email" maxLength={254} value={gegevens.email} onChange={e => zet("email", e.target.value)} /></label></div>
          <label className="sn-call-veld"><span>Bedrijf <i>(optioneel)</i></span><input autoComplete="organization" maxLength={120} value={gegevens.bedrijf} onChange={e => zet("bedrijf", e.target.value)} /></label>
          <label className="sn-call-veld"><span>Waar kunnen we je mee helpen? <i>(optioneel)</i></span><textarea rows={3} maxLength={1200} value={gegevens.vraag} onChange={e => zet("vraag", e.target.value)} /></label>
          <label className="sn-call-veld"><span>Voorkeursmoment voor een call <i>(optioneel)</i></span><input maxLength={160} value={gegevens.moment} onChange={e => zet("moment", e.target.value)} /><small>Een voorkeur is nog geen afspraak. We bevestigen het moment persoonlijk.</small></label>
          <p className="sn-call-klein">{t(heeftWhatsApp ? "Je maakt een conceptbericht. Je verstuurt het zelf vanuit WhatsApp." : "Je maakt een conceptbericht. Je verstuurt het zelf vanuit je e-mailapp.")} <a href={`${languagePrefix(language)}/privacy/`}>Privacybeleid</a></p>
        </>}
      </div>
      <footer className="sn-call-voet">{link ? <button type="button" className="sn-call-terug" onClick={() => dialoog.current?.close()}>Sluiten</button> : <button type="submit" className="pill"><span>Maak mijn bericht klaar</span><ArrowUpRight size={17} aria-hidden="true" /></button>}</footer>
    </form>
  </dialog>;
}
