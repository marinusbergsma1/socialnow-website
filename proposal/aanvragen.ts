import type { Language } from "./i18n/context";

// 28 september 2026 (Marinus): "Haal mijn whatsapp van de website af en laat al het contact eerst via Steef gaan."
// Vul hier Steefs WhatsApp-nummer in (landcode zonder +, bijvoorbeeld 316...). Tot dan loopt alles per e-mail naar Steef.
export const WHATSAPP_NUMMER = "";
export const CONTACT_MAIL = "steef@socialnow.nl";
export const heeftWhatsApp = WHATSAPP_NUMMER !== "";
export const whatsappLink = (tekst = "") =>
  heeftWhatsApp
    ? `https://wa.me/${WHATSAPP_NUMMER}${tekst ? `?text=${encodeURIComponent(tekst)}` : ""}`
    : `mailto:${CONTACT_MAIL}${tekst ? `?body=${encodeURIComponent(tekst)}` : ""}`;
export const mailLink = (onderwerp = "") => `mailto:${CONTACT_MAIL}${onderwerp ? `?subject=${encodeURIComponent(onderwerp)}` : ""}`;
export type AanvraagSoort = "website" | "os";

const woorden: Record<Language, { website: string; os: string; first: string; last: string; email: string; phone: string; company: string; site: string; example: string; what: string; issue: string }> = {
  nl: { website: "Ik wil een gratis website aanvragen.", os: "Ik wil een gratis OS-demo aanvragen.", first: "Voornaam", last: "Achternaam", email: "E-mailadres", phone: "Telefoonnummer", company: "Bedrijf", site: "Huidige website", example: "Website die ik mooi vind", what: "Wat mijn bedrijf doet", issue: "Wat niet goed werkt aan mijn huidige site" },
  en: { website: "I would like to request a free website.", os: "I would like to request a free OS demo.", first: "First name", last: "Last name", email: "Email address", phone: "Phone number", company: "Company", site: "Current website", example: "Website I like", what: "What my company does", issue: "What is not working on my current site" },
  de: { website: "Ich möchte eine kostenlose Website anfragen.", os: "Ich möchte eine kostenlose OS-Demo anfragen.", first: "Vorname", last: "Nachname", email: "E-Mail-Adresse", phone: "Telefonnummer", company: "Unternehmen", site: "Aktuelle Website", example: "Website, die mir gefällt", what: "Was mein Unternehmen macht", issue: "Was an meiner aktuellen Website nicht funktioniert" },
  fr: { website: "Je souhaite demander un site web gratuit.", os: "Je souhaite demander une démo gratuite de l’OS.", first: "Prénom", last: "Nom", email: "Adresse e-mail", phone: "Numéro de téléphone", company: "Entreprise", site: "Site actuel", example: "Site que j'aime", what: "Activité de mon entreprise", issue: "Ce qui ne fonctionne pas sur mon site actuel" },
  es: { website: "Quiero solicitar una web gratuita.", os: "Quiero solicitar una demo gratuita del OS.", first: "Nombre", last: "Apellido", email: "Correo electrónico", phone: "Número de teléfono", company: "Empresa", site: "Web actual", example: "Web que me gusta", what: "Qué hace mi empresa", issue: "Qué no funciona en mi web actual" },
  it: { website: "Vorrei richiedere un sito web gratuito.", os: "Vorrei richiedere una demo gratuita dell’OS.", first: "Nome", last: "Cognome", email: "Indirizzo e-mail", phone: "Numero di telefono", company: "Azienda", site: "Sito attuale", example: "Sito che mi piace", what: "Cosa fa la mia azienda", issue: "Cosa non funziona nel sito attuale" },
  pt: { website: "Gostaria de pedir um website gratuito.", os: "Gostaria de pedir uma demo gratuita do OS.", first: "Nome", last: "Apelido", email: "Endereço de e-mail", phone: "Número de telefone", company: "Empresa", site: "Website atual", example: "Website de que gosto", what: "O que a minha empresa faz", issue: "O que não funciona no meu website atual" },
  pl: { website: "Chciałbym poprosić o darmową stronę internetową.", os: "Chciałbym poprosić o darmowe demo OS.", first: "Imię", last: "Nazwisko", email: "Adres e-mail", phone: "Numer telefonu", company: "Firma", site: "Obecna strona", example: "Strona, która mi się podoba", what: "Czym zajmuje się moja firma", issue: "Co nie działa na mojej obecnej stronie" },
  sv: { website: "Jag vill be om en gratis webbplats.", os: "Jag vill be om en gratis OS-demo.", first: "Förnamn", last: "Efternamn", email: "E-postadress", phone: "Telefonnummer", company: "Företag", site: "Nuvarande webbplats", example: "Webbplats jag gillar", what: "Vad mitt företag gör", issue: "Vad som inte fungerar på min nuvarande webbplats" },
  da: { website: "Jeg vil gerne bestille en gratis hjemmeside.", os: "Jeg vil gerne bestille en gratis OS-demo.", first: "Fornavn", last: "Efternavn", email: "E-mailadresse", phone: "Telefonnummer", company: "Virksomhed", site: "Nuværende hjemmeside", example: "Hjemmeside jeg kan lide", what: "Hvad min virksomhed laver", issue: "Hvad der ikke virker på min nuværende hjemmeside" },
};

export type AanvraagGegevens = { voornaam?: string; achternaam?: string; email?: string; mobiel?: string; bedrijf?: string; website?: string; voorbeeld?: string; wat?: string; nietgoed?: string };

export function aanvraagBericht(soort: AanvraagSoort, taal: Language, gegevens: AanvraagGegevens = {}): string {
  const w = woorden[taal];
  const regels = [w[soort], "", `${w.first}: ${gegevens.voornaam?.trim() || ""}`, `${w.last}: ${gegevens.achternaam?.trim() || ""}`, `${w.email}: ${gegevens.email?.trim() || ""}`];
  if (soort === "website") {
    for (const [label, value] of [[w.company, gegevens.bedrijf], [w.phone, gegevens.mobiel], [w.site, gegevens.website], [w.example, gegevens.voorbeeld], [w.what, gegevens.wat], [w.issue, gegevens.nietgoed]]) {
      if (value?.trim()) regels.push(`${label}: ${value.trim()}`);
    }
  }
  return regels.join("\n");
}

export function aanvraagWhatsApp(soort: AanvraagSoort, taal: Language, gegevens: AanvraagGegevens = {}): string {
  const bericht = aanvraagBericht(soort, taal, gegevens);
  if (heeftWhatsApp) return `https://wa.me/${WHATSAPP_NUMMER}?text=${encodeURIComponent(bericht)}`;
  return `mailto:${CONTACT_MAIL}?subject=${encodeURIComponent(woorden[taal][soort])}&body=${encodeURIComponent(bericht)}`;
}
