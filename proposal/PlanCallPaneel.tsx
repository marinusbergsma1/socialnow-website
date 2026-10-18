import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, X } from "lucide-react";
import { LOCALES, languagePrefix, useLanguage } from "./i18n/context";
import { AGENDA_LINK, CONTACT_MAIL, agendaInbedden, conceptLink, heeftAgenda, heeftWhatsApp } from "./aanvragen";
import type { CallVoorinvulling } from "./PlanCall";

// Boekingspaneel voor een call over een custom OS (in elk hulppakket, vanaf €3.000 per maand). Drie stappen: wat er op maat moet, een moment, de
// gegevens. Met AGENDA_LINK (aanvragen.ts) boekt de bezoeker in stap 2 zelf een vrij moment in de Google Agenda en
// stuurt Google de bevestiging. Zonder link kiest hij een voorkeursmoment. De antwoorden gaan in beide gevallen als
// ingevuld concept naar Steef, via dezelfde route als elke andere aanvraag op de site.
const ONDERDELEN = [
  { id: "website", label: "Website" },
  { id: "crm", label: "CRM en klanten" },
  { id: "content", label: "Content en social" },
  { id: "ads", label: "Advertenties" },
  { id: "studio", label: "Studio: beeld en video" },
  { id: "agents", label: "AI-agents en automatisering" },
  { id: "koppelingen", label: "Koppelingen, zoals Odoo" },
  { id: "dashboard", label: "Dashboard en rapportage" },
  { id: "app", label: "Eigen app of portaal" },
];
// Prijsmodel van 18 oktober 2026: alles maandelijks, hulppakket met custom OS en gratis website vanaf €3.000 per maand.
const BUDGETTEN = [
  { id: "3-5", label: "€3.000 tot €5.000 p/m" },
  { id: "5-10", label: "€5.000 tot €10.000 p/m" },
  { id: "10-plus", label: "Meer dan €10.000 p/m" },
  { id: "onbekend", label: "Weet ik nog niet" },
];
const TIJDEN = ["09:30", "11:00", "13:30", "15:00", "16:30"];

// De komende tien werkdagen, vanaf morgen.
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

type Gegevens = { bedrijf: string; onderdelen: string[]; budget: string; dag: string; tijd: string; naam: string; email: string; telefoon: string; toelichting: string };

