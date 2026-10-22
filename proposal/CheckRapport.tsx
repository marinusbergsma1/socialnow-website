import React, { useEffect, useState } from "react";
import { useLanguage } from "./i18n/context";
import "./check-rapport.css";

// Websiterapport onder de php2shell-uitslag op /check (22 oktober 2026, Marinus): vijf punten met echte data, elk uit een
// meting met bewijs. De server (api/check-rapport.js, server/check-rapport.mjs) meet; deze component toont.
// Twee aanroepen: "rest" (verbinding, software, headers, e-mail, binnen ~15 s) en "snelheid" (Google PageSpeed, tot ~50 s,
// met zichtbare voortgang). Elk punt geeft altijd een uitslag: kon iets niet gemeten worden, dan "Niet te meten" met de
// reden in gewone taal, nooit rood en nooit een foutmelding.

const ENDPOINT = "/api/check-rapport";
type Status = "goed" | "aandacht" | "slecht" | "onbekend";
type Bewijs = { k: string; v: string; ok?: boolean | null; s?: string | null; url?: string };
type Punt = { status: Status; reden?: string; problemen: string[]; waarde?: any; bewijs: Bewijs[]; onderdelen?: any[] };
type Sleutel = "snelheid" | "verbinding" | "software" | "headers" | "email";
const VOLGORDE: Sleutel[] = ["snelheid", "verbinding", "software", "headers", "email"];

const invul = (tekst: string, w: Record<string, string | number | null | undefined>) => tekst.replace(/\{(\w+)\}/g, (_, k) => String(w[k] ?? ""));

const TITEL: Record<Sleutel, string> = {
  snelheid: "Snelheid op mobiel",
  verbinding: "Beveiligde verbinding",
  software: "Verouderde software",
  headers: "Beveiligingsheaders",
  email: "E-mailbeveiliging",
};
const LABEL: Record<Status, string> = { goed: "Goed", aandacht: "Aandacht", slecht: "Slecht", onbekend: "Niet te meten" };
// 22 oktober 2026, middag (Marinus): eerlijke snelheid. Zonder Google PageSpeed (PAGESPEED_API_KEY ontbreekt of Google
// antwoordt niet) is er alleen onze eigen meting van de serverreactie. Dat zegt niets over de snelheid op mobiel, dus nooit
// "Goed, je site laadt snel": dan heet het punt "Serverreactie", met het gemeten getal en een neutrale status.
const EIGEN_ZIN = "Google PageSpeed was niet beschikbaar, dus de snelheid op mobiel kon niet volledig gemeten worden. Je server antwoordde in {ttfb} ms.";

// Waarom iets niet gemeten kon worden, in gewone taal.
const REDEN: Record<string, string> = {
  dns: "Dit domein is niet te vinden in DNS.",
  "dns-deels": "Niet alle DNS-records gaven antwoord.",
  timeout: "Je site antwoordde niet op tijd.",
  verbinding: "We kregen geen verbinding met je site.",
  geweigerd: "Je server weigerde de verbinding.",
  tls: "De beveiligde verbinding kwam niet tot stand.",
  intern: "Dit adres wijst naar een intern netwerk; dat meten we niet.",
  poort: "Je site stuurt door naar een poort die we niet bezoeken.",
  redirect: "Je site stuurt door naar een adres dat we niet volgen.",
  lus: "Je site stuurt bezoekers in een rondje door.",
  "te-veel-redirects": "Je site stuurt meer dan vijf keer door.",
  afgeschermd: "Je site schermt dit af voor automatische bezoekers.",
  foutpagina: "Je homepage gaf een foutpagina.",
  "geen-html": "Je homepage gaf geen gewone webpagina terug.",
  bron: "De openbare bron met versies antwoordde niet.",
  "geen-software": "Je site noemt geen versies van zijn software, dus we kunnen niet zien of die bij is.",
  limiet: "Dit domein is net al vaak gescand. Probeer het over tien minuten opnieuw.",
  fout: "Er ging aan onze kant iets mis.",
  "geen-http": "Je server gaf geen geldig webantwoord.",
};

