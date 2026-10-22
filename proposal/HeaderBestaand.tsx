import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { klein } from "./licht";
import { people } from "./content";
import { GRATIS_OS_URL } from "./os-entry";
import ExplainerPlayer from "./ExplainerPlayer";
import { openPlanCall } from "./PlanCall";
import { CONNECT, TEAM, fotoVan } from "./Pricing";
import { MiloMotion } from "./motion";
import { ConnectLogo, Downloads, Filters, faces } from "./HomeHeader";
import { useLanguage, type Language } from "./i18n/context";
import "./home-header-approved.css";
import "./home-header-choice.css";
import "./header-bestaand.css";

// Variant B van de homepage-header, voor wie al een bedrijf heeft — 18 oktober 2026.
// MARINUS: "Hoe wij je data niet alleen inzichtelijker maar ook veiliger maken mag je claimen. Verder wil ik dat
// het een aanvulling is op de huidige opzet en start for free niet gelijk dat bedrag noemen en pakketten benoemen
// waarin token pakketten zichtbaar worden. En menselijke hulppakketten. Verder moet je dus een pakket kiezen als je
// je aanmeld [...] en bij het gratis tot 10gb moeten mensen wel alvast hun rekening koppelen."
// Daarom dezelfde opzet als variant A (HomeHeader), met een pakketkeuze in plaats van de Milo's en de Connect-gezichten
// plus hulppakketten. Geen €10.000 meer in de header.
//
// Daarna: "Verder is alles maandelijks." en "liever de bewegende robots weer terug": tokens per maand, de vier Milo's
// als bewegende video (MiloMotion) zoals op de rest van de site.
// Daarna: "Die prijzen mag na het account aanmaken." Dus geen bedragen in de header: alleen de pakketten. De
// tokenpakketten zijn die uit de OS-code (Flyinghighscalingup/socialnow-app, api/_studio-tokens.js, TOKEN_BUNDLES:
// 1.000, 2.500 en 5.000 tokens). De hulppakketten zijn die van /prijzen (Pricing.tsx). Het gekozen pakket gaat als ?pakket= mee naar de aanmelding van het OS; het OS
// moet die keuze en het koppelen van de rekening nog zelf tonen.
// Later dezelfde dag, via de coördinator: "Hier moet een prijs bij en bij custom os moeten ook de prijzen en mensen die
// je in dat pakket helpen erbij." Dus in variant B wel bedragen: tokens €10/€25/€50 per maand (excl. btw, maandelijks
// opzegbaar) en bij Custom OS de vier pakketten van /prijzen met hun bedragen en mensen, uit dezelfde bron (Pricing.tsx).

type Doel = "gratis_os" | "custom_os" | "connect" | "explainer" | "veiligheid";

const MILOS = [{ rol: "website", naam: "Website" }, { rol: "crm", naam: "CRM" }, { rol: "content", naam: "Content" }, { rol: "ads", naam: "Ads" }];

// 18 oktober 2026 (Marinus): "het is van belang dat het duidelijk is dat je voor 3K een veilig persoonlijk
// management and operation systeem hebt. Custom is bij alle pakketten naast gratis website inbegrepen."
// Een hulppakket kies je ook bij het aanmaken van je account; de bedragen komen uit Pricing.tsx (TEAMWERK).


