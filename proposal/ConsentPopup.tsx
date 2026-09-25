import React, { useEffect, useRef, useState } from "react";
import "./consent-duo.css";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, languagePrefix, type Language } from "./i18n/context";
import { LEGAL_VERSION } from "../components/legal";

// 16 september 2026 (Marinus): de landingspopup. Eén keer bij binnenkomst: kom je voor de demo of
// wil je de website bekijken, kies je land, en met die keuze ga je akkoord met de voorwaarden en het
// privacybeleid. Onthouden in de browser per versie van de tekst; een nieuwe versie vraagt opnieuw.
// Het land bepaalt de taal van de site én reist mee naar het OS (cookies sn-taal en sn-land op
// .socialnow.nl), zodat het aanmeldformulier, de welkomstboodschap en Milo in de juiste taal staan.
// Niet op een juridische pagina zelf: daar leest iemand eerst.
//
// TEKSTEN: alles wat een bezoeker leest staat hieronder per taal; pas het hier aan.
const SLEUTEL = "sn-akkoord";
// 16 september 2026 (Marinus): wie op de demo klikt, komt in het OS terecht. Via de inlog, die na
// het inloggen naar het OS zelf gaat (/), en niet via /start/.
const DEMO_URL = "https://app.socialnow.nl/login/";

export const LANDEN: { code: string; naam: string; vlag: string; taal: Language }[] = [
  { code: "NL", naam: "Nederland", vlag: "🇳🇱", taal: "nl" },
  { code: "BE", naam: "België", vlag: "🇧🇪", taal: "nl" },
  { code: "DE", naam: "Deutschland", vlag: "🇩🇪", taal: "de" },
  { code: "AT", naam: "Österreich", vlag: "🇦🇹", taal: "de" },
  { code: "CH", naam: "Schweiz", vlag: "🇨🇭", taal: "de" },
  { code: "FR", naam: "France", vlag: "🇫🇷", taal: "fr" },
  { code: "IT", naam: "Italia", vlag: "🇮🇹", taal: "it" },
  { code: "ES", naam: "España", vlag: "🇪🇸", taal: "es" },
  { code: "GB", naam: "United Kingdom", vlag: "🇬🇧", taal: "en" },
  { code: "IE", naam: "Ireland", vlag: "🇮🇪", taal: "en" },
  { code: "US", naam: "United States", vlag: "🇺🇸", taal: "en" },
  { code: "XX", naam: "Other", vlag: "🌍", taal: "en" },
];

