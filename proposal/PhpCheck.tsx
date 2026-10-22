import React, { useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { languagePrefix, useLanguage } from "./i18n/context";
import { CONTACT_MAIL, boekExtern, boekLink, conceptLink } from "./aanvragen";
import "./php-check.css";

// Gratis php2shell-check op /check (22 oktober 2026, Marinus): "Take the free check at socialnow.nl". De advertentie
// stuurt alle bezoekers hierheen; /php-check verwijst door (vercel.json).
// De check zelf draait in api/php-check.js (server/php-check.mjs): één gewone GET op de homepage,
// passief, niets bewaard. Deze pagina belooft daarom nooit "veilig": groen betekent alleen dat de
// versie die de server laat zien de fix bevat. Bij twijfel zegt de check "onbekend" en bieden we
// een handmatige check aan. Die aanvraag loopt zoals elke aanvraag op de site: een ingevuld
// concept naar Steef (proposal/aanvragen.ts), dus ook daar slaat de site zelf niets op.

const ENDPOINT = "/api/php-check";

type Uitslag = {
  ok: boolean;
  domein?: string;
  uitslag?: "rood" | "oranje" | "groen" | "onbekend";
  reden?: string;
  phpVersie?: string | null;
  hersteldVanaf?: string | null;
  release?: string | null;
  bron?: string | null;
  platform?: string | null;
};

function invul(tekst: string, waarden: Record<string, string | number | undefined | null>) {
  return tekst.replace(/\{(\w+)\}/g, (_, k) => String(waarden[k] ?? ""));
}

export function PhpCheckPage() {
  const { t, language } = useLanguage();
  const [domein, zetDomein] = useState("");
  const [toestemming, zetToestemming] = useState(false);
  const [bezig, zetBezig] = useState(false);
  const [fout, zetFout] = useState("");
  const [uitslag, zetUitslag] = useState<Uitslag | null>(null);
  const [aanvraag, zetAanvraag] = useState<"open" | "verstuurd">("open");
  const [aanvraagFout, zetAanvraagFout] = useState("");
  const uitslagRef = useRef<HTMLDivElement>(null);

  const FOUTEN: Record<string, string> = {
    leeg: "Vul een domein in, bijvoorbeeld jouwbedrijf.nl.",
    ongeldig: "Dat domein klopt nog niet. Vul het in zoals jouwbedrijf.nl.",
    ip: "Vul een domeinnaam in, geen IP-adres.",
    poort: "Vul alleen het domein in, zonder poortnummer.",
    intern: "Dit adres kunnen we niet controleren: het wijst naar een intern netwerk.",
    toestemming: "Vink aan dat dit je eigen website is of dat je toestemming hebt.",
    limiet: "Je hebt net een paar checks gedaan. Probeer het over tien minuten nog eens.",
    "limiet-domein": "Dit domein is net gecontroleerd. Probeer het over een halve minuut nog eens.",
    herkomst: "De check werkt alleen vanaf socialnow.nl.",
  };

  const start = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    zetFout("");
    if (!domein.trim()) return zetFout(t(FOUTEN.leeg));
    if (!toestemming) return zetFout(t(FOUTEN.toestemming));
    zetBezig(true);
    zetUitslag(null);
    try {
      const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domein: domein.trim(), toestemming: true }) });
      const j: Uitslag = await r.json().catch(() => ({ ok: false, reden: "fout" }));
      if (!j.ok) zetFout(t(FOUTEN[j.reden || ""] || "De check lukte niet. Probeer het zo nog eens."));
      else {
        zetUitslag(j);
        requestAnimationFrame(() => uitslagRef.current?.focus());
      }
    } catch {
      zetFout(t("De check lukte niet. Probeer het zo nog eens."));
    } finally {
      zetBezig(false);
    }
  };

  // Teksten volgen de beslistabel in ONDERZOEK.md 5.2: rood alleen met bewijs, nooit "veilig".
  const tekst = (u: Uitslag) => {
    const w = { versie: u.phpVersie, fix: u.hersteldVanaf, domein: u.domein, release: u.release, platform: u.platform ? t(u.platform) : "" };
    const r = u.reden || "";
    const handmatig = t("Laat ons handmatig kijken, dat is gratis.");
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
        uitleg: invul(t(oranje[r] || "Je server meldt PHP {versie} uit een pakket waarvan we de fixversie nog niet kennen. Zulke pakketten krijgen de fix vaak zonder dat het nummer verandert."), w) + " " + handmatig,
      };
    }
    if (r === "versie-verborgen") return {
      kop: t("We zien PHP, maar niet welke versie."),
      uitleg: t("Je server verbergt de PHP-versie. Dat is prima, maar daardoor zien wij van buitenaf niet of de fix erin zit.") + " " + handmatig,
    };
    if (r === "geen-php-gezien") return {
      kop: t("Geen PHP zichtbaar."),
      uitleg: (u.platform ? invul(t("Je homepage draait op {platform}."), w) + " " : "") + t("We zien aan de buitenkant geen PHP. Dat betekent niet dat er nergens PHP draait, bijvoorbeeld achter een proxy of op een ander subdomein."),
    };
    if (r === "onbereikbaar-dns") return { kop: t("We vinden dit domein niet."), uitleg: invul(t("We konden {domein} niet opzoeken. Klopt het adres?"), w) };
    if (r === "onbereikbaar-intern") return { kop: t("Dit adres controleren we niet."), uitleg: t("Dit domein wijst naar een intern netwerk. Dat controleren we niet vanaf internet.") };
    return {
      kop: t("We konden je site niet lezen."),
      uitleg: invul(t("We kregen geen bruikbaar antwoord van {domein}. Probeer het later nog eens."), w) + " " + handmatig,
    };
  };

  const LABEL: Record<string, string> = { groen: "Fix gezien", rood: "Niet gepatcht", oranje: "Twijfel", onbekend: "Onbekend" };

  const vraagAan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const w = (k: string) => String(f.get(k) || "").trim();
    zetAanvraagFout("");
    if (!w("naam")) return zetAanvraagFout(t("Vul je naam in."));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(w("email"))) return zetAanvraagFout(t("Dat e-mailadres klopt nog niet."));
    if (!w("website")) return zetAanvraagFout(t("Vul je website in."));
    const uitkomst = uitslag?.ok && uitslag.domein ? `${uitslag.domein}: ${uitslag.uitslag}${uitslag.phpVersie ? `, PHP ${uitslag.phpVersie}` : ""}${uitslag.reden ? ` (${uitslag.reden})` : ""}` : "-";
    const bericht = [
      t("Ik wil een gratis handmatige php2shell-check en updates."),
      "",
      `${t("Naam")}: ${w("naam")}`,
      `${t("E-mail")}: ${w("email")}`,
      `${t("Website")}: ${w("website")}`,
      w("mobiel") ? `${t("Telefoon")}: ${w("mobiel")}` : "",
      w("hosting") ? `${t("Hosting")}: ${w("hosting")}` : "",
      `${t("Uitslag van de check")}: ${uitkomst}`,
      w("vraag") ? `\n${w("vraag")}` : "",
      "",
      `(${language}, socialnow.nl/php-check)`,
    ].filter((r) => r !== "").join("\n");
    window.location.href = conceptLink(t("Gratis php2shell-check"), bericht);
    zetAanvraag("verstuurd");
  };

  const u = uitslag?.ok ? uitslag : null;
  const uitleg = u ? tekst(u) : null;
  const kleur = u?.uitslag || "onbekend";
  const boek = boekLink(language, u?.domein || domein.trim());
  const pre = languagePrefix(language);
  const boekDoel = boekExtern ? { target: "_blank", rel: "noopener" } : {};

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
              aria-describedby="pc-check-uitleg"
            />
          </label>
          <label className="pc-vink">
            <input type="checkbox" checked={toestemming} onChange={(e) => zetToestemming(e.target.checked)} />
            <span className="pc-vinkje" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
            <span>Dit is mijn website, of ik heb toestemming om hem te laten controleren.</span>
          </label>
          {fout && <p className="pc-fout" role="alert">{fout}</p>}
          <button className="pc-knop" type="submit" disabled={bezig}>
            <span>{bezig ? "Bezig met de check…" : "Doe de gratis check"}</span>
            <span className="pc-knop-icoon" aria-hidden="true"><ArrowUpRight size={16} /></span>
          </button>
          <p className="pc-klein" id="pc-check-uitleg">Eén gewone GET op je homepage. Geen aanval, geen scan, we bewaren niets.</p>
        </form>

        <div className="pc-uitslag-plek" aria-live="polite">
          {u && uitleg && (
            <div className={`pc-uitslag pc-${kleur}`} ref={uitslagRef} tabIndex={-1}>
              <p className="pc-label"><i aria-hidden="true" />{LABEL[kleur]}</p>
              <h2>{uitleg.kop}</h2>
              <p>{uitleg.uitleg}</p>
              <dl className="pc-gegevens">
                <div><dt>Domein</dt><dd translate="no">{u.domein}</dd></div>
                <div><dt>PHP-versie</dt><dd translate="no">{u.phpVersie || "-"}</dd></div>
                <div><dt>Hersteld vanaf</dt><dd translate="no">{u.hersteldVanaf || "-"}</dd></div>
              </dl>
              {/* 22 oktober 2026 (Marinus): bij elke uitslag dezelfde disclaimer en de boekknop. */}
              <div className="pc-disclaimer">
                <p>Deze check leest alleen openbare informatie van je website. Het is een snelle indicatie, geen volledige beveiligingsaudit en geen garantie. Wil je zekerheid? Plan een gratis call met ons team.</p>
                <div className="pc-knoppen">
                  <a className="pc-knop" href={boek} {...boekDoel}>
                    <span>Plan een gratis call</span>
                    <span className="pc-knop-icoon" aria-hidden="true"><ArrowUpRight size={16} /></span>
                  </a>
                  <a className="pc-knop pc-knop-wit" href="#handmatig">
                    <span>{kleur === "rood" ? "Laat ons gratis updaten" : "Vraag de gratis check aan"}</span>
                    <span className="pc-knop-icoon" aria-hidden="true"><ArrowUpRight size={16} /></span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="h-section h-wrap">
        <h2 className="pc-sectiekop">Drie niveaus van zekerheid.</h2>
        <ol className="pc-tegels">
          <li>
            <span>01 / Gratis en direct</span>
            <h3>Publieke scan.</h3>
            <p>Wat je hierboven doet. We lezen de PHP-versie die je server zelf aan iedere bezoeker laat zien. Snel, maar alleen zo zeker als wat je server openbaar maakt.</p>
          </li>
          <li>
            <span>02 / Na eigendomsbewijs</span>
            <h3>Verdiepte scan.</h3>
            <p>Je bewijst dat de site van jou is met een klein PHP-bestand dat alleen de versie, SAPI en builddatum teruggeeft, of met een DNS TXT-record. Dan lezen we de exacte versie, ook als je server die verbergt.</p>
          </li>
          <li>
            <span>03 / Door ons team</span>
            <h3>Audit.</h3>
            <p>Een specialist kijkt in de pakketchangelog van je server of vraagt je host om een schriftelijke bevestiging. Alleen zo is een teruggezette fix echt te bewijzen.</p>
          </li>
        </ol>
        <p className="pc-intro pc-onder">We doen de check en de updates gratis. Wil je dieper gaan, dan bespreken we de scope met je.</p>
      </section>

      <section className="h-section h-wrap pc-wat">
        <h2 className="pc-sectiekop">Wat is php2shell?</h2>
        <div className="pc-kolommen">
          <p>Op 21 oktober 2026 werden twee ernstige lekken in PHP bekend, CVE-2026-109618 en CVE-2026-109619. Via een gewoon verzoek kan een aanvaller zonder in te loggen code op een server uitvoeren. De fix zit in PHP 8.5.12, 8.4.27, 8.3.36 en 8.2.35. PHP 8.1 en ouder krijgen geen officiële fix meer.</p>
          <p>Het raakt veel websites: ongeveer 70% van de websites waarvan de servertaal bekend is, draait op PHP.<sup>1</sup> Overheden in Nederland, Duitsland, Finland, België en Frankrijk haalden websites offline, net als de Wikimedia Foundation.<sup>2</sup> Ook Nintendo zette diensten uit.<sup>3</sup></p>
        </div>
        <ol className="pc-bronnen">
          <li>W3Techs, gebruik van servertalen, stand augustus 2026. <a href="https://w3techs.com/technologies/details/pl-PHP" target="_blank" rel="noopener">w3techs.com</a></li>
          <li>The Next Web, 21 oktober 2026. <a href="https://thenextweb.com/news/europe-governments-websites-offline-php-security-flaws" target="_blank" rel="noopener">thenextweb.com</a></li>
          <li>The Record, 21 oktober 2026. <a href="https://therecord.media/php-script-vulnerabilities-warnings" target="_blank" rel="noopener">therecord.media</a></li>
        </ol>
      </section>

      <section className="h-section h-wrap pc-data">
        <h2 className="pc-sectiekop">Zo gaan we met je data om.</h2>
        <div className="pc-kolommen">
          <p>Bij SocialNow werkt AI samen met echte specialisten. De check zelf bewaart niets: geen domein, geen uitslag, geen profiel. Je IP-adres telt alleen tien minuten mee in het geheugen, zodat niemand de check misbruikt om sites te bestoken.</p>
          <p>Vraag je een handmatige check aan, dan zien alleen de mensen die hem uitvoeren je gegevens, en alleen voor deze check. Lees meer op onze pagina over <a href={`${pre}/veiligheid`}>veiligheid</a> en in ons <a href={`${pre}/privacy`}>privacybeleid</a>.</p>
        </div>
        <div className="pc-faq">
          <details>
            <summary>Wat ziet de scan wel en niet?</summary>
            <p>We doen één gewone GET op je homepage, zoals een browser, en volgen tot vijf redirects. We lezen de headers, de cookies en de HTML van die pagina. We proberen geen aanval, scannen geen poorten en openen geen andere paden. Wat je server niet openbaar maakt, zien wij ook niet.</p>
          </details>
          <details>
            <summary>Waarom krijg ik "onbekend"?</summary>
            <p>Veel servers verbergen hun PHP-versie, en dat is verstandig. Dan kunnen wij van buitenaf niet zien of de fix erin zit. De verdiepte scan of een audit door ons team geeft dan uitsluitsel.</p>
          </details>
          <details>
            <summary>Wat betekent oranje?</summary>
            <p>Je server meldt een versie onder de fix, maar zonder bewijs dat hij kwetsbaar is. Sommige hosts zetten de fix terug en houden het oude nummer. Waarschijnlijk is hij niet gepatcht: laat je host het schriftelijk bevestigen.</p>
          </details>
          <details>
            <summary>Is groen een garantie?</summary>
            <p>Nee. Groen betekent dat de versie die je server laat zien de fix bevat. Het zegt niets over een eerdere inbraak, andere PHP-versies op dezelfde server of de rest van je website.</p>
          </details>
        </div>
      </section>

      <section className="h-section h-wrap pc-handmatig" id="handmatig">
        <div className="pc-handmatig-tekst">
          <h2 className="pc-sectiekop">Gratis handmatige check en updates.</h2>
          <p className="pc-intro">We doen de check en de updates gratis. Wil je dieper gaan, dan bespreken we de scope met je.</p>
          <ul className="pc-lijst">
            <li>We kijken zelf naar je server en je PHP-pakket</li>
            <li>We zetten de update klaar of voeren hem uit</li>
            <li>Je hoort binnen twee werkdagen van ons</li>
          </ul>
          <a className="pc-knop" href={boek} {...boekDoel}>
            <span>Plan een gratis call</span>
            <span className="pc-knop-icoon" aria-hidden="true"><ArrowUpRight size={16} /></span>
          </a>
        </div>
        {aanvraag === "verstuurd" ? (
          <div className="pc-formulier">
            <h2>Je aanvraag staat klaar.</h2>
            <p>Je mailprogramma opent met je aanvraag erin. Druk daar op versturen.</p>
            <p className="pc-klein">
              Opent er niets? Mail dan naar <a href={`mailto:${CONTACT_MAIL}`} translate="no">{CONTACT_MAIL}</a>.
            </p>
          </div>
        ) : (
          <form className="pc-formulier" onSubmit={vraagAan} noValidate>
            <h2>Vraag je gratis check aan.</h2>
            <div className="pc-rij">
              <label>Je naam<input name="naam" autoComplete="name" placeholder="Voor- en achternaam" /></label>
              <label>E-mail<input name="email" type="email" autoComplete="email" placeholder="naam@bedrijf.nl" /></label>
            </div>
            <div className="pc-rij">
              <label>Website<input name="website" autoComplete="url" placeholder="jouwbedrijf.nl" defaultValue={u?.domein || domein} key={u?.domein || "leeg"} /></label>
              <label>Telefoon<input name="mobiel" type="tel" autoComplete="tel" placeholder="Optioneel" /></label>
            </div>
            <label>Waar staat je website?<input name="hosting" placeholder="Optioneel, bijvoorbeeld Hostinger of TransIP" /></label>
            <label>Wil je nog iets kwijt?<textarea name="vraag" rows={3} maxLength={1000} placeholder="Optioneel" /></label>
            {aanvraagFout && <p className="pc-fout" role="alert">{aanvraagFout}</p>}
            <button className="pc-knop" type="submit">
              <span>Vraag de gratis check aan</span>
              <span className="pc-knop-icoon" aria-hidden="true"><ArrowUpRight size={16} /></span>
            </button>
            <p className="pc-klein">
              Je aanvraag gaat als e-mail naar ons team. We gebruiken je gegevens alleen voor deze check. Lees ons <a href={`${pre}/privacy`}>privacybeleid</a>.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
