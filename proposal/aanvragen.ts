import type { Language } from "./i18n/context";

export const WHATSAPP_NUMMER = "31637404577";
export type AanvraagSoort = "website" | "os";

const woorden: Record<Language, { website: string; os: string; first: string; last: string; email: string; company: string; site: string; wish: string }> = {
  nl: { website: "Ik wil een gratis website aanvragen.", os: "Ik wil een gratis OS-demo aanvragen.", first: "Voornaam", last: "Achternaam", email: "E-mailadres", company: "Bedrijf", site: "Huidige website", wish: "Mijn wens" },
  en: { website: "I would like to request a free website.", os: "I would like to request a free OS demo.", first: "First name", last: "Last name", email: "Email address", company: "Company", site: "Current website", wish: "What I need" },
  de: { website: "Ich möchte eine kostenlose Website anfragen.", os: "Ich möchte eine kostenlose OS-Demo anfragen.", first: "Vorname", last: "Nachname", email: "E-Mail-Adresse", company: "Unternehmen", site: "Aktuelle Website", wish: "Mein Wunsch" },
  fr: { website: "Je souhaite demander un site web gratuit.", os: "Je souhaite demander une démo gratuite de l’OS.", first: "Prénom", last: "Nom", email: "Adresse e-mail", company: "Entreprise", site: "Site actuel", wish: "Mon besoin" },
  it: { website: "Vorrei richiedere un sito web gratuito.", os: "Vorrei richiedere una demo gratuita dell’OS.", first: "Nome", last: "Cognome", email: "Indirizzo e-mail", company: "Azienda", site: "Sito attuale", wish: "La mia richiesta" },
  es: { website: "Quiero solicitar una web gratuita.", os: "Quiero solicitar una demo gratuita del OS.", first: "Nombre", last: "Apellido", email: "Correo electrónico", company: "Empresa", site: "Web actual", wish: "Lo que necesito" },
};

export type AanvraagGegevens = { voornaam?: string; achternaam?: string; email?: string; bedrijf?: string; website?: string; wens?: string };

export function aanvraagBericht(soort: AanvraagSoort, taal: Language, gegevens: AanvraagGegevens = {}): string {
  const w = woorden[taal];
  const regels = [w[soort], "", `${w.first}: ${gegevens.voornaam?.trim() || ""}`, `${w.last}: ${gegevens.achternaam?.trim() || ""}`, `${w.email}: ${gegevens.email?.trim() || ""}`];
  if (soort === "website") {
    regels.push(`${w.company}: ${gegevens.bedrijf?.trim() || ""}`, `${w.site}: ${gegevens.website?.trim() || ""}`, `${w.wish}: ${gegevens.wens?.trim() || ""}`);
  }
  return regels.join("\n");
}

export function aanvraagWhatsApp(soort: AanvraagSoort, taal: Language, gegevens: AanvraagGegevens = {}): string {
  return `https://wa.me/${WHATSAPP_NUMMER}?text=${encodeURIComponent(aanvraagBericht(soort, taal, gegevens))}`;
}
