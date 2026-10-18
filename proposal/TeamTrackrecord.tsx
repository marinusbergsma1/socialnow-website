import React from "react";
import { Bento, Tegel } from "./Bento";
import { people } from "./content";
import { klein } from "./licht";

// 18 oktober 2026 (Marinus): "Neem daarbij ook andere resultaten van mijn team mee." Er staan geen meetbare resultaten per
// teamlid in de repo, wel hun trackrecord: de merken waar ze voor werkten en hun eigen bedrijven. Bronnen, letterlijk:
// partnerReferences in content.ts en de door Marinus vastgelegde trackrecords (tak feat/trackrecords-20261007,
// docs/team-trackrecords-2026-10-07.md), Daniel via zijn rol in content.ts. Wie daar geen bron heeft, staat er niet in.
// Daarom heet de rij Trackrecord en niet Resultaten: een bedrijfsreferentie is geen klantresultaat.
type Merk = { naam: string; logo?: string; donker?: boolean; woordmerk?: string };
const M = {
  az: { naam: "AZ", logo: "/images/merken/AZ-LOGO-KLEUR.svg" },
  universal: { naam: "Universal", logo: "/images/merken/UNDER-ARMOUR-LOGO-1.webp", donker: true },
  alf: { naam: "Amsterdam Light Festival", logo: "/images/merken/AMSTERDAM-LIGHT-FESTIVAL-LOGO.webp", donker: true },
  axipoint: { naam: "Axipoint", logo: "/images/merken/axipoint.png" },
  socialytix: { naam: "Socialytix", logo: "/images/merken/socialytix.png", donker: true },
  byCarmel: { naam: "By Carmel", logo: "/images/merken/by-carmel.png" },
  studioSluis: { naam: "Studio Sluis" },
  goodlife: { naam: "Goodlife Marketing", logo: "/images/merken/goodlife-marketing.png", donker: true },
  stramark: { naam: "Stramark" },
  oliverJames: { naam: "Oliver James" },
  attesso: { naam: "Attesso", woordmerk: "~/attesso" },
  bytechat: { naam: "ByteChat", logo: "/images/merken/bytechat.svg" },
  bytevision: { naam: "ByteVision", logo: "/images/merken/bytevision.png" },
  komen: { naam: "Komen Consultancy", logo: "/images/merken/komen-consultancy.webp" },
  abnAmro: { naam: "ABN AMRO", logo: "/images/merken/abn-amro.svg" },
  fincer: { naam: "Fincer", logo: "/images/merken/fincer.png" },
  femke: { naam: "Femke’s Fotografie", logo: "/images/merken/femkes-fotografie.webp" },
  bruggn: { naam: "Bruggn Design", logo: "/images/merken/bruggn-design.png" },
  rechtdoorzee: { naam: "Rechtdoorzee Coaching", logo: "/images/merken/rechtdoorzee.webp", donker: true },
  pepijn: { naam: "Pepijn Bos", logo: "/images/merken/pepijn-bos.svg" },
  creatorCode: { naam: "Creator Code", logo: "/images/merken/creator-code.webp" },
} satisfies Record<string, Merk>;

const TRACKRECORD: Array<[string, Merk[]]> = [
  ["Marinus Bergsma", [M.az, M.universal, M.alf]],
  ["Jos Hollenberg", [M.axipoint]],
  ["Sergio Jovovic", [M.socialytix]],
  ["Nick van Keulen", [M.goodlife, M.stramark]],
  ["Steven Goudsblom", [M.abnAmro, M.fincer]],
  ["Elian Coellar", [M.oliverJames]],
  ["Sid van Kalken", [M.attesso]],
  ["Douwe Kramer", [M.attesso, M.bytechat, M.bytevision]],
  ["Steef Komen", [M.komen]],
  ["Michelle Yang", [M.komen]],
  ["Carmel Boon", [M.byCarmel]],
  ["Sam van der Sluis", [M.studioSluis]],
  ["Femke Oostendorp", [M.femke]],
  ["Armando van Bruggen", [M.bruggn]],
  ["Pepijn Bos", [M.pepijn]],
  ["Isaak Munster", [M.rechtdoorzee]],
  ["Daniel Schotman", [M.creatorCode]],
];

function Merkteken({ merk }: { merk: Merk }) {
  return <li className={merk.donker ? "is-donker" : undefined}>
    {merk.logo ? <img src={merk.logo} alt={merk.naam} width="110" height="24" loading="lazy" decoding="async" />
      : <span className={merk.woordmerk ? "is-woordmerk" : undefined}>{merk.woordmerk ?? merk.naam}</span>}
  </li>;
}

export default function TeamTrackrecord() {
  const rij = TRACKRECORD.flatMap(([naam, merken]) => { const p = people.find((x) => x.name === naam); return p ? [{ p, merken }] : []; });
  return (
    <Bento id="team-trackrecord" className="sn-team-trackrecord" label="Trackrecord van ons team" swipe>
      {rij.map(({ p, merken }) => (
        <Tegel key={p.name} breed={3} className="sn-trackrecord-tegel">
          <div className="sn-trackrecord-wie">
            <img {...klein(p.image, 56, [96, 160], undefined, "20261015-team")} alt={p.name} width="56" height="56" loading="lazy" />
            <p><b translate="no">{p.name}</b><span>{p.role}</span></p>
          </div>
          <ul className="sn-trackrecord-merken" translate="no">{merken.map((m) => <Merkteken key={m.naam} merk={m} />)}</ul>
        </Tegel>
      ))}
    </Bento>
  );
}
