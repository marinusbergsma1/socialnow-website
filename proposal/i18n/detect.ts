import { isLanguage, languagePrefix, type Language } from './context';

// 6 november 2026 (Indexworld M8): geen landvraag meer bij een externe dienst. Het land komt alleen nog uit de
// regiocode van de browsertaal (nl-BE geeft BE), zonder netwerk en zonder IP-adres.
const COUNTRY_LANGUAGES: Record<string, Language[]> = {
  NL: ['nl'], SR: ['nl'], AW: ['nl'], CW: ['nl'],
  DE: ['de'], AT: ['de'], LI: ['de'], FR: ['fr'], MC: ['fr'],
  BE: ['nl', 'fr', 'de'], CH: ['de', 'fr', 'it'], LU: ['fr', 'de'], CA: ['en', 'fr'],
  // 5 oktober 2026: tien talen.
  ES: ['es'], MX: ['es'], AR: ['es'], CO: ['es'], CL: ['es'], PE: ['es'], AD: ['es'],
  IT: ['it'], SM: ['it'], VA: ['it'],
  PT: ['pt'], BR: ['pt'], AO: ['pt'], MZ: ['pt'],
  PL: ['pl'],
  SE: ['sv'], AX: ['sv'], FI: ['en', 'sv'],
  DK: ['da'], GL: ['da'], FO: ['da'],
};
export function languageForCountry(country: string, browserLanguages: readonly string[]): Language {
  const options = COUNTRY_LANGUAGES[country.toUpperCase()] || ['en'];
  for (const locale of browserLanguages) {
    const code = locale.toLowerCase().split('-')[0];
    if (options.includes(code as Language)) return code as Language;
  }
  return options[0];
}
function writePreference(name: string, value: string) {
  const domain = /(^|\.)socialnow\.nl$/.test(location.hostname) ? '; Domain=.socialnow.nl' : '';
  // 22 oktober 2026: opslag kan geblokkeerd zijn (privémodus, strenge instellingen); dan gewoon zonder onthouden verder.
  try { document.cookie = `${name}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${domain}${location.protocol === 'https:' ? '; Secure' : ''}`; } catch { /* niet onthouden */ }
}
// 22 oktober 2026 (Marinus, bij /check): volgorde is eerst een eerder gekozen taal, dan de browsertaal, dan het land,
// en anders Engels. De eerste browsertaal die de site heeft, wint.
function browserTaal(): Language | null {
  const talen = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]).filter(Boolean);
  return (talen.map(value => value.toLowerCase().split('-')[0]).find(isLanguage) as Language | undefined) || null;
}
export function rememberLanguage(language: Language) {
  writePreference('sn-taal', language);
}
// De regio uit de browsertaal (de-CH geeft CH, pt-BR geeft BR), als die er is.
function browserLand(): string | null {
  const talen = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]).filter(Boolean);
  for (const locale of talen) {
    const regio = locale.match(/-([A-Za-z]{2})(?:-|$)/)?.[1];
    if (regio) return regio.toUpperCase();
  }
  return null;
}
export function detectVisitorLanguage(): void {
  // Explicit language links always win, including shared links to a specific language.
  if (/^\/(nl|de|fr|es|it|pt|pl|sv|da)(?:\/|$)/.test(location.pathname)) return;
  // Volgorde (22 oktober 2026, Marinus): eerder gekozen taal, dan de browsertaal, dan het land, anders Engels.
  const saved = document.cookie.match(/(?:^|;\s*)sn-taal=(en|nl|de|fr|es|it|pt|pl|sv|da)(?:;|$)/)?.[1];
  let language: Language = saved && isLanguage(saved) ? saved : 'en';
  const uitBrowser = saved ? null : browserTaal();
  if (uitBrowser) language = uitBrowser;
  else if (!saved) {
    // Het land uit de browser bepaalt alleen de taal; sn-land schrijft alleen een echte keuze (ConsentPopup), zoals de
    // cookieverklaring zegt.
    const country = browserLand();
    if (country) language = languageForCountry(country, navigator.languages || [navigator.language]);
  }
  if (language !== 'en') {
    // Update before mounting the router; retain the requested page, query and anchor.
    history.replaceState(history.state, '', `${languagePrefix(language)}${location.pathname}${location.search}${location.hash}`);
  }
}
