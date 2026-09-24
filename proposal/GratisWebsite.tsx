import React, { useEffect, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { useLanguage } from "./i18n/context";
import { LEGAL_VERSION } from "../components/legal";
import { CLAIM_URL } from "./os-entry";
import "./gratis-website.css";

// 24 september 2026 (Marinus): de gratis website-upgrade op de beurs. Een basisversie van de vaste
// website-onboarding (skill klant-onboarding, naslag/vragenbank.md): wie je bent, wat je verkoopt,
// je klant, stijl en wat er op moet. Genoeg om er dezelfde dag een goede basissite van te maken.
// De antwoorden gaan als vraag + antwoord naar os.socialnow.nl/api/aanmelden (bron "website"); de
// Claude-automatisering leest ze via /api/website-aanvragen. De vraag gaat altijd in het Nederlands
// mee, zodat het dossier voor ons leesbaar blijft, ongeacht de taal van de bezoeker.
const AANMELD_URL = "https://os.socialnow.nl/api/aanmelden";
const OPSLAG = "sn-gratis-website-v1";

type Vraag = { key: string; vraag: string; hint: string; type?: "text" | "keuze"; opties?: string[] };
type Stap = { titel: string; vragen: Vraag[] };

// 24 september 2026 (Marinus): "het is toch mega simpel". Alleen wat nodig is om te bellen en een
// goede basissite te maken: de huidige site, een site die ze mooi vinden, en waar ze nu tegenaan lopen.
const STAPPEN: Stap[] = [
  { titel: "Je website", vragen: [
    { key: "website", vraag: "Huidige website", hint: "Plak de link. Leeg laten als je nog geen site hebt.", type: "text" },
    { key: "voorbeeld", vraag: "Een website die je mega mooi vindt", hint: "Plak de link. Mag uit elke branche komen.", type: "text" },
    { key: "nietgoed", vraag: "Waar loop je tegenaan met je huidige site?", hint: "Verouderd, traag, niet vindbaar, levert geen aanvragen op, past niet meer bij je." },
    { key: "wat", vraag: "Wat doet je bedrijf, in één zin?", hint: "Bijvoorbeeld: wij installeren zonnepanelen voor bedrijven in de regio Utrecht." },
  ]},
];

type Gegevens = { voornaam: string; achternaam: string; bedrijf: string; email: string; mobiel: string };

function laad(): { a: Record<string, string>; g: Gegevens } {
  try { const j = JSON.parse(localStorage.getItem(OPSLAG) || "null"); if (j && j.a && j.g && "voornaam" in j.g) return j; } catch {}
  return { a: {}, g: { voornaam: "", achternaam: "", bedrijf: "", email: "", mobiel: "" } };
}

export default function GratisWebsite() {
  const { language, t } = useLanguage();
  const [a, setA] = useState<Record<string, string>>({});
  const [g, setG] = useState<Gegevens>({ voornaam: "", achternaam: "", bedrijf: "", email: "", mobiel: "" });
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  useEffect(() => { const x = laad(); setA(x.a); setG(x.g); }, []);
  useEffect(() => { try { localStorage.setItem(OPSLAG, JSON.stringify({ a, g })); } catch {} }, [a, g]);

  const zet = (k: string, v: string) => setA((x) => ({ ...x, [k]: v }));
  // Voortgang zoals in de vaste onboarding: hoeveel velden er ingevuld zijn, gegevens meegeteld.
  const alle = STAPPEN.flatMap((s) => s.vragen);
  const gevuld = alle.filter((v) => (a[v.key] || "").trim()).length + [g.voornaam, g.achternaam, g.bedrijf, g.email, g.mobiel].filter((x) => x.trim()).length;
  const procent = Math.round((gevuld / (alle.length + 5)) * 100);
  const naam = `${g.voornaam.trim()} ${g.achternaam.trim()}`.trim();

  const verstuur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bezig) return;
    if (!g.voornaam.trim()) { setFout(t("Vul je naam in.")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim())) { setFout(t("Dat e-mailadres klopt nog niet.")); return; }
    if (g.mobiel.replace(/\D/g, "").length < 8) { setFout(t("Vul je telefoonnummer in, dan bellen we je.")); return; }
    setFout(""); setBezig(true);
    const antwoorden = STAPPEN.flatMap((s) => s.vragen).map((v) => ({ vraag: v.vraag, antwoord: (a[v.key] || "").trim() })).filter((x) => x.antwoord);
    try {
      const r = await fetch(AANMELD_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bron: "website", naam, email: g.email.trim(), mobiel: g.mobiel.trim(), bedrijf: g.bedrijf.trim(), website: a.website || "", taal: language, antwoorden, voorwaarden: LEGAL_VERSION }),
        signal: AbortSignal.timeout(10000),
      });
      const j = await r.json().catch(() => null);
      if (!r.ok || !j?.ok) { setFout(t(String(j?.error || "Het versturen lukte niet. Probeer het zo nog eens."))); setBezig(false); return; }
      try { localStorage.removeItem(OPSLAG); } catch {}
      setKlaar(true);
    } catch { setFout(t("Het versturen lukte niet. Probeer het zo nog eens.")); }
    setBezig(false);
  };

  if (klaar) return (
    <section className="gw gw-klaar"><div className="gw-sheet">
      <span className="gw-vink"><Check size={30} /></span>
      <h1>Top, we bellen je.</h1>
      <p className="gw-lead">We gaan vandaag met je antwoorden aan de slag. Je ziet je nieuwe website nog dezelfde dag, live op de beurs op stand C21.</p>
      <a className="gw-os" href={CLAIM_URL}>
        <span><small>Wachten?</small>Probeer alvast ons gratis persoonlijke OS</span>
        <ArrowUpRight size={20} />
      </a>
    </div></section>
  );

  const veld = (v: Vraag) => (
    <label className="gw-fld" key={v.key} htmlFor={v.type === "keuze" ? undefined : `gw-${v.key}`}>
      <span className="gw-l">{t(v.vraag)}</span>
      <span className="gw-h">{t(v.hint)}</span>
      {v.type === "keuze" ? (
        <span className="gw-keuzes" role="radiogroup" aria-label={t(v.vraag)}>
          {v.opties!.map((o) => (
            <button type="button" key={o} role="radio" aria-checked={a[v.key] === o} className={a[v.key] === o ? "is-aan" : undefined} onClick={() => zet(v.key, a[v.key] === o ? "" : o)}>{t(o)}</button>
          ))}
        </span>
      ) : v.type === "text" ? (
        <input id={`gw-${v.key}`} value={a[v.key] || ""} maxLength={200} onChange={(e) => zet(v.key, e.target.value)} />
      ) : (
        <textarea id={`gw-${v.key}`} rows={3} value={a[v.key] || ""} maxLength={1500} onChange={(e) => zet(v.key, e.target.value)} />
      )}
    </label>
  );

  return (
    <div className="gw">
      <div className="gw-sheet">
        <p className="gw-eyebrow">Gratis website-upgrade / Odoo Experience, stand C21</p>
        <h1>Je nieuwe website. <span className="gw-accent">Gratis.</span></h1>
        <p className="gw-lead">Twee minuten. Wij bellen je en je ziet je nieuwe site dezelfde dag live op de beurs.</p>
        <div className="gw-progress" aria-label={t("Voortgang")}>
          <div className="gw-bar"><div className="gw-fill" style={{ width: `${procent}%` }} /></div>
          <div className="gw-meta"><span><i className="gw-dot" />Automatisch bewaard</span><span>{procent}%</span></div>
        </div>
        <form onSubmit={verstuur} noValidate>
          <section className="gw-sec">
            <div className="gw-sec-head"><span className="gw-num">01</span><h2>Jij</h2></div>
            <div className="gw-card">
              <div className="gw-rij">
                <label className="gw-fld" htmlFor="gw-voornaam"><span className="gw-l">Voornaam</span><input id="gw-voornaam" autoComplete="given-name" maxLength={40} value={g.voornaam} onChange={(e) => setG({ ...g, voornaam: e.target.value })} /></label>
                <label className="gw-fld" htmlFor="gw-achternaam"><span className="gw-l">Achternaam</span><input id="gw-achternaam" autoComplete="family-name" maxLength={40} value={g.achternaam} onChange={(e) => setG({ ...g, achternaam: e.target.value })} /></label>
              </div>
              <div className="gw-rij">
                <label className="gw-fld" htmlFor="gw-email"><span className="gw-l">E-mailadres</span><input id="gw-email" type="email" autoComplete="email" inputMode="email" maxLength={254} value={g.email} onChange={(e) => setG({ ...g, email: e.target.value })} /></label>
                <label className="gw-fld" htmlFor="gw-mobiel"><span className="gw-l">Telefoonnummer</span><input id="gw-mobiel" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={g.mobiel} onChange={(e) => setG({ ...g, mobiel: e.target.value })} /></label>
              </div>
              <label className="gw-fld" htmlFor="gw-bedrijf"><span className="gw-l">Bedrijfsnaam</span><input id="gw-bedrijf" autoComplete="organization" maxLength={120} value={g.bedrijf} onChange={(e) => setG({ ...g, bedrijf: e.target.value })} /></label>
            </div>
          </section>
          <section className="gw-sec">
            <div className="gw-sec-head"><span className="gw-num">02</span><h2>Je website</h2></div>
            <div className="gw-card">
              <div className="gw-rij">{STAPPEN[0].vragen.slice(0, 2).map(veld)}</div>
              {STAPPEN[0].vragen.slice(2).map(veld)}
            </div>
            <p className="gw-juridisch">Met versturen ga je akkoord met onze <a href="/voorwaarden/">algemene voorwaarden</a> en ons <a href="/privacy/">privacybeleid</a>.</p>
            {fout ? <p className="gw-fout" role="alert">{fout}</p> : null}
            <button type="submit" className="gw-verder" disabled={bezig}>
              {bezig ? t("Even geduld…") : t("Verstuur en claim je website")} <ArrowUpRight size={16} />
            </button>
          </section>
        </form>
        <a className="gw-os" href={CLAIM_URL}>
          <span><small>Liever eerst zelf kijken?</small>Probeer ons gratis persoonlijke OS</span>
          <ArrowUpRight size={20} />
        </a>
      </div>
    </div>
  );
}
