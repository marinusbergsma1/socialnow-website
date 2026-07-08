# 🔒 Website-beveiliging — hoe je een site (zoals socialnow.nl) dichttimmert

Praktische instructie voor het beveiligen van statische/SPA-websites, met de
concrete opzet van **socialnow.nl** als referentie. Geschreven voor sites op
**GitHub Pages** (of een vergelijkbare static host zonder eigen server-headers).

---

## 0. Het uitgangspunt

Een front-end site heeft geen database of login, dus de aanvalsoppervlakte is
klein — maar niet nul. De drie echte risico's:

1. **XSS** (kwaadaardige scripts injecteren) → afvangen met een **CSP**.
2. **Clickjacking** (jouw site in een iframe van een phishing-pagina) → afvangen
   met `frame-ancestors` / `X-Frame-Options`.
3. **Man-in-the-middle / gemengde content** → afvangen met **HTTPS + HSTS +
   `upgrade-insecure-requests`**.

De rest is hygiëne: geen secrets in de bundel, dependencies bijhouden, en
externe scripts minimaliseren.

---

## 1. Content-Security-Policy (de belangrijkste maatregel)

GitHub Pages kan **geen response-headers** zetten, dus de CSP staat als
`<meta http-equiv>` in `index.html`. Dit is de huidige, werkende policy:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  media-src 'self' https://storage.googleapis.com;
  connect-src 'self' https://feeds.behold.so;
  font-src 'self' data:;
  frame-src 'self' https:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests
" />
```

**Regel per regel — waarom:**

| Directive | Waarde | Reden |
|---|---|---|
| `default-src 'self'` | alleen eigen origin | veilige basis; alles wat niet expliciet is toegestaan wordt geblokkeerd |
| `script-src 'self' 'unsafe-inline'` | eigen + inline | Vite genereert een kleine inline bootstrap; `'unsafe-inline'` is de zwakke plek — zie hardening hieronder |
| `img-src 'self' data: https:` | eigen + data-URI + elke https | cases/screenshots komen van meerdere CDN's; `data:` voor inline SVG's |
| `media-src` | eigen + googleapis | video's (o.a. Milo) staan lokaal; googleapis voor externe media |
| `connect-src 'self' feeds.behold.so` | eigen + Instagram-feed | de enige externe fetch die de site doet |
| `frame-src 'self' https:` | eigen + https | de WebShowcase toont live sites/mirrors in een iframe |
| `object-src 'none'` | niets | geen Flash/plugins, ooit |
| `base-uri 'self'` | eigen | voorkomt `<base>`-hijack |
| `form-action 'self'` | eigen | formulieren mogen alleen naar de eigen site posten |
| `upgrade-insecure-requests` | — | forceert http→https op alle sub-requests |

**Wat je NIET toevoegt tenzij echt nodig:** `unsafe-eval`, wildcard `*` in
`script-src`, of `data:` in `script-src` — dat opent XSS wagenwijd.

### CSP aanpassen als je iets nieuws toevoegt
- **Nieuw extern beeld-CDN?** valt al onder `img-src https:` → niets doen.
- **Nieuwe externe API (fetch/XHR)?** voeg de origin toe aan `connect-src`.
- **Nieuw extern script (bijv. analytics)?** voeg de origin toe aan `script-src`
  — en overweeg of het écht moet (elke externe origin is een vertrouwensrelatie).
- **Nieuwe embed-bron in de showcase?** die valt al onder `frame-src https:`.

### Hardening-pad (optioneel, hogere score)
`'unsafe-inline'` bij `script-src` is de enige echte zwakte. Weg te werken met
**nonces of hashes**, maar dat vereist een build-stap die de inline-scripts
hasht en in de CSP zet. Voor een marketingsite is de huidige policy ruim
voldoende; doe dit alleen bij een strengere audit-eis.

---

## 2. Clickjacking & iframe-beleid

Twee kanten:

**a) Voorkomen dat JOUW site in een kwaadaardig iframe komt.** Op een host met
headers zet je `X-Frame-Options: SAMEORIGIN` of CSP `frame-ancestors 'self'`.
Op GitHub Pages kan dat niet via headers; de meta-CSP ondersteunt
`frame-ancestors` **niet** (browsers negeren het in een meta-tag). Accepteer dit
of migreer naar een host mét headers (Cloudflare Pages/Netlify) als
clickjacking een reëel risico is.

**b) Andermans site in JOUW iframe tonen** (de WebShowcase). Veel sites blokkeren
dat zelf met `X-Frame-Options: DENY/SAMEORIGIN`. Zo lost socialnow.nl dat op:
- **RAVEG** stuurt `DENY` → we tonen een **beeld-fallback** (`noEmbed: true` in
  `data/projects.ts`) i.p.v. een dode iframe.
- **VASTIQ** stuurt `SAMEORIGIN` → we hosten een **same-origin mirror** in
  `public/vastiq-preview/` en embedden die (`previewUrl`), zodat het
  X-Frame-Options van het origineel niet meer telt.

> **Advies voor de klant-kant:** wil je dat jouw site elders embedbaar is, zet
> dan `Content-Security-Policy: frame-ancestors 'self' https://socialnow.nl` in
> plaats van een harde `X-Frame-Options: DENY`.

