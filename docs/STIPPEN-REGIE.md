# Stippen op socialnow.nl — regie (11 oktober 2026)

Marinus, 11 okt: "Ik wil de gehele site met dots hebben en overal waar nu in bentogrids vrij nikszeggende animaties staan kan
je zulk soort dot animaties maken net als in de explainer video." Daarna: "Verder site ook helemaal zwart", "De globes ook in
het dotraster" (globe op het 32-px-raster: "Ja nice"), "Mogen best kleine dots zijn, dan kunnen de veranderende planeten.
Misschien zelfs met animatie en interactie, zoals bij mouse hover mee veranderen", en "af en toe ineens een lijpe proof of
skills binnen zulke animaties met hele mooie symmetrische effecten, en alles ook interactief, bij bijvoorbeeld hover van een knop".

Voorbeeld dat hij "vet" vond: optie D (500 stippen = 500 plekken, eigen stip groen + kleurburst):
https://claude.ai/artifact/MHYJoXUAzoYc8LVg8bQTpk (bron: `01_WEBSITE/socialnow-stippen-opties-20261011`).

## Basistak

`feat/stippen-site-20261011` (vanaf main 77bebda), map `01_WEBSITE/socialnow-stippen-site-20261011`. Al gedaan:

| Bestand | Wat |
|---|---|
| `proposal/stippen.css` | hele site puur zwart (#000, ook `--c-zwart`), raster 32 px als body-achtergrond, donkere tegels doorzichtig |
| `proposal/stippen.ts` | motor `Veld`: `golf`, `golfReeks`, `burst`, `balken`, `vul`, `zet`, `wis`, `tekstCellen`; `siteVeld()` = vast canvas met golf bij hover op een tegel (kleur van de tegel) en groene golf bij klik op een groene knop |
| `proposal/StipScene.tsx` | stippenscène in een tegel, start bij in beeld, `opnieuw` bij hover |
| `index.tsx` | laadt `stippen.css` als laatste, `siteVeld()` pas bij idle |
| `Bereikt.tsx` | kWh 100 leads en VDZ € 100.000 als 100 stippen (1 stip = 1 lead / € 1.000) + burst; Uitgenodigd = vinkje uit stippen |
| `NulNaarBedrijf.tsx` | Alles gekoppeld: draad van stippen in de kleur van de bron |
| `TrustStories.tsx` | Overzicht: 126 leads blauw, 38 groen |
| `BrandGlobe.tsx` | bollen belichten het 32-px-raster (goedgekeurd) |

## Vaste regels (uit de film en Marinus)

- Raster 32 px, stip r 1,6, stippen op 16 + 32k in documentcoördinaten. Fijner mag alleen als onderverdeling (16 of 8 px), zodat het grote raster erin blijft vallen.
- Geen gloed, geen confetti-snippers (wel kleurburst uit stippen), geen planeten-/ringvormen als achtergrond in video's; op de site mogen de bollen (globe) wel veranderen.
- Kleuren: geel #F5C518, blauw #1f6fd1, roze #EC1670, groen #25D366; Milo's: website #25D366, crm #1965C2, studio #F5940D, ads #EC1670.
- Koppen wit, alleen de afsluitende punt groen. Nooit letters tegen elkaar (geen negatieve letterafstand).
- Wit = mens (wit blijft wit, grijze stippen), zwart = tech.
- Geen modelnamen in sitecopy. Elke nieuwe tekst in alle 9 woordenboeken (`proposal/i18n/*.json`).
- `prefers-reduced-motion`: eindstand zonder animatie. Eerste script blijft onder 120 KB gzip (`scripts/proef-bundel.mjs`).
- Niets live zonder proef die eerst rood en dan groen is, beide in de PR.
- Na `npm run build`: `git checkout -- public/documenten`.

## Chats

Elke chat: eigen tak `stippen/<naam>` vanaf `feat/stippen-site-20261011`, eigen worktree `01_WEBSITE/socialnow-stippen-<naam>`,
alleen de eigen bestanden. Klaar = push + regel hieronder bijwerken + bericht aan de livezet-chat (tak, sha, paden, schermafdrukken 390 en 1440).

| # | Chat | Tak | Bestanden | Stand |
|---|---|---|---|---|
| 1 | Planeten (globe) | `stippen/planeten` | `BrandGlobe.tsx`, globe-css | open |
| 2 | Symmetrie-effecten | `stippen/symmetrie` | `stippen.ts` (nieuwe effecten), knop-hover | open |
| 3 | Milo's uit stippen | `stippen/milos` | hero-kaarten, `Vier gezichten` (pages.tsx, ui.tsx MiloPortrait) | open |
| 4 | Bereikt | `stippen/bereikt` | `Bereikt.tsx`, `bereikt.css` | open |
| 5 | Nul naar bedrijf | `stippen/nul` | `NulNaarBedrijf.tsx` | open |
| 6 | Vertrouwen-tegels | `stippen/vertrouwen` | `TrustStories.tsx`, `media-bento.css`, `MiloVragen.tsx` | open |
| 7 | Wereldkaart | `stippen/wereld` | `WereldKaart.tsx`, `wereldkaart.css` | open |
| 8 | Mensen uit stippen | `stippen/mensen` | team/partners (hero-c.css, TeamTrust, PartnerIntro, OsPeople) | open |
| 9 | Overige pagina's | `stippen/paginas` | `paginas.tsx` e.a. pagina's, hun css | open |
| 10 | Snelheid en toegankelijkheid | `stippen/snelheid` | `stippen.ts` prestaties, `scripts/proef-stippen*.mjs` | open |
| G | Gauntletloop | geen eigen code | controleert alles, meldt fouten aan de juiste chat | open |
| L | Livezet | `feat/stippen-site-20261011` → main | voegt takken samen, PR, main, publicatie | basistak da987f8: proeven `proef-zwart-raster.mjs` (rood 56/64 op main, groen 64) en `proef-geen-koekje.mjs` (cookiemelding weg, rood 8/16, groen 16). Marinus 11 okt: "Coockie pop up weg en zelfstandig livezetten, na afronding": L zet na afronding zelf live, zonder te vragen |
