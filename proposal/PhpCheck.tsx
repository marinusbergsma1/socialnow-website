import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, CalendarDays, Check, Copy, FileDown, Mail, MessageCircle, Send, ShieldCheck, Wrench } from "lucide-react";
import { useLanguage } from "./i18n/context";
import { boekExtern, boekLink, conceptLink } from "./aanvragen";
import { people } from "./content";
import { klein } from "./licht";
import "./php-check.css";
import { CheckRapport } from "./CheckRapport";

// Gratis php2shell-check op /check (22 oktober 2026, Marinus): "Take the free check at socialnow.nl". De advertentie
// stuurt alle bezoekers hierheen; /php-check verwijst door (vercel.json).
// De check zelf draait in api/php-check.js (server/php-check.mjs): één gewone GET op de homepage, passief, niets bewaard.
// Groen betekent alleen dat de getoonde versie de fix bevat, nooit "veilig". Rood alleen met bewijs in de build.
// Marinus, later die dag: een check lukt altijd. Geen vinkje, geen foutmelding: kan de check niets lezen, of faalt onze
// eigen functie, dan is de uitslag "Je site schermt dit af" met een belknop en een kort formulier. Aanvragen gaan via
// api/check-aanvraag.js als mail naar secure@socialnow.nl.

const ENDPOINT = "/api/php-check";
const AANVRAAG = "/api/check-aanvraag";

type Uitslag = {
  ok: boolean;
  domein?: string;
  uitslag?: "rood" | "oranje" | "groen" | "onbekend";
  reden?: string;
  code?: string;
  phpVersie?: string | null;
  hersteldVanaf?: string | null;
  release?: string | null;
  platform?: string | null;
  doorverwezenNaar?: string | null;
};

function invul(tekst: string, waarden: Record<string, string | number | undefined | null>) {
  return tekst.replace(/\{(\w+)\}/g, (_, k) => String(waarden[k] ?? ""));
}

