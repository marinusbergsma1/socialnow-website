# Livegang socialnow.nl

Gedeelde werkmap voor alle chats die aan socialnow.nl werken.
Map: `/Volumes/WORK/02-SOCIALNOW/01_WEBSITE/socialnow-livegang`, tak `livegang`.
Een orkestratielaag neemt `livegang` over naar `main`. Een push naar `main` publiceert direct via GitHub Pages.

## Afspraken

| Regel | Waarom |
|---|---|
| Werk op tak `livegang` in deze map, of in een eigen featuretak vanaf `livegang` | één plek waar alles samenkomt |
| Controleer vóór elke commit: `git fetch`, tak, HEAD, `git status` | andere chats schrijven in dezelfde map |
| Commit alleen je eigen paden: `git commit -- <paden>` | geen werk van anderen meenemen |
| Nooit `public/documenten/*.pdf` meecommitten na `npm run build` | de build schrijft die bestanden opnieuw |
| Nieuwe teksten ook in `proposal/i18n/en.json`, `de.json`, `fr.json` | de site draait in meerdere talen |
| Publiceren naar `main` doet alleen de orkestratielaag | gecontroleerde livegang |
| Werk je eigen regel in de tabel hieronder bij | de orkestratie ziet wie waaraan werkt |
| Homepage-secties zijn bentogrids: gebruik `proposal/Bento.tsx` (`Bento`, `Tegel`, `BentoFilm`) en `proposal/bento.css`. Kort kopje met groene stip boven elke tegel, weinig tekst per tegel, tegels in wisselende maten (breed 3, 4, 6, 8 of 12), pillen van de hero. Geen eigen sectiekoppen of volle-breedte-tekstblokken meer. Uitleg bovenin `proposal/Bento.tsx` | één tegeltaal zoals het landingsscherm (Marinus, 28 sep: "net zoals de homepage wanneer je daarop landt") |

## Wie werkt waaraan

| Chat | Onderdeel | Stand |
|---|---|---|
| Responsive tussenruimte (8 oktober 2026) | `proposal/product-start.css`: ruimte tussen de downloadrij, producttitel en vier OS-kaarten op mobiel/tablet; eigen tak `fix/hero-spacing-20261008` | gecontroleerd op 360–1440 px, inclusief 700/701 en 1099/1100; NL/EN/DE/FR op 390 en 1440 px zonder horizontale overflow |
| Teamstrook, prijzen en team (sessie 5c900cd2) | teamstrook, /prijzen (OS op maat vanaf €10.000, pakketten +€2.000), /team (bedankje partners, Head of-functies, system experts) | live in main 3e18ff4; wacht op namen en logo's van de partnerbedrijven |
| Website header: persoonlijk verhaal en Odoo product (regie homepage-upgrade, sessie 5c0f2f30) | homepage met storytelling: verhaal met tijdlijn onder de hero, partner-CTA met Michelle, scrollfix live sites, volgorde van de secties; bestanden `proposal/pages.tsx` (Home), `proposal/Verhaal.tsx`, `proposal/Deuren.tsx`, `proposal/LiveWebsites.tsx`, `proposal/experience.css`; featuretak `feat/verhaal-homepage` vanaf `livegang`. Werkorder: `~/Downloads/website-verhaal-2026-09-28/WERKORDER.md` | live in main 8154e0d (ronde 3: verhaal als compacte bento met film, Day & Nite, hero-regel Odoo product, cases, site-audit, mediasliders). Nieuw werk: eigen tak vanaf livegang, melden bij WINACTIE LIVE |
| Verhaalfilm (hulpchat van de homepage-regie, chip) | HyperFrames-film van het verhaal, EN en NL; alleen `public/video/verhaal/*`; tak `claude/verhaalfilm` | live in main 8154e0d (claude/verhaalfilm 8815064) |
| Cases Il Gordo en VASTIQ (hulpchat van de homepage-regie, chip) | nieuwe case-kaarten; `proposal/FeaturedWork.tsx`, `data/projects.ts`, `public/images/cases/*`, `proposal/cases.css`; tak `claude/cases-ilgordo` | live in main 8154e0d (bento, claude/cases-ilgordo) |
| Site-audit op het verhaal (hulpchat van de homepage-regie, chip) | pagina's buiten de homepage in lijn met het verhaal, functie Michelle; tak `claude/site-visie`; stemt /team af met de teamchat | live in main 8154e0d (claude/site-visie 9240894); open beslissingen in `~/Downloads/website-verhaal-2026-09-28/AUDIT.md` |
| Veiligheidsbelofte hoofdchat, websitesubchat "Zet veiligheidsvideo en belofte prominent op socialnow.nl" | proposal/Veiligheid.tsx plus eigen CSS, pagina /veiligheid, public/video/veiligheid/, sleutelbelofte-PDF nl/en; blok op de homepage na Mens en AI/Vacatures, vóór "Four faces" | live in main 8154e0d (bento). Open: vertrouwensfilms 68 t/m 72 op /veiligheid, wacht op Marinus |
| Sitebrede bentogrid (eigenaar: homepage-regie, sessie 5c0f2f30) | alle homepage-secties als kleine bentogrids zoals het landingsscherm; één gedeelde tegelklasse die alle websitechats gebruiken | live in main 8154e0d: hele homepage onder de hero in tegels (cases 8154e0d, mediasliders 4ea5461) |
| Indeed en vacatures (sessie e5c17002) | Indeed-begeleiding Marinus (hij plaatst zelf, geen account of login door Claude) | referentietak `claude/vacatures` (niet naar main); functie AI-expert betalingen en bentotegel overgedragen aan `feat/ai-mens` |
| Mens en AI plus vacatures (sessie 9c8d11dd) | homepagesectie `proposal/MensEnAI.tsx` en daaronder `proposal/VacaturesBento.tsx` (Wij zoeken: AI-expert betalingen groot, partner verbindende laag en Senior AI Engineer klein, balk Alle vacatures), direct na ShowcaseFilms; pagina `/vacatures` met elf functies uit `proposal/vacatures.ts` plus JobPosting voor Google, footerlink, `docs/vacatures-indeed.md`; eigen CSS `mens-en-ai.css` en `vacatures-bento.css`; vertalingen en/de/fr; tak `feat/ai-mens` | live in main 1e49d3b (na LiveWebsites). Plek in Home mag de homepage-regie verschuiven |

