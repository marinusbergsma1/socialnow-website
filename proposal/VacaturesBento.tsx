import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { vacatures, vacatureMail, financeMail, type Vacature } from "./vacatures";
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
        <a className="os-claim sn-btn3d h-button" href={vacatureMail(t(vacature.titel))}>
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

// Investeerders doen hun aanvraag op /investeerders (naar invest@socialnow.nl, Marinus 28 september 2026).
function InvestKnop() {
  return (
    <Link className="os-claim sn-btn3d h-button" to="/investeerders">
      <span className="sn-btn3d-sheen" />
      <span>Doe een aanvraag</span>
    </Link>
  );
}

export default function VacaturesBento() {
  const { t } = useLanguage();
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
          <span>Klaar voor duizenden bedrijven.</span>
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
      <Tegel kop="Investeerders gezocht" breed={12}>
        <p className="sn-tegel-titel h-vb-titel">Investeer mee in het OS.</p>
        <p className="sn-tegel-tekst">We zoeken investeerders die mee willen bouwen aan SocialNow OS. Steef Komen bespreekt het graag persoonlijk met je.</p>
        <div className="sn-tegel-onder">
          <InvestKnop />
          <a className="h-text-link" href={financeMail(t("Investeren in SocialNow"))}>
            invest@socialnow.nl
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </Tegel>
      <Tegel kop="Alle vacatures" breed={12}>
        <Link className="h-vb-balk" to="/vacatures">
          <strong>Word de verbindende laag achter duizenden bedrijven.</strong>
          <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
      </Tegel>
    </Bento>
  );
}