// Elke invoer moet werken: "LINK.NL ", "https://link.nl/pagina", "www.link.nl", "link.nl/". De server doet hetzelfde
// en probeert daarna zelf https, http, met en zonder www. Alleen echte onzin krijgt een hint onder het veld.
export function normaliseerInvoer(invoer: string) {
  // Eerst pad, query en hash eraf, dan pas inloggegevens (tot de laatste @): "link.nl?e=a@b.nl" blijft link.nl.
  let s = invoer.replace(/[\u200B-\u200D\u2060\uFEFF]/g, "").trim().toLowerCase().replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  s = s.split(/[/?#\s]/)[0];
  s = s.slice(s.lastIndexOf("@") + 1).replace(/:\d+$/, "").replace(/\.$/, "");
  if (!s || /^\d+(\.\d+){3}$/.test(s)) return "";
  // Internationale namen (café.nl) worden punycode, zoals de server ze ook opzoekt.
  let host = "";
  try { host = new URL(`https://${s}`).hostname; } catch { return ""; }
  return /^([a-z0-9_](?:[a-z0-9_-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/.test(host) ? host : "";
}

// De eerste drie stappen staan ook in de rode en oranje uitslag; de hele lijst staat onder de uitslag.
const STAPPEN = [
  "Vraag je hostingpartij of PHP is bijgewerkt naar 8.5.12, 8.4.27, 8.3.36, 8.2.35 of nieuwer, of naar hun pakket met de teruggezette fix. Vraag om een schriftelijke bevestiging.",
  "Beheer je de server zelf? Werk PHP bij via je pakketbeheer (apt of dnf) en herstart daarna PHP-FPM of Apache. Anders draait de oude versie gewoon door.",
  "Draai je PHP 8.1 of ouder? Daar komt mogelijk geen fix voor. Kies in je hostingpaneel (hPanel, cPanel of Plesk) een nieuwere PHP-versie en test daarna je site.",
  "Kun je niet meteen bijwerken? Zet je site tijdelijk offline of in onderhoudsmodus. Dat adviseren ook de NSA en het Britse NCSC.",
  "Controleer ook je andere sites en subdomeinen op dezelfde hosting. Elke site kan een andere PHP-versie draaien.",
  "Na het bijwerken: kijk of er onbekende beheerders of nieuwe bestanden zijn bijgekomen, wijzig je wachtwoorden en zorg voor een recente back-up buiten de server.",
  "Werk ook je CMS, plugins en thema's bij en verwijder wat je niet gebruikt. Dat is goed onderhoud, maar het lost het PHP-lek zelf niet op.",
];

function Stappen({ aantal = STAPPEN.length, domein = "" }: { aantal?: number; domein?: string }) {
  const { t } = useLanguage();
  const [gekopieerd, zetGekopieerd] = useState(false);
  const mail = () => [
    t("Onderwerp: Is PHP bijgewerkt voor php2shell?"),
    "",
    t("Hallo,"),
    "",
    invul(t("Draait mijn website {domein} op een PHP-versie met de fix voor php2shell (CVE-2026-109618 en CVE-2026-109619)? Dat is PHP 8.5.12, 8.4.27, 8.3.36, 8.2.35 of nieuwer, of jullie pakket met de teruggezette fix."), { domein: domein || t("[je domein]") }),
    "",
    t("Kunnen jullie dat schriftelijk bevestigen, met de exacte PHP-versie en de datum van de update?"),
    "",
    t("Met vriendelijke groet,"),
  ].join("\n");
  const kopieer = async () => {
    const tekst = mail();
    try { await navigator.clipboard.writeText(tekst); }
    catch {
      const veld = document.createElement("textarea");
      veld.value = tekst; veld.setAttribute("readonly", ""); veld.style.position = "fixed"; veld.style.opacity = "0";
      document.body.appendChild(veld); veld.select();
      try { document.execCommand("copy"); } catch { /* dan blijft de knop staan */ }
      veld.remove();
    }
    zetGekopieerd(true);
    window.setTimeout(() => zetGekopieerd(false), 2500);
  };
  return (
    <ol className="pc-stappen">
      {STAPPEN.slice(0, aantal).map((stap, i) => (
        <li key={stap}>
          <span>{stap}{i === 3 && <sup>2,3</sup>}</span>
          {i === 0 && (
            <button type="button" className="pc-kopieer" onClick={kopieer}>
              {gekopieerd ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
              <span>{gekopieerd ? "Gekopieerd" : "Kopieer de e-mail"}</span>
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}

// Kort formulier (naam, e-mail, domein) in de uitslag, of het volledige formulier onderaan. Beide gaan naar secure@socialnow.nl.
function Aanvraag({ kort = false, telefoon = false, soort = "", domein = "", uitslag, kop = true, knop }: { kort?: boolean; telefoon?: boolean; soort?: string; domein?: string; uitslag?: Uitslag | null; kop?: boolean; knop?: string }) {
  const { t, language } = useLanguage();
  const [staat, zetStaat] = useState<"open" | "bezig" | "klaar" | "mail">("open");
  const [hint, zetHint] = useState("");
  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (staat === "bezig") return;
    const f = new FormData(e.currentTarget);
    const w = (k: string) => String(f.get(k) || "").trim();
    const data = {
      naam: w("naam"), email: w("email"), domein: normaliseerInvoer(w("domein")) || w("domein"),
      uitslag: uitslag?.uitslag || "", phpVersie: uitslag?.phpVersie || "", telefoon: w("telefoon"), hosting: w("hosting"),
      vraag: w("vraag"), taal: language, soort, website2: w("website2"),
    };
    zetHint("");
    if (!data.naam) return zetHint(t("Vul je naam in."));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return zetHint(t("Dat e-mailadres klopt nog niet."));
    if (!data.domein) return zetHint(t("Vul je website in."));
    zetStaat("bezig");
    try {
      const r = await fetch(AANVRAAG, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => null);
      if (j?.ok) return zetStaat("klaar");
      if (j?.reden === "email") { zetStaat("open"); return zetHint(t("Dat e-mailadres klopt nog niet.")); }
      throw new Error("aanvraag");
    } catch {
      // Onze eigen functie is onbereikbaar: dan gaat de aanvraag als ingevuld concept per mail, zodat hij niet verdwijnt.
      const tekst = [`${t("Naam")}: ${data.naam}`, `${t("E-mail")}: ${data.email}`, `${t("Website")}: ${data.domein}`, data.uitslag ? `${t("Uitslag van de securityscan")}: ${data.uitslag}${data.phpVersie ? `, PHP ${data.phpVersie}` : ""}` : "", data.vraag].filter(Boolean).join("\n");
      window.location.href = conceptLink(`Securityscan-aanvraag: ${data.domein}`, tekst);
      zetStaat("mail");
    }
  };
  if (staat === "klaar" || staat === "mail") return (
    <div className={`pc-formulier${kort ? " pc-kort" : ""}`} role="status">
      <h3>Ontvangen, we nemen contact met je op.</h3>
      {staat === "mail" && <p>Je mailprogramma opent met je aanvraag erin. Druk daar op versturen.</p>}
    </div>
  );
  return (
    <form className={`pc-formulier${kort ? " pc-kort" : ""}`} onSubmit={verstuur} noValidate>
      {!kort && kop && <h2>Vraag je gratis securityscan aan.</h2>}
      <div className="pc-rij">
        <label>Je naam<input name="naam" autoComplete="name" placeholder="Voor- en achternaam" /></label>
        <label>E-mail<input name="email" type="email" autoComplete="email" placeholder="naam@bedrijf.nl" /></label>
      </div>
      <label>Website<input name="domein" autoComplete="url" placeholder="jouwbedrijf.nl" defaultValue={domein} key={domein || "leeg"} /></label>
      {kort && telefoon && <label>Telefoon<input name="telefoon" type="tel" autoComplete="tel" placeholder="Optioneel" /></label>}
      {!kort && (
        <>
          <div className="pc-rij">
            <label>Telefoon<input name="telefoon" type="tel" autoComplete="tel" placeholder="Optioneel" /></label>
            <label>Waar staat je website?<input name="hosting" placeholder="Optioneel, bijvoorbeeld Hostinger of TransIP" /></label>
          </div>
          <label>Wil je nog iets kwijt?<textarea name="vraag" rows={3} maxLength={1000} placeholder="Optioneel" /></label>
        </>
      )}
      {/* Honeypot: een mens ziet dit veld nooit. */}
      <input name="website2" tabIndex={-1} autoComplete="off" aria-hidden="true" className="pc-honing" />
      {hint && <p className="pc-hint" role="alert">{hint}</p>}
      <button className="pc-knop" type="submit" disabled={staat === "bezig"}>
        <span>{staat === "bezig" ? "Versturen…" : knop ? knop : kort ? "Verstuur" : "Vraag de gratis securityscan aan"}</span>
        <span className="pc-knop-icoon" aria-hidden="true"><ArrowUpRight size={16} /></span>
      </button>
    </form>
  );
}

// 22 oktober 2026, middag (Marinus): "geen pillknoppen", hij wil de mensen zien. In plaats van de knoppenparen een
// contactblok met Steef en Michelle: foto, naam en rol komen uit proposal/content.ts (niets verzonnen). Per persoon een
// directe weg: een call plannen (boekingspagina met type uitgebreide-check en het domein ingevuld; zolang die niet live is
// het korte formulier op #aanvraag) en mailen naar secure@socialnow.nl.
const SECURE = "security@socialnow.nl";
const MENSEN = ["Steef Komen", "Michelle Yang"];

// Regiechat, 22 oktober 2026 (gelijk met de socialvideo van Marinus): de updates zijn tijdelijk gratis. Bij een oude
// versie (oranje of rood) staat deze regel in het PHP-blok, direct boven Steef en Michelle (kort).
const GRATIS_UPDATE = "Omdat dit ons allemaal raakt, voeren we de essentiële updates tijdelijk gratis uit. Plan een call of stuur een mail.";

function Mensen({ domein = "", kort = false, groot = false }: { domein?: string; kort?: boolean; groot?: boolean }) {
  const { t, language } = useLanguage();
  const boek = boekLink(language, domein, "uitgebreide-check");
  const onderwerp = encodeURIComponent(domein ? `${t("Securityscan")}: ${domein}` : t("Securityscan"));
  return (
    <div className={`pc-mensen${kort ? " pc-mensen-kort" : ""}${groot ? " pc-mensen-groot" : ""}`}>
      {kort ? <p className="pc-gratis">{t(GRATIS_UPDATE)}</p> : groot ? (
        <>
          <h2 className="pc-sectiekop">Praat met Steef of Michelle.</h2>
          <p>Plan een diepgaand gesprek of claim de gratis update van je huidige systemen. Omdat dit ons allemaal raakt, voeren we de essentiële updates tijdelijk gratis uit.</p>
        </>
      ) : (
        <>
          <h3>Praat met Steef of Michelle.</h3>
          <p>Omdat dit ons allemaal raakt, voeren we de essentiële updates tijdelijk gratis uit. Wil je dieper gaan, dan bespreken we de scope met je.</p>
        </>
      )}
      <ul>
        {MENSEN.map((naam) => people.find((p) => p.name === naam)).filter((p): p is (typeof people)[number] => !!p).map((p) => (
          <li key={p.name} className="pc-mens">
            <img {...klein(p.image, kort ? "56px" : groot ? "120px" : "88px", [96, 160, 240])} alt={p.name} width={kort ? 56 : groot ? 120 : 88} height={kort ? 56 : groot ? 120 : 88} loading="lazy" />
            <div>
              <strong translate="no">{p.name}</strong>
              <small translate="no">{p.role}</small>
              <span className="pc-mens-wegen">
                <a href={boekExtern ? boek : "#aanvraag"} {...(boekExtern ? { target: "_blank", rel: "noopener" } : {})}>
                  <CalendarDays size={16} aria-hidden="true" />{groot ? <span>Plan een diepgaand gesprek</span> : <span>Plan een call</span>}
                </a>
                {groot && (
                  <a href="#aanvraag">
                    <ShieldCheck size={16} aria-hidden="true" /><span>Claim je gratis update</span>
                  </a>
                )}
                <a href={`mailto:${SECURE}?subject=${onderwerp}`}>
                  <Mail size={16} aria-hidden="true" /><span translate="no">{SECURE}</span>
                </a>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 22 oktober 2026, 15.45 (Marinus): de nieuwe securityvideo (HyperFrames, Marinus aan het woord, export v2a) vervangt de
// uitlegfilm. Eén verticale film, Engels in beeld (security-campagne), dus voor elke taal dezelfde. Klik om af te spelen,
// poster als voorbeeldbeeld. Komt er een nieuwere export, dan vervangt die security-9x16.mp4 met dezelfde naam.
function Film() {
  return (
    <section className="h-wrap pc-film">
      <video
        className="pc-video pc-video-9x16"
        controls
        playsInline
        preload="none"
        poster="/security/film/poster-9x16.jpg"
        aria-label="Securityvideo: is je website veilig?"
      >
        <source src="/security/film/security-9x16.mp4" type="video/mp4" />
      </video>
    </section>
  );
}

// Officiële documenten (sessie check-documenten). Het blok verschijnt pas als hier bestanden staan die in public/ bestaan:
// nooit een lege of kapotte link.
const DOCUMENTEN: { naam: string; bestand: string }[] = [
  { naam: "Verklaring verantwoord scannen", bestand: "verklaring-verantwoord-scannen" },
  { naam: "Privacy en gegevens bij de websitecheck", bestand: "privacy-en-gegevens" },
  { naam: "Zo lees je je uitslag", bestand: "zo-lees-je-je-uitslag" },
  { naam: "De uitgebreide check", bestand: "de-uitgebreide-check" },
];

// 22 oktober 2026, middag (Marinus): "PHP is het allerbelangrijkste." Live zag hij bij wikipedia.org en link.nl "niks
// terug van de php": bij een afgeschermde versie toonde de uitslag alleen een kop en een belregel, zonder versie, zonder
// betekenis en zonder stappen, en daaronder nam het rapport met vijf punten de ruimte. Nu staat bovenaan in de uitslag
// altijd dit blok, bij elke uitkomst compleet: de status, de PHP-versie of "afgeschermd", één zin wat het betekent en de
// eerste drie stappen. Teksten volgen de beslistabel in ONDERZOEK.md 5.2: rood alleen met bewijs, nooit "veilig".
const LABEL: Record<string, string> = { groen: "Fix gezien", rood: "Niet gepatcht", oranje: "Twijfel", onbekend: "Afgeschermd" };

function phpTekst(u: Uitslag, t: (s: string) => string) {
  const w = { versie: u.phpVersie, fix: u.hersteldVanaf, release: u.release, naar: u.doorverwezenNaar };
  const r = u.code || u.reden || "";
  const zin = (s: string) => invul(t(s), w);
  if (u.uitslag === "groen") return {
    kop: t("Je PHP bevat de fix."),
    zin: zin(r === "ubuntu-hersteld"
      ? "Je server draait PHP {versie}, de herstelde build van {release}, maar dat zegt niets over een eerdere inbraak."
      : "De PHP-versie die je server laat zien bevat de fix, maar dat zegt niets over een eerdere inbraak."),
  };
  if (u.uitslag === "rood") return {
    kop: t("Je PHP is niet gepatcht."),
    zin: zin("Je server draait PHP {versie} zonder de fix uit {fix}, dus je site is kwetsbaar voor php2shell."),
  };
  if (u.uitslag === "oranje") {
    if (r === "onder-de-fix-zonder-bewijs" || r === "el-leverancier-onder-fix") return {
      kop: t("Waarschijnlijk niet gepatcht."),
      zin: zin("Je server meldt PHP {versie}, lager dan de fix in {fix}, maar sommige hosts patchen zonder het nummer te veranderen."),
    };
    if (r === "doorverwijzing") return { kop: t("Je domein stuurt door."), zin: zin("Je domein stuurt door naar {naar}, en die server meldt PHP {versie} zonder de fix.") };
    if (r === "eol-alleen-via-host") return { kop: t("Verouderde PHP, vraag je host."), zin: zin("PHP {versie} krijgt geen officiële fix meer, dus alleen je host kan hem nog gepatcht hebben.") };
    const oranje: Record<string, string> = {
      "tegenstrijdige-versies": "Je server noemt meer dan één PHP-versie, dus we zeggen liever niets dan iets verkeerds.",
      "geen-patchnummer": "Je server meldt PHP {versie} zonder het laatste cijfer, dus we zien niet of de fix erin zit.",
    };
    return { kop: t("Van buitenaf niet te zeggen."), zin: zin(oranje[r] || "Je server meldt PHP {versie} uit een pakket waarvan we de fixversie nog niet kennen.") };
  }
  // Onbekend, om welke reden ook (versie verborgen, geen PHP te zien, site onbereikbaar, onze functie faalde).
  return {
    kop: t("Je site schermt dit af."),
    zin: t(r === "versie-verborgen"
      ? "Er draait PHP, maar je server verbergt de versie, dus van buitenaf zien we niet of de fix erin zit."
      : r === "geen-php-gezien"
        ? "We zien van buitenaf geen PHP, dus we kunnen niet zeggen of de fix erin zit."
        : "We konden je site niet volledig lezen, dus we zien van buitenaf niet of de fix erin zit."),
  };
}

export function PhpBlok({ u }: { u: Uitslag }) {
  const { t } = useLanguage();
  const kleur = u.uitslag || "onbekend";
  const tekst = phpTekst(u, t);
  // PHP 8.1 en ouder krijgt geen officiële fix meer (regiechat 22 oktober 2026).
  const [hoofd, minor] = (u.phpVersie || "").split(/[.-]/).map(Number);
  const oud = !!u.phpVersie && Number.isFinite(hoofd) && (hoofd < 8 || (hoofd === 8 && minor <= 1));
  return (
    <div className={`pc-php pc-${kleur}`}>
      <p className="pc-label"><i aria-hidden="true" /><b>{LABEL[kleur]}</b><span translate="no">PHP · php2shell</span></p>
      <h2>{tekst.kop}</h2>
      <dl className="pc-php-versie">
        <div><dt>PHP-versie</dt>{u.phpVersie ? <dd translate="no">{u.phpVersie}</dd> : <dd>afgeschermd</dd>}</div>
        {u.hersteldVanaf && <div><dt>Hersteld vanaf</dt><dd translate="no">{u.hersteldVanaf}</dd></div>}
        {u.domein && <div><dt>Domein</dt><dd translate="no">{u.domein}</dd></div>}
      </dl>
      <p className="pc-php-zin">{tekst.zin}</p>
      {oud && <p className="pc-php-oud">{t("Voor PHP 8.1 en ouder komt geen officiële fix meer. We plannen samen de overstap.")}</p>}
      {(kleur === "rood" || kleur === "oranje") && <Mensen domein={u.domein || ""} kort />}
      <div className="pc-eerst">
        <h3>Dit kun je zelf al doen.</h3>
        <Stappen aantal={3} domein={u.domein} />
        <a className="pc-meer" href="#zelf">Alle zeven stappen</a>
      </div>
    </div>
  );
}

// 22 oktober 2026, middag (Marinus, via de regiechat): direct onder de film en boven de scan wie er geraakt is en wie risico
// loopt. Logo's in eigen kleur, even hoog, elk een link naar de bron van het incident (niet naar het merk). Overheden
// krijgen alleen hun landvlag met de naam van de organisatie: overheidslogo's en wapens mogen bedrijven niet gebruiken.
// Geen banken en geen bedrijven zonder bron. Bij "risico" geen bedrijven die kwetsbaar zouden zijn, alleen platforms.
// Bronnen gelijk aan de film (regiechat, 22 oktober 2026), geopend en live 200; Mashable noemt ITZBund, Valtori, het
// Belgische ministerie van Buitenlandse Zaken, Overheid.nl en Wikimedia. Platforms linken naar hun officiële systeemeisen.
type Geraakt = { naam: string; logo?: string; vlag?: string; org?: string; wat: string; bron: string; uitgever: string; bron2?: string; uitgever2?: string };
const GERAAKT: Geraakt[] = [
  { naam: "Nintendo", logo: "/security/logos/nintendo.svg", wat: "Onderhoud aan online diensten gemeld", bron: "https://www.dexerto.com/pokemon/pokemon-umamusume-and-other-major-games-taken-offline-over-critical-php-vulnerability-3420823/", uitgever: "Dexerto" },
  { naam: "Wikipedia", logo: "/security/logos/wikipedia.svg", wat: "Haalde ondersteunende diensten offline tot de patch", bron: "https://mashable.com/tech/php-vulnerability-websites-offline-affected-services", uitgever: "Mashable", bron2: "https://en.wikipedia.org/wiki/PHP2Shell", uitgever2: "Wikipedia, PHP2Shell" },
  { naam: "Duitsland", vlag: "de", org: "ITZBund", wat: "Haalde uit voorzorg federale websites offline", bron: "https://mashable.com/tech/php-vulnerability-websites-offline-affected-services", uitgever: "Mashable" },
  { naam: "Finland", vlag: "fi", org: "Valtori", wat: "Sloot uit voorzorg publieke overheidsdiensten af", bron: "https://mashable.com/tech/php-vulnerability-websites-offline-affected-services", uitgever: "Mashable" },
  { naam: "België", vlag: "be", org: "Buitenlandse Zaken", wat: "Haalde tijdelijk de eigen websites offline", bron: "https://mashable.com/tech/php-vulnerability-websites-offline-affected-services", uitgever: "Mashable" },
  { naam: "Nederland", vlag: "nl", org: "Overheid.nl", wat: "Overheidsportaal uit voorzorg offline", bron: "https://mashable.com/tech/php-vulnerability-websites-offline-affected-services", uitgever: "Mashable", bron2: "https://en.wikipedia.org/wiki/PHP2Shell", uitgever2: "Wikipedia, PHP2Shell" },
];
type Platform = { naam: string; logo: string; bron: string };
const RISICO: Platform[] = [
  { naam: "WordPress", logo: "/security/logos/wordpress.svg", bron: "https://wordpress.org/about/requirements/" },
  { naam: "WooCommerce", logo: "/security/logos/woocommerce.svg", bron: "https://woocommerce.com/document/server-requirements/" },
  { naam: "Magento", logo: "/security/logos/magento.svg", bron: "https://experienceleague.adobe.com/en/docs/commerce-operations/installation-guide/system-requirements" },
  { naam: "Joomla", logo: "/security/logos/joomla.svg", bron: "https://manual.joomla.org/docs/next/get-started/technical-requirements/" },
  { naam: "Drupal", logo: "/security/logos/drupal.svg", bron: "https://www.drupal.org/docs/getting-started/system-requirements/php-requirements" },
  { naam: "PrestaShop", logo: "/security/logos/prestashop.svg", bron: "https://devdocs.prestashop-project.org/9/basics/installation/system-requirements/" },
  { naam: "Laravel", logo: "/security/logos/laravel.svg", bron: "https://laravel.com/docs/12.x/deployment#server-requirements" },
];

function Extern({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener">
      {children}
      <span className="pc-sr">(opent in een nieuw tabblad)</span>
    </a>
  );
}

// 22 oktober 2026, 15.45 (Marinus): wie werd geraakt en wie loopt risico staan nu onder de scan, als één bentogrid. Eerst de
// kop, dan Nintendo en Wikipedia, de vier overheden, daarna de platforms en het aandeel PHP (bron W3Techs, zie FAQ).
const W3TECHS = "https://w3techs.com/technologies/details/pl-PHP";
function Bento() {
  return (
    <section className="h-wrap pc-bento-blok" aria-labelledby="pc-geraakt-kop">
      <ul className="pc-bento">
        <li className="pc-tegel pc-tegel-kop">
          <h2 className="pc-blokkop" id="pc-geraakt-kop">Wie werd geraakt.</h2>
          <p className="pc-geen-klant">Geen klanten of partners van SocialNow. Gemeld als offline of verstoord tijdens php2shell.</p>
        </li>
        {GERAAKT.map((g, i) => (
          <li key={g.naam} className={`pc-tegel pc-tegel-${g.logo ? "merk" : "land"}`}>
            <Extern href={g.bron} className="pc-logo-link">
              {g.logo
                ? <span className="pc-merk"><img className="pc-logo" src={g.logo} alt={g.naam} height="48" loading="lazy" /><strong translate="no" aria-hidden="true">{g.naam}</strong></span>
                : <span className="pc-vlag-naam"><img className="pc-vlag" src={`/security/vlaggen/${g.vlag}.svg`} alt="" height="40" loading="lazy" /><strong>{g.naam}</strong><small>{g.org}</small></span>}
              <span className="pc-logo-wat">{g.wat}<sup>{i + 1}</sup></span>
            </Extern>
          </li>
        ))}
        <li className="pc-tegel pc-tegel-risico">
          <h2 className="pc-blokkop" id="pc-risico-kop">Wie loopt risico.</h2>
          <ul className="pc-logos pc-logos-platform" aria-labelledby="pc-risico-kop">
            {RISICO.map((p) => (
              <li key={p.naam}>
                <Extern href={p.bron} className="pc-logo-link"><img className="pc-logo" src={p.logo} alt={p.naam} height="40" loading="lazy" /><span className="pc-logo-naam" translate="no" aria-hidden="true">{p.naam}</span></Extern>
              </li>
            ))}
          </ul>
          <p className="pc-risico-oproep">Gebouwd op een van deze en heeft niemand er al een tijdje naar omgekeken? Doe de scan.</p>
          <p className="pc-geen-klant">Platforms die op PHP draaien. Geen klanten of partners van SocialNow.</p>
        </li>
        <li className="pc-tegel pc-tegel-cijfer">
          <p className="pc-cijfer"><b translate="no">±70%</b><span>van de websites draait op PHP<sup>{GERAAKT.length + 1}</sup></span></p>
          <p className="pc-risico-host">Een site bij een moderne host die PHP zelf bijwerkt, loopt minder risico.</p>
          <a className="pc-naar-scan" href="#scan"><ArrowUp size={16} aria-hidden="true" /><span>Naar de scan</span></a>
        </li>
      </ul>
      <ol className="pc-bronnen pc-geraakt-bronnen">
        {GERAAKT.map((g) => (
          <li key={g.naam}><span>{g.naam}</span>{g.org && <span>, {g.org}</span>}<span aria-hidden="true">: </span><Extern href={g.bron}><span translate="no">{g.uitgever}</span></Extern>{g.bron2 && <><span aria-hidden="true">; </span><Extern href={g.bron2}><span translate="no">{g.uitgever2}</span></Extern></>}</li>
        ))}
        <li>W3Techs, gebruik van servertalen, stand augustus 2026. <Extern href={W3TECHS}><span translate="no">w3techs.com</span></Extern></li>
      </ol>
    </section>
  );
}

// 22 oktober 2026, 16.45 (Marinus): de uitslag bewaren of privé delen: WhatsApp, Messenger, e-mail, pdf en kopiëren. Geen
// LinkedIn of andere openbare kanalen, want een uitslag post je meestal niet. Pdf via het printvenster (alleen de uitslag,
// zie @media print in php-check.css). Messenger heeft geen deellink voor het web zonder app-id, dus alleen op telefoons.
const DEEL_URL = "https://socialnow.nl/security";
function Delen({ u }: { u: Uitslag }) {
  const { t } = useLanguage();
  const [gekopieerd, zetGekopieerd] = useState(false);
  const [telefoon, zetTelefoon] = useState(false);
  useEffect(() => { zetTelefoon(window.matchMedia("(pointer: coarse)").matches); }, []);
  const kop = phpTekst(u, t).kop;
  const tekst = `${invul(t("Securityscan van {domein}: {uitslag}"), { domein: u.domein || "", uitslag: kop })}${u.phpVersie ? ` (PHP ${u.phpVersie})` : ""}. ${t("Doe ook de gratis securityscan:")} ${DEEL_URL}`;
  const kopieer = async () => {
    try { await navigator.clipboard.writeText(tekst); }
    catch {
      const veld = document.createElement("textarea");
      veld.value = tekst; veld.setAttribute("readonly", ""); veld.style.position = "fixed"; veld.style.opacity = "0";
      document.body.appendChild(veld); veld.select();
      try { document.execCommand("copy"); } catch { /* niet gelukt */ }
      veld.remove();
    }
    zetGekopieerd(true);
    window.setTimeout(() => zetGekopieerd(false), 2000);
  };
  return (
    <div className="pc-delen">
      <p>Bewaar of deel je uitslag.</p>
      <div className="pc-delen-knoppen">
        <a href={`https://wa.me/?text=${encodeURIComponent(tekst)}`} target="_blank" rel="noopener"><MessageCircle size={16} aria-hidden="true" /><span translate="no">WhatsApp</span></a>
        {telefoon && <a href={`fb-messenger://share/?link=${encodeURIComponent(DEEL_URL)}`}><Send size={16} aria-hidden="true" /><span translate="no">Messenger</span></a>}
        <a href={`mailto:?subject=${encodeURIComponent(t("Gratis securityscan"))}&body=${encodeURIComponent(tekst)}`}><Mail size={16} aria-hidden="true" /><span>E-mail</span></a>
        <button type="button" onClick={() => window.print()}><FileDown size={16} aria-hidden="true" /><span>Opslaan als pdf</span></button>
        <button type="button" onClick={kopieer}>{gekopieerd ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}<span>{gekopieerd ? "Gekopieerd" : "Kopieer"}</span></button>
      </div>
      <p className="pc-print-voet" aria-hidden="true">socialnow.nl/security · {new Date().toLocaleDateString()}</p>
    </div>
  );
}

// 22 oktober 2026, 16.45 (Marinus): het formulier stond te ver weg. Direct onder Steef en Michelle een schakelaar zoals bij
// de films (witte ring, glijdend groen vlak): "Neem contact op" met het uitgebreide formulier (mail naar security@) of
// "Dit kun je zelf doen" met de zeven stappen. #aanvraag opent het formulier, #zelf de stappen.
type Keuze = "contact" | "zelf";
function ContactOfZelf({ domein, uitslag, keuze, zetKeuze }: { domein: string; uitslag: Uitslag | null; keuze: Keuze; zetKeuze: (k: Keuze) => void }) {
  const groepRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const groep = groepRef.current;
    if (!groep) return;
    const zet = () => {
      const knop = groep.querySelector<HTMLElement>('button[aria-pressed="true"]');
      if (!knop) return;
      groep.style.setProperty("--glijder-x", `${knop.offsetLeft}px`);
      groep.style.setProperty("--glijder-w", `${knop.offsetWidth}px`);
      if (!groep.dataset.glijder) { groep.dataset.glijder = "staat"; requestAnimationFrame(() => requestAnimationFrame(() => { groep.dataset.glijder = "klaar"; })); }
    };
    zet();
    const rs = typeof ResizeObserver === "function" ? new ResizeObserver(zet) : null;
    rs?.observe(groep);
    return () => rs?.disconnect();
  }, [keuze]);
  return (
    <>
      <div className="pc-keuze" ref={groepRef}>
        <span className="pc-keuze-glijder" aria-hidden="true" />
        <button type="button" className={keuze === "contact" ? "is-aan" : ""} aria-pressed={keuze === "contact"} onClick={() => zetKeuze("contact")}>
          <Mail size={15} aria-hidden="true" /><span>Neem contact op</span>
        </button>
        <button type="button" className={keuze === "zelf" ? "is-aan" : ""} aria-pressed={keuze === "zelf"} onClick={() => zetKeuze("zelf")}>
          <Wrench size={15} aria-hidden="true" /><span>Dit kun je zelf doen</span>
        </button>
      </div>
      {keuze === "contact" ? (
        <div className="pc-keuze-vak">
          <p className="pc-keuze-zin">Vul je gegevens in, dan nemen Steef of Michelle contact met je op. Je aanvraag gaat naar <span translate="no">{SECURE}</span>.</p>
          <Aanvraag telefoon soort="gratis-update" domein={domein} uitslag={uitslag} kop={false} knop="Claim je gratis update" key={domein || "leeg"} />
        </div>
      ) : (
        <div className="pc-keuze-vak pc-zelf">
          <Stappen domein={domein} />
          <p className="pc-noot">De PHP-versie verbergen (<code translate="no">expose_php=Off</code>) maakt je minder zichtbaar, maar repareert niets.</p>
          <ol className="pc-bronnen">
            <li>PHP, ChangeLog 8, 21 oktober 2026. <a href="https://www.php.net/ChangeLog-8.php" target="_blank" rel="noopener">php.net</a></li>
            <li>NCSC (VK), Critical security issue affecting PHP, oktober 2026. <a href="https://www.ncsc.gov.uk/sites/default/files/2026-10/Critical-security-issue-affecting-PHP_2.pdf" target="_blank" rel="noopener">ncsc.gov.uk</a></li>
            <li>NSA-advies over php2shell, zoals gemeld door TweakTown, 22 oktober 2026. <a href="https://www.tweaktown.com/news/114213/nsa-warns-70-percent-of-websites-to-install-the-latest-php-patch-now-or-go-offline/index.html" target="_blank" rel="noopener">tweaktown.com</a></li>
          </ol>
        </div>
      )}
    </>
  );
}

export function PhpCheckPage() {
  const { t, language } = useLanguage();
  const [domein, zetDomein] = useState("");
  const [bezig, zetBezig] = useState(false);
  const [hint, zetHint] = useState("");
  const [uitslag, zetUitslag] = useState<Uitslag | null>(null);
  // ?domein=jouwbedrijf.nl (bijvoorbeeld uit de mailing) vult de website in het formulier alvast in.
  const [vooraf, zetVooraf] = useState("");
  useEffect(() => { try { zetVooraf(normaliseerInvoer(new URLSearchParams(window.location.search).get("domein") || "")); } catch { /* geen domein */ } }, []);
  const uitslagRef = useRef<HTMLDivElement>(null);
  const aanvraagRef = useRef<HTMLElement>(null);
  // Websiterapport onder het PHP-blok (feat/check-rapport): elke nieuwe check is een nieuwe ronde.
  const [ronde, zetRonde] = useState(0);
  // socialnow.nl/security#aanvraag (ook /nl/security#aanvraag, en /check#aanvraag via de 308 uit vercel.json; de mailing
  // linkt hierheen): de pagina scrolt naar het formulier. Live bleef scrollY 0, want de pagina bouwt na het laden nog op
  // (taalwissel, film, rapport); daarom een paar keer opnieuw in beeld zetten (overgenomen uit PR #148).
  useEffect(() => {
    const wekkers: number[] = [];
    const kijk = () => {
      const hash = window.location.hash;
      if (hash !== "#aanvraag" && hash !== "#zelf") return;
      zetKeuze(hash === "#zelf" ? "zelf" : "contact");
      for (const ms of [0, 300, 900, 1800]) wekkers.push(window.setTimeout(() => aanvraagRef.current?.scrollIntoView({ block: "start" }), ms));
    };
    kijk();
    window.addEventListener("hashchange", kijk);
    return () => { window.removeEventListener("hashchange", kijk); wekkers.forEach((w) => window.clearTimeout(w)); };
  }, []);

  const [keuze, zetKeuze] = useState<Keuze>("contact");
  const toon = (u: Uitslag) => { zetUitslag(u); requestAnimationFrame(() => uitslagRef.current?.focus()); };

  const start = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    zetHint("");
    const host = normaliseerInvoer(domein);
    if (!host) { zetUitslag(null); return zetHint(t("Vul een domein in, bijvoorbeeld jouwbedrijf.nl.")); }
    zetBezig(true);
    zetUitslag(null);
    zetRonde((r) => r + 1);
    try {
      const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domein: host }) });
      const j: Uitslag | null = await r.json().catch(() => null);
      if (j && !j.ok && ["leeg", "ongeldig", "ip", "poort"].includes(j.code || j.reden || "")) zetHint(t("Vul een domein in, bijvoorbeeld jouwbedrijf.nl."));
      else if (r.status === 429) zetHint(t("Veel scans vanaf jouw netwerk. Probeer het over een paar minuten nog eens."));
      else toon(j?.ok && j.uitslag ? j : { ok: true, domein: host, uitslag: "onbekend", phpVersie: null, code: "fout" });
    } catch {
      // Een check lukt altijd: ook als onze eigen functie niet antwoordt, krijgt de bezoeker een uitslag.
      toon({ ok: true, domein: host, uitslag: "onbekend", phpVersie: null, code: "fout" });
    } finally {
      zetBezig(false);
    }
  };

  const u = uitslag?.ok ? uitslag : null;
  const gecheckt = u?.domein || normaliseerInvoer(domein);

  return (
    <div className="pc">
      {/* 22 oktober 2026, 15.45 (Marinus): film bovenaan; de scan met de documenten in een witte sectie zodat die opvalt;
          daaronder de bento met wie werd geraakt en wie risico loopt, en direct Steef en Michelle. */}
      <Film />

      <section className="pc-scan" id="scan">
      <div className="pc-hero h-wrap">
        <p className="h-eyebrow pc-eyebrow"><i aria-hidden="true" /> Gratis securityscan</p>
        <h1 className="pc-kop">Is je website veilig?</h1>

        <form className={`pc-check${bezig ? " pc-bezig" : ""}`} onSubmit={start} noValidate>
          <span className="pc-laad" aria-hidden="true" />
          <label className="pc-veld">
            <span>Je domein</span>
            <input
              name="domein"
              value={domein}
              onChange={(e) => zetDomein(e.target.value)}
              inputMode="url"
              autoComplete="url"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="jouwbedrijf.nl"
              aria-invalid={hint ? true : undefined}
              aria-describedby={hint ? "pc-check-hint" : undefined}
            />
          </label>
          {hint && <p className="pc-hint" id="pc-check-hint">{hint}</p>}
          <button className="pc-knop" type="submit" disabled={bezig}>
            <span>{bezig ? "Bezig met de scan…" : "Doe de gratis securityscan"}</span>
            <span className="pc-knop-icoon" aria-hidden="true"><ArrowUpRight size={16} /></span>
          </button>
        </form>

        <div className="pc-uitslag-plek" aria-live="polite">
          {u && (
            <div className="pc-uitslag" ref={uitslagRef} tabIndex={-1}>
              {/* Eerst PHP, groot en compleet; pas daaronder de vijf punten, dan Steef en Michelle. */}
              <PhpBlok u={u} />
              <Delen u={u} />
              {u.domein && <CheckRapport domein={u.domein} ronde={ronde} />}
              {u.uitslag !== "rood" && u.uitslag !== "oranje" && <Mensen domein={u.domein || ""} />}
              <p className="pc-disclaimer">Deze scan leest alleen openbare informatie van je website. Het is een snelle indicatie, geen volledige beveiligingsaudit en geen garantie. Wil je zekerheid? Plan een gratis call met ons team.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hoe en wat we meten, als pdf in NL (Nederlands) of EN (alle andere talen), als links in de witte sectie. */}
      {DOCUMENTEN.length > 0 && (
        <div className="h-wrap pc-documenten">
          <h2>Hoe en wat we meten.</h2>
          <ul className="pc-docs">
            {DOCUMENTEN.map((d) => (
              <li key={d.bestand}>
                <a href={`/websitecheck/${d.bestand}-${language === "nl" ? "nl" : "en"}.pdf`} target="_blank" rel="noopener"><span>{d.naam}</span><small>PDF</small></a>
              </li>
            ))}
          </ul>
        </div>
      )}
      </section>

      <Bento />

      <section className="h-wrap pc-team" id="aanvraag" ref={aanvraagRef}>
        <span id="zelf" className="pc-anker" aria-hidden="true" />
        <Mensen domein={gecheckt || vooraf} groot />
        <ContactOfZelf domein={gecheckt || vooraf} uitslag={u} keuze={keuze} zetKeuze={zetKeuze} />
      </section>

      <section className="h-section h-wrap pc-faq-blok">
        <h2 className="pc-sectiekop">Veelgestelde vragen.</h2>
        <div className="pc-faq">
          <details>
            <summary>Wat is php2shell?</summary>
            <p>Een ernstig lek in PHP, de taal waarop ongeveer 70% van de websites draait.<sup>1</sup> Sinds 21 oktober 2026 is er een fix in PHP 8.5.12, 8.4.27, 8.3.36 en 8.2.35. Overheden in Nederland, Duitsland, Finland, België en Frankrijk haalden websites tijdelijk offline.<sup>2</sup></p>
          </details>
          <details>
            <summary>Wat betekent "Je site schermt dit af"?</summary>
            <p>Je server laat niet zien welke PHP-versie hij draait, of we konden je site niet lezen. Dat is op zich goed, maar daardoor zien wij van buitenaf niet of PHP is bijgewerkt. Plan een call of vul het formulier in, dan kijken we samen.</p>
          </details>
          <details>
            <summary>Is groen een garantie?</summary>
            <p>Nee. Groen betekent dat de versie die je server laat zien de fix bevat. Het zegt niets over een eerdere inbraak, andere PHP-versies op dezelfde server of de rest van je website.</p>
          </details>
        </div>
        <ol className="pc-bronnen">
          <li>W3Techs, gebruik van servertalen, stand augustus 2026. <a href="https://w3techs.com/technologies/details/pl-PHP" target="_blank" rel="noopener">w3techs.com</a></li>
          <li>The Next Web, 21 oktober 2026. <a href="https://thenextweb.com/news/europe-governments-websites-offline-php-security-flaws" target="_blank" rel="noopener">thenextweb.com</a></li>
        </ol>
      </section>

    </div>
  );
}
