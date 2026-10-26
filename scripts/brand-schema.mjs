// Pure JSON-LD factory. Integration belongs to postbuild/localize-build.
// English uses unprefixed paths; the other nine languages use /<language>.
const BASE = 'https://socialnow.nl';
const ROUTES = ['/', '/het-os', '/team', '/diensten', '/prijzen', '/contact', '/vacatures'];
const COPY = {
  en: {
    pages: ['SocialNow', 'SocialNow OS', 'People and partners', 'Services', 'Pricing', 'Contact', 'Work with SocialNow'],
    organization: 'SocialNow is a company and partner network for branding, content, marketing and software. Connect brings customers and independent entrepreneurs together. SocialNow OS is part of SocialNow.',
    software: 'SocialNow OS brings customer-friendly products together in one easy-to-use Operation & Management system, with personal contact and independent partners.',
    serviceName: 'Custom OS',
    service: 'A custom Operation & Management system for your business. SocialNow organizes and pays independent partners, with one point of contact, attention to quality and personal contact. Price on request.',
  },
  nl: {
    pages: ['SocialNow', 'SocialNow OS', 'Mensen en partners', 'Diensten', 'Prijzen', 'Contact', 'Werken met SocialNow'],
    organization: 'SocialNow is een bedrijf en partnernetwerk voor branding, content, marketing en software. Connect verbindt klanten en zelfstandige ondernemers. SocialNow OS is een onderdeel van SocialNow.',
    software: 'SocialNow OS brengt klantvriendelijke producten samen in één gebruiksvriendelijk Operation & Management-systeem, met persoonlijk contact en zelfstandige partners.',
    serviceName: 'OS op maat',
    service: 'Een Operation & Management-systeem op maat voor je bedrijf. SocialNow organiseert en betaalt zelfstandige partners, met één aanspreekpunt, aandacht voor kwaliteit en persoonlijk contact. Prijs op aanvraag.',
  },
  de: {
    pages: ['SocialNow', 'SocialNow OS', 'Menschen und Partner', 'Leistungen', 'Preise', 'Kontakt', 'Mit SocialNow arbeiten'],
    organization: 'SocialNow ist ein Unternehmen und Partnernetzwerk für Branding, Content, Marketing und Software. Connect verbindet Kunden und selbstständige Unternehmer. SocialNow OS ist ein Teil von SocialNow.',
    software: 'SocialNow OS vereint kundenfreundliche Produkte in einem benutzerfreundlichen Operation & Management-System, mit persönlichem Kontakt und selbstständigen Partnern.',
    serviceName: 'Individuelles OS',
    service: 'Ein individuelles Operation & Management-System für Ihr Unternehmen. SocialNow organisiert und bezahlt selbstständige Partner, mit einem Ansprechpartner, Qualitätsbewusstsein und persönlichem Kontakt. Preis auf Anfrage.',
  },
  fr: {
    pages: ['SocialNow', 'SocialNow OS', 'Personnes et partenaires', 'Services', 'Tarifs', 'Contact', 'Travailler avec SocialNow'],
    organization: 'SocialNow est une entreprise et un réseau de partenaires en branding, contenu, marketing et logiciels. Connect relie clients et entrepreneurs indépendants. SocialNow OS fait partie de SocialNow.',
    software: 'SocialNow OS réunit des produits adaptés aux clients dans un système Operation & Management facile à utiliser, avec un contact personnel et des partenaires indépendants.',
    serviceName: 'OS sur mesure',
    service: 'Un système Operation & Management sur mesure pour votre entreprise. SocialNow organise et rémunère les partenaires indépendants, avec un interlocuteur unique, le souci de la qualité et un contact personnel. Prix sur demande.',
  },
  es: {
    pages: ['SocialNow', 'SocialNow OS', 'Personas y socios', 'Servicios', 'Precios', 'Contacto', 'Trabajar con SocialNow'],
    organization: 'SocialNow es una empresa y una red de socios de branding, contenido, marketing y software. Connect une a clientes y emprendedores independientes. SocialNow OS forma parte de SocialNow.',
    software: 'SocialNow OS reúne productos pensados para los clientes en un sistema Operation & Management fácil de usar, con atención personal y socios independientes.',
    serviceName: 'OS a medida',
    service: 'Un sistema Operation & Management a medida para tu empresa. SocialNow organiza y paga a los socios independientes, con un único interlocutor, atención a la calidad y contacto personal. Precio bajo consulta.',
  },
  it: {
    pages: ['SocialNow', 'SocialNow OS', 'Persone e partner', 'Servizi', 'Prezzi', 'Contatti', 'Lavorare con SocialNow'],
    organization: 'SocialNow è un’azienda e una rete di partner per branding, contenuti, marketing e software. Connect unisce clienti e imprenditori indipendenti. SocialNow OS è parte di SocialNow.',
    software: 'SocialNow OS riunisce prodotti pensati per i clienti in un sistema Operation & Management facile da usare, con contatto personale e partner indipendenti.',
    serviceName: 'OS su misura',
    service: 'Un sistema Operation & Management su misura per la tua azienda. SocialNow organizza e paga i partner indipendenti, con un unico referente, attenzione alla qualità e contatto personale. Prezzo su richiesta.',
  },
  pt: {
    pages: ['SocialNow', 'SocialNow OS', 'Pessoas e parceiros', 'Serviços', 'Preços', 'Contacto', 'Trabalhar com a SocialNow'],
    organization: 'A SocialNow é uma empresa e uma rede de parceiros de branding, conteúdos, marketing e software. Connect liga clientes e empresários independentes. SocialNow OS faz parte da SocialNow.',
    software: 'O SocialNow OS reúne produtos pensados para os clientes num sistema Operation & Management fácil de utilizar, com contacto pessoal e parceiros independentes.',
    serviceName: 'OS à medida',
    service: 'Um sistema Operation & Management à medida da sua empresa. A SocialNow organiza e paga aos parceiros independentes, com um único interlocutor, atenção à qualidade e contacto pessoal. Preço sob consulta.',
  },
  pl: {
    pages: ['SocialNow', 'SocialNow OS', 'Ludzie i partnerzy', 'Usługi', 'Ceny', 'Kontakt', 'Współpraca z SocialNow'],
    organization: 'SocialNow to firma i sieć partnerów zajmujących się brandingiem, treściami, marketingiem i oprogramowaniem. Connect łączy klientów i niezależnych przedsiębiorców. SocialNow OS jest częścią SocialNow.',
    software: 'SocialNow OS łączy produkty przyjazne klientom w jeden łatwy w użyciu system Operation & Management, z osobistym kontaktem i niezależnymi partnerami.',
    serviceName: 'OS na miarę',
    service: 'System Operation & Management dostosowany do Twojej firmy. SocialNow organizuje i opłaca niezależnych partnerów, zapewniając jedną osobę do kontaktu, dbałość o jakość i osobisty kontakt. Cena na zapytanie.',
  },
  sv: {
    pages: ['SocialNow', 'SocialNow OS', 'Människor och partner', 'Tjänster', 'Priser', 'Kontakt', 'Arbeta med SocialNow'],
    organization: 'SocialNow är ett företag och partnernätverk för varumärke, innehåll, marknadsföring och programvara. Connect förbinder kunder och självständiga företagare. SocialNow OS är en del av SocialNow.',
    software: 'SocialNow OS samlar kundvänliga produkter i ett användarvänligt Operation & Management-system, med personlig kontakt och självständiga partner.',
    serviceName: 'Skräddarsytt OS',
    service: 'Ett skräddarsytt Operation & Management-system för ditt företag. SocialNow organiserar och betalar självständiga partner, med en kontaktperson, fokus på kvalitet och personlig kontakt. Pris på förfrågan.',
  },
  da: {
    pages: ['SocialNow', 'SocialNow OS', 'Mennesker og partnere', 'Ydelser', 'Priser', 'Kontakt', 'Arbejd med SocialNow'],
    organization: 'SocialNow er en virksomhed og et partnernetværk for branding, indhold, marketing og software. Connect forbinder kunder og selvstændige iværksættere. SocialNow OS er en del af SocialNow.',
    software: 'SocialNow OS samler kundevenlige produkter i ét brugervenligt Operation & Management-system, med personlig kontakt og selvstændige partnere.',
    serviceName: 'Skræddersyet OS',
    service: 'Et skræddersyet Operation & Management-system til din virksomhed. SocialNow organiserer og betaler selvstændige partnere, med én kontaktperson, fokus på kvalitet og personlig kontakt. Pris på forespørgsel.',
  },
};

