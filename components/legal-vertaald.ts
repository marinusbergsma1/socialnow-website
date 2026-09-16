// 16 september 2026: de vertaalde voorwaarden en het vertaalde privacybeleid (de, fr, it, es).
// Elk bestand legal-<taal>.ts exporteert { terms, privacy } in de vorm van LegalDoc uit legal.ts.
// Ontbreekt een taal, dan toont LegalPage het Engels.
import type { LegalDoc } from "./legal";
import * as de from "./legal-de";
import * as fr from "./legal-fr";
import * as it from "./legal-it";
import * as es from "./legal-es";
type Deel = { terms?: LegalDoc; privacy?: LegalDoc };
const talen: Record<"de" | "fr" | "it" | "es", Deel> = { de, fr, it, es };
function verzamel(veld: "terms" | "privacy"): Partial<Record<"de" | "fr" | "it" | "es", LegalDoc>> {
  const uit: Partial<Record<"de" | "fr" | "it" | "es", LegalDoc>> = {};
  for (const code of ["de", "fr", "it", "es"] as const) { const d = talen[code][veld]; if (d) uit[code] = d; }
  return uit;
}
export const terms = verzamel("terms");
export const privacy = verzamel("privacy");
