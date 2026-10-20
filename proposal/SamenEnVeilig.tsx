import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, Download, GraduationCap, Rocket, RotateCcw, ShieldCheck, X } from "lucide-react";
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
  // 20 oktober 2026 (Marinus): "Focus dit stuk op: Dat wij bij alle custom pakketten zorgen voor volledige training van Ai en meer
  // positief gericht team trainingen etc [...] Your growth partner in the AGI Era bijvoorbeeld en concreet wel het probleem en oplossing
  // opnoemen over ons geloof in een toekomst waar software gratis hoort te zijn en expertise niet geautomatiseerd kan worden."
  // De veiligheidskop van 18 oktober ("Veiliger dan je verouderde software en processen.") is daarmee weg; de documenten blijven rechts.
  uspLabel: "Groeipartner",
  uspKop: "Jouw groeipartner in het AGI-tijdperk.",
  // 20 oktober 2026, later (Marinus): "Dit mag iets korter en misschien naast elkaar."
  uspUitleg: "Wij geloven dat software gratis hoort te zijn. Expertise kun je niet automatiseren.",
  probleemLabel: "Het probleem",
  // Zelfde dag (Marinus): "Het probleem, je betaald 10tallen euro's voor abbonementen op software en diensten die niet samenwerken."
  probleem: "Je betaalt tientallen euro's aan abonnementen op software en diensten die niet met elkaar samenwerken.",
  oplossingLabel: "Onze oplossing",
  // Zelfde dag (Marinus): "Onze oplossing. Persoonlijke plug and play software met begeleiding en écht ownership. Je koopt de
  // software en betaald op projecttarief voor onze experts." "Meer zo iets."
  oplossing: "Persoonlijke plug and play software met begeleiding en écht ownership. Je koopt de software en betaalt een projecttarief voor onze experts.",
  // Zelfde dag: "Volledige training van hun team. Team trainingen en ai workshops en cursussen met de 2 bevestigde afspraken bij
  // student entrepeneursclub Brussel en Talland College Hoorn met vlaggen van de landen erbij." En: "gewoon een mooie foto dat
  // Marinus in gesprek is met een groep mensen en Steef ook". De foto is een echt beeld uit IMG_0858.MOV (25 sep, stand C21);
  // alleen het Komen-lockup op de achterwand is weggeretoucheerd (feedback-geen-partnerlogos).
  tLabel: "Training en workshops",
  tKop: "We trainen je hele team in AI.",
  // Zelfde dag (Marinus): "Maar trainingen, workshops op maat en op locatie zodat jullie klaar zijn voor groei."
  // 20 oktober 2026, later (Marinus): "Dit mag iets korter en misschien naast elkaar."
  tUitleg: "Bij elk pakket op maat hoort een volledige AI-training: trainingen en workshops op maat en op locatie, zodat jullie klaar zijn voor groei.",
  // De beursfoto (IMG_0858) is eruit: "Dit is de slechtste foto die je kon kiezen [...] niet dat je ziet dat we in gesprek
  // gaan met mensen." Een echte foto van Marinus en Steef in gesprek met een groep komt terug zodra die er is.
  vormen: [
    { kop: "Teamtrainingen", tekst: "Op locatie of online." },
    { kop: "AI-workshops", tekst: "Aan de slag met je eigen data." },
    { kop: "Cursussen", tekst: "Stap voor stap, ook voor nieuwe collega's." },
  ],
  // Zelfde dag (Marinus): "Bevestigde workshops. Of lezingen oid." en daarna "Of volgende lezingen."
  sessiesLabel: "Volgende lezingen",
  sessies: [
    { vlag: "be", naam: "Student Entrepreneurs Club", plaats: "Brussel" },
    { vlag: "nl", naam: "Talland College", plaats: "Hoorn" },
  ],
  // 19 oktober 2026, avond (Marinus): "Moet de producten zijn en team van Connect voor de rest van het doorontwikkel verhaal."
  label: "Samen bouwen",
  // 20 oktober 2026, explainer v8 (81-explainer-v8/werk/02-webtekst.md §2, DEFINITIEF): wie doet wat, hoe een verbetering loopt
  // en wie wat ziet. "Drie bedrijven" klopte niet meer; "zij" zijn de klanten en experts die het in de praktijk gebruiken (01-bronnen §3a).
  kop: "SocialNow en vier partners, elk met een eigen rol.",
  uitleg: "SocialNow OS bouwen we samen met Indexworld, Connect samen met Uncanny. Wat klanten en experts in de praktijk tegenkomen, gaat als eerste de volgende versie in.",
  // Claude, Odoo, Sage, QuickBooks, Shopify, Salesforce en Adobe zijn partners van Indexworld en Uncanny, niet van SocialNow (01-bronnen §3b).
  partnersLabel: "Hun partners",
  rollen: [
    { wie: "SocialNow", rol: "Visie, stijl, UI/UX en AI-workflows. Wij keuren elke versie goed voor die live gaat." },
    { wie: "Indexworld", rol: "Bouwt SocialNow OS en de gedeelde basis voor OS en Connect: accounts, rechten en audit." },
    { wie: "Uncanny", rol: "Bouwt SocialNow Connect als eigen app, op die gedeelde basis." },
    { wie: "Komen Consultancy Operation Systems", rol: "Brengt kennis van finance, data en operations." },
    { wie: "Attesso", rol: "Ingebouwd, staat nog uit: agents geven advertentiegeld alleen uit binnen het budget dat jij goedkeurt. Los van betalingen aan experts via Stripe." },
  ],
  cyclusKop: "Zo wordt elke versie beter.",
  cyclus: ["Idee en ontwerp", "Partners bouwen", "Review en tests door mensen", "Eerst een testomgeving, dan een kleine groep", "Feedback gaat als eerste de volgende versie in"],
  cyclusRegel: "AI helpt bouwen en testen. Mensen beslissen en blijven verantwoordelijk; niemand keurt zijn eigen werk goed.",
  // Status per punt (01-bronnen §3): 1 werkt al; 2 en 3 afgesproken architectuur; 4 en 5 nieuwe scope ("Volgende stap", nooit "binnenkort"); 6 afgesproken en werkt al.
  toegangKop: "Jij bepaalt wie wat ziet.",
  toegang: [
    "Iedereen in je team krijgt een rol, en alleen de rechten die daarbij horen.",
    "Per opdracht kies jij wat een expert van Connect mag zien. Alleen lezen, tot de opdracht klaar is, en altijd in te trekken. Wijzigingen komen als voorstel bij jou.",
    "Chatten met een expert opent nooit je OS.",
    "Volgende stap: gasttoegang. Nodig een expert uit in een deel van je OS, met een eigen login en alleen de rechten die jij geeft.",
    "Volgende stap: Connect ook los, zonder OS.",
    "OS en Connect delen één basis, elk met eigen muren. Zware taken draaien apart, zodat je dagelijkse werk snel blijft. Zo is het ontworpen om kosten en groei beheersbaar te houden.",
  ],
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
    kop: "Het OS en de gedeelde basis, gebouwd door Odoo-specialisten.",
    // 20 oktober 2026 (02-webtekst §2b): geen CPA-leiding en geen overzetten uit QuickBooks of Sage (01-bronnen §3b).
    tekst: "Indexworld is een Odoo-partner met boekhouding en ERP als kern. Zij bouwen SocialNow OS en de gedeelde basis voor accounts, rechten en audit.",
    cijfers: ["150+ klanten", "3 continenten", "Odoo-partner"],
    partners: [
      { naam: "Claude", src: "/images/partners/samen/claude.png" },
      { naam: "Odoo", src: "/images/partners/samen/odoo-partner.webp", sub: "Partner" },
      { naam: "Sage", src: "/images/partners/samen/sage.svg" },
      { naam: "QuickBooks", src: "/images/partners/samen/quickbooks.png" },
    ],
  },
  {
    naam: "Uncanny", href: "https://uncannycs.com", logo: "/images/home-header/uncanny-op-zwart.svg", wit: false, product: "connect",
    kop: "Connect, gebouwd als eigen app.",
    // 20 oktober 2026 (02-webtekst §2b): experts krijgen alleen leestoegang per opdracht (ADR-013), dus geen koppelingen waarmee ze in je systemen werken.
    tekst: "Uncanny is Odoo Silver Partner en Shopify-partner. Zij bouwen Connect: profielen, aanbod, opdrachten, betalen en vertrouwen.",
    cijfers: ["135+ klanten", "250+ projecten", "60+ tech-experts"],
    partners: [
      { naam: "Odoo Silver Partner", src: "/images/partners/samen/odoo.svg" },
      { naam: "Shopify Partners", src: "/images/partners/samen/shopify.svg" },
      { naam: "Salesforce ISV-partner", src: "/images/partners/samen/salesforce.svg" },
      { naam: "Adobe Certified Professional", src: "/images/partners/samen/adobe.svg" },
    ],
  },
  // 20 oktober 2026 (Marinus): "bij samen bouwen Attesso met de gehele economie erbij in de talking to balk zoals eerder ook was
  // ingezet." De balk is die van 5 oktober (commit 2dd3a5f): wit, groene lijn boven en onder, logo's lopen door. De omschrijving
  // volgt attesso.com ("Authorization and signed evidence for agentic commerce", nagelezen 20 oktober 2026); de SaaSHub-plek
  // staat al op /team (TeamTrust.tsx). Attesso heeft geen beeldlogo, alleen het woordmerk ~/attesso.
  {
    naam: "Attesso", href: "https://www.attesso.com/", logo: "", wit: false, product: "os",
    // 20 oktober 2026 (02-webtekst §2b): de controle zit in het OS maar staat nog uit in productie; los van Stripe in Connect.
    kop: "Advertentiegeld binnen jouw budget.",
    tekst: "Jij keurt één keer een budget goed. Attesso controleert elke advertentie-uitgave van een agent daartegen en legt die ondertekend vast. Het zit al in het OS, maar staat nog uit. Betalingen aan experts in Connect lopen apart, via Stripe.",
    // Het cijfer over alle betaalvormen is weg: Attesso gaat hier alleen over advertentie-uitgaven van agents (01-bronnen §2); "#1" mag blijven met de bestaande bron.
    cijfers: ["Meta en Google", "Eén budget per platform", "Ondertekend bewijs", "#1 agentic payment on SaaSHub"],
    partners: [],
    praat: [
      { naam: "Visa", href: "https://www.visa.nl", src: "/images/partners/betalen/visa.svg" },
      { naam: "Mastercard", href: "https://www.mastercard.nl", src: "/images/partners/betalen/mastercard.svg" },
      { naam: "Airwallex", href: "https://www.airwallex.com", src: "/images/partners/betalen/airwallex.webp" },
      { naam: "Adyen", href: "https://www.adyen.com", src: "/images/partners/betalen/adyen.svg" },
      { naam: "Rabobank", href: "https://www.rabobank.nl", src: "/images/partners/betalen/rabobank.svg" },
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

// Vlaggen als eigen svg: emoji-vlaggen tonen op Windows alleen twee letters.
function Vlag({ land }: { land: string }) {
  const banen = land === "be" ? ["#000", "#fdda24", "#ef3340"] : ["#ae1c28", "#fff", "#21468b"];
  return (
    <svg className="sn-samen-vlag" viewBox="0 0 30 20" aria-hidden="true">
      {banen.map((kleur, i) => land === "be"
        ? <rect key={kleur} x={i * 10} y="0" width="10" height="20" fill={kleur} />
        : <rect key={kleur} x="0" y={i * 20 / 3} width="30" height={20 / 3} fill={kleur} />)}
    </svg>
  );
}

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
          <p className="sn-samen-label"><Rocket size={14} aria-hidden="true" />{t.uspLabel}</p>
          <h2 id="sn-samen-usp">{t.uspKop}</h2>
          <p className="sn-samen-uitleg">{t.uspUitleg}</p>
          <div className="sn-samen-po">
            <p><span>{t.probleemLabel}</span>{t.probleem}</p>
            <p><span>{t.oplossingLabel}</span>{t.oplossing}</p>
          </div>
        </div>
        <div className="sn-samen-blok sn-samen-training">
          <p className="sn-samen-label"><GraduationCap size={14} aria-hidden="true" />{t.tLabel}</p>
          <h3 id="sn-samen-training">{t.tKop}</h3>
          <p className="sn-samen-uitleg">{t.tUitleg}</p>
          <ul className="sn-samen-vormen">
            {t.vormen.map(v => <li key={v.kop}><strong>{v.kop}</strong><span>{v.tekst}</span></li>)}
          </ul>
          <div className="sn-samen-sessies">
            <span>{t.sessiesLabel}</span>
            <ul>
              {t.sessies.map(x => (
                <li key={x.naam}><Vlag land={x.vlag} /><span className="sn-samen-sessie"><strong>{x.naam}</strong><small>{x.plaats}</small></span></li>
              ))}
            </ul>
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
        <div className="sn-samen-blok sn-samen-partners">
          <p className="sn-samen-label"><i />{t.label}</p>
          <h3 id="sn-samen-kop">{t.kop}</h3>
          <p className="sn-samen-uitleg">{t.uitleg}</p>
          <ul className="sn-samen-rollen">
            {t.rollen.map(r => <li key={r.wie}><strong translate="no">{r.wie}</strong><span>{r.rol}</span></li>)}
          </ul>
          <div className="sn-samen-paren">
            {SAMEN.map(b => (
              <article className="sn-samen-partner" key={b.naam}>
                <div className="sn-samen-paar">
                  {b.product === "os" ? <img className="sn-samen-os" src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" /> : <ConnectLogo />}
                  <X size={18} aria-hidden="true" />
                  <a href={b.href} target="_blank" rel="noopener noreferrer">{b.logo ? <img className={b.wit ? "sn-samen-wit" : undefined} src={b.logo} alt={b.naam} /> : <code className="sn-samen-woordmerk" translate="no" aria-label={b.naam}>~/attesso</code>}</a>
                </div>
                <div className="sn-samen-waarom">
                  <h4>{b.kop}</h4>
                  <p>{b.tekst}</p>
                  <ul className="sn-samen-cijfers">{b.cijfers.map(c => <li key={c}>{c}</li>)}</ul>
                </div>
                {"praat" in b ? (
                  <div className="sn-samen-praat">
                    <span translate="no">Talking to</span>
                    <div className="sn-samen-strook">
                      <div className="sn-samen-lus">
                        {/* De rij staat er twee keer in en de lus schuift precies één rij op, dus de naad is niet te zien. */}
                        {[false, true].map(kopie => (
                          <ul key={String(kopie)} aria-hidden={kopie || undefined}>
                            {b.praat.map(m => <li key={m.naam}><a href={m.href} target="_blank" rel="noopener" tabIndex={kopie ? -1 : undefined}><img src={m.src} alt={kopie ? "" : m.naam} loading="lazy" /></a></li>)}
                          </ul>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="sn-samen-balk">
                    <span>{t.partnersLabel}</span>
                    <ul>
                      {b.partners.map(p => (
                        <li key={p.naam}><img src={p.src} alt={p.naam} loading="lazy" />{"sub" in p && <small>{p.sub}</small>}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className="sn-samen-twee">
            <div className="sn-samen-cyclus">
              <h4>{t.cyclusKop}</h4>
              {/* Een kring: elke stap wijst naar de volgende, de laatste terug naar het begin (complete pijlen). */}
              <ol>{t.cyclus.map((stap, i) => <li key={stap}><span>{stap}</span>{i < t.cyclus.length - 1 ? <ArrowRight className="sn-samen-pijl" size={16} aria-hidden="true" /> : <RotateCcw className="sn-samen-pijl sn-samen-terug" size={16} aria-hidden="true" />}</li>)}</ol>
              <p>{t.cyclusRegel}</p>
            </div>
            <div className="sn-samen-toegang">
              <h4>{t.toegangKop}</h4>
              <ul>{t.toegang.map(punt => <li key={punt}><Check size={16} aria-hidden="true" /><span>{punt}</span></li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
