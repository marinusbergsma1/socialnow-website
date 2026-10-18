# Overdracht: appwand op socialnow.nl (18 oktober 2026)

Sessie app-wand, tak `claude/app-wand-b917e3`, worktree `.claude/worktrees/app-wand-b917e3`.
Coördinator local_8c3c0d73-cf04-4c14-b117-959827a487d8, integrator local_dddd63a9-7334-4604-91aa-d04bd53b681e.

## Opdracht
Sectie "Drie manieren om te beginnen" (Odoo, Zernio, SocialNow; "Je bedrijf. Goed geregeld.") in
`proposal/FreeWebsite.tsx` vervangen door een grote appwand: filterpillen per categorie, logotegels
(wit op zwart, kleur bij hover), teller "N apps", label "In het OS" of "Via API te koppelen",
daaronder "Mis je een app? Plan een call" via `openPlanCall()` uit `proposal/PlanCall.tsx`.

## Vaste regels (woordelijk overnemen bij herstart)
Lees LIVEGANG.md (bento-tegels, vertalingen, commit nooit public/documenten/*.pdf). Werk in je eigen worktree;
raak de hoofdcheckout niet aan. Eerlijk zijn: alleen "In het OS" voor wat echt geïntegreerd is, de rest
"Via API te koppelen". Logo's alleen uit legitieme bronnen, met bron vastgelegd. Geen emoji, nooit Orbis,
geen PR-acties (Marinus wil geen extra GitHub-mail). Zelfherstel: houd `docs/overdracht/app-wand.md` bij;
als je context twee keer is samengevat, start jezelf vers via `mcp__ccd_session__start_session` met deze
regels woordelijk. Rapporteer kort, in het Nederlands, zonder streepjes.

## Bronnen
- Onderzoek: `/Volumes/WORK/02-SOCIALNOW/01_WEBSITE/integraties-onderzoek-20261018/`
  (`onderzoek-bedrijf.json`, `onderzoek-marketing.json`, `onderzoek-ai-werk.json`).
- Generator: `scripts/apps-genereer.mjs` leest die drie bestanden en schrijft `proposal/apps.ts`.
- Logo's: `public/images/apps/<slug>.svg`, bronnen in `public/images/apps/BRONNEN.md`.

## Stand
- [x] Sectie gevonden: `proposal/FreeWebsite.tsx` (kop, drie kaarten en de notice onder WebsiteExamples).
- [x] Component `proposal/AppWand.tsx` plus `proposal/app-wand.css` (getest op 1440 en 390 met proefdata; Plan een call opent het paneel met Koppelingen aangevinkt)
- [x] Generator `scripts/apps-genereer.mjs` (Simple Icons 16.35.0 via `npm pack` in de scratchpad, niet als afhankelijkheid)
- [x] `proposal/apps.ts` uit het echte onderzoek: 215 apps, 36 In het OS, 115 met logo. Niet op de wand (geen officiële API): ChatGPT, Midjourney, Suno, CapCut, Loom
- [x] Logo's alleen uit Simple Icons 16.35.0 en BRONNEN.md. HubSpot, Cloudflare (logo alleen met schriftelijke toestemming) en MiniMax (eigen licentie) zijn bewust teksttegels
- [x] Vertalingen in alle negen `proposal/i18n/*.json` (prerender controleert Engels)
- [x] Build groen, `public/documenten` teruggezet
- [x] Schermafdrukken 390, 1024, 1440 in NL en EN in `docs/schermafdrukken/app-wand-20261018/` (plus 1440 alle apps en 390 filter AI). Opnemen: `sn-taal`-cookie per taal, vaste header verbergen
- [ ] Push, sha melden aan integrator en coördinator

## Werkwijze voorbeeld
Poort 4330 is bezet door een andere sessie (vastiq-preview in vite.config), dus `npm run dev` faalt. Ik bekijk de productiebuild met
de tijdelijke launch-config `app-wand-dist` (vite preview op 4391); die regel in `.claude/launch.json` niet committen.

## Keuzes
- Categorieën van het onderzoek naar de tien pillen: hr_planning en developer_hosting naar Werk & samenwerking, reviews naar Analytics & SEO, betalen_bank naar E-commerce & betalen.
- Dubbelingen: eerste vermelding wint (volgorde bedrijf, ai-werk, marketing), dus Slack en Zapier bij Werk, Dropbox en Box bij Opslag.
- Eerste weergave: 24 tegels (telefoon 15), alleen apps die In het OS zijn staan vooraan; "Toon alle 215 apps" klapt uit.

## Vervolg (niet gedaan)
- Officiële SVG's voor de 100 teksttegels (Salesforce, Slack, LinkedIn, OpenAI, Zernio, Exact, Mollie, Microsoft) via hun merkpagina's, per merk met toestemming of volgens hun regels.
- De oude CSS van de drie kaarten in `proposal/free-website.css` (`sn-fw-offers`, `sn-studio-preview`) is nu ongebruikt.
