# 🔍 SEO-optimalisatie — hoe je een site vindbaar maakt

Praktische instructie voor de SEO van een SPA/statische site, met de opzet van
**socialnow.nl** als referentie. SEO valt in drie lagen: **technisch**,
**on-page** en **content**. Doe ze in die volgorde — techniek eerst, want
zonder crawlbare, snelle pagina's helpt goede content niks.

---

## 1. Technische SEO (het fundament)

### 1.1 Crawlbaarheid: SPA + GitHub Pages
Een React-SPA serveert standaard alleen `/index.html`; directe bezoeken aan
`/team` of `/prijzen` geven dan een 404. Opgelost met `scripts/postbuild.mjs`
(draait automatisch na `vite build`): het kopieert `dist/index.html` naar een
echte `index.html` per route én naar `dist/404.html` als SPA-fallback.

```js
// scripts/postbuild.mjs — kort
const routes = ['diensten', 'projecten', 'prijzen', 'privacy', 'team'];
for (const route of routes) {
  mkdirSync(`dist/${route}`, { recursive: true });
  copyFileSync('dist/index.html', `dist/${route}/index.html`);
}
copyFileSync('dist/index.html', 'dist/404.html');
```

**Nieuwe route toevoegen?** → zet 'm ook in de `routes`-array hierboven, anders
geeft een directe URL een 404 en indexeert Google 'm niet.

### 1.2 robots.txt (`public/robots.txt`)
```
User-agent: *
Allow: /
Sitemap: https://socialnow.nl/sitemap.xml
Disallow: /api/
Disallow: /_
```
Simpel en juist: alles mag geïndexeerd worden, met een verwijzing naar de
sitemap. Interne/technische paden geblokkeerd.

### 1.3 sitemap.xml (`public/sitemap.xml`)
Lijst met alle publieke URL's + `lastmod`. **Bij elke nieuwe pagina bijwerken**
en de datum verhogen. Dien de sitemap in bij **Google Search Console** en **Bing
Webmaster Tools**.

### 1.4 Canonical URL's
Elke pagina wijst met `<link rel="canonical">` naar zijn eigen absolute URL —
dit voorkomt duplicate-content-straf. De `useSEO`-hook (`hooks/useSEO.ts`) zet
dit per route dynamisch:
```ts
canonical.href = `${BASE_URL}${path}`;
```

### 1.5 HTTPS & snelheid
- HTTPS is een rankingfactor → "Enforce HTTPS" aan (zie beveiliging-doc).
- **Core Web Vitals** (LCP, INP, CLS) zijn rankingfactoren → zie het
  performance-doc. Snelheid en SEO zijn niet los te zien.

---

## 2. On-page SEO (per pagina)

### 2.1 Dynamische meta-tags met `useSEO`
Elke route roept de hook aan met een unieke titel + beschrijving:
```ts
useSEO({
  title: 'Team',
  description: 'Het team achter de AI: acht specialisten in Amsterdam…',
  path: '/team',
});
```
De hook zet `document.title`, `meta[description]`, `og:title/description/url` en
de canonical. **Elke pagina hoort een unieke titel en beschrijving te hebben** —
nooit twee pagina's met dezelfde.

**Regels:**
- **Title:** 50–60 tekens, belangrijkste keyword vooraan, merknaam achteraan.
  `Team | SocialNow`.
- **Description:** 140–160 tekens, wervend, met een impliciete call-to-action.
  Geen keyword-stuffing.

### 2.2 Semantische HTML & koppenstructuur
- **Precies één `<h1>` per pagina** met het hoofd-keyword.
- Daarna een logische `<h2>`/`<h3>`-hiërarchie — sla geen niveaus over.
- Gebruik `<section>`, `<nav>`, `<main>`, `<footer>` i.p.v. kale `<div>`'s.
- Let op: de VHS-titelstijl staat op `h1/h2/h3` — puur visueel, verandert de
  semantiek niet.

### 2.3 Afbeeldingen
- **Altijd een beschrijvende `alt`** (behalve puur decoratieve beelden, die
  `aria-hidden` + lege `alt` krijgen — zoals de Milo-animaties).
