import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";
import { PageHeading } from "./ui";
import { people, expertGroepen } from "./content";
import { klein } from "./licht";
import { CONTACT_MAIL } from "./aanvragen";
import { vacatures, VACATURE_MAIL, TEAMS, type Vacature } from "./vacatures";
import { useLanguage } from "./i18n/context";
import "./mens-en-ai.css";
import "./vacatures-page.css";

// 28 september 2026 (Marinus): de vacatures voor de verbindende laag en het team dat we nu nodig hebben.
// Solliciteren gaat per mail naar offer@ (VACATURE_MAIL); Steef Komen beheert de vacatures. De functie staat al in het onderwerp.
// 19 oktober 2026 (Marinus): "Ik mis even de job offers die er eerst wel stonden. Er moet een pagina komen waarin een hoop
// banen staan waar mensen zich voor aan kunnen melden. Maar ook alvast voor Connect met uitleg." Dus: twee ingangen bovenaan,
// zoeken en filteren per team, per functie een aanmeldformulier, en onderaan Connect met uitleg en aanmelden als expert.
// De formulieren maken een ingevuld mailconcept, net als Plan een call; er is (nog) geen eigen verzendadres op de site.

const ALLES = "Alles";

function soortNaarSchema(soort: string) {
  const s = soort.toLowerCase();
  const uit: string[] = [];
  if (s.includes("loondienst")) uit.push("FULL_TIME");
  if (s.includes("parttime")) uit.push("PART_TIME");
  if (s.includes("freelance")) uit.push("CONTRACTOR");
  if (s.includes("stage")) uit.push("INTERN");
  return uit.length ? uit : ["OTHER"];
}

// Google for Jobs leest deze gegevens; Indeed gebruikt dezelfde teksten uit vacatures.ts.
function JobPostings() {
  const data = vacatures.map((v: Vacature) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: v.titel,
    description: [v.kort, v.samen, ...v.wat, ...v.wie].filter(Boolean).map((regel) => `<p>${regel}</p>`).join(""),
    datePosted: v.sinds ?? "2026-09-28",
    validThrough: "2026-12-31",
    employmentType: soortNaarSchema(v.soort),
    hiringOrganization: { "@type": "Organization", name: "SocialNow", sameAs: "https://socialnow.nl", logo: "https://socialnow.nl/favicon.png", email: VACATURE_MAIL },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: "Amstelstraat 43G", addressLocality: "Amsterdam", postalCode: "1017 DA", addressCountry: "NL" } },
    ...(v.salarisMin && v.salarisMax
      ? { baseSalary: { "@type": "MonetaryAmount", currency: "EUR", value: { "@type": "QuantitativeValue", minValue: v.salarisMin, maxValue: v.salarisMax, unitText: "MONTH" } } }
      : {}),
    directApply: true,
    url: `https://socialnow.nl/vacatures#${v.slug}`,
  }));
  return <script type="application/ld+json" translate="no" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

type Veld = { naam: string; label: string; type?: "email" | "tel" | "url" | "tekst"; verplicht?: boolean; breed?: boolean };

