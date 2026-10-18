import React from "react";
import { ArrowUpRight, ArrowRight, ChevronDown } from "lucide-react";
import { Action } from "./ui";
import { GRATIS_OS_URL } from "./os-entry";
import { useLanguage } from "./i18n/context";
import "./pricing.css";
import { ProductOffer, ProductRoute } from "./ProductStart";
import { PlanCallKnop } from "./PlanCall";

// 23 september 2026 (Marinus): gratis starten is het grote verhaal, de prijzen staan klein en
// helder eronder. Elk maandpakket heeft een custom OS; vanaf drie maanden hoort de complete
// website erbij. Het team per pakket is een rij rondjes die uitklapt.
// 28 september 2026 (Marinus): elk pakket €2.000 duurder. Het OS op maat (vanaf €10.000) is het eerste
// en grootste blok; alle andere pakketten zijn een extra laag bovenop de gratis versie. Sergio bij Meta Ads.
// 28 september 2026 (Marinus, het verhaal): "Probeer het OS gratis" gaat rechtstreeks naar de login van het gratis OS.
// 29 september 2026 (Marinus): "10.000 gewoon niet zo schreeuwerig maar juist zakelijk vanaf maken. En daarna die
// goedkopere pakketten met de prijs per maand voor minimaal 3 maanden incl. zo'n custom os en complete rebranding en
// website met persoonlijke call voor systeem uitleg." Het bedrag van het OS op maat is één rustige regel; elk
// maandpakket loopt minimaal drie maanden en bevat custom OS, complete rebranding, website en een uitlegcall. Het losse
// websiteblok vervalt, want de website zit nu in elk pakket.
// 18 oktober 2026 (Marinus): "Nee niet sterk, we hadden prijzen al mooi met écht de mensen en de hulp etc erbij." De pagina blijft
// zoals hij was; alleen wat botst met zijn keuzes van die dag is aangepast. Geen "daarna €20 per maand" meer (wat er boven 10 GB
// gebeurt, heeft hij nog niet besloten), de SEPA-machtiging bij aanmelding in plaats van "geen verplichting", het OS op maat zit
// in elk pakket (geen los blok vanaf €10.000 meer), en tokens per maand als één sectie in dezelfde kaartstijl als de pakketten.
const PROBEER_URL = GRATIS_OS_URL;

type Lid = { naam: string; rol: string; foto: string };
const TEAM: Record<string, Lid> = {
  marinus: { naam: "Marinus Bergsma", rol: "Founder & CEO", foto: "marinus" },
  jos: { naam: "Jos Hollenberg", rol: "Head of Meta Ads", foto: "jos" },
  sergio: { naam: "Sergio Jovovic", rol: "Meta Ads Specialist", foto: "sergio" },
  nick: { naam: "Nick van Keulen", rol: "Head of Google Ads & Search", foto: "nick" },
  steef: { naam: "Steef Komen", rol: "Partner · Head of Finance & Data", foto: "steef" },
  sid: { naam: "Sid van Kalken", rol: "Head of Web Development & AI Payments · Attesso", foto: "sid" },
  // De mensen achter content en de Studio, dezelfde als bij Content in OsPeople.tsx.
  carmel: { naam: "Carmel Boon", rol: "Head of Video Production", foto: "/images/klein/Carmel-Boon-V2-96.webp" },
  sam: { naam: "Sam van der Sluis", rol: "Lead Videographer", foto: "/images/klein/Sam-van-der-Sluis-96.webp" },
  emma: { naam: "Emma Peperkamp", rol: "Lead Photographer", foto: "/images/klein/Emma-Peperkamp-V2-96.webp" },
};
const fotoVan = (foto: string) => (foto.startsWith("/") ? foto : `/images/prijzen/${foto}.webp`);

type Pakket = {
  naam: string;
  prijs: string;
  per: string;
  belofte: string;
  punten: { tekst: string; erfenis?: boolean; sterk?: boolean }[];
  team: string[];
  nieuw?: string;
  kleur: string;
  actie: string;
  onderwerp: string;
  href?: string;
  top?: boolean;
};

