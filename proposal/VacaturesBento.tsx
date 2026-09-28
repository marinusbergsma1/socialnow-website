import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { vacatures, type Vacature } from "./vacatures";
import { useLanguage } from "./i18n/context";
import "./vacatures-bento.css";

// 28 september 2026 (Marinus, via de Indeed-chat): vacatures als bentotegels op de homepage, in de taal van het
// landingsscherm. Eén grote tegel (AI-expert betalingen), twee kleinere en een brede balk naar /vacatures.
// Ontwerp uit claude/vacatures (b359a38), omgezet naar vacatures.ts. Zodra de homepage-regie een gedeelde
// tegelklasse heeft, gaat .h-vb-tegel daarop over.

const KLEIN = ["partner-verbindende-laag", "senior-ai-engineer"];

function mailLink(titel: string) {
  return `mailto:info@socialnow.nl?subject=${encodeURIComponent(`Sollicitatie: ${titel}`)}`;
}

function Tegel({ vacature, groot }: { vacature: Vacature; groot?: boolean }) {
  const { t } = useLanguage();
  const feiten = [vacature.uren, vacature.salaris].filter(Boolean) as string[];
  return (
    <article className={groot ? "h-vb-tegel h-vb-groot" : "h-vb-tegel"}>
      <p className="h-vb-plek">{vacature.plek ?? vacature.soort}</p>
      <h3>{vacature.titel}</h3>
      <p className="h-vb-kort">{vacature.kort}</p>
      <ul className="h-vb-feiten">
        {feiten.map((f) => <li key={f}>{f}</li>)}
      </ul>
      {groot && (
        <>
          <ul className="h-vb-lijst">
            {vacature.wat.slice(0, 3).map((regel) => <li key={regel}>{regel}</li>)}
          </ul>
          {vacature.samen && <p className="h-vb-samen">{vacature.samen}</p>}
        </>
      )}
      <div className="h-vb-acties">
        <Link className="h-vb-lees" to={`/vacatures#${vacature.slug}`}>Lees meer</Link>
        <a className="h-vb-knop" href={mailLink(t(vacature.titel))}>
          Solliciteer direct
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function VacaturesBento() {
  const [eerste] = vacatures;
  const klein = KLEIN.map((slug) => vacatures.find((v) => v.slug === slug)).filter(Boolean) as Vacature[];
  return (
    <section className="h-wrap h-vb" id="vacatures" aria-labelledby="vb-kop">
      <p className="h-vb-kop" id="vb-kop">Wij zoeken</p>
      <div className="h-vb-bento">
        <Tegel vacature={eerste} groot />
        {klein.map((v) => <Tegel key={v.slug} vacature={v} />)}
        <Link className="h-vb-tegel h-vb-open" to="/vacatures">
          <span>Alle vacatures</span>
          <strong>Word de verbindende laag achter duizenden bedrijven.</strong>
          <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
