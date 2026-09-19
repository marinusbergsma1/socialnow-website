import { useEffect } from "react";

// Cookiebot — 19 september 2026.
//
// MARINUS VROEG: "misschien nog Cookiebot cookies als dat iets toevoegt."
//
// Het eerlijke antwoord op vandaag is: nog niet, en dit bestand legt uit waarom, zodat de
// afweging er staat op het moment dat het antwoord verandert.
//
// WAT COOKIEBOT TOEVOEGT
//   1. Bewijs. Het legt per bezoeker vast wat er gekozen is, wanneer, en welke tekst er stond.
//      Dat is wat een toezichthouder vraagt als er ooit een klacht komt: niet "wij vroegen het",
//      maar "hier staat dat deze bezoeker op dat moment ja zei tegen deze verklaring".
//   2. Een scanner die maandelijks de site doorloopt en meldt dat er een cookie bij is gekomen
//      die niet in de verklaring staat. Dat is precies de fout die je zelf niet ziet.
//   3. Automatisch blokkeren van scripts tot er toestemming is, op basis van een attribuut.
//
// WAAROM HET VANDAAG NOG NIETS TOEVOEGT
//   Er staat op socialnow.nl geen enkel script dat toestemming nodig heeft. Geen Analytics, geen
//   Meta-pixel, geen advertentiecookie. Wat er wel staat — taal, land, de keuze over meten — is
//   noodzakelijk in de zin van artikel 11.7a lid 3 Telecommunicatiewet en vraagt geen
//   toestemming. Cookiebot zou hier dus toestemming gaan vragen voor niets, daarvoor zelf een
//   cookie zetten, een extra verzoek naar een derde partij doen, en geld kosten. Een
//   toestemmingsbanner voor een site zonder trackers maakt de site slechter en niet
//   rechtmatiger.
//
// WANNEER HET WEL MOET, EN DAN METEEN
//   De dag dat er een Meta-pixel, een Google Ads-tag, een LinkedIn Insight Tag of Analytics op
//   deze site komt. Vanaf dat moment is er wel iets te blokkeren en wel iets te bewijzen.
//   Zet dan COOKIEBOT_ID hieronder op het domeingroep-id uit het Cookiebot-account, vul
//   script-src en connect-src in de CSP in index.html aan met https://consent.cookiebot.com en
//   https://consentcdn.cookiebot.com, en werk components/legal-cookies.ts bij: die verklaring
//   zegt nu uitdrukkelijk dat er geen trackers staan.
//
// Zolang COOKIEBOT_ID leeg is laadt dit onderdeel niets en staat er geen extra verzoek in het
// netwerkverkeer. Dat is met opzet: een uitgeschakelde integratie die toch iets ophaalt is het
// slechtste van twee werelden.
export const COOKIEBOT_ID = "";

export default function Cookiebot() {
  useEffect(() => {
    if (!COOKIEBOT_ID || document.getElementById("Cookiebot")) return;
    const s = document.createElement("script");
    s.id = "Cookiebot";
    s.src = "https://consent.cookiebot.com/uc.js";
    s.dataset.cbid = COOKIEBOT_ID;
    // "auto" blokkeert scripts zelf tot er toestemming is. Dat is het hele punt van Cookiebot;
    // zonder deze stand is het een banner zonder werking.
    s.dataset.blockingmode = "auto";
    s.type = "text/javascript";
    document.head.appendChild(s);
  }, []);
  return null;
}
