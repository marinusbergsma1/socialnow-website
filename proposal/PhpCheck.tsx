import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useLanguage } from "./i18n/context";
import { boekExtern, boekLink, conceptLink } from "./aanvragen";
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
function Aanvraag({ kort = false, telefoon = false, soort = "", domein = "", uitslag }: { kort?: boolean; telefoon?: boolean; soort?: string; domein?: string; uitslag?: Uitslag | null }) {
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
      const tekst = [`${t("Naam")}: ${data.naam}`, `${t("E-mail")}: ${data.email}`, `${t("Website")}: ${data.domein}`, data.uitslag ? `${t("Uitslag van de check")}: ${data.uitslag}${data.phpVersie ? `, PHP ${data.phpVersie}` : ""}` : "", data.vraag].filter(Boolean).join("\n");
      window.location.href = conceptLink(`Check-aanvraag: ${data.domein}`, tekst);
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
      {!kort && <h2>Vraag je gratis check aan.</h2>}
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
        <span>{staat === "bezig" ? "Versturen…" : kort ? "Verstuur" : "Vraag de gratis check aan"}</span>
        <span className="pc-knop-icoon" aria-hidden="true"><ArrowUpRight size={16} /></span>
      </button>
    </form>
  );
}

// 22 oktober 2026 (Marinus): twee grote knoppen naast elkaar, bij de uitslag en onderaan. "Plan een uitgebreide check" gaat
// naar de boekingspagina (soort "uitgebreide-check"), of opent tot die live is het korte formulier. "Neem contact op" opent
// het korte formulier: drie velden, domein al ingevuld, naar secure@socialnow.nl.
function Oproepen({ domein = "", uitslag, anker = false }: { domein?: string; uitslag?: Uitslag | null; anker?: boolean }) {
  const { language } = useLanguage();
  const [open, zetOpen] = useState<"" | "scan" | "contact">("");
  const plek = useRef<HTMLDivElement>(null);
  const boek = boekLink(language, domein, "uitgebreide-check");
  // socialnow.nl/check#aanvraag (ook /nl/check#aanvraag, de mailing linkt hierheen): het formulier voor de uitgebreide
  // check staat direct open en de pagina scrolt ernaartoe.
  useEffect(() => {
    if (!anker) return;
    const kijk = () => {
      if (window.location.hash !== "#aanvraag") return;
      zetOpen("scan");
      requestAnimationFrame(() => plek.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    };
    kijk();
    window.addEventListener("hashchange", kijk);
    return () => window.removeEventListener("hashchange", kijk);
  }, [anker]);
  const knop = (tekst: React.ReactNode) => (
    <><span>{tekst}</span><span className="pc-knop-icoon" aria-hidden="true"><ArrowUpRight size={16} /></span></>
  );
  return (
    <div className="pc-oproepen" id={anker ? "aanvraag" : undefined} ref={plek}>
      <div className="pc-oproep-knoppen">
        {boekExtern
          ? <a className="pc-knop pc-groot" href={boek} target="_blank" rel="noopener">{knop("Plan een uitgebreide check")}</a>
          : <button type="button" className="pc-knop pc-groot" aria-expanded={open === "scan"} onClick={() => zetOpen("scan")}>{knop("Plan een uitgebreide check")}</button>}
        <button type="button" className="pc-knop pc-knop-wit pc-groot" aria-expanded={open === "contact"} onClick={() => zetOpen("contact")}>{knop("Neem contact op")}</button>
      </div>
      {open && <Aanvraag kort telefoon={open === "scan"} soort={open === "scan" ? "uitgebreide-check" : "contact"} domein={domein} uitslag={uitslag} key={open} />}
    </div>
  );
}

// 22 oktober 2026 (Marinus): de uitlegfilm (HyperFrames) onder de uitslag. Klik om af te spelen, ondertitels in NL of EN,
// poster als voorbeeldbeeld; op mobiel de 9:16-versie. Ondertitels staan in het beeld, in NL of EN.
function Film() {
  const { language } = useLanguage();
  const [hoog, zetHoog] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 760px)");
    const kies = () => zetHoog(m.matches);
    kies();
    m.addEventListener("change", kies);
    return () => m.removeEventListener("change", kies);
  }, []);
  const vorm = hoog ? "9x16" : "16x9";
  // Tekst en ondertitels staan in het beeld zelf: Nederlands op /nl, Engels in alle andere talen.
  const nl = language === "nl" ? "-nl" : "";
  return (
    <section className="h-section h-wrap pc-film">
      <video
        key={vorm + nl}
        className={`pc-video pc-video-${vorm}`}
        controls
        playsInline
        preload="none"
        poster={`/websitecheck/film/poster-${vorm}${nl}.jpg`}
        aria-label="Uitlegfilm: zo werkt de websitecheck"
      >
        <source src={`/websitecheck/film/check-${vorm}${nl}.mp4`} type="video/mp4" />
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
  // Websiterapport onder de PHP-uitslag (feat/check-rapport): elke nieuwe check is een nieuwe ronde.
  const [ronde, zetRonde] = useState(0);

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
      else if (r.status === 429) zetHint(t("Veel checks vanaf jouw netwerk. Probeer het over een paar minuten nog eens."));
      else toon(j?.ok && j.uitslag ? j : { ok: true, domein: host, uitslag: "onbekend", phpVersie: null, code: "fout" });
    } catch {
      // Een check lukt altijd: ook als onze eigen functie niet antwoordt, krijgt de bezoeker een uitslag.
      toon({ ok: true, domein: host, uitslag: "onbekend", phpVersie: null, code: "fout" });
    } finally {
      zetBezig(false);
    }
  };

  // Teksten volgen de beslistabel in ONDERZOEK.md 5.2: rood alleen met bewijs, nooit "veilig".
  const tekst = (u: Uitslag) => {
    const w = { versie: u.phpVersie, fix: u.hersteldVanaf, domein: u.domein, release: u.release };
    const r = u.code || u.reden || "";
    if (u.uitslag === "groen") return {
      kop: t("Je PHP bevat de fix."),
      uitleg: invul(t(r === "ubuntu-hersteld"
        ? "We zien PHP {versie}, de herstelde build van {release}. Dit zegt niets over een eerdere inbraak, andere PHP-versies op dezelfde server, of dat alle PHP-processen opnieuw zijn gestart."
        : "We zien PHP {versie}. Dat is gelijk aan of nieuwer dan de herstelde versie. Dit zegt niets over een eerdere inbraak, andere PHP-versies op dezelfde server, of dat alle PHP-processen opnieuw zijn gestart."), w),
    };
    if (u.uitslag === "rood") return {
      kop: t("Je PHP is niet gepatcht."),
      uitleg: invul(t("Je server meldt PHP {versie}. De herstelde versie is {fix}. Werk het PHP-pakket bij, herstart PHP en laat controleren of er al misbruik is geweest. Wij doen dat gratis voor je."), w),
    };
    if (u.uitslag === "oranje") {
      if (r === "onder-de-fix-zonder-bewijs" || r === "el-leverancier-onder-fix") return {
        kop: t("Waarschijnlijk niet gepatcht."),
        uitleg: invul(t("Je server meldt PHP {versie}. De fix zit in {fix} en nieuwer. Sommige hosts patchen zonder het nummer te veranderen. Vraag je host schriftelijk of PHP is bijgewerkt voor CVE-2026-109618 en CVE-2026-109619, of laat het ons gratis uitzoeken."), w),
      };
      if (r === "doorverwijzing") return {
        kop: t("Je domein stuurt door."),
        uitleg: invul(t("Je domein stuurt door naar {naar}. Die server meldt PHP {versie}, zonder de fix. Of dat jouw server is, zien we van buitenaf niet. Laat het ons gratis uitzoeken."), { ...w, naar: u.doorverwezenNaar }),
      };
      if (r === "eol-alleen-via-host") return {
        kop: t("Verouderde PHP, vraag je host."),
        uitleg: invul(t("PHP {versie} krijgt geen officiële fix meer. Alleen een host of LTS-leverancier kan hem gepatcht hebben. Vraag het je host schriftelijk, of stap over op PHP 8.3 of nieuwer. We helpen je daar gratis mee."), w),
      };
      const oranje: Record<string, string> = {
        "tegenstrijdige-versies": "Je server noemt meer dan één PHP-versie. Daarom zeggen we liever niets dan iets verkeerds.",
        "geen-patchnummer": "Je server meldt PHP {versie}, zonder het laatste cijfer. Daaraan zien we niet of de fix erin zit.",
      };
      return {
        kop: t("Van buitenaf niet te zeggen."),
        uitleg: invul(t(oranje[r] || "Je server meldt PHP {versie} uit een pakket waarvan we de fixversie nog niet kennen. Zulke pakketten krijgen de fix vaak zonder dat het nummer verandert."), w) + " " + t("Laat ons handmatig kijken, dat is gratis."),
      };
    }
    // Onbekend, om welke reden ook (versie verborgen, geen PHP te zien, site onbereikbaar, onze functie faalde).
    return { kop: t("Je site schermt dit af."), uitleg: t("Plan een call in of vul het formulier in, dan nemen we contact met je op.") };
  };

  const LABEL: Record<string, string> = { groen: "Fix gezien", rood: "Niet gepatcht", oranje: "Twijfel", onbekend: "Afgeschermd" };

  const u = uitslag?.ok ? uitslag : null;
  const uitleg = u ? tekst(u) : null;
  const kleur = u?.uitslag || "onbekend";
  const gecheckt = u?.domein || normaliseerInvoer(domein);

  return (
    <div className="pc">
      <section className="pc-hero h-wrap">
        <p className="h-eyebrow pc-eyebrow"><i aria-hidden="true" /> Gratis php2shell-check</p>
        <h1 className="pc-kop">Is je website veilig?</h1>

        <form className="pc-check" onSubmit={start} noValidate>
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
            <span>{bezig ? "Bezig met de check…" : "Doe de gratis check"}</span>
            <span className="pc-knop-icoon" aria-hidden="true"><ArrowUpRight size={16} /></span>
          </button>
        </form>

        <div className="pc-uitslag-plek" aria-live="polite">
          {u && uitleg && (
            <div className={`pc-uitslag pc-${kleur}`} ref={uitslagRef} tabIndex={-1}>
              <p className="pc-label"><i aria-hidden="true" />{LABEL[kleur]}</p>
              <h2>{uitleg.kop}</h2>
              <p>{uitleg.uitleg}</p>
              {/* 22 oktober 2026 (Marinus): bovenaan bij de uitslag twee grote knoppen, zo snel en makkelijk mogelijk. */}
              <Oproepen domein={u.domein || ""} uitslag={u} />
              {(kleur === "rood" || kleur === "oranje") && (
                <div className="pc-eerst">
                  <h3>Doe dit eerst.</h3>
                  <Stappen aantal={3} domein={u.domein} />
                </div>
              )}
              {kleur !== "onbekend" && (
                <dl className="pc-gegevens">
                  <div><dt>Domein</dt><dd translate="no">{u.domein}</dd></div>
                  <div><dt>PHP-versie</dt><dd translate="no">{u.phpVersie || "-"}</dd></div>
                  <div><dt>Hersteld vanaf</dt><dd translate="no">{u.hersteldVanaf || "-"}</dd></div>
                </dl>
              )}
              <p className="pc-disclaimer">Deze check leest alleen openbare informatie van je website. Het is een snelle indicatie, geen volledige beveiligingsaudit en geen garantie. Wil je zekerheid? Plan een gratis call met ons team.</p>
              {/* 22 oktober 2026 (Marinus): onder de PHP-uitslag de vijf punten met echte data. */}
              {u.domein && <CheckRapport domein={u.domein} ronde={ronde} boek={boekLink(language, u.domein, "uitgebreide-check")} />}
            </div>
          )}
        </div>
      </section>

      <Film />

      {/* 22 oktober 2026 (Marinus): direct onder de uitslag. De volgorde telt, dus genummerd. */}
      <section className="h-section h-wrap pc-zelf" id="zelf">
        <h2 className="pc-sectiekop">Dit kun je zelf al doen.</h2>
        <Stappen domein={gecheckt} />
        <p className="pc-noot">De PHP-versie verbergen (<code translate="no">expose_php=Off</code>) maakt je minder zichtbaar, maar repareert niets.</p>
        <ol className="pc-bronnen">
          <li>PHP, ChangeLog 8, 21 oktober 2026. <a href="https://www.php.net/ChangeLog-8.php" target="_blank" rel="noopener">php.net</a></li>
          <li>NCSC (VK), Critical security issue affecting PHP, oktober 2026. <a href="https://www.ncsc.gov.uk/sites/default/files/2026-10/Critical-security-issue-affecting-PHP_2.pdf" target="_blank" rel="noopener">ncsc.gov.uk</a></li>
          <li>NSA-advies over php2shell, zoals gemeld door TweakTown, 22 oktober 2026. <a href="https://www.tweaktown.com/news/114213/nsa-warns-70-percent-of-websites-to-install-the-latest-php-patch-now-or-go-offline/index.html" target="_blank" rel="noopener">tweaktown.com</a></li>
        </ol>
      </section>

      {/* 22 oktober 2026 (Marinus): een witte sectie in het zwart, voor menselijkheid en vertrouwen; de zwarte delen tonen
          de data en de werking. Klein: hoe en wat we meten, als pdf in NL (Nederlands) of EN (alle andere talen). */}
      {DOCUMENTEN.length > 0 && (
        <section className="pc-documenten">
          <div className="h-wrap">
            <h2>Hoe en wat we meten.</h2>
            <ul className="pc-docs">
              {DOCUMENTEN.map((d) => (
                <li key={d.bestand}>
                  <a href={`/websitecheck/${d.bestand}-${language === "nl" ? "nl" : "en"}.pdf`} target="_blank" rel="noopener"><span>{d.naam}</span><small>PDF</small></a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

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

      <section className="h-section h-wrap pc-slot" id="contact">
        <h2 className="pc-sectiekop">Lukt het niet of wil je zekerheid?</h2>
        <p className="pc-intro">Wij doen de check en de updates gratis. Wil je dieper gaan, dan bespreken we de scope met je.</p>
        <Oproepen domein={gecheckt || vooraf} uitslag={u} anker />
      </section>
    </div>
  );
}
