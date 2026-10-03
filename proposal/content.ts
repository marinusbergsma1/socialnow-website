import { allProjects, webShowcaseProjects } from "../data/projects";
import { CLAIM_URL } from "./os-entry";
export const projects = [...webShowcaseProjects, ...allProjects];
// 28 september 2026 (Marinus): zakelijkere functies, zoals "Head of".
export const people = [
  {
    name: "Marinus Bergsma",
    role: "Founder & CEO",
    image: "marinus-profiel-blauw.webp",
    // 3 oktober 2026 (Marinus): "het hele team trots met eigen bedrijfsnaam". Alleen bevestigde namen; de rest vraagt hij na.
    // Carmel, Sam, Emma en Pepijn: SOCIALNOW_EXPERTS in het OS (2 oktober 2026, "Alle vier akkoord").
    bedrijf: "SocialNow",
  },
  { name: "Jos Hollenberg", role: "Head of Meta Ads", image: "Jos-Hollenberg-1.webp" },
  {
    name: "Sergio Jovovic",
    // 28 september 2026 (Marinus): Sergio staat ook bij Meta Ads.
    role: "Meta Ads en automations specialist",
    image: "Sergio-Jovovic.webp",
  },
  {
    name: "Carmel Boon",
    role: "Head of Video Production",
    image: "Carmel-Boon-V2.webp",
    bedrijf: "By Carmel",
  },
  {
    name: "Sam van der Sluis",
    role: "Lead Videographer",
    image: "Sam-van-der-Sluis.webp",
    bedrijf: "Studio Sluis",
  },
  {
    name: "Emma Peperkamp",
    role: "Lead Photographer",
    image: "Emma-Peperkamp-V2.webp",
    bedrijf: "Your Social Haus",
  },
  { name: "Nick van Keulen", role: "Head of Google Ads & Search", image: "Nick-VK.webp" },
  // 25 september 2026 (Marinus): nieuw teamlid.
  { name: "Elian Coellar", role: "Head of Private Partnerships", image: "Elian-Coellar-2026-09-26.webp" },
  // 28 september 2026 (Marinus): Sid, Steef en Michelle krijgen betalingen met AI erbij.
  // Sid komt van zijn eigen bedrijf Attesso (linkedin.com/company/attesso).
  {
    name: "Sid van Kalken",
    role: "Head of Web Development & AI Payments · Attesso",
    image: "sid-attesso.webp",
    bedrijf: "Attesso",
  },
  // 1 oktober 2026 (Marinus): Douwe Kramer, co-founder van Attesso, met Sid het Attesso-team naast Marinus en Steef.
  {
    name: "Douwe Kramer",
    role: "Co-founder · Attesso",
    image: "Douwe-Kramer-attesso.webp",
    bedrijf: "Attesso",
  },
  {
    name: "Steef Komen",
    role: "Partner · Head of Finance, Data & AI Payments",
    image: "Steef-Komen.webp",
    bedrijf: "Komen Consultancy",
  },
  {
    name: "Michelle Yang",
    role: "Head of Supply Chain, Operations & AI Payments",
    image: "Michelle-Yang-kantoor.webp",
  },
  // 30 september 2026 (Marinus): nieuw teamlid.
  { name: "Tristan Slobbe", role: "Data & AI Engineer", image: "Tristan-Slobbe.webp" },
  // 3 oktober 2026 (Marinus): nieuwe teamleden.
  { name: "Antony Soosaipillaj", role: "Full-Stack AI Developer", image: "Antony-Soosaipillaj.webp" },
  { name: "Aren", role: "Senior Sales", image: "Aren.webp" },
  { name: "Youri van der Donk", role: "Senior Sales", image: "Youri-van-der-Donk.webp" },
  { name: "Isaak Munster", role: "Business Coach", image: "Isaak-Munster.webp" },
  // 3 oktober 2026 (Marinus): Pepijn en Armando erbij, met eigen bedrijf. Foto's uit ~/Movies/OS-VIDEO/85-our-story-final/
  // assets/team-wide; Armando staat in collectie85.py als "Designer · Bruggn Design" (nog te bevestigen door Marinus).
  { name: "Pepijn Bos", role: "Art Director", image: "Pepijn-Bos.webp", bedrijf: "Bos Design" },
  { name: "Armando van Bruggen", role: "Designer", image: "Armando-van-Bruggen.webp", bedrijf: "Bruggn Design" },
];
export const agents = [
  {
    id: "website",
    title: "Website",
    promise: "Een sterke digitale basis.",
    color: "#25D366",
    name: "Website",
    label: "Persoonlijk ingericht",
    text: "Een website die bij je merk past. Met de techniek en koppelingen die jouw bedrijf nodig heeft.",
    video: "os-website",
  },
  {
    id: "crm",
    title: "CRM",
    promise: "Aandacht voor je klanten.",
    color: "#1965C2",
    name: "CRM",
    label: "Verbonden met Odoo",
    text: "Klanten, leads en verkoop bij elkaar. Begin met inzicht vanuit je eigen Odoo-omgeving.",
    video: "os-crm",
  },
  {
    id: "content",
    title: "Studio",
    promise: "Content in jouw merkstijl.",
    color: "#F5940D",
    name: "Content",
    label: "Inzicht vanuit Meta",
    text: "Zie wat je berichten doen. Bouw samen met ons aan een herkenbare lijn in je content.",
    video: "os-content",
  },
  {
    id: "ads",
    title: "Advertenties",
    promise: "Inzicht in je campagnes.",
    color: "#EC1670",
    name: "Advertenties",
    label: "Inzicht vanuit Meta",
    text: "Breng uitgaven, klikken en leads samen. Bepaal met ons de volgende stap voor je campagnes.",
    video: "os-advertenties",
  },
];
export const services = [
  {
    id: "development",
    color: "#25D366",
    title: "Software & development",
    intro:
      "Van een sterke website tot een platform dat onderdeel wordt van je dagelijkse werk.",
    items: [
      "Maatwerksoftware & webapps",
      "Full-stack development",
      "API-koppelingen & integraties",
      "UI/UX design",
      "E-commerce",
      "Performance & Core Web Vitals",
    ],
  },
  {
    id: "seo",
    color: "#00A3E0",
    title: "SEO & vindbaarheid",
    intro:
      "Een goede basis voor mensen én zoekmachines, met duidelijke inhoud en een gezonde techniek.",
    items: [
      "Technische SEO",
      "Lokale vindbaarheid",
      "Zoekwoorden & contentstructuur",
      "Google Bedrijfsprofiel",
      "Linkbuilding",
    ],
  },
  {
    id: "advertising",
    color: "#F7E644",
    title: "Advertising",
    intro:
      "Campagnes met een duidelijk doel, gemaakt en begeleid door specialisten.",
    items: [
      "Google Ads & Shopping",
      "Meta Ads",
      "Performance Max",
      "Retargeting",
      "Media buying & geotargeting",
    ],
  },
  {
    id: "content",
    color: "#F62961",
    title: "Content & video",
    intro:
      "Van het eerste idee tot de uitwerking. Beeld en beweging waarin je je merk herkent.",
    items: [
      "Short-form video",
      "Video- & contentproductie",
      "Motion design & branding",
      "3D / CGI",
      "Social media",
      "Print & offline media",
    ],
  },
  {
    id: "branding",
    color: "#25D366",
    title: "Branding & strategie",
    intro:
      "Een eigen verhaal, met een identiteit die overal klopt. Digitaal én daarbuiten.",
    items: [
      "Merkstrategie",
      "Visuele & verbale identiteit",
      "Creative direction",
      "Merkpsychologie",
      "Campagneconcepten",
    ],
  },
  {
    id: "ai",
    color: "#00A3E0",
    title: "AI, data & optimalisatie",
    intro:
      "De juiste informatie en slimme automatisering, afgestemd op wat er echt nodig is.",
    items: [
      "Custom OS-inrichting",
      "Procesautomatisering",
      "AI-integraties",
      "Analytics & tracking",
      "Conversieoptimalisatie",
      "A/B-testen",
    ],
  },
];
export const prices = [
  {
    name: "01 / Probeer het OS",
    price: "Ervaar het OS.",
    period: "Je eerste stap",
    description:
      "Probeer het systeem en ervaar zelf het gemak en overzicht. Daarna bekijken we wat bij jouw bedrijf past.",
    items: [
      "Ontdek de vier onderdelen van het OS",
      "Verken de OS-omgeving",
      "Begin met je eigen Odoo en Meta",
    ],
    color: "#25D366",
    action: "Vraag gratis OS-demo aan",
    href: CLAIM_URL,
    featured: true,
  },
  {
    name: "02 / Jouw Custom OS",
    price: "Vanaf €10.000",
    period: "Een OS gebouwd rond je bedrijf",
    description:
      "Van je eerste ervaring met het OS naar een OS rond jouw bedrijf.",
    items: [
      "We brengen je werkwijze in kaart",
      "Afgesproken functies en koppelingen",
      "Persoonlijke inrichting en begeleiding",
    ],
    color: "#00A3E0",
    action: "Bespreek jouw Custom OS",
    to: "/contact?onderwerp=Custom%20OS",
  },
  {
    name: "03 / Verder met ons team",
    price: "Samen verder.",
    period: "Aanvullende samenwerking op maat",
    description:
      "Ook hulp bij de uitvoering? Onze specialisten bouwen met je mee.",
    items: [
      "Development en optimalisatie",
      "Branding, content en campagnes",
      "Inzet en kosten vooraf afgestemd",
    ],
    color: "#F62961",
    action: "Bespreek de samenwerking",
    to: "/contact?onderwerp=Custom%20OS%20met%20team",
  },
];
export const faqs = [
  {
    question: "Waar begin ik?",
    answer:
      "Log in op je gratis OS en kies: een nieuw bedrijf beginnen of je bestaande bedrijf koppelen. Wil je het helemaal rond je bedrijf, dan richten we je OS samen op maat in.",
  },
  {
    question: "Kan mijn eigen AI bij jullie data of code?",
    answer:
      "Nee. Je eigen AI-assistent koppel je met een eigen sleutel die alleen voor jouw werkruimte geldt en die je altijd kunt intrekken. Je AI kan vragen stellen en voorstellen maken, maar ziet nooit onze code of de gegevens van anderen. Niets verandert zonder jouw akkoord in het OS.",
  },
  {
    question: "Wat kost de boekhouding?",
    answer:
      "Odoo biedt één app gratis aan, zoals Facturatie. Die koppel je aan je OS. Wil je meer Odoo-apps, dan betaal je die rechtstreeks aan Odoo.",
  },
  {
    question: "Wat is een Custom OS?",
    answer:
      "Een bedrijfsomgeving die we inrichten rond de manier waarop jij en je team werken. Je eerste ervaring is het vertrekpunt. Samen bepalen we welke processen, koppelingen en onderdelen je bedrijf nodig heeft.",
  },
  {
    question: "Wat kan ik nu zelf proberen?",
    answer:
      "Claim je OS en doorloop Bedrijf, Odoo en Meta. Met geschikte accounts en toegangsrechten kun je gegevens uit je eigen Odoo en Meta verbinden. Welke informatie je ziet, hangt af van je koppelingen. De testomgeving is in ontwikkeling.",
  },
  {
    question: "Welke onderdelen brengt het OS samen?",
    answer:
      "Het OS brengt je website, CRM, content en advertenties samen. We spreken samen af welke functies voor jouw bedrijf beschikbaar zijn en welke persoonlijke inrichting vragen.",
  },
  {
    question: "Worden mijn advertenties automatisch beheerd?",
    answer:
      "Dit is geen standaardfunctie van de testomgeving. De Meta-koppeling geeft inzicht in je gegevens. Publiceren, budgetten wijzigen en campagnes beheren vragen een aparte, geteste inrichting.",
  },
  {
    question: "Kan ik ook alleen een website of campagne laten maken?",
    answer:
      "Ja. Je kunt bij ons terecht voor websites, development, branding, content, SEO en advertenties. Een Custom OS is een mogelijkheid; we kijken eerst naar wat je bedrijf nodig heeft.",
  },
  {
    question: "Wat kost een persoonlijk ingericht OS?",
    answer:
      "Dat hangt af van de processen, koppelingen en begeleiding. Na een kennismaking krijg je een voorstel met de afgesproken scope en kosten. Inrichting, koppelingen en eventuele doorlopende begeleiding worden afzonderlijk omschreven in je voorstel.",
  },
  {
    question: "Moet ik het OS installeren?",
    answer:
      "Je kunt het OS in je browser gebruiken. Bij Installeer OS staat korte uitleg voor je apparaat. De mogelijkheid om het als app toe te voegen hangt af van je browser en versie.",
  },
];
/* Het derde getal is de optische maat, 11 september 2026 (Marinus: "MOJO is hier nog wat te
   groot in vergelijking met de rest").
   Alle logo's kregen hetzelfde vak met object-fit: contain, en dan bepaalt de witruimte in het
   bestand hoe groot iets oogt. Een beeldmerk in een cirkel houdt lucht over en krimpt; een
   breed woordmerk als MOJO vult het vak tot de rand en domineert daardoor de hele rij. Een
   mens ziet geen gelijke vakken, hij ziet gelijk gewicht. Dit getal schaalt het vak, zodat ze
   naast elkaar even zwaar staan. 1 is de volle maat; leeg is ook 1. */
