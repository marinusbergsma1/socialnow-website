// Sleutelbelofte, 28 september 2026. Eén bron voor het homepageblok, /veiligheid en de noscript-versie.
//
// De koppen zijn letterlijk de kernzinnen uit de sleutelbelofte-pdf v1.0 (subchat a,
// veiligheidsbelofte-2026-09-28/pdf/kernzinnen.json, bronnen per belofte in pdf/bronnen.md, getoetst
// aan origin/os 022b065). De Engelse koppen in proposal/i18n/en.json zijn de Engelse kernzinnen uit
// hetzelfde bestand. De uitlegregels eronder blijven binnen die bronnen.
// Let op: voor Odoo, Meta, Google en LinkedIn is er geen ontkoppelknop in het OS (alleen de API);
// daarom "intrekken bij de bron". Alleen de socials-sleutel haal je in het OS zelf weg.
// Bewust niet: "wij kunnen er technisch niet bij", SOC 2, ISO 27001, "alle data in de EU".
// Wie deze zinnen wijzigt: ook de sleutels in proposal/i18n/en.json, de.json en fr.json bijwerken.
export const BELOFTES: { kop: string; tekst: string }[] = [
  { kop: "Je sleutels staan versleuteld per werkruimte.", tekst: "Versleuteld met AES-256-GCM, met een eigen sleutel per werkruimte." },
  { kop: "Niemand bij SocialNow ziet je sleutel.", tekst: "Niet in de app en niet in het beheerscherm. Hij gaat nooit terug naar de browser." },
  { kop: "Alleen gebruikt voor wat jij aanzet.", tekst: "We gebruiken je sleutel alleen voor de koppeling die jij aanzet, in jouw eigen werkruimte." },
  { kop: "Niets verandert zonder jouw akkoord.", tekst: "Het OS schrijft pas iets in je systemen na een voorstel dat jij goedkeurt. Elke actie staat in een logboek." },
  { kop: "Nooit in logs, nooit naar AI.", tekst: "Sleutels worden uit logbestanden gefilterd en gaan nooit mee in een vraag aan een AI-model." },
  { kop: "Intrekken kan altijd, bij de bron.", tekst: "Trek de sleutel in bij Odoo, Meta, Google of LinkedIn en de koppeling stopt. Je socials-sleutel haal je zelf weg in het OS." },
  { kop: "Een lek hoor je binnen 24 uur.", tekst: "Gaat er iets mis met jouw gegevens, dan melden we dat binnen 24 uur bij jou." },
];

export const STAPPEN: { kop: string; tekst: string }[] = [
  { kop: "Maak een aparte API-gebruiker", tekst: "Maak in Odoo, Meta, Google of LinkedIn een eigen gebruiker of sleutel voor het OS. Nooit je eigen inlog." },
  { kop: "Geef alleen de rechten die nodig zijn", tekst: "Beperk die gebruiker tot wat het OS moet lezen of doen. Meer is niet nodig." },
  { kop: "Plak de sleutel in het OS", tekst: "De sleutel gaat direct versleuteld de kluis in. Het OS laat daarna alleen zien of de koppeling werkt." },
  { kop: "Trek hem in wanneer je wilt", tekst: "Trek de sleutel in bij de bron, of vraag het ons via privacy@socialnow.nl. Jij houdt de regie." },
];

export type Taal = "nl" | "en";
export const pdfPad = (taal: Taal) => `/documenten/socialnow-sleutelbelofte-${taal}.pdf`;
export const videoPad = (taal: Taal, soort: "tv" | "45") => `/video/veiligheid/62-beveiliging-${taal}-${soort}.mp4`;
export const posterPad = (taal: Taal, soort: "tv" | "45") => `/video/veiligheid/62-beveiliging-${taal}-${soort}-poster.webp`;