const MAAND: Pakket[] = [
  {
    naam: "Content",
    prijs: "€4.000",
    per: "per maand",
    belofte: "Altijd aanwezig, altijd in je merk.",
    punten: [
      { tekst: "Bovenop je gratis OS met Studio en Milo", sterk: true },
      { tekst: "Content gemaakt in je eigen merk" },
      { tekst: "Voor je gepland en geplaatst" },
    ],
    team: ["marinus"],
    kleur: "var(--prijs-geel)",
    actie: "Kies Content",
    onderwerp: "Pakket Content",
  },
  {
    naam: "Content + Meta",
    prijs: "€5.000",
    per: "per maand",
    belofte: "Bereik de juiste mensen op Instagram en Facebook.",
    punten: [
      { tekst: "Alles uit Content", erfenis: true },
      { tekst: "Meta Ads opgezet en beheerd", sterk: true },
      { tekst: "Leads direct in je CRM" },
    ],
    team: ["marinus", "jos", "sergio"],
    nieuw: "sergio",
    kleur: "var(--prijs-roze)",
    actie: "Kies Meta",
    onderwerp: "Pakket Content + Meta",
  },
  {
    naam: "Meta + Google",
    prijs: "€5.500",
    per: "per maand",
    belofte: "Gevonden worden op het moment dat ze zoeken.",
    punten: [
      { tekst: "Alles uit Content + Meta", erfenis: true },
      { tekst: "Google Ads opgezet en beheerd", sterk: true },
      { tekst: "Eén rapport voor elk kanaal" },
    ],
    team: ["marinus", "jos", "sergio", "nick"],
    nieuw: "nick",
    kleur: "var(--prijs-blauw)",
    actie: "Kies Meta + Google",
    onderwerp: "Pakket Meta + Google",
  },
  {
    naam: "Compleet",
    prijs: "€6.000",
    per: "per maand",
    belofte: "Marketing en financiën, volledig geregeld.",
    punten: [
      { tekst: "Alles uit Meta + Google", erfenis: true },
      { tekst: "Boekhouding en accounting", sterk: true },
      { tekst: "Odoo-inrichting als je die nodig hebt" },
    ],
    team: ["marinus", "jos", "sergio", "nick", "steef"],
    nieuw: "steef",
    kleur: "var(--prijs-groen)",
    actie: "Kies Compleet",
    onderwerp: "Pakket Compleet",
    top: true,
  },
];

// Wat elk maandpakket meekrijgt (minimaal drie maanden). Het losse websitepakket is hierin opgegaan.
const INBEGREPEN = [
  "Custom OS",
  "Complete rebranding",
  "Je website",
  "Persoonlijke call met uitleg van je systeem",
];

// Tokens per maand voor de merkgetrainde Studio (Marinus, 18 oktober 2026). Tokens per pakket uit de OS-code
// (api/_studio-tokens.js: één token is één eurocent rendertegoed); wat je ervoor krijgt uit api/_prijzen.js: een beeld met
// Nano Banana Pro in 2K kost 28 tokens, een video van 8 seconden met Veo 3.1 Fast 160 tokens (naar beneden afgerond).
// Tokens en de SEPA-machtiging staan in het OS nog uit, dus de knop leidt naar de gratis aanmelding.
const TOKENS: Pakket[] = [
  {
    naam: "1.000 tokens",
    prijs: "€10",
    per: "per maand, excl. btw",
    belofte: "Tot 35 beelden met Nano Banana Pro.",
    punten: [
      { tekst: "Of 6 video's van 8 seconden met Veo 3.1 Fast" },
      { tekst: "Rendertegoed in je merkgetrainde Studio", sterk: true },
    ],
    team: ["carmel", "sam", "emma"],
    kleur: "var(--prijs-geel)",
    actie: "Probeer het OS gratis",
    onderwerp: "Tokens 1.000 per maand",
    href: GRATIS_OS_URL,
  },
  {
    naam: "2.500 tokens",
    prijs: "€25",
    per: "per maand, excl. btw",
    belofte: "Tot 89 beelden met Nano Banana Pro.",
    punten: [
      { tekst: "Of 15 video's van 8 seconden met Veo 3.1 Fast" },
      { tekst: "Rendertegoed in je merkgetrainde Studio", sterk: true },
    ],
    team: ["carmel", "sam", "emma"],
    kleur: "var(--prijs-roze)",
    actie: "Probeer het OS gratis",
    onderwerp: "Tokens 2.500 per maand",
    href: GRATIS_OS_URL,
  },
  {
    naam: "5.000 tokens",
    prijs: "€50",
    per: "per maand, excl. btw",
    belofte: "Tot 178 beelden met Nano Banana Pro.",
    punten: [
      { tekst: "Of 31 video's van 8 seconden met Veo 3.1 Fast" },
      { tekst: "Rendertegoed in je merkgetrainde Studio", sterk: true },
    ],
    team: ["carmel", "sam", "emma"],
    kleur: "var(--prijs-blauw)",
    actie: "Probeer het OS gratis",
    onderwerp: "Tokens 5.000 per maand",
    href: GRATIS_OS_URL,
  },
];