export default function PlanCallPaneel({ voor, sluit }: { voor: CallVoorinvulling; sluit: () => void }) {
  const { language, t } = useLanguage();
  const dialoog = useRef<HTMLDialogElement>(null);
  const kop = useRef<HTMLHeadingElement>(null);
  const [stap, zetStap] = useState(0);
  const [fout, zetFout] = useState("");
  const [link, zetLink] = useState("");
  const [g, zetG] = useState<Gegevens>(() => ({
    bedrijf: voor.bedrijf || "",
    onderdelen: (voor.onderdelen || []).filter((id) => ONDERDELEN.some((o) => o.id === id)),
    budget: BUDGETTEN.some((b) => b.id === voor.budget) ? voor.budget! : "",
    dag: "", tijd: "", naam: "", email: "", telefoon: "", toelichting: "",
  }));
  const zet = <K extends keyof Gegevens>(veld: K, waarde: Gegevens[K]) => zetG((oud) => ({ ...oud, [veld]: waarde }));
  const dagen = useMemo(werkdagen, []);
  const locale = LOCALES[language].replace("_", "-");
  const dagNaam = (iso: string) => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${iso}T12:00:00`));
  const inbedden = agendaInbedden();

  useEffect(() => {
    const d = dialoog.current;
    if (!d) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!d.open) d.showModal();
    return () => { document.body.style.overflow = overflow; };
  }, []);
  useEffect(() => { if (stap > 0) kop.current?.focus(); }, [stap]);

  const controle = (): string => {
    if (stap === 0) {
      if (!g.bedrijf.trim()) return t("Vul de naam van je bedrijf in.");
      if (!g.onderdelen.length) return t("Kies minstens één onderdeel.");
      if (!g.budget) return t("Kies een budgetindicatie.");
    }
    if (stap === 1 && !heeftAgenda && (!g.dag || !g.tijd)) return t("Kies een dag en een tijd.");
    if (stap === 2) {
      if (!g.naam.trim()) return t("Vul je naam in.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim())) return t("Dat e-mailadres klopt nog niet.");
    }
    return "";
  };
  const bericht = () => {
    const regels = [
      t("Ik wil een call plannen over een custom OS."),
      "",
      `${t("Bedrijf")}: ${g.bedrijf.trim()}`,
      `${t("Onderdelen op maat")}: ${g.onderdelen.map((id) => t(ONDERDELEN.find((o) => o.id === id)!.label)).join(", ")}`,
      `${t("Budgetindicatie")}: ${t(BUDGETTEN.find((b) => b.id === g.budget)!.label)}`,
      `${t("Moment")}: ${heeftAgenda ? t("Gekozen in de agenda") : `${dagNaam(g.dag)}, ${g.tijd} (${t("Nederlandse tijd")})`}`,
      "",
      `${t("Naam")}: ${g.naam.trim()}`,
      `${t("E-mailadres")}: ${g.email.trim()}`,
    ];
    if (g.telefoon.trim()) regels.push(`${t("Telefoonnummer")}: ${g.telefoon.trim()}`);
    if (g.toelichting.trim()) regels.push("", `${t("Toelichting")}: ${g.toelichting.trim()}`);
    if (voor.bron === "os") regels.push("", `${t("Bron")}: SocialNow OS`);
    if (voor.ref) regels.push(`${t("Referentie")}: ${voor.ref}`);
    return regels.join("\n");
  };
  const verder = (e?: React.FormEvent) => {
    e?.preventDefault();
    const melding = controle();
    zetFout(melding);
    if (melding) return;
    if (stap < 2) { zetStap(stap + 1); return; }
    const adres = conceptLink(`${t("Plan een call voor custom OS")}: ${g.bedrijf.trim()}`, bericht());
    zetLink(adres);
    zetStap(3);
    // Droog in proeven en previews: geautomatiseerde browsers en ?proef in het adres openen nooit een echte mail of WhatsApp.
    if (navigator.webdriver || new URLSearchParams(window.location.search).has("proef")) return;
    window.location.href = adres;
  };
  const terug = () => { zetFout(""); zetStap(Math.max(0, stap - 1)); };
  const wissel = (id: string) => zet("onderdelen", g.onderdelen.includes(id) ? g.onderdelen.filter((o) => o !== id) : [...g.onderdelen, id]);

  const titels = ["Wat wil je op maat?", heeftAgenda ? "Kies een vrij moment." : "Wanneer past een call?", "Hoe bereiken we je?"];
  return <dialog ref={dialoog} className="sn-call" aria-labelledby="sn-call-titel" onClose={sluit} onClick={(e) => { if (e.target === dialoog.current) dialoog.current.close(); }}>
    <form className="sn-call-vel" onSubmit={verder} noValidate>
      <header className="sn-call-kop">
        <p className="sn-call-eyebrow">Hulppakket vanaf €3.000 p/m</p>
        <button type="button" className="sn-call-sluit" aria-label="Sluiten" onClick={() => dialoog.current?.close()}><X size={22} aria-hidden="true" /></button>
        <h2 id="sn-call-titel">Plan een call voor je custom OS.</h2>
        {stap < 3 && <div className="sn-call-stappen" aria-hidden="true">{[0, 1, 2].map((i) => <span key={i} className={i <= stap ? "aan" : ""} />)}</div>}
      </header>

      <div className="sn-call-inhoud">
        {stap < 3 && <h3 className="sn-call-stap" ref={kop} tabIndex={-1}><span>{`${t("Stap")} ${stap + 1} / 3`}</span>{t(titels[stap])}</h3>}

        {stap === 0 && <>
          <label className="sn-call-veld"><span>Bedrijf</span><input autoComplete="organization" maxLength={120} value={g.bedrijf} onChange={(e) => zet("bedrijf", e.target.value)} /></label>
          <fieldset className="sn-call-groep"><legend>Welke onderdelen wil je op maat?</legend>
            <div className="sn-call-chips">{ONDERDELEN.map((o) => <label key={o.id} className="sn-call-chip"><input type="checkbox" checked={g.onderdelen.includes(o.id)} onChange={() => wissel(o.id)} /><span><Check size={14} aria-hidden="true" />{o.label}</span></label>)}</div>
          </fieldset>
          <fieldset className="sn-call-groep"><legend>Budgetindicatie per maand</legend>
            <div className="sn-call-chips sn-call-budget">{BUDGETTEN.map((b) => <label key={b.id} className="sn-call-chip"><input type="radio" name="sn-call-budget" checked={g.budget === b.id} onChange={() => zet("budget", b.id)} /><span>{b.label}</span></label>)}</div>
          </fieldset>
        </>}

        {stap === 1 && (heeftAgenda ? <div className="sn-call-agenda">
          <p className="sn-call-uitleg">Kies een vrij moment in de agenda. Je krijgt meteen een bevestiging en een uitnodiging per e-mail. Daarna nog één stap voor je antwoorden.</p>
          {inbedden
            ? <iframe src={inbedden} title="Agenda van SocialNow" loading="lazy" />
            : <a className="pill sn-call-open" href={AGENDA_LINK} target="_blank" rel="noopener noreferrer"><span>Open de agenda</span><span className="arrow"><ArrowUpRight size={17} /></span></a>}
        </div> : <>
          <p className="sn-call-uitleg">Een videocall van 30 minuten. Kies je voorkeur, wij bevestigen het moment per e-mail.</p>
          <fieldset className="sn-call-groep"><legend>Dag</legend>
            <div className="sn-call-dagen">{dagen.map((d) => { const iso = isoDag(d); const delen = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" }).formatToParts(d); const deel = (soort: string) => delen.find((p) => p.type === soort)?.value || ""; return <label key={iso} className="sn-call-chip sn-call-dag"><input type="radio" name="sn-call-dag" checked={g.dag === iso} onChange={() => zet("dag", iso)} /><span translate="no"><i>{deel("weekday").replace(".", "")}</i><b>{deel("day")}</b><i>{deel("month").replace(".", "")}</i></span></label>; })}</div>
          </fieldset>
          <fieldset className="sn-call-groep"><legend>Tijd, Nederlandse tijd</legend>
            <div className="sn-call-chips">{TIJDEN.map((tijd) => <label key={tijd} className="sn-call-chip"><input type="radio" name="sn-call-tijd" checked={g.tijd === tijd} onChange={() => zet("tijd", tijd)} /><span translate="no">{tijd}</span></label>)}</div>
          </fieldset>
        </>)}

        {stap === 2 && <>
          <div className="sn-call-rij">
            <label className="sn-call-veld"><span>Naam</span><input autoComplete="name" maxLength={120} value={g.naam} onChange={(e) => zet("naam", e.target.value)} /></label>
            <label className="sn-call-veld"><span>E-mailadres</span><input type="email" inputMode="email" autoComplete="email" maxLength={254} value={g.email} onChange={(e) => zet("email", e.target.value)} /></label>
          </div>
          <label className="sn-call-veld"><span>Telefoonnummer <i>(optioneel)</i></span><input type="tel" inputMode="tel" autoComplete="tel" maxLength={40} value={g.telefoon} onChange={(e) => zet("telefoon", e.target.value)} /></label>
          <label className="sn-call-veld"><span>Wat wil je met je OS bereiken? <i>(optioneel)</i></span><textarea rows={3} maxLength={1200} value={g.toelichting} onChange={(e) => zet("toelichting", e.target.value)} /></label>
          <p className="sn-call-klein">{t(heeftWhatsApp ? "Je opent WhatsApp met een ingevuld conceptbericht. De aanvraag is pas verzonden nadat je daar op verzenden drukt. Bekijk ons" : "Je opent je e-mailapp met een ingevuld concept. De aanvraag is pas verzonden nadat je daar op verzenden drukt. Bekijk ons")} <a href={`${languagePrefix(language)}/privacy/`}>{t("privacybeleid")}</a>.</p>
        </>}

        {stap === 3 && <div className="sn-call-klaar" role="status">
          <span className="sn-call-vink"><Check size={26} aria-hidden="true" /></span>
          <h3 ref={kop} tabIndex={-1}>Bijna klaar.</h3>
          <p>{t(heeftWhatsApp ? "WhatsApp opent met je aanvraag. Druk daar op verzenden, dan bevestigen we je call." : "Je e-mailapp opent met je aanvraag. Druk daar op verzenden, dan bevestigen we je call.")}</p>
          <p className="sn-call-klein">{t("Opent er niets? Mail ons op")} <a href={link} translate="no">{CONTACT_MAIL}</a>.</p>
        </div>}

        {fout && <p className="sn-call-fout" role="alert">{fout}</p>}
      </div>

      <footer className="sn-call-voet">
        {stap > 0 && stap < 3 && <button type="button" className="sn-call-terug" onClick={terug}><ArrowLeft size={16} aria-hidden="true" /><span>Terug</span></button>}
        {stap < 3
          ? <button type="submit" className="pill sn-call-verder"><span>{t(stap < 2 ? (stap === 1 && heeftAgenda ? "Ik heb een moment gekozen" : "Volgende") : heeftWhatsApp ? "Verstuur via WhatsApp" : "Verstuur per e-mail")}</span><span className="arrow"><ArrowUpRight size={17} /></span></button>
          : <button type="button" className="pill sn-call-verder sn-call-dicht" onClick={() => dialoog.current?.close()}><span>Sluiten</span></button>}
      </footer>
    </form>
  </dialog>;
}
