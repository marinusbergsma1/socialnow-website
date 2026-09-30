import { isLanguage, languagePrefix, type Language } from './context';

const TRACE_URL = 'https://milo-chat.socialnow-marinus.workers.dev/cdn-cgi/trace';
const COUNTRY_LANGUAGES: Record<string, Language[]> = {
  NL: ['nl'], SR: ['nl'], AW: ['nl'], CW: ['nl'],
  DE: ['de'], AT: ['de'], LI: ['de'], FR: ['fr'], MC: ['fr'],
  BE: ['nl', 'fr', 'de'], CH: ['de', 'fr', 'it'], LU: ['fr', 'de'], CA: ['en', 'fr'],
  ES: ['es'], MX: ['es'], AR: ['es'], CO: ['es'], CL: ['es'], PE: ['es'], IT: ['it'], SM: ['it'],
  PT: ['pt'], BR: ['pt'], AO: ['pt'], MZ: ['pt'], PL: ['pl'], SE: ['sv'], AX: ['sv'], DK: ['da'], FO: ['da'], GL: ['da'],
  TR: ['tr'], CY: ['tr', 'en'], JP: ['ja'],
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
  document.cookie = `${name}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${domain}${location.protocol === 'https:' ? '; Secure' : ''}`;
}
export function rememberLanguage(language: Language) {
  writePreference('sn-taal', language);
}
export async function detectVisitorLanguage(): Promise<void> {
  // Explicit language links always win, including shared links to a specific language.
  if (/^\/(nl|de|fr|es|it|pt|pl|sv|da|tr|ja)(?:\/|$)/.test(location.pathname)) return;
  const saved = document.cookie.match(/(?:^|;\s*)sn-taal=(en|nl|de|fr|es|it|pt|pl|sv|da|tr|ja)(?:;|$)/)?.[1];
  let language: Language = saved && isLanguage(saved) ? saved : 'en';
  if (!saved) {
    const browserLanguages = navigator.languages || [navigator.language];
    let country: string | null = null;
    try { country = sessionStorage.getItem('sn-detected-country'); } catch {}
    if (!country) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 1200);
      try {
        const response = await fetch(TRACE_URL, { signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
        if (response.ok) country = (await response.text()).match(/^loc=([A-Z]{2})$/m)?.[1] || null;
      } catch { /* Browser language is the fallback when country lookup is unavailable. */ }
      finally { window.clearTimeout(timer); }
    }
    if (country) {
      try { sessionStorage.setItem('sn-detected-country', country); } catch {}
      writePreference('sn-land', country);
      language = languageForCountry(country, browserLanguages);
    } else {
      language = browserLanguages.map(value => value.toLowerCase().split('-')[0]).find(isLanguage) || 'en';
    }
  }
  if (language !== 'en') {
    // Update before mounting the router; retain the requested page, query and anchor.
    history.replaceState(history.state, '', `${languagePrefix(language)}${location.pathname}${location.search}${location.hash}`);
  }
}
