import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { LOCALES, languagePrefix, useLanguage } from "./i18n/context";
import { CONTACTEN } from "./ContactSlot";
import { people } from "./content";

// 4 november 2026 (Marinus) over Plan een gesprek in de homepage-header, dat het custom-OS-paneel met budget opende: "Hier moet gewoon
// een simpele onboarding voor komen. Of ze moeten via een soort Calendly omgeving makkelijk een call in kunnen plannen.", daarna
// "Agenda direct gewoon met de contactgegevens van mij, Steef en Michelle en Ben." en "word allemaal teveel. Ik wil gewoon simpel en
// zakelijk maar ook korte lijntjes dus gewoon onze contactgegevens, email en wachtwoord en onderwerp kiezen en gesprek in kunnen
// plannen." Dus één scherm: onze contactgegevens, dan e-mail, telefoon (het "wachtwoord" lezen we als telefoonnummer), onderwerp en
// een moment. Het onderwerp bepaalt wie het gesprek doet; de aanvraag gaat als ingevuld concept per e-mail naar die persoon (Ben
// heeft nog geen adres, dan naar info@). Zelfde opmaak als PlanCallPaneel (plan-call.css).
const ONDERWERPEN = [
  { id: "odoo", label: "Odoo en operations", wie: "Michelle Yang" },
  { id: "finance", label: "Finance", wie: "Steef Komen" },
  { id: "merk", label: "Website, branding en marketing", wie: "Marinus Bergsma" },
  { id: "partners", label: "Partnerships en België", wie: "Ben Sterckx" },
];
const TIJDEN = ["09:30", "11:00", "13:30", "15:00", "16:30"];
const VANGNET = "info@socialnow.nl";

