// 28 september 2026 (Marinus): een échte vacature voor de partij die de verbindende laag brengt, plus de functies
// die we nu nodig hebben nu duizenden bedrijven het OS gaan gebruiken. Eén bron voor /vacatures en voor de
// Indeed-teksten (scripts/vacatures-indeed.mjs). Senior AI Engineer en de salarisgegevens komen uit de Indeed-chat
// (tak claude/vacatures, b359a38). AI-expert betalingen is weg: die functie vervult Sid (Marinus, 28 sep 2026).
// Salaris alleen waar een voorstel is; de andere functies noemen het (nog) niet.

// 28 september 2026 (Marinus): alle vacatures lopen via de eigen site; Steef Komen beheert vacatures en sollicitaties.
// offer@ is een alias op info@ bij Hostinger.
export const VACATURE_MAIL = "offer@socialnow.nl";
export const vacatureMail = (titel: string) =>
  `mailto:${VACATURE_MAIL}?subject=${encodeURIComponent(`Sollicitatie: ${titel}`)}`;

// 28 september 2026 (Marinus): investeerders nemen contact op met Steef via finance@ (alias op info@ bij Hostinger).
// Later die nacht (Marinus): "Investeerders moeten gewoon een aanvraag kunnen doen, naar invest@socialnow.nl". De aanvraag
// staat op /investeerders; invest@ is ook een alias op info@. finance@ blijft bestaan als alias.
export const INVEST_MAIL = "invest@socialnow.nl";
export const FINANCE_MAIL = INVEST_MAIL;
export const financeMail = (onderwerp: string) => `mailto:${INVEST_MAIL}?subject=${encodeURIComponent(onderwerp)}`;

// 19 oktober 2026 (Marinus): "Er moet een pagina komen waarin een hoop banen staan waar mensen zich voor aan kunnen
// melden." De functies staan per team, zodat je op /vacatures kunt filteren. Nieuwe functies hebben (nog) geen salaris.
export const TEAMS = ["Klanten", "Sales", "Marketing en content", "Tech en AI", "Operations en finance", "Stages"] as const;
export type Team = (typeof TEAMS)[number];

