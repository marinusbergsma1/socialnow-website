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
