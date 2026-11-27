import SpraakKnop from "./SpraakKnop";
import GrowthDealSticker from "./GrowthDealSticker";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { aanvraagWhatsApp, heeftWhatsApp, whatsappLink } from "./aanvragen";
import { people } from "./content";
import { klein } from "./licht";
import BlackFridayBlok from "./BlackFridayBlok";
import BlackFridayKop, { ShowcaseKop } from "./BlackFridayKop";
import "./header-algemeen.css";
import "./home-enthousiast.css";
import "./gratis-website-wit.css";

// 28 september 2026: de beurs is voorbij. De gratis demowebsite blijft (zie /prijzen), zonder stand C21 en live bouwen.
// 4 november 2026 (Marinus): "onboarding graag op een witte pagina met mooiere voorbeelden en leuker om in te vullen." Dus wit
// (wit = mens), één vraag per stap, echte voorbeelden van ons werk om uit te kiezen en klikbare antwoorden in plaats van lege
// vakken. Voorbeelden staan alleen als grijze hint in een veld, nooit als ingevulde data. Liever praten: Steef, direct (mensroute).
// De aanvraag gaat zoals altijd als ingevuld bericht naar Steef (aanvragen.ts).

const OPSLAG = "sn-gratis-website-v2";
// 4 november 2026 (Marinus): "ik wil die oude kWh site niet meer zien". kWh Garant staat hier niet meer tussen.
const STIJLEN = [
  { id: "vastiq", naam: "VASTIQ", wat: "Strak en zakelijk", beeld: "/images/cases/vastiq-desktop.webp" },
  { id: "vdz", naam: "VDZ Brigade", wat: "Stoer en vakkundig", beeld: "/images/cases/vdz-brigade-desktop.webp" },
  { id: "ilgordo", naam: "Il Gordo", wat: "Warm en sfeervol", beeld: "/images/cases/ilgordo-desktop.webp" },
  // 27 november 2026 (Marinus): "Hier mogen nog meer websites staan doe ook maar de Black.." Vijf websites erbij, waaronder NEW BLACK.
  { id: "newblack", naam: "NEW BLACK", wat: "Luxe en internationaal", beeld: "/screenshots/newblack-hero.webp" },
  { id: "divine", naam: "Divine Machines", wat: "Fris en productgericht", beeld: "/screenshots/divine-machines-hero.webp" },
  { id: "primefone", naam: "Primefone", wat: "Helder en verkopend", beeld: "/screenshots/primefone-hero.webp" },
  { id: "raveg", naam: "RAVEG", wat: "Zacht en premium", beeld: "/screenshots/raveg-bounce-hero.webp" },
  { id: "vintage", naam: "Vintage Watches", wat: "Klassiek en exclusief", beeld: "/screenshots/vintage-watches-hero.webp" },
];
// 27 november 2026 (Marinus): "Verder 6 vragen 10 vragen van maken en iets over branding ook erbij." Vier nieuwe vragen, simpel en
// zonder vaktermen: wat je deze december wilt, hoe je merk er nu bij staat, hoe het moet voelen, en waar je wilt adverteren.
const DEAL = ["Gratis websitedemo", "Rebranding", "Ad creatives"];
const MERK_NU = ["Logo en huisstijl zijn klaar", "Het mag frisser", "We beginnen vanaf nul"];
const MERK_GEVOEL = ["Zakelijk", "Luxe", "Speels", "Stoer", "Warm", "Modern", "Duurzaam", "Vertrouwd"];
const KANALEN = ["Instagram", "Facebook", "LinkedIn", "TikTok", "Google", "YouTube", "Weet ik nog niet"];
const DOELEN = ["Meer aanvragen", "Professioneler uitstralen", "Beter vindbaar in Google", "Online verkopen", "Afspraken laten maken", "Vacatures vullen"];