export type Vacature = {
  slug: string;
  team: Team;
  sinds?: string;
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
    team: "Klanten",
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
    team: "Tech en AI",
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
    team: "Klanten",
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
    team: "Klanten",
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
    team: "Operations en finance",
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
    team: "Sales",
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
    team: "Klanten",
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
    team: "Marketing en content",
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
    team: "Marketing en content",
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
    team: "Tech en AI",
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
  // 19 oktober 2026: dertien functies erbij, zonder salaris tot er een voorstel is.
  // Marinus later die dag: "Graag ook even Growth Manager als baan erbij zetten."
  {
    slug: "growth-manager",
    team: "Marketing en content",
    sinds: "2026-10-19",
    titel: "Growth Manager",
    soort: "Loondienst",
    uren: "32 tot 40 uur",
    plek: "Amsterdam, hybride",
    samen: "Je werkt direct met Marinus Bergsma.",
    kort: "Je laat SocialNow groeien: meer ondernemers op het OS en meer experts op Connect.",
    wat: [
      "Je bedenkt en test groeikanalen, van advertenties tot partnerships",
      "Je verbetert elke stap van eerste bezoek tot betalende klant",
      "Je stuurt op cijfers en deelt elke week wat werkt",
    ],
    wie: [
      "Een paar jaar ervaring met groei bij een startup of scale-up",
      "Je combineert data, marketing en product",
      "Je test snel en stopt net zo snel met wat niet werkt",
    ],
  },
  {
    slug: "sales-development-representative",
    team: "Sales",
    sinds: "2026-10-19",
    titel: "Sales Development Representative",
    soort: "Loondienst of parttime",
    uren: "24 tot 40 uur",
    kort: "Je legt het eerste contact met ondernemers en plant gesprekken voor ons team.",
    wat: [
      "Je belt en mailt ondernemers die baat hebben bij het OS",
      "Je plant kennismakingen in voor accountmanagers en experts",
      "Je houdt het CRM in het OS bij, zodat niemand dubbel wordt gebeld",
    ],
    wie: [
      "Je pakt graag de telefoon en durft door te vragen",
      "Je schrijft korte, persoonlijke berichten",
      "Ervaring in sales is fijn, maar niet nodig",
    ],
  },
  {
    slug: "meta-ads-specialist",
    team: "Marketing en content",
    sinds: "2026-10-19",
    titel: "Meta Ads Specialist",
    soort: "Loondienst of freelance",
    uren: "24 tot 40 uur",
    samen: "Je werkt met Sergio Jovovic, Head of Meta Ads.",
    kort: "Je bouwt en optimaliseert campagnes op Facebook en Instagram die echt omzet opleveren.",
    wat: [
      "Je zet campagnes, doelgroepen en tests op in Meta Ads Manager",
      "Je optimaliseert wekelijks op kosten per klant",
      "Je bespreekt met de content creators welke beelden werken",
    ],
    wie: [
      "Minimaal twee jaar ervaring met Meta Ads",
      "Je kent de Pixel, de Conversions API en tracking",
      "Je stuurt op cijfers en legt ze helder uit",
    ],
  },
  {
    slug: "google-ads-specialist",
    team: "Marketing en content",
    sinds: "2026-10-19",
    titel: "Google Ads Specialist",
    soort: "Loondienst of freelance",
    uren: "24 tot 40 uur",
    samen: "Je werkt met Nick van Keulen, Head of Google Ads & Search.",
    kort: "Je zorgt dat klanten gevonden worden op het moment dat iemand zoekt.",
    wat: [
      "Je beheert Search-, Shopping- en Performance Max-campagnes",
      "Je doet zoekwoordonderzoek en schrijft advertentieteksten",
      "Je meet conversies goed in, van klik tot klant",
    ],
    wie: [
      "Ervaring met Google Ads en Google Analytics 4",
      "Je werkt precies en houdt van testen",
      "Een Google Ads-certificering is een pre",
    ],
  },
  {
    slug: "social-media-manager",
    team: "Marketing en content",
    sinds: "2026-10-19",
    titel: "Social Media Manager",
    soort: "Loondienst of freelance",
    uren: "24 tot 40 uur",
    kort: "Je plant en beheert de socials van onze klanten, met de planner in het OS.",
    wat: [
      "Je maakt contentkalenders voor meerdere klanten",
      "Je reageert op berichten en houdt de community levend",
      "Je rapporteert maandelijks wat werkt en wat niet",
    ],
    wie: [
      "Je kent Instagram, TikTok, LinkedIn en Facebook van binnen en buiten",
      "Je schrijft goed en snel",
      "Je bent georganiseerd en houdt overzicht over meerdere merken",
    ],
  },
  {
    slug: "video-editor",
    team: "Marketing en content",
    sinds: "2026-10-19",
    titel: "Video Editor",
    soort: "Freelance of loondienst",
    uren: "16 tot 40 uur",
    kort: "Je monteert reels, advertenties en uitlegfilms die in de eerste seconde pakken.",
    wat: [
      "Je monteert korte video's voor social en advertenties",
      "Je maakt ondertitels, motion en geluid af",
      "Je werkt samen met ons foto- en videoteam en met de AI-studio",
    ],
    wie: [
      "Een showreel met korte video's",
      "Ervaring met Premiere Pro, DaVinci Resolve of After Effects",
      "Gevoel voor ritme en tempo",
    ],
  },
  {
    slug: "brand-designer",
    team: "Marketing en content",
    sinds: "2026-10-19",
    titel: "Brand Designer",
    soort: "Freelance of loondienst",
    uren: "24 tot 40 uur",
    kort: "Je geeft ondernemers een merk waar ze trots op zijn: logo, kleuren, stijl en templates.",
    wat: [
      "Je ontwerpt complete huisstijlen voor nieuwe klanten",
      "Je zet het merk door in templates voor de Studio in het OS",
      "Je bewaakt dat elke uiting bij het merk past",
    ],
    wie: [
      "Een portfolio met merkidentiteiten",
      "Sterk in Figma en Adobe",
      "Je kunt je keuzes uitleggen aan een ondernemer",
    ],
  },
  {
    slug: "copywriter",
    team: "Marketing en content",
    sinds: "2026-10-19",
    titel: "Copywriter",
    soort: "Freelance of parttime",
    uren: "16 tot 32 uur",
    kort: "Je schrijft websites, advertenties en posts in de stem van de klant, en maakt AI-teksten menselijk.",
    wat: [
      "Je schrijft webteksten, advertenties en mails",
      "Je redigeert teksten uit de AI-studio tot ze klinken als de klant",
      "Je legt per klant de tone of voice vast",
    ],
    wie: [
      "Je schrijft foutloos Nederlands, Engels is een pre",
      "Je schrijft kort en concreet",
      "Een portfolio met verschillende soorten teksten",
    ],
  },
  {
    slug: "ux-ui-designer",
    team: "Tech en AI",
    sinds: "2026-10-19",
    titel: "UX/UI Designer",
    soort: "Loondienst of freelance",
    uren: "32 tot 40 uur",
    kort: "Je ontwerpt de schermen van het OS en van Connect, zodat elke ondernemer ze meteen snapt.",
    wat: [
      "Je ontwerpt nieuwe schermen voor web en mobiel",
      "Je test ontwerpen met echte ondernemers",
      "Je houdt het design system in Figma bij",
    ],
    wie: [
      "Een portfolio met productontwerp voor web en apps",
      "Sterk in Figma en in eenvoud",
      "Je denkt mee over wat er wel en niet op een scherm hoort",
    ],
  },
  {
    slug: "data-analist",
    team: "Tech en AI",
    sinds: "2026-10-19",
    titel: "Data-analist",
    soort: "Loondienst",
    uren: "32 tot 40 uur",
    kort: "Je maakt van data uit Odoo, advertenties en het OS heldere dashboards voor ondernemers.",
    wat: [
      "Je bouwt dashboards en rapportages in het OS",
      "Je koppelt data uit Odoo, Meta en Google",
      "Je zorgt dat cijfers kloppen en goed te lezen zijn",
    ],
    wie: [
      "Ervaring met SQL en met dashboards",
      "Je legt cijfers uit in gewone taal",
      "Privacy en nauwkeurigheid neem je serieus",
    ],
  },
  {
    slug: "financieel-medewerker",
    team: "Operations en finance",
    sinds: "2026-10-19",
    titel: "Financieel medewerker",
    soort: "Loondienst of parttime",
    uren: "24 tot 40 uur",
    samen: "Je werkt met Steef Komen, Head of Finance & Data.",
    kort: "Je houdt de boekhouding van SocialNow en Connect op orde, in Odoo.",
    wat: [
      "Je verwerkt facturen, betalingen en uitbetalingen aan experts",
      "Je bereidt btw-aangiftes en maandafsluitingen voor",
      "Je helpt klanten met vragen over hun facturen",
    ],
    wie: [
      "Een mbo- of hbo-opleiding in financiële richting",
      "Ervaring met Odoo of een ander boekhoudpakket",
      "Je werkt nauwkeurig en houdt van overzicht",
    ],
  },
  {
    slug: "stage-marketing-content",
    team: "Stages",
    sinds: "2026-10-19",
    titel: "Stagiair marketing en content",
    soort: "Stage",
    uren: "32 tot 40 uur",
    kort: "Je leert hoe je met mens en AI samen content en campagnes maakt voor echte klanten.",
    wat: [
      "Je maakt content voor klanten en voor SocialNow zelf",
      "Je helpt bij campagnes op Meta en Google",
      "Je doet een eigen onderzoek dat we echt gebruiken",
    ],
    wie: [
      "Je studeert marketing, communicatie of media op mbo- of hbo-niveau",
      "Je bent nieuwsgierig naar AI",
      "Je pakt zelf dingen op",
    ],
  },
  {
    slug: "stage-development",
    team: "Stages",
    sinds: "2026-10-19",
    titel: "Stagiair development",
    soort: "Stage",
    uren: "32 tot 40 uur",
    kort: "Je bouwt mee aan het OS en leert werken met AI-agents in productie.",
    wat: [
      "Je bouwt kleine onderdelen in het OS, van idee tot live",
      "Je schrijft tests voordat iets live gaat",
      "Je werkt met senior developers aan echte vragen van klanten",
    ],
    wie: [
      "Je studeert informatica of software development",
      "Je kent JavaScript of TypeScript",
      "Je vraagt hulp als je vastzit en deelt wat je leert",
    ],
  },
];