---

## 3. Transport & extra response-headers

Op een host mét headers (aanrader voor productie) zet je minimaal:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
X-Frame-Options: SAMEORIGIN
```

Op socialnow.nl staat `Referrer-Policy` al als meta-tag:
```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```
De rest kan alleen via een echte host-config. GitHub Pages forceert HTTPS wel
automatisch als je "Enforce HTTPS" aanzet in de repo-settings — **doe dat altijd.**

---

## 4. Secrets & build-hygiëne

- **Nooit** API-keys, tokens of wachtwoorden in front-end code. Alles in de
  bundel is publiek leesbaar. Een sleutel die de browser nodig heeft, moet een
  **publieke, gescopte** sleutel zijn (bijv. read-only feed-token).
- `.env`-bestanden met echte secrets **buiten** de repo houden (`.gitignore`).
- Vite exposeert alleen variabelen met prefix `VITE_` aan de client — zet daar
  dus nooit een geheim in.
- Controleer vóór elke commit dat er geen sleutels in de diff zitten.

---

## 5. Dependencies actueel houden

```bash
npm audit                 # bekende kwetsbaarheden tonen
npm audit fix             # veilige auto-fixes
npm outdated              # verouderde packages
```

- Draai `npm audit` maandelijks en vóór elke grote release.
- Update React/Vite/router minstens per kwartaal.
- Zet **Dependabot** aan in de repo (Settings → Security) voor automatische PR's.

---

## 6. Snelle checklist bij oplevering

- [ ] CSP-meta aanwezig en getest (geen console-CSP-errors in de browser)
- [ ] "Enforce HTTPS" aan in de host-settings
- [ ] Geen secrets in de bundel (`git grep -iE "api_key|secret|token|password"`)
- [ ] `npm audit` schoon (of bewust geaccepteerde bevindingen genoteerd)
- [ ] Dependabot aan
- [ ] iframe-embeds hebben een fallback voor sites die framing blokkeren
- [ ] `object-src 'none'` en `base-uri 'self'` in de CSP
- [ ] Externe scripts geminimaliseerd (elke er één is een vertrouwensrelatie)

---

## 7. Verifiëren

- **CSP & headers:** https://securityheaders.com (voer de live-URL in).
- **In de browser:** open DevTools → Console. Een correcte CSP geeft géén
  `Refused to load…`-fouten bij normaal gebruik. Verschijnen die wél, dan
  blokkeer je legitieme resources → betreffende origin toevoegen.
- **SSL:** https://www.ssllabs.com/ssltest/ — streef naar A/A+.