// 18 oktober 2026 (Marinus): "Ik wil ook dat de partner gecertificeerde logo's erbij komen dus van Uncanny etc." Alleen logo's
// en relaties die al op de site staan: "Building together with" (HomeHeader.tsx: SocialNow OS × Indexworld, Connect × Uncanny),
// de partners uit TeamTrust.tsx (Komen Consultancy, Attesso, Fincer) en "Gecertificeerd & erkend" uit de footer
// (BrandFooter.tsx: Google Partner, Meta Business Partner, Google Developers). Wit op zwart zoals op de homepage.
const PARTNERS = [
  { naam: "Indexworld", bij: "SocialNow OS", href: "https://indexworld.net", logo: "/images/home-header/indexworld.png", wit: true },
  { naam: "Uncanny", bij: "Connect", href: "https://uncannycs.com", logo: "/images/home-header/uncanny-op-zwart.svg", wit: false },
  { naam: "Komen Consultancy", bij: "Operation Systems", href: "https://www.komenconsultancy.com/", logo: "/images/merken/komen-operation-systems.webp", wit: true },
  { naam: "Fincer", bij: "Wealth management", href: "https://www.linkedin.com/in/steven-goudsblom-bb3ab0197/", logo: "/images/merken/fincer-wit.png", wit: false },
];

const GRATIS = [
  { titel: "Een complete demowebsite", tekst: "Geen schets. Een volledige website in je merk, klaar om live te gaan." },
  { titel: "Een basic rebranding", tekst: "Kleuren, logo en stijl, strak neergezet." },
  { titel: "Je eigen OS", tekst: "Verkoop, merk, social en website op één scherm, met je eigen data." },
];

const IN_OS = [
  { kleur: "var(--prijs-groen)", titel: "Dashboard", tekst: "Inzicht in je werk en de koppelingen die je kiest." },
  { kleur: "var(--prijs-blauw)", titel: "Branding", tekst: "Scant je site: kleuren, logo en beeld als één merkprofiel." },
  { kleur: "var(--prijs-geel)", titel: "Studio", tekst: "Posts en advertenties in je eigen merk. Download als jpg, mp4 of html." },
  { kleur: "var(--prijs-roze)", titel: "Social", tekst: "Koppel je kanalen, plan in de agenda en post." },
  { kleur: "var(--prijs-blauw)", titel: "CRM", tekst: "Leads, opvolging, offertes en facturen op één plek." },
  { kleur: "var(--prijs-groen)", titel: "Website", tekst: "Je website als basis voor je merk, of een gratis demowebsite." },
  { kleur: "var(--prijs-geel)", titel: "Milo", tekst: "Vier AI-agents die je eigen data lezen en de volgende stap voorstellen." },
  { kleur: "var(--prijs-roze)", titel: "Overal", tekst: "Browser en telefoon, zes talen, je data blijft van jou." },
];

