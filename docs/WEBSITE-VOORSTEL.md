## Duidelijke instap, reviews en footer — 6 september 2026

Publieke tekst zonder “POC”: “Probeer het OS” en “Ontdek hoe het werkt”. Proberen en installeren zijn twee ingangen naar hetzelfde product. De probeerknoppen in header en inhoud krijgen een heldere groene vulling; installatie blijft ernaast. Tekst: “In je browser of als app. Hetzelfde OS.” Teller/bewijs staat onder deze acties.

De losse review is vervangen door vier bestaande reacties uit components/BlijeKlanten.tsx, met de aanwezige namen/foto’s of het merklogo en een link naar het Google-profiel. Geen nieuwe reviews, totaalscore of datum toegevoegd. Alleen het label “Samen met” is op verzoek verwijderd; de logoafbeelding blijft behouden. Het archief van vóór Signature blijft bewaard.

## Beursrichting: POC eerst — 6 september 2026

Laatste aanscherping door Marinus: op de Odoo-beurs bieden we het proberen van de proof of concept aan. Gemak, overzicht en sneller werken zijn de richting. De website legt daarom de eerste nadruk op zelf ervaren, vóór het Custom OS-gesprek.

Header en primaire knoppen: “Probeer de POC”, met dezelfde bestaande directe app-login. Hero: “Eén OS voor je bedrijf. Probeer het zelf.” Vier Milo’s direct eronder, plus de stappen Open de POC → Ervaar het gemak → Samen op maat. POC is nu de uitgelichte aanbodkaart. Afsluiting en footer sturen primair naar proberen; Custom OS blijft de vervolgstap. Geen nieuwe claims over gemeten snelheid, gratis dienstverlening of werkende automatisering toegevoegd.

## Definitieve keuze: Signature als hoofdwebsite — 6 september 2026

Marinus heeft expliciet gevraagd de huidige website te archiveren en Signature live te zetten. Studio, Focus en de stijlkeuze zijn verwijderd. De vier dashboard-Milo’s blijven bovenaan. De bestaande OS-worktrees en het live POC zijn niet gewijzigd.

Het uitgelichte werk bestaat nu uit drie grote caseblokken: RAVEG met drie in-beeld afspelende motionvideo’s, Universal/Sony met een groot campagnebeeld en drie tiles, en AZ met dezelfde beeldrijke opbouw. Media opent groot met bediening; previews pauzeren buiten beeld, bij minder-beweging en met de gedeelde pauzeknop. De volledige video- en beeldsliders blijven aanwezig.

Signature gebruikt de bestaande hoofdroutes, aangevuld met /het-os en /contact. Oude /voorstel-links tonen dezelfde gekozen stijl; /voorstel/stijlen verwijst naar de Signature-homepage. Metadata en sitemap sluiten aan op POC → persoonlijk Custom OS-voorstel; oude vaste pakketprijzen en automatische garanties zijn uit de homepage-metadata verwijderd. De oprichtersmissie staat als gewone tekst, zonder verzonnen persoonlijke quote.

Back-up: `/Volumes/WORK/02-SOCIALNOW/01_WEBSITE/_ARCHIEF/2026-09-06-voor-signature/`. Inclusief broncode op f479763, exact Pages-artifact van run 34031048680, SHA256-controlesommen en herstelhandleiding. De gearchiveerde homepage is byte voor byte vergeleken met productie vóór publicatie. Externe video’s blijven externe verwijzingen.

Verificatie: TypeScript, productiebuild, Node-render van hoofd- en previewroutes, routes/ankers/ARIA, bestaande media, instaplinks, Signature bij oude stijlparameters, nieuwe metadata en sitemap. Browsercontrole blijft beleidsmatig geblokkeerd; geen visuele, interactieve of gemeten performanceclaim. Contact opent een e-mailconcept en biedt WhatsApp/telefoon; er is geen nieuwe aanvraagdatabase of backend geclaimd.

---

# SocialNow — websitevoorstel voor beoordeling