type Tekst = { kop: string; land: string; demo: string; site: string; voor: string; voorwaarden: string; en: string; privacy: string; na: string; intro: string; stap1: string; stap2: string; volgende: string; phNaam: string; phEmail: string };
// 17 september 2026 (Marinus): wie naar de demo gaat, laat eerst naam, e-mail en (optioneel)
// telefoon achter. Dat komt binnen op os.socialnow.nl/aanmeldingen.
// 22 september 2026 (Marinus): het losse vinkje voor meten is weg. Het meten staat in de algemene
// voorwaarden, en daar gaat iemand in de stap hiervoor al mee akkoord; een tweede vraag op hetzelfde
// scherm kost alleen aandacht. De cookie sn-meten wordt daarom op "ja" gezet bij het doorgaan. De
// tekst g.meten blijft staan voor het geval het vinkje terugkomt.
// 22 september 2026 (Marinus): wie hier binnenkomt, komt meestal binnen op de film over het
// persoonlijke OS en de winactie. Dat hoort dus in de onboarding te staan, en niet pas ergens in
// het OS. Regels en looptijd staan in docs/WINACTIE-2026-09.md van de app; hier alleen de belofte.
// Na de sluitingsdatum verdwijnt de strook vanzelf.
const ACTIE_TOT = "2026-09-26";
// 24 september 2026 (Marinus): de actie sluit zaterdag 26 september 23:59 (Amsterdam), de winnaar
// maken we zondag 27 september bekend. Dat moet overal staan, dus ook in de regel hieronder.
// 23 september 2026 (Marinus): de winactie groen en positief, met het bedrag groot en vet zoals
// op de flyer. Taggen: SocialNow.nl en Komen Consultancy, zoals op de beurs. 24 september 2026 (Marinus): de post
// gaat op LinkedIn ("plaatsen op Linkedin en SocialNow taggen en Komen Consultancy taggen"); regels versie 1.2 in de app.
// 24 september 2026 (Marinus): voor de tweede beursdag gaat de popup over de gratis website-upgrade,
// niet meer over het OS. Wie zijn gegevens achterlaat, wordt gebeld en ziet zijn nieuwe site nog
// dezelfde dag live op de beurs. De winactie (custom OS) blijft in de regels van de app bestaan.
type Actie = { badge: string; kop: string; win: string; bedrag: string; regel: string };
const ACTIE: Record<Language, Actie> = {
  nl: { badge: "GRATIS", kop: "Branding, website, Google Ads audit en OS.", win: "Wij bellen je en presenteren je nieuwe site", bedrag: "live op de beurs.", regel: "Dezelfde dag inzien en gebruiken. Odoo Experience, stand C21." },
  en: { badge: "FREE", kop: "Branding, website, Google Ads audit and OS.", win: "We call you and present your new website", bedrag: "live at the fair.", regel: "See it and use it the same day. Odoo Experience, booth C21." },
  de: { badge: "KOSTENLOS", kop: "Branding, Website, Google Ads Audit und OS.", win: "Wir rufen Sie an und präsentieren Ihre neue Website", bedrag: "live auf der Messe.", regel: "Noch am selben Tag ansehen und nutzen. Odoo Experience, Stand C21." },
  fr: { badge: "GRATUIT", kop: "Branding, site web, audit Google Ads et OS.", win: "Nous vous appelons et présentons votre nouveau site", bedrag: "en direct au salon.", regel: "À voir et à utiliser le jour même. Odoo Experience, stand C21." },
  it: { badge: "GRATIS", kop: "Branding, sito, audit Google Ads e OS.", win: "Ti chiamiamo e presentiamo il tuo nuovo sito", bedrag: "dal vivo in fiera.", regel: "Da vedere e usare lo stesso giorno. Odoo Experience, stand C21." },
  es: { badge: "GRATIS", kop: "Branding, web, auditoría de Google Ads y OS.", win: "Te llamamos y presentamos tu nueva web", bedrag: "en directo en la feria.", regel: "Para verla y usarla el mismo día. Odoo Experience, stand C21." },
};
// 25 september 2026 (Marinus): de kop noemt het hele gratis pakket, net als de hero.
// De website-knop links en de kop boven het OS-formulier rechts: de site en het OS en/en.
const KLAAR: Record<Language, { website: string; osKop: string }> = {
  nl: { website: "Claim je gratis website", osKop: "Of probeer ons gratis persoonlijke OS" },
  en: { website: "Claim your free website", osKop: "Or try our free personal OS system" },
  de: { website: "Kostenlose Website sichern", osKop: "Oder testen Sie unser kostenloses persönliches OS" },
  fr: { website: "Obtenir mon site gratuit", osKop: "Ou essayez notre OS personnel gratuit" },
  it: { website: "Richiedi il sito gratis", osKop: "Oppure prova il nostro OS personale gratuito" },
  es: { website: "Consigue tu web gratis", osKop: "O prueba nuestro OS personal gratis" },
};
export function actieLoopt(): boolean { return Date.now() <= Date.parse(`${ACTIE_TOT}T23:59:59+02:00`); }

