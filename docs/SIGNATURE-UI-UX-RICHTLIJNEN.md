# SocialNow Signature — gedeelde UI- en UX-richtlijnen

Versie 1 · 6 september 2026 · Voor Regie, alle zes OS-stappen en de website.

Dit document vertaalt de laatste keuzes van Marinus naar één gezamenlijke richting. Signature is de gekozen stijl. De andere twee stijlvoorstellen vervallen. De website en het OS moeten herkenbaar hetzelfde product zijn. De regels hieronder zijn de ontwerpafspraak; numerieke maten zijn implementatierichtlijnen, geen verklaring dat elk OS-scherm al is aangepast.

## 1. De belofte en de route

**Your website, CRM, content and ads. In one chat.**

Nederlands: **Je website, CRM, content en advertenties. In één chat.**

De bezoeker moet snel begrijpen wat SocialNow doet en het systeem kunnen proberen. Het eerste product is de werkende ervaring. Persoonlijke inrichting als Custom OS volgt wanneer de gebruiker de waarde begrijpt.

`Website / beurs → Try the OS → korte onboarding → één werkruimte met vier Milo’s → waarde ervaren → gesprek over Custom OS`

- Gebruik in de publieke interface “Try the OS” / “Probeer het OS”. “POC” is interne projecttaal en legt de waarde niet uit.
- Browser en installatie zijn hetzelfde product, met dezelfde werkruimte en gegevens. Geen twee aanbiedingen of gescheiden instaproutes suggereren.
- Houd de hoofdactie direct zichtbaar na een korte belofte. Geen extra alinea’s, grote tellerblokken of introductieanimatie tussen uitleg en starten.
- Leg mogelijkheden uit met concrete handelingen en zichtbare resultaten. Benoem apart welke onderdelen persoonlijke inrichting vragen.
- “Human creativity powered by AI technology” is de merkgedachte bij creatief werk. De eerste productuitleg blijft de korte belofte hierboven.

## 2. Visuele basis

- Zwart als gezamenlijke visuele basis, met bijna zwarte panelen, witte hoofdinformatie en goed leesbare grijze secundaire tekst. Geen zichtbare donkerblauwe paginavlakken of blauwe waas over het logo.
- Behoud het echte SocialNow-logo, de 3D-afwerking, de vier goedgekeurde Milo’s en de herkenbare glanzende knoppen. Een volwassenere indeling mag dit karakter niet wegpoetsen.
- Gebruik **TT Norms** waar de gelicentieerde bestaande bestanden beschikbaar zijn; systeem-sans als fallback. Geen nieuw lettertype per module.
- Koppen iets zwaarder dan gewone interface-tekst. Richting: 600–700 voor koppen, 400–500 voor lopende tekst. Sterk, zakelijk en informatief. Vermijd lange teksten in kapitalen.
- Websitekoppen mogen expressiever zijn; in het OS staat de taak centraal. Geen enorme marketingkop boven een invoerveld of tabel.
- Subtiele glans, dunne randen en kleine kleurdetails geven diepte. Glows en scanlines niet over lange tekst, formulieren of tabellen leggen.
- Gebruik dezelfde iconenfamilie, lijngewichten, focusstijl, paneelranden en benamingen in iedere stap.

### Gedeelde kleurafspraak

| Toepassing | Kleur | Betekenis |
| --- | --- | --- |
| Basis | `#000000` | Pagina / werkruimte |
| Paneel, richting | `#080808`–`#141414` | Rustige groepering |
| Rand, richting | `#292929`–`#333333` | Scheiding zonder zware kaders |
| Website Milo | `#25D366` | Website |
| CRM Milo | `#1965C2` | Klanten en CRM |
| Studio Milo | `#F5940D` | Content en creatie |
| Advertising Milo | `#EC1670` | Advertenties |
| Primaire actie | `#25D366` | Starten / doorgaan / bevestigen |

Rolkleur ondersteunt herkenning via icoon, badge of dun accent. Kleur is nooit de enige betekenisdrager. Kleine blauwe of magenta tekst moet op contrast worden gecontroleerd; gebruik waar nodig witte tekst met een gekleurd accent ernaast.

### Ritme en maatvoering

Aanbevolen gedeelde schaal: 4, 8, 12, 16, 24, 32 en 48 px. Compacte werkpanelen krijgen circa 16–24 px binnenruimte. Panelen circa 16–22 px afronding; actieknoppen blijven herkenbaar afgerond. Gebruik grotere tussenruimte voor een nieuw onderwerp, kleinere voor onderdelen van dezelfde taak.

Ontwerp het OS compacter dan de website. De gebruiker moet zijn invoer, relevante context en volgende actie tegelijk kunnen zien. Belangrijke bediening mag op mobiel niet onder decoratie verdwijnen.

## 3. De vier Milo’s zijn de productstructuur

| Interface | Assetrol | Herkenbare taak |
| --- | --- | --- |
| Website | `website` | De website en digitale basis |
| CRM | `crm` | Klanten en relaties |
| Studio | `content` | Content in de eigen huisstijl |
| Advertising | `ads` | Advertenties en campagne-inzicht |

