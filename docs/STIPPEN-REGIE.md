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
| 10 | Snelheid en toegankelijkheid | `stippen/snelheid` | `stippen.ts` prestaties, `scripts/proef-stippen*.mjs` | klaar 33a476e (+ merge basis): `proef-stippen.mjs` rood op basis (8), groen; `proef-bundel` 149,5 → 117,8 KB groen. Zie "Snelheid" hieronder |
| G | Gauntletloop | geen eigen code | controleert alles, meldt fouten aan de juiste chat | open |
| L | Livezet | `feat/stippen-site-20261011` → main | voegt takken samen, PR, main, publicatie | basistak 02d56eb klaar: proef `scripts/proef-zwart-raster.mjs` rood op main (56/64), groen op basistak (64); wacht op groen van G voor eerste livegang |

## Snelheid (chat 10, 11 okt)

- `stippen.ts` API ongewijzigd. Intern: vast veld wist en tekent alleen de ring van een golf of burst (dirty rect, ~4% van het
  scherm per beeld), stippen per kleur in één pad; stil in een verborgen tab; scènes tekenen alleen in beeld.
- Nieuwe effecten (chat 2): geef `ring: (t) => [x, y, binnen, buiten]` mee als het effect alleen in een ring oplicht (dan
  hoeft het vaste veld de rest niet te bekijken) en `eind: () => …` voor de eindstand bij minder beweging/pauze.
  `waarde(...) === -1` mag alleen van `t` afhangen.
- `minderBeweging()` = prefers-reduced-motion óf `data-motion="paused"` (knop uit `motion.tsx`; die knop staat op 11 okt op
  geen enkele pagina). Lopende effecten springen dan naar hun eindstand.
- `stap` wordt afgerond op 8, 16 of 32 en het veld lijnt uit op het documentraster (16 + stap·k). Bereikt (chat 4) had 14 → 16,
  Vertrouwen (chat 6) 12 → 8: kies daar zelf 8 of 16 als dat anders oogt.
- Touch: geen hover-golven, wel een golf bij een tik op een tegel.
- Eerste script onder 120 KB: nieuwe dingen in de hero die niet meteen in beeld zijn via `later()` + `<OnderDeVouw ruimte={false}>`.
