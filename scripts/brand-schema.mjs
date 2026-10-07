// Pure JSON-LD factory. Integration belongs to postbuild/localize-build.
// English uses unprefixed paths; the other nine languages use /<language>.
const BASE = 'https://socialnow.nl';
const ROUTES = ['/', '/het-os', '/team', '/diensten', '/prijzen', '/contact', '/vacatures'];
const OFFER_ROUTES = ['/', '/het-os', '/prijzen'];
const COPY = {
  en: {
    pages: ['SocialNow', 'SocialNow OS', 'People and partners', 'Services', 'Pricing', 'Contact', 'Work with SocialNow'],
    organization: 'SocialNow connects customers and independent partners who add value, creates customer-friendly products and brings them together in one easy-to-use Operation & Management system.',
    software: 'SocialNow OS brings customer-friendly products together in one easy-to-use Operation & Management system, with personal contact and independent partners.',
    serviceName: 'Custom OS',
    service: 'A custom Operation & Management system for your business. SocialNow B.V. organizes and pays independent partners, with one point of contact, attention to quality and personal contact. Price on request.',
    free: 'Free up to 10 GB storage',
    paid: 'Storage above 10 GB: €20 per month',
    offer: 'SocialNow OS is free up to 10 GB storage. Above 10 GB: €20 per month. A custom OS is priced on request.',
  },
  nl: {
    pages: ['SocialNow', 'SocialNow OS', 'Mensen en partners', 'Diensten', 'Prijzen', 'Contact', 'Werken met SocialNow'],
    organization: 'SocialNow verbindt klanten en zelfstandige partners die meerwaarde leveren, maakt klantvriendelijke producten en brengt die samen in één gebruiksvriendelijk Operation & Management-systeem.',
    software: 'SocialNow OS brengt klantvriendelijke producten samen in één gebruiksvriendelijk Operation & Management-systeem, met persoonlijk contact en zelfstandige partners.',
    serviceName: 'OS op maat',
    service: 'Een Operation & Management-systeem op maat voor je bedrijf. SocialNow B.V. organiseert en betaalt zelfstandige partners, met één aanspreekpunt, aandacht voor kwaliteit en persoonlijk contact. Prijs op aanvraag.',
    free: 'Gratis tot 10 GB opslag',
    paid: 'Opslag boven 10 GB: €20 per maand',
    offer: 'SocialNow OS is gratis tot 10 GB opslag. Boven 10 GB: €20 per maand. Voor een OS op maat geldt prijs op aanvraag.',
  },
  de: {
    pages: ['SocialNow', 'SocialNow OS', 'Menschen und Partner', 'Leistungen', 'Preise', 'Kontakt', 'Mit SocialNow arbeiten'],
    organization: 'SocialNow verbindet Kunden mit selbstständigen Partnern, die Mehrwert schaffen, entwickelt kundenfreundliche Produkte und vereint sie in einem benutzerfreundlichen Operation & Management-System.',
    software: 'SocialNow OS vereint kundenfreundliche Produkte in einem benutzerfreundlichen Operation & Management-System, mit persönlichem Kontakt und selbstständigen Partnern.',
    serviceName: 'Individuelles OS',
    service: 'Ein individuelles Operation & Management-System für Ihr Unternehmen. SocialNow B.V. organisiert und bezahlt selbstständige Partner, mit einem Ansprechpartner, Qualitätsbewusstsein und persönlichem Kontakt. Preis auf Anfrage.',
    free: 'Kostenlos bis 10 GB Speicher',
    paid: 'Speicher über 10 GB: 20 € pro Monat',
    offer: 'SocialNow OS ist bis 10 GB Speicher kostenlos. Über 10 GB: 20 € pro Monat. Ein individuelles OS erhalten Sie auf Preisanfrage.',
  },
  fr: {
    pages: ['SocialNow', 'SocialNow OS', 'Personnes et partenaires', 'Services', 'Tarifs', 'Contact', 'Travailler avec SocialNow'],
    organization: 'SocialNow met en relation les clients et les partenaires indépendants qui apportent de la valeur, crée des produits adaptés aux clients et les réunit dans un système Operation & Management facile à utiliser.',
    software: 'SocialNow OS réunit des produits adaptés aux clients dans un système Operation & Management facile à utiliser, avec un contact personnel et des partenaires indépendants.',
    serviceName: 'OS sur mesure',
    service: 'Un système Operation & Management sur mesure pour votre entreprise. SocialNow B.V. organise et rémunère les partenaires indépendants, avec un interlocuteur unique, le souci de la qualité et un contact personnel. Prix sur demande.',
    free: 'Gratuit jusqu’à 10 Go de stockage',
    paid: 'Stockage au-delà de 10 Go : 20 € par mois',
    offer: 'SocialNow OS est gratuit jusqu’à 10 Go de stockage. Au-delà de 10 Go : 20 € par mois. Le prix d’un OS sur mesure est disponible sur demande.',
  },
  es: {
    pages: ['SocialNow', 'SocialNow OS', 'Personas y socios', 'Servicios', 'Precios', 'Contacto', 'Trabajar con SocialNow'],
    organization: 'SocialNow conecta a clientes y socios independientes que aportan valor, crea productos pensados para los clientes y los reúne en un sistema Operation & Management fácil de usar.',
    software: 'SocialNow OS reúne productos pensados para los clientes en un sistema Operation & Management fácil de usar, con atención personal y socios independientes.',
    serviceName: 'OS a medida',
    service: 'Un sistema Operation & Management a medida para tu empresa. SocialNow B.V. organiza y paga a los socios independientes, con un único interlocutor, atención a la calidad y contacto personal. Precio bajo consulta.',
    free: 'Gratis hasta 10 GB de almacenamiento',
    paid: 'Almacenamiento superior a 10 GB: 20 € al mes',
    offer: 'SocialNow OS es gratis hasta 10 GB de almacenamiento. Por encima de 10 GB: 20 € al mes. El precio de un OS a medida se facilita bajo consulta.',
  },
  it: {
    pages: ['SocialNow', 'SocialNow OS', 'Persone e partner', 'Servizi', 'Prezzi', 'Contatti', 'Lavorare con SocialNow'],
    organization: 'SocialNow mette in contatto clienti e partner indipendenti che aggiungono valore, crea prodotti pensati per i clienti e li riunisce in un sistema Operation & Management facile da usare.',
    software: 'SocialNow OS riunisce prodotti pensati per i clienti in un sistema Operation & Management facile da usare, con contatto personale e partner indipendenti.',
    serviceName: 'OS su misura',
    service: 'Un sistema Operation & Management su misura per la tua azienda. SocialNow B.V. organizza e paga i partner indipendenti, con un unico referente, attenzione alla qualità e contatto personale. Prezzo su richiesta.',
    free: 'Gratis fino a 10 GB di spazio',
    paid: 'Spazio oltre 10 GB: 20 € al mese',
    offer: 'SocialNow OS è gratuito fino a 10 GB di spazio. Oltre 10 GB: 20 € al mese. Il prezzo di un OS su misura è disponibile su richiesta.',
  },
  pt: {
    pages: ['SocialNow', 'SocialNow OS', 'Pessoas e parceiros', 'Serviços', 'Preços', 'Contacto', 'Trabalhar com a SocialNow'],
    organization: 'A SocialNow liga clientes e parceiros independentes que acrescentam valor, cria produtos pensados para os clientes e reúne-os num sistema Operation & Management fácil de utilizar.',
    software: 'O SocialNow OS reúne produtos pensados para os clientes num sistema Operation & Management fácil de utilizar, com contacto pessoal e parceiros independentes.',
    serviceName: 'OS à medida',
    service: 'Um sistema Operation & Management à medida da sua empresa. A SocialNow B.V. organiza e paga aos parceiros independentes, com um único interlocutor, atenção à qualidade e contacto pessoal. Preço sob consulta.',
    free: 'Grátis até 10 GB de armazenamento',
    paid: 'Armazenamento acima de 10 GB: 20 € por mês',
    offer: 'O SocialNow OS é gratuito até 10 GB de armazenamento. Acima de 10 GB: 20 € por mês. O preço de um OS à medida é fornecido sob consulta.',
  },
  pl: {
    pages: ['SocialNow', 'SocialNow OS', 'Ludzie i partnerzy', 'Usługi', 'Ceny', 'Kontakt', 'Współpraca z SocialNow'],
    organization: 'SocialNow łączy klientów i niezależnych partnerów, którzy wnoszą wartość, tworzy produkty przyjazne klientom i łączy je w jeden łatwy w użyciu system Operation & Management.',
    software: 'SocialNow OS łączy produkty przyjazne klientom w jeden łatwy w użyciu system Operation & Management, z osobistym kontaktem i niezależnymi partnerami.',
    serviceName: 'OS na miarę',
    service: 'System Operation & Management dostosowany do Twojej firmy. SocialNow B.V. organizuje i opłaca niezależnych partnerów, zapewniając jedną osobę do kontaktu, dbałość o jakość i osobisty kontakt. Cena na zapytanie.',
    free: 'Bezpłatnie do 10 GB pamięci',
    paid: 'Pamięć powyżej 10 GB: 20 € miesięcznie',
    offer: 'SocialNow OS jest bezpłatny do 10 GB pamięci. Powyżej 10 GB: 20 € miesięcznie. Cena OS na miarę jest dostępna na zapytanie.',
  },
  sv: {
    pages: ['SocialNow', 'SocialNow OS', 'Människor och partner', 'Tjänster', 'Priser', 'Kontakt', 'Arbeta med SocialNow'],
    organization: 'SocialNow kopplar samman kunder och självständiga partner som skapar mervärde, utvecklar kundvänliga produkter och samlar dem i ett användarvänligt Operation & Management-system.',
    software: 'SocialNow OS samlar kundvänliga produkter i ett användarvänligt Operation & Management-system, med personlig kontakt och självständiga partner.',
    serviceName: 'Skräddarsytt OS',
    service: 'Ett skräddarsytt Operation & Management-system för ditt företag. SocialNow B.V. organiserar och betalar självständiga partner, med en kontaktperson, fokus på kvalitet och personlig kontakt. Pris på förfrågan.',
    free: 'Gratis upp till 10 GB lagring',
    paid: 'Lagring över 10 GB: 20 € per månad',
    offer: 'SocialNow OS är gratis upp till 10 GB lagring. Över 10 GB: 20 € per månad. Pris för ett skräddarsytt OS lämnas på förfrågan.',
  },
  da: {
    pages: ['SocialNow', 'SocialNow OS', 'Mennesker og partnere', 'Ydelser', 'Priser', 'Kontakt', 'Arbejd med SocialNow'],
    organization: 'SocialNow forbinder kunder og selvstændige partnere, der skaber merværdi, udvikler kundevenlige produkter og samler dem i ét brugervenligt Operation & Management-system.',
    software: 'SocialNow OS samler kundevenlige produkter i ét brugervenligt Operation & Management-system, med personlig kontakt og selvstændige partnere.',
    serviceName: 'Skræddersyet OS',
    service: 'Et skræddersyet Operation & Management-system til din virksomhed. SocialNow B.V. organiserer og betaler selvstændige partnere, med én kontaktperson, fokus på kvalitet og personlig kontakt. Pris på forespørgsel.',
    free: 'Gratis op til 10 GB lagerplads',
    paid: 'Lagerplads over 10 GB: 20 € pr. måned',
    offer: 'SocialNow OS er gratis op til 10 GB lagerplads. Over 10 GB: 20 € pr. måned. Prisen på et skræddersyet OS oplyses på forespørgsel.',
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

  if (OFFER_ROUTES.includes(route)) {
    application.offers = [
      {
        '@type': 'Offer',
        '@id': `${BASE}/#os-free-up-to-10gb`,
        name: copy.free,
        description: copy.offer,
        price: 0,
        priceCurrency: 'EUR',
        url: localized('/prijzen'),
        seller: { ...organization },
        itemOffered: { ...software },
      },
      {
        '@type': 'Offer',
        '@id': `${BASE}/#os-storage-above-10gb`,
        name: copy.paid,
        description: copy.offer,
        price: 20,
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 20,
          priceCurrency: 'EUR',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
        },
        url: localized('/prijzen'),
        seller: { ...organization },
        itemOffered: { ...software },
      },
    ];
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        ...organization,
        name: 'SocialNow',
        legalName: 'SocialNow B.V.',
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
