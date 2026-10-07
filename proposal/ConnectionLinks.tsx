import { useId } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, type Language } from "./i18n/context";
import "./connection-links.css";

const routes = ["/het-os", "/team", "/diensten", "/prijzen", "/contact"] as const;
type ConnectionRoute = (typeof routes)[number];
type ConnectionCopy = {
  heading: string;
  intro: string;
  links: Record<ConnectionRoute, string>;
};

// Own copy keeps this section complete before the shared dictionaries load.
const copy: Record<Language, ConnectionCopy> = {
  nl: {
    heading: "Mens, systeem en maatwerk.",
    intro: "SocialNow verbindt klanten en zelfstandige partners. Samen maken we klantvriendelijke producten in één gebruiksvriendelijk systeem.",
    links: {
      "/het-os": "Het Operation & Management-systeem",
      "/team": "Zelfstandige partners en ons team",
      "/diensten": "Maatwerk met SocialNow B.V.",
      "/prijzen": "Gratis instap en opslagprijzen",
      "/contact": "Persoonlijk contact over jouw vraag",
    },
  },
  en: {
    heading: "People, systems and custom solutions.",
    intro: "SocialNow connects customers and independent partners. Together, we create customer-friendly products in one easy-to-use system.",
    links: {
      "/het-os": "The Operation & Management system",
      "/team": "Independent partners and our team",
      "/diensten": "Custom solutions with SocialNow B.V.",
      "/prijzen": "Free entry and storage pricing",
      "/contact": "Personal contact about your needs",
    },
  },
  de: {
    heading: "Menschen, System und individuelle Lösungen.",
    intro: "SocialNow verbindet Kunden und selbstständige Partner. Gemeinsam entwickeln wir kundenfreundliche Produkte in einem benutzerfreundlichen System.",
    links: {
      "/het-os": "Das Operation & Management-System",
      "/team": "Selbstständige Partner und unser Team",
      "/diensten": "Individuelle Lösungen mit SocialNow B.V.",
      "/prijzen": "Kostenloser Einstieg und Speicherpreise",
      "/contact": "Persönlicher Kontakt zu deinem Anliegen",
    },
  },
  fr: {
    heading: "Des personnes, un système et du sur-mesure.",
    intro: "SocialNow met en relation les clients et les partenaires indépendants. Ensemble, nous créons des produits pensés pour les clients dans un système simple à utiliser.",
    links: {
      "/het-os": "Le système Operation & Management",
      "/team": "Les partenaires indépendants et notre équipe",
      "/diensten": "Des solutions sur mesure avec SocialNow B.V.",
      "/prijzen": "Démarrage gratuit et tarifs de stockage",
      "/contact": "Un échange personnel sur vos besoins",
    },
  },
  es: {
    heading: "Personas, sistema y soluciones a medida.",
    intro: "SocialNow conecta a clientes y socios independientes. Juntos creamos productos pensados para los clientes en un único sistema fácil de usar.",
    links: {
      "/het-os": "El sistema Operation & Management",
      "/team": "Socios independientes y nuestro equipo",
      "/diensten": "Soluciones a medida con SocialNow B.V.",
      "/prijzen": "Inicio gratuito y precios de almacenamiento",
      "/contact": "Contacto personal para hablar de tus necesidades",
    },
  },
  it: {
    heading: "Persone, sistema e soluzioni su misura.",
    intro: "SocialNow mette in contatto clienti e partner indipendenti. Insieme creiamo prodotti pensati per i clienti in un unico sistema facile da usare.",
    links: {
      "/het-os": "Il sistema Operation & Management",
      "/team": "Partner indipendenti e il nostro team",
      "/diensten": "Soluzioni su misura con SocialNow B.V.",
      "/prijzen": "Inizio gratuito e prezzi di archiviazione",
      "/contact": "Un contatto personale per le tue esigenze",
    },
  },
  pt: {
    heading: "Pessoas, sistema e soluções à medida.",
    intro: "A SocialNow liga clientes e parceiros independentes. Juntos criamos produtos pensados para os clientes num único sistema fácil de usar.",
    links: {
      "/het-os": "O sistema Operation & Management",
      "/team": "Parceiros independentes e a nossa equipa",
      "/diensten": "Soluções à medida com a SocialNow B.V.",
      "/prijzen": "Início gratuito e preços de armazenamento",
      "/contact": "Contacto pessoal sobre as tuas necessidades",
    },
  },
  pl: {
    heading: "Ludzie, system i rozwiązania na miarę.",
    intro: "SocialNow łączy klientów i niezależnych partnerów. Wspólnie tworzymy produkty przyjazne klientom w jednym łatwym w obsłudze systemie.",
    links: {
      "/het-os": "System Operation & Management",
      "/team": "Niezależni partnerzy i nasz zespół",
      "/diensten": "Rozwiązania na miarę z SocialNow B.V.",
      "/prijzen": "Bezpłatny start i ceny przestrzeni dyskowej",
      "/contact": "Bezpośredni kontakt w sprawie Twoich potrzeb",
    },
  },
  sv: {
    heading: "Människor, system och skräddarsydda lösningar.",
    intro: "SocialNow sammanför kunder och självständiga partner. Tillsammans skapar vi kundvänliga produkter i ett enda användarvänligt system.",
    links: {
      "/het-os": "Operation & Management-systemet",
      "/team": "Självständiga partner och vårt team",
      "/diensten": "Skräddarsydda lösningar med SocialNow B.V.",
      "/prijzen": "Gratis start och priser för lagring",
      "/contact": "Personlig kontakt om dina behov",
    },
  },
  da: {
    heading: "Mennesker, system og skræddersyede løsninger.",
    intro: "SocialNow forbinder kunder og selvstændige partnere. Sammen skaber vi kundevenlige produkter i ét brugervenligt system.",
    links: {
      "/het-os": "Operation & Management-systemet",
      "/team": "Selvstændige partnere og vores team",
      "/diensten": "Skræddersyede løsninger med SocialNow B.V.",
      "/prijzen": "Gratis start og priser på lagerplads",
      "/contact": "Personlig kontakt om dine behov",
    },
  },
};

export function ConnectionLinks() {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const headingId = useId();
  const text = copy[language];
  const currentPath = pathname.replace(/\/+$/, "") || "/";

  return (
    <section className="sn-connections h-wrap" lang={language} translate="no" aria-labelledby={headingId}>
      <div className="sn-connections-panel">
        <div className="sn-connections-intro">
          <h2 id={headingId}>{text.heading}</h2>
          <p>{text.intro}</p>
        </div>
        <nav aria-labelledby={headingId}>
          <ul className="sn-connections-list">
            {routes.filter((route) => route !== currentPath).map((route) => (
              <li key={route}>
                {/* The router's basename supplies /nl, /de, etc., including during prerender. */}
                <Link to={route}>
                  <span>{text.links[route]}</span>
                  <span className="sn-connections-arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default ConnectionLinks;