- Gebruik exact de goedgekeurde personages en rolkleuren. Advertising is **magenta**; de oude groene Ads-video is geen vervanger.
- Toon de vier Milo’s samen bij de eerste productkennismaking. Daarna wordt de relevante Milo kleiner onderdeel van de taakcontext.
- Chat is de gezamenlijke bediening; vier Milo’s hoeven geen vier losstaande chatproducten te worden. Context en gemaakte keuzes blijven bewaard bij een wissel.
- Stilstaande toestand, bezig, resultaat en fout moeten begrijpelijk zijn uit tekst en interface. Een bewegende Milo alleen is geen laadstatus.
- Animatie: zacht knipperen, kleine hoofdbeweging, rustige lus, vaste camera. Geen grote sprongen, nieuwe attributen of kleurwisselingen.
- Milo’s hebben geen zichtbaar zwart rechthoekig videovlak. Gebruik echte transparantie waar de achtergrond afwijkt. Controleer lichte randen en donkere delen van het gezicht.
- Respecteer verminderde beweging en stop media buiten beeld of in een verborgen tab. Een stilstaand goedgekeurd beeld blijft beschikbaar als fallback.
- De Advertising-animatie is als transparante MOV en WebM geëxporteerd en technisch gecontroleerd. Gebruik `ads-magenta-alpha.mov` (Safari) of `ads-magenta-alpha.webm` (Chromium), met `ads-magenta.webp` als fallback. Regie ontvangt de publicatiebevestiging apart; niet zelf een andere Milo genereren.

## 4. Knoppen, navigatie en feedback

- Eén duidelijke primaire actie per taakgebied, groen en met leesbare donkere tekst. De bestaande SocialNow-glans en pijl mogen blijven, op een compacte knop.
- Secundaire acties krijgen een rustige donkere knop of tekstlink. “Install the OS” blijft secundair naast “Try the OS”.
- In het OS beschrijft het label de volgende handeling: bijvoorbeeld “Continue”, “Connect Odoo”, “Create content”. Vermijd meerdere concurrerende groene knoppen binnen één formulier.
- Beschrijf een niet-beschikbare actie met een reden. Laat een klik nooit stil verdwijnen.
- Tijdens verwerking: toon de daadwerkelijke status; voorkom dubbel versturen. Bij fouten: behoud de invoer en bied een concrete herstelactie.
- Laat navigatie en teruggaan de werkcontext behouden. Formulieren verliezen geen gegevens door een Milo- of tabwissel.
- Focus moet zichtbaar zijn. Richting voor aanraakdoelen: minimaal 44 × 44 px, ook als het zichtbare icoon kleiner is.
- Geen zwevende helpknop over de primaire actie, chatinvoer of mobiele navigatie.

## 5. Onboarding en dagelijks gebruik

- Vraag alleen gegevens die nodig zijn voor de volgende werkende stap. Toon overige vragen op het moment dat ze relevant worden.
- Gebruik gewone bedrijfswoorden. Een bezoeker op de Odoo-beurs hoeft de interne architectuur of modelnamen niet te begrijpen.
- Maak duidelijk welke werkruimte en welk bedrijf actief zijn. Toon de status van Odoo en Meta met tekst: verbonden, niet verbonden, actie nodig of laden.
- Leg bij een koppeling kort uit wat de gebruiker ermee kan doen. Toon een mislukte koppeling niet als voltooid.
- Lege schermen geven één nuttige vervolgstap. Geen grote decoratieve grafieken om leegte op te vullen.
- Chatresultaten horen bij het werk: bijvoorbeeld een contentvoorstel, klantcontext of een concrete vervolgstap. Een promotievideo is richtinggevend voor de ervaring, geen bewijs dat iedere getoonde handeling al werkt.
- Bevestig relevante wijzigingen voordat ze gevolgen buiten het OS krijgen. Toon daarna wat werkelijk is uitgevoerd.
- Custom OS-contact sluit aan op de actuele behoefte en reeds bekende context. Vraag niet opnieuw alles wat de gebruiker al heeft ingevuld.

## 6. Website en werkvoorbeelden

- Vier Milo’s vroeg in de pagina; interactieve globe als zelfstandig merk-/productelement, geen drukke achtergrond achter alle tekst.
- Uitgelicht werk krijgt echte visuele ruimte: afwisselend tekst links/media rechts en daarna omgekeerd. Op mobiel volgt een logische leesvolgorde.
- RAVEG: brede bestaande headerafbeelding boven de drie verticale video’s. Daarna overige cases in hetzelfde rustige systeem.
- Projectpagina’s geven context, echt werk dat vergroot kan worden en een duidelijke vervolgstap. Geen klikbare kaart naar een lege detailpagina.
- Websitevoorbeelden tonen de echte live website, met **VASTIQ.AI eerst en als bestemming `https://vastiq.ai/`**. Geen screenshot als surrogaat. Wanneer embedding technisch niet is toegestaan: een duidelijke link naar de echte website.
- Een embedded website mag de paginascroll niet vasthouden: geef de bediening na maximaal circa 2,5 seconden vrij. Opnieuw bedienen kan expliciet. Op mobiel niet automatisch de swipe overnemen.
- Video’s starten visueel zonder grote play-overlays. Geluid bij hover alleen wanneer de browser dat toestaat; bied voor touch/toetsenbord een expliciete bediening in de geopende speler. Geluid stopt bij verlaten/sluiten.
- Het losse blok “See it in motion” blijft compact. De drie films ondersteunen de productuitleg en verdringen de instapactie niet.
- Behoud meerdere echte klantreviews en het bestaande footerlogo met Komen Consultancy. Alleen het losse opschrift “Samen met” vervalt.

