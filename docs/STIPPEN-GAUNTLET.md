# Stippen — gauntlet-logboek (chat G)

Elke ronde: `git fetch`, per tak met nieuwe commits bouwen in `../socialnow-stippen-gauntlet` (npm ci, npm run build,
`git checkout -- public/documenten`), dist serveren en controleren met Playwright (chromium 1243):
390 en 1440 px, NL/EN/DE/FR, home + het-os + prijzen + team; console, horizontale overflow, koppen wit met groene punt,
body puur zwart met 32-px-raster, modelnamen, prefers-reduced-motion (twee schermafdrukken gelijk), plus de eigen proeven
`proef-letterafstand`, `proef-bundel`, `proef-zwart-raster` en de proef van de tak (rood → groen).
Vergelijking altijd tegen main 77bebda: alleen wat nieuw rood is telt als fout van de tak.

## Nulmeting main 77bebda (al rood vóór de stippen)

- `proef-bundel`: eerste script 149,2 KB gzip (> 120 KB), lettertypes 137,8 KB, `font-display: swap` mist. Bestaand.
- Koppen: veel koppen #f5f5f5 in plaats van #fff en veel afsluitende punten niet groen (o.a. "Je vraag brengt ons samen.",
  "GRATIS WEBSITE.", "Let's keep the world social. Now."). Bestaand, buiten de stippenopdracht.

## Rondes

| Tijd | Tak | Sha | Uitslag |
|---|---|---|---|
| 11-10 | feat/stippen-site-20261011 | cdcbe51 → 02d56eb (e943587 alleen regie) | **groen** voor de eerste livegang. Geen nieuwe fouten t.o.v. main (82 kop/punt-meldingen minder). Overflow 0, console schoon, body #000 met raster 32 px, geen modelnamen, reduced-motion stil op 4 scrollhoogtes × 390/1440. `proef-letterafstand` groen (11), `proef-zwart-raster` groen (64). `proef-bundel`: 149,5 KB (+0,3 KB, main al rood). Wisselend rood "kop ''" in proef-bundel = time-out van 15 s onder CPU-last: 10 van 10 losse metingen tonen de kop binnen 0,2 s, 4 van 4 herhalingen groen. |
| 11-10 | stippen/* (10 takken) | cdcbe51 | nog geen eigen commits |