| Contact via Steef (orkestratie) | `proposal/aanvragen.ts` is de enige bron voor contactmail en WhatsApp-nummer; nooit meer wa.me of mailto hard in componenten | live in main 386ac30; wacht op Steefs WhatsApp-nummer |
| Juridische links en voettekst (gauntlet-vondsten 30 sep) | A: "Alle documenten" op elke juridische pagina gaf /nl/nl/juridisch (404), `components/LegalPage.tsx`, `components/JuridischPage.tsx`; B: voettekst en filmlink half Nederlands in en/de/fr, `proposal/BrandFooter.tsx`, `proposal/ShowcaseFilms.tsx`, `proposal/i18n/*.json`; C: `scripts/check-proposal.mjs` faalt sinds 2c08bf2, `docs/WEBSITE-VOORSTEL.md`; tak `fix/juridisch-voettekst-20260930` vanaf main fef7f54 in `socialnow-juridisch-20260930` | **klaar voor main:** `fix/juridisch-voettekst-20260930` 6ea40d5 (A en B in 5022537, C in 6ea40d5; C uitgezet met exit 2 op keuze Marinus). Proeven `scripts/proef-juridisch-voettekst.mjs` (rood 117, groen 0) en `scripts/proef-check-proposal-uit.mjs` (rood 4, groen 0). Schermafdrukken 390 en 1440: `~/SocialNow-OS/_gauntlet/2026-09-30/schermafdrukken-juridisch/` |
| Statement één zin (sessie "Ontwerp nieuwe UI/UX voor het OS", de39cb) | `proposal/Statement.tsx`, `proposal/statement.css`: de kapitalenlijst wordt één rustige zin, "automated systems." groen, lijn met gratisregel en SaaS-regel (optie A uit https://claude.ai/artifact/QQAFnNkEJ1VkMtadDZLuxH); proef `scripts/proef-statement.mjs` (rood 4 op cb2a738, groen 0); tak `feat/statement-een-zin` | live in main na PR |
| Snelheid: JavaScript en lettertypes (30 sep, "WIL ECHT INSTANT LOADING") | eerste script alleen header en hero: secties onder de vouw en pagina's via `proposal/later.tsx`, andere pagina's uit `pages.tsx` naar `proposal/paginas.tsx`, woordenboek in kern en rest (`scripts/woordenboek-split.mjs`), TT Norms als woff2 met preload, landvraag start in `index.html`; regels in `docs/SNELHEID-OPTIMALISATIE.md` paragraaf 0; proef `scripts/proef-bundel.mjs` | live in main (30 sep, na 27f20be en cd379f4); de prerender laadt eerst alles via `allesVooraf()` |

## Orkestratie

Enige publiceerder naar `main` sinds 28 sep 2026 02:50: chat **WINACTIE LIVE** (sessie `local_63cc58ba-6cf5-4974-838d-603540aa2cc4`). "WEBSITE LIVE" (sessie 87dc51e7) heeft het publiceren overgedragen. Klaar voor main? Push je eigen tak en stuur WINACTIE LIVE één bericht met tak, sha, paden en schermafdrukken op 390 en 1440.

| Wat | Stand |
|---|---|
| Live op socialnow.nl | main 8154e0d (28 sep 02:42, deploy geslaagd): hele homepage in bentotegels (verhaal met film, deuren, cases, live sites, Mens en AI, vacatures, veiligheid, het OS, mediasliders, diensten, social, vragen), site-audit op negen pagina's, contact via Steef |
| Klaar voor main melden | push je tak, zet je regel op "klaar voor main" met de commit, stuur WINACTIE LIVE een bericht |
| Publiceren | uit een schone kloon, na `npm ci`, `npm run build`, `public/documenten` teruggezet, controle op 390 en 1440 in vier talen |
| Open takken buiten livegang | `claude/gratis-balk-sterker` (3c8dcad), `claude/compassionate-bell-3xnidu`, `claude/clever-gates-e87oqu`, `claude/trusting-brown-pgz2a2`, `claude/wonderful-mendel-7alecg`, `claude/determined-lamport-ew9xvq`, `claude/youthful-gauss-br73n7` (26 sep, vóór de bento); wachten op akkoord Marinus, niet zonder hem naar main |
| Eindvideo Odoo Experience | komt pas op de site na akkoord van Marinus; plek met hem afstemmen, dan via livegang |
