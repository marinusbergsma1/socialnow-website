import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Bento, Tegel } from "./Bento";
import { DOEL, doelBevestigd } from "./doel-stand";
import { people } from "./content";
import { klein } from "./licht";
import { mailLink } from "./aanvragen";
import { useLanguage, LOCALES } from "./i18n/context";

// 3 oktober 2026 (Marinus): een doelmeter met einddoel een miljoen euro voor scholen in ontwikkelingslanden en om mensen te
// verbinden, voor werkgevers en werkzoekenden, met het hele team trots met eigen bedrijfsnaam. De Engelse regels zijn zijn
// eigen woorden en blijven in elke taal Engels (translate="no"). Bedrag, deelnemers en bestemming komen alleen uit
// proposal/doel-stand.ts. De sectie verschijnt in de productiebuild pas als DOEL.live aan staat (na akkoord van Marinus)
// en de stand bevestigd is; de CSS (doel.css) laadt met de andere latere secties in pages.tsx.
export default function Doel() {
  const { language, t } = useLanguage();
  if (!(DOEL.live && doelBevestigd) && !import.meta.env.DEV) return null;
  const locale = LOCALES[language].replace("_", "-");
  const euro = (bedrag: number) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(bedrag);
  const procent = DOEL.opgehaald === null ? 0 : Math.min(100, (DOEL.opgehaald / DOEL.einddoel) * 100);
  const datum = DOEL.bijgewerkt === null ? "" : new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${DOEL.bijgewerkt}T12:00:00`));
  const team = [...people].sort((a, b) => Number(Boolean(b.bedrijf)) - Number(Boolean(a.bedrijf)));
  return (
    <Bento
      id="doel"
      label="Ons doel"
      className="h-doel"
      titel={
        <>
          Een miljoen euro voor scholen.
          <br />
          <span>En voor verbinding.</span>
        </>
      }
    >
      <Tegel kop="Doelmeter" breed={8} soort="groen" className="h-doel-meter">
        <div className="h-doel-stand">
          {DOEL.opgehaald === null ? <strong className="is-volgt">Stand volgt</strong> : <strong translate="no">{euro(DOEL.opgehaald)}</strong>}
          <span>Einddoel <b translate="no">{euro(DOEL.einddoel)}</b></span>
        </div>
        <div
          className={`h-doel-balk${DOEL.opgehaald === null ? " is-leeg" : ""}`}
          role="progressbar"
          aria-label="Doelmeter"
          aria-valuemin={0}
          aria-valuemax={DOEL.einddoel}
          aria-valuenow={DOEL.opgehaald ?? undefined}
          aria-valuetext={DOEL.opgehaald === null ? t("Stand volgt") : `${euro(DOEL.opgehaald)} / ${euro(DOEL.einddoel)}`}
        >
          <i style={{ width: `${procent}%` }} />
        </div>
        <p className="h-doel-mensen" translate="no">
          {DOEL.deelnemers !== null && <b>{new Intl.NumberFormat(locale).format(DOEL.deelnemers)}</b>}{" "}
          {DOEL.deelnemers === null ? "People" : "people"} joining our cause by joining the new way of working. <span>Not another useless tool. How Steve Jobs intended compute to be.</span>
        </p>
        {doelBevestigd && <p className="h-doel-voet">{DOEL.bestemming} <span translate="no">· {datum}</span></p>}
      </Tegel>
      <Tegel kop="Waar het naartoe gaat" breed={4}>
        <h3 className="sn-tegel-titel">Scholen in ontwikkelingslanden.</h3>
        <p className="sn-tegel-tekst">Ons einddoel: scholen bouwen waar ze nodig zijn, en mensen met elkaar verbinden.</p>
      </Tegel>
      {/* 3 oktober 2026 (Marinus): "geen ONEERLIJK verdienmodel nodig ... ALTIJD GENOEG VERDIEND MET MIJN EIGEN KLANTEN ...
          SAMEN MET AI EN MENSEN WAARMEE IK DIT HEB OPGEBOUWD WAARDOOR IK 0 KOSTEN HEB OF MANAGEMENT LAGEN" en "ALLEEN MAAR
          MENSEN DIE KEIHARD WERKEN". Nul kosten of geen overhead staat er pas als Marinus dat bevestigt. */}
      <Tegel kop="Ons verdienmodel" breed={6} soort="geel" className="h-doel-eerlijk">
        <h3 className="sn-tegel-titel">Geen oneerlijk verdienmodel nodig.</h3>
        <p className="sn-tegel-tekst">Ik heb altijd genoeg verdiend met mijn eigen klanten. Ik werk samen met AI en met de mensen met wie ik dit heb opgebouwd. Geen managementlagen. Het OS is gratis.</p>
        <p className="h-doel-keihard">Alleen mensen die keihard werken en er klaar voor zijn.</p>
      </Tegel>
      <Tegel kop="Waarom ik alles automatiseer" breed={6}>
        <h3 className="sn-tegel-titel">Om juist de verbinding op te zoeken.</h3>
        <p className="sn-tegel-tekst">Ik automatiseer alles om tijd te maken voor de verbinding tussen creatives en ondernemers. Zo kies je zelf waar je de diepgang in gaat.</p>
      </Tegel>
      <Tegel kop="Trots op ons team" breed={12} className="h-doel-team">
        <ul className="h-doel-gezichten">
          {team.map((persoon) => (
            <li key={persoon.name}>
              <img {...klein(persoon.image, 56)} alt="" width="56" height="56" loading="lazy" />
              <span>
                <b translate="no">{persoon.name}</b>
                {persoon.bedrijf ? <em translate="no">{persoon.bedrijf}</em> : <i>{persoon.role}</i>}
              </span>
            </li>
          ))}
        </ul>
      </Tegel>
      <Tegel kop="In één week" breed={4} soort="blauw" className="h-doel-verdubbeld">
        <p className="h-doel-groot" translate="no">We doubled our team in a week.</p>
        <p className="sn-tegel-tekst">Het hele team, ieder trots op een eigen vak.</p>
        <div className="sn-tegel-onder">
          <Link className="h-text-link" to="/team">Maak kennis met ons team <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </Tegel>
      <Tegel kop="Doe mee" breed={4} className="h-doel-mee">
        <h3 className="sn-tegel-titel">Voor werkgevers en werkzoekenden.</h3>
        <p className="sn-tegel-tekst">Werk mee op de nieuwe manier en help het doel dichterbij te brengen.</p>
        <div className="sn-tegel-onder">
          <a className="os-claim sn-btn3d h-button" href={mailLink(t("Meedoen als werkgever"))}>
            <span className="sn-btn3d-sheen" />
            <span>Ik ben werkgever</span>
          </a>
          <Link className="sn-btn3d h-button h-button-secondary" to="/vacatures">
            <span className="sn-btn3d-sheen" />
            <span>Ik zoek werk</span>
          </Link>
          <Link className="h-text-link" to="/investeerders">
            Partner of investeerder
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </Tegel>
      <Tegel kop="Wat er komt" breed={4} soort="groen" className="h-doel-slot">
        <p className="h-doel-slotzin" translate="no">WE KNOW WHAT&rsquo;S COMING NOW. <span>AND IT&rsquo;S GOING TO BE SOCIAL!</span></p>
      </Tegel>
    </Bento>
  );
}
