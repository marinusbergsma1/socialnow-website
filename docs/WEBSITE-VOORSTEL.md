# SocialNow — websitevoorstel voor beoordeling

6 september 2026. Eigen werkspoor in `/Volumes/WORK/socialnow-website-saas`, branch `website-saas`. De bestaande homepage blijft op `https://socialnow.nl/`. Het tijdelijke voorstel wordt gepubliceerd op `https://socialnow.nl/voorstel/`, met `noindex, nofollow` en buiten de sitemap.

## Richting

**Eén OS voor je bedrijf. Gebouwd vanuit de praktijk.**

Het product staat vooraan. Het echte werk sinds 2021 verklaart waar de ervaring vandaan komt. Mensen, een duidelijke inrichting en toetsbare functionaliteit dragen de betrouwbaarheid. Zwart is de paginabasis; neutrale panelen, TT Norms en kleine groene actieaccenten bepalen de vormgeving.

| Onderdeel | Huidige homepage | Voorstel |
| --- | --- | --- |
| Opening | Video-intro, AI-chatbelofte en bewegende elementen | Direct leesbare OS-belofte, compacte instap en rustige uitleg van de samenhang |
| Product | Veel diensten en losse presentaties | Odoo, Meta en Custom OS met selecteerbare uitleg en concrete grenzen |
| Persoonlijke inrichting | Verspreid over de pagina | Eén route: claimen en verkennen, processen bespreken, Custom OS inrichten en testen |
| Klantwerk | Bewegende portfolio- en socialstroken | Drie vaste cases met bestaand beeld, een feitelijke omschrijving en link naar het project |
| Menselijke begeleiding | Team onderaan de lange homepage | Al zichtbaar in de opening, plus een oprichtersblok en teamsectie |
| Bewijs | Onderling afwijkende cijfers en reviewwaarderingen | Eén bestaande klantreactie, echte cases; geen nieuwe totaalscore of prestatieclaims |
| Mobiel | Veel desktopbeweging | Eigen kolomindeling, compacte tabs, teamrijen en uitklapbare aanvullende informatie |

## Marinus' stem

Nieuwe redactionele concepttekst, zichtbaar als concept gemarkeerd in de preview:

> Ik wil dat je als ondernemer je bedrijf kunt aansturen zonder eerst software te moeten leren. Daarom bouwen we Custom OS-systemen die eenvoudig werken, bij jouw bedrijf passen en mensen achter zich hebben.

Dit is geen historisch citaat of bestaande testimonial. Het kan na Marinus' beoordeling zijn persoonlijke oprichtersboodschap worden. Zijn echte foto komt uit `public/images/Marinus-Bergsma-V2.webp`.

## Productgrenzen en bronnen

- Afstemming met STAP 1/6 op bronstand `ad0fd59`: Odoo geeft CRM-leads, fasen, pijplijn en offerte-/verkooporderinformatie. Geen algemene belofte over boekhoudkundige omzet, facturen of betaling. Er bestaan rolgebonden schrijfhandelingen; daarom geen absolute claim dat het hele OS niets kan wijzigen.
- Meta: informatie over content en advertenties, afhankelijk van accountrechten. Geen bewezen standaardfunctie voor autonoom publiceren, budgetwijzigingen of campagnebeheer.
- Eigen Odoo en Meta verbinden is de beoogde instap. Niet elke rechten-/omgevingscombinatie is live getest; concrete abonnementsgeschiktheid wordt niet beloofd.
- Website, Bouw met AI en Projectruimtes zijn contactmodules. Studio, CRM-uitbreidingen, Team en definitieve Milo-regie worden in de eigen OS-werkstappen ontwikkeld en getest.
- De productweergave is een uitleg van de samenhang. Geen screenshot met onbewezen live klantcijfers.
- Cases: `data/projects.ts`, met bestaande screenshots. Ze worden als werk uit de praktijk gepresenteerd, niet als bewijs dat deze klanten al de huidige OS-POC gebruiken.
- Ellen Sluijs: letterlijke bestaande reactie uit `components/BlijeKlanten.tsx`, gekoppeld aan hetzelfde Google-profiel. Geen nieuwe beoordeling of opnieuw geverifieerde Google-score geclaimd.
- Namen, rollen en portretten: `components/Team.tsx`. De overige teamleden en bestaande project-/dienstenroutes blijven bereikbaar.
- TT Norms: bestaande SocialNow-fontbestanden uit `02-SOCIALNOW/04_OS-VIDEO/video-project/54-story-vo-nieuw/assets/fonts`, alleen gekopieerd naar dit voorstel; bronbestanden onaangeroerd.

## Instap en teller

Claim gaat rechtstreeks naar `https://app.socialnow.nl/login/?bron=site`. Installeer OS klapt korte apparaatafhankelijke hulp uit, met `https://app.socialnow.nl/?bron=installatie`. Geen tussenpagina of modal. De browser bepaalt of installeren beschikbaar is.

