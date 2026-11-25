import React, { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACTEN } from "./contacten";
import { people } from "./content";
import { klein } from "./licht";
import { useLanguage } from "./i18n/context";
import { heeftWhatsApp, whatsappLink } from "./aanvragen";
import "./header-algemeen.css";
import "./contact-nieuw.css";

// /contact, 25 november 2026. MARINUS: "zowel in de footer als header kom je bij contact en eventueel een uitleg dat alles maatwerk is
// maar wel even een mooi onderscheid en team groot aanwezig met duidelijke uitleg hoe en wat we doen." Dus: bovenaan dat alles
// maatwerk is, dan kiest de bezoeker een onderwerp en ziet hij direct wie hem helpt (met formulier), daarna hoe we werken, wat we doen
// per onderdeel en het team groot in beeld. Het Diensten-menu en de footer openen deze pagina met ?onderwerp=<soort> (Producten.tsx).
// De oude pagina (ContactPage in paginas.tsx, "Begin bij Steef") staat er nog, maar de route gebruikt deze.

type Persoon = "Marinus Bergsma" | "Steef Komen" | "Michelle Yang" | "Ben Sterckx";

const ONDERWERPEN: { soort: string; titel: string; regel: string; wie: Persoon; hint: string }[] = [
  { soort: "management-operations", titel: "Management & Operations", regel: "Processen, rollen, systemen en Odoo.", wie: "Michelle Yang", hint: "Bijvoorbeeld: welke processen lopen vast, en welke systemen gebruik je nu?" },
  { soort: "finance", titel: "Finance & Data", regel: "Boekhouding, cijfers en rapportage.", wie: "Steef Komen", hint: "Bijvoorbeeld: welke cijfers mis je nu om goed te kunnen sturen?" },
  { soort: "os", titel: "Custom OS", regel: "Je eigen OS rond je bedrijf.", wie: "Steef Komen", hint: "Bijvoorbeeld: met hoeveel mensen werk je, en welke tools wil je vervangen?" },
  { soort: "groei", titel: "Groei", regel: "Koers, marketing, ads en leads.", wie: "Marinus Bergsma", hint: "Bijvoorbeeld: wat wil je de komende 90 dagen bereiken?" },
  { soort: "websites", titel: "Websites", regel: "Altijd eerst een gratis websitedemo.", wie: "Marinus Bergsma", hint: "Je huidige website, als je die hebt, en wat de nieuwe moet opleveren." },
  { soort: "cybersecurity", titel: "Cybersecurity", regel: "Kwetsbaarheden vinden en aanpakken.", wie: "Marinus Bergsma", hint: "Welk domein of welke omgeving zullen we bekijken?" },
  { soort: "belgie", titel: "Odoo in België", regel: "Trajecten en partners in België.", wie: "Ben Sterckx", hint: "Bijvoorbeeld: gebruik je al Odoo, en waar wil je naartoe?" },
  { soort: "anders", titel: "Iets anders", regel: "Pers, partnerships of een andere vraag.", wie: "Marinus Bergsma", hint: "Vertel kort waar je vraag over gaat." },
];

const STAPPEN = [
  { titel: "Kennismaken", tekst: "Een gesprek van 30 minuten. We horen hoe je bedrijf werkt en waar het knelt." },
  { titel: "Voorstel op maat", tekst: "Geen pakketten of prijslijsten. Je krijgt een voorstel met een vaste prijs, zodat je vooraf weet waar je aan toe bent." },
  { titel: "Inrichten en uitvoeren", tekst: "Onze experts doen het werk in je eigen omgeving, met AI waar het tijd scheelt." },
  { titel: "Samen bijsturen", tekst: "Een vast ritme met cijfers en voortgang, zodat je ziet wat het oplevert." },
];

const ONDERDELEN = [
  { soort: "management-operations", titel: "Management & Operations", regel: "Meer grip op je processen, systemen en cijfers.", punten: ["Doorlichting van processen, rollen en knelpunten", "Werkafspraken en een overzicht van de cijfers", "Invoering met Odoo, CRM of een eigen OS"] },
  { soort: "groei", titel: "Groei", regel: "Persoonlijk advies en marketing die leads oplevert.", punten: ["Koers en een plan voor 90 dagen", "Content en advertenties in je eigen merk", "Leads direct in je CRM"] },
  { soort: "websites", titel: "Websites", regel: "Een website die past bij je merk en aanvragen oplevert.", punten: ["Altijd eerst een gratis websitedemo", "Ontwerp en bouw voor desktop en mobiel", "Gekoppeld aan je CRM en OS"] },
  { soort: "cybersecurity", titel: "Cybersecurity", regel: "Vind kwetsbaarheden en pak de belangrijkste aan.", punten: ["Controle van toegang, koppelingen en back-ups", "Kort rapport met prioriteiten", "Verbeteringen doorvoeren en herstel testen"] },
];

