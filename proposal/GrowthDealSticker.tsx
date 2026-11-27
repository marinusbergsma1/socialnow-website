import React from "react";

// 27 november 2026 (Marinus): "KNAL DEZE nog even groot linksboven", met "Zelfde verhaal op de homepage". De Growth Package Deal-sticker
// (07_MARKETING/BLACK-FRIDAY-20261126/growth-package-deal-stickers/growth-package-deal-01-pixel-explosie-milo.webp), transparant, groot
// linksboven in de kop van /gratis-website en van de homepage. Op de homepage linkt hij naar de deal.
export default function GrowthDealSticker({ naar }: { naar?: string }) {
  const beeld = <img className="sn-gpd-sticker" src="/images/growth-package-deal.webp" alt="Growth Package Deal" width="640" height="640" decoding="async" fetchPriority="high" />;
  return naar ? <a className="sn-gpd" href={naar} aria-label="Growth Package Deal: bekijk de deal">{beeld}</a> : <div className="sn-gpd">{beeld}</div>;
}