/**
 * Return a fresh graph for an unprefixed route and supported language.
 * Other routes/languages return null: callers must not publish this brand graph
 * on cases, articles, private routes, or unknown language variants.
 * Prices are emitted only on routes with visible OS pricing. Keep the visible
 * copy and this module in sync; this factory does not inspect rendered pages.
 */
export function brandGraph(route, language = 'en') {
  if (!ROUTES.includes(route) || !Object.hasOwn(COPY, language)) return null;

  const copy = COPY[language];
  const prefix = language === 'en' ? '' : `/${language}`;
  const canonical = `${BASE}${prefix}${route}`;
  const localized = path => `${BASE}${prefix}${path}`;
  const organization = { '@id': `${BASE}/#organization` };
  const website = { '@id': `${BASE}/#website` };
  const software = { '@id': `${BASE}/#software` };
  const service = { '@id': `${BASE}/#custom-os` };
  const subjects = route === '/het-os' ? [software]
    : route === '/diensten' ? [service]
    : route === '/prijzen' ? [software, service]
    : route === '/' ? [organization, software, service]
    : [organization];

  const application = {
    '@type': 'SoftwareApplication',
    ...software,
    name: 'SocialNow OS',
    url: localized('/het-os'),
    description: copy.software,
    applicationCategory: 'BusinessApplication',
    publisher: { ...organization },
  };

  // 18 oktober 2026 (Marinus): geen bedragen in structured data. Prijzen pas na een account; /prijzen toont het aanbod.

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        ...organization,
        name: 'SocialNow',
        legalName: 'M. Bergsma h.o.d.n. SocialNow',
        identifier: { '@type': 'PropertyValue', propertyID: 'KvK', value: '77146301' },
        url: `${BASE}/`,
        logo: `${BASE}/images/SocialNow-Logo-2026.webp`,
        description: copy.organization,
        slogan: 'Human Connection. Powered by AI Technology.',
      },
      {
        '@type': 'WebSite',
        ...website,
        name: 'SocialNow',
        url: `${BASE}/`,
        inLanguage: Object.keys(COPY),
        publisher: { ...organization },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        name: copy.pages[ROUTES.indexOf(route)],
        url: canonical,
        inLanguage: language,
        isPartOf: { ...website },
        publisher: { ...organization },
        about: subjects,
        ...(subjects.length === 1 ? { mainEntity: { ...subjects[0] } } : {}),
      },
      {
        '@type': 'Service',
        ...service,
        name: copy.serviceName,
        url: localized('/diensten'),
        description: copy.service,
        provider: { ...organization },
      },
      application,
    ],
  };
}