const WAT_ZE_DOEN: Record<Persoon, string> = {
  "Marinus Bergsma": "Strategie, groei en merk. Je eerste aanspreekpunt als directie of eigenaar.",
  "Steef Komen": "Cijfers, rapportage en de financiële inrichting in Odoo en je eigen OS.",
  "Michelle Yang": "Processen, voorraad en de dagelijkse operatie, van order tot levering.",
  "Ben Sterckx": "Odoo-trajecten en partnerships in België.",
};

const TEAM: Persoon[] = ["Marinus Bergsma", "Steef Komen", "Michelle Yang", "Ben Sterckx"];

function gegevens(naam: Persoon) {
  const p = people.find((x) => x.name === naam);
  const c = CONTACTEN.find((x) => x.naam === naam);
  return { naam, rol: p?.role ?? "", foto: p?.image ?? "", mail: c?.mail ?? "info@socialnow.nl", tel: c?.tel, telTekst: c?.telTekst };
}

export default function ContactNieuw() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const gevraagd = params.get("onderwerp") || "";
  // Oude links (?onderwerp=Custom OS, Koppelingen, een agentnaam) gingen naar Steef; die komen nu bij Custom OS uit, met hun tekst als onderwerp.
  const bekend = ONDERWERPEN.some((o) => o.soort === gevraagd);
  const [soort, zetSoort] = useState(bekend ? gevraagd : gevraagd ? "os" : "management-operations");
  const [klaar, zetKlaar] = useState("");
  const kies = useRef<HTMLDivElement>(null);
  const onderwerp = ONDERWERPEN.find((o) => o.soort === soort) ?? ONDERWERPEN[0];
  const wie = gegevens(onderwerp.wie);
  const extra = !bekend && gevraagd ? gevraagd : "";

  const naarKeuze = (nieuw: string) => {
    zetSoort(nieuw);
    zetKlaar("");
    kies.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const verstuur = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const titel = `${t("Aanvraag")}: ${t(onderwerp.titel)}${extra ? ` (${extra})` : ""}`;
    const tekst = `${t("Naam")}: ${d.get("naam")}\n${t("Bedrijf")}: ${d.get("bedrijf")}\n${t("E-mail")}: ${d.get("email")}\n${t("Telefoon")}: ${d.get("telefoon")}\n\n${d.get("bericht")}`;
    const href = `mailto:${wie.mail}?subject=${encodeURIComponent(titel)}&body=${encodeURIComponent(tekst)}`;
    zetKlaar(href);
    window.location.href = href;
  };

  return <div className="cn">
    <section className="cn-kop cn-wrap">
      <p className="sn-alg-label"><i />Contact</p>
      <h1>Alles maatwerk. <span>Eén vast aanspreekpunt.</span></h1>
      <p className="cn-intro">We werken niet met vaste pakketten of prijslijsten. Eerst kijken we hoe je bedrijf werkt, daarna krijg je een voorstel met een vaste prijs. Kies waar je vraag over gaat en je komt direct bij de juiste persoon uit ons team.</p>
    </section>

    <section className="cn-wrap cn-keuze" ref={kies} id="kies" aria-labelledby="cn-kies-kop">
      <div>
        <h2 id="cn-kies-kop" className="cn-klein-kop">Waar kunnen we je mee helpen?</h2>
        <div className="cn-onderwerpen" role="radiogroup" aria-labelledby="cn-kies-kop">
          {ONDERWERPEN.map((o) => <button key={o.soort} type="button" role="radio" aria-checked={o.soort === soort} className="cn-onderwerp" onClick={() => { zetSoort(o.soort); zetKlaar(""); }}>
            <b>{o.titel}</b><span>{o.regel}</span><small translate="no">{o.wie}</small>
          </button>)}
        </div>
      </div>

      <aside className="cn-paneel" aria-live="polite">
        <div className="cn-persoon">
          {wie.foto && <img {...klein(wie.foto, "72px", [96, 160])} alt="" width="72" height="72" />}
          <div><strong translate="no">{wie.naam}</strong><span>{wie.rol}</span></div>
        </div>
        <div className="cn-direct">
          <a href={`mailto:${wie.mail}`}><Mail size={15} aria-hidden="true" /><span translate="no">{wie.mail}</span></a>
          {wie.tel
            ? <a href={`tel:${wie.tel}`}><Phone size={15} aria-hidden="true" /><span translate="no">{wie.telTekst}</span></a>
            : <a href="/afspraak"><ArrowUpRight size={15} aria-hidden="true" /><span>Plan een call</span></a>}
        </div>
        <form className="cn-form" onSubmit={verstuur} onChange={() => zetKlaar("")}>
          <div className="cn-twee">
            <label>Naam<input name="naam" required autoComplete="name" maxLength={100} /></label>
            <label>Bedrijf<input name="bedrijf" autoComplete="organization" maxLength={150} /></label>
          </div>
          <div className="cn-twee">
            <label>E-mail<input name="email" type="email" required autoComplete="email" maxLength={200} /></label>
            <label>Telefoon<input name="telefoon" type="tel" autoComplete="tel" maxLength={40} /></label>
          </div>
          <label>Waar werk je aan?<textarea name="bericht" required rows={4} maxLength={3000} placeholder={onderwerp.hint} /></label>
          <button type="submit" className="sn-pill"><span>Mail <span translate="no">{wie.naam.split(" ")[0]}</span></span><ArrowUpRight size={16} aria-hidden="true" /></button>
          <p className="cn-noot">De knop opent een ingevuld concept in je eigen e-mailapp; je verstuurt het daar zelf. <Link to="/privacy">Privacybeleid</Link></p>
          {klaar && <p className="cn-noot" role="status">Geen e-mailapp geopend? <a href={klaar}>Open het concept opnieuw</a> of mail naar <span translate="no">{wie.mail}</span>.</p>}
        </form>
      </aside>
    </section>

    <section className="cn-wrap cn-sectie" aria-labelledby="cn-hoe-kop">
      <p className="sn-alg-label"><i />Hoe we werken</p>
      <h2 id="cn-hoe-kop">Van eerste gesprek tot resultaat.</h2>
      <ol className="cn-stappen">
        {STAPPEN.map((s, i) => <li key={s.titel}><span className="cn-nr">0{i + 1}</span><h3>{s.titel}</h3><p>{s.tekst}</p></li>)}
      </ol>
    </section>

    <section className="cn-wrap cn-sectie" aria-labelledby="cn-wat-kop">
      <p className="sn-alg-label"><i />Wat we doen</p>
      <h2 id="cn-wat-kop">Vier onderdelen. Eén team dat ze verbindt.</h2>
      <div className="cn-onderdelen">
        {ONDERDELEN.map((o) => <article key={o.soort} className={o.soort === "management-operations" ? "cn-onderdeel is-kern" : "cn-onderdeel"}>
          <h3>{o.titel}</h3>
          <p>{o.regel}</p>
          <ul>{o.punten.map((p) => <li key={p}>{p}</li>)}</ul>
          <button type="button" className="cn-link" onClick={() => naarKeuze(o.soort)}>Bespreek {o.titel}<ArrowUpRight size={15} aria-hidden="true" /></button>
        </article>)}
      </div>
    </section>

    <section className="cn-wrap cn-sectie" aria-labelledby="cn-team-kop">
      <p className="sn-alg-label"><i />Ons team</p>
      <h2 id="cn-team-kop">Geen accountmanagers. De mensen die het werk doen.</h2>
      <ul className="cn-team">
        {TEAM.map((naam) => {
          const g = gegevens(naam);
          return <li key={naam}>
            {g.foto && <img {...klein(g.foto, "(max-width: 700px) 90vw, 300px", [320, 480])} alt={naam} width="480" height="600" loading="lazy" />}
            <div>
              <strong translate="no">{naam}</strong>
              <span className="cn-rol">{g.rol}</span>
              <p>{WAT_ZE_DOEN[naam]}</p>
              <a href={`mailto:${g.mail}`}><Mail size={15} aria-hidden="true" /><span translate="no">{g.mail}</span></a>
              {g.tel && <a href={`tel:${g.tel}`}><Phone size={15} aria-hidden="true" /><span translate="no">{g.telTekst}</span></a>}
            </div>
          </li>;
        })}
      </ul>
      <Link className="cn-link cn-teamlink" to="/team">Ontmoet het hele team<ArrowUpRight size={15} aria-hidden="true" /></Link>
    </section>

    <section className="cn-wrap cn-adres">
      <div><MapPin size={18} aria-hidden="true" /><span>Amstelstraat 43G<br />1017 DA Amsterdam</span></div>
      <div><Phone size={18} aria-hidden="true" /><a href="tel:+31637404577" translate="no">06 37 40 45 77</a></div>
      {heeftWhatsApp && <div><MessageCircle size={18} aria-hidden="true" /><a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a></div>}
      <div><Mail size={18} aria-hidden="true" /><a href="mailto:info@socialnow.nl" translate="no">info@socialnow.nl</a></div>
    </section>
  </div>;
}
