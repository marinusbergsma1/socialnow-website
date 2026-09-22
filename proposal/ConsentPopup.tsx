import React, { useEffect, useState } from "react";
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

type Tekst = { kop: string; vraag: string; land: string; demo: string; site: string; voor: string; voorwaarden: string; en: string; privacy: string; na: string };
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
const ACTIE_TOT = "2026-09-30";
type Actie = { kop: string; regel: string };
const ACTIE: Record<Language, Actie> = {
  nl: { kop: "Maak één post. Win een custom OS van €10.000.", regel: "Maak een post in SocialNow OS Studio en zet hem online op je eigen kanalen, met @socialnow.nl erbij getagd. Dat kan tot en met 30 september 2026." },
  en: { kop: "Make one post. Win a custom OS worth €10.000.", regel: "Create a post in SocialNow OS Studio and publish it on your own channels, tagging @socialnow.nl. You have until 30 September 2026." },
  de: { kop: "Machen Sie einen Post. Gewinnen Sie ein Custom OS im Wert von 10.000 €.", regel: "Erstellen Sie einen Post im SocialNow OS Studio und veröffentlichen Sie ihn auf Ihren eigenen Kanälen, mit @socialnow.nl markiert. Bis zum 30. September 2026." },
  fr: { kop: "Publiez un post. Gagnez un OS sur mesure d’une valeur de 10 000 €.", regel: "Créez un post dans SocialNow OS Studio et publiez-le sur vos propres canaux, en taguant @socialnow.nl. Jusqu’au 30 septembre 2026." },
  it: { kop: "Crea un post. Vinci un OS su misura del valore di 10.000 €.", regel: "Crea un post in SocialNow OS Studio e pubblicalo sui tuoi canali, taggando @socialnow.nl. C’è tempo fino al 30 settembre 2026." },
  es: { kop: "Haz una publicación. Gana un OS a medida valorado en 10.000 €.", regel: "Crea una publicación en SocialNow OS Studio y publícala en tus propios canales, etiquetando a @socialnow.nl. Tienes hasta el 30 de septiembre de 2026." },
};
function actieLoopt(): boolean { return Date.now() <= Date.parse(`${ACTIE_TOT}T23:59:59+02:00`); }

