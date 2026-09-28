import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import { PageHeading } from "./ui";
import { useLanguage } from "./i18n/context";
import { people } from "./content";
import { INVEST_MAIL } from "./vacatures";

// 28 september 2026 (Marinus): "Investeerders moeten gewoon een aanvraag kunnen doen zodat ik op groei voorbereid ben,
// naar invest@socialnow.nl." invest@ is een alias op info@ bij Hostinger; Steef Komen (finance) neemt het gesprek.
// De site is statisch: het formulier opent een ingevuld e-mailconcept, net als /contact. Er staan bewust geen cijfers
// op zolang Marinus die niet aanlevert.

const SOORTEN = ["Business angel", "Fonds of VC", "Strategische partner", "Anders"];
const BEDRAGEN = ["Nog niet bekend", "Tot €50.000", "€50.000 tot €250.000", "€250.000 tot €1 miljoen", "Meer dan €1 miljoen"];

export function InvesteerdersPage() {
  const { t } = useLanguage();
  const steef = people.find((p) => p.name === "Steef Komen");
  const [concept, setConcept] = useState("");
  const [fout, setFout] = useState("");

  const verstuur = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const w = (k: string) => String(f.get(k) || "").trim();
    if (!w("naam")) return setFout(t("Vul je naam in."));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(w("email"))) return setFout(t("Dat e-mailadres klopt nog niet."));
    setFout("");
    const regels = [
      `${t("Naam")}: ${w("naam")}`,
      `${t("E-mailadres")}: ${w("email")}`,
      `${t("Organisatie of fonds")}: ${w("organisatie")}`,
      `${t("Soort investeerder")}: ${t(w("soort"))}`,
      `${t("Indicatie bedrag")}: ${t(w("bedrag"))}`,
      "",
      w("bericht"),
    ];
    const href = `mailto:${INVEST_MAIL}?subject=${encodeURIComponent(`${t("Investeerdersaanvraag")}: ${w("naam")}`)}&body=${encodeURIComponent(regels.join("\n"))}`;
    setConcept(href);
    window.location.href = href;
  };

  return (
    <>
      <PageHeading
        label="Investeerders"
        title={
          <>
            Groei mee met
            <br />
            <span>SocialNow OS.</span>
          </>
        }
        text="Duizenden bedrijven gaan het OS gebruiken. Wil je daarin investeren? Laat je gegevens achter, dan neemt Steef persoonlijk contact met je op."
      />
      <section className="h-wrap h-contact-layout">
        <div>
          {steef && (
            <div className="h-contact-person">
              <img src={`/images/${steef.image}`} alt={steef.name} width="180" height="180" />
              <div>
                <h2>Je gesprekspartner is Steef.</h2>
                <p translate="no">{steef.role}</p>
              </div>
            </div>
          )}
          <div className="h-contact-methods">
            <a href={`mailto:${INVEST_MAIL}`}>
              <Mail size={21} />
              <span>
                <small>E-mail</small>{INVEST_MAIL}
              </span>
              <ArrowUpRight size={19} />
            </a>
          </div>
          <p className="h-footnote">Elke aanvraag wordt persoonlijk gelezen. Je hoort binnen een paar werkdagen van ons.</p>
        </div>
        <form className="h-contact-form" onSubmit={verstuur} noValidate>
          <h2>Doe een aanvraag</h2>
          <div className="h-form-row">
            <label>
              Je naam
              <input name="naam" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              E-mailadres
              <input name="email" type="email" autoComplete="email" required maxLength={200} />
            </label>
          </div>
          <label>
            Organisatie of fonds
            <input name="organisatie" autoComplete="organization" maxLength={150} />
          </label>
          <div className="h-form-row">
            <label>
              Soort investeerder
              <select name="soort" defaultValue={SOORTEN[0]}>
                {SOORTEN.map((s) => <option key={s} value={s}>{t(s)}</option>)}
              </select>
            </label>
            <label>
              Indicatie bedrag
              <select name="bedrag" defaultValue={BEDRAGEN[0]}>
                {BEDRAGEN.map((b) => <option key={b} value={b}>{t(b)}</option>)}
              </select>
            </label>
          </div>
          <label>
            Wat wil je weten of bespreken?
            <textarea name="bericht" rows={5} maxLength={3000} />
          </label>
          <p className="h-form-note">
            Met de knop open je een ingevuld concept in je eigen e-mailapp. Je verstuurt de e-mail daar zelf.{" "}
            <Link to="/privacy">Privacybeleid</Link>
          </p>
          {fout && <p className="h-form-note" role="alert">{fout}</p>}
          <button type="submit" className="sn-btn3d h-button">
            <span className="sn-btn3d-sheen" />
            <span>Verstuur je aanvraag</span>
            <Mail size={17} />
          </button>
          {concept && (
            <div className="h-form-result" role="status">
              <strong>Je e-mailconcept is voorbereid.</strong>
              <p>Controleer en verstuur het in je e-mailapp. Er is vanuit deze website nog niets verzonden.</p>
              <a href={concept}>Open het concept opnieuw</a>
              <p>Geen e-mailapp ingesteld? Mail naar invest@socialnow.nl.</p>
            </div>
          )}
        </form>
      </section>
    </>
  );
}