// 18 oktober 2026 (Marinus): "er moet een switch zijn van normale OS naar Call inplannen for custom os [...] waar je
// ook de mensen ziet die om de zoveel tijd switched".
// "Plan een call" opent het boekingspaneel (PlanCall.tsx) met de onderdelen van het gekozen pakket alvast aangevinkt.
// Daarna: "Bij Custom os liever gewoon de pakketten laten zien of uitspraken van het team." Er staan nog geen echte
// uitspraken van het team in content.ts (alleen die van Ruben), dus de pakketten: bij elk zit het Custom OS.
// 19 oktober 2026 (Marinus): de Connect-pakketten uit Pricing.tsx, vanaf €3.000 per maand, bij elk het custom OS.
const CUSTOM = CONNECT.map(pakket => ({ id: pakket.id, naam: pakket.naam, pakket }));
// 18 oktober 2026 (Marinus): "custom os heeft nu iets te veel tekst connect iets te weinig en hier ook iets te veel".
// Dus drie korte punten in plaats van vier lange, en de kleine lettertjes alleen nog over de looptijd.
const VEILIG = [
  "Experts met de toegang die jij bepaalt.",
  "Je eigen AI veilig gekoppeld.",
  "Persoonlijke call met uitleg van je systeem.",
];
// Sinds 18 oktober 2026 staat variant B in elke taal; "Met Jos en Marinus." wordt hier per taal opgebouwd.
const MET: Record<Language, [string, string]> = { nl: ["Met", "en"], en: ["With", "and"], de: ["Mit", "und"], fr: ["Avec", "et"], es: ["Con", "y"], it: ["Con", "e"], pt: ["Com", "e"], pl: ["Z", "i"], sv: ["Med", "och"], da: ["Med", "og"] };
const namen = (ids: string[], taal: Language) => { const [met, en] = MET[taal] || MET.en; const n = ids.map(id => TEAM[id].naam.split(" ")[0]); return `${met} ${n.length > 1 ? `${n.slice(0, -1).join(", ")} ${en} ${n[n.length - 1]}` : n[0]}.`; };
const ONDERDELEN: Record<string, string[]> = {
  start: ["website", "content", "studio"],
  meta: ["website", "content", "studio", "ads"],
  "meta-google": ["website", "content", "studio", "ads"],
  compleet: ["website", "content", "studio", "ads", "crm", "dashboard"],
};

// 18 oktober 2026 (Marinus): "En veiliger. Klinkt een beetje matig [...] Veiligheid, minder kosten meer winst eigen data
// etc etc menselijk contact dat zijn de belangrijke onderdelen 3 best mogelijke zinnen die om de zoveel tijd teruggetypt
// en opnieuw uitgetypt worden [...] maar niet te druk maken." Drie korte zinnen, elk 3 seconden in beeld.
// Daarna: "Minder kosten. Meer winst is een beetje goedkoop" en "focus meer op persoonlijk én écht 100% eigen operation en
// management systeem. Plug and play eigen keuzes etc".
// En: "In die titel al dus verder nog iets simpeler". De titel zegt nu zelf "Echt 100% je eigen systeem."; de getypte regel
// eronder is kort: drie woordgroepen.
// 19 oktober 2026 (Marinus): "Ik wil iets meer de focus op dat wij écht werk doen en software gratis is. Meer inzicht in je
// bedrijf. Mag blijven". Titel terug; de getypte regel zegt nu dat het systeem van jou is, de zin eronder gratis en echt werk.
// 19 oktober 2026, later (Marinus): "Get more out of your business. En daaronder, more insights, better management everything
// custom made plug and play". Titel "Haal meer uit je bedrijf."; de getypte regel noemt die vier.
// 22 oktober 2026 (Marinus): "A trusted growth and cyber security partner." en "Ipv dit en veranderende tekst. Gewoon bam
// dat statement". De titel is alleen dat statement; de getypte regel is weg.

// Een keuzegroep zoals een radiogroep hoort te werken: Tab gaat naar de gekozen optie, de pijltjes wisselen.
function pijltjes(e: React.KeyboardEvent<HTMLElement>, ids: string[], nu: string, kies: (id: string) => void) {
  const stap = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!stap) return;
  e.preventDefault();
  const volgende = ids[(ids.indexOf(nu) + stap + ids.length) % ids.length];
  kies(volgende);
  (e.currentTarget.querySelector(`[data-id="${volgende}"]`) as HTMLElement | null)?.focus();
}