// 4 november 2026 (Marinus): "die website-onboarding waarbij ze nog de persoon kunnen aanvinken via wie ze daar zijn gekomen". Wie
// de lead aanbracht, telt voor de vergoeding. De mensen uit het team die klanten aanbrengen (leiding en Partnerships, content.ts),
// plus Iemand anders en Zelf gevonden. Een eigen deellink vult de keuze vooraf in: /gratis-website?ref=ben (voornaam, of de
// volledige naam met streepjes). De keuze gaat mee in het bericht als "Aangebracht door" (aanvragen.ts).
const AANBRENGERS = ["Marinus Bergsma", "Steef Komen", "Michelle Yang", "Ben Sterckx", "Fabiana Abauna", "Elian Coellar", "Aron", "Youri van der Donk", "Pieter Bergsma", "Isaak Munster", "Ruben Spyckerelle"]
  .map((naam) => people.find((p) => p.name === naam)).filter((p): p is (typeof people)[number] => !!p);
const ANDERS = "anders", ZELF = "zelf";
const sleutel = (tekst: string) => tekst.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, "-");
function uitRef(ref: string | null): string {
  if (!ref) return "";
  const r = sleutel(ref);
  return AANBRENGERS.find((p) => sleutel(p.name) === r || sleutel(p.name.split(" ")[0]) === r)?.name || "";
}

type Antwoorden = { deal: string[]; merkNu: string; gevoel: string[]; kanalen: string[]; via: string; viaAnders: string; wat: string; stijlen: string[]; link: string; doelen: string[]; anders: string; website: string; voornaam: string; achternaam: string; bedrijf: string; email: string; mobiel: string };
const LEEG: Antwoorden = { deal: [...DEAL], merkNu: "", gevoel: [], kanalen: [], via: "", viaAnders: "", wat: "", stijlen: [], link: "", doelen: [], anders: "", website: "", voornaam: "", achternaam: "", bedrijf: "", email: "", mobiel: "" };
function laad(): Antwoorden {
  try { const j = JSON.parse(localStorage.getItem(OPSLAG) || "null"); if (j && typeof j === "object" && Array.isArray(j.stijlen)) return { ...LEEG, ...j, deal: Array.isArray(j.deal) ? j.deal : LEEG.deal, gevoel: Array.isArray(j.gevoel) ? j.gevoel : [], kanalen: Array.isArray(j.kanalen) ? j.kanalen : [] }; } catch {}
  return LEEG;
}