function werkdagen(): Date[] {
  const dagen: Date[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (dagen.length < 10) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) dagen.push(new Date(d));
  }
  return dagen;
}
const isoDag = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function GesprekPaneel({ sluit }: { sluit: () => void }) {
  const { language, t } = useLanguage();
  const dialoog = useRef<HTMLDialogElement>(null);
  const [klaar, zetKlaar] = useState("");
  const [fout, zetFout] = useState("");
  const [g, zetG] = useState({ email: "", telefoon: "", onderwerp: "", dag: "", tijd: "" });
  const zet = (veld: keyof typeof g, waarde: string) => zetG((oud) => ({ ...oud, [veld]: waarde }));
  const dagen = useMemo(werkdagen, []);
  const locale = LOCALES[language].replace("_", "-");
  const dagNaam = (iso: string) => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${iso}T12:00:00`));
  const onderwerp = ONDERWERPEN.find((o) => o.id === g.onderwerp);
  const contact = CONTACTEN.find((c) => c.naam === onderwerp?.wie);

  useEffect(() => {
    const d = dialoog.current;
    if (!d) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!d.open) d.showModal();
    return () => { document.body.style.overflow = overflow; };
  }, []);

  const verstuur = (e: React.FormEvent) => {
    e.preventDefault();
    const melding = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim()) ? t("Dat e-mailadres klopt nog niet.")
      : !onderwerp ? t("Kies een onderwerp.")
      : !g.dag || !g.tijd ? t("Kies een dag en een tijd.") : "";
    zetFout(melding);
    if (melding || !onderwerp) return;
    const moment = `${dagNaam(g.dag)}, ${g.tijd} (${t("Nederlandse tijd")})`;
    const regels = [
      `${t("Onderwerp")}: ${t(onderwerp.label)}`,
      `${t("Moment")}: ${moment}`,
      `${t("E-mailadres")}: ${g.email.trim()}`,
    ];
    if (g.telefoon.trim()) regels.push(`${t("Telefoonnummer")}: ${g.telefoon.trim()}`);
    const aan = contact?.mail || VANGNET;
    const adres = `mailto:${aan}?subject=${encodeURIComponent(`${t("Gesprek plannen")}: ${t(onderwerp.label)}, ${moment}`)}&body=${encodeURIComponent(regels.join("\n"))}`;
    zetKlaar(adres);
    // Droog in proeven en previews: geautomatiseerde browsers en ?proef in het adres openen nooit een echte mail.
    if (navigator.webdriver || new URLSearchParams(window.location.search).has("proef")) return;
    window.location.href = adres;
  };

  return <dialog ref={dialoog} className="sn-call sn-gesprek" aria-labelledby="sn-gesprek-titel" onClose={sluit} onClick={(e) => { if (e.target === dialoog.current) dialoog.current.close(); }}>
    <form className="sn-call-vel" onSubmit={verstuur} noValidate>
      <header className="sn-call-kop">
        <p className="sn-call-eyebrow">Contact</p>
        <button type="button" className="sn-call-sluit" aria-label="Sluiten" onClick={() => dialoog.current?.close()}><X size={22} aria-hidden="true" /></button>
        <h2 id="sn-gesprek-titel">Plan een gesprek.</h2>
      </header>

      <div className="sn-call-inhoud">
        <ul className="sn-gesprek-contact">
          {CONTACTEN.map((c) => {
            const p = people.find((x) => x.name === c.naam);
            return p && <li key={c.naam}><strong translate="no">{c.naam}</strong><span>{p.role}</span>{c.mail ? <a href={`mailto:${c.mail}`} translate="no">{c.mail}</a> : <a href={p.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}</li>;
          })}
        </ul>

        {klaar ? <div className="sn-call-klaar" role="status">
          <span className="sn-call-vink"><Check size={26} aria-hidden="true" /></span>
          <p>{t("Je e-mailapp opent met je aanvraag. Druk daar op verzenden, dan bevestigen we je gesprek.")}</p>
          <p className="sn-call-klein">{t("Opent er niets? Mail ons op")} <a href={klaar} translate="no">{contact?.mail || VANGNET}</a>.</p>
        </div> : <>
          <div className="sn-call-rij">
            <label className="sn-call-veld"><span>E-mailadres</span><input type="email" inputMode="email" autoComplete="email" maxLength={254} value={g.email} onChange={(e) => zet("email", e.target.value)} /></label>
            <label className="sn-call-veld"><span>Telefoonnummer <i>(optioneel)</i></span><input type="tel" inputMode="tel" autoComplete="tel" maxLength={40} value={g.telefoon} onChange={(e) => zet("telefoon", e.target.value)} /></label>
          </div>
          <fieldset className="sn-call-groep"><legend>Onderwerp</legend>
            <div className="sn-call-chips">{ONDERWERPEN.map((o) => <label key={o.id} className="sn-call-chip"><input type="radio" name="sn-gesprek-onderwerp" checked={g.onderwerp === o.id} onChange={() => zet("onderwerp", o.id)} /><span><Check size={14} aria-hidden="true" />{o.label}</span></label>)}</div>
            {onderwerp && <p className="sn-call-klein">{t("Je spreekt met")} <b translate="no">{onderwerp.wie}</b>.</p>}
          </fieldset>
          <fieldset className="sn-call-groep"><legend>Dag</legend>
            <div className="sn-call-dagen">{dagen.map((d) => { const iso = isoDag(d); const delen = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" }).formatToParts(d); const deel = (soort: string) => delen.find((p) => p.type === soort)?.value || ""; return <label key={iso} className="sn-call-chip sn-call-dag"><input type="radio" name="sn-gesprek-dag" checked={g.dag === iso} onChange={() => zet("dag", iso)} /><span translate="no"><i>{deel("weekday").replace(".", "")}</i><b>{deel("day")}</b><i>{deel("month").replace(".", "")}</i></span></label>; })}</div>
          </fieldset>
          <fieldset className="sn-call-groep"><legend>Tijd, Nederlandse tijd</legend>
            <div className="sn-call-chips">{TIJDEN.map((tijd) => <label key={tijd} className="sn-call-chip"><input type="radio" name="sn-gesprek-tijd" checked={g.tijd === tijd} onChange={() => zet("tijd", tijd)} /><span translate="no">{tijd}</span></label>)}</div>
          </fieldset>
          <p className="sn-call-klein">{t("Je opent je e-mailapp met een ingevuld concept. De aanvraag is pas verzonden nadat je daar op verzenden drukt. Bekijk ons")} <a href={`${languagePrefix(language)}/privacy/`}>{t("privacybeleid")}</a>.</p>
        </>}
        {fout && <p className="sn-call-fout" role="alert">{fout}</p>}
      </div>

      <footer className="sn-call-voet">
        {klaar
          ? <button type="button" className="pill sn-call-verder sn-call-dicht" onClick={() => dialoog.current?.close()}><span>Sluiten</span></button>
          : <button type="submit" className="pill sn-call-verder"><span>Plan gesprek</span><span className="arrow"><ArrowUpRight size={17} /></span></button>}
      </footer>
    </form>
  </dialog>;
}
