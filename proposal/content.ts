import { allProjects, webShowcaseProjects } from "../data/projects";
export const projects = [...webShowcaseProjects, ...allProjects];
export const people = [
  {
    name: "Marinus Bergsma",
    role: "Founder & Creative Art Director",
    image: "Marinus-Bergsma-V2.webp",
  },
  { name: "Jos Hollenberg", role: "Marketeer", image: "Jos-Hollenberg-1.webp" },
  {
    name: "Sergio Jovovic",
    role: "Meta Marketeer",
    image: "Sergio-Jovovic.webp",
  },
  {
    name: "Carmel Boon",
    role: "Video & Motion Editor",
    image: "Carmel-Boon-V2.webp",
  },
  {
    name: "Emma Peperkamp",
    role: "Fotograaf",
    image: "Emma-Peperkamp-V2.webp",
  },
  { name: "Nick van Keulen", role: "Google Ads Expert", image: "Nick-VK.webp" },
  {
    name: "Sid van Kalken",
    role: "Webdeveloper",
    image: "Sid-van-Kalken.webp",
  },
  {
    name: "Steef Komen",
    role: "Partner · Accountancy & Data",
    image: "Steef-Komen.webp",
  },
];
export const agents = [
  {
    id: "website",
    title: "Website",
    promise: "Een sterke digitale basis.",
    color: "#25D366",
    name: "Milo Website",
    label: "Persoonlijk ingericht",
    text: "Een website die bij je merk past. Met de techniek en koppelingen die jouw bedrijf nodig heeft.",
    video: "os-website",
  },
  {
    id: "crm",
    title: "CRM",
    promise: "Aandacht voor je klanten.",
    color: "#1965C2",
    name: "Milo CRM",
    label: "Verbonden met Odoo",
    text: "Klanten, leads en verkoop bij elkaar. Begin met inzicht vanuit je eigen Odoo-omgeving.",
    video: "os-crm",
  },
  {
    id: "content",
    title: "Studio",
    promise: "Content in jouw merkstijl.",
    color: "#F5940D",
    name: "Milo Content",
    label: "Inzicht vanuit Meta",
    text: "Zie wat je berichten doen. Bouw samen met ons aan een herkenbare lijn in je content.",
    video: "os-content",
  },
  {
    id: "ads",
    title: "Advertenties",
    promise: "Inzicht in je campagnes.",
    color: "#94A3B8",
    name: "Milo Ads",
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
      "Maak kennis met de vier Milo’s",
      "Verken de OS-omgeving",
      "Begin met je eigen Odoo en Meta",
    ],
    color: "#25D366",
    action: "Probeer het OS",
    href: "https://app.socialnow.nl/login/?bron=site",
    featured: true,
  },
  {
    name: "02 / Jouw Custom OS",
    price: "Op maat.",
    period: "Een persoonlijk voorstel",
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
      "Probeer eerst het systeem en maak kennis met de vier Milo’s. Zo ervaar je het overzicht voordat we samen je Custom OS gaan inrichten. Op de Odoo-beurs laten we je hiermee kennismaken.",
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
    question: "Wat doen de Milo’s?",
    answer:
      "De Milo’s geven de verschillende onderdelen van het OS een herkenbaar gezicht: website, klanten, content en advertenties. De video’s laten de productrichting zien. We spreken samen af welke functies voor jouw bedrijf beschikbaar zijn en welke persoonlijke inrichting vragen.",
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
export const logos = [
  ["AMSTERDAM-LIGHT-FESTIVAL-LOGO.webp", "Amsterdam Light Festival"],
  ["CHIN-CHIN-CLUB-LOGO.webp", "Chin Chin Club"],
  ["MOJO-LOGO.webp", "MOJO"],
  ["SUPPERCLUB-LOGO.webp", "Supperclub"],
  ["UNDER-ARMOUR-LOGO-1.webp", "Under Armour"],
];
