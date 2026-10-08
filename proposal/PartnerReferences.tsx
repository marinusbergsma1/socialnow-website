import React, { useState } from "react";
import { partnerReferences } from "./content";
import { useLanguage, type Language } from "./i18n/context";
import "./partner-references.css";

// Existing assets already used by TeamTrust. No logo or company relationship is inferred.
const logoAssets: Record<string, string> = {
  "Femke’s Fotografie": "/images/merken/femkes-fotografie.webp",
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
    return <img src={src} alt={name} width="110" height="24" loading="lazy" decoding="async" onError={() => setFailed(true)} />;
  }
  if (name === "Attesso") {
    return <span className="sn-reference-wordmark"><b aria-hidden="true">~/a</b> Attesso</span>;
  }
  return <span className="sn-reference-fallback">{name}</span>;
}

export default function PartnerReferences({ personName }: { personName: string }) {
  const { language } = useLanguage();
  const references = partnerReferences[personName];
  if (!references?.length) return null;
  const copy = labels[language];
  const groups = [
    { label: copy.company, references: references.filter(reference => !experience.has(reference.name)) },
    { label: copy.experience, references: references.filter(reference => experience.has(reference.name)) },
  ];
  return <div className="h-partner-referenties sn-reference-groups" translate="no">
    {groups.filter(group => group.references.length).map(group => <div className="sn-reference-group" key={group.label}>
      <small className="sn-reference-label">{group.label}</small>
      <ul className="sn-reference-list" aria-label={group.label}>
        {group.references.map(reference => <li key={`${reference.name}-${reference.url}`}>
          <a className="sn-reference-link" href={reference.url} target="_blank" rel="noopener noreferrer" aria-label={reference.name === "Fincer" ? "Fincer · Steven Goudsblom · LinkedIn" : reference.name}>
            <ReferenceMark name={reference.name} />
          </a>
        </li>)}
      </ul>
    </div>)}
  </div>;
}
