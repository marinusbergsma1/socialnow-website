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
// 19 oktober 2026, avond (Marinus): het blok Developers + AI "kan wel weg"; de teksten en BRONNEN blijven hier staan voor later.
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
  // 18 oktober 2026 (Marinus): "Echt duidelijk maken dat het VEILIGER is dan hun verouderde software en processen. Dat is een USP."
  uspLabel: "Veiligheid",
  uspKop: "Veiliger dan je verouderde software en processen.",
  uspUitleg: "Software zonder updates is de grootste ingang voor hackers. Wij zetten alles in één OS, met rechten per persoon, versleutelde sleutels en echte experts die meekijken.",
  // 19 oktober 2026, avond (Marinus): "Moet de producten zijn en team van Connect voor de rest van het doorontwikkel verhaal."
  label: "Samen bouwen",
  kop: "We verbeteren de producten met twee bedrijven.",
  uitleg: "SocialNow OS ontwikkelen we samen met Indexworld, Connect samen met Uncanny. De rest van de doorontwikkeling doen we met het team van Connect: wat zij in de praktijk tegenkomen, gaat als eerste de volgende versie in.",
  partnersLabel: "Partners",
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
// 19 oktober 2026 (Marinus): "Graag bij Uncanny en Indexworld nog deze balkjes en partners duidelijk maken waarom het een
// waardevolle toevoeging is om hun erbij te betrekken." De balkjes zijn hun eigen partnerrijen (indexworld.net "Our trusted
// partners", uncannycs.com "Partnered with"; hun Odoo-, Shopify-, Salesforce- en Adobe-logo hebben het partnerniveau
// al in het beeld, dus geen onderschrift). Marinus, zelfde avond: "Graag logo's gewoon in kleur." Dus de merkkleuren, met
// alleen zwarte letters omgezet naar wit (Claude, QuickBooks) en de donkere-grondversies van Uncanny; de cijfers staan zo op hun eigen homepage (nagelezen 19 oktober 2026).
const SAMEN = [
  {
    naam: "Indexworld", href: "https://indexworld.net", logo: "/images/home-header/indexworld.png", wit: true, product: "os",
    kop: "Boekhouding en ERP, nagekeken door accountants.",
    tekst: "Indexworld is een Odoo-partner onder leiding van registeraccountants (CPA) in de VS. Zij zorgen dat je cijfers in het OS kloppen en halen je boekhouding veilig over uit QuickBooks of Sage.",
    cijfers: ["150+ klanten", "3 continenten", "Geleid door CPA's"],
    partners: [
      { naam: "Claude", src: "/images/partners/samen/claude.png" },
      { naam: "Odoo", src: "/images/partners/samen/odoo-partner.webp", sub: "Partner" },
      { naam: "Sage", src: "/images/partners/samen/sage.svg" },
      { naam: "QuickBooks", src: "/images/partners/samen/quickbooks.png" },
    ],
  },
  {
    naam: "Uncanny", href: "https://uncannycs.com", logo: "/images/home-header/uncanny-op-zwart.svg", wit: false, product: "connect",
    kop: "Webshop, CRM en ERP echt aan elkaar gekoppeld.",
    tekst: "Uncanny is Odoo Silver Partner en Shopify-partner, met Salesforce- en Adobe-specialisten in huis. Zij bouwen de koppelingen achter Connect, zodat experts direct in jouw systemen werken.",
    cijfers: ["135+ klanten", "250+ projecten", "60+ tech-experts"],
    partners: [
      { naam: "Odoo Silver Partner", src: "/images/partners/samen/odoo.svg" },
      { naam: "Shopify Partners", src: "/images/partners/samen/shopify.svg" },
      { naam: "Salesforce ISV-partner", src: "/images/partners/samen/salesforce.svg" },
      { naam: "Adobe Certified Professional", src: "/images/partners/samen/adobe.svg" },
    ],
  },
] as const;

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
    <section className="sn-samen" aria-labelledby="sn-samen-usp">
      {/* Eigen kopie van het blauwfilter uit HomeHeader: variant B rendert dat filter niet. */}
      <svg className="sn-samen-filter" aria-hidden="true"><defs><filter id="samen-connect-blue" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="linear" slope=".6" intercept=".02" /><feFuncG type="linear" slope=".55" intercept=".43" /><feFuncB type="linear" slope=".45" intercept=".5" /></feComponentTransfer></filter></defs></svg>
      <div className="sn-samen-wrap">
        <div className="sn-samen-usp">
          <p className="sn-samen-label"><ShieldCheck size={14} aria-hidden="true" />{t.uspLabel}</p>
          <h2 id="sn-samen-usp">{t.uspKop}</h2>
          <p className="sn-samen-uitleg">{t.uspUitleg}</p>
        </div>
        <div className="sn-samen-blok">
          <p className="sn-samen-label"><i />{t.label}</p>
          <h3 id="sn-samen-kop">{t.kop}</h3>
          <p className="sn-samen-uitleg">{t.uitleg}</p>
          <div className="sn-samen-paren">
            {SAMEN.map(b => (
              <article className="sn-samen-partner" key={b.naam}>
                <div className="sn-samen-paar">
                  {b.product === "os" ? <img className="sn-samen-os" src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" /> : <ConnectLogo />}
                  <X size={18} aria-hidden="true" />
                  <a href={b.href} target="_blank" rel="noopener noreferrer"><img className={b.wit ? "sn-samen-wit" : undefined} src={b.logo} alt={b.naam} /></a>
                </div>
                <div className="sn-samen-waarom">
                  <h4>{b.kop}</h4>
                  <p>{b.tekst}</p>
                  <ul className="sn-samen-cijfers">{b.cijfers.map(c => <li key={c}>{c}</li>)}</ul>
                </div>
                <div className="sn-samen-balk">
                  <span>{t.partnersLabel}</span>
                  <ul>
                    {b.partners.map(p => (
                      <li key={p.naam}><img src={p.src} alt={p.naam} loading="lazy" />{"sub" in p && <small>{p.sub}</small>}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
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
      </div>
    </section>
  );
}