// Eén zin over wat het voor de ondernemer betekent, per eerste probleem.
const BETEKENIS: Record<string, string> = {
  "lcpMs-slecht": "Je belangrijkste inhoud verschijnt pas na {lcp} seconden. Veel mobiele bezoekers haken dan al af.",
  "lcpMs-matig": "Je belangrijkste inhoud verschijnt na {lcp} seconden. Onder de 2,5 seconden houd je meer bezoekers vast.",
  "tbtMs-slecht": "Je pagina reageert traag op tikken, door zware scripts.",
  "tbtMs-matig": "Je pagina reageert soms traag op tikken.",
  "inpMs-slecht": "Echte bezoekers wachten lang op een reactie als ze tikken.",
  "inpMs-matig": "Echte bezoekers wachten soms op een reactie als ze tikken.",
  "cls-slecht": "Je pagina verspringt tijdens het laden. Bezoekers tikken dan mis.",
  "cls-matig": "Je pagina verspringt een beetje tijdens het laden.",
  "ttfbMs-slecht": "Je server doet er {ttfb} ms over voordat hij iets terugstuurt. Dat vertraagt elke pagina.",
  "ttfbMs-matig": "Je server doet er {ttfb} ms over voordat hij iets terugstuurt.",
  "bytes-slecht": "Je pagina is {mb} MB. Op mobiel kost dat tijd en data.",
  "bytes-matig": "Je pagina is {mb} MB; lichter laadt sneller op mobiel.",
  "geen-compressie": "Je server stuurt de pagina ongecomprimeerd.",
  "geen-https": "Je site werkt niet via https. Wat bezoekers invullen, gaat onversleuteld over het internet.",
  "cert-verlopen": "Je certificaat is verlopen. Browsers tonen bezoekers een waarschuwing.",
  "cert-ongeldig": "Je certificaat klopt niet. Browsers tonen bezoekers een waarschuwing.",
  "tls-oud": "Je server gebruikt een verouderde versleuteling ({tls}).",
  "cert-bijna": "Je certificaat verloopt over {dagen} dagen. Daarna zien bezoekers een waarschuwing.",
  "geen-doorsturen": "Wie http intypt, blijft op de onbeveiligde versie van je site.",
  "geen-hsts": "Browsers onthouden niet dat je site alleen via https mag. Dat laat een kleine opening.",
  "hsts-kort": "Browsers onthouden maar kort dat je site alleen via https mag.",
  "cms-onveilig": "WordPress.org noemt jouw versie onveilig. Bekende lekken zijn openbaar.",
  "cms-eol": "Je CMS krijgt geen beveiligingsupdates meer.",
  "bibliotheek-lek": "Op je site draait code met bekende, openbare lekken.",
  "cms-verouderd": "Er is een nieuwere WordPress-versie.",
  "plugin-verouderd": "Er zijn nieuwere versies van plugins die je gebruikt.",
  "mist-csp": "Je site mist een beveiligingsbeleid tegen ingevoegde scripts.",
  "mist-frame": "Andere sites kunnen jouw site onzichtbaar in hun pagina laden.",
  "mist-nosniff": "Browsers mogen raden wat voor bestand je server stuurt.",
  "mist-referrer": "Je site geeft volledige adressen door aan andere sites.",
  "mist-permissions": "Je site legt niet vast welke functies (camera, locatie) mogen.",
  "versie-lek": "Je server noemt zijn softwareversie. Dat helpt aanvallers.",
  "php-eol": "Je server draait PHP {php}. Die versie krijgt geen beveiligingsupdates meer.",
  "geen-spf": "Er staat geen SPF-record. Iedereen kan mail sturen die van jouw domein lijkt te komen.",
  "spf-open": "Je SPF-record laat elke server toe. Iedereen kan namens jou mailen.",
  "geen-dmarc": "Er staat geen DMARC-record. Nepmail op jouw naam wordt nergens tegengehouden.",
  "dmarc-ongeldig": "Je DMARC-record is ongeldig, dus niet actief.",
  "dmarc-none": "DMARC staat op 'none': nepmail op jouw naam komt nog gewoon aan.",
  "dmarc-pct": "DMARC geldt maar voor een deel van je mail.",
  "spf-dubbel": "Je hebt twee SPF-records. Dan werkt SPF niet.",
  "dmarc-dubbel": "Je hebt twee DMARC-records. Dan werkt DMARC niet.",
  "spf-geen-all": "Je SPF-record sluit niet af met een regel voor andere servers.",
};
const GOED: Record<Sleutel, string> = {
  snelheid: "Je site laadt snel op mobiel.",
  verbinding: "Je verbinding is versleuteld, het certificaat klopt en http stuurt door naar https.",
  software: "We zien geen verouderde software op je site.",
  headers: "Je site stuurt de belangrijkste beveiligingsheaders mee.",
  email: "SPF en DMARC houden nepmail op jouw naam tegen.",
};