// Eén formulier voor solliciteren en voor aanmelden bij Connect. Verzenden opent de mailapp met alles ingevuld.
function AanmeldVorm({ velden, aan, onderwerp, knop, keuzes, keuzeLabel }: {
  velden: Veld[]; aan: string; onderwerp: string; knop: string; keuzes?: string[]; keuzeLabel?: string;
}) {
  const { t } = useLanguage();
  const [waarden, zetWaarden] = useState<Record<string, string>>({});
  const [keuze, zetKeuze] = useState("");
  const [klaar, zetKlaar] = useState("");
  const verstuur = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    const regels = velden.map((v) => `${t(v.label)}: ${(waarden[v.naam] ?? "").trim()}`);
    if (keuzes && keuzeLabel) regels.splice(2, 0, `${t(keuzeLabel)}: ${t(keuze || "Anders")}`);
    const link = `mailto:${aan}?subject=${encodeURIComponent(onderwerp)}&body=${encodeURIComponent(regels.join("\n"))}`;
    zetKlaar(link);
    window.location.href = link;
  };
  return (
    <form className="h-vac-vorm" onSubmit={verstuur} noValidate>
      {keuzes && keuzeLabel && (
        <fieldset className="h-vac-veld is-breed">
          <legend>{keuzeLabel}</legend>
          <div className="h-vac-keuzes">
            {keuzes.map((k) => (
              <button key={k} type="button" aria-pressed={keuze === k} onClick={() => zetKeuze(keuze === k ? "" : k)}>{k}</button>
            ))}
          </div>
        </fieldset>
      )}
      {velden.map((v) => (
        <label key={v.naam} className={`h-vac-veld${v.breed ? " is-breed" : ""}`}>
          <span>{v.label}{!v.verplicht && <i> (optioneel)</i>}</span>
          {v.type === "tekst"
            ? <textarea name={v.naam} rows={4} required={v.verplicht} value={waarden[v.naam] ?? ""} onChange={(e) => zetWaarden({ ...waarden, [v.naam]: e.target.value })} />
            : <input name={v.naam} type={v.type ?? "text"} required={v.verplicht} autoComplete={v.type === "email" ? "email" : v.type === "tel" ? "tel" : undefined} value={waarden[v.naam] ?? ""} onChange={(e) => zetWaarden({ ...waarden, [v.naam]: e.target.value })} />}
        </label>
      ))}
      <div className="h-vac-verstuur is-breed">
        <button type="submit" className="sn-pill sn-btn3d h-button">
          <span className="sn-btn3d-sheen" />
          <span>{knop}</span>
          <span className="h-button-icon"><ArrowUpRight size={16} aria-hidden="true" /></span>
        </button>
        <p>Je opent je e-mailapp met een ingevuld concept. Je aanmelding is pas verzonden als je daar op verzenden drukt.</p>
        {klaar && <p>Opent er niets? Mail ons op <a href={klaar} translate="no">{aan}</a>.</p>}
      </div>
    </form>
  );
}

const SOLLICITATIE_VELDEN: Veld[] = [
  { naam: "voornaam", label: "Voornaam", verplicht: true },
  { naam: "achternaam", label: "Achternaam", verplicht: true },
  { naam: "email", label: "E-mailadres", type: "email", verplicht: true },
  { naam: "telefoon", label: "Telefoonnummer", type: "tel" },
  { naam: "profiel", label: "LinkedIn of portfolio", type: "url", breed: true },
  { naam: "waarom", label: "Waarom jij?", type: "tekst", verplicht: true, breed: true },
];

const CONNECT_VELDEN: Veld[] = [
  { naam: "naam", label: "Naam", verplicht: true },
  { naam: "email", label: "E-mailadres", type: "email", verplicht: true },
  { naam: "bedrijf", label: "Bedrijfsnaam", verplicht: true },
  { naam: "website", label: "Website of portfolio", type: "url" },
  { naam: "wat", label: "Wat doe je voor ondernemers?", type: "tekst", verplicht: true, breed: true },
];

// Uitleg voor experts, uit het brein (ADR-012 betalen en escrow, keuring door SocialNow, rangorde op reviews).
const CONNECT_STAPPEN = [
  { kop: "Meld je aan", tekst: "Vertel wie je bent, wat je doet en voor wie. Aanmelden is gratis." },
  { kop: "Kennismaking en keuring", tekst: "We bekijken je werk en spreken je persoonlijk. Pas na de keuring sta je zichtbaar op Connect." },
  { kop: "Je profiel staat live", tekst: "Met je eigen merk, logo, portfolio en aanbod. Ondernemers vinden je op naam en vakgebied." },
  { kop: "Ondernemers kiezen jou", tekst: "Je krijgt een opdracht met briefing, en alleen voor die opdracht toegang tot de gegevens die je nodig hebt." },
  { kop: "Veilig betaald", tekst: "De klant betaalt vooraf. Het geld staat vast tot jullie allebei akkoord zijn, daarna krijg jij 85%." },
];

