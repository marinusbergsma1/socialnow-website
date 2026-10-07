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
  system: string;
};

// Local copy keeps all ten languages complete without changing shared dictionaries.
const COPY: Record<Language, ConnectionCopy> = {
  nl: {
    title: "Je vraag brengt ons samen.",
    intro: "SocialNow verbindt jou met zelfstandige partners die begrijpen wat je bedrijf en je klanten nodig hebben. Samen maken we klantvriendelijke producten en brengen we je werk samen in één gebruiksvriendelijk Operation & Management-systeem. Voor maatwerk organiseert en betaalt SocialNow B.V. de juiste partners. Je hebt één aanspreekpunt dat de kwaliteit bewaakt, met ruimte voor persoonlijk contact.",
    steps: ["Je vraag", "De juiste zelfstandige partners", "Eén systeem: gratis instap of maatwerk"],
    team: "Ontmoet de partners",
    system: "Ontdek het OS",
  },
  en: {
    title: "Your question brings us together.",
    intro: "SocialNow connects you with independent partners who understand what your business and customers need. Together, we create customer-friendly products and bring your work together in one easy-to-use Operation & Management system. For custom work, SocialNow B.V. organises and pays the right partners. You have one point of contact who oversees quality, with room for personal contact.",
    steps: ["Your question", "The right independent partners", "One system: start free or choose custom work"],
    team: "Meet the partners",
    system: "Explore the OS",
  },
  de: {
    title: "Ihre Frage bringt uns zusammen.",
    intro: "SocialNow verbindet Sie mit selbstständigen Partnern, die verstehen, was Ihr Unternehmen und Ihre Kunden brauchen. Gemeinsam entwickeln wir kundenfreundliche Produkte und bündeln Ihre Arbeit in einem benutzerfreundlichen Operation & Management-System. Für individuelle Lösungen organisiert und bezahlt SocialNow B.V. die passenden Partner. Sie haben einen Ansprechpartner, der die Qualität im Blick behält und persönlich für Sie da ist.",
    steps: ["Ihre Frage", "Die passenden selbstständigen Partner", "Ein System: kostenlos starten oder individuell gestalten"],
    team: "Die Partner kennenlernen",
    system: "Das OS entdecken",
  },
  fr: {
    title: "Votre question nous réunit.",
    intro: "SocialNow vous met en relation avec des partenaires indépendants qui comprennent les besoins de votre entreprise et de vos clients. Ensemble, nous créons des produits adaptés aux clients et réunissons votre travail dans un système Operation & Management facile à utiliser. Pour le sur-mesure, SocialNow B.V. coordonne et rémunère les partenaires adaptés. Vous avez un interlocuteur unique qui veille à la qualité, avec un contact personnel.",
    steps: ["Votre question", "Les bons partenaires indépendants", "Un système : démarrage gratuit ou sur-mesure"],
    team: "Rencontrer les partenaires",
    system: "Découvrir l’OS",
  },
  es: {
    title: "Tu pregunta nos une.",
    intro: "SocialNow te conecta con socios independientes que entienden lo que tu empresa y tus clientes necesitan. Juntos creamos productos pensados para los clientes y reunimos tu trabajo en un sistema Operation & Management fácil de usar. Para el trabajo a medida, SocialNow B.V. coordina y paga a los socios adecuados. Tienes un único interlocutor que supervisa la calidad, con un trato personal.",
    steps: ["Tu pregunta", "Los socios independientes adecuados", "Un sistema: empieza gratis o elige una solución a medida"],
    team: "Conoce a los socios",
    system: "Descubre el OS",
  },
  it: {
    title: "La tua domanda ci unisce.",
    intro: "SocialNow ti mette in contatto con partner indipendenti che comprendono le esigenze della tua azienda e dei tuoi clienti. Insieme creiamo prodotti pensati per i clienti e riuniamo il tuo lavoro in un sistema Operation & Management facile da usare. Per i progetti su misura, SocialNow B.V. coordina e paga i partner adatti. Hai un unico referente che segue la qualità, con un contatto personale.",
    steps: ["La tua domanda", "I partner indipendenti adatti", "Un sistema: inizia gratis o scegli una soluzione su misura"],
    team: "Conosci i partner",
    system: "Scopri l’OS",
  },
  pt: {
    title: "A sua pergunta aproxima-nos.",
    intro: "A SocialNow liga-o a parceiros independentes que compreendem as necessidades da sua empresa e dos seus clientes. Juntos criamos produtos pensados para os clientes e reunimos o seu trabalho num sistema Operation & Management fácil de utilizar. Nos projetos à medida, a SocialNow B.V. coordena e remunera os parceiros adequados. Tem um único interlocutor que acompanha a qualidade, com espaço para o contacto pessoal.",
    steps: ["A sua pergunta", "Os parceiros independentes adequados", "Um sistema: comece grátis ou escolha uma solução à medida"],
    team: "Conheça os parceiros",
    system: "Explore o OS",
  },
  pl: {
    title: "Twoje pytanie nas łączy.",
    intro: "SocialNow łączy Cię z niezależnymi partnerami, którzy rozumieją potrzeby Twojej firmy i klientów. Wspólnie tworzymy produkty przyjazne klientom i łączymy Twoją pracę w jednym łatwym w obsłudze systemie Operation & Management. Przy projektach na zamówienie SocialNow B.V. koordynuje pracę odpowiednich partnerów i płaci im za nią. Masz jedną osobę kontaktową, która dba o jakość i osobisty kontakt.",
    steps: ["Twoje pytanie", "Odpowiedni niezależni partnerzy", "Jeden system: bezpłatny start lub rozwiązanie na zamówienie"],
    team: "Poznaj partnerów",
    system: "Odkryj OS",
  },
  sv: {
    title: "Din fråga för oss samman.",
    intro: "SocialNow kopplar ihop dig med självständiga partners som förstår vad ditt företag och dina kunder behöver. Tillsammans skapar vi kundvänliga produkter och samlar ditt arbete i ett användarvänligt Operation & Management-system. För skräddarsydda projekt samordnar och betalar SocialNow B.V. rätt partners. Du har en kontaktperson som följer upp kvaliteten, med utrymme för personlig kontakt.",
    steps: ["Din fråga", "Rätt självständiga partners", "Ett system: börja gratis eller välj en skräddarsydd lösning"],
    team: "Möt våra partners",
    system: "Upptäck OS",
  },
  da: {
    title: "Dit spørgsmål bringer os sammen.",
    intro: "SocialNow forbinder dig med selvstændige partnere, der forstår, hvad din virksomhed og dine kunder har brug for. Sammen skaber vi kundevenlige produkter og samler dit arbejde i ét brugervenligt Operation & Management-system. Ved skræddersyede projekter organiserer og betaler SocialNow B.V. de rette partnere. Du har én kontaktperson, der følger op på kvaliteten, med plads til personlig kontakt.",
    steps: ["Dit spørgsmål", "De rette selvstændige partnere", "Ét system: start gratis eller vælg en skræddersyet løsning"],
    team: "Mød partnerne",
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
        <Link to="/team">{copy.team}<span aria-hidden="true">↗</span></Link>
        <Link to="/het-os">{copy.system}<span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}

export default BrandConnection;
