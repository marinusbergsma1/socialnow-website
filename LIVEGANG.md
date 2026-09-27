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

## Wie werkt waaraan

| Chat | Onderdeel | Stand |
|---|---|---|
| Teamstrook, prijzen en team (sessie 5c900cd2) | teamstrook, /prijzen (OS op maat vanaf €10.000, pakketten +€2.000), /team (bedankje partners, Head of-functies, system experts) | live in main 3e18ff4; wacht op namen en logo's van de partnerbedrijven |
| Website header: persoonlijk verhaal en Odoo product (regie homepage-upgrade, sessie 5c0f2f30) | homepage met storytelling: verhaal met tijdlijn onder de hero, partner-CTA met Michelle, scrollfix live sites, volgorde van de secties; bestanden `proposal/pages.tsx` (Home), `proposal/Verhaal.tsx`, `proposal/Deuren.tsx`, `proposal/LiveWebsites.tsx`, `proposal/experience.css`; featuretak `feat/verhaal-homepage` vanaf `livegang`. Werkorder: `~/Downloads/website-verhaal-2026-09-28/WERKORDER.md` | bezig (Download-knop en eerste verhaal live in 7393c2e) |
| Verhaalfilm (hulpchat van de homepage-regie, chip) | HyperFrames-film van het verhaal, EN en NL; alleen `public/video/verhaal/*`; tak `claude/verhaalfilm` | wacht op start |
| Cases Il Gordo en VASTIQ (hulpchat van de homepage-regie, chip) | nieuwe case-kaarten; `proposal/FeaturedWork.tsx`, `data/projects.ts`, `public/images/cases/*`, `proposal/cases.css`; tak `claude/cases-ilgordo` | wacht op start |
| Site-audit op het verhaal (hulpchat van de homepage-regie, chip) | pagina's buiten de homepage in lijn met het verhaal, functie Michelle; tak `claude/site-visie`; stemt /team af met de teamchat | wacht op start |
| Veiligheidsbelofte hoofdchat, websitesubchat "Zet veiligheidsvideo en belofte prominent op socialnow.nl" | proposal/Veiligheid.tsx plus eigen CSS, pagina /veiligheid, public/video/veiligheid/, public/documenten/socialnow-sleutelbelofte-{nl,en}.pdf; featuretak `feat/veiligheid` vanaf `livegang`. Blok komt na de live sites en vóór "Four faces" (plaatsing door de homepage-regie) | bezig |
| Sitebrede bentogrid (eigenaar: homepage-regie, sessie 5c0f2f30) | alle homepage-secties als kleine bentogrids zoals het landingsscherm; één gedeelde tegelklasse die alle websitechats gebruiken | wacht op start |
| Indeed en vacatures (sessie e5c17002) | Indeed-begeleiding Marinus (hij plaatst zelf, geen account of login door Claude) | referentietak `claude/vacatures` (niet naar main); functie AI-expert betalingen en bentotegel overgedragen aan `feat/ai-mens` |
| Mens en AI plus vacatures (sessie 9c8d11dd) | homepagesectie `proposal/MensEnAI.tsx` na ShowcaseFilms (AI verkeerd begrepen, mensen als verbindende laag, gratis starten en winstgevend in drie maanden, vacature partner); pagina `/vacatures` met negen functies uit `proposal/vacatures.ts`, footerlink, `docs/vacatures-indeed.md` met Indeed-teksten; eigen CSS `proposal/mens-en-ai.css`; tak `feat/ai-mens` vanaf `livegang`, werkmap `socialnow-ai-mens` | 45312ed; lijst functies staat klaar voor de Indeed-chat (e5c17002), die kan `/vacatures` overnemen of bentotegel maken; vertalingen en/de/fr volgen |

## Orkestratie

| Wat | Stand |
|---|---|
| Live op socialnow.nl | main 7393c2e, deploy geslaagd 27 sep 23:22 |
| Klaar voor main melden | zet je regel op "klaar voor main" met de commit en stuur de orkestratiechat een bericht |
| Open tak buiten livegang | `claude/gratis-balk-sterker` (9f15698, 3c8dcad, voortgangsbalk gratis website): eigenaar onbekend, wacht op akkoord Marinus |