6 september 2026. Eigen werkspoor in `/Volumes/WORK/socialnow-website-saas`, branch `website-saas`. De bestaande homepage blijft op `https://socialnow.nl/`. Het tijdelijke voorstel wordt gepubliceerd op `https://socialnow.nl/voorstel/`, met `noindex, nofollow` en buiten de sitemap.

## Richting

**Eén OS voor je bedrijf. Gebouwd vanuit de praktijk.**

Het product staat vooraan. Het echte werk sinds 2021 verklaart waar de ervaring vandaan komt. Mensen, een duidelijke inrichting en toetsbare functionaliteit dragen de betrouwbaarheid. Zwart is de paginabasis; neutrale panelen, TT Norms en kleine groene actieaccenten bepalen de vormgeving.

### Versie 2 — het eigen SocialNow-karakter terug

Na de eerste preview vroeg Marinus expliciet om de mooie 3D-globes en herkenbare branding terug te brengen, minimaal binnen deze rustige stijl. De nieuwe iteratie voegt daarom toe:

- De herkenbare cyaan/roze/gele globecompositie bij ‘Jouw OS’, op basis van dezelfde bolverhoudingen, kleuren en puntenverdeling als de bestaande PixelGlobe.
- Langzame rotatie per bol en een lichte reactie op de aanwijzer binnen de globe. De merkcompositie blijft bij elkaar; geen verspreidende deeltjes of brede achtergrondanimatie.
- Een pauzeknop die de huidige positie bewaart. Minder-beweging toont een stil beeld. Buiten beeld en in een verborgen tab stopt de animatie; op mobiel gebruikt hij minder punten en een lagere beeldfrequentie.
- Het bestaande 3D-beeldmerk als fallback, klein bij de producttitel en als rustige herhaling bij de slotsectie.
- Neutrale glans en subtiele binnenranden op knoppen en productpanelen. Kleine merkaccenten verbinden Odoo, Meta en persoonlijke inrichting visueel met de globe.

Deze wijziging zit uitsluitend in het voorstel. De bestaande PixelGlobe, homepage, OS-bestanden en productclaims zijn niet aangepast. De zwarte paginabasis blijft behouden. De eerste preview is terug te halen op commit `42b5598`; de actuele tijdelijke URL blijft `/voorstel/`.

Controle van versie 2: productiebuild, TypeScript, bronreview en de bestaande Node-render-/route-/tellercontrole. Het nieuwe beeldmerk bestaat lokaal; de Node-controle omvat nu tien verschillende afbeeldingen. Dit is nog steeds geen visuele of interactieve browsercontrole.

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


## Versie 3 — volledige website vanuit de vier Milo’s

Laatste richting van Marinus: een verbeterde, volwassen versie van zijn eigen volledige website. De vier Milo’s uit het dashboard zijn essentieel voor de branding en de belofte. De POC laat de waarde ervaren; persoonlijk contact voor een Custom OS is de conversie.

### Wat nu in het voorstel zit

