# Boeken: eigen boekingspagina van SocialNow

Een SocialNow-versie van Calendly op `book.socialnow.nl`, gekoppeld aan de Google Agenda van SocialNow.
Losse Vercel-map (project `socialnow-boeken`); de website zelf (GitHub Pages) blijft statisch.

## De boek-URL voor andere pagina's

| Gebruik | URL |
|---|---|
| Algemeen | `https://book.socialnow.nl/` |
| php2shell-check (`BOEK_URL`) | `https://book.socialnow.nl/?type=security` |
| OS-app (`APP_AFSPRAAK_URL`) | `https://book.socialnow.nl/?type=intro` |
| Kortere vormen | `https://book.socialnow.nl/security`, `/intro`, en `https://socialnow.nl/call?type=security` |

Optioneel: `lang=nl|en`, `tz=Europe/Amsterdam`, en invulhulp `naam=`, `email=`, `vraag=` (bijvoorbeeld het gecheckte domein).
Zonder `type` kiest de bezoeker zelf.

## Hoe het werkt

| Onderdeel | Bestand |
|---|---|
| Werktijden, buffer, vooruitboektijd, max dagen vooruit, soorten calls | `config.mjs` (het enige configbestand) |
| Vrije slots | `lib/slots.mjs`, `GET /api/slots?type=` |
| Boeken met dubbele controle | `lib/boek.mjs`, `POST /api/boek` |
| Verzetten en annuleren via de link in de uitnodiging | `POST /api/afspraak`, ondertekende link (`BOEK_GEHEIM`) |
| Google Agenda en Meet | `lib/google.mjs` (Calendar API v3, geen SDK) |
| Pagina EN en NL | `public/` |

Dubbel boeken: vlak voor het aanmaken wordt vrij/bezet opnieuw opgehaald. Daarna wordt de afspraak stil
aangemaakt, wordt gecontroleerd of er op dezelfde seconde een andere boeking binnenkwam (de oudste wint),
en pas dan gaan de uitnodigingen uit. Een fout bij het ophalen van vrij/bezet telt als bezet.

Zonder Google-sleutels draait elke preview en `npm run dev` met een voorbeeldagenda. Op productie staat die
uit: daar ziet een bezoeker dan de noodroute (`BOEK_NOODROUTE_URL`) of het mailadres.

## Env-namen (waarden alleen in Vercel, nooit in code of chat)

| Naam | Verplicht | Wat |
|---|---|---|
| `GOOGLE_CLIENT_ID` | ja | OAuth-client (type Desktop app) |
| `GOOGLE_CLIENT_SECRET` | ja | idem |
| `GOOGLE_REFRESH_TOKEN` | ja | uit `npm run token` |
| `GOOGLE_CALENDAR_ID` | nee | standaard `primary` van het account dat toestemming gaf |
| `GOOGLE_BUSY_CALENDARS` | nee | extra agenda-id's (komma's) die ook als bezet tellen |
| `BOEK_GEHEIM` | ja | lange willekeurige tekst voor de verzet- en annuleerlink |
| `BOEK_BASIS_URL` | nee | standaard `https://book.socialnow.nl` |
| `BOEK_TEAM_GASTEN` | nee | extra mailadressen die de uitnodiging ook krijgen |
| `BOEK_NOODROUTE_URL` | nee | Google-afsprakenpagina als terugval |

## Lokaal

```bash
npm test        # 16 proeven: slots, dubbel boeken, tijdzones
npm run dev     # http://localhost:5191 met voorbeeldagenda
```