## 7. Taal en vertrouwen

- Engels is de standaard voor de website; een duidelijke EN/NL-switch staat in de navigatie. Dezelfde voorkeur hoort bij de overgang naar het OS behouden te blijven. Regie coördineert hiervoor de technische afspraak tussen domeinen.
- Geen gedeeltelijk vertaalde formulieren: labels, foutmeldingen, lege toestanden, knoppen en installatiehulp horen bij dezelfde taal.
- Meer talen pas zichtbaar aanbieden als de betreffende gebruikersroute ook is vertaald. Verzin geen taalvoorkeur op basis van een verondersteld bezoekersland.
- Gebruik concrete, korte tekst. Vermijd “POC”, technische modelnamen en interne implementatietermen in gewone productbediening.
- Reviews, aantallen en resultaten moeten herleidbaar zijn naar hun bron. Downloads, werkruimten, klanten en omzet zijn verschillende gegevens; verwissel hun betekenis niet.
- Tarieven en mogelijkheden sluiten aan op de werkelijke instap en persoonlijke inrichting. Geen verzonnen prijzen, garanties of automatische acties presenteren.

## 8. Snelheid en controle bij oplevering

- Tekst en primaire actie zijn bruikbaar voordat zware media geladen zijn. Een logo-intro moet overgeslagen kunnen worden en terugkerende gebruikers niet ophouden.
- Laad video’s alleen wanneer relevant. Reserveer de juiste beeldverhouding zodat knoppen niet verspringen tijdens laden.
- Maak de site en app bruikbaar bij verminderde beweging, zonder hover en met een toetsenbord.
- Controleer een smal mobiel scherm en een gewone laptop: startactie, vier rollen, chatinvoer en volgende stap moeten praktisch bereikbaar zijn.
- Controleer Safari én Chromium voor transparante Milo-video’s en echte apparaten voor installatie en aanmelding.
- Meld controles precies: build/broncontrole is geen visuele browsercontrole en een statische preview bewijst geen werkende koppeling.

## 9. Verdeling over Regie en de OS-stappen

Regie bewaakt één gedeelde set tokens, assets, teksten en componentgedrag. Stappen passen de richtlijnen binnen hun bestaande scope toe; dit document geeft geen opdracht tot een onbeperkte herbouw of wijziging van andermans werkmap.

| Onderdeel | Toepassing |
| --- | --- |
| Stap 1 · Onboarding | Korte instap, zwarte basis, compacte acties, taalcontinuïteit en duidelijke koppelstatus |
| Stap 2 · Dashboard | Vier rollen en kleuren, taakgerichte panelen, echte status, Milo-assets en lege toestanden |
| Stap 3 · Studio | Oranje rolaccent, heldere invoer → verwerking → resultaat, behoud van invoer en selectie |
| Stap 4 en 5 | Regie koppelt de actuele eigenaars; dezelfde tokens, feedback en navigatie gelden binnen hun bestaande scope |
| Stap 6 · Milo en chat | Eén chatervaring, context behouden, juiste Milo per taak, begrijpelijke handelingen en resultaten |
| Website | Signature, korte belofte, groene instap, echt visueel werk en consistente overgang naar het OS |

## 10. Bron en overdracht

- Website: https://socialnow.nl/
- Werkmap website: `/Volumes/WORK/socialnow-website-saas`
- Bestaande componenten als referentie: `proposal/ui.tsx`, `proposal/os-entry.tsx`, `proposal/motion.tsx`, `proposal/experience.css`.
- Milo-assets: `/Volumes/WORK/socialnow-website-saas/public/proposal/milo/`.
- Goedgekeurde magenta still: `ads-magenta.webp`; nieuwe animatie: `ads-magenta-alpha.mov` / `ads-magenta-alpha.webm`. Oude `ads`-video’s zijn niet de nieuwe magenta animatie.
- Gedeelde visuele rolreferentie: `/Volumes/WORK/02-SOCIALNOW/ODOO/ODOO MILO'S.png`.
- Dit document: `/Volumes/WORK/socialnow-website-saas/docs/SIGNATURE-UI-UX-RICHTLIJNEN.md`.

Actuele gebruikerskeuzes zijn leidend boven oudere ontwerprichtingen. Meld afwijkingen of gedeelde afhankelijkheden aan Regie met de concrete component, route en reden.
