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

const STAPPEN: Stap[] = [
  { titel: "Jij en je bedrijf", vragen: [
    { key: "bedrijf", vraag: "Hoe heet je bedrijf?", hint: "Zoals je hem zelf schrijft.", type: "text" },
    { key: "website", vraag: "Wat is je huidige website?", hint: "Plak de link. Leeg laten als je nog geen site hebt.", type: "text" },
    { key: "nietgoed", vraag: "Wat vind je nu niet goed aan je huidige site?", hint: "Alles mag: verouderd, traag, niet vindbaar, levert geen aanvragen op, past niet meer bij je." },
    { key: "voorbeeld", vraag: "Welke website vind je mega mooi?", hint: "Plak de link. Mag uit elke branche komen; hier gaan we op letten.", type: "text" },
    { key: "wat", vraag: "Wat doe je, in één of twee zinnen?", hint: "Bijvoorbeeld: wij installeren zonnepanelen voor bedrijven in de regio Utrecht." },
    { key: "anders", vraag: "Wat maakt jou anders dan de rest?", hint: "Waarom kiezen klanten voor jou en niet voor de buurman?" },
  ]},
  { titel: "Je aanbod en je klant", vragen: [
    { key: "aanbod", vraag: "Wat verkoop je, en waar begint een nieuwe klant meestal mee?", hint: "Je belangrijkste diensten of producten, eventueel met prijzen." },
    { key: "klant", vraag: "Wie is je ideale klant?", hint: "Branche, regio, grootte. Mag ook: voor wie juist niet." },
    { key: "twijfel", vraag: "Waar twijfelt iemand over vlak voordat hij koopt of belt?", hint: "Prijs, tijd, of het wel bij hem past. Dit halen we op de site weg." },
    { key: "zeggen", vraag: "Wat zeggen klanten na afloop tegen je?", hint: "Letterlijk als het kan. Daar komen de beste teksten vandaan." },
  ]},
  { titel: "Wat de site moet doen", vragen: [
    { key: "actie", vraag: "Wat moet een bezoeker vooral doen?", hint: "Kies wat het belangrijkst is.", type: "keuze", opties: ["Bellen of WhatsAppen", "Een offerte aanvragen", "Een afspraak maken", "Iets kopen", "Contact opnemen via een formulier"] },
    { key: "op", vraag: "Wat moet er zeker op de site staan?", hint: "Bijvoorbeeld: diensten, prijzen, reviews, werkgebied, openingstijden, team." },
    { key: "stijl", vraag: "Welke kant mag het op?", hint: "Nog niks vast, kies je onderbuik.", type: "keuze", opties: ["Strak en zakelijk", "Warm en persoonlijk", "Donker en premium"] },
    { key: "merk", vraag: "Heb je al een logo en vaste kleuren?", hint: "Ja of nee is genoeg. Heb je ze, dan halen we ze van je huidige site of vragen we ze bij het bellen." },
  ]},
];

type Gegevens = { naam: string; email: string; mobiel: string };

function laad(): { a: Record<string, string>; g: Gegevens } {
  try { const j = JSON.parse(localStorage.getItem(OPSLAG) || "null"); if (j && j.a && j.g) return j; } catch {}
  return { a: {}, g: { naam: "", email: "", mobiel: "" } };
}

