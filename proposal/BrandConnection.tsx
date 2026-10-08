import React, { useId } from "react";
import { Link } from "react-router-dom";
import { useLanguage, type Language } from "./i18n/context";
import "./brand-connection.css";

export type BrandConnectionProps = { compact?: boolean };

type ConnectionCopy = {
  title: string;
  intro: string;
  steps: [string, string, string];
  team: string;
  connect: string;
  system: string;
};

// Local copy keeps all ten languages complete without changing shared dictionaries.
const COPY: Record<Language, ConnectionCopy> = {
  nl: {
    title: "Je vraag brengt ons samen.",
    intro: "SocialNow is een bedrijf en partnernetwerk voor branding, content, marketing en software. Connect verbindt klanten en zelfstandige ondernemers. SocialNow OS is een onderdeel van SocialNow. Voor maatwerk organiseert en betaalt SocialNow B.V. de juiste partners. Je hebt één aanspreekpunt dat de kwaliteit bewaakt, met ruimte voor persoonlijk contact.",
    steps: ["Je vraag", "De juiste zelfstandige partners", "Producten en tools die bij je bedrijf passen"],
    team: "Ontmoet de partners",
    connect: "Open SocialNow / Connect",
    system: "Ontdek het OS",
  },
  en: {
    title: "Your question brings us together.",
    intro: "SocialNow is a company and partner network for branding, content, marketing and software. Connect brings customers and independent entrepreneurs together. SocialNow OS is part of SocialNow. For custom work, SocialNow B.V. organises and pays the right partners. You have one point of contact who oversees quality, with room for personal contact.",
    steps: ["Your question", "The right independent partners", "Products and tools that fit your business"],
    team: "Meet the partners",
    connect: "Open SocialNow / Connect",
    system: "Explore the OS",
  },
  de: {
    title: "Ihre Frage bringt uns zusammen.",
    intro: "SocialNow ist ein Unternehmen und Partnernetzwerk für Branding, Content, Marketing und Software. Connect verbindet Kunden und selbstständige Unternehmer. SocialNow OS ist ein Teil von SocialNow. Für individuelle Lösungen organisiert und bezahlt SocialNow B.V. die passenden Partner. Sie haben einen Ansprechpartner, der die Qualität im Blick behält und persönlich für Sie da ist.",
    steps: ["Ihre Frage", "Die passenden selbstständigen Partner", "Produkte und Tools, die zu Ihrem Unternehmen passen"],
    team: "Die Partner kennenlernen",
    connect: "SocialNow / Connect öffnen",
    system: "Das OS entdecken",
  },
  fr: {
    title: "Votre question nous réunit.",
    intro: "SocialNow est une entreprise et un réseau de partenaires en branding, contenu, marketing et logiciels. Connect relie clients et entrepreneurs indépendants. SocialNow OS fait partie de SocialNow. Pour le sur-mesure, SocialNow B.V. coordonne et rémunère les partenaires adaptés. Vous avez un interlocuteur unique qui veille à la qualité, avec un contact personnel.",
    steps: ["Votre question", "Les bons partenaires indépendants", "Des produits et outils adaptés à votre entreprise"],
    team: "Rencontrer les partenaires",
    connect: "Ouvrir SocialNow / Connect",
    system: "Découvrir l’OS",
  },
  es: {
    title: "Tu pregunta nos une.",
    intro: "SocialNow es una empresa y una red de socios de branding, contenido, marketing y software. Connect une a clientes y emprendedores independientes. SocialNow OS forma parte de SocialNow. Para el trabajo a medida, SocialNow B.V. coordina y paga a los socios adecuados. Tienes un único interlocutor que supervisa la calidad, con un trato personal.",
    steps: ["Tu pregunta", "Los socios independientes adecuados", "Productos y herramientas adecuados para tu empresa"],
    team: "Conoce a los socios",
    connect: "Abrir SocialNow / Connect",
    system: "Descubre el OS",
  },
  it: {
    title: "La tua domanda ci unisce.",
    intro: "SocialNow è un’azienda e una rete di partner per branding, contenuti, marketing e software. Connect unisce clienti e imprenditori indipendenti. SocialNow OS è parte di SocialNow. Per i progetti su misura, SocialNow B.V. coordina e paga i partner adatti. Hai un unico referente che segue la qualità, con un contatto personale.",
    steps: ["La tua domanda", "I partner indipendenti adatti", "Prodotti e strumenti adatti alla tua azienda"],
    team: "Conosci i partner",
    connect: "Apri SocialNow / Connect",
    system: "Scopri l’OS",
  },
  pt: {
    title: "A sua pergunta aproxima-nos.",
    intro: "A SocialNow é uma empresa e uma rede de parceiros de branding, conteúdos, marketing e software. Connect liga clientes e empresários independentes. SocialNow OS faz parte da SocialNow. Nos projetos à medida, a SocialNow B.V. coordena e remunera os parceiros adequados. Tem um único interlocutor que acompanha a qualidade, com espaço para o contacto pessoal.",
    steps: ["A sua pergunta", "Os parceiros independentes adequados", "Produtos e ferramentas adequados à sua empresa"],
    team: "Conheça os parceiros",
    connect: "Abrir SocialNow / Connect",
    system: "Explore o OS",
  },
  pl: {
    title: "Twoje pytanie nas łączy.",
    intro: "SocialNow to firma i sieć partnerów zajmujących się brandingiem, treściami, marketingiem i oprogramowaniem. Connect łączy klientów i niezależnych przedsiębiorców. SocialNow OS jest częścią SocialNow. Przy projektach na zamówienie SocialNow B.V. koordynuje pracę odpowiednich partnerów i płaci im za nią. Masz jedną osobę kontaktową, która dba o jakość i osobisty kontakt.",
    steps: ["Twoje pytanie", "Odpowiedni niezależni partnerzy", "Produkty i narzędzia dopasowane do Twojej firmy"],
    team: "Poznaj partnerów",
    connect: "Otwórz SocialNow / Connect",
    system: "Odkryj OS",
  },
  sv: {
    title: "Din fråga för oss samman.",
    intro: "SocialNow är ett företag och partnernätverk för varumärke, innehåll, marknadsföring och programvara. Connect förbinder kunder och självständiga företagare. SocialNow OS är en del av SocialNow. För skräddarsydda projekt samordnar och betalar SocialNow B.V. rätt partners. Du har en kontaktperson som följer upp kvaliteten, med utrymme för personlig kontakt.",
    steps: ["Din fråga", "Rätt självständiga partners", "Produkter och verktyg som passar ditt företag"],
    team: "Möt våra partners",
    connect: "Öppna SocialNow / Connect",
    system: "Upptäck OS",
  },
  da: {
    title: "Dit spørgsmål bringer os sammen.",
    intro: "SocialNow er en virksomhed og et partnernetværk for branding, indhold, marketing og software. Connect forbinder kunder og selvstændige iværksættere. SocialNow OS er en del af SocialNow. Ved skræddersyede projekter organiserer og betaler SocialNow B.V. de rette partnere. Du har én kontaktperson, der følger op på kvaliteten, med plads til personlig kontakt.",
    steps: ["Dit spørgsmål", "De rette selvstændige partnere", "Produkter og værktøjer, der passer til din virksomhed"],
    team: "Mød partnerne",
    connect: "Åbn SocialNow / Connect",
    system: "Udforsk OS",
  },
};

/** Place after ProductRoute and before ProductOffer; compact changes spacing only. */
export function BrandConnection({ compact = false }: BrandConnectionProps) {
  const { language } = useLanguage();
  const copy = COPY[language];
  const titleId = useId();

  return (
    <section
      className={`sn-brand-connection${compact ? " sn-brand-connection--compact" : ""}`}
      aria-labelledby={titleId}
      lang={language}
      translate="no"
    >
      <h2 className="sn-brand-connection__title" id={titleId}>{copy.title}</h2>
      <p className="sn-brand-connection__copy">{copy.intro}</p>
      <ol className="sn-brand-connection__steps" role="list">
        {copy.steps.map((step, index) => (
          <li key={index}>
            <span className="sn-brand-connection__number" aria-hidden="true">0{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="sn-brand-connection__links">
        <a href="/connect/">{copy.connect}<span aria-hidden="true">↗</span></a>
        <Link to="/team">{copy.team}<span aria-hidden="true">↗</span></Link>
        <Link to="/het-os">{copy.system}<span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}

export default BrandConnection;
