// Gedeeld door de pagina, de server en de proeven: welke velden een soort call vraagt, en het
// domein uit een link netjes maken (alleen een hostnaam, nooit een pad of script).
const STANDAARD = ["naam", "email", "vraag"];
const HOST = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?!\d+$)[a-z0-9-]{2,63}$/;

export function veldenVoor(soort) {
  return Array.isArray(soort?.velden) && soort.velden.length ? soort.velden : STANDAARD;
}

export function schoonDomein(waarde) {
  let w = String(waarde ?? "").trim().toLowerCase();
  if (!w || w.length > 300 || /[\s<>"'`\\]/.test(w)) return "";
  if (!/^[a-z][a-z0-9+.-]*:\/\//.test(w)) {
    if (/^[a-z][a-z0-9+.-]*:(?!\d)/.test(w)) return ""; // javascript:, mailto: en dergelijke
    w = `https://${w}`;
  }
  try {
    const host = new URL(w).hostname.replace(/\.$/, "");
    return HOST.test(host) ? host : "";
  } catch {
    return "";
  }
}