export default function GratisWebsite() {
  const { language, t } = useLanguage();
  const [a, setA] = useState<Record<string, string>>({});
  const [g, setG] = useState<Gegevens>({ naam: "", email: "", mobiel: "" });
  const [stap, setStap] = useState(0);
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  useEffect(() => { const x = laad(); setA(x.a); setG(x.g); }, []);
  useEffect(() => { try { localStorage.setItem(OPSLAG, JSON.stringify({ a, g })); } catch {} }, [a, g]);

  const laatste = STAPPEN.length; // de laatste stap zijn je gegevens
  const zet = (k: string, v: string) => setA((x) => ({ ...x, [k]: v }));
  const volgende = () => { setFout(""); setStap((s) => Math.min(laatste, s + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const vorige = () => { setFout(""); setStap((s) => Math.max(0, s - 1)); };

  const verstuur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bezig) return;
    if (!g.naam.trim()) { setFout(t("Vul je naam in.")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim())) { setFout(t("Dat e-mailadres klopt nog niet.")); return; }
    if (g.mobiel.replace(/\D/g, "").length < 8) { setFout(t("Vul je telefoonnummer in, dan bellen we je.")); return; }
    setFout(""); setBezig(true);
    const antwoorden = STAPPEN.flatMap((s) => s.vragen).map((v) => ({ vraag: v.vraag, antwoord: (a[v.key] || "").trim() })).filter((x) => x.antwoord);
    try {
      const r = await fetch(AANMELD_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bron: "website", naam: g.naam.trim(), email: g.email.trim(), mobiel: g.mobiel.trim(), bedrijf: a.bedrijf || "", website: a.website || "", taal: language, antwoorden, voorwaarden: LEGAL_VERSION }),
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
    <section className="h-wrap gw gw-klaar">
      <span className="gw-vink"><Check size={30} /></span>
      <h1>Top, we bellen je.</h1>
      <p className="gw-intro">We gaan vandaag met je antwoorden aan de slag. Je ziet je nieuwe website nog dezelfde dag, live op de beurs op stand C21.</p>
      <a className="gw-os" href={CLAIM_URL}>
        <span><small>Wachten?</small>Probeer alvast ons gratis persoonlijke OS</span>
        <ArrowUpRight size={20} />
      </a>
    </section>
  );

  return (
    <section className="h-wrap gw">
      <p className="h-eyebrow"><i /> Gratis website-upgrade / Odoo Experience, stand C21</p>
      <h1>Je nieuwe website. <span>Gratis.</span></h1>
      <p className="gw-intro">Een paar vragen, vijf minuten. Wij bellen je en je ziet je nieuwe site dezelfde dag live op de beurs. Niets is verplicht behalve je gegevens, en alles wordt tussendoor bewaard.</p>
      <ol className="gw-strepen" aria-label={t("Voortgang")}>
        {[...STAPPEN.map((s) => s.titel), "Je gegevens"].map((titel, i) => (
          <li key={titel} className={i <= stap ? "is-aan" : undefined}><span>0{i + 1}</span> {t(titel)}</li>
        ))}
      </ol>
      <form className="gw-kaart" onSubmit={stap === laatste ? verstuur : (e) => { e.preventDefault(); volgende(); }} noValidate>
        {stap < laatste ? STAPPEN[stap].vragen.map((v) => (
          <div className="gw-vraag" key={v.key}>
            <label htmlFor={`gw-${v.key}`}>{t(v.vraag)}</label>
            <small>{t(v.hint)}</small>
            {v.type === "keuze" ? (
              <div className="gw-keuzes" role="radiogroup" aria-label={t(v.vraag)}>
                {v.opties!.map((o) => (
                  <button type="button" key={o} role="radio" aria-checked={a[v.key] === o} className={a[v.key] === o ? "is-aan" : undefined} onClick={() => zet(v.key, a[v.key] === o ? "" : o)}>{t(o)}</button>
                ))}
              </div>
            ) : v.type === "text" ? (
              <input id={`gw-${v.key}`} value={a[v.key] || ""} maxLength={200} onChange={(e) => zet(v.key, e.target.value)} />
            ) : (
              <textarea id={`gw-${v.key}`} rows={3} value={a[v.key] || ""} maxLength={1500} onChange={(e) => zet(v.key, e.target.value)} />
            )}
          </div>
        )) : (
          <>
            <h2>Waar kunnen we je bellen?</h2>
            <div className="gw-vraag"><label htmlFor="gw-naam">Je naam</label><input id="gw-naam" autoComplete="name" maxLength={80} value={g.naam} onChange={(e) => setG({ ...g, naam: e.target.value })} /></div>
            <div className="gw-vraag"><label htmlFor="gw-email">E-mailadres</label><input id="gw-email" type="email" autoComplete="email" inputMode="email" maxLength={254} value={g.email} onChange={(e) => setG({ ...g, email: e.target.value })} /></div>
            <div className="gw-vraag"><label htmlFor="gw-tel">Telefoonnummer</label><small>We bellen je vandaag nog.</small><input id="gw-tel" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={g.mobiel} onChange={(e) => setG({ ...g, mobiel: e.target.value })} /></div>
            <p className="gw-juridisch">Met versturen ga je akkoord met onze <a href="/voorwaarden/">algemene voorwaarden</a> en ons <a href="/privacy/">privacybeleid</a>.</p>
          </>
        )}
        {fout ? <p className="gw-fout" role="alert">{fout}</p> : null}
        <div className="gw-knoppen">
          {stap > 0 ? <button type="button" className="gw-terug" onClick={vorige}>Terug</button> : <span />}
          <button type="submit" className="gw-verder" disabled={bezig}>
            {bezig ? t("Even geduld…") : stap === laatste ? t("Verstuur en claim je website") : t("Volgende")} <ArrowUpRight size={16} />
          </button>
        </div>
      </form>
      <a className="gw-os" href={CLAIM_URL}>
        <span><small>Liever eerst zelf kijken?</small>Probeer ons gratis persoonlijke OS</span>
        <ArrowUpRight size={20} />
      </a>
    </section>
  );
}
