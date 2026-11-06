# 5 YEARS-logo en beeldmerk-intro (6 november 2026)

Alles in deze map komt uit de 5-jaarfilm `04_OS-VIDEO/video-project/83-vijf-jaar-socialnow` (eindtitel 59,961–65,461 s).
Niets is opnieuw getekend: vorm, kleuren en timing zijn die van de film.

| Bestand | Wat | Hoe gemaakt |
|---|---|---|
| `logo-intro.webm`, `logo-intro.mp4` | de beeldmerk-animatie uit de eindtitel, 0–4,0 s, met het witte 5 YEARS-badge dat op 2,94 s inkomt | `assets/media/s7-logo.mp4` (officiële SocialNow-logo-animatie zonder OS), uitsnede 800×240 vanaf x 80, y 856, randen 20–24 px naar zwart; badge frame voor frame in Chrome gerenderd met de CSS van `#jaren-badge` uit de film-`index.html` (TTNorms Bold 30 px, letterafstand 0,08 em, wit vlak, radius 5 px) en dezelfde beweging (`opacity 0→1, y 14→0, 0,4 s, power3.out`); 640×192, VP9 crf 40 en H.264 crf 23 |
| `logo-5years.webp` | het rustige eindbeeld: logo + 5 YEARS-badge | laatste frame van dezelfde uitsnede (x 150, y 48, 624×176), zwart omgezet naar transparant (alfa = helderste kanaal, badge volledig dekkend). Op de zwarte header pixel voor pixel het filmbeeld |

De zwarte filmondergrond valt in de header weg met `mix-blend-mode: screen`; de header is puur zwart.

## Terugzetten

- Alles in één keer terug naar de stand van vóór dit logo: `git revert -m 1 <merge-commit van deze PR>` en pushen naar main.
- De bewaarde stand staat als tag: `bewaard/2026-11-06/voor-5years-logo` (main op d1e2427, vóór deze wijziging).
- Alleen de intro uit, logo houden: in `proposal/Logo5Jaar.tsx` `useState(() => thuis)` vervangen door `useState(false)`.
- Weggooien: deze map `public/5jaar/` , `proposal/Logo5Jaar.tsx`, het blok `5 YEARS-logo uit de film` in `proposal/hoofdmenu.css` en de regel `<Logo5Jaar …/>` in `proposal/WebsiteProposal.tsx`.
