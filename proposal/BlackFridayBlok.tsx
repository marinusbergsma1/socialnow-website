import React, { useEffect, useState } from "react";

// 27 november 2026 (Marinus): "Ik wil graag ook hier de contentsliders etc BLACK FRIDAY LOGO met een countdown timer." Einde gekozen door
// Marinus: 31 december 23:59 (in de film zegt hij "heel december"). Vervangt op /gratis-website de twee websitetegels.
const EINDE = new Date("2026-12-31T23:59:59+01:00").getTime();
const RIJ_WERK = [
  { src: "/images/AZ-Boadu-Bedankt-Post.webp", alt: "AZ: Bedankt-post" },
  { src: "/images/C4-FEED-30-korting.webp", alt: "C4: kortingscampagne" },
  { src: "/images/AZ-25-K-Volgers-Post.webp", alt: "AZ: 25K volgers" },
  { src: "/images/AZ-Champions-Leageu-Header.webp", alt: "AZ: Champions League-header" },
  { src: "/images/Bannert.webp", alt: "Campagnebeeld" },
];
const RIJ_SITES = [
  { src: "/screenshots/newblack-hero.webp", alt: "Website NEW BLACK" },
  { src: "/screenshots/divine-machines-hero.webp", alt: "Website Divine Machines" },
  { src: "/images/cases/vastiq-desktop.webp", alt: "Website VASTIQ" },
  { src: "/screenshots/kwhgarant-hero.webp", alt: "Website kWh Garant" },
  { src: "/images/cases/ilgordo-desktop.webp", alt: "Website Il Gordo" },
  { src: "/screenshots/vdz-brigade-hero.webp", alt: "Website De Verduurzaming Brigade" },
];

function Rij({ beelden, soort }: { beelden: { src: string; alt: string }[]; soort: "werk" | "sites" }) {
  // Twee gelijke sets; de baan schuift precies één set op, zodat de loop naadloos is. De tweede set is voor schermlezers verborgen.
  return <div className={`gw2-bf-rij is-${soort}`}>
    <ul className="gw2-bf-baan">
      {[0, 1].flatMap(set => beelden.map(b => <li key={`${set}-${b.src}`} aria-hidden={set > 0 || undefined}>
        <img src={b.src} alt={set > 0 ? "" : b.alt} decoding="async" /></li>))}
    </ul>
  </div>;
}

const twee = (n: number) => String(n).padStart(2, "0");

export default function BlackFridayBlok() {
  // Pas na het laden rekenen: de prerender toont streepjes, zo ontstaat geen verschil tussen server- en browser-HTML.
  const [nu, zetNu] = useState<number | null>(null);
  useEffect(() => {
    zetNu(Date.now());
    const t = window.setInterval(() => zetNu(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const rest = nu === null ? null : Math.max(0, EINDE - nu);
  const delen = rest === null ? null : [
    Math.floor(rest / 86_400_000), Math.floor(rest / 3_600_000) % 24, Math.floor(rest / 60_000) % 60, Math.floor(rest / 1000) % 60,
  ];
  const labels = ["Dagen", "Uren", "Min", "Sec"];
  return <div className="gw2-bf">
    <div className="gw2-bf-merk">
      <img src="/images/Social-Now-Logo-Breed-Wit.webp" alt="SocialNow" width="1920" height="433" />
      <span className="gw2-bf-deal">BLACK FRIDAY DEAL</span>
    </div>
    <div className="gw2-bf-klok" role="timer" aria-label="Tijd tot het einde van de Black Friday Deal">
      {labels.map((l, i) => <div key={l} className="gw2-bf-vak">
        <strong>{delen ? (i === 0 ? delen[i] : twee(delen[i])) : "--"}</strong><small>{l}</small>
      </div>)}
    </div>
    <p className="gw2-bf-tot">Loopt tot en met 31 december.</p>
    <Rij beelden={RIJ_WERK} soort="werk" />
    <Rij beelden={RIJ_SITES} soort="sites" />
  </div>;
}