- 24 rechtstreeks bereikbare previewpagina’s: homepage, OS, portfolio, 14 projecten, diensten, aanbod/prijzen, team, blog, artikel, contact en het bestaande privacybeleid. Interne navigatie blijft onder `/voorstel`.
- De vier **werkelijke dashboard-Milo’s** in de hero, de uitleg en de slotuitnodiging. Rollen: Website, CRM, Studio en Advertenties. De 512px-portretten en kleine WebM/MP4-animaties zijn bytegetrouw gekopieerd uit `/Volumes/OS/08-APP/assets/milo`. Er is niets in het OS gewijzigd. De oudere website-Milo’s zijn niet als vervanging gebruikt.
- De drie merkglobes staan rustig in de hero-achtergrond. Het ingekaderde nep-productblok is vervallen. Zwart, TT Norms, het echte logo en de bestaande 3D-knopglans blijven de basis. Minder-beweging wordt gerespecteerd; Milo-video’s worden alleen bij hover/focus geladen.
- Alle 14 bestaande cases, acht teamleden, zes dienstgroepen, vijf klantlogo’s, de eigen social-collectie en uitlegvideo’s keren terug. Er zijn geen nieuwe rendementscijfers of klantbeoordelingen toegevoegd. De oude ongedocumenteerde metric-tegels worden in de preview niet getoond.
- Conversieroute: **POC ervaren → persoonlijk gesprek → Custom OS-inrichting → eventuele doorlopende uitvoering met het team**. Na de OS-uitleg, op het aanbod en onderaan de site staat een duidelijke Custom OS-contactknop.
- Aanbod: POC verkennen, Custom OS met persoonlijk voorstel, verder met het team. De oude € 1.500/€ 2.500/€ 3.000-bureaupakketten vormen niet meer de hoofdpropositie. Nieuwe bedragen zijn niet als vast tarief verzonnen; de Custom OS-prijs volgt uit inrichting, koppelingen en begeleiding. Losse creatieve en technische diensten blijven bereikbaar.
- De contactpagina heeft echte e-mail-, telefoon- en WhatsApp-links en een formulier dat een ingevuld e-mailconcept opent. Het onderwerp volgt de gekozen dienst of Custom OS. De tekst zegt expliciet dat de bezoeker het concept nog zelf moet versturen. **Er is geen nieuwe contactbackend of boekingsagenda aangesloten.** De bestaande worker bevat een Milo-chattemplate, maar de repository heeft geen geconfigureerde endpoint of kalender; die zijn niet als werkend gepresenteerd.
- Milo op de website is een herkenbare wegwijzer door echte FAQ-antwoorden, met een link naar het team. De module doet geen valse AI-/uitvoeringsbelofte.

### Controle

`npx tsc --noEmit`, productiebuild en `node scripts/check-proposal.mjs`. De Node-controle rendert 24 routes plus een onbekende route, controleert 61 bestaande beelden, unieke IDs/ARIA, links tussen pagina’s en ankers, behoud van alle projecten/teamleden, de vier Milo-assetsets, originele video/posterbestanden, claim/installatielinks en de demo/live/foutafhandeling van de teller. Alle previewroutes blijven noindex en buiten de sitemap.

Browserweergave en interactieve bediening zijn **niet visueel gecontroleerd**: de eerder vastgestelde browserbeleidsblokkade is niet omzeild. De HTTP- en Node-controles bewijzen technische levering en bronstructuur, geen visuele browserkwaliteit.

De productiehomepage en bron-/OS-worktrees blijven behouden. Alleen de expliciet geautoriseerde tijdelijke preview wordt bijgewerkt. Regie ontvangt volgens de laatste afspraak alleen echte OS-afhankelijkheden; deze vormgevingswijzigingen blijven in dit websitespoor.


## Versie 4 — drie stijlen, één website en OS-richting

Marinus vroeg daarna expliciet de logo-intro, live websites, geanimeerde uitlegkaarten, originele video- en beeldsliders, Milo-animaties en uitgebreidere footer terug. Vervolgens vroeg hij **drie stijlopties** om te kiezen, met als blijvend uitgangspunt: website en proof of concept moeten één betrouwbaar, snel, visueel sterk en klantvriendelijk geheel vormen.

Vergelijkingspagina: `/voorstel/stijlen/`. Volledige varianten via `?stijl=signature`, `?stijl=studio` en `?stijl=focus`. De zichtbare keuzebalk schakelt de stijl op elke pagina; de keuze blijft tijdens interne navigatie bewaard. De query kan de opgeslagen keuze overrulen. Een stijlwijziging wist het contactformulier niet.

- **Signature — verfijnd & vertrouwd:** behoudt de goedgekeurde compositie, de vier Milo’s en verfijnde 3D-details. Aanbevolen vertrekpunt voor continuïteit met SocialNow.
- **Studio — ruim & uitgesproken:** centrale hero, grotere typografie, meer ruimte en grotere beelden/video’s. Hetzelfde aanbod en dezelfde functionaliteit.
- **Focus — compact & productgericht:** compactere secties, Milo’s als overzichtelijke werkmodules, preciezere kaders en korte actieroutes. Hetzelfde merk en dezelfde bronnen.

