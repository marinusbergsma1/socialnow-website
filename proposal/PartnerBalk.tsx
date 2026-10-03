// 3 oktober 2026 (Marinus): "Mag dit in een witte balk? Dan valt het meer op." De partnerlogo's als doorlopende slider in een
// witte balk, direct onder het team in de hero. Eerst stond deze roze balk diep in Bereikt, waar niemand hem zag.
const PARTNERS = [
  { naam: "Salesforce", logo: "/images/partners/salesforce.svg", breed: 273, hoog: 191 },
  { naam: "Visa", logo: "/images/partners/betalen/visa.svg", breed: 24, hoog: 8 },
  { naam: "Mastercard", logo: "/images/partners/betalen/mastercard.svg", breed: 152, hoog: 94 },
  { naam: "Airwallex", logo: "/images/partners/betalen/airwallex.webp", breed: 960, hoog: 132 },
  { naam: "Adyen", logo: "/images/partners/betalen/adyen.svg", breed: 24, hoog: 8 },
  { naam: "Rabobank", logo: "/images/partners/betalen/rabobank.svg", breed: 54, hoog: 10 },
];

// Twee keer dezelfde rij achter elkaar; de lus schuift precies één rij op, dus de naad is niet te zien.
export default function PartnerBalk() {
  const rij = (kopie: boolean) => (
    <ul className="h-partners-rij" aria-hidden={kopie || undefined}>
      {PARTNERS.map((partner) => (
        <li key={partner.naam} className="h-partners-logo">
          <img src={partner.logo} alt={kopie ? "" : partner.naam} width={partner.breed} height={partner.hoog} loading="lazy" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="h-partners" translate="no">
      {/* 3 oktober 2026 (Marinus): "Kloppen deze wel?" Niet door Attesso bevestigd als partners, dus net als in de hero
          TALKING TO. En: "ZET ER OOK GROOT BIJ IN GESPREK MET RENÉ VAN DER ZEL. XXL NUTRITION." */}
      <p className="h-partners-balk">TALKING TO</p>
      <p className="h-partners-groot">René van der Zel <span>· XXL Nutrition</span></p>
      {/* 3 oktober 2026 (Marinus): "Zet ook nog Sid van Kalken currently talking to René van der Zel - to present at
          DAY1 event. A DREAM COME TRUE FOR YOUNG ENTREPENEURS LIKE US. TO INSPIRE!" */}
      <p className="h-partners-day1"><b>Sid van Kalken</b> is currently talking to René van der Zel to present at the <b>DAY1</b> event.</p>
      <p className="h-partners-droom">A DREAM COME TRUE FOR YOUNG ENTREPRENEURS LIKE US. TO INSPIRE!</p>
      <div className="h-partners-strook">
        <div className="h-partners-lus">{rij(false)}{rij(true)}</div>
      </div>
    </div>
  );
}