type Gegevens = { kop: string; uitleg: string; naam: string; email: string; tel: string; optioneel: string; meten: string; verder: string; terug: string; foutNaam: string; foutEmail: string; bezig: string };
const GEGEVENS: Record<Language, Gegevens> = {
  nl: { kop: "Bijna in de demo.", uitleg: "Laat je gegevens achter, dan kunnen we je later helpen.", naam: "Naam", email: "E-mail", tel: "Telefoon", optioneel: "optioneel", meten: "Ja, jullie mogen meten hoe ik het OS gebruik, om het beter te maken.", verder: "Naar de demo", terug: "Terug", foutNaam: "Vul je naam in.", foutEmail: "Dat e-mailadres klopt nog niet.", bezig: "Even geduld…" },
  en: { kop: "Almost in the demo.", uitleg: "Leave your details so we can help you later.", naam: "Name", email: "E-mail", tel: "Phone", optioneel: "optional", meten: "Yes, you may measure how I use the OS, to make it better.", verder: "Go to the demo", terug: "Back", foutNaam: "Please enter your name.", foutEmail: "That e-mail address doesn't look right yet.", bezig: "One moment…" },
  de: { kop: "Fast in der Demo.", uitleg: "Hinterlassen Sie Ihre Daten, dann können wir Ihnen später helfen.", naam: "Name", email: "E-Mail", tel: "Telefon", optioneel: "optional", meten: "Ja, Sie dürfen messen, wie ich das OS nutze, um es besser zu machen.", verder: "Zur Demo", terug: "Zurück", foutNaam: "Bitte geben Sie Ihren Namen ein.", foutEmail: "Diese E-Mail-Adresse stimmt noch nicht.", bezig: "Einen Moment…" },
  fr: { kop: "Presque dans la démo.", uitleg: "Laissez vos coordonnées pour que nous puissions vous aider plus tard.", naam: "Nom", email: "E-mail", tel: "Téléphone", optioneel: "facultatif", meten: "Oui, vous pouvez mesurer mon utilisation de l’OS pour l’améliorer.", verder: "Voir la démo", terug: "Retour", foutNaam: "Indiquez votre nom.", foutEmail: "Cette adresse e-mail n’est pas encore correcte.", bezig: "Un instant…" },
  it: { kop: "Quasi nella demo.", uitleg: "Lascia i tuoi dati, così potremo aiutarti in seguito.", naam: "Nome", email: "E-mail", tel: "Telefono", optioneel: "facoltativo", meten: "Sì, potete misurare come uso l’OS, per migliorarlo.", verder: "Vai alla demo", terug: "Indietro", foutNaam: "Inserisci il tuo nome.", foutEmail: "Questo indirizzo e-mail non è ancora corretto.", bezig: "Un attimo…" },
  es: { kop: "Casi en la demo.", uitleg: "Déjanos tus datos para que podamos ayudarte más adelante.", naam: "Nombre", email: "E-mail", tel: "Teléfono", optioneel: "opcional", meten: "Sí, podéis medir cómo uso el OS para mejorarlo.", verder: "Ir a la demo", terug: "Atrás", foutNaam: "Escribe tu nombre.", foutEmail: "Ese e-mail todavía no es correcto.", bezig: "Un momento…" },
};
const AANMELD_URL = "https://os.socialnow.nl/api/aanmelden";
const TEKST: Record<Language, Tekst> = {
  nl: { kop: "Welkom bij SocialNow.", vraag: "Kom je voor de demo, of wil je eerst de website bekijken?", land: "Je land", demo: "Naar de demo", site: "Website bekijken", voor: "Door het OS te proberen of de website te bekijken, ga je akkoord met onze ", voorwaarden: "algemene voorwaarden", en: " en ons ", privacy: "privacybeleid", na: ". Geen trackingcookies op de website; in het OS meten we alleen met jouw toestemming." },
  en: { kop: "Welcome to SocialNow.", vraag: "Are you here for the demo, or do you want to explore the website first?", land: "Your country", demo: "Go to the demo", site: "Explore the website", voor: "By trying the OS or exploring the website, you agree to our ", voorwaarden: "terms of service", en: " and ", privacy: "privacy policy", na: ". No tracking cookies on the website; in the OS we only measure with your consent." },
  de: { kop: "Willkommen bei SocialNow.", vraag: "Kommen Sie für die Demo, oder möchten Sie zuerst die Website ansehen?", land: "Ihr Land", demo: "Zur Demo", site: "Website ansehen", voor: "Wenn Sie das OS testen oder die Website ansehen, stimmen Sie unseren ", voorwaarden: "Nutzungsbedingungen", en: " und unserer ", privacy: "Datenschutzerklärung", na: " zu. Keine Tracking-Cookies auf der Website; im OS messen wir nur mit Ihrer Zustimmung." },
  fr: { kop: "Bienvenue chez SocialNow.", vraag: "Vous venez pour la démo, ou vous voulez d’abord découvrir le site ?", land: "Votre pays", demo: "Voir la démo", site: "Découvrir le site", voor: "En essayant l’OS ou en découvrant le site, vous acceptez nos ", voorwaarden: "conditions générales", en: " et notre ", privacy: "politique de confidentialité", na: ". Pas de cookies de suivi sur le site ; dans l’OS, nous ne mesurons qu’avec votre accord." },
  it: { kop: "Benvenuto in SocialNow.", vraag: "Sei qui per la demo, o vuoi prima esplorare il sito?", land: "Il tuo paese", demo: "Vai alla demo", site: "Esplora il sito", voor: "Provando l’OS o esplorando il sito, accetti i nostri ", voorwaarden: "termini di servizio", en: " e la nostra ", privacy: "informativa sulla privacy", na: ". Nessun cookie di tracciamento sul sito; nell’OS misuriamo solo con il tuo consenso." },
  es: { kop: "Bienvenido a SocialNow.", vraag: "¿Vienes por la demo, o quieres ver primero la web?", land: "Tu país", demo: "Ir a la demo", site: "Ver la web", voor: "Al probar el OS o ver la web, aceptas nuestros ", voorwaarden: "términos de servicio", en: " y nuestra ", privacy: "política de privacidad", na: ". Sin cookies de seguimiento en la web; en el OS solo medimos con tu consentimiento." },
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
  return (
    <div className="sn-consent" role="dialog" aria-modal="true" aria-labelledby="sn-consent-kop" translate="no">
      <div className="sn-consent-card">
        {/* 16 september 2026 (Marinus): zoals de inlog van het OS, met het woordlogo in een eigen band. */}
        <div className="sn-consent-merk">
          <img className="sn-consent-logo" src="/images/SocialNow-Logo-2026.webp" alt="SocialNow" width="1556" height="240" />
        </div>
        {actieLoopt() ? (
          <div className="sn-consent-actie">
            <strong>{a.kop}</strong>
            <span>{a.regel}</span>
          </div>
        ) : null}
        <div className="sn-consent-inhoud">
        {stap === "gegevens" ? (
        <form className="sn-consent-form" onSubmit={verstuur} noValidate>
          <h2 id="sn-consent-kop" className="sn-consent-kop">{g.kop}</h2>
          <p className="sn-consent-vraag">{g.uitleg}</p>
          <label className="sn-consent-land">
            <span>{g.naam}</span>
            <input type="text" autoComplete="name" required maxLength={80} value={naam} onChange={e => setNaam(e.target.value)} autoFocus />
          </label>
          <label className="sn-consent-land">
            <span>{g.email}</span>
            <input type="email" autoComplete="email" inputMode="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label className="sn-consent-land">
            <span>{g.tel} <em>({g.optioneel})</em></span>
            <input type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={tel} onChange={e => setTel(e.target.value)} />
          </label>
          {fout ? <p className="sn-consent-fout" role="alert">{fout}</p> : null}
          <div className="sn-consent-knoppen">
            <button type="submit" className="sn-consent-knop" disabled={bezig}>{bezig ? g.bezig : g.verder}</button>
            <button type="button" className="sn-consent-knop sn-consent-knop-stil" onClick={() => { setFout(""); setStap("keuze"); }}>{g.terug}</button>
          </div>
        </form>
        ) : (<>
        <h2 id="sn-consent-kop" className="sn-consent-kop">{s.kop}</h2>
        <p className="sn-consent-vraag">{s.vraag}</p>
        <label className="sn-consent-land">
          <span>{s.land}</span>
          <select value={land} onChange={e => kiesLand(e.target.value)} aria-label={s.land}>
            {LANDEN.map(l => <option key={l.code} value={l.code}>{l.vlag} {l.naam}</option>)}
          </select>
        </label>
        <div className="sn-consent-knoppen">
          <button type="button" className="sn-consent-knop" onClick={() => setStap("gegevens")}>{s.demo}</button>
          <button type="button" className="sn-consent-knop sn-consent-knop-stil" onClick={akkoord}>{s.site}</button>
        </div>
        <p className="sn-consent-tekst">
          {s.voor}<Link to="/voorwaarden">{s.voorwaarden}</Link>{s.en}<Link to="/privacy">{s.privacy}</Link>{s.na}
        </p>
        </>)}
        </div>
      </div>
    </div>
  );
}
