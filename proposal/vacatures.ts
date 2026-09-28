// 28 september 2026 (Marinus): een échte vacature voor de partij die de verbindende laag brengt, plus de functies
// die we nu nodig hebben nu duizenden bedrijven het OS gaan gebruiken. Eén bron voor /vacatures en voor de
// Indeed-teksten (scripts/vacatures-indeed.mjs). Senior AI Engineer en de salarisgegevens komen uit de Indeed-chat
// (tak claude/vacatures, b359a38). AI-expert betalingen is weg: die functie vervult Sid (Marinus, 28 sep 2026).
// Salaris alleen waar een voorstel is; de andere functies noemen het (nog) niet.

export type Vacature = {
  slug: string;
  titel: string;
  soort: string;
  uren: string;
  kort: string;
  wat: string[];
  wie: string[];
  uitgelicht?: boolean;
  plek?: string;
  salaris?: string;
  salarisMin?: number;
  salarisMax?: number;
  samen?: string;
};

export const vacatures: Vacature[] = [
  {
    slug: "partner-verbindende-laag",
    titel: "Partner: de verbindende laag",
    soort: "Bureau of team",
    uren: "Samenwerking",
    uitgelicht: true,
    kort: "Een bureau of groep mensen die samen met ons het persoonlijke contact met duizenden ondernemers verzorgt.",
    wat: [
      "Je bent het vaste aanspreekpunt voor ondernemers die met het SocialNow OS werken",
      "Je begeleidt ze van de eerste dag tot hun eerste winstgevende maanden",
      "Je schaalt je team mee met het aantal bedrijven op het OS",
      "Je werkt direct samen met onze experts in advertenties, content, web en data",
    ],
    wie: [
      "Je hebt een team dat ondernemers persoonlijk helpt, of je wilt het met ons bouwen",
      "Je ziet AI als hulp, niet als bedreiging",
      "Menselijk contact staat bij jou voorop",
    ],
  },
  {
    slug: "senior-ai-engineer",
    titel: "Senior AI Engineer",
    soort: "Loondienst",
    uren: "32 tot 40 uur",
    plek: "Amsterdam, hybride",
    salaris: "€5.000 tot €7.000 bruto per maand",
    salarisMin: 5000,
    salarisMax: 7000,
    samen: "Je werkt direct met Marinus Bergsma en met Sid van Kalken, Head of Web Development.",
    kort: "Je maakt Milo slimmer: de AI-agents in SocialNow OS die offertes maken, content schrijven en data uit Odoo lezen.",
    wat: [
      "Je bouwt en verbetert agents die met tools werken: Odoo, e-mail, agenda en social kanalen.",
      "Je meet de kwaliteit van antwoorden met vaste testsets voordat iets live gaat.",
      "Je houdt kosten en snelheid per model in de gaten en kiest het juiste model per taak.",
      "Je zorgt dat klantgegevens in de eigen werkruimte blijven.",
    ],
    wie: [
      "Minimaal vijf jaar ervaring als software-engineer, waarvan twee met taalmodellen in productie.",
      "Sterk in TypeScript en Node.js.",
      "Ervaring met tool-use, retrieval en evaluatie van AI-uitvoer.",
      "Je levert werk op dat je zelf hebt getest.",
    ],
  },
  {
    slug: "customer-success-manager",
    titel: "Customer Success Manager",
    soort: "Loondienst",
    uren: "32 tot 40 uur",
    kort: "Je zorgt dat elke klant resultaat haalt met het OS en weet dat er altijd iemand klaarstaat.",
    wat: [
      "Je volgt een vaste groep klanten en kent hun bedrijf",
      "Je signaleert kansen en problemen voordat de klant ze merkt",
      "Je vertaalt feedback van klanten naar verbeteringen in het OS",
    ],
    wie: [
      "Een paar jaar ervaring in klantcontact, accountmanagement of marketing",
      "Je schrijft en spreekt goed Nederlands en Engels",
      "Je wordt blij van de groei van een ander",
    ],
  },
  {
    slug: "onboarding-specialist",
    titel: "Onboarding Specialist",
    soort: "Loondienst",
    uren: "24 tot 40 uur",
    kort: "Je helpt nieuwe ondernemers in hun eerste week op weg: merk, website, socials en Odoo gekoppeld.",
    wat: [
      "Je loopt met nieuwe klanten hun eerste stappen in het OS door",
      "Je koppelt hun kanalen en zet hun merk goed neer",
      "Je maakt uitleg en video's zodat de volgende klant het zelf kan",
    ],
    wie: [
      "Je legt technische dingen eenvoudig uit",
      "Je bent geduldig, precies en vriendelijk",
      "Duits of Frans is een pre",
    ],
  },
  {
    slug: "odoo-consultant",
    titel: "Odoo Consultant",
    soort: "Loondienst of freelance",
    uren: "32 tot 40 uur",
    plek: "Amsterdam, hybride en bij klanten",
    salaris: "€4.000 tot €5.500 bruto per maand",
    salarisMin: 4000,
    salarisMax: 5500,
    samen: "Je werkt met Michelle Yang, Head of Supply Chain & Operations, en met Steef Komen.",
    kort: "Je richt Odoo in voor onze klanten en verbindt het met het SocialNow OS.",
    wat: [
      "Je brengt processen van klanten in kaart en richt Odoo daarop in",
      "Je werkt samen met onze Odoo-implementatiepartners",
      "Je bouwt mee aan het OS op maat",
    ],
    wie: [
      "Ervaring met Odoo, bij voorkeur versie 17 of nieuwer",
      "Kennis van CRM, verkoop en facturatie",
      "Je denkt als ondernemer mee",
    ],
  },
  {
    slug: "account-manager",
    titel: "Account Manager",
    soort: "Loondienst",
    uren: "32 tot 40 uur",
    kort: "Je laat ondernemers zien wat het OS voor ze kan doen en begeleidt ze naar een pakket of OS op maat.",
    wat: [
      "Je voert gesprekken met ondernemers die het gratis OS gebruiken",
      "Je stelt voorstellen op voor pakketten en maatwerk",
      "Je bent aanwezig op beurzen en events",
    ],
    wie: [
      "Ervaring in verkoop van software of marketingdiensten",
      "Je verkoopt door te luisteren, niet door te duwen",
      "Rijbewijs is handig",
    ],
  },
  {
    slug: "support-medewerker",
    titel: "Supportmedewerker",
    soort: "Loondienst of parttime",
    uren: "16 tot 40 uur",
    kort: "Je bent de stem van SocialNow in de chat en aan de telefoon. Snel, menselijk en in meerdere talen.",
    wat: [
      "Je beantwoordt vragen via chat, mail, WhatsApp en telefoon",
      "Je lost problemen op of zet ze door naar het juiste teamlid",
      "Je houdt de hulpartikelen actueel",
    ],
    wie: [
      "Je schrijft foutloos Nederlands en Engels, een derde taal is een pre",
      "Je blijft rustig als het druk is",
      "Studenten zijn ook welkom",
    ],
  },
  {
    slug: "content-creator",
    titel: "Content Creator",
    soort: "Loondienst of freelance",
    uren: "24 tot 40 uur",
    kort: "Je maakt content voor klanten met de Studio in het OS, en laat zien hoe mens en AI samen sterker zijn.",
    wat: [
      "Je maakt posts, reels en advertenties voor klanten",
      "Je werkt met de AI-studio en voegt het menselijke oog toe",
      "Je filmt en fotografeert op locatie met ons videoteam",
    ],
    wie: [
      "Een portfolio met social content",
      "Ervaring met video en fotografie",
      "Gevoel voor merk en tone of voice",
    ],
  },
  {
    slug: "performance-marketeer",
    titel: "Performance Marketeer",
    soort: "Loondienst",
    uren: "32 tot 40 uur",
    kort: "Je beheert Meta- en Google-campagnes voor onze klanten, samen met onze Heads of Ads.",
    wat: [
      "Je zet campagnes op en optimaliseert ze op resultaat",
      "Je rapporteert helder aan klanten wat hun geld oplevert",
      "Je helpt de advertentie-agent in het OS slimmer te maken",
    ],
    wie: [
      "Ervaring met Meta Ads en of Google Ads",
      "Je houdt van cijfers en van mensen",
      "Certificeringen zijn een pre",
    ],
  },
  {
    slug: "full-stack-developer",
    titel: "Full-stack Developer",
    soort: "Loondienst of freelance",
    uren: "32 tot 40 uur",
    kort: "Je bouwt aan het SocialNow OS zelf: websites, koppelingen en de AI-laag voor duizenden bedrijven.",
    wat: [
      "Je bouwt nieuwe onderdelen in het OS",
      "Je koppelt systemen als Odoo, Salesforce en sociale kanalen",
      "Je zorgt dat het OS snel en veilig blijft als het groeit",
    ],
    wie: [
      "Ervaring met TypeScript, React en Node",
      "Je hebt gewerkt met AI-modellen en API's",
      "Veiligheid en privacy neem je serieus",
    ],
  },
];