type Gegevens = { kop: string; uitleg: string; naam: string; email: string; tel: string; optioneel: string; meten: string; verder: string; terug: string; foutNaam: string; foutEmail: string; bezig: string };
const GEGEVENS: Record<Language, Gegevens> = {
  nl: { kop: "Bijna binnen.", uitleg: "Laat je gegevens achter, dan kunnen we je later helpen.", naam: "Naam", email: "E-mail", tel: "Telefoon", optioneel: "optioneel", meten: "Ja, jullie mogen meten hoe ik het OS gebruik, om het beter te maken.", verder: "Probeer het OS gratis", terug: "Terug", foutNaam: "Vul je naam in.", foutEmail: "Dat e-mailadres klopt nog niet.", bezig: "Even geduld…" },
  en: { kop: "Almost there.", uitleg: "Leave your details so we can help you later.", naam: "Name", email: "E-mail", tel: "Phone", optioneel: "optional", meten: "Yes, you may measure how I use the OS, to make it better.", verder: "Try the free personal OS", terug: "Back", foutNaam: "Please enter your name.", foutEmail: "That e-mail address doesn't look right yet.", bezig: "One moment…" },
  de: { kop: "Fast geschafft.", uitleg: "Hinterlassen Sie Ihre Daten, dann können wir Ihnen später helfen.", naam: "Name", email: "E-Mail", tel: "Telefon", optioneel: "optional", meten: "Ja, Sie dürfen messen, wie ich das OS nutze, um es besser zu machen.", verder: "OS kostenlos testen", terug: "Zurück", foutNaam: "Bitte geben Sie Ihren Namen ein.", foutEmail: "Diese E-Mail-Adresse stimmt noch nicht.", bezig: "Einen Moment…" },
  fr: { kop: "Vous y \u00eates presque.", uitleg: "Laissez vos coordonnées pour que nous puissions vous aider plus tard.", naam: "Nom", email: "E-mail", tel: "Téléphone", optioneel: "facultatif", meten: "Oui, vous pouvez mesurer mon utilisation de l’OS pour l’améliorer.", verder: "Essayer l\u2019OS", terug: "Retour", foutNaam: "Indiquez votre nom.", foutEmail: "Cette adresse e-mail n’est pas encore correcte.", bezig: "Un instant…" },
  it: { kop: "Ci siamo quasi.", uitleg: "Lascia i tuoi dati, così potremo aiutarti in seguito.", naam: "Nome", email: "E-mail", tel: "Telefono", optioneel: "facoltativo", meten: "Sì, potete misurare come uso l’OS, per migliorarlo.", verder: "Provi l\u2019OS", terug: "Indietro", foutNaam: "Inserisci il tuo nome.", foutEmail: "Questo indirizzo e-mail non è ancora corretto.", bezig: "Un attimo…" },
  es: { kop: "Ya casi est\u00e1s.", uitleg: "Déjanos tus datos para que podamos ayudarte más adelante.", naam: "Nombre", email: "E-mail", tel: "Teléfono", optioneel: "opcional", meten: "Sí, podéis medir cómo uso el OS para mejorarlo.", verder: "Prueba el OS gratis", terug: "Atrás", foutNaam: "Escribe tu nombre.", foutEmail: "Ese e-mail todavía no es correcto.", bezig: "Un momento…" },
};
const AANMELD_URL = "https://os.socialnow.nl/api/aanmelden";
const TEKST: Record<Language, Tekst> = {
  nl: { kop: "Welkom bij SocialNow.", land: "Je land", demo: "Probeer het OS gratis", site: "Website bekijken", voor: "Door het OS te proberen of de website te bekijken, ga je akkoord met onze ", voorwaarden: "algemene voorwaarden", en: " en ons ", privacy: "privacybeleid", na: ". Geen trackingcookies op de website; in het OS meten we alleen met jouw toestemming.", intro: "Een betere website, gratis. Laat je gegevens achter, wij bellen je.", stap1: "Waar zit je?", stap2: "Je gegevens", volgende: "Volgende", phNaam: "Je naam", phEmail: "jij@bedrijf.nl" },
  en: { kop: "Welcome to SocialNow.", land: "Your country", demo: "Try the free personal OS", site: "Explore the website", voor: "By trying the OS or exploring the website, you agree to our ", voorwaarden: "terms of service", en: " and ", privacy: "privacy policy", na: ". No tracking cookies on the website; in the OS we only measure with your consent.", intro: "A better website, for free. Leave your details and we will call you.", stap1: "Where are you based?", stap2: "Your details", volgende: "Next", phNaam: "Your name", phEmail: "you@company.com" },
  de: { kop: "Willkommen bei SocialNow.", land: "Ihr Land", demo: "OS kostenlos testen", site: "Website ansehen", voor: "Wenn Sie das OS testen oder die Website ansehen, stimmen Sie unseren ", voorwaarden: "Nutzungsbedingungen", en: " und unserer ", privacy: "Datenschutzerklärung", na: " zu. Keine Tracking-Cookies auf der Website; im OS messen wir nur mit Ihrer Zustimmung.", intro: "Eine bessere Website, kostenlos. Hinterlassen Sie Ihre Daten, wir rufen Sie an.", stap1: "Wo sind Sie ansässig?", stap2: "Ihre Daten", volgende: "Weiter", phNaam: "Ihr Name", phEmail: "sie@firma.de" },
  fr: { kop: "Bienvenue chez SocialNow.", land: "Votre pays", demo: "Essayer l\u2019OS", site: "Découvrir le site", voor: "En essayant l’OS ou en découvrant le site, vous acceptez nos ", voorwaarden: "conditions générales", en: " et notre ", privacy: "politique de confidentialité", na: ". Pas de cookies de suivi sur le site ; dans l’OS, nous ne mesurons qu’avec votre accord.", intro: "Votre propre OS, à essayer gratuitement. Deux étapes et vous y êtes.", stap1: "Où êtes-vous basé ?", stap2: "Vos coordonnées", volgende: "Suivant", phNaam: "Votre nom", phEmail: "vous@entreprise.fr" },
  it: { kop: "Benvenuto in SocialNow.", land: "Il tuo paese", demo: "Provi l\u2019OS", site: "Esplora il sito", voor: "Provando l’OS o esplorando il sito, accetti i nostri ", voorwaarden: "termini di servizio", en: " e la nostra ", privacy: "informativa sulla privacy", na: ". Nessun cookie di tracciamento sul sito; nell’OS misuriamo solo con il tuo consenso.", intro: "Il tuo OS, da provare gratis. Due passi e sei dentro.", stap1: "Dove hai sede?", stap2: "I tuoi dati", volgende: "Avanti", phNaam: "Il tuo nome", phEmail: "tu@azienda.it" },
  es: { kop: "Bienvenido a SocialNow.", land: "Tu país", demo: "Prueba el OS gratis", site: "Ver la web", voor: "Al probar el OS o ver la web, aceptas nuestros ", voorwaarden: "términos de servicio", en: " y nuestra ", privacy: "política de privacidad", na: ". Sin cookies de seguimiento en la web; en el OS solo medimos con tu consentimiento.", intro: "Una web mejor, gratis. Déjanos tus datos y te llamamos.", stap1: "¿Dónde está tu empresa?", stap2: "Tus datos", volgende: "Siguiente", phNaam: "Tu nombre", phEmail: "tu@empresa.es" },
};

