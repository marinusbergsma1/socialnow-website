// 28 september 2026 (Marinus): serieuze functies die we via Indeed uitzetten en die ook op de
// homepage staan. Eén bron: de homepagetegels, /vacatures, de JobPosting-gegevens voor Google en de
// Indeed-teksten in VACATURES-INDEED.md komen allemaal uit deze lijst.
// De functie "AI-expert betalingen" staat bovenaan op verzoek van Marinus.
// Zet indeed op de vacaturelink zodra de vacature op Indeed live staat; tot dan solliciteer je per mail.

export type Vacature = {
  slug: string;
  titel: string;
  kort: string;
  uren: string;
  plek: string;
  salaris: string;
  salarisMin: number;
  salarisMax: number;
  urenMin: number;
  urenMax: number;
  samen: string;
  taken: string[];
  jij: string[];
  indeed?: string;
};

export const vacatures: Vacature[] = [
  {
    slug: "ai-expert-betalingen",
    titel: "AI-expert betalingen",
    kort: "Je bouwt de betaallaag van SocialNow OS: van offerte en factuur tot betaling en afletteren in Odoo, met AI die het werk doet.",
    uren: "32 tot 40 uur",
    plek: "Amsterdam, hybride",
    salaris: "€5.500 tot €7.500 bruto per maand",
    salarisMin: 5500,
    salarisMax: 7500,
    urenMin: 32,
    urenMax: 40,
    samen: "Je werkt direct met Marinus Bergsma en met Steef Komen, Head of Finance & Data.",
    taken: [
      "Je koppelt betaalproviders zoals Mollie, Stripe en Adyen aan het OS: iDEAL, kaart, SEPA-incasso en terugkerende betalingen.",
      "Je laat AI facturen opstellen, betalingen herkennen en automatisch afletteren in Odoo.",
      "Je bouwt signalering op betaalrisico: late betalers, afwijkende bedragen en mogelijke fraude.",
      "Je zorgt dat alles klopt met PSD2, de AVG en de eisen van betaalproviders.",
      "Je vertaalt wat een klant wil in een betaalstroom die in één tik werkt.",
    ],
    jij: [
      "Minimaal vijf jaar ervaring met betalingen, fintech of financiële systemen.",
      "Je hebt zelf gebouwd met een betaal-API en weet hoe webhooks, terugboekingen en afletteren werken.",
      "Je werkt dagelijks met AI-modellen en weet waar ze wel en niet te vertrouwen zijn.",
      "Kennis van Odoo Boekhouding of een ander ERP is een sterk pluspunt.",
      "Je spreekt Nederlands of Engels op hoog niveau.",
    ],
  },
  {
    slug: "senior-ai-engineer",
    titel: "Senior AI Engineer",
    kort: "Je maakt Milo slimmer: de AI-agents in SocialNow OS die offertes maken, content schrijven en data uit Odoo lezen.",
    uren: "32 tot 40 uur",
    plek: "Amsterdam, hybride",
    salaris: "€5.000 tot €7.000 bruto per maand",
    salarisMin: 5000,
    salarisMax: 7000,
    urenMin: 32,
    urenMax: 40,
    samen: "Je werkt direct met Marinus Bergsma en met Sid van Kalken, Head of Web Development.",
    taken: [
      "Je bouwt en verbetert agents die met tools werken: Odoo, e-mail, agenda en social kanalen.",
      "Je meet de kwaliteit van antwoorden met vaste testsets voordat iets live gaat.",
      "Je houdt kosten en snelheid per model in de gaten en kiest het juiste model per taak.",
      "Je zorgt dat klantgegevens in de eigen werkruimte blijven.",
    ],
    jij: [
      "Minimaal vijf jaar ervaring als software-engineer, waarvan twee met taalmodellen in productie.",
      "Sterk in TypeScript en Node.js.",
      "Ervaring met tool-use, retrieval en evaluatie van AI-uitvoer.",
      "Je levert werk op dat je zelf hebt getest.",
    ],
  },
  {
    slug: "odoo-consultant",
    titel: "Odoo-consultant implementatie",
    kort: "Je richt Odoo in bij onze klanten en verbindt het met SocialNow OS, zodat CRM, facturatie en marketing samenwerken.",
    uren: "32 tot 40 uur",
    plek: "Amsterdam, hybride en bij klanten",
    salaris: "€4.000 tot €5.500 bruto per maand",
    salarisMin: 4000,
    salarisMax: 5500,
    urenMin: 32,
    urenMax: 40,
    samen: "Je werkt met Michelle Yang, Head of Supply Chain & Operations, en met Steef Komen.",
    taken: [
      "Je brengt de processen van een klant in kaart en vertaalt ze naar Odoo.",
      "Je richt CRM, Verkoop, Boekhouding en Voorraad in en migreert bestaande data.",
      "Je traint teams van klanten en blijft hun eerste aanspreekpunt.",
    ],
    jij: [
      "Minimaal drie jaar ervaring met Odoo-implementaties.",
      "Je begrijpt boekhouding en voorraad op het niveau van een controller.",
      "Je legt ingewikkelde dingen eenvoudig uit.",
    ],
  },
];

export const sollicitatieMail = (titel: string) =>
  `mailto:info@socialnow.nl?subject=${encodeURIComponent(`Sollicitatie ${titel}`)}`;
