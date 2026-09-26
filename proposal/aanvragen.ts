import type { Language } from "./i18n/context";

export const WHATSAPP_NUMMER = "31637404577";
export type AanvraagSoort = "website" | "os";

const woorden: Record<Language, { website: string; os: string; first: string; last: string; email: string; company: string; site: string; example: string; what: string; issue: string }> = {
  nl: { website: "Ik wil een gratis website aanvragen.", os: "Ik wil een gratis OS-demo aanvragen.", first: "Voornaam", last: "Achternaam", email: "E-mailadres", company: "Bedrijf", site: "Huidige website", example: "Website die ik mooi vind", what: "Wat mijn bedrijf doet", issue: "Wat niet goed werkt aan mijn huidige site" },
  en: { website: "I would like to request a free website.", os: "I would like to request a free OS demo.", first: "First name", last: "Last name", email: "Email address", company: "Company", site: "Current website", example: "Website I like", what: "What my company does", issue: "What is not working on my current site" },
  de: { website: "Ich möchte eine kostenlose Website anfragen.", os: "Ich möchte eine kostenlose OS-Demo anfragen.", first: "Vorname", last: "Nachname", email: "E-Mail-Adresse", company: "Unternehmen", site: "Aktuelle Website", example: "Website, die mir gefällt", what: "Was mein Unternehmen macht", issue: "Was an meiner aktuellen Website nicht funktioniert" },
  fr: { website: "Je souhaite demander un site web gratuit.", os: "Je souhaite demander une démo gratuite de l’OS.", first: "Prénom", last: "Nom", email: "Adresse e-mail", company: "Entreprise", site: "Site actuel", example: "Site que j'aime", what: "Activité de mon entreprise", issue: "Ce qui ne fonctionne pas sur mon site actuel" },
  it: { website: "Vorrei richiedere un sito web gratuito.", os: "Vorrei richiedere una demo gratuita dell’OS.", first: "Nome", last: "Cognome", email: "Indirizzo e-mail", company: "Azienda", site: "Sito attuale", example: "Sito che mi piace", what: "Cosa fa la mia azienda", issue: "Cosa non funziona nel sito attuale" },
  es: { website: "Quiero solicitar una web gratuita.", os: "Quiero solicitar una demo gratuita del OS.", first: "Nombre", last: "Apellido", email: "Correo electrónico", company: "Empresa", site: "Web actual", example: "Web que me gusta", what: "Qué hace mi empresa", issue: "Qué no funciona en mi web actual" },
};

export type AanvraagGegevens = { voornaam?: string; achternaam?: string; email?: string; bedrijf?: string; website?: string; voorbeeld?: string; wat?: string; nietgoed?: string };

export function aanvraagBericht(soort: AanvraagSoort, taal: Language, gegevens: AanvraagGegevens = {}): string {
  const w = woorden[taal];
  const regels = [w[soort], "", `${w.first}: ${gegevens.voornaam?.trim() || ""}`, `${w.last}: ${gegevens.achternaam?.trim() || ""}`, `${w.email}: ${gegevens.email?.trim() || ""}`];
  if (soort === "website") {
    for (const [label, value] of [[w.company, gegevens.bedrijf], [w.site, gegevens.website], [w.example, gegevens.voorbeeld], [w.what, gegevens.wat], [w.issue, gegevens.nietgoed]]) {
      if (value?.trim()) regels.push(`${label}: ${value.trim()}`);
    }
  }
  return regels.join("\n");
}

export function aanvraagWhatsApp(soort: AanvraagSoort, taal: Language, gegevens: AanvraagGegevens = {}): string {
  return `https://wa.me/${WHATSAPP_NUMMER}?text=${encodeURIComponent(aanvraagBericht(soort, taal, gegevens))}`;
}
