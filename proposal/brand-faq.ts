import type { Language } from "./i18n/context";

export type BrandFaqId = "connection" | "partners" | "free-os" | "custom" | "human-ai" | "odoo";
export interface BrandFaqItem {
  readonly id: BrandFaqId;
  readonly question: string;
  readonly answer: string;
}
export interface BrandFaqContent {
  readonly heading: string;
  readonly items: readonly BrandFaqItem[];
}

// Confirmed SocialNow offer and relationships; translations live here so rendered
// answers and any future structured data can use exactly the same source.
const faq: Record<Language, BrandFaqContent> = {
  nl: {
    heading: "Veelgestelde vragen over SocialNow",
    items: [
      { id: "connection", question: "Wat is SocialNow?", answer: "SocialNow is een bedrijf en partnernetwerk voor branding, content, marketing en software. Connect verbindt klanten en zelfstandige ondernemers. SocialNow OS is een onderdeel van SocialNow." },
      { id: "partners", question: "Wat is een SocialNow-partner?", answer: "Een partner is een zelfstandige ondernemer die expertise bijdraagt aan producten en opdrachten voor klanten. Partners werken vanuit hun eigen onderneming samen met SocialNow." },
      { id: "free-os", question: "Hoeveel kost het SocialNow OS?", answer: "Je gebruikt het SocialNow OS gratis tot 10 GB opslag; zolang je daaronder blijft, schrijven we niets af. Tokens voor de Studio kosten €10, €25 of €50 per maand. Hulppakketten met een custom OS en een gratis website beginnen vanaf €3.000 per maand. Alles is maandelijks." },
      { id: "custom", question: "Hoe werkt maatwerk en wie betaalt de partners?", answer: "Bij maatwerk organiseert en betaalt SocialNow B.V. de juiste partners. Je krijgt een voorstel op maat en hebt één aanspreekpunt. SocialNow bewaakt de kwaliteit." },
      { id: "human-ai", question: "Hoe combineert SocialNow menselijk contact en AI?", answer: "Persoonlijk contact blijft centraal staan. AI-technologie ondersteunt de producten en het werk van onze partners. Human Connection. Powered by AI Technology." },
      { id: "odoo", question: "Heb ik Odoo nodig voor SocialNow OS?", answer: "Nee. Odoo is een optionele koppeling voor bedrijven die hun Odoo-omgeving met SocialNow OS willen verbinden. Odoo is geen vereiste om met SocialNow OS te starten." },
    ],
  },
  en: {
    heading: "Frequently asked questions about SocialNow",
    items: [
      { id: "connection", question: "What is SocialNow?", answer: "SocialNow is a company and partner network for branding, content, marketing and software. Connect brings customers and independent entrepreneurs together. SocialNow OS is part of SocialNow." },
      { id: "partners", question: "What is a SocialNow partner?", answer: "A partner is an independent entrepreneur who contributes expertise to products and customer projects. Partners collaborate with SocialNow through their own businesses." },
      { id: "free-os", question: "How much does SocialNow OS cost?", answer: "SocialNow OS is free up to 10 GB of storage; as long as you stay below that, we charge nothing. Studio tokens cost €10, €25 or €50 per month. Support packages with a custom OS and a free website start from €3,000 per month. Everything is monthly." },
      { id: "custom", question: "How does custom work operate, and who pays the partners?", answer: "For custom work, SocialNow B.V. coordinates and pays the appropriate partners. You receive a tailored proposal and have one point of contact. SocialNow oversees quality." },
      { id: "human-ai", question: "How does SocialNow combine human contact and AI?", answer: "Personal contact remains central. AI technology supports the products and our partners’ work. Human Connection. Powered by AI Technology." },
      { id: "odoo", question: "Do I need Odoo to use SocialNow OS?", answer: "No. Odoo is an optional integration for businesses that want to connect their Odoo environment to SocialNow OS. Odoo is not required to get started with SocialNow OS." },
    ],
  },
  de: {
    heading: "Häufige Fragen zu SocialNow",
    items: [
      { id: "connection", question: "Was ist SocialNow?", answer: "SocialNow ist ein Unternehmen und Partnernetzwerk für Branding, Content, Marketing und Software. Connect verbindet Kunden und selbstständige Unternehmer. SocialNow OS ist ein Teil von SocialNow." },
      { id: "partners", question: "Was ist ein SocialNow-Partner?", answer: "Ein Partner ist ein selbstständiger Unternehmer, der Fachwissen zu Produkten und Kundenprojekten beiträgt. Partner arbeiten über ihre eigenen Unternehmen mit SocialNow zusammen." },
      { id: "free-os", question: "Was kostet SocialNow OS?", answer: "SocialNow OS ist bis zu 10 GB Speicher kostenlos; solange Sie darunter bleiben, buchen wir nichts ab. Tokens für das Studio kosten 10 €, 25 € oder 50 € pro Monat. Hilfspakete mit individuellem OS und kostenloser Website gibt es ab 3.000 € pro Monat. Alles ist monatlich." },
      { id: "custom", question: "Wie funktionieren individuelle Lösungen und wer bezahlt die Partner?", answer: "Bei individuellen Lösungen koordiniert und bezahlt SocialNow B.V. die passenden Partner. Du erhältst ein individuelles Angebot und hast einen Ansprechpartner. SocialNow überwacht die Qualität." },
      { id: "human-ai", question: "Wie verbindet SocialNow persönlichen Kontakt und KI?", answer: "Persönlicher Kontakt bleibt im Mittelpunkt. KI-Technologie unterstützt die Produkte und die Arbeit unserer Partner. Human Connection. Powered by AI Technology." },
      { id: "odoo", question: "Brauche ich Odoo für SocialNow OS?", answer: "Nein. Odoo ist eine optionale Anbindung für Unternehmen, die ihre Odoo-Umgebung mit SocialNow OS verbinden möchten. Odoo ist keine Voraussetzung für den Einstieg in SocialNow OS." },
    ],
  },
  fr: {
    heading: "Questions fréquentes sur SocialNow",
    items: [
      { id: "connection", question: "Qu’est-ce que SocialNow ?", answer: "SocialNow est une entreprise et un réseau de partenaires en branding, contenu, marketing et logiciels. Connect relie clients et entrepreneurs indépendants. SocialNow OS fait partie de SocialNow." },
      { id: "partners", question: "Qu’est-ce qu’un partenaire SocialNow ?", answer: "Un partenaire est un entrepreneur indépendant qui apporte son expertise aux produits et aux projets des clients. Les partenaires collaborent avec SocialNow par l’intermédiaire de leur propre entreprise." },
      { id: "free-os", question: "Combien coûte SocialNow OS ?", answer: "SocialNow OS est gratuit jusqu’à 10 Go de stockage ; tant que vous restez en dessous, nous ne prélevons rien. Les tokens du Studio coûtent 10 €, 25 € ou 50 € par mois. Les forfaits d’accompagnement avec un OS sur mesure et un site web gratuit commencent à 3 000 € par mois. Tout est mensuel." },
      { id: "custom", question: "Comment fonctionne le sur-mesure et qui paie les partenaires ?", answer: "Pour les prestations sur mesure, SocialNow B.V. coordonne et rémunère les partenaires adaptés. Vous recevez une proposition personnalisée et disposez d’un interlocuteur unique. SocialNow veille à la qualité." },
      { id: "human-ai", question: "Comment SocialNow associe-t-il contact humain et IA ?", answer: "Le contact personnel reste au cœur de notre approche. L’IA soutient les produits et le travail de nos partenaires. Human Connection. Powered by AI Technology." },
      { id: "odoo", question: "Ai-je besoin d’Odoo pour utiliser SocialNow OS ?", answer: "Non. Odoo est une intégration facultative pour les entreprises qui souhaitent connecter leur environnement Odoo à SocialNow OS. Odoo n’est pas nécessaire pour commencer à utiliser SocialNow OS." },
    ],
  },
  es: {
    heading: "Preguntas frecuentes sobre SocialNow",
    items: [
      { id: "connection", question: "¿Qué es SocialNow?", answer: "SocialNow es una empresa y una red de socios de branding, contenido, marketing y software. Connect une a clientes y emprendedores independientes. SocialNow OS forma parte de SocialNow." },
      { id: "partners", question: "¿Qué es un socio de SocialNow?", answer: "Un socio es un empresario independiente que aporta su experiencia a productos y proyectos para clientes. Los socios colaboran con SocialNow a través de sus propias empresas." },
      { id: "free-os", question: "¿Cuánto cuesta SocialNow OS?", answer: "SocialNow OS es gratuito hasta 10 GB de almacenamiento; mientras te mantengas por debajo, no cobramos nada. Los tokens del Studio cuestan 10 €, 25 € o 50 € al mes. Los paquetes de ayuda con un OS a medida y una web gratuita empiezan desde 3.000 € al mes. Todo es mensual." },
      { id: "custom", question: "¿Cómo funcionan los trabajos a medida y quién paga a los socios?", answer: "Para los trabajos a medida, SocialNow B.V. coordina y paga a los socios adecuados. Recibes una propuesta personalizada y tienes un único punto de contacto. SocialNow supervisa la calidad." },
      { id: "human-ai", question: "¿Cómo combina SocialNow el contacto humano y la IA?", answer: "El trato personal sigue siendo central. La tecnología de IA apoya los productos y el trabajo de nuestros socios. Human Connection. Powered by AI Technology." },
      { id: "odoo", question: "¿Necesito Odoo para utilizar SocialNow OS?", answer: "No. Odoo es una integración opcional para empresas que desean conectar su entorno Odoo con SocialNow OS. Odoo no es necesario para empezar a utilizar SocialNow OS." },
    ],
  },
  it: {
    heading: "Domande frequenti su SocialNow",
    items: [
      { id: "connection", question: "Che cos’è SocialNow?", answer: "SocialNow è un’azienda e una rete di partner per branding, contenuti, marketing e software. Connect unisce clienti e imprenditori indipendenti. SocialNow OS è parte di SocialNow." },
      { id: "partners", question: "Che cos’è un partner SocialNow?", answer: "Un partner è un imprenditore indipendente che contribuisce con le proprie competenze ai prodotti e ai progetti dei clienti. I partner collaborano con SocialNow attraverso le proprie imprese." },
      { id: "free-os", question: "Quanto costa SocialNow OS?", answer: "SocialNow OS è gratuito fino a 10 GB di spazio; finché resti sotto questa soglia, non addebitiamo nulla. I token per lo Studio costano 10 €, 25 € o 50 € al mese. I pacchetti di supporto con un OS su misura e un sito web gratuito partono da 3.000 € al mese. Tutto è mensile." },
      { id: "custom", question: "Come funzionano i lavori su misura e chi paga i partner?", answer: "Per i lavori su misura, SocialNow B.V. coordina e paga i partner adatti. Ricevi una proposta personalizzata e hai un unico referente. SocialNow supervisiona la qualità." },
      { id: "human-ai", question: "Come combina SocialNow il contatto umano e l’IA?", answer: "Il contatto personale resta al centro. La tecnologia IA supporta i prodotti e il lavoro dei nostri partner. Human Connection. Powered by AI Technology." },
      { id: "odoo", question: "Ho bisogno di Odoo per usare SocialNow OS?", answer: "No. Odoo è un’integrazione facoltativa per le aziende che desiderano collegare il proprio ambiente Odoo a SocialNow OS. Odoo non è necessario per iniziare a usare SocialNow OS." },
    ],
  },
  pt: {
    heading: "Perguntas frequentes sobre a SocialNow",
    items: [
      { id: "connection", question: "O que é a SocialNow?", answer: "A SocialNow é uma empresa e uma rede de parceiros de branding, conteúdos, marketing e software. Connect liga clientes e empresários independentes. SocialNow OS faz parte da SocialNow." },
      { id: "partners", question: "O que é um parceiro SocialNow?", answer: "Um parceiro é um empresário independente que contribui com a sua experiência para produtos e projetos de clientes. Os parceiros colaboram com a SocialNow através das suas próprias empresas." },
      { id: "free-os", question: "Quanto custa o SocialNow OS?", answer: "O SocialNow OS é gratuito até 10 GB de armazenamento; enquanto ficar abaixo disso, não cobramos nada. Os tokens do Studio custam 10 €, 25 € ou 50 € por mês. Os pacotes de apoio com um OS à medida e um website gratuito começam a partir de 3.000 € por mês. Tudo é mensal." },
      { id: "custom", question: "Como funcionam os trabalhos à medida e quem paga aos parceiros?", answer: "Nos trabalhos à medida, a SocialNow B.V. coordena e paga aos parceiros adequados. Recebes uma proposta personalizada e tens um único ponto de contacto. A SocialNow acompanha a qualidade." },
      { id: "human-ai", question: "Como combina a SocialNow o contacto humano e a IA?", answer: "O contacto pessoal continua a ser central. A tecnologia de IA apoia os produtos e o trabalho dos nossos parceiros. Human Connection. Powered by AI Technology." },
      { id: "odoo", question: "Preciso do Odoo para utilizar o SocialNow OS?", answer: "Não. O Odoo é uma integração opcional para empresas que desejam ligar o seu ambiente Odoo ao SocialNow OS. O Odoo não é necessário para começar a utilizar o SocialNow OS." },
    ],
  },
  pl: {
    heading: "Najczęstsze pytania o SocialNow",
    items: [
      { id: "connection", question: "Czym jest SocialNow?", answer: "SocialNow to firma i sieć partnerów zajmujących się brandingiem, treściami, marketingiem i oprogramowaniem. Connect łączy klientów i niezależnych przedsiębiorców. SocialNow OS jest częścią SocialNow." },
      { id: "partners", question: "Kim jest partner SocialNow?", answer: "Partner to niezależny przedsiębiorca, który wnosi swoją wiedzę do produktów i projektów dla klientów. Partnerzy współpracują z SocialNow w ramach własnych firm." },
      { id: "free-os", question: "Ile kosztuje SocialNow OS?", answer: "SocialNow OS jest bezpłatny do 10 GB przestrzeni; dopóki nie przekroczysz tego limitu, nic nie pobieramy. Tokeny do Studio kosztują 10 €, 25 € lub 50 € miesięcznie. Pakiety wsparcia z OS na miarę i darmową stroną zaczynają się od 3000 € miesięcznie. Wszystko rozliczamy miesięcznie." },
      { id: "custom", question: "Jak przebiegają prace na zamówienie i kto płaci partnerom?", answer: "W przypadku prac na zamówienie SocialNow B.V. koordynuje odpowiednich partnerów i płaci im. Otrzymujesz indywidualną ofertę i masz jeden punkt kontaktu. SocialNow nadzoruje jakość." },
      { id: "human-ai", question: "Jak SocialNow łączy kontakt z ludźmi i AI?", answer: "Osobisty kontakt pozostaje najważniejszy. Technologia AI wspiera produkty i pracę naszych partnerów. Human Connection. Powered by AI Technology." },
      { id: "odoo", question: "Czy potrzebuję Odoo, aby korzystać z SocialNow OS?", answer: "Nie. Odoo to opcjonalna integracja dla firm, które chcą połączyć swoje środowisko Odoo z SocialNow OS. Odoo nie jest wymagane, aby zacząć korzystać z SocialNow OS." },
    ],
  },
  sv: {
    heading: "Vanliga frågor om SocialNow",
    items: [
      { id: "connection", question: "Vad är SocialNow?", answer: "SocialNow är ett företag och partnernätverk för varumärke, innehåll, marknadsföring och programvara. Connect förbinder kunder och självständiga företagare. SocialNow OS är en del av SocialNow." },
      { id: "partners", question: "Vad är en SocialNow-partner?", answer: "En partner är en självständig företagare som bidrar med expertis till produkter och kundprojekt. Partner samarbetar med SocialNow genom sina egna företag." },
      { id: "free-os", question: "Vad kostar SocialNow OS?", answer: "SocialNow OS är gratis upp till 10 GB lagring; så länge du stannar under det drar vi ingenting. Tokens för Studio kostar 10 €, 25 € eller 50 € per månad. Hjälppaket med ett skräddarsytt OS och en gratis webbplats börjar från 3 000 € per månad. Allt är månadsvis." },
      { id: "custom", question: "Hur fungerar anpassade lösningar och vem betalar partnerna?", answer: "För anpassade lösningar samordnar och betalar SocialNow B.V. de lämpliga partnerna. Du får ett personligt förslag och har en kontaktperson. SocialNow följer upp kvaliteten." },
      { id: "human-ai", question: "Hur kombinerar SocialNow mänsklig kontakt och AI?", answer: "Personlig kontakt står fortsatt i centrum. AI-teknik stöder produkterna och våra partners arbete. Human Connection. Powered by AI Technology." },
      { id: "odoo", question: "Behöver jag Odoo för att använda SocialNow OS?", answer: "Nej. Odoo är en valfri integration för företag som vill koppla sin Odoo-miljö till SocialNow OS. Odoo krävs inte för att börja använda SocialNow OS." },
    ],
  },
  da: {
    heading: "Ofte stillede spørgsmål om SocialNow",
    items: [
      { id: "connection", question: "Hvad er SocialNow?", answer: "SocialNow er en virksomhed og et partnernetværk for branding, indhold, marketing og software. Connect forbinder kunder og selvstændige iværksættere. SocialNow OS er en del af SocialNow." },
      { id: "partners", question: "Hvad er en SocialNow-partner?", answer: "En partner er en selvstændig erhvervsdrivende, der bidrager med ekspertise til produkter og kundeprojekter. Partnere samarbejder med SocialNow gennem deres egne virksomheder." },
      { id: "free-os", question: "Hvad koster SocialNow OS?", answer: "SocialNow OS er gratis op til 10 GB lagerplads; så længe du bliver under, trækker vi intet. Tokens til Studio koster 10 €, 25 € eller 50 € om måneden. Hjælpepakker med et skræddersyet OS og en gratis hjemmeside starter fra 3.000 € om måneden. Alt er månedligt." },
      { id: "custom", question: "Hvordan fungerer skræddersyede løsninger, og hvem betaler partnerne?", answer: "Ved skræddersyede løsninger koordinerer og betaler SocialNow B.V. de rette partnere. Du får et personligt tilbud og har én kontaktperson. SocialNow følger op på kvaliteten." },
      { id: "human-ai", question: "Hvordan kombinerer SocialNow menneskelig kontakt og AI?", answer: "Personlig kontakt er fortsat i centrum. AI-teknologi understøtter produkterne og vores partneres arbejde. Human Connection. Powered by AI Technology." },
      { id: "odoo", question: "Har jeg brug for Odoo til at bruge SocialNow OS?", answer: "Nej. Odoo er en valgfri integration for virksomheder, der ønsker at forbinde deres Odoo-miljø med SocialNow OS. Odoo er ikke påkrævet for at komme i gang med SocialNow OS." },
    ],
  },
};

/** Pure, synchronous FAQ data in the page language; no dictionary loading. */
export function getBrandFaq(language: Language): BrandFaqContent {
  return faq[language];
}
