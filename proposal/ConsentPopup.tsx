import React, { useEffect, useRef, useState } from "react";
import "./consent-duo.css";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, languagePrefix, type Language } from "./i18n/context";
import { LEGAL_VERSION } from "../components/legal";
import { bewaarOsGegevens } from "./aanvragen";
import { people } from "./content";

// 16 september 2026 (Marinus): de landingspopup. Eén keer bij binnenkomst: kom je voor de demo of
// wil je de website bekijken, kies je land, en met die keuze ga je akkoord met de voorwaarden en het
// privacybeleid. Onthouden in de browser per versie van de tekst; een nieuwe versie vraagt opnieuw.
// Het land bepaalt de taal van de site én reist mee naar het OS (cookies sn-taal en sn-land op
// .socialnow.nl), zodat het aanmeldformulier, de welkomstboodschap en Milo in de juiste taal staan.
// Niet op een juridische pagina zelf: daar leest iemand eerst.
//
// TEKSTEN: alles wat een bezoeker leest staat hieronder per taal; pas het hier aan.
const SLEUTEL = "sn-akkoord";
// De aanvraag gaat per e-mail of WhatsApp, naar keuze van de bezoeker.

export const LANDEN: { code: string; naam: string; vlag: string; taal: Language }[] = [
  { code: "NL", naam: "Nederland", vlag: "🇳🇱", taal: "nl" },
  { code: "BE", naam: "België", vlag: "🇧🇪", taal: "nl" },
  { code: "DE", naam: "Deutschland", vlag: "🇩🇪", taal: "de" },
  { code: "AT", naam: "Österreich", vlag: "🇦🇹", taal: "de" },
  { code: "CH", naam: "Schweiz", vlag: "🇨🇭", taal: "de" },
  { code: "FR", naam: "France", vlag: "🇫🇷", taal: "fr" },
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
// niet meer over het OS.
type Actie = { badge: string; kop: string; win: string; bedrag: string; regel: string };
const ACTIE: Record<Language, Actie> = {
  nl: { badge: "GRATIS", kop: "Branding, website, Google Ads audit en OS.", win: "Vraag je gratis website aan", bedrag: "met een persoonlijk bericht.", regel: "Je kunt je bericht voor het versturen aanpassen." },
  en: { badge: "FREE", kop: "Branding, website, Google Ads audit and OS.", win: "Request your free website", bedrag: "with a personal message.", regel: "You can edit your message before sending." },
  de: { badge: "KOSTENLOS", kop: "Branding, Website, Google Ads Audit und OS.", win: "Fragen Sie Ihre kostenlose Website an", bedrag: "mit einer persönlichen Nachricht.", regel: "Sie können Ihre Nachricht vor dem Senden bearbeiten." },
  fr: { badge: "GRATUIT", kop: "Branding, site web, audit Google Ads et OS.", win: "Demandez votre site gratuit", bedrag: "avec un message personnel.", regel: "Vous pouvez modifier votre message avant de l’envoyer." },
};
// 25 september 2026 (Marinus): de kop noemt het hele gratis pakket, net als de hero.
// De website-knop links en de kop boven het OS-formulier rechts: de site en het OS en/en.
const KLAAR: Record<Language, { website: string; osKop: string }> = {
  nl: { website: "Claim je gratis website", osKop: "Of probeer ons gratis persoonlijke OS" },
  en: { website: "Claim your free website", osKop: "Or try our free personal OS system" },
  de: { website: "Kostenlose Website sichern", osKop: "Oder testen Sie unser kostenloses persönliches OS" },
  fr: { website: "Obtenir mon site gratuit", osKop: "Ou essayez notre OS personnel gratuit" },
};
export function actieLoopt(): boolean { return Date.now() <= Date.parse(`${ACTIE_TOT}T23:59:59+02:00`); }

type Gegevens = { email: string; terug: string; foutNaam: string; foutEmail: string };
const GEGEVENS: Record<Language, Gegevens> = {
  nl: { email: "E-mail", terug: "Terug", foutNaam: "Vul je voornaam en achternaam in.", foutEmail: "Dat e-mailadres klopt nog niet." },
  en: { email: "E-mail", terug: "Back", foutNaam: "Enter your first and last name.", foutEmail: "That e-mail address doesn't look right yet." },
  de: { email: "E-Mail", terug: "Zurück", foutNaam: "Bitte geben Sie Vor- und Nachnamen ein.", foutEmail: "Diese E-Mail-Adresse stimmt noch nicht." },
  fr: { email: "E-mail", terug: "Retour", foutNaam: "Indiquez votre prénom et votre nom.", foutEmail: "Cette adresse e-mail n’est pas encore correcte." },
};
const TEKST: Record<Language, Tekst> = {
  nl: { kop: "Welkom bij SocialNow.", land: "Je land", demo: "Probeer het OS gratis", site: "Website bekijken", voor: "Door het OS te proberen of de website te bekijken, ga je akkoord met onze ", voorwaarden: "algemene voorwaarden", en: " en ons ", privacy: "privacybeleid", na: ". Geen trackingcookies op de website; in het OS meten we alleen met jouw toestemming.", intro: "Vraag een gratis website of OS-demo aan.", stap1: "Waar zit je?", stap2: "Je gegevens", volgende: "Volgende", phNaam: "Je naam", phEmail: "jij@bedrijf.nl" },
  en: { kop: "Welcome to SocialNow.", land: "Your country", demo: "Try the free personal OS", site: "Explore the website", voor: "By trying the OS or exploring the website, you agree to our ", voorwaarden: "terms of service", en: " and ", privacy: "privacy policy", na: ". No tracking cookies on the website; in the OS we only measure with your consent.", intro: "Request a free website or OS demo.", stap1: "Where are you based?", stap2: "Your details", volgende: "Next", phNaam: "Your name", phEmail: "you@company.com" },
  de: { kop: "Willkommen bei SocialNow.", land: "Ihr Land", demo: "OS kostenlos testen", site: "Website ansehen", voor: "Wenn Sie das OS testen oder die Website ansehen, stimmen Sie unseren ", voorwaarden: "Nutzungsbedingungen", en: " und unserer ", privacy: "Datenschutzerklärung", na: " zu. Keine Tracking-Cookies auf der Website; im OS messen wir nur mit Ihrer Zustimmung.", intro: "Fragen Sie eine kostenlose Website oder OS-Demo an.", stap1: "Wo sind Sie ansässig?", stap2: "Ihre Daten", volgende: "Weiter", phNaam: "Ihr Name", phEmail: "sie@firma.de" },
  fr: { kop: "Bienvenue chez SocialNow.", land: "Votre pays", demo: "Essayer l\u2019OS", site: "Découvrir le site", voor: "En essayant l’OS ou en découvrant le site, vous acceptez nos ", voorwaarden: "conditions générales", en: " et notre ", privacy: "politique de confidentialité", na: ". Pas de cookies de suivi sur le site ; dans l’OS, nous ne mesurons qu’avec votre accord.", intro: "Demandez un site ou une démo OS gratuite.", stap1: "Où êtes-vous basé ?", stap2: "Vos coordonnées", volgende: "Suivant", phNaam: "Votre nom", phEmail: "vous@entreprise.fr" },
};

function bewaard(): boolean { try { return localStorage.getItem(SLEUTEL) === LEGAL_VERSION; } catch { return false; } }
function landUitBrowser(): string {
  try { const m = document.cookie.match(/(?:^|;\s*)sn-land=([A-Z]{2})/); if (m && LANDEN.some(l => l.code === m[1])) return m[1]; } catch {}
  return "GB";
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

function minderBeweging() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
}

// 26 september 2026 (Marinus): rechts onder de knop een groene kaart met Marinus en Steef, en
// daaronder het team als balk die rustig voorbijschuift. De twee foto's staan los van elkaar met
// elk een eigen naam, zodat duidelijk is wie wie is.
const PERSOONLIJK: Record<Language, { badge: string; kop: string; regel: string }> = {
  nl: { badge: "PERSOONLIJK", kop: "Marinus en Steef", regel: "Jouw aanvraag komt direct bij ons binnen. Geen callcenter, geen bot." },
  en: { badge: "PERSONAL", kop: "Marinus and Steef", regel: "Your request comes straight to us. No call centre, no bot." },
  de: { badge: "PERSÖNLICH", kop: "Marinus und Steef", regel: "Deine Anfrage landet direkt bei uns. Kein Callcenter, kein Bot." },
  fr: { badge: "PERSONNEL", kop: "Marinus et Steef", regel: "Votre demande nous arrive directement. Pas de centre d'appels, pas de bot." },
};
const DUO = [
  { naam: "Marinus", rol: "Founder", foto: "Marinus-Bergsma-V2.webp" },
  { naam: "Steef", rol: "Partner", foto: "Steef-Komen.webp" },
];
const TEAM = ["Jos Hollenberg", "Sergio Jovovic", "Nick van Keulen", "Elian Coellar", "Sid van Kalken", "Carmel Boon", "Sam van der Sluis", "Emma Peperkamp"]
  .map(naam => people.find(p => p.name === naam)).filter((p): p is NonNullable<typeof p> => Boolean(p));

function Team({ language }: { language: Language }) {
  const t = PERSOONLIJK[language] || PERSOONLIJK.en;
  const rij = TEAM.map(p => (
    <li key={p.name}><img src={`/images/${p.image}`} alt="" width="38" height="38" loading="lazy" /><span><strong>{p.name}</strong><small>{p.role}</small></span></li>
  ));
  return (
    <div className="sn-consent-team">
      <div className="sn-consent-team-kaart">
        <div className="sn-consent-team-duo">
          {DUO.map(d => (
            <figure key={d.naam}>
              <img src={`/images/${d.foto}`} alt={d.naam} width="240" height="240" loading="lazy" />
              <figcaption><strong>{d.naam}</strong><span>{d.rol}</span></figcaption>
            </figure>
          ))}
        </div>
        <div className="sn-consent-team-tekst">
          <span className="sn-consent-actie-badge">{t.badge}</span>
          <strong>{t.kop}</strong>
          <span>{t.regel}</span>
        </div>
      </div>
      <div className="sn-consent-team-balk" aria-hidden="true"><ul>{rij}{rij}</ul></div>
    </div>
  );
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
  const [land, setLand] = useState("GB");
  const [stap, setStap] = useState<"keuze" | "gegevens">("keuze");
  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [email, setEmail] = useState("");
  const [fout, setFout] = useState("");
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
  const pad = (location.pathname.replace(/^\/(nl|de|fr)(?=\/|$)/, "").replace(/\/+$/, "")) || "/";
  const leest = JURIDISCH.includes(pad) || pad === "/antwoord-aanvragen";
  if (!open || leest) return null;
  const gekozen = LANDEN.find(l => l.code === land) || LANDEN.find(l => l.code === "GB")!;
  const s = TEKST[language] || TEKST.en;
  const a = ACTIE[language] || ACTIE.en;
  const kiesLand = (code: string) => {
    const l = LANDEN.find(x => x.code === code) || LANDEN.find(x => x.code === "GB")!; setLand(l.code); zetCookies(l.code, l.taal);
    // De taal van de site hangt aan de route; een volledige herlading zet alles (kop, menu, popup) in de nieuwe taal.
    if (l.taal !== language) { const rest = location.pathname.replace(/^\/(nl|de|fr)(?=\/|$)/, ""); window.location.assign(`${languagePrefix(l.taal)}${rest || "/"}${location.search}`); }
  };
  const akkoord = () => { try { localStorage.setItem(SLEUTEL, LEGAL_VERSION); } catch {} zetCookies(gekozen.code, gekozen.taal); setOpen(false); };
  const g = GEGEVENS[language] || GEGEVENS.en;
  const naarWebsite = () => { akkoord(); window.location.href = `${languagePrefix(gekozen.taal)}/gratis-website/`; };
  // 26 september 2026 (Marinus): geen WhatsApp als verplichte stap. De bezoeker gaat naar de OS-demopagina met
  // de animatie van het systeem; daar staan de gegevens al ingevuld en kiest de bezoeker zelf e-mail of WhatsApp.
  const naarDemo = () => { akkoord(); bewaarOsGegevens({ voornaam, achternaam, email }); window.location.href = `${languagePrefix(gekozen.taal)}/gratis-os-demo/`; };
  const verstuur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voornaam.trim() || !achternaam.trim()) { setFout(g.foutNaam); return; }
    if (!EMAIL.test(email.trim())) { setFout(g.foutEmail); return; }
    setFout(""); naarDemo();
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
        <button type="button" className="sn-consent-sluiten" onClick={akkoord} aria-label={language === "nl" ? "Sluiten" : "Close"}>×</button>
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
            // 26 september 2026 (Marinus): in het groene vlak draait nu de film van het systeem in
            // plaats van de actietekst. Dezelfde film als bovenaan de homepage, zonder geluid en in
            // een lus. Wie minder beweging wil, ziet alleen het stilstaande beeld.
            <div className="sn-consent-actie sn-consent-actie-film">
              <video
                src="/video/os/os-booth-en.mp4"
                poster="/video/os/os-booth-en.jpg"
                autoPlay={!minderBeweging()}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={a.win}
              />
            </div>
          ) : null}
          <button type="button" className="sn-consent-knop sn-consent-knop-website" onClick={naarWebsite}><span className="sn-consent-glans" aria-hidden="true" /><span>{k.website}</span><Pijl /></button>
          <div className="sn-consent-knoppen sn-consent-alleen-mobiel">
            <button type="button" className="sn-consent-knop" onClick={() => setStap("gegevens")}><span className="sn-consent-glans" aria-hidden="true" /><span>{s.volgende}</span><Pijl /></button>
          </div>
          <div className="sn-consent-alleen-mobiel">{juridisch}</div>
        </section>
        <form className="sn-consent-twee" onSubmit={verstuur} noValidate>
          <p className="sn-consent-os-kop">{k.osKop}</p>
          <p className="sn-consent-stap"><i>2</i>{s.stap2}</p>
          <label className="sn-consent-land">
            <span>{({nl:"Voornaam",en:"First name",de:"Vorname",fr:"Prénom"} as Record<Language,string>)[language]}</span>
            <input ref={naamVeld} type="text" autoComplete="given-name" required maxLength={80} placeholder={s.phNaam} value={voornaam} onChange={e => setVoornaam(e.target.value)} />
          </label>
          <label className="sn-consent-land">
            <span>{({nl:"Achternaam",en:"Last name",de:"Nachname",fr:"Nom"} as Record<Language,string>)[language]}</span>
            <input type="text" autoComplete="family-name" required maxLength={80} value={achternaam} onChange={e => setAchternaam(e.target.value)} />
          </label>
          <label className="sn-consent-land">
            <span>{g.email}</span>
            <input type="email" autoComplete="email" inputMode="email" required maxLength={254} placeholder={s.phEmail} value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          {fout ? <p className="sn-consent-fout" role="alert">{fout}</p> : null}
          <div className="sn-consent-knoppen">
            <button type="submit" className="sn-consent-knop"><span className="sn-consent-glans" aria-hidden="true" /><span>{({nl:"Vraag je gratis OS-demo aan",en:"Request your free OS demo",de:"Kostenlose OS-Demo anfragen",fr:"Demander une démo gratuite"} as Record<Language,string>)[language]}</span><Pijl /></button>
            <button type="button" className="sn-consent-knop sn-consent-knop-stil sn-consent-alleen-mobiel" onClick={() => { setFout(""); setStap("keuze"); }}><span>{g.terug}</span></button>
          </div>
          <Team language={language} />
          {juridisch}
        </form>
      </div>
    </div>
  );
}
