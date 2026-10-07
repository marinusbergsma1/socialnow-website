/**
 * Curated public facts from proposal/content.ts (people + partnerReferences),
 * proposal/TeamTrust.tsx and proposal/paginas.tsx, checked 2026-10-07.
 * No I/O, inferred URLs, employment with SocialNow, or customer backlinks.
 * Return value: fresh JSON-LD nodes, to merge into the /team @graph by @id.
 */
const BASE = "https://socialnow.nl";
export const organizationIds = Object.freeze({
  socialnow: `${BASE}/#organisatie`,
  komen: `${BASE}/#organisatie-komen-consultancy`,
  attesso: `${BASE}/#organisatie-attesso`,
  fincer: `${BASE}/#organisatie-fincer`,
  bruggn: `${BASE}/#organisatie-bruggn-design`,
  bos: `${BASE}/#organisatie-bos-design`,
});

const personFacts = [
  ["Marinus Bergsma", "marinus-bergsma", "https://www.linkedin.com/in/marinus-bergsma-20b81a144/", "socialnow", true],
  ["Jos Hollenberg", "jos-hollenberg"],
  ["Sergio Jovovic", "sergio-jovovic", "https://www.linkedin.com/in/sergio-jovovic-203483220/"],
  ["Carmel Boon", "carmel-boon", "https://www.linkedin.com/in/carmel-boon-984940136/"],
  ["Sam van der Sluis", "sam-van-der-sluis", "https://www.linkedin.com/in/sam-van-der-sluis-740781199/"],
  ["Emma Peperkamp", "emma-peperkamp"],
  ["Nick van Keulen", "nick-van-keulen", "https://www.linkedin.com/in/nick-van-keulen-nl/"],
  ["Elian Coellar", "elian-coellar"],
  ["Sid van Kalken", "sid-van-kalken", "https://www.linkedin.com/in/sid-van-kalken-65b486223/", "attesso", true],
  ["Douwe Kramer", "douwe-kramer", "https://www.linkedin.com/in/douwekramer/", "attesso", true],
  ["Steef Komen", "steef-komen", "https://www.linkedin.com/in/steef-komen-60632236/", "komen"],
  ["Michelle Yang", "michelle-yang", undefined, "komen"],
  ["Tristan Slobbe", "tristan-slobbe", "https://www.linkedin.com/in/tristan-slobben-105056159/"],
  ["Antony Soosaipillaj", "antony-soosaipillaj"],
  ["Aren", "aren"],
  ["Youri van der Donk", "youri-van-der-donk"],
  ["Isaak Munster", "isaak-munster"],
  ["Pieter Bergsma", "pieter-bergsma"],
  ["Pepijn Bos", "pepijn-bos", undefined, "bos"],
  ["Armando van Bruggen", "armando-van-bruggen", "https://www.linkedin.com/in/armando-van-bruggen-116ba820b/", "bruggn"],
  ["Steven Goudsblom", "steven-goudsblom", "https://www.linkedin.com/in/steven-goudsblom-bb3ab0197/", "fincer", true],
];

export const personIds = Object.freeze(Object.fromEntries(personFacts.map(([name, slug]) => [name, `${BASE}/team#persoon-${slug}`])));

const organizationFacts = [
  ["socialnow", "SocialNow", BASE, ["Marinus Bergsma"]],
  ["komen", "Komen Consultancy", "https://www.komenconsultancy.com/"],
  ["attesso", "Attesso", "https://www.attesso.com/", ["Douwe Kramer"]],
  ["fincer", "Fincer", undefined, ["Steven Goudsblom"]],
  ["bruggn", "Bruggn Design", "https://www.bruggndesign.nl/"],
  // Bos Design is named in Pepijn's visible role; its website is unconfirmed.
  ["bos", "Bos Design"],
];

// Sources are integration/audit metadata, not extra public schema properties.
// A person's LinkedIn URL never becomes sameAs or url for their company.
export const partnerSources = Object.freeze({
  people: "proposal/content.ts#people",
  references: "proposal/content.ts#partnerReferences",
  founder: "proposal/paginas.tsx#Founder",
  fincerFounder: "proposal/TeamTrust.tsx#Bedrijfsreferenties",
  verifiedCompanyUrls: Object.freeze(organizationFacts.filter(([, , url]) => url).map(([, name, url]) => Object.freeze({ name, url }))),
  fincerEvidence: "https://www.linkedin.com/in/steven-goudsblom-bb3ab0197/",
  attessoEvidence: "https://www.linkedin.com/company/attesso/",
  referenceOnly: Object.freeze(["ByteChat", "ByteVision", "KLM", "BearingPoint", "ABN AMRO"]),
  schema: Object.freeze(["https://schema.org/affiliation", "https://schema.org/worksFor", "https://schema.org/founder"]),
});

