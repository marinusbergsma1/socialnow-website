import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Action, Heading, PageHeading } from "./ui";
import { useLanguage } from "./i18n/context";
import "./audit.css";

// Gratis Google Ads audit door Nick (23 september 2026, Marinus). Een klein blok onder het team
// (AuditTeaser) en een eigen pagina /audit met het aanvraagformulier. De aanvraag gaat naar
// os.socialnow.nl en wordt daar een lead (soort "audit") plus een mail aan info@, Marinus en
// Nick: zie socialnow-os-os/api/audit-aanvraag.js. Opzet naar het voorbeeld van Goodlife
// Marketing, vorm en toon van deze site.

const ENDPOINT = "https://os.socialnow.nl/api/audit-aanvraag";

export function AuditTeaser() {
  return (
    <div className="h-audit-teaser">
      <img src="/images/Nick-VK.webp" alt="Nick van Keulen" width="120" height="120" loading="lazy" />
      <div>
        <p className="h-eyebrow">Gratis Google Ads audit</p>
        <h3>Laat Nick je account doorlichten.</h3>
        <p>Handmatig, punt voor punt. Met een actieplan en een videocall.</p>
      </div>
      <Action to="/audit">Vraag je audit aan</Action>
    </div>
  );
}

export function AuditPage() {
  const { t, language } = useLanguage();
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"open" | "bezig" | "klaar">("open");
  const [fout, setFout] = useState("");

  const verstuur = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "bezig") return;
    const f = new FormData(event.currentTarget);
    const waarde = (k: string) => String(f.get(k) || "").trim();
    const data = {
      naam: waarde("naam"), email: waarde("email"), mobiel: waarde("mobiel"), website: waarde("website"),
      budget: waarde("budget"), vraag: waarde("vraag"), bedrijfsnaam2: waarde("bedrijfsnaam2"),
      taal: language, van: (params.get("van") || "website").slice(0, 30),
    };
    setFout("");
    if (!data.naam) return setFout(t("Vul je naam in."));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return setFout(t("Dat e-mailadres klopt nog niet."));
    if (!data.website) return setFout(t("Vul je website in."));
    if (!data.budget) return setFout(t("Kies je advertentiebudget."));
    setStatus("bezig");
    try {
      const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({ ok: false }));
      if (j?.ok) { setStatus("klaar"); return; }
      setStatus("open");
      setFout(language === "nl" && j?.error ? j.error : t("Het versturen lukte niet. Probeer het zo nog eens, of mail info@socialnow.nl."));
    } catch {
      setStatus("open");
      setFout(t("Het versturen lukte niet. Probeer het zo nog eens, of mail info@socialnow.nl."));
    }
  };

  return (
    <>
      <PageHeading
        label="Gratis Google Ads audit"
        title={
          <>
            Stop met verspillen.
            <br />
            <span>Bouw eerst het fundament.</span>
          </>
        }
        text="Nick van Keulen loopt je Google Ads-account zelf door, punt voor punt. Je ziet waar je budget weglekt en krijgt een helder actieplan om winstgevender te adverteren."
      />
      <div className="h-wrap h-audit-actie">
        <Action href="#aanvragen">Vraag je audit aan</Action>
        <p className="h-footnote">Beperkt aantal plekken per maand.</p>
      </div>

      <section className="h-section h-wrap">
        <Heading
          label="Waarom het tegenvalt"
          title={
            <>
              Meestal zit het
              <br />
              <span>in de fundering.</span>
            </>
          }
          text="Je investeert in Google, maar weet niet of elke euro goed besteed wordt. Je ROAS schommelt en opschalen kost geld. Daar beginnen we."
        />
        <ol className="h-steps h-audit-vier">
          <li>
            <span>01</span>
            <h3>Tracking die niet klopt.</h3>
            <p>Stuur je op verkeerde data, dan stuur je blind. We controleren je metingen zodat elke beslissing klopt.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Merk en nieuw door elkaar.</h3>
            <p>Dan betaal je voor klanten die je toch al had. We scheiden merkzoekwoorden van nieuwe vraag.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Rommelige structuur.</h3>
            <p>Geen overzicht is geen controle. We zien waar budget wegloopt naar irrelevante zoektermen en plaatsingen.</p>
          </li>
          <li>
            <span>04</span>
            <h3>Onduidelijke doelen.</h3>
            <p>Zonder heldere KPI's optimaliseer je op gevoel. We vertalen je doelen naar cijfers waar je op kunt sturen.</p>
          </li>
        </ol>
      </section>

      <section className="h-section h-wrap">
        <Heading
          label="Wat je krijgt"
          title={
            <>
              Een specialist.
              <br />
              <span>Geen rapport uit een tool.</span>
            </>
          }
        />
        <ol className="h-steps">
          <li>
            <span>01 / Review</span>
            <h3>Diepgaande review.</h3>
            <p>Conversietracking en GA4, campagnestructuur en biedstrategieën. Handmatig bekeken.</p>
          </li>
          <li>
            <span>02 / Kansen</span>
            <h3>Kansen en lekken.</h3>
            <p>Productfeed en Merchant Center, verspilling in zoektermen en quick wins die je direct kunt doen.</p>
          </li>
          <li>
            <span>03 / Plan</span>
            <h3>Actieplan en call.</h3>
            <p>Een videocall van 30 tot 45 minuten en een plan in gewone taal. Met of zonder ons uit te voeren.</p>
          </li>
        </ol>
      </section>

      <section className="h-section h-wrap h-contact-layout" id="aanvragen">
        <div>
          <div className="h-contact-person">
            <img src="/images/Nick-VK.webp" alt="Nick van Keulen" width="180" height="180" />
            <div>
              <h2>Nick doet je audit.</h2>
              <p>Google Ads Expert bij SocialNow</p>
            </div>
          </div>
          <p className="h-audit-quote">
            "Geen standaardrapport, maar een eerlijke analyse waar je direct mee aan de slag kunt."
          </p>
          <ul className="h-audit-lijst">
            <li>Of je conversietracking klopt</li>
            <li>Hoe je campagnestructuur presteert</li>
            <li>Waar je productfeed kansen laat liggen</li>
            <li>Welke quick wins direct opleveren</li>
            <li>Waar je budget verspild wordt</li>
          </ul>
          <p className="h-footnote">Gratis en zonder verplichtingen. Je geeft alleen leestoegang tot je account.</p>
        </div>
        {status === "klaar" ? (
          <div className="h-contact-form">
            <h2>Je aanvraag is binnen.</h2>
            <div className="h-form-result">
              <strong>Bedankt.</strong>
              <p>Nick neemt binnen twee werkdagen contact met je op om toegang en een moment voor de call te regelen.</p>
            </div>
          </div>
        ) : (
          <form className="h-contact-form" onSubmit={verstuur} noValidate>
            <h2>Vraag je gratis audit aan.</h2>
            <div className="h-form-row">
              <label>
                Je naam
                <input name="naam" autoComplete="name" placeholder="Voor- en achternaam" />
              </label>
              <label>
                E-mail
                <input name="email" type="email" autoComplete="email" placeholder="naam@bedrijf.nl" />
              </label>
            </div>
            <div className="h-form-row">
              <label>
                Website
                <input name="website" autoComplete="url" placeholder="www.jouwmerk.nl" />
              </label>
              <label>
                Telefoon
                <input name="mobiel" type="tel" autoComplete="tel" placeholder="+31 6 12345678" />
              </label>
            </div>
            <label>
              Budget Google Ads per maand
              <select name="budget" defaultValue="">
                <option value="">Maak een keuze</option>
                <option value="nog-niet">Nog niet gestart</option>
                <option value="0-5000">€0 - €5.000</option>
                <option value="5000-10000">€5.000 - €10.000</option>
                <option value="10000+">€10.000+</option>
              </select>
            </label>
            <label>
              Waar wil je vooral meer over weten?
              <textarea name="vraag" rows={3} maxLength={1000} placeholder="Optioneel" />
            </label>
            {/* Honeypot: een mens ziet dit veld nooit. */}
            <input name="bedrijfsnaam2" tabIndex={-1} autoComplete="off" aria-hidden="true" className="h-audit-honing" />
            {fout && <p className="h-audit-fout" role="alert">{fout}</p>}
            <button className="sn-btn3d h-button" type="submit" disabled={status === "bezig"}>
              <span className="sn-btn3d-sheen" />
              <span>{status === "bezig" ? "Versturen…" : "Vraag je audit aan"}</span>
              <span className="h-button-icon"><ArrowUpRight size={16} aria-hidden="true" /></span>
            </button>
            <p className="h-form-note">
              We gebruiken je gegevens alleen voor deze audit. Lees ons <a href="/privacy">privacybeleid</a>.
            </p>
          </form>
        )}
      </section>
    </>
  );
}
