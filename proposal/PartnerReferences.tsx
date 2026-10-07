import React, { useState } from "react";
import { partnerReferences, type ReferenceKind } from "./content";
import { useLanguage, type Language } from "./i18n/context";
import "./partner-references.css";

// Existing assets already used by TeamTrust. No logo or company relationship is inferred.
const logoAssets: Record<string, string> = {
  SocialNow: "/images/SocialNow-Logo-2026-dark.webp",
  "Amsterdam Light Festival": "/images/merken/AMSTERDAM-LIGHT-FESTIVAL-LOGO.webp",
  "Day & Nite": "/images/DAY-NITE-LOGO.svg",
  AZ: "/images/merken/AZ-LOGO-KLEUR.svg",
  Supperclub: "/images/SUPPERCLUB-LOGO.webp",
  Axipoint: "/images/merken/axipoint.png",
  Socialytix: "/images/merken/socialytix.png",
  "By Carmel": "/images/merken/by-carmel.png",
  "Goodlife Marketing": "/images/merken/goodlife-marketing.png",
  "Rechtdoorzee Coaching": "/images/merken/rechtdoorzee.webp",
  "Pepijn Bos": "/images/merken/pepijn-bos.svg",
  "Komen Consultancy": "/images/merken/komen-consultancy.webp",
  "Bruggn Design": "/images/merken/bruggn-design.png",
  ByteChat: "/images/merken/bytechat.svg",
  ByteVision: "/images/merken/bytevision.png",
  KLM: "/images/merken/klm.svg",
  BearingPoint: "/images/merken/bearingpoint.svg",
  "ABN AMRO": "/images/merken/abn-amro.svg",
  Fincer: "/images/merken/fincer.png",
};
const experience = new Set(["KLM", "BearingPoint", "ABN AMRO"]);
const darkMarks = new Set(["SocialNow", "Amsterdam Light Festival", "Day & Nite", "Supperclub", "Socialytix", "Goodlife Marketing", "Rechtdoorzee Coaching"]);
const symbolMarks = new Set(["Amsterdam Light Festival", "Supperclub", "ByteChat", "ByteVision", "Pepijn Bos"]);
const extraLabels: Record<Language, {work: string; network: string}> = {
  en: {work: "Selected work", network: "Team network"},
  nl: {work: "Eerder werk", network: "Teamverband"},
  de: {work: "Ausgewählte Arbeiten", network: "Teamnetzwerk"},
  fr: {work: "Travaux sélectionnés", network: "Réseau d’équipe"},
  es: {work: "Trabajos seleccionados", network: "Red del equipo"},
  it: {work: "Lavori selezionati", network: "Rete del team"},
  pt: {work: "Trabalhos selecionados", network: "Rede da equipa"},
  pl: {work: "Wybrane realizacje", network: "Sieć zespołu"},
  sv: {work: "Utvalda arbeten", network: "Teamnätverk"},
  da: {work: "Udvalgte arbejder", network: "Teamnetværk"},
};
const labels: Record<Language, { company: string; experience: string }> = {
  en: { company: "Company references", experience: "Work experience" },
  nl: { company: "Bedrijfsreferenties", experience: "Werkervaring" },
  de: { company: "Unternehmensreferenzen", experience: "Berufserfahrung" },
  fr: { company: "Références d’entreprises", experience: "Expérience professionnelle" },
  es: { company: "Referencias de empresas", experience: "Experiencia profesional" },
  it: { company: "Riferimenti aziendali", experience: "Esperienza professionale" },
  pt: { company: "Referências de empresas", experience: "Experiência profissional" },
  pl: { company: "Referencje firmowe", experience: "Doświadczenie zawodowe" },
  sv: { company: "Företagsreferenser", experience: "Arbetslivserfarenhet" },
  da: { company: "Virksomhedsreferencer", experience: "Erhvervserfaring" },
};

function ReferenceMark({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const src = logoAssets[name];
  if (src && !failed) {
    return <><img src={src} alt={symbolMarks.has(name) ? "" : name} width="110" height="24" loading="lazy" decoding="async" onError={() => setFailed(true)} />{symbolMarks.has(name) ? <span className="sn-reference-fallback">{name}</span> : null}</>;
  }
  if (name === "Attesso") {
    return <span className="sn-reference-wordmark"><b aria-hidden="true">~/a</b> Attesso</span>;
  }
  return <span className="sn-reference-fallback">{name}</span>;
}

export default function PartnerReferences({ personName, compact = false }: { personName: string; compact?: boolean }) {
  const { language } = useLanguage();
  const verified = partnerReferences[personName] ?? [];
  // A network logo is explicitly labelled; it is never presented as past client work.
  const hasBrand = verified.some(reference => logoAssets[reference.name] || reference.name === "Attesso");
  const references = hasBrand ? verified : [...verified, {name: "SocialNow", url: "https://socialnow.nl/team", kind: "network" as const}];
  const copy = {...labels[language], ...extraLabels[language]};
  const kinds: ReferenceKind[] = ["company", "experience", "work", "network"];
  const groups = kinds.map(kind => ({label: copy[kind], references: references.filter(reference =>
    (reference.kind ?? (experience.has(reference.name) ? "experience" : "company")) === kind)}));
  return <div className={`h-partner-referenties sn-reference-groups${compact ? " is-compact" : ""}`} translate="no" data-person={personName}>
    {groups.filter(group => group.references.length).map(group => <div className="sn-reference-group" key={group.label}>
      <small className="sn-reference-label">{group.label}</small>
      <ul className="sn-reference-list" aria-label={group.label}>
        {group.references.map(reference => <li key={`${reference.name}-${reference.url}`}>
          <a className={`sn-reference-link${darkMarks.has(reference.name) ? " is-dark" : ""}`} href={reference.url} target="_blank" rel="noopener noreferrer" aria-label={reference.name === "Fincer" ? "Fincer · Steven Goudsblom · LinkedIn" : reference.name}>
            <ReferenceMark name={reference.name} />
          </a>
        </li>)}
      </ul>
    </div>)}
  </div>;
}
