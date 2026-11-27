import React, { useEffect, useState } from "react";
import { AmbientVideo, useMotion } from "./motion";

const POSTER = "/images/growth-package-deal.webp";
const LOOP = "/video/black-friday/growth-package-deal-loop";
const webm = [{ src: `${LOOP}.webm`, type: "video/webm" }];
const hevc = [{ src: `${LOOP}.mov`, type: 'video/mp4; codecs="hvc1"' }];

export default function GrowthDealSticker({ naar }: { naar?: string }) {
  const { reduced } = useMotion();
  const [safari, setSafari] = useState<boolean | null>(null);
  useEffect(() => {
    setSafari(/^((?!chrome|crios|fxios|edg|android).)*safari/i.test(navigator.userAgent));
  }, []);

  const beeld = reduced || safari === null
    ? <img className="sn-gpd-sticker" src={POSTER} alt="Growth Package Deal" width="640" height="640" decoding="async" fetchPriority="high" />
    : <AmbientVideo className="sn-gpd-sticker" poster={POSTER} label="Growth Package Deal" sources={safari ? hevc : webm} />;
  return naar ? <a className="sn-gpd" href={naar} aria-label="Growth Package Deal: bekijk de deal">{beeld}</a> : <div className="sn-gpd">{beeld}</div>;
}
