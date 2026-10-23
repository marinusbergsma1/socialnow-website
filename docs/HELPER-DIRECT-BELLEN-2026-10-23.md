# Milo rechtsonder en direct bellen

23 oktober 2026. Basis: `main` op `f0d559a`.

Milo staat weer op iedere reguliere sitepagina, rechtsonder. Klikken opent de bestaande chat naast de helper; sluiten en Escape werken via de native dialoog. De eerder ongebruikte dialoog had een CSS-regel die ook gesloten dialogen zichtbaar maakte. De flex-layout geldt nu alleen voor `[open]`.

De call-knoppen in de navigatie, homepage, custom-OS-pakketten, appoverzicht en Connect-film bellen Marinus direct. De chat heeft dezelfde beloptie. Nummer: `tel:+31637404577`, overgenomen uit de bestaande kennismaken-met-Marinus-CTA in `components/TeamPage.tsx`. Overige contactaanvragen blijven hun bestaande bestemming houden. Het nieuwe label is vertaald in alle negen aanvullende talen.

## Controle

- `npm ci --ignore-scripts`, `npm run build` en `tsc --noEmit` geslaagd. De volledige build rendert 350 pagina's in tien talen.
- Browsercontrole op 390 en 1440 px: helper rechtsonder, dialoog eerst verborgen, openen, vraag invoeren, denkpuntjes, antwoord, sluiten, directe tel-link en geen horizontale overflow.
- De bestaande externe Worker antwoordt momenteel met HTTP 503: `Nog geen ANTHROPIC_API_KEY of GEMINI_API_KEY ingesteld.` De bestaande FAQ-terugval geeft in beide schermformaten een antwoord. De live AI-route is daarmee nog niet operationeel. Er zijn geen sleutels of deploymentinstellingen gewijzigd.
- In de statische lokale preview zijn de bestaande A/B-API en analytics-script alleen voor de browserproef vervangen door lege lokale antwoorden. De echte Milo-Worker is tijdens de proef aangeroepen. De statische preview logt daarnaast `Unexpected token <` vanuit een ander geladen script; de herkomst is in deze wijziging niet onderzocht. Helper en call-actie werken in dezelfde proef.
- Logo's zijn niet vervangen of opnieuw getekend. De bekeken schermen houden de SocialNow-logo's op hun bestaande donkere achtergrond.

Schermafdrukken staan lokaal onder `~/Documents/Codex/2026-10-23/socialnow-helper-direct-call/`.

## Publicatie

Featurebranch: `feature/restore-helper-direct-call-20261023`. Geen productiepush: `LIVEGANG.md` reserveert publiceren naar `main` voor de orkestratielaag en noemt WINACTIE LIVE als enige publiceerder. De wijziging wordt via een PR aangeboden.