- Bestandsnamen met keywords: `raveg-hairstyling-hero.webp`, niet `IMG_2931.png`.
- WebP-formaat (zie performance-doc) — sneller = beter voor SEO.
- `width`/`height` of `aspect-ratio` zetten → voorkomt layout-shift (CLS).

### 2.4 Interne links
- Link tussen pagina's met **beschrijvende ankertekst** ("bekijk onze
  [cases]", niet "klik hier").
- Elke belangrijke pagina moet vanaf de homepage in ≤2 klikken bereikbaar zijn.

### 2.5 Open Graph & Twitter Cards (social sharing)
Staan in `index.html` en worden per route door `useSEO` overschreven. Zorgt voor
een mooie preview bij delen op WhatsApp/LinkedIn/X:
```html
<meta property="og:image" content="https://socialnow.nl/images/og-socialnow.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```
De OG-image moet **1200×630** zijn en een absolute URL hebben.

---

## 3. Structured data (Schema.org / JSON-LD)

Helpt Google je entiteit te begrijpen en levert rich results (sterren,
sitelinks, kennispaneel). socialnow.nl heeft al **2 JSON-LD blokken** in
`index.html`. Voor een marketing-agency zijn de relevante types:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SocialNow",
  "url": "https://socialnow.nl",
  "logo": "https://socialnow.nl/images/og-socialnow.jpg",
  "foundingDate": "2021",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Amstelstraat 43G",
    "addressLocality": "Amsterdam",
    "addressCountry": "NL"
  },
  "sameAs": ["https://www.instagram.com/socialnow.nl/"]
}
</script>
```
Andere nuttige types voor deze site: `LocalBusiness` (lokale SEO Amsterdam),
`FAQPage` (de FAQ-sectie → kans op rich snippet), `BreadcrumbList`.

**Valideer altijd** met https://search.google.com/test/rich-results.

---

## 4. Content-SEO (de lange termijn)

- **Keyword-onderzoek eerst:** waar zoekt de doelgroep op? ("AI marketing bureau
  Amsterdam", "website laten maken AI"). Eén hoofd-keyword per pagina.
- **Match de zoekintentie:** informatief vs. commercieel vs. transactioneel.
- **Uniek, waardevol, actueel.** Dunne of gedupliceerde content wordt afgestraft.
- **E-E-A-T** (Experience, Expertise, Authority, Trust): toon echte cases, echte
  teamleden, echte cijfers — precies wat de projecten- en teampagina doen.
- **Lokale SEO:** Google Business Profile aanmaken en compleet invullen,
  NAP-gegevens (Naam/Adres/Telefoon) consistent op de site en het web.

---

## 5. Meten & bijsturen

| Tool | Waarvoor |
|---|---|
| **Google Search Console** | indexatie, zoekvertoningen, klikken, crawl-fouten, sitemap indienen |
| **Bing Webmaster Tools** | idem voor Bing |
| **PageSpeed Insights** | Core Web Vitals per pagina (SEO + snelheid) |
| **Rich Results Test** | structured data valideren |
| Ahrefs / SEMrush (betaald) | keyword-tracking, backlinks, concurrentie |

**Ritme:** Search Console wekelijks checken op crawl-fouten en dalende
posities; sitemap opnieuw indienen na grote wijzigingen.

---

## 6. Checklist bij een nieuwe pagina

- [ ] Route toegevoegd aan `scripts/postbuild.mjs`
- [ ] `useSEO()` aangeroepen met unieke title + description + path
- [ ] Precies één `<h1>` met het hoofd-keyword
- [ ] Logische `<h2>/<h3>`-structuur
- [ ] Alle afbeeldingen `alt` + WebP + afmetingen
- [ ] Toegevoegd aan `public/sitemap.xml` (+ `lastmod` bijgewerkt)
- [ ] Interne links van/naar de pagina met goede ankertekst
- [ ] Structured data waar relevant, gevalideerd
- [ ] Na deploy: URL indienen in Search Console
