import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { aanvraagWhatsApp, heeftWhatsApp, whatsappLink } from "./aanvragen";
import { people } from "./content";
import { klein } from "./licht";
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
];
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

type Antwoorden = { via: string; viaAnders: string; wat: string; stijlen: string[]; link: string; doelen: string[]; anders: string; website: string; voornaam: string; achternaam: string; bedrijf: string; email: string; mobiel: string };
const LEEG: Antwoorden = { via: "", viaAnders: "", wat: "", stijlen: [], link: "", doelen: [], anders: "", website: "", voornaam: "", achternaam: "", bedrijf: "", email: "", mobiel: "" };
function laad(): Antwoorden {
  try { const j = JSON.parse(localStorage.getItem(OPSLAG) || "null"); if (j && typeof j === "object" && Array.isArray(j.stijlen)) return { ...LEEG, ...j }; } catch {}
  return LEEG;
}

const GETROFFEN = [
  { naam: "Binance", logo: "/security/logos/binance.svg" },
  { naam: "Nintendo", logo: "/security/logos/nintendo.svg" },
  { naam: "Wikipedia", logo: "/security/logos/wikipedia.svg" },
];

export default function GratisWebsite() {
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
  const wissel = (k: "stijlen" | "doelen", v: string) => zet(k, a[k].includes(v) ? a[k].filter((x) => x !== v) : [...a[k], v]);

  const STAPPEN = ["Wat doet je bedrijf?", "Welke stijl spreekt je aan?", "Wat moet je website vooral doen?", "Heb je al een website?", "Via wie ben je bij ons gekomen?", "Hoe bereiken we je?"];
  const laatste = STAPPEN.length - 1;
  const controle = () => {
    if (stap === 0 && !a.wat.trim()) return t("Vertel in één zin wat je bedrijf doet.");
    if (stap === 4 && !a.via) return t("Kies via wie je bij ons kwam.");
    if (stap === 4 && a.via === ANDERS && !a.viaAnders.trim()) return t("Vul in via wie je bij ons kwam.");
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
    const adres = aanvraagWhatsApp("website", language, { via, voornaam: a.voornaam, achternaam: a.achternaam, bedrijf: a.bedrijf, email: a.email, mobiel: a.mobiel, website: a.website, voorbeeld, wat: a.wat, nietgoed });
    zetVerstuurd(adres);
    // Droog in proeven en previews: geautomatiseerde browsers en ?proef in het adres openen nooit een echte mail of WhatsApp.
    if (navigator.webdriver || new URLSearchParams(window.location.search).has("proef")) return;
    window.location.href = adres;
  };

  const naarStart = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const doel = document.getElementById("onboarding");
    if (!doel) return;
    e.preventDefault();
    doel.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // 4 november 2026 (Marinus): "Bij website Actie moet gewoon een hele cleane onboarding komen met nog een zwarte banner met de video
  // van mij en in 1 header net als de main nu mooi is gedaan waar ik zoals bij de vorige veiligheidsvideo vertel over het belang van
  // een goeie website samen met het Binance geval. Daaronder gewoon de onboarding." Een video met het Binance-verhaal bestaat nog
  // niet; tot die er is, staat hier de veiligheidsvideo van /security (Marinus aan het woord), sinds 4 november avond de liggende versie.
  return <>
    <section className="sn-alg gw2-kop" aria-labelledby="gw2-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst">
          <p className="sn-alg-label"><i />Website-actie</p>
          <h1 id="gw2-kop">Wij maken jouw website, gratis<span className="sn-alg-punt">.</span></h1>
          {/* 4 november 2026 (avond, Marinus): "Vraag een veiligheidsrapport aan of krijg een gratis demo van een moderne website op maat." */}
          <p className="sn-alg-uitleg"><strong>Een goede website is ook een veilige website.</strong> Vraag een veiligheidsrapport aan of krijg een gratis demo van een moderne website op maat.</p>
          <div className="sn-alg-acties">
            <a className="sn-pill" href="#onboarding" onClick={naarStart}><span>Begin met vraag 1</span><ArrowUpRight size={17} aria-hidden="true" /></a>
            <Link className="sn-pill sn-pill-blauw" to="/security"><span>Vraag een veiligheidsrapport aan</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          {/* "een kleine logobar met de logo's van de getroffen bedrijven met daarboven zelfs deze bedrijven zijn getroffen Binance er
              ook bij". Nintendo en Wikipedia met bron in de securityscan (PhpCheck.tsx, GERAAKT); Binance op verzoek van Marinus. */}
          <div className="gw2-getroffen">
            <p>Zelfs deze bedrijven zijn getroffen.</p>
            <ul aria-label="Getroffen bedrijven">
              {GETROFFEN.map((g) => <li key={g.naam}><img src={g.logo} alt={g.naam} title={g.naam} /></li>)}
            </ul>
          </div>
          <a className="gw2-steef" href={whatsappLink(t("Hoi Steef, ik heb een vraag over de gratis website."))} target="_blank" rel="noopener noreferrer">
            <img src="/images/Steef-Komen.webp" alt="" width="40" height="40" /><span><strong translate="no">Steef Komen</strong><small>Liever even praten? Stuur Steef een bericht.</small></span><ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        {/* "hier de liggende video": de 16:9-versie, speelt alleen als je op afspelen klikt. */}
        <figure className="sn-blij-film gw2-film is-liggend">
          <video controls playsInline preload="none" poster="/security/film/poster-16x9.jpg" aria-label="Marinus over het belang van een veilige website">
            <source src="/security/film/security-16x9.mp4" type="video/mp4" />
          </video>
        </figure>
      </div>
    </section>
    <div className="gw2" id="onboarding"><div className="gw2-vel">
    <div className="gw2-voortgang" aria-hidden="true">{STAPPEN.map((_, i) => <span key={i} className={i <= stap ? "aan" : ""} />)}</div>

    <form className="gw2-kaart" onSubmit={verder} noValidate>
      <p className="gw2-stap">Vraag {stap + 1} van {STAPPEN.length}</p>
      <h2>{STAPPEN[stap]}</h2>

      {stap === 0 && <label className="gw2-veld"><span className="gw2-verborgen">{STAPPEN[0]}</span>
        <textarea rows={3} maxLength={600} value={a.wat} onChange={(e) => zet("wat", e.target.value)} placeholder="Bijvoorbeeld: wij installeren zonnepanelen voor bedrijven in de regio Utrecht." />
      </label>}

      {stap === 1 && <>
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

      {stap === 2 && <>
        <div className="gw2-chips">{DOELEN.map((d) => <label key={d} className={`gw2-chip${a.doelen.includes(d) ? " aan" : ""}`}>
          <input type="checkbox" checked={a.doelen.includes(d)} onChange={() => wissel("doelen", d)} /><Check size={14} aria-hidden="true" /><span>{d}</span>
        </label>)}</div>
        <label className="gw2-veld"><span>Nog iets wat je mist? <em>(optioneel)</em></span>
          <textarea rows={2} maxLength={800} value={a.anders} onChange={(e) => zet("anders", e.target.value)} placeholder="Bijvoorbeeld: klanten moeten makkelijk een offerte kunnen aanvragen." />
        </label>
      </>}

      {stap === 3 && <label className="gw2-veld"><span>Link naar je huidige website <em>(optioneel)</em></span>
        <input value={a.website} maxLength={200} inputMode="url" autoCapitalize="none" autoCorrect="off" onChange={(e) => zet("website", e.target.value)} placeholder="https://" />
        <small>Nog geen website? Laat dit leeg, dan beginnen we vanaf nul.</small>
      </label>}

      {stap === 4 && <>
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

      {stap === 5 && <>
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
  </div></div>
  </>;
}
