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
| Website header: persoonlijk verhaal en Odoo product | Verhaal.tsx onder de hero, Download-knop | live in main 7393c2e |
| Veiligheidsbelofte hoofdchat, websitesubchat "Zet veiligheidsvideo en belofte prominent op socialnow.nl" | proposal/Veiligheid.tsx plus eigen CSS, pagina /veiligheid, public/video/veiligheid/, public/documenten/socialnow-sleutelbelofte-{nl,en}.pdf; featuretak `feat/veiligheid` vanaf `livegang`. Blok komt na de live sites en vóór "Four faces" (plaatsing door de homepage-regie) | bezig |