export const logos: [string, string, number?][] = [
  // 23 september 2026 (Marinus): "AZ wil ik daar graag ook bij". Eenkleurig, zoals de rest.
  // 24 september 2026 (Marinus): "AZ mag nog ietsje kleiner en zoals op de flyer", "er moet een wit vlak onder":
  // het logo zwart op een witte pil, en een fractie kleiner.
  // 25 september 2026 (Marinus): "AZ is nog iets te groot en ook verkeerd". Nu het logo van de flyer
  // (schuine witte onderkant) in eigen kleur, zonder de grijsfilter van de balk (h-logo-eigen).
  // 30 september 2026: Odoo en Salesforce staan in de integratieregel onder de kop; deze balk is "Trusted by", alleen merken.
  // 30 september 2026 (Marinus): "gewoon hun kleur maar in ieder geval logo groter". De vierkante bestanden hadden tot 79%
  // lege rand (MOJO vulde 21% van de hoogte); images/merken/ bevat dezelfde logo's bijgesneden tot op 2% rand. De maat is
  // optisch: brede woordmerken lager, vierkante merken vol.
  // 30 september 2026 (Marinus): "VERKEERDE AZ LOGO OOK MAG GEWOON DIE IN KLEUR ZIJN". Het officiële AZ-logo (rood, wit,
  // zwart) als vector uit 90-ARCHIEF/uitzoeken-2026/Downloads/AZ_Alkmaar_FC-brandlogos.net.
  ["merken/AZ-LOGO-KLEUR.svg", "AZ", 0.62],
  ["merken/AMSTERDAM-LIGHT-FESTIVAL-LOGO.webp", "Amsterdam Light Festival", 0.95],
  // 30 september 2026 (Marinus): "Vol wit wil ik graag. Maar Light Art Collection erbij. DIVINE erbij kWh Garant erbij,
  // Primefone een goeie erbij." Bronnen: LAC LOGO WIT.eps (Illustrator, juli 2025), kwh-logo-wit.svg uit de OS-films,
  // pf-logo-text-white.svg (woordmerk; het beeldmerk werd in vol wit een dicht vlak) uit het PrimeFone-thema en DIVINE logo.svg uit de merkmap; alle vier vol wit gemaakt.
  ["merken/LIGHT-ART-COLLECTION-LOGO.webp", "Light Art Collection", 0.62],
  ["merken/CHIN-CHIN-CLUB-LOGO.webp", "Chin Chin Club"],
  ["merken/KWH-GARANT-LOGO.svg", "kWh Garant", 0.5],
  ["merken/MOJO-LOGO.webp", "MOJO", 0.42],
  ["merken/DIVINE-LOGO.svg", "DIVINE", 0.34],
  ["merken/SUPPERCLUB-LOGO.webp", "Supperclub", 0.95],
  ["merken/PRIMEFONE-LOGO.svg", "PrimeFone", 0.5],
  // 10 september 2026: het bestand UNDER-ARMOUR-LOGO-1.webp bevat het beeldmerk van Universal,
  // niet van Under Armour. Het werk voor Universal staat in data/projects.ts (banners voor
  // filmreleases van Universal en Sony); daarom hoort hier de naam Universal bij dit beeld.
  ["merken/UNDER-ARMOUR-LOGO-1.webp", "Universal", 0.72],
];