function bewaard(): boolean { try { return localStorage.getItem(SLEUTEL) === LEGAL_VERSION; } catch { return false; } }
function landUitBrowser(): string {
  try { const m = document.cookie.match(/(?:^|;\s*)sn-land=([A-Z]{2})/); if (m && LANDEN.some(l => l.code === m[1])) return m[1]; } catch {}
  const regio = (navigator.language || "").split("-")[1]?.toUpperCase() || "";
  return LANDEN.some(l => l.code === regio) ? regio : "NL";
}
// Cookies voor het hele domein, zodat app.socialnow.nl dezelfde taal en hetzelfde land ziet.
function zetCookies(land: string, taal: Language) {
  try {
    const domein = location.hostname.endsWith("socialnow.nl") ? "; Domain=.socialnow.nl" : "";
    const veilig = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `sn-taal=${taal}; Path=/; Max-Age=31536000; SameSite=Lax${domein}${veilig}`;
    document.cookie = `sn-land=${land}; Path=/; Max-Age=31536000; SameSite=Lax${domein}${veilig}`;
  } catch {}
}

function zetMeten(ja: boolean) {
  try {
    const domein = location.hostname.endsWith("socialnow.nl") ? "; Domain=.socialnow.nl" : "";
    const veilig = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `sn-meten=${ja ? "ja" : "nee"}; Path=/; Max-Age=31536000; SameSite=Lax${domein}${veilig}`;
  } catch {}
}
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 22 september 2026 (Marinus): de knoppen zijn dezelfde knop als "Discover the story" op
// socialnow.nl: een pil met een groene rand en een rondje met een pijl schuin omhoog. Alleen is
// deze groen gevuld in plaats van donker. Bij hover schuift een lichtere vulling van links naar
// rechts in en keert het rondje om naar wit met groen. De donkere knop ernaast blijft stil: geen
// gloed en geen pijl, zodat er maar een knop om aandacht vraagt.
function Pijl() {
  return (
    <span className="sn-consent-pijl" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
    </span>
  );
}

