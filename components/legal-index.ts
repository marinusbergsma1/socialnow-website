// Alle juridische documenten op één plek — 19 september 2026.
//
// De hubpagina (/juridisch), de voettekst en scripts/legal-pdf.mjs lezen deze lijst. Komt er een
// document bij, dan hoeft het maar op één plek te worden aangemeld en staat het overal.
import type { LegalDocument } from "./legal";
import { terms, privacy } from "./legal";
import { dpa } from "./legal-verwerker";
import { cookies, ai } from "./legal-cookies";
import { beveiliging, gebruik } from "./legal-beveiliging";

export const DOCUMENTEN: LegalDocument[] = [
  {
    slug: "voorwaarden", path: "/voorwaarden", doc: terms,
    waarvoor: {
      nl: "De afspraken over opdrachten, prijzen, levering, aansprakelijkheid en het gebruik van het OS.",
      en: "The arrangements on assignments, prices, delivery, liability and the use of the OS.",
    },
  },
  {
    slug: "privacy", path: "/privacy", doc: privacy,
    waarvoor: {
      nl: "Welke gegevens wij van jou verwerken, waarom, hoe lang, en welke rechten je hebt.",
      en: "What data we process about you, why, for how long, and what rights you have.",
    },
  },
  {
    slug: "verwerkersovereenkomst", path: "/verwerkersovereenkomst", doc: dpa,
    waarvoor: {
      nl: "Nodig zodra jij gegevens over mensen in het OS zet. Dit is de overeenkomst die artikel 28 AVG verplicht stelt, met de subverwerkers en de beveiligingsmaatregelen als bijlage.",
      en: "Needed as soon as you put data about people into the OS. This is the agreement required by Article 28 GDPR, with the sub-processors and security measures as annexes.",
    },
  },
  {
    slug: "beveiliging", path: "/beveiliging", doc: beveiliging,
    waarvoor: {
      nl: "Hoe wij jouw gegevens beschermen, wat er gebeurt bij een lek, en hoe je een kwetsbaarheid meldt.",
      en: "How we protect your data, what happens in a breach, and how to report a vulnerability.",
    },
  },
  {
    slug: "cookies", path: "/cookies", doc: cookies,
    waarvoor: {
      nl: "Wat wij in je browser bewaren, hoe lang, en waar je het uitzet. Per cookie, niet als categorie.",
      en: "What we store in your browser, for how long, and where you switch it off. Per cookie, not per category.",
    },
  },
  {
    slug: "ai", path: "/ai", doc: ai,
    waarvoor: {
      nl: "Welke AI-modellen het OS gebruikt, wat er met jouw invoer gebeurt, en wie verantwoordelijk is voor wat er gepubliceerd wordt.",
      en: "Which AI models the OS uses, what happens to your input, and who is responsible for what gets published.",
    },
  },
  {
    slug: "gebruik", path: "/gebruik", doc: gebruik,
    waarvoor: {
      nl: "Wat wel en niet mag met het OS, onze hosting en onze e-mail, en wat wij doen als het misgaat.",
      en: "What is and is not allowed with the OS, our hosting and our e-mail, and what we do when it goes wrong.",
    },
  },
];

export const documentVoorSlug = (slug: string) => DOCUMENTEN.find((d) => d.slug === slug) || null;
