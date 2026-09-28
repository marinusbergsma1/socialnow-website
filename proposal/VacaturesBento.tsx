import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { vacatures, type Vacature } from "./vacatures";
import { useLanguage } from "./i18n/context";
import { Bento, Tegel } from "./Bento";
import "./vacatures-bento.css";

// 28 september 2026 (Marinus, via de Indeed-chat): vacatures als bentotegels op de homepage, in de gedeelde
// tegeltaal uit Bento.tsx. Eén grote tegel (partner verbindende laag), twee kleinere en een brede balk naar /vacatures.

// De partner voor de verbindende laag is de grote tegel. AI-expert betalingen is weg: die functie vervult Sid.
const GROOT = "partner-verbindende-laag";
const KLEIN = [
  { slug: "senior-ai-engineer", kop: "Het OS slimmer maken" },
  { slug: "customer-success-manager", kop: "Altijd voor klanten klaar" },
];

function mailLink(titel: string) {
  return `mailto:steef@socialnow.nl?subject=${encodeURIComponent(`Sollicitatie: ${titel}`)}`;
}

function Inhoud({ vacature, groot }: { vacature: Vacature; groot?: boolean }) {
  const { t } = useLanguage();
  const feiten = [vacature.plek, vacature.uren, vacature.salaris].filter(Boolean) as string[];
  return (
    <>
      <p className={groot ? "sn-tegel-titel h-vb-groot-titel" : "sn-tegel-titel h-vb-titel"}>{vacature.titel}</p>
      <p className="sn-tegel-tekst">{vacature.kort}</p>
      <ul className="h-vb-feiten">
        {(groot ? feiten : feiten.slice(1)).map((f) => <li key={f}>{f}</li>)}
      </ul>
      {groot && (
        <ul className="h-vb-lijst">
          {vacature.wat.slice(0, 3).map((regel) => <li key={regel}>{regel}</li>)}
        </ul>
      )}
      <div className="sn-tegel-onder">
        <a className="os-claim sn-btn3d h-button" href={mailLink(t(vacature.titel))}>
          <span className="sn-btn3d-sheen" />
          <span>Solliciteer direct</span>
        </a>
        <Link className="h-text-link" to={`/vacatures#${vacature.slug}`}>
          Lees meer
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}

export default function VacaturesBento() {
  const eerste = vacatures.find((v) => v.slug === GROOT) ?? vacatures[0];
  return (
    <Bento
      id="vacatures"
      label="Werken bij SocialNow"
      className="h-vb"
      swipe
      titel={
        <>
          Wij zoeken mensen.
          <br />
          <span>Voor duizenden bedrijven.</span>
        </>
      }
    >
      <Tegel kop="Partner gezocht" breed={8} hoog={2} soort="groen">
        <Inhoud vacature={eerste} groot />
      </Tegel>
      {KLEIN.map(({ slug, kop }) => {
        const v = vacatures.find((x) => x.slug === slug);
        return v ? (
          <Tegel key={slug} kop={kop} breed={4}>
            <Inhoud vacature={v} />
          </Tegel>
        ) : null;
      })}
      <Tegel kop="Alle vacatures" breed={12}>
        <Link className="h-vb-balk" to="/vacatures">
          <strong>Word de verbindende laag achter duizenden bedrijven.</strong>
          <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
      </Tegel>
    </Bento>
  );
}
