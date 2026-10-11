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
| 11-10 | stippen/bereikt | 7c0e349 | rood: aria-label "Bekijk de aftermovie van Odoo Experience 2026" in geen woordenboek. Verder groen (proef rood 11 op basis → groen). Gemeld aan 4. |
| 11-10 | stippen/bereikt | 35c4b9d | **groen** (vertaling in alle 9, eigen proef groen, bundel gelijk 149,5 KB). |
| 11-10 | stippen/wereld | 185d29e | rood: eerste script 153,9 KB (+4,4). `pages.tsx:51` laadt WereldKaart statisch → StipScene + stippen.ts in partner-colors (128,7 → 133,0 KB). Proef rood 9 → groen 22. Gemeld aan 7. |
| 11-10 | stippen/wereld | 4dc40c7 | **groen**: WereldDoek lui geladen, eerste script 147,4 KB (onder basis), proef 22/22. |
| 11-10 | stippen/snelheid | 76af6ae | **groen**: proef-stippen rood 8 op basis → groen; proef-bundel helemaal groen (117,8 KB). Eenmalig React #424 op / 1440, 7× niet herhaald (vermoedelijk testserver). Raakt ook bestanden van 1, 3, 8, 9: als eerste samenvoegen. |
| 11-10 | feat/stippen-site-20261011 | 15e7fd6 | groen op proef-geen-koekje (16), letterafstand, zwart-raster. **Rood (al sinds cdcbe51)**: `concept.css:27` `.h-hero:after` vast #0b0f12-verloop → grijze band links over de hele hero (rgb 11,15,18), raster onzichtbaar; ook `.h-clients-strook` randen (r. 32-33). Schermafdruk `01_WEBSITE/gauntlet-schermafdrukken/15e7fd6-hero-band-1440.png`. Gemeld aan L. |

| 11-10 | feat/stippen-site-20261011 | 560d2e0 | **groen**: hero-band en klantenstrookranden weg (pixels 0,0,0), zwart-raster 72 met band-eis (rood 8 op 15e7fd6), geen-koekje 16. React #424 nog 2/24 op / (bestaand). |
| 11-10 | stippen/snelheid | c034f7b | **groen**: #424 opgelost (taalwissel als transition na hydratie), 0/24 laadbeurten. Alle proeven groen. Alles gepushte gemeld aan L als groen. |
| 11-10 | feat/stippen-site-20261011 (samengevoegd: snelheid c034f7b + bereikt 116adf0) | 5b111c9 | **groen voor live**: alle proeven groen (letterafstand 11, zwart-raster 72, bundel 117,8 KB, stippen, stippen-bereikt, geen-koekje 16); gauntlet 390/1440 × NL/EN/DE/FR schoon; #424 0/24. Bereikt-proef telt nu op elke rasterverschuiving (terecht, zelfde eisen). Gemeld aan L. |
| 11-10 | **live** socialnow.nl (main e49370f, PR #70) | 5b111c9 | **groen live**: gauntlet tegen socialnow.nl 390/1440 × NL/EN/DE/FR × home/het-os/prijzen/team: 0 overflow, 0 console-/paginafouten, geen modelnamen, #000 + raster. Kop/punt gelijk aan nulmeting main. Nieuwe nulmeting voor takken: b7d56bc. |
Bestaand, geen stippenfout: beveiligingsvideo (VeiligheidSpeler) speelt door bij prefers-reduced-motion; foto's Steef/Douwe 480 gaven 404 op de basis (snelheid voegt ze toe).
