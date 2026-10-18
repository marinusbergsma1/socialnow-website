import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Download, ShieldCheck, X } from "lucide-react";
import { useLanguage } from "./i18n/context";
import { ConnectLogo } from "./HomeHeader";
import { DATA_DOCUMENT } from "./PixelInfrastructure";
import "./samen-en-veilig.css";

// Direct onder de homepage-header, in beide varianten van de A/B-test — 18 oktober 2026.
// MARINUS: "er gelijk al een stuk zijn over dat we met 2 bedrijven het product verbeteren en links
// naar veiligheid etc dat ze de documentatie kunnen downloaden die belangrijk is."
// Vervangt "Building together with" (HomeDevelopmentPartners) dat lager op de pagina stond.
// Het handboek Veiligheid en data bestaat alleen in het Nederlands; de andere pdf's in nl en en.
// Daarna, zelfde dag: "Beschrijf hoe code gemaakt door developers en Ai Techniek zorgt voor betere
// bescherming met bronnen erbij ook." Elk cijfer in BRONNEN is nagelezen bij de bron zelf
// (18 oktober 2026). Het GitHub-cijfer komt van GitHub zelf; dat staat er daarom bij.

type Taal = "nl" | "en";
const doc = (naam: string, taal: Taal) => `/documenten/socialnow-${naam}-${taal}.pdf`;

const BRON = {
  dbir: "https://www.verizon.com/business/resources/reports/dbir/",
  nyu: "https://arxiv.org/abs/2108.09293",
  google: "https://security.googleblog.com/2024/11/leveling-up-fuzzing-finding-more.html",
  github: "https://github.blog/news-insights/product-news/secure-code-more-than-three-times-faster-with-copilot-autofix/",
};

// Alleen Nederlandse brontekst: de eigen JSX-runtime vertaalt via proposal/i18n/*.json.
const TEKST = {
  label: "Samen bouwen",
  kop: "We verbeteren het product met twee bedrijven.",
  uitleg: "SocialNow OS ontwikkelen we samen met Indexworld, Connect samen met Uncanny. Wat zij in de praktijk tegenkomen, gaat als eerste de volgende versie in.",
  vLabel: "Veiligheid en documentatie",
  vKop: "Zwart op wit hoe we je data beschermen.",
  alles: "Alles over veiligheid",
  mLabel: "Developers + AI",
  mKop: "Samen beter beschermd dan elk apart.",
  mUitleg: "AI vindt fouten sneller, maar schrijft ze ook. Daarom laten we geen van beide het alleen doen: AI zoekt en stelt voor, een developer controleert en beslist.",
  punten: [
    { kop: "Software is de grootste ingang.", tekst: "31% van de datalekken begint bij een kwetsbaarheid in software. Dat is nu de nummer één ingang, vóór gestolen wachtwoorden.", bron: "Verizon DBIR 2026", href: BRON.dbir },
    { kop: "AI alleen is niet genoeg.", tekst: "In onderzoek van NYU was ongeveer 40% van de code die een AI-assistent schreef kwetsbaar. Daarom hoort er altijd een developer bij die meeleest.", bron: "Pearce e.a., IEEE S&P 2022", href: BRON.nyu },
    { kop: "AI vindt wat mensen missen.", tekst: "Google liet AI testcode schrijven en vond zo 26 nieuwe kwetsbaarheden, waaronder een fout in OpenSSL die vermoedelijk twintig jaar onopgemerkt bleef.", bron: "Google Security Blog, 2024", href: BRON.google },
    { kop: "Gaten sneller dicht.", tekst: "Met AI-voorstellen losten developers beveiligingsmeldingen op in 28 minuten (mediaan), tegen 1,5 uur met de hand. Cijfers van GitHub zelf.", bron: "GitHub, 2024", href: BRON.github },
  ],
};
const documenten = (taal: Taal) => [
  ...(taal === "nl" ? [{ naam: "Veiligheid en data, handboek", href: DATA_DOCUMENT, meta: "PDF · 24 p." }] : []),
  { naam: "Beveiligingsmaatregelen", href: doc("beveiliging", taal), meta: "PDF" },
  { naam: "Verwerkersovereenkomst", href: doc("verwerkersovereenkomst", taal), meta: "PDF" },
  { naam: "Sleutelbelofte", href: doc("sleutelbelofte", taal), meta: "PDF" },
  { naam: "Privacybeleid", href: doc("privacy", taal), meta: "PDF" },
];

export default function SamenEnVeilig() {
  const { language } = useLanguage();
  const t = TEKST;
  const docs = documenten(language === "nl" ? "nl" : "en");
  return (
    <section className="sn-samen" aria-labelledby="sn-samen-kop">
      {/* Eigen kopie van het blauwfilter uit HomeHeader: variant B rendert dat filter niet. */}
      <svg className="sn-samen-filter" aria-hidden="true"><defs><filter id="samen-connect-blue" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="linear" slope=".6" intercept=".02" /><feFuncG type="linear" slope=".55" intercept=".43" /><feFuncB type="linear" slope=".45" intercept=".5" /></feComponentTransfer></filter></defs></svg>
      <div className="sn-samen-wrap">
        <div className="sn-samen-blok">
          <p className="sn-samen-label"><i />{t.label}</p>
          <h2 id="sn-samen-kop">{t.kop}</h2>
          <p className="sn-samen-uitleg">{t.uitleg}</p>
          <div className="sn-samen-paren">
            <div className="sn-samen-paar">
              <img className="sn-samen-os" src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" />
              <X size={18} aria-hidden="true" />
              <a href="https://indexworld.net" target="_blank" rel="noopener noreferrer"><img className="sn-samen-wit" src="/images/home-header/indexworld.png" alt="Indexworld" /></a>
            </div>
            <div className="sn-samen-paar">
              <ConnectLogo />
              <X size={18} aria-hidden="true" />
              <a href="https://uncannycs.com" target="_blank" rel="noopener noreferrer"><img src="/images/home-header/uncanny-op-zwart.svg" alt="Uncanny" /></a>
            </div>
          </div>
        </div>
        <div className="sn-samen-blok sn-samen-docs">
          <p className="sn-samen-label"><ShieldCheck size={14} aria-hidden="true" />{t.vLabel}</p>
          <h3>{t.vKop}</h3>
          <ul>
            {docs.map(d => (
              <li key={d.href}>
                <a href={d.href} download target="_blank" rel="noopener"><Download size={16} aria-hidden="true" /><span>{d.naam}</span><small>{d.meta}</small></a>
              </li>
            ))}
          </ul>
          <Link className="sn-samen-alles" to="/veiligheid">{t.alles}<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="sn-samen-blok sn-samen-mens">
          <p className="sn-samen-label"><i />{t.mLabel}</p>
          <h3>{t.mKop}</h3>
          <p className="sn-samen-uitleg">{t.mUitleg}</p>
          <ol>
            {t.punten.map(p => (
              <li key={p.kop}>
                <strong>{p.kop}</strong>
                <p>{p.tekst}</p>
                <a href={p.href} target="_blank" rel="noopener noreferrer">Bron: {p.bron}<ArrowUpRight size={13} aria-hidden="true" /></a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