De vergelijking toont per richting zowel een website-miniatuur als een OS-miniatuur. Die OS-beelden zijn uitdrukkelijk stijldemonstraties; **de live POC en OS-broncode zijn niet gewijzigd**. Na de stijlkeuze moet dezelfde vormtaal consequent worden doorgevoerd in website en POC. Eenheid betekent gedeelde kleuren, typografie, Milo-rollen, kaarten, knoppen, feedback en bediening; niet slechts een gelijk logo.

### Teruggebrachte ervaring

- Exacte oorspronkelijke desktop-/mobiele `header-intro`-logoanimatie. Eenmaal per sessie bij de eerste homepage, direct overslaan/Escape, automatische afsluiting bij einde/fout/blokkade, maximale wachttijd 6 seconden. Opnieuw afspelen via de footer. Geen automatisch verplichte lange OS-uitlegvideo.
- Vier dashboard-Milo’s bewegen automatisch in de hero en rolkaarten zodra zichtbaar. Kleine bestaande WebM/MP4-bestanden, stilstaand beeld bij minder-beweging/afspeelfout, pauze buiten beeld en bij verborgen tabblad. Centrale animatiepauze bedient ook de globe, sliders en uitlegkaarten.
- Negen websitevoorbeelden in een browserframe, met thumbnails, vorige/volgende, desktop-/mobiele breedte en de volledige case. kWh Garant, Il Gordo, VDZ Brigade en Divine Machines ondersteunen directe frames volgens de gecontroleerde publieke headers. Voor websites met framebeperkingen wordt het bestaande ontwerpbeeld met de externe link gebruikt. Er is geen framebeperking omzeild. Live frames laden pas nabij het zichtbare blok.
- Alle 14 oorspronkelijke short-contentvideo’s zijn terug in een bewegende, bedienbare rij. Klik opent een speler met eigen geluidsbediening. Alle 14 bron-URL’s gaven HTTP 200 bij HEAD-controle.
- De oorspronkelijke negen portfolio-afbeeldingen in twee rustig tegengesteld bewegende rijen. Native horizontale bediening, slepen/vegen, pijlen, beeldvergroting, pauze bij hover/focus en minder-beweging. Geen diagonale portfoliostrook.
- Drie geanimeerde uitlegkaarten hernemen het chat-, dashboard- en ringmotief. Teksten gaan over contact, inzicht en de persoonlijke vervolgstap. Het ongefundeerde voorbeeldgetal +312% is niet als echt resultaat herplaatst.
- Uitgebreide footer met actieroutes, groot merkverhaal, navigatie, contact/socials, het originele SocialNow OS/Komen Consultancy-beeldmerk, technologielogo’s, bedrijfsgegevens, privacy en de bestaande voorwaardenlink. Geen nieuwe certificerings-, hosting- of backupgarantie toegevoegd.

### Verificatie en grenzen

TypeScript, productiebuild en Node-renders voor 25 routes plus alle drie homepagevarianten. Controle op unieke IDs/ARIA, 71 bestaande lokale afbeeldingen, behoud van complete mediacollecties, werkende interne routes, stijlkeuze via URL en de herkenbare footer. Afzonderlijk HTTP-controle van previewroutes, bundels en teruggebrachte mediabestanden na publicatie.

Browserbeleid blokkeert nog de visuele browsercontrole. Er is geen browser, alternatieve renderdienst of omweg gebruikt. Snelheid is ondersteund door uitgesteld laden en pauzeren buiten beeld; geen onbewezen Core Web Vitals-score of gemeten snelheidsvoordeel per stijl geclaimd. De gedeelde contactroute blijft een eerlijk gelabeld e-mailconcept; er is geen nieuwe contactbackend aangesloten.