// Wat je zelf kunt doen, per probleem.
const ADVIES: Record<string, string> = {
  "geen-https": "Zet in je hostingpaneel een gratis Let's Encrypt-certificaat aan.",
  "cert-verlopen": "Vernieuw je certificaat in je hostingpaneel, of zet automatisch vernieuwen aan.",
  "cert-ongeldig": "Laat je host een certificaat plaatsen dat precies op je domeinnaam staat.",
  "tls-oud": "Vraag je host om TLS 1.0 en 1.1 uit te zetten en TLS 1.2 en 1.3 aan.",
  "cert-bijna": "Controleer of automatisch vernieuwen aanstaat.",
  "geen-doorsturen": "Zet in je hostingpaneel 'Forceer https' aan.",
  "geen-hsts": "Voeg de header Strict-Transport-Security: max-age=31536000 toe.",
  "hsts-kort": "Verhoog max-age in Strict-Transport-Security naar minstens 31536000.",
  "php-eol": "Kies in je hostingpaneel PHP 8.3 of nieuwer en test je site daarna.",
  "cms-onveilig": "Werk WordPress bij via Dashboard > Updates en maak eerst een back-up.",
  "cms-eol": "Plan een overstap naar een ondersteunde versie.",
  "bibliotheek-lek": "Werk je thema en plugins bij; die leveren deze bibliotheken mee.",
  "cms-verouderd": "Werk WordPress bij via Dashboard > Updates.",
  "plugin-verouderd": "Werk je plugins bij via Dashboard > Plugins.",
  "mist-csp": "Voeg een Content-Security-Policy toe, begin met de modus Report-Only.",
  "mist-frame": "Voeg X-Frame-Options: SAMEORIGIN toe.",
  "mist-nosniff": "Voeg X-Content-Type-Options: nosniff toe.",
  "mist-referrer": "Voeg Referrer-Policy: strict-origin-when-cross-origin toe.",
  "mist-permissions": "Voeg een Permissions-Policy toe, bijvoorbeeld camera=(), microphone=(), geolocation=().",
  "versie-lek": "Zet de versie uit in de Server- en X-Powered-By-header (ServerTokens Prod, expose_php=Off).",
  "geen-spf": "Zet bij je domeinbeheer een SPF-record, bijvoorbeeld v=spf1 include:<je mailprovider> -all.",
  "spf-open": "Vervang +all of ?all in je SPF-record door -all of ~all.",
  "geen-dmarc": "Zet een TXT-record op _dmarc: v=DMARC1; p=quarantine; rua=mailto:<je adres>.",
  "dmarc-ongeldig": "Zet in je DMARC-record p=quarantine of p=reject.",
  "dmarc-none": "Zet DMARC na een paar weken meten van p=none naar p=quarantine.",
  "lcpMs-slecht": "Maak je grootste afbeelding kleiner (WebP of AVIF) en laad hem niet lui.",
  "ttfbMs-slecht": "Zet paginacaching aan of vraag je host om snellere hosting.",
  "tbtMs-slecht": "Verwijder plugins en scripts die je niet gebruikt.",
  "cls-slecht": "Geef afbeeldingen en advertenties een vaste breedte en hoogte.",
  "bytes-slecht": "Comprimeer afbeeldingen en video's.",
};