export default function ConsentPopup() {
  const { language } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [land, setLand] = useState("NL");
  const [stap, setStap] = useState<"keuze" | "gegevens">("keuze");
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);
  const naamVeld = useRef<HTMLInputElement>(null);
  useEffect(() => { if (stap === "gegevens") naamVeld.current?.focus({ preventScroll: true }); }, [stap]);
  useEffect(() => { setOpen(!bewaard()); setLand(landUitBrowser()); }, []);
  // 19 september 2026: de juridische laag is van twee naar zeven documenten gegaan. Op al die
  // pagina's blijft de pop-up weg. Niet alleen om te lezen: artikel 12 AVG vraagt dat een
  // privacyverklaring makkelijk toegankelijk is, en een scherm dat eerst om akkoord vraagt
  // voordat je de verklaring mag lezen waar je akkoord op zou geven, is dat niet.
  const JURIDISCH = ["/voorwaarden", "/privacy", "/juridisch", "/verwerkersovereenkomst", "/beveiliging", "/cookies", "/ai", "/gebruik"];
  // De slotslash hoort er hier af. De bouwstap maakt van elke route een map met een index.html,
  // dus een bezoeker landt op /privacy/ en niet op /privacy. De oude controle vergeleek op de
  // vorm zonder slash en sloeg dus nooit aan: de pop-up stond ook over het privacybeleid heen.
  // Dat is precies het scherm waar hij niet hoort, want het akkoord verwijst ernaar.
  const k = KLAAR[language] || KLAAR.en;
  const pad = (location.pathname.replace(/^\/(nl|de|fr|it|es)(?=\/|$)/, "").replace(/\/+$/, "")) || "/";
  const leest = JURIDISCH.includes(pad);
  if (!open || leest) return null;
  const gekozen = LANDEN.find(l => l.code === land) || LANDEN[0];
  const s = TEKST[language] || TEKST.en;
  const a = ACTIE[language] || ACTIE.en;
  const kiesLand = (code: string) => {
    const l = LANDEN.find(x => x.code === code) || LANDEN[0]; setLand(l.code); zetCookies(l.code, l.taal);
    // De taal van de site hangt aan de route; een volledige herlading zet alles (kop, menu, popup) in de nieuwe taal.
    if (l.taal !== language) { const rest = location.pathname.replace(/^\/(nl|de|fr|it|es)(?=\/|$)/, ""); window.location.assign(`${languagePrefix(l.taal)}${rest || "/"}${location.search}`); }
  };
  const akkoord = () => { try { localStorage.setItem(SLEUTEL, LEGAL_VERSION); } catch {} zetCookies(gekozen.code, gekozen.taal); setOpen(false); };
  const g = GEGEVENS[language] || GEGEVENS.en;
  const naarWebsite = () => { akkoord(); window.location.href = `${languagePrefix(gekozen.taal)}/gratis-website/`; };
  const naarDemo = () => { akkoord(); zetMeten(true); window.location.href = `${DEMO_URL}?bron=demo&taal=${gekozen.taal}&land=${gekozen.code}`; };
  // Versturen mag de demo nooit tegenhouden: alleen een fout in de eigen invoer houdt iemand hier.
  const verstuur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bezig) return;
    const n = naam.trim(), m = email.trim();
    if (!n) { setFout(g.foutNaam); return; }
    if (!EMAIL.test(m)) { setFout(g.foutEmail); return; }
    setFout(""); setBezig(true);
    try {
      const r = await fetch(AANMELD_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bron: "demo", naam: n, email: m, mobiel: tel.trim(), land: gekozen.code, taal: gekozen.taal, meten: true, voorwaarden: LEGAL_VERSION }),
        signal: AbortSignal.timeout(6000),
      });
      if (r.status === 400) { const j = await r.json().catch(() => null); setFout(String(j?.error || g.foutEmail)); setBezig(false); return; }
    } catch {}
    naarDemo();
  };
  // 23 september 2026 (Marinus): de twee stappen naast elkaar. Links waar je zit en de winactie,
  // rechts je gegevens en de knop naar het OS. Op de telefoon zijn het twee korte stappen met
  // streepjes bovenaan; "Volgende" schuift naar stap 2. Op desktop staan ze allebei open.
  const [welkomVoor, welkomNa] = s.kop.includes("SocialNow") ? [s.kop.split("SocialNow")[0].trim(), "SocialNow" + s.kop.split("SocialNow")[1]] : [s.kop, ""];
  const juridisch = (
    <p className="sn-consent-tekst">
      {s.voor}<Link to="/voorwaarden">{s.voorwaarden}</Link>{s.en}<Link to="/privacy">{s.privacy}</Link>{s.na}
    </p>
  );
  return (
    <div className="sn-consent" role="dialog" aria-modal="true" aria-labelledby="sn-consent-kop" translate="no">
      <div className="sn-consent-card sn-consent-duo" data-stap={stap}>
        <div className="sn-consent-strepen" aria-hidden="true"><i className="is-aan" /><i className={stap === "gegevens" ? "is-aan" : undefined} /></div>
        <section className="sn-consent-een">
          <img className="sn-consent-logo" src="/images/SocialNow-Logo-2026.webp" alt="SocialNow" width="1556" height="240" />
          <h2 id="sn-consent-kop" className="sn-consent-kop">{welkomVoor}{welkomNa ? <><br /><span>{welkomNa}</span></> : null}</h2>
          <p className="sn-consent-intro">{s.intro}</p>
          <p className="sn-consent-stap"><i>1</i>{s.stap1}</p>
          <label className="sn-consent-land">
            <span>{s.land}</span>
            <select value={land} onChange={e => kiesLand(e.target.value)} aria-label={s.land}>
              {LANDEN.map(l => <option key={l.code} value={l.code}>{l.vlag} {l.naam}</option>)}
            </select>
          </label>
          {actieLoopt() ? (
            <div className="sn-consent-actie">
              <span className="sn-consent-actie-badge">{a.badge}</span>
              <strong>{a.kop}</strong>
              <span className="sn-consent-actie-win">{a.win} <b className="sn-consent-bedrag">{a.bedrag}</b></span>
              <span className="sn-consent-actie-regel">{a.regel}</span>
            </div>
          ) : null}
          <button type="button" className="sn-consent-knop sn-consent-knop-website" onClick={naarWebsite}><span className="sn-consent-glans" aria-hidden="true" /><span>{k.website}</span><Pijl /></button>
          <div className="sn-consent-knoppen sn-consent-alleen-mobiel">
            <button type="button" className="sn-consent-knop" onClick={() => setStap("gegevens")}><span className="sn-consent-glans" aria-hidden="true" /><span>{s.volgende}</span><Pijl /></button>
            <button type="button" className="sn-consent-knop sn-consent-knop-stil" onClick={akkoord}><span>{s.site}</span></button>
          </div>
          <div className="sn-consent-alleen-mobiel">{juridisch}</div>
        </section>
        <form className="sn-consent-twee" onSubmit={verstuur} noValidate>
          <p className="sn-consent-os-kop">{k.osKop}</p>
          <p className="sn-consent-stap"><i>2</i>{s.stap2}</p>
          <label className="sn-consent-land">
            <span>{g.naam}</span>
            <input ref={naamVeld} type="text" autoComplete="name" required maxLength={80} placeholder={s.phNaam} value={naam} onChange={e => setNaam(e.target.value)} />
          </label>
          <label className="sn-consent-land">
            <span>{g.email}</span>
            <input type="email" autoComplete="email" inputMode="email" required maxLength={254} placeholder={s.phEmail} value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label className="sn-consent-land">
            <span>{g.tel} <em>({g.optioneel})</em></span>
            <input type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={tel} onChange={e => setTel(e.target.value)} />
          </label>
          {fout ? <p className="sn-consent-fout" role="alert">{fout}</p> : null}
          <div className="sn-consent-knoppen">
            <button type="submit" className="sn-consent-knop" disabled={bezig}><span className="sn-consent-glans" aria-hidden="true" /><span>{bezig ? g.bezig : s.demo}</span><Pijl /></button>
            <button type="button" className="sn-consent-knop sn-consent-knop-stil sn-consent-alleen-desktop" onClick={akkoord}><span>{s.site}</span></button>
            <button type="button" className="sn-consent-knop sn-consent-knop-stil sn-consent-alleen-mobiel" onClick={() => { setFout(""); setStap("keuze"); }}><span>{g.terug}</span></button>
          </div>
          {juridisch}
        </form>
      </div>
    </div>
  );
}