export default function HeaderBestaand({ meet }: { meet: (doel: Doel) => void }) {
  const { language, t } = useLanguage();
  const [modus, setModus] = useState<"os" | "custom">("os");
  // 21 oktober 2026 (Marinus): "kleine switch boven de explainer video in de header wat een beeld geeft hoe ze m kunnen switchen
  // tussen de 2 video's." Eén speler; de schakelaar wisselt film, poster en de regel eronder. Standaard de OS-film.
  const [film, setFilm] = useState<"os" | "connect">("os");
  const [custom, setCustom] = useState(CUSTOM[0].id);
  return (
    <div className="sn-choice sn-bestaand" data-variant="bestaand">
      <Filters />
      <div className="showcase wrap">
        <section className="hero" id="diensten">
          <div className="wrap">
            <div className="intro"><p className="eyebrow">Twee producten. Eén geheel.</p></div>
            <div className="services">
              <article className="service os">
                <div className="logo-row"><img className="os-logo" src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" /><Downloads /></div>
                <div className="bs-switch" role="group" aria-label="Kies OS of Custom OS">
                  <button type="button" aria-pressed={modus === "os"} onClick={() => setModus("os")}>OS</button>
                  {/* 19 oktober 2026 (Marinus): "Dit klopt niet. Wijs gewoon door naar de Dienstenpagina." */}
                  <Link to="/diensten#prijzen" onClick={() => meet("custom_os")}>Custom OS</Link>
                </div>
                {modus === "custom" ? <>
                <h2>Je eigen OS, gebouwd rond je bedrijf.</h2>
                <div className="bs-keuze bs-custom" role="radiogroup" aria-label="Kies je pakket met Custom OS" onKeyDown={e => pijltjes(e, CUSTOM.map(x => x.id), custom, setCustom)}>
                  {CUSTOM.map(c => (
                    <button key={c.id} type="button" role="radio" aria-checked={custom === c.id} tabIndex={custom === c.id ? 0 : -1} data-id={c.id} className="bs-pakket" onClick={() => setCustom(c.id)}>
                      <span className="bs-vink" aria-hidden="true">{custom === c.id && <Check size={12} strokeWidth={3} />}</span>
                      <b translate="no">Custom OS + {c.naam}</b>
                      <strong>{c.pakket.prijs}</strong>
                      <small>{c.pakket.per}</small>
                      <span className="bs-team" aria-hidden="true">{(c.pakket.team ?? []).map(id => <img key={id} src={fotoVan(TEAM[id].foto)} alt="" width="26" height="26" />)}</span>
                    </button>
                  ))}
                </div>
                {/* Marinus: "en echte experts die mee kunnen kijken met de toegang die jij zelf bepaald." en daarna "Meer zo iets.": een korte
                    lijst, alleen wat nu live staat in het OS (teamrollen met direct intrekken, OS-PR #134; eigen AI via MCP/API met
                    sleutels standaard alleen lezen, #135). Budgetakkoord via Attesso is nog niet live en staat er daarom niet bij. */}
                <p className="bs-uitleg bs-met"><strong translate="no">{namen(CUSTOM.find(c => c.id === custom)!.pakket.team ?? [], language)}</strong> <span className="bs-looptijd">Per maand excl. btw, minimaal 3 maanden.</span></p>
                <ul className="bs-punten">
                  {VEILIG.map(punt => <li key={punt}><Check size={15} strokeWidth={3} aria-hidden="true" />{punt}</li>)}
                </ul>
                <div className="action os-account-actions">
                  <button type="button" className="pill" aria-haspopup="dialog" onClick={() => { meet("custom_os"); openPlanCall({ onderdelen: ONDERDELEN[custom] }); }}><span>Plan een call</span><span className="arrow"><ArrowUpRight size={17} /></span></button>
                </div>
                </> : <>
                <h2>AI-powered management &amp; operations.</h2>
                <div className="visual milos bs-milos">{MILOS.map(m => <figure key={m.rol}><MiloMotion role={m.rol} name={`Milo ${m.naam}`} maat={128} /><figcaption>{m.naam}</figcaption></figure>)}</div>
                {/* Marinus, 18 oktober 2026: "PAKKETTEN HOEVEN HIER NIET EN SOORTEN DIENSTEN OOK NIET ZODAT ALLES MOOI IN 1 1920X1080 BLIJFT."
                    Dus geen tokenpakketten meer in de header; die kies je na het aanmaken van je account. */}
                {/* 22 oktober 2026 (Marinus): niet meer de opslag maar het aantal teamleden, gelijk aan "Nodig 2 mensen uit" op de prijskaart. */}
                <p className="bs-uitleg bs-uitleg-kort"><strong>Gratis voor jou en 2 teamleden.</strong></p>
                <div className="action os-account-actions">
                  <a className="pill" href={`${GRATIS_OS_URL}?pakket=gratis`} onClick={() => meet("gratis_os")}><span translate="no">Start for free</span><span className="arrow"><ArrowUpRight size={17} /></span></a>
                  <a className="pill os-login-secondary" href={GRATIS_OS_URL} onClick={() => meet("gratis_os")}><span>Log in</span><span className="arrow"><ArrowUpRight size={17} /></span></a>
                </div>
                </>}
              </article>
              <article className="service connect">
                <div className="logo-row"><ConnectLogo /></div>
                <div className="visual faces">{faces.map(p => <span key={p.name} title={p.name}><img {...klein(p.image, 52, [96, 160], undefined, "20261015-team")} alt={p.name} width="52" height="52" /></span>)}<Link className="more" to="/team" aria-label="Bekijk het hele team"><span className="desktop-count">+{people.length - faces.length}</span><span className="mobile-count">+{people.length - 7}</span></Link></div>
                {/* Zelfde reden als hierboven: geen soorten diensten met tabbladen, één zin en één knop. */}
                {/* 19 oktober 2026 (Marinus): "Meer focus op dat wij écht werk voor je doen, meer leads betere marketing etc. finance." */}
                <p className="bs-kop-hulp"><strong>Meer leads. Betere marketing.</strong> <span>Finance op orde.</span></p>
                <p className="bs-uitleg bs-uitleg-connect">Echte experts doen het werk in je eigen OS, per maand of per opdracht.</p>
                <div className="action">
                  {/* 20 oktober 2026 (Marinus): "Bekijk Connect mag ook naar dat onderdeel doorverwijzen." Dus naar het Connect-blok op deze pagina, niet naar /connect/. */}
                  <a className="pill" href="#connect" onClick={event => { meet("connect"); const doel = document.getElementById("connect"); if (doel) { event.preventDefault(); doel.scrollIntoView({ behavior: "smooth", block: "start" }); history.replaceState(history.state, "", "#connect"); } }}><span>Bekijk Connect</span><span className="arrow"><ArrowUpRight size={17} /></span></a>
                  <Link className="pill" to="/team"><span>Bekijk het hele team</span><span className="arrow"><ArrowUpRight size={17} /></span></Link>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className="video-section" id="os-explainer">
          <div className="wrap">
            <div className="section-head video-intro">
              <div className="video-title">
                {/* 19 oktober 2026 (Marinus): "Graag nooit 3 regels onder elkaar. Maximaal 2." De lettergrootte schaalt met de kolom en
                    met de lengte van de titel in de gekozen taal (--tekens), zodat hij in elke taal op twee regels past. */}
                <h1 style={{ "--tekens": t("Een betrouwbare partner voor groei en cybersecurity.").length } as React.CSSProperties}>Een betrouwbare partner voor groei en cybersecurity.</h1>
                <p className="pay-line">De software is gratis. Onze experts doen het echte werk.</p>
                <ul className="bs-zeker">
                  {/* 18 oktober 2026 (Marinus): "Die punten eronderaan Gratis website en rebranding, veilig. Eigen beheer en keuzes." */}
                  {/* 22 oktober 2026 (Marinus): "Hier graag growth - security - en eigen beheer en keuzes is wel goed." */}
                  <li><ShieldCheck size={15} aria-hidden="true" />Groei</li>
                  <li><ShieldCheck size={15} aria-hidden="true" /><Link to="/veiligheid" onClick={() => meet("veiligheid")}>Veiligheid</Link></li>
                  <li><ShieldCheck size={15} aria-hidden="true" />Eigen beheer en keuzes</li>
                </ul>
              </div>
            </div>
            <div className="bs-filmkeuze" role="group" aria-label="Kies een film">
              <button type="button" className={`bs-film-os${film === "os" ? " is-aan" : ""}`} aria-pressed={film === "os"} onClick={() => setFilm("os")}>
                <LayoutDashboard size={15} aria-hidden="true" /><span translate="no">SocialNow OS</span>
              </button>
              <button type="button" className={`bs-film-connect${film === "connect" ? " is-aan" : ""}`} aria-pressed={film === "connect"} onClick={() => setFilm("connect")}>
                <Users size={15} aria-hidden="true" /><span translate="no">SocialNow Connect</span>
              </button>
            </div>
            <div onClickCapture={() => meet("explainer")}>
              {film === "os"
                ? <ExplainerPlayer key="os" ctaLabel="Ontdek SocialNow" />
                : <ExplainerPlayer key="connect" kind="connect" ctaLabel="Bekijk de Connect-film" />}
            </div>
            {/* 21 oktober 2026: Connect-film v1 (82-connect-film-v1/werk/02-webtekst.md).
                22 oktober 2026: de uitlegzin van de OS-film staat nu in het startbeeld van de speler (ExplainerPlayer.tsx), dus niet nog eens hieronder. */}
            {film === "connect" && <p className="bs-explainer-onder">In één minuut: zelf je expert kiezen, wat een expert van je ziet, de pakketten en onze groeigarantie. Gesproken in het Engels.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