De teller gebruikt uitsluitend de openbare API `https://app.socialnow.nl/api/os-aantal`. Het API-veld bepaalt demo/live, niet een lokale aftelberekening. Demo verschijnt als **Demostand** met **Democijfers, geen klantgroei**. Live verschijnt als **OS-werkruimten aangemaakt**, niet als betalende klanten. Onjuiste of ontbrekende data tonen geen verzonnen nulstand. Een verwijzing naar klantreacties staat boven de instap; zonder onbewezen samengestelde reviewscore.

## Controle en publicatie

- Zwart-herstel: commit `43511e4`; GitHub Pages-run `34026613759` geslaagd. Apex leverde `index-Bu3FPMG8.css` met zwarte basis en zonder `#0a1628`.
- `npm run build`: productiehomepage, alle bestaande routes en afzonderlijke preview-ingang.
- `npx tsc --noEmit`: TypeScriptcontrole.
- `node scripts/check-proposal.mjs`: Node-render, IDs/ARIA-doelen, lokale beelden, instaproutes, tellerfouten, installatiehints en scheiding van homepage/sitemap. Dit is geen browsertest.
- `npm run build:voorstel`: optionele aparte build in `dist-proposal`.
- `npm run dev:voorstel`: lokale vergelijking via `/voorstel.html` en `/`.

De bestaande browserbeleidsblokkade is niet omzeild. Er is geen visuele browsercontrole van desktop, mobiel, menu, tabs of installatiehulp uitgevoerd. Bron-/build- en HTTP-/assetcontroles worden afzonderlijk van visuele controle gerapporteerd.

Marinus beoordeelt eerst deze tijdelijke preview. De volledige homepage wordt pas daarna naar deze productstructuur omgezet. Het bestaande bronrepo en de OS-worktrees zijn niet bewerkt. Afstemming loopt via REGIE · POC Odoo-beurs en STAP 1/6 · Onboarding.

## Gepubliceerde preview

**Bereikbaar en technisch gecontroleerd:** https://socialnow.nl/voorstel/

- Websitecommit: `42b559832bfa407cbc2332f41e423aabc2d0c42a`.
- GitHub Pages-run: https://github.com/marinusbergsma1/socialnow-website/actions/runs/34027249767 — geslaagd.
- Preview HTTP 200; de vijf JS-/CSS-bundles, negen beelden en drie fonts geven HTTP 200 en zijn byte-identiek aan de lokale build.
- Apex-homepage HTTP 200; www verwijst naar apex en eindigt op HTTP 200. Beide leveren de bestaande homepage, zonder preview-noindex.
- Openbare teller tijdens controle: `{ "ok": true, "customOs": 26, "demos": 240, "demo": true }`, CORS `*`.
- Productiebuild, afzonderlijke voorstelbuild, TypeScript en Node-bron-/rendercontroles geslaagd.
- Visuele browsercontrole blijft ontbreken wegens de bekende beleidsblokkade; technische levering is geen claim dat layout en bediening visueel zijn beproefd.

## Referentie: de volledige pro-video

Bron: `/Volumes/WORK/02-SOCIALNOW/04_OS-VIDEO/03_OPLEVERING/2026-08-26_STORY-EN/ODOO-EXPERIENCE-demo-EN-3min10.mp4`.

Lokaal gecontroleerd met ffprobe: **190,161 seconden**, 1080 × 1920, H.264 met AAC-audio. De versie op de huidige website is een andere, kortere film. Voor deze analyse zijn tien beeldsteekproeven als contact sheet bekeken, plus `SCRIPT.md`, `BRIEF.md` en relevante compositietekst. Er is geen volledige audiovisuele afspeelcontrole gedaan. Contact sheet: `review.local/pro-video-contact-sheet.jpg` (lokaal, niet gepubliceerd).

De bruikbare verhaallijn voor de website is **inzicht → voorstel → preview → akkoord → uitvoering/status**. In de film worden niet alleen schermen getoond: het systeem stelt werk voor en vraagt om een besluit. De broncompositie noemt ook expliciet het SocialNow-team en marketeers die na akkoord plannen. Dit ondersteunt een menselijke propositie; het is geen bewijs dat iedere getoonde automatisering nu in de POC werkt.

Voor een volgende versie past één korte, zelf te starten animatie in de OS-uitleg:

1. Een ondernemer ziet welke informatie uit zijn eigen systemen beschikbaar is.
2. Een voorstel verschijnt met een begrijpelijke preview.
3. De ondernemer beoordeelt en geeft akkoord.
4. Het afgesproken werk krijgt een duidelijke status, met zichtbaar wie het uitvoert.

Gebruik daarbij de werkelijke functies die de OS-stappen op dat moment hebben bewezen. Nog niet beschikbare handelingen krijgen een expliciet voorbeeld-/toekomstlabel. Geen klantcijfers in de animatie en geen automatische herhaling, achtergrondfilm of scrollblokkade. Een statische uitleg blijft beschikbaar bij minder-beweging. Er is nu geen nieuwe video gemaakt of geplaatst: de openbare eerste preview heeft voorrang en is zelfstandig te beoordelen.