export default function GratisWebsite() {
  // 27 november 2026 (Marinus): "misschien als sectie kaart over de onboarding laten schuiven als je verder scrollt." Het formulier blijft
  // staan (sticky) met zijn onderkant in beeld, de zwarte showcase-kaart schuift eroverheen.
  const vel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = vel.current;
    if (!el) return;
    const zet = () => el.style.setProperty("--vel-top", `${Math.min(0, window.innerHeight - el.offsetHeight)}px`);
    zet();
    const ro = new ResizeObserver(zet);
    ro.observe(el);
    window.addEventListener("resize", zet);
    return () => { ro.disconnect(); window.removeEventListener("resize", zet); };
  }, []);
  const { language, t } = useLanguage();
  const [a, zetA] = useState<Antwoorden>(LEEG);
  const [stap, zetStap] = useState(0);
  const [geladen, zetGeladen] = useState(false);
  const [fout, zetFout] = useState("");
  const [verstuurd, zetVerstuurd] = useState("");
  useEffect(() => {
    const opgeslagen = laad();
    const ref = uitRef(new URLSearchParams(window.location.search).get("ref"));
    zetA(ref ? { ...opgeslagen, via: ref } : opgeslagen);
    zetGeladen(true);
  }, []);
  useEffect(() => { if (geladen) try { localStorage.setItem(OPSLAG, JSON.stringify(a)); } catch {} }, [a, geladen]);
  const zet = <K extends keyof Antwoorden>(k: K, v: Antwoorden[K]) => zetA((x) => ({ ...x, [k]: v }));
  const wissel = (k: "stijlen" | "doelen" | "deal" | "gevoel" | "kanalen", v: string) => zet(k, a[k].includes(v) ? a[k].filter((x) => x !== v) : [...a[k], v]);

  const STAPPEN = ["Wat doet je bedrijf?", "Wat wil je deze december?", "Welke stijl spreekt je aan?", "Wat moet je website vooral doen?", "Heb je al een website?",
    "Hoe staat je merk er nu bij?", "Hoe moet je merk voelen?", "Waar wil je adverteren?", "Via wie ben je bij ons gekomen?", "Hoe bereiken we je?"];
  // Vaste nummers per vraag, zodat de volgorde op één plek staat.
  const S = { wat: 0, deal: 1, stijl: 2, doel: 3, site: 4, merkNu: 5, gevoel: 6, kanalen: 7, via: 8, contact: 9 };
  const laatste = STAPPEN.length - 1;
  const controle = () => {
    if (stap === S.wat && !a.wat.trim()) return t("Vertel in één zin wat je bedrijf doet.");
    if (stap === S.deal && !a.deal.length) return t("Kies minstens één onderdeel.");
    if (stap === S.via && !a.via) return t("Kies via wie je bij ons kwam.");
    if (stap === S.via && a.via === ANDERS && !a.viaAnders.trim()) return t("Vul in via wie je bij ons kwam.");
    if (stap === laatste) {
      if (!a.voornaam.trim() || !a.achternaam.trim()) return t("Vul je voor- en achternaam in.");
      if (!a.bedrijf.trim()) return t("Vul je bedrijfsnaam in.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email.trim())) return t("Dat e-mailadres klopt nog niet.");
    }
    return "";
  };
  const verder = (e: React.FormEvent) => {
    e.preventDefault();
    const melding = controle();
    zetFout(melding);
    if (melding) return;
    if (stap < laatste) { zetStap(stap + 1); return; }
    const voorbeeld = [...a.stijlen.map((id) => STIJLEN.find((s) => s.id === id)?.naam || id), a.link.trim()].filter(Boolean).join(", ");
    const nietgoed = [...a.doelen.map((d) => t(d)), a.anders.trim()].filter(Boolean).join(". ");
    const via = a.via === ZELF ? t("Niemand, zelf gevonden") : a.via === ANDERS ? `${t("Iemand anders")}: ${a.viaAnders.trim()}` : a.via;
    const adres = aanvraagWhatsApp("website", language, { via, voornaam: a.voornaam, achternaam: a.achternaam, bedrijf: a.bedrijf, email: a.email, mobiel: a.mobiel, website: a.website, voorbeeld, wat: a.wat, nietgoed,
      extra: [[t("Black Friday Deal"), a.deal.map((x) => t(x)).join(", ")], [t("Merk nu"), a.merkNu ? t(a.merkNu) : ""], [t("Gevoel van het merk"), a.gevoel.map((x) => t(x)).join(", ")], [t("Adverteren op"), a.kanalen.map((x) => t(x)).join(", ")]] });
    zetVerstuurd(adres);
    // Droog in proeven en previews: geautomatiseerde browsers en ?proef in het adres openen nooit een echte mail of WhatsApp.
    if (navigator.webdriver || new URLSearchParams(window.location.search).has("proef")) return;
    window.location.href = adres;
  };

  const naarShowcase = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const doel = document.getElementById("showcase");
    if (!doel) return;
    e.preventDefault();
    doel.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const naarStart = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const doel = document.getElementById("onboarding");
    if (!doel) return;
    e.preventDefault();
    doel.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return <>
    <section className="sn-alg gw2-kop" aria-labelledby="gw2-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst">
          <GrowthDealSticker />
          <p className="sn-alg-label"><i />Black Friday Deal</p>
          {/* 27 november 2026 (Marinus): "De COPY MOET VEEL BETER AANSLUITEN OP de video zelf, we doen namelijk veel meer dan alleen de
              websites." Kop en uitleg volgen nu de Black Friday-film. */}
          {/* 27 november 2026 (Marinus): kop zoals de film, in kapitalen met AI-muisjes (BlackFridayKop.tsx). */}
          <BlackFridayKop />
          {/* 4 november 2026 (avond, Marinus): "Vraag een veiligheidsrapport aan of krijg een gratis demo van een moderne website op maat." */}
          <p className="sn-alg-uitleg"><strong>Heel december, alleen voor bedrijven die serieus zijn over groei.</strong> Bij SocialNow werken AI en menselijke experts samen aan de groei van jouw bedrijf. Naast onze gratis websitedemo krijg je deze maand ook rebranding en ad creatives gratis erbij.</p>
          {/* 27 november 2026 (Marinus): "Verder Plan een Cal mag verder weg." Alleen de link naar de onboarding blijft; Plan een
              call staat nog in de zwevende balk rechtsonder. */}
          {/* 27 november 2026 (Marinus): "een bekijk Showcase knop ... of een Vraag jouw Gratis Demo Pakket aan. 2 knoppen." */}
          <div className="sn-alg-acties gw2-held-knoppen">
            {/* 27 nov (Marinus): "Graag hier gwn FREE GROWTH PACKAGE! Grote knop en daaronder klein BEKIJK DE SHOWCASE" */}
            <a className="sn-pill gw2-groot" href="#onboarding" onClick={naarStart}><span translate="no">Free Growth Package!</span><ArrowUpRight size={22} aria-hidden="true" /></a>
            <a className="gw2-klein-link" href="#showcase" onClick={naarShowcase}>Bekijk de showcase<ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
        {/* 27 november 2026 (Marinus): de twee websitetegels maken plaats voor het Black Friday-blok: logo, countdown en rijen werk. */}
        <BlackFridayBlok />
      </div>
    </section>
    <div className="gw2" id="onboarding"><div className="gw2-vel" ref={vel}>
    <div className="gw2-voortgang" aria-hidden="true">{STAPPEN.map((_, i) => <span key={i} className={i <= stap ? "aan" : ""} />)}</div>

    <form className="gw2-kaart" onSubmit={verder} noValidate>
      <p className="gw2-stap">Vraag {stap + 1} van {STAPPEN.length}</p>
      <h2>{STAPPEN[stap]}</h2>

      {stap === S.wat && <label className="gw2-veld"><span className="gw2-verborgen">{STAPPEN[0]}</span>
        <div className="gw2-spraak-veld"><textarea rows={3} maxLength={600} value={a.wat} onChange={(e) => zet("wat", e.target.value)} placeholder="Bijvoorbeeld: wij installeren zonnepanelen voor bedrijven in de regio Utrecht." /><SpraakKnop tekst={a.wat} zet={(t) => zet("wat", t.slice(0, 600))} /></div>
        <p className="gw2-spraak-tip">Liever praten? Tik op de microfoon en vertel het.</p>
      </label>}

      {stap === S.deal && <>
        <p className="gw2-uitleg">Heel december krijg je ze alle drie gratis. Haal weg wat je niet nodig hebt.</p>
        <div className="gw2-chips">{DEAL.map((d) => <label key={d} className={`gw2-chip${a.deal.includes(d) ? " aan" : ""}`}>
          <input type="checkbox" checked={a.deal.includes(d)} onChange={() => wissel("deal", d)} /><Check size={14} aria-hidden="true" /><span>{d}</span>
        </label>)}</div>
      </>}

      {stap === S.merkNu && <>
        <p className="gw2-uitleg">Je merk is je naam, logo, kleuren en hoe je overkomt.</p>
        <div className="gw2-chips">{MERK_NU.map((d) => <label key={d} className={`gw2-chip${a.merkNu === d ? " aan" : ""}`}>
          <input type="radio" name="gw2-merknu" checked={a.merkNu === d} onChange={() => zet("merkNu", d)} /><Check size={14} aria-hidden="true" /><span>{d}</span>
        </label>)}</div>
      </>}

      {stap === S.gevoel && <>
        <p className="gw2-uitleg">Kies er gerust meer. Zo maken we iets dat bij je past.</p>
        <div className="gw2-chips">{MERK_GEVOEL.map((d) => <label key={d} className={`gw2-chip${a.gevoel.includes(d) ? " aan" : ""}`}>
          <input type="checkbox" checked={a.gevoel.includes(d)} onChange={() => wissel("gevoel", d)} /><Check size={14} aria-hidden="true" /><span>{d}</span>
        </label>)}</div>
      </>}

      {stap === S.kanalen && <>
        <p className="gw2-uitleg">Hier maken we je ad creatives voor. Kies er gerust meer.</p>
        <div className="gw2-chips">{KANALEN.map((d) => <label key={d} className={`gw2-chip${a.kanalen.includes(d) ? " aan" : ""}`}>
          <input type="checkbox" checked={a.kanalen.includes(d)} onChange={() => wissel("kanalen", d)} /><Check size={14} aria-hidden="true" /><span>{d}</span>
        </label>)}</div>
      </>}

      {stap === S.stijl && <>
        <p className="gw2-uitleg">Kies er gerust meer. Dit is werk dat we eerder maakten.</p>
        <div className="gw2-stijlen">{STIJLEN.map((s) => <label key={s.id} className={`gw2-stijl${a.stijlen.includes(s.id) ? " aan" : ""}`}>
          <input type="checkbox" checked={a.stijlen.includes(s.id)} onChange={() => wissel("stijlen", s.id)} />
          <span className="gw2-stijl-beeld"><img src={s.beeld} alt="" loading="lazy" /><i aria-hidden="true"><Check size={16} /></i></span>
          <strong translate="no">{s.naam}</strong><span>{s.wat}</span>
        </label>)}</div>
        <label className="gw2-veld"><span>Of plak een website die je mooi vindt <em>(optioneel)</em></span>
          <input value={a.link} maxLength={200} inputMode="url" autoCapitalize="none" autoCorrect="off" onChange={(e) => zet("link", e.target.value)} placeholder="https://" />
        </label>
      </>}

      {stap === S.doel && <>
        <div className="gw2-chips">{DOELEN.map((d) => <label key={d} className={`gw2-chip${a.doelen.includes(d) ? " aan" : ""}`}>
          <input type="checkbox" checked={a.doelen.includes(d)} onChange={() => wissel("doelen", d)} /><Check size={14} aria-hidden="true" /><span>{d}</span>
        </label>)}</div>
        <label className="gw2-veld"><span>Nog iets wat je mist? <em>(optioneel)</em></span>
          <div className="gw2-spraak-veld"><textarea rows={2} maxLength={800} value={a.anders} onChange={(e) => zet("anders", e.target.value)} placeholder="Bijvoorbeeld: klanten moeten makkelijk een offerte kunnen aanvragen." /><SpraakKnop tekst={a.anders} zet={(t) => zet("anders", t.slice(0, 800))} /></div>
        </label>
      </>}

      {stap === S.site && <label className="gw2-veld"><span>Link naar je huidige website <em>(optioneel)</em></span>
        <input value={a.website} maxLength={200} inputMode="url" autoCapitalize="none" autoCorrect="off" onChange={(e) => zet("website", e.target.value)} placeholder="https://" />
        <small>Nog geen website? Laat dit leeg, dan beginnen we vanaf nul.</small>
      </label>}

      {stap === S.via && <>
        <p className="gw2-uitleg">Zo weten we wie we mogen bedanken.</p>
        <div className="gw2-mensen">{AANBRENGERS.map((p) => <label key={p.name} className={`gw2-mens${a.via === p.name ? " aan" : ""}`}>
          <input type="radio" name="gw2-via" checked={a.via === p.name} onChange={() => zet("via", p.name)} />
          <img {...klein(p.image, "48px", [96, 160])} alt="" width="48" height="48" loading="lazy" />
          <span><strong translate="no">{p.name}</strong><small>{p.role}</small></span>
          <i aria-hidden="true"><Check size={14} /></i>
        </label>)}</div>
        <div className="gw2-chips gw2-via-rest">
          <label className={`gw2-chip${a.via === ANDERS ? " aan" : ""}`}><input type="radio" name="gw2-via" checked={a.via === ANDERS} onChange={() => zet("via", ANDERS)} /><Check size={14} aria-hidden="true" /><span>Iemand anders</span></label>
          <label className={`gw2-chip${a.via === ZELF ? " aan" : ""}`}><input type="radio" name="gw2-via" checked={a.via === ZELF} onChange={() => zet("via", ZELF)} /><Check size={14} aria-hidden="true" /><span>Niemand, zelf gevonden</span></label>
        </div>
        {a.via === ANDERS && <label className="gw2-veld"><span>Anders, namelijk</span><input maxLength={120} value={a.viaAnders} onChange={(e) => zet("viaAnders", e.target.value)} /></label>}
      </>}

      {stap === S.contact && <>
        <div className="gw2-rij">
          <label className="gw2-veld"><span>Voornaam</span><input autoComplete="given-name" maxLength={40} value={a.voornaam} onChange={(e) => zet("voornaam", e.target.value)} /></label>
          <label className="gw2-veld"><span>Achternaam</span><input autoComplete="family-name" maxLength={40} value={a.achternaam} onChange={(e) => zet("achternaam", e.target.value)} /></label>
        </div>
        <label className="gw2-veld"><span>Bedrijfsnaam</span><input autoComplete="organization" maxLength={120} value={a.bedrijf} onChange={(e) => zet("bedrijf", e.target.value)} /></label>
        <div className="gw2-rij">
          <label className="gw2-veld"><span>E-mailadres</span><input type="email" autoComplete="email" inputMode="email" maxLength={254} value={a.email} onChange={(e) => zet("email", e.target.value)} /></label>
          <label className="gw2-veld"><span>Telefoonnummer <em>(optioneel)</em></span><input type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={a.mobiel} onChange={(e) => zet("mobiel", e.target.value)} /></label>
        </div>
        <p className="gw2-klein">{heeftWhatsApp ? "Je aanvraag opent WhatsApp met al je antwoorden. Verstuur het bericht daar zelf naar Steef." : "Je aanvraag opent je e-mailapp met al je antwoorden. Verstuur de mail daar zelf naar Steef."} Lees ons <a href={`${languagePrefix(language)}/privacy/`}>privacybeleid</a>.</p>
      </>}

      {verstuurd && <p className="gw2-klaar" role="status">{heeftWhatsApp ? "WhatsApp opent met je aanvraag. Verstuur het bericht daar, dan nemen we contact op." : "Je e-mailapp opent met je aanvraag. Verstuur de mail daar, dan nemen we contact op."} <a href={verstuurd} data-aanvraag>Opent er niets? Klik hier.</a></p>}
      {fout && <p className="gw2-fout" role="alert">{fout}</p>}
      <div className="gw2-knoppen">
        {stap > 0 && <button type="button" className="gw2-terug" onClick={() => { zetFout(""); zetStap(stap - 1); }}><ArrowLeft size={16} aria-hidden="true" /><span>Terug</span></button>}
        <button type="submit" className="gw2-verder"><span>{stap < laatste ? "Volgende" : heeftWhatsApp ? "Stuur mijn aanvraag via WhatsApp" : "Stuur mijn aanvraag per e-mail"}</span><ArrowUpRight size={17} aria-hidden="true" /></button>
      </div>
      <p className="gw2-bewaard"><i />Automatisch bewaard</p>
    </form>
  </div>
    {/* 27 november 2026 (Marinus): de presentatie die op 26 november naar Albert (ELT Live) ging, als showcase zonder reviewoptie, als
        live tegel onder de vragen. Bron: 01-KLANTEN/elt-live/02_WERK/2026-11-26-website-branding/presentatie/_bouw/showcase.py. */}
    <section className="gw2-showcase" id="showcase" aria-labelledby="gw2-showcase-kop">
      {/* 27 nov (Marinus): "De Showcase mag op een zwarte achtergrond en nog groter met BLACK teksten GROWTH PACKAGE SHOWCASE!" */}
      <p className="gw2-showcase-label" translate="no">Black Friday Deal</p>
      <ShowcaseKop />
      <p className="gw2-showcase-sub">ELT Live: branding, e-mail, website en ad creatives. Zo ziet een demopakket eruit. Scroll erdoorheen, of open de website vanuit de presentatie.</p>
      <div className="gw2-showcase-venster">
        <div className="gw2-showcase-balk" aria-hidden="true"><i /><i /><i /><span translate="no">socialnow.nl/showcase/elt-live</span></div>
        <iframe src="/showcase/elt-live/index.html" title="Showcase ELT Live: branding, e-mail, website en ad creatives" loading="lazy" />
      </div>
      <a className="gw2-showcase-open" href="/showcase/elt-live/index.html" target="_blank" rel="noopener">Open de showcase in een nieuw venster<ArrowUpRight size={15} aria-hidden="true" /></a>
    </section>
  </div>
  </>;
}