const BEWIJS_LABEL: Record<string, string> = {
  score: "Score", lcp: "Grootste inhoud (LCP)", inp: "Reactie op tikken (INP)", tbt: "Blokkeertijd (TBT)", cls: "Verspringen (CLS)",
  ttfb: "Eerste byte (TTFB)", gewicht: "Paginagewicht", html: "HTML", bron: "Bron", pagespeed: "PageSpeed",
  https: "https", tls: "TLS-versie", certificaat: "Certificaat", verloopt: "Verloopt op", certificaatfout: "Certificaatfout", hsts: "HSTS", http: "http",
  csp: "CSP", frame: "Framen", nosniff: "nosniff", referrer: "Referrer", permissions: "Permissions", lek: "Versielek", pagina: "Pagina",
  cms: "CMS", bibliotheek: "Bibliotheek", plugin: "Plugin", paginas: "Gelezen pagina's", feed: "Feed", robots: "robots.txt", bronfout: "Bron niet bereikbaar",
  spf: "SPF", dmarc: "DMARC", mx: "MX",
};

function kopwaarde(k: Sleutel, p: Punt, t: (s: string) => string): string {
  const w = p.waarde || {};
  if (p.status === "onbekend") return "–";
  if (k === "snelheid") return w.bron === "pagespeed" ? `${w.score} / 100` : `${w.ttfbMs} ms`;
  if (k === "verbinding") return w.https ? (w.tls || "https") : t("Geen https");
  if (k === "software") {
    if (w.php) return `PHP ${w.php}`;
    if (w.cms) return `${w.cms.naam}${w.cms.versie ? ` ${w.cms.versie}` : ""}`;
    return w.verouderd ? invul(t("{n} verouderd"), { n: w.verouderd }) : t("Niets verouderds");
  }
  if (k === "headers") return invul(t("{n} van 5"), { n: w.aanwezig });
  if (k === "email") return `DMARC ${w.dmarc === "geen" ? t("ontbreekt") : w.dmarc || "?"}`;
  return "";
}

function zin(k: Sleutel, p: Punt, t: (s: string) => string): string {
  if (p.status === "onbekend") return t(REDEN[p.reden || ""] || "Dit konden we van buitenaf niet meten.");
  const w = p.waarde || {};
  const eerste = p.problemen.find((c) => BETEKENIS[c]);
  const vulling = { php: w.php, lcp: w.lcpMs != null ? (w.lcpMs / 1000).toFixed(1) : "", ttfb: w.ttfbMs, mb: w.bytes != null ? (w.bytes / 1e6).toFixed(1) : "", tls: w.tls, dagen: w.dagen };
  if (k === "snelheid" && w.bron === "eigen") return invul(t(EIGEN_ZIN), vulling);
  return eerste ? invul(t(BETEKENIS[eerste]), vulling) : t(GOED[k]);
}