function Team({ ids, nieuw }: { ids: string[]; nieuw?: string }) {
  const leden = ids.map((id) => TEAM[id]);
  const namen = leden.map((lid) => lid.naam.split(" ")[0]);
  return (
    <details className="prijs-team">
      <summary>
        <span className="prijs-rondjes" aria-hidden="true">
          {leden.map((lid, i) => (
            <img key={lid.foto} className={ids[i] === nieuw ? "is-nieuw" : undefined} src={fotoVan(lid.foto)} alt="" width="28" height="28" />
          ))}
        </span>
        <span className="prijs-namen" translate="no">{namen.join(" · ")}</span>
        <ChevronDown className="prijs-pijl" size={15} aria-hidden="true" />
      </summary>
      <ul className="prijs-leden">
        {leden.map((lid) => (
          <li key={lid.foto}>
            <img src={fotoVan(lid.foto)} alt="" width="30" height="30" />
            <span>
              <b translate="no">{lid.naam}</b>
              <small>{lid.rol}</small>
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}

function Kaart({ pakket, breed = false }: { pakket: Pakket; breed?: boolean }) {
  return (
    <article className={`prijs-kaart${pakket.top ? " is-top" : ""}${breed ? " is-breed" : ""}`} style={{ "--kleur": pakket.kleur } as React.CSSProperties}>
      {pakket.top && <span className="prijs-vlag">Meest compleet</span>}
      <div className="prijs-kop">
        <h3>{pakket.naam}</h3>
        <p className="prijs-bedrag">
          <strong>{pakket.prijs}</strong>
          <span>{pakket.per}</span>
        </p>
        <p className="prijs-belofte">{pakket.belofte}</p>
      </div>
      <ul className="prijs-punten">
        {pakket.punten.map((punt) => (
          <li key={punt.tekst} className={punt.erfenis ? "is-erfenis" : punt.sterk ? "is-sterk" : undefined}>
            {punt.tekst}
          </li>
        ))}
      </ul>
      <div className="prijs-voet">
        <Team ids={pakket.team} nieuw={pakket.nieuw} />
        {pakket.href ? (
          <Action href={pakket.href} secondary={!pakket.top}>
            {pakket.actie}
          </Action>
        ) : (
          <Action to={`/contact?onderwerp=${encodeURIComponent(pakket.onderwerp)}`} secondary={!pakket.top}>
            {pakket.actie}
          </Action>
        )}
      </div>
    </article>
  );
}

export default function Pricing() {
  useLanguage();
  return (
    <div className="prijs h-wrap">
      <section className="prijs-gratis" aria-labelledby="prijs-gratis-titel">
        <div className="prijs-gratis-boven">
          <div>
            <p className="h-eyebrow prijs-groen-tekst">Hier begin je · Gratis tot 10 GB</p>
            <h1 id="prijs-gratis-titel">
              We beginnen
              <br />
              <em>gratis.</em>
            </h1>
          </div>
          <div className="prijs-gratis-tekst">
            {/* 29 september 2026 (Marinus): "Echt waar" vond hij stom; het blijft bij de feitelijke zin. */}
            <p className="prijs-echt">GRATIS tot 10 GB opslag</p>
            <p className="prijs-lead">Begin gratis met je website, content en AI in Studio. Tot 10 GB opslag is het OS gratis. Voor creatieve samenwerking, advies of een systeem op maat maak je persoonlijk kennis met ons team.</p>
            <ProductRoute />
            <ProductOffer />
            <div className="prijs-knoppen">
              <a className="sn-pill os-claim sn-btn3d h-button" href={PROBEER_URL}>
                <span className="sn-btn3d-sheen" />
                <span>Probeer het OS gratis</span>
                <span className="h-button-icon">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </a>
              <Action to="/gratis-website" secondary>
                Gratis demowebsite aanvragen
              </Action>
            </div>
            <p className="prijs-klein">Geen creditcard. Je koppelt je rekening met een SEPA-machtiging; onder 10 GB schrijven we niets af. Maandelijks opzegbaar.</p>
          </div>
        </div>

        <section className="prijs-opslag" aria-labelledby="prijs-opslag-titel">
          <h2 id="prijs-opslag-titel">Meer dan 10 GB nodig?</h2>
          <p>Het OS is gratis tot 10 GB opslag. Heb je meer nodig, neem dan contact met ons op. Wil je begeleiding en inrichting rond je bedrijf? Kies een pakket met ons team.</p>
          <Action to="/contact?onderwerp=Opslag%20boven%2010%20GB" secondary>Bespreek extra opslag</Action>
        </section>
        <div className="prijs-cadeaus">
          {GRATIS.map((item) => (
            <div className="prijs-cadeau" key={item.titel}>
              <p className="prijs-nul">
                €0 <span>Gratis</span>
              </p>
              <h3>{item.titel}</h3>
              <p>{item.tekst}</p>
            </div>
          ))}
        </div>

        <div className="prijs-inhoud">
          <div className="prijs-inhoud-kop">
            <h2>Dit zit al in je gratis OS</h2>
            <a className="prijs-link" href={PROBEER_URL}>
              <span>Probeer het OS gratis</span>
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
          <ul className="prijs-os">
            {IN_OS.map((item) => (
              <li key={item.titel} style={{ "--kleur": item.kleur } as React.CSSProperties}>
                <i aria-hidden="true" />
                <b>{item.titel}</b>
                <span>{item.tekst}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="tokens" className="prijs-pakketten prijs-tokens" aria-labelledby="prijs-tokens-titel">
        <div className="prijs-pakketten-kop">
          <div>
            <p className="h-eyebrow">Tokens · per maand</p>
            <h2 id="prijs-tokens-titel">Meer maken in je Studio</h2>
          </div>
          <p>
            Tokens zijn je rendertegoed voor beeld, video en premium modellen in je merkgetrainde Studio. Je ziet de prijs per render in de Studio voordat je rendert.
          </p>
        </div>
        <div className="prijs-raster prijs-raster-drie">
          {TOKENS.map((pakket) => (
            <Kaart key={pakket.naam} pakket={pakket} />
          ))}
        </div>
      </section>

      <section className="prijs-pakketten" aria-labelledby="prijs-pakketten-titel">
        <div className="prijs-pakketten-kop">
          <div>
            <p className="h-eyebrow">Maandpakketten · minimaal 3 maanden</p>
            <h2 id="prijs-pakketten-titel">Bovenop je gratis OS</h2>
          </div>
          <p>
            Elk pakket is een extra laag bovenop de gratis versie en loopt minimaal drie maanden. <strong>In elk pakket inbegrepen:</strong>
          </p>
        </div>
        <ul className="prijs-inbegrepen">
          {INBEGREPEN.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {/* 18 oktober 2026: het OS op maat zit in elk pakket; het losse blok vanaf €10.000 is één regel met Plan een call geworden. */}
        <div className="prijs-maatwerk-regel">
          <p>Je custom OS zit in elk pakket: een veilig persoonlijk management- en operationsysteem, gebouwd rond je bedrijf.</p>
          <PlanCallKnop className="sn-pill sn-btn3d h-button h-button-secondary" label="Plan een call" />
        </div>
        <div className="prijs-raster">
          {MAAND.map((pakket) => (
            <Kaart key={pakket.naam} pakket={pakket} />
          ))}
        </div>
        <div className="prijs-partners">
          <div className="prijs-partners-groep">
            <p className="h-eyebrow">Gebouwd met</p>
            <ul>
              {PARTNERS.map((partner) => (
                <li key={partner.naam}>
                  <a href={partner.href} target="_blank" rel="noopener noreferrer" aria-label={partner.naam}>
                    <img className={partner.wit ? "is-wit" : undefined} src={partner.logo} alt={partner.naam} loading="lazy" />
                  </a>
                  <small translate="no">{partner.bij}</small>
                </li>
              ))}
              <li>
                <a href="https://www.attesso.com/" target="_blank" rel="noopener noreferrer" aria-label="Attesso">
                  <code translate="no">~/attesso</code>
                </a>
                <small translate="no">AI Payments</small>
              </li>
            </ul>
          </div>
          <div className="prijs-partners-groep">
            <p className="h-eyebrow">Gecertificeerd &amp; erkend</p>
            <ul className="prijs-erkend">
              <li><img className="is-wit" src="/google-logo.svg" alt="Google Partner" loading="lazy" /></li>
              <li><img className="is-wit" src="/meta-logo.svg" alt="Meta Business Partner" loading="lazy" /></li>
              <li><b>Google Developers</b></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