function Vacatures() {
  const { t } = useLanguage();
  const [team, zetTeam] = useState<string>(ALLES);
  const [zoek, zetZoek] = useState("");
  const [open, setOpen] = useState<string | null>(() =>
    typeof window !== "undefined" ? window.location.hash.slice(1) || null : null,
  );
  const q = zoek.trim().toLowerCase();
  const lijst = vacatures.filter((v) => (team === ALLES || v.team === team)
    && (!q || `${v.titel} ${t(v.titel)} ${v.kort} ${t(v.kort)} ${v.soort} ${t(v.team)}`.toLowerCase().includes(q)));
  return (
    <div id="functies" className="h-vac-functies">
      <div className="h-vac-kopregel">
        <h2><span>{vacatures.length}</span> vacatures</h2>
        <label className="h-vac-zoek">
          <Search size={18} aria-hidden="true" />
          <input type="search" value={zoek} onChange={(e) => zetZoek(e.target.value)} placeholder={t("Zoek een functie, bijvoorbeeld designer")} aria-label={t("Zoek een functie")} />
        </label>
      </div>
      <div className="h-vac-teams" role="group" aria-label={t("Team")}>
        {[ALLES, ...TEAMS].map((naam) => {
          const aantal = naam === ALLES ? vacatures.length : vacatures.filter((v) => v.team === naam).length;
          return <button key={naam} type="button" aria-pressed={team === naam} onClick={() => zetTeam(naam)}>{naam} <span>{aantal}</span></button>;
        })}
      </div>
      <ul className="h-vac-lijst">
        {lijst.map((v) => {
          const isOpen = open === v.slug;
          return (
            <li key={v.slug} id={v.slug} className={`h-vac-item${v.uitgelicht ? " is-uitgelicht" : ""}${isOpen ? " is-open" : ""}`}>
              <button
                type="button"
                className="h-vac-kop"
                aria-expanded={isOpen}
                aria-controls={`${v.slug}-inhoud`}
                onClick={() => setOpen(isOpen ? null : v.slug)}
              >
                <span className="h-vac-titel">
                  {v.uitgelicht && <span className="h-vac-badge">Uitgelicht</span>}
                  <b>{v.titel}</b>
                  <span>{v.kort}</span>
                </span>
                <span className="h-vac-meta">
                  <span className="h-vac-team">{v.team}</span>
                  <span>{v.soort}</span>
                  <span>{v.uren}</span>
                  {v.salaris && <span className="h-vac-salaris">{v.salaris}</span>}
                </span>
                <span className="h-vac-plus" aria-hidden="true" />
              </button>
              <div className="h-vac-inhoud" id={`${v.slug}-inhoud`} hidden={!isOpen}>
                {(v.samen || v.plek) && (
                  <p className="h-vac-samen">{[v.plek, v.samen].filter(Boolean).map((r) => t(r!)).join(". ")}</p>
                )}
                <div>
                  <h3>Wat je doet</h3>
                  <ul>{v.wat.map((r) => <li key={r}>{r}</li>)}</ul>
                </div>
                <div>
                  <h3>Wie je bent</h3>
                  <ul>{v.wie.map((r) => <li key={r}>{r}</li>)}</ul>
                </div>
                <div className="h-vac-aanmelden">
                  <h3>Meld je aan</h3>
                  <AanmeldVorm velden={SOLLICITATIE_VELDEN} aan={VACATURE_MAIL} onderwerp={`${t("Sollicitatie")}: ${t(v.titel)}`} knop="Solliciteer" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {lijst.length === 0 && <p className="h-vac-leeg">Geen functie gevonden. Probeer een ander woord of stuur een open sollicitatie.</p>}
    </div>
  );
}

function ConnectAanmelden() {
  const { t } = useLanguage();
  return (
    <section id="connect" className="h-vac-connect" aria-labelledby="connect-titel">
      <div className="h-wrap">
        <p className="cx-merk" translate="no">SocialNow <b>Connect</b></p>
        <h2 id="connect-titel">Word expert op Connect.</h2>
        <p className="h-vac-connect-intro">
          Connect is het platform waar ondernemers zelf hun expert zoeken, vergelijken en kiezen. Heb je een eigen bedrijf in
          marketing, design, development of finance? Meld je nu aan, dan sta je klaar als Connect op 15 november opent.
        </p>
        <ul className="h-vac-feiten">
          <li><strong>{t("15 november")}</strong><span>Connect opent</span></li>
          <li><strong>85%</strong><span>van elke opdracht voor jou</span></li>
          <li><strong>{expertGroepen.length}</strong><span>vakgebieden</span></li>
          <li><strong>{people.length}</strong><span>experts gingen je voor</span></li>
        </ul>
        <h3 className="h-vac-connect-sub">Zo werkt het</h3>
        <ol className="h-vac-stappen">
          {CONNECT_STAPPEN.map((s, i) => (
            <li key={s.kop}><span className="h-vac-stap-nr">{i + 1}</span><strong>{s.kop}</strong><p>{s.tekst}</p></li>
          ))}
        </ol>
        <p className="h-vac-connect-klein">
          Connect rekent 15% per opdracht. Reviews van klanten, op tijd leveren en snel reageren bepalen je plek in de zoekresultaten.
          Afspraken met klanten lopen via Connect.
        </p>
        <div className="h-vac-connect-vorm">
          <h3>Meld je aan als expert</h3>
          <AanmeldVorm
            velden={CONNECT_VELDEN}
            aan={CONTACT_MAIL}
            onderwerp={t("Aanmelden als expert bij Connect")}
            knop="Meld je aan als expert"
            keuzes={expertGroepen.map((g) => g.name)}
            keuzeLabel="Vakgebied"
          />
        </div>
        <a className="h-text-link h-vac-connect-meer" href="/connect/" translate="no">Over SocialNow Connect <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

export function VacaturesPage() {
  const steef = people.find((p) => p.name === "Steef Komen");
  return (
    <>
      <JobPostings />
      <PageHeading
        label="Werken bij SocialNow"
        title={
          <>
            Kies je plek.
            <br />
            <span>In ons team of als expert op Connect.</span>
          </>
        }
        text="Persoonlijk contact maakt het verschil. We zoeken mensen die klanten en zelfstandige partners verbinden en samen klantvriendelijke producten maken, ondersteund door AI-technologie."
      />
      <section className="h-wrap h-vac">
        <div className="h-vac-ingangen">
          <a className="h-vac-ingang" href="#functies">
            <span className="h-vac-ingang-label">Werken bij SocialNow</span>
            <strong>{vacatures.length} vacatures</strong>
            <span>Vast, parttime, freelance of stage. Amsterdam en hybride.</span>
            <span className="h-text-link">Bekijk de vacatures <ArrowUpRight size={17} aria-hidden="true" /></span>
          </a>
          <a className="h-vac-ingang is-connect" href="#connect">
            <span className="h-vac-ingang-label" translate="no">SocialNow Connect</span>
            <strong>Expert met een eigen bedrijf?</strong>
            <span>Meld je aan voor Connect. Opent 15 november.</span>
            <span className="h-text-link">Lees hoe het werkt <ArrowUpRight size={17} aria-hidden="true" /></span>
          </a>
        </div>
        <Vacatures />
        <div className="h-vac-open">
          <h2>Staat jouw functie er niet tussen?</h2>
          <p>Vertel ons wat je kunt en waarom je gelooft in mens en AI samen. We lezen elke mail zelf.</p>
          <a className="h-text-link" href={`mailto:${VACATURE_MAIL}?subject=${encodeURIComponent("Open sollicitatie")}`}>
            Open sollicitatie
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        {steef && (
          <div className="h-vac-contacten">
            <aside className="h-vac-contact">
              <img {...klein(steef.image, "72px", [96, 160], undefined, "20261015-team")} alt="" width="72" height="72" loading="lazy" />
              <div>
                <p className="h-vac-contact-naam"><strong>{steef.name}</strong><span>{steef.role}</span></p>
                <p>Steef beheert onze vacatures en leest elke sollicitatie zelf. Vragen over een functie? Mail hem gerust.</p>
                <a className="h-text-link" href={`mailto:${VACATURE_MAIL}`}>
                  {VACATURE_MAIL}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            </aside>
            <aside className="h-vac-contact h-vac-invest" id="investeerders">
              <img {...klein(steef.image, "72px", [96, 160], undefined, "20261015-team")} alt="" width="72" height="72" loading="lazy" />
              <div>
                <p className="h-vac-contact-naam"><strong>Investeerders gezocht</strong><span>{steef.name} · {steef.role}</span></p>
                <p>We zoeken investeerders die mee willen bouwen aan SocialNow OS. Steef bespreekt het graag persoonlijk met je.</p>
                <Link className="h-text-link" to="/investeerders">
                  Doe een aanvraag
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
      <ConnectAanmelden />
    </>
  );
}