export function CheckRapport({ domein, ronde }: { domein: string; ronde: number }) {
  const { t } = useLanguage();
  const [punten, zetPunten] = useState<Partial<Record<Sleutel, Punt>>>({});
  const [seconden, zetSeconden] = useState(0);

  useEffect(() => {
    if (!domein || !ronde) return;
    let weg = false;
    zetPunten({});
    zetSeconden(0);
    const vraag = (deel: "rest" | "snelheid", sleutels: Sleutel[]) =>
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domein, deel }) })
        .then((r) => r.json())
        .catch(() => null)
        .then((j) => {
          if (weg) return;
          const nieuw: Partial<Record<Sleutel, Punt>> = {};
          for (const s of sleutels) nieuw[s] = j?.punten?.[s] || { status: "onbekend", reden: "fout", problemen: [], bewijs: [] };
          zetPunten((oud) => ({ ...oud, ...nieuw }));
        });
    vraag("rest", ["verbinding", "software", "headers", "email"]);
    vraag("snelheid", ["snelheid"]);
    const klok = window.setInterval(() => zetSeconden((s) => s + 1), 1000);
    return () => { weg = true; window.clearInterval(klok); };
  }, [domein, ronde]);

  const snelheidBezig = !punten.snelheid;
  // Wat telt als goed of slecht: de eigen meting van de serverreactie niet (zie EIGEN_ZIN).
  const telt = (k: Sleutel) => { const p = punten[k]; return p && !(k === "snelheid" && p.waarde?.bron === "eigen") ? p.status : undefined; };
  const slecht = VOLGORDE.filter((k) => telt(k) === "slecht");
  // Verbeteringen per punt (Marinus: geen dubbele labels onder elkaar): eerst slecht, dan aandacht, elk punt één keer
  // met zijn eigen adviezen eronder.
  const adviezen = [...slecht, ...VOLGORDE.filter((k) => telt(k) === "aandacht")]
    .map((k) => ({ k, regels: [...new Set((punten[k]?.problemen || []).filter((c) => ADVIES[c]).map((c) => ADVIES[c]))].slice(0, 3) }))
    .filter((g) => g.regels.length);

  return (
    <div className="cr" aria-live="polite">
      <h3 className="cr-kop">Vijf punten van je website.</h3>
      <ol className="cr-rijen">
        {VOLGORDE.map((k) => {
          const p = punten[k];
          if (!p) {
            const voortgang = Math.min(95, Math.round((seconden / 30) * 100));
            return (
              <li key={k} className="cr-rij cr-bezig">
                <div className="cr-hoofd">
                  <span className="cr-status">{t("Bezig")}</span>
                  <span className="cr-titel">{t(TITEL[k])}</span>
                  <span className="cr-waarde">{k === "snelheid" ? `${seconden} s` : "…"}</span>
                </div>
                {k === "snelheid" && (
                  <>
                    <div className="cr-balk" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={voortgang}><i style={{ width: `${voortgang}%` }} /></div>
                    <p className="cr-zin">{t("Google laadt je site op een mobiel. Dit duurt meestal 15 tot 40 seconden.")}</p>
                  </>
                )}
              </li>
            );
          }
          const eigen = k === "snelheid" && p.waarde?.bron === "eigen" && p.status !== "onbekend";
          return (
            <li key={k} className={`cr-rij cr-${eigen ? "neutraal" : p.status}`}>
              <details>
                <summary className="cr-hoofd">
                  <span className="cr-status">{t(eigen ? "Gemeten" : LABEL[p.status])}</span>
                  <span className="cr-titel">{t(eigen ? "Serverreactie" : TITEL[k])}</span>
                  <span className="cr-waarde" translate="no">{kopwaarde(k, p, t)}</span>
                </summary>
                <div className="cr-bewijs">
                  <p className="cr-bewijs-kop">{t("Wat we zagen")}</p>
                  {p.bewijs.length ? (
                    <dl>
                      {p.bewijs.map((b, i) => (
                        <div key={i} className={b.ok === false || b.s === "slecht" ? "cr-mis" : ""}>
                          <dt>{t(BEWIJS_LABEL[b.k] || b.k)}</dt>
                          <dd translate="no">{b.v}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : <p>{t("Geen gegevens: deze meting kon niet worden gedaan.")}</p>}
                </div>
              </details>
              <p className="cr-zin">{zin(k, p, t)}</p>
            </li>
          );
        })}
      </ol>
      {snelheidBezig && <p className="cr-noot">{t("De andere punten staan al klaar. De snelheid volgt zodra Google klaar is.")}</p>}
      {adviezen.length > 0 && (
        <div className="cr-advies">
          <h3>{slecht.length ? t("Dit kun je zelf doen.") : t("Kleine verbeteringen.")}</h3>
          {adviezen.map(({ k, regels }) => (
            <div className="cr-groep" key={k}>
              <h4>{t(TITEL[k])}</h4>
              <ul>{regels.map((r) => <li key={r}>{t(r)}</li>)}</ul>
            </div>
          ))}
        </div>
      )}
      <p className="cr-noot">{t("Alleen openbare informatie: je homepage, hooguit vijf gelinkte pagina's, DNS en Google PageSpeed. Bekende lekken komen uit OSV.dev en WordPress.org.")}</p>
    </div>
  );
}
