import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { APPS, APP_CATEGORIEEN, type AppCategorie } from "./apps";
import { openPlanCall } from "./PlanCall";
import "./app-wand.css";

// 18 oktober 2026 (Marinus, over "Drie manieren om te beginnen"): "Dit overtuigt mij ook niet zo goed. Liever welke apps
// wij allemaal mogelijk maken in ons systeem en dan écht een hele lijst." De lijst komt uit proposal/apps.ts, gemaakt door
// scripts/apps-genereer.mjs uit het integratieonderzoek. Twee labels, en die mogen nooit door elkaar lopen:
//   "In het OS"            echt geïntegreerd, groen;
//   "Via API te koppelen"  de app heeft een open API en we bouwen de koppeling op maat, grijs en zonder vinkje.
// Logo's staan wit op zwart en krijgen bij hover hun eigen merkkleur (het SVG-bestand heeft die kleur, de filter maakt
// het wit). Een app zonder logo is een teksttegel met de naam.
// Eerst 24 tegels (drie rijen op een breed scherm), op de telefoon 15 (vijf rijen, zie app-wand.css).
const EERSTE = 24;

export default function AppWand() {
  const [categorie, zetCategorie] = useState<AppCategorie | "alle">("alle");
  const [alles, zetAlles] = useState(false);
  const telling = useMemo(() => {
    const per = new Map<string, number>();
    for (const app of APPS) per.set(app.categorie, (per.get(app.categorie) || 0) + 1);
    return per;
  }, []);
  const inHetOs = APPS.filter((app) => app.status === "os").length;
  const gekozen = categorie === "alle" ? APPS : APPS.filter((app) => app.categorie === categorie);
  const zichtbaar = categorie === "alle" && !alles ? gekozen.slice(0, EERSTE) : gekozen;
  const kies = (id: AppCategorie | "alle") => { zetCategorie(id); zetAlles(false); };

  return <div className="sn-aw">
    <div className="sn-aw-kop">
      <p className="h-eyebrow"><i />Plug and play</p>
      <h2 id="free-website-titel">Al je apps.<br /><span>Eén OS.</span></h2>
      <p className="sn-aw-intro">Koppel de software en de AI die je al gebruikt. Je ziet alles in één dashboard en je data blijft van jou.</p>
    </div>

    <div className="sn-aw-balk">
      <div className="sn-aw-filters" role="group" aria-label="Filter op categorie">
        <button type="button" aria-pressed={categorie === "alle"} onClick={() => kies("alle")}><span>Alle apps</span><small translate="no">{APPS.length}</small></button>
        {APP_CATEGORIEEN.filter(({ id }) => telling.get(id)).map(({ id, label }) =>
          <button type="button" key={id} aria-pressed={categorie === id} onClick={() => kies(id)}><span>{label}</span><small translate="no">{telling.get(id)}</small></button>)}
      </div>
      <p className="sn-aw-teller" aria-live="polite"><b translate="no">{gekozen.length}</b> <span>apps</span></p>
    </div>

    <ul className={`sn-aw-rooster${zichtbaar.length < gekozen.length ? " is-ingeklapt" : ""}`}>
      {zichtbaar.map((app) => <li key={app.slug} className={`sn-aw-tegel is-${app.status}${app.logo ? "" : " is-tekst"}${app.donker ? " is-donker" : ""}`}>
        <span className="sn-aw-logo">
          {app.logo ? <img src={app.logo} alt="" width="40" height="40" loading="lazy" decoding="async" /> : <b translate="no">{app.naam}</b>}
        </span>
        <span className="sn-aw-naam" translate="no">{app.naam}</span>
        <span className="sn-aw-status">{app.status === "os" ? "In het OS" : "Via API te koppelen"}</span>
      </li>)}
    </ul>
    {zichtbaar.length < gekozen.length && <button type="button" className="sn-aw-meer" onClick={() => zetAlles(true)}>
      <span>Toon alle</span> <b translate="no">{gekozen.length}</b> <span>apps</span>
    </button>}

    <div className="sn-aw-onder">
      <dl className="sn-aw-uitleg">
        <div className="is-os"><dt><i aria-hidden="true" />In het OS</dt><dd>Werkt nu. Je koppelt het zelf in je OS.</dd></div>
        <div className="is-api"><dt><i aria-hidden="true" />Via API te koppelen</dt><dd>De app heeft een open API. Wij bouwen de koppeling op maat.</dd></div>
      </dl>
      <div className="sn-aw-mis">
        <div><h3>Mis je een app?</h3><p>Heeft je software een API, dan maken we hem zichtbaar in je OS.</p></div>
        <button type="button" className="sn-aw-call" aria-haspopup="dialog" onClick={() => openPlanCall({ onderdelen: ["koppelingen"] })}>
          <span>Plan een call</span><span className="arrow"><ArrowUpRight size={17} /></span>
        </button>
      </div>
    </div>
    <p className="sn-aw-bron"><span translate="no">{inHetOs}</span> <span>apps werken nu in het OS. Logo's zijn merken van hun eigenaars.</span></p>
  </div>;
}