const copy = {
  en: {
    person: name => `${name} is part of the SocialNow network of independent specialists.`,
    founder: "Marinus Bergsma is the founder of SocialNow.",
    company: name => `${name} is a company represented in SocialNow’s network of independent specialists.`,
    socialnow: "SocialNow connects clients and independent partners through one user-friendly Operation & Management system, with personal contact.",
  },
  nl: {
    person: name => `${name} maakt deel uit van het SocialNow-netwerk van zelfstandige specialisten.`,
    founder: "Marinus Bergsma is de oprichter van SocialNow.",
    company: name => `${name} is een bedrijf dat vertegenwoordigd is in het SocialNow-netwerk van zelfstandige specialisten.`,
    socialnow: "SocialNow verbindt klanten en zelfstandige partners in één gebruiksvriendelijk Operation & Management-systeem, met persoonlijk contact.",
  },
  de: {
    person: name => `${name} gehört zum SocialNow-Netzwerk selbstständiger Spezialisten.`,
    founder: "Marinus Bergsma ist der Gründer von SocialNow.",
    company: name => `${name} ist ein Unternehmen im SocialNow-Netzwerk selbstständiger Spezialisten.`,
    socialnow: "SocialNow verbindet Kunden und selbstständige Partner in einem benutzerfreundlichen Operation & Management-System mit persönlichem Kontakt.",
  },
  fr: {
    person: name => `${name} fait partie du réseau SocialNow de spécialistes indépendants.`,
    founder: "Marinus Bergsma est le fondateur de SocialNow.",
    company: name => `${name} est une entreprise représentée dans le réseau SocialNow de spécialistes indépendants.`,
    socialnow: "SocialNow relie clients et partenaires indépendants dans un système Operation & Management facile à utiliser, avec un contact personnel.",
  },
  es: {
    person: name => `${name} forma parte de la red SocialNow de especialistas independientes.`,
    founder: "Marinus Bergsma es el fundador de SocialNow.",
    company: name => `${name} es una empresa representada en la red SocialNow de especialistas independientes.`,
    socialnow: "SocialNow conecta a clientes y socios independientes en un sistema Operation & Management fácil de usar, con contacto personal.",
  },
  it: {
    person: name => `${name} fa parte della rete SocialNow di specialisti indipendenti.`,
    founder: "Marinus Bergsma è il fondatore di SocialNow.",
    company: name => `${name} è un’azienda rappresentata nella rete SocialNow di specialisti indipendenti.`,
    socialnow: "SocialNow collega clienti e partner indipendenti in un sistema Operation & Management facile da usare, con un contatto personale.",
  },
  pt: {
    person: name => `${name} faz parte da rede SocialNow de especialistas independentes.`,
    founder: "Marinus Bergsma é o fundador da SocialNow.",
    company: name => `${name} é uma empresa representada na rede SocialNow de especialistas independentes.`,
    socialnow: "A SocialNow conecta clientes e parceiros independentes num sistema Operation & Management fácil de usar, com contacto pessoal.",
  },
  pl: {
    person: name => `${name} należy do sieci niezależnych specjalistów SocialNow.`,
    founder: "Marinus Bergsma jest założycielem SocialNow.",
    company: name => `${name} to firma reprezentowana w sieci niezależnych specjalistów SocialNow.`,
    socialnow: "SocialNow łączy klientów i niezależnych partnerów w jednym przyjaznym systemie Operation & Management, z osobistym kontaktem.",
  },
  sv: {
    person: name => `${name} ingår i SocialNows nätverk av självständiga specialister.`,
    founder: "Marinus Bergsma är grundare av SocialNow.",
    company: name => `${name} är ett företag representerat i SocialNows nätverk av självständiga specialister.`,
    socialnow: "SocialNow förenar kunder och självständiga partner i ett användarvänligt Operation & Management-system med personlig kontakt.",
  },
  da: {
    person: name => `${name} er en del af SocialNows netværk af selvstændige specialister.`,
    founder: "Marinus Bergsma er grundlægger af SocialNow.",
    company: name => `${name} er en virksomhed repræsenteret i SocialNows netværk af selvstændige specialister.`,
    socialnow: "SocialNow forbinder kunder og selvstændige partnere i ét brugervenligt Operation & Management-system med personlig kontakt.",
  },
};

/**
 * @param {string} [language="en"] Site language (en,nl,de,fr,es,it,pt,pl,sv,da).
 * @returns {Array<Record<string, unknown>>} Nodes for the caller's JSON-LD @graph.
 * Use only on pages where the corresponding people/companies are visible.
 * Merge the SocialNow node into the existing #organisatie node; do not create a
 * second Organization for SocialNow. Descriptions fall back to English.
 */
export function partnerEntities(language = "en") {
  const text = Object.hasOwn(copy, language) ? copy[language] : copy.en;
  const page = `${BASE}${Object.hasOwn(copy, language) && language !== "en" ? `/${language}` : ""}/team`;
  const sourcePage = { "@type": "WebPage", "@id": page, url: page };
  const organizations = organizationFacts.map(([key, name, url, founders]) => ({
    "@type": "Organization",
    "@id": organizationIds[key],
    name,
    ...(url ? { url } : {}),
    ...(founders ? { founder: founders.map(person => ({ "@id": personIds[person] })) } : {}),
    description: key === "socialnow" ? text.socialnow : text.company(name),
    subjectOf: { ...sourcePage },
  }));
  const persons = personFacts.map(([name, , linkedin, company, ownCompany]) => ({
    "@type": "Person",
    "@id": personIds[name],
    name,
    ...(linkedin ? { sameAs: [linkedin] } : {}),
    affiliation: [
      { "@id": organizationIds.socialnow },
      ...(company && company !== "socialnow" ? [{ "@id": organizationIds[company] }] : []),
    ],
    ...(ownCompany ? { worksFor: { "@id": organizationIds[company] } } : {}),
    description: name === "Marinus Bergsma" ? text.founder : text.person(name),
    subjectOf: { ...sourcePage },
  }));
  return [...organizations, ...persons];
}
