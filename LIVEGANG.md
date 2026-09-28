# Livegang socialnow.nl

Gedeelde werkmap voor alle chats die aan socialnow.nl werken.
Map: `/Volumes/WORK/02-SOCIALNOW/01_WEBSITE/socialnow-livegang`, tak `livegang`.
Een orkestratielaag neemt `livegang` over naar `main`. Een push naar `main` publiceert direct via GitHub Pages.

## Afspraken

| Regel | Waarom |
|---|---|
| Werk op tak `livegang` in deze map, of in een eigen featuretak vanaf `livegang` | één plek waar alles samenkomt |
| Controleer vóór elke commit: `git fetch`, tak, HEAD, `git status` | andere chats schrijven in dezelfde map |
| Commit alleen je eigen paden: `git commit -- <paden>` | geen werk van anderen meenemen |
| Nooit `public/documenten/*.pdf` meecommitten na `npm run build` | de build schrijft die bestanden opnieuw |
| Nieuwe teksten ook in `proposal/i18n/en.json`, `de.json`, `fr.json` | de site draait in meerdere talen |
| Publiceren naar `main` doet alleen de orkestratielaag | gecontroleerde livegang |
| Werk je eigen regel in de tabel hieronder bij | de orkestratie ziet wie waaraan werkt |
| Homepage-secties zijn bentogrids: gebruik `proposal/Bento.tsx` (`Bento`, `Tegel`, `BentoFilm`) en `proposal/bento.css`. Kort kopje met groene stip boven elke tegel, weinig tekst per tegel, tegels in wisselende maten (breed 3, 4, 6, 8 of 12), pillen van de hero. Geen eigen sectiekoppen of volle-breedte-tekstblokken meer. Uitleg bovenin `proposal/Bento.tsx` | één tegeltaal zoals het landingsscherm (Marinus, 28 sep: "net zoals de homepage wanneer je daarop landt") |

## Wie werkt waaraan

| Chat | Onderdeel | Stand |
|---|---|---|
| Teamstrook, prijzen en team (sessie 5c900cd2) | teamstrook, /prijzen (OS op maat vanaf €10.000, pakketten +€2.000), /team (bedankje partners, Head of-functies, system experts) | live in main 3e18ff4; wacht op namen en logo's van de partnerbedrijven |
| Website header: persoonlijk verhaal en Odoo product (regie homepage-upgrade, sessie 5c0f2f30) | homepage met storytelling: verhaal met tijdlijn onder de hero, partner-CTA met Michelle, scrollfix live sites, volgorde van de secties; bestanden `proposal/pages.tsx` (Home), `proposal/Verhaal.tsx`, `proposal/Deuren.tsx`, `proposal/LiveWebsites.tsx`, `proposal/experience.css`; featuretak `feat/verhaal-homepage` vanaf `livegang`. Werkorder: `~/Downloads/website-verhaal-2026-09-28/WERKORDER.md` | **klaar voor main (ronde 1):** `feat/verhaal-homepage` fc04f8d (bevat livegang 1867489). Plaatsing bij samenvoegen: `<MensEnAI />` na `<LiveWebsites />`, veiligheidsblok daarna, beide vóór "Four faces". Volgende rondes: film, cases, audit |
| Verhaalfilm (hulpchat van de homepage-regie, chip) | HyperFrames-film van het verhaal, EN en NL; alleen `public/video/verhaal/*`; tak `claude/verhaalfilm` | wacht op start |
| Cases Il Gordo en VASTIQ (hulpchat van de homepage-regie, chip) | nieuwe case-kaarten; `proposal/FeaturedWork.tsx`, `data/projects.ts`, `public/images/cases/*`, `proposal/cases.css`; tak `claude/cases-ilgordo` | wacht op start |
| Site-audit op het verhaal (hulpchat van de homepage-regie, chip) | pagina's buiten de homepage in lijn met het verhaal, functie Michelle; tak `claude/site-visie`; stemt /team af met de teamchat | wacht op start |
| Veiligheidsbelofte hoofdchat, websitesubchat "Zet veiligheidsvideo en belofte prominent op socialnow.nl" | proposal/Veiligheid.tsx plus eigen CSS, pagina /veiligheid, public/video/veiligheid/, sleutelbelofte-PDF nl/en; blok op de homepage na Mens en AI/Vacatures, vóór "Four faces" | live in main 1e49d3b |
| Sitebrede bentogrid (eigenaar: homepage-regie, sessie 5c0f2f30) | alle homepage-secties als kleine bentogrids zoals het landingsscherm; één gedeelde tegelklasse die alle websitechats gebruiken | bezig: gedeelde tegeltaal staat op livegang (`proposal/Bento.tsx`, `proposal/bento.css`); de homepage-regie zet verhaal, deuren, live sites, OS en See it in motion om op `feat/verhaal-homepage`. Cases, Veiligheid en Mens en AI/Vacatures zetten hun eigen blok om met dezelfde klassen |
| Indeed en vacatures (sessie e5c17002) | Indeed-begeleiding Marinus (hij plaatst zelf, geen account of login door Claude) | referentietak `claude/vacatures` (niet naar main); functie AI-expert betalingen en bentotegel overgedragen aan `feat/ai-mens` |
| Mens en AI plus vacatures (sessie 9c8d11dd) | homepagesectie `proposal/MensEnAI.tsx` en daaronder `proposal/VacaturesBento.tsx` (Wij zoeken: AI-expert betalingen groot, partner verbindende laag en Senior AI Engineer klein, balk Alle vacatures), direct na ShowcaseFilms; pagina `/vacatures` met elf functies uit `proposal/vacatures.ts` plus JobPosting voor Google, footerlink, `docs/vacatures-indeed.md`; eigen CSS `mens-en-ai.css` en `vacatures-bento.css`; vertalingen en/de/fr; tak `feat/ai-mens` | live in main 1e49d3b (na LiveWebsites). Plek in Home mag de homepage-regie verschuiven |

## Orkestratie

| Wat | Stand |
|---|---|
| Live op socialnow.nl | main 1e49d3b: verhaal en deuren, reviews weg, Day & Nite-woordmerk weg, Mens en AI plus vacatures, veiligheidsblok en /veiligheid; deploy geslaagd 28 sep 02:08 |
| Klaar voor main melden | zet je regel op "klaar voor main" met de commit en stuur de orkestratiechat een bericht |
| Open tak buiten livegang | `claude/gratis-balk-sterker` (9f15698, 3c8dcad, voortgangsbalk gratis website): eigenaar onbekend, wacht op akkoord Marinus |
