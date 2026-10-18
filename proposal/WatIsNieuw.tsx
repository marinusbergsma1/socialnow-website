import React from "react";
import { Bento, Tegel, BentoFilm } from "./Bento";
import { useLanguage } from "./i18n/context";
import "./wat-is-nieuw.css";

// 18 oktober 2026 (livegang OS): korte explainer "What's new in SocialNow OS" direct onder de explainer v6.
// Film: 04_OS-VIDEO/video-project/79-wat-is-nieuw, in de stijl van v6. /nl krijgt de Nederlandse versie (Nederlandse koppen
// en ondertitels), elke andere taal de Engelse. Alleen wat live staat onder "Nu live"; de betaalde functies staan uit en
// horen alleen in de laatste regel. Proef: scripts/check-explainer-nieuw.mjs.
const VERSIE = "20261018-nieuw";

export default function WatIsNieuw() {
  const { language } = useLanguage();
  const taal = language === "nl" ? "nl" : "en";
  return (
    <Bento id="wat-is-nieuw" label="Nieuw in SocialNow OS" titel={<>Wat is er nieuw.<br /><span>En hoe het werkt.</span></>}>
      <Tegel kop="Bekijk wat er nieuw is" breed={8} soort="film">
        <BentoFilm src={`/video/os/wat-is-nieuw-${taal}.mp4?v=${VERSIE}`} poster={`/video/os/wat-is-nieuw-${taal}-poster.jpg?v=${VERSIE}`} label="Wat is er nieuw in SocialNow OS" />
      </Tegel>
      <Tegel kop="Nu live" breed={4}>
        <ul className="sn-nieuw-lijst">
          <li><strong>Team uitnodigen.</strong> <span>Eén link, inloggen en je team is binnen.</span></li>
          <li><strong>Beginnen in één chat.</strong> <span>Sluit hem gerust, je gaat verder waar je was.</span></li>
          <li><strong>Je eigen AI.</strong> <span>Via MCP, CLI of API. Sleutels zijn standaard alleen lezen.</span></li>
          <li><strong>Sneller en veiliger.</strong> <span>Studio en dashboard laden vlotter en inloggen is beter beschermd.</span></li>
        </ul>
        <p className="sn-nieuw-binnenkort"><b>Binnenkort</b> <span>Advertentiebudget goedkeuren met Face ID en ads via agents.</span></p>
      </Tegel>
    </Bento>
  );
}
