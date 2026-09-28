import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Download, ShieldCheck } from "lucide-react";
import { useLanguage } from "./i18n/context";
import { Bento, BentoFilm, Tegel } from "./Bento";
import { BELOFTES, FILMS, STAPPEN, filmPad, filmPosterPad, pdfPad, type Taal } from "./veiligheid-beloftes";
import "./veiligheid.css";

// Veiligheid, 28 september 2026 (Marinus): de veiligheidsvideo en de sleutelbelofte krijgen een
// prominente plek, zodat bezoekers hun API-sleutels durven te koppelen.
// VeiligheidBlok staat op de homepage na de live sites en vóór "Four faces"; die plaatsing doet de
// homepage-regie in Home(). Sinds 28 september in de gedeelde bentotegels. VeiligheidPagina is /veiligheid (Engels zonder voorvoegsel, /nl/veiligheid).
// Sinds 28 september de vijf vertrouwen-films, één per onderdeel, in plaats van de robotfilm; de Sound on-pil zet de stem aan.
// Nederlands krijgt de Nederlandse film en pdf, alle andere talen de Engelse.

function useTaal(): Taal {
  const { language } = useLanguage();
  return language === "nl" ? "nl" : "en";
}

function PdfKnop({ taal, label }: { taal: Taal; label?: string }) {
  return (
    <a className="vh-knop" href={pdfPad(taal)} target="_blank" rel="noopener" download>
      <Download size={17} aria-hidden="true" />
      <span>{label || "Download de sleutelbelofte (PDF)"}</span>
    </a>
  );
}

function Beloftes() {
  return (
    <ul className="vh-beloftes">
      {BELOFTES.map((b) => (
        <li key={b.kop}>
          <span className="vh-vink"><Check size={15} aria-hidden="true" /></span>
          <span>
            <strong>{b.kop}</strong>
            <span>{b.tekst}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// Eén vertrouwen-film per onderdeel, stil in een lus met de Sound on-pil van het landingsscherm.
function FilmTegel({ slug, taal, breed }: { slug: string; taal: Taal; breed: 3 | 4 | 8 | 12 }) {
  const film = FILMS.find((f) => f.slug === slug)!;
  return (
    <Tegel kop={film.kop} breed={breed} soort="film">
      <BentoFilm key={taal} src={filmPad(slug, taal)} poster={filmPosterPad(slug, taal)} label={film.kop} />
    </Tegel>
  );
}

export default function VeiligheidBlok() {
  const taal = useTaal();
  return (
    <Bento id="veiligheid" label="Sleutelbelofte" titel={<>Jouw sleutels zijn veilig.<br /><span>Zwart op wit.</span></>} className="vh-bento">
      <FilmTegel slug="versleuteling" taal={taal} breed={8} />
      <Tegel kop="Het officiële document" breed={4} soort="groen">
        <p className="sn-tegel-label">PDF, Nederlands en Engels</p>
        <p className="sn-tegel-titel">Zeven beloftes over je API-sleutels.</p>
        <div className="sn-tegel-onder">
          <PdfKnop taal={taal} label="Download de sleutelbelofte" />
          <Link className="vh-link" to="/veiligheid">
            <span>Alles over veiligheid</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </Tegel>
      {FILMS.slice(1).map((f) => <FilmTegel key={f.slug} slug={f.slug} taal={taal} breed={3} />)}
    </Bento>
  );
}

export function VeiligheidPagina() {
  const taal = useTaal();
  return (
    <div className="vh-pagina">
      <section className="h-wrap vh-kop">
        <p className="vh-kicker"><ShieldCheck size={16} aria-hidden="true" /><span>Veiligheid en sleutelbelofte</span></p>
        <h1>Jouw sleutels zijn veilig. Zwart op wit.</h1>
        <p className="vh-intro">Het OS werkt pas echt als je het koppelt aan je eigen systemen. Daarvoor geef je ons een sleutel. Hier lees je wat we daarmee doen, en vooral wat niet.</p>
        <div className="vh-acties">
          <PdfKnop taal={taal} />
        </div>
      </section>
      <Bento className="vh-bento vh-films">
        <FilmTegel slug="versleuteling" taal={taal} breed={8} />
        <FilmTegel slug="toegang" taal={taal} breed={4} />
        <FilmTegel slug="goedkeuring" taal={taal} breed={4} />
        <FilmTegel slug="infrastructuur" taal={taal} breed={4} />
        <FilmTegel slug="koppelingen" taal={taal} breed={4} />
      </Bento>
      <section className="h-wrap vh-sectie" aria-labelledby="vh-beloftes-kop">
        <h2 id="vh-beloftes-kop">Onze belofte</h2>
        <Beloftes />
      </section>
      <section className="h-wrap vh-sectie" aria-labelledby="vh-stappen-kop">
        <h2 id="vh-stappen-kop">Zo koppel je veilig</h2>
        <ol className="vh-stappen">
          {STAPPEN.map((s, i) => (
            <li key={s.kop}>
              <span className="vh-nummer" aria-hidden="true">{String(i + 1)}</span>
              <strong>{s.kop}</strong>
              <span>{s.tekst}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="h-wrap vh-sectie vh-documenten" aria-labelledby="vh-doc-kop">
        <h2 id="vh-doc-kop">Het officiële document</h2>
        <p>De sleutelbelofte als pdf, in het Nederlands en in het Engels. Lees verder in onze beveiligingsmaatregelen en de verwerkersovereenkomst.</p>
        <div className="vh-acties">
          <PdfKnop taal="nl" label="Sleutelbelofte, Nederlands (PDF)" />
          <PdfKnop taal="en" label="Sleutelbelofte, Engels (PDF)" />
        </div>
        <div className="vh-acties">
          <Link className="vh-link" to="/beveiliging"><span>Beveiliging en responsible disclosure</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link className="vh-link" to="/verwerkersovereenkomst"><span>Verwerkersovereenkomst</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
