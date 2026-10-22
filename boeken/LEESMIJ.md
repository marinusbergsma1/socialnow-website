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

Werktijden: maandag tot en met vrijdag, 10.00 tot 18.00 Europe/Amsterdam (`config.mjs`).

Vrij/bezet komt uit alle agenda's in het Google-account (`calendarList` plus `freeBusy`), bij elke
paginaweergave en vlak voor het boeken opnieuw. Alleen de agendalijst blijft hooguit een minuut in het
geheugen; feestdagen, verjaardagen en weeknummers van Google zelf tellen niet mee. Staat de pagina langer
dan een minuut open, dan haalt hij de vrije tijden stil opnieuw op.

Privacy: de publieke kant (`/api/slots`) leest alleen `freeBusy` en geeft alleen vrije begintijden terug.
Geen titels, namen, locaties en ook niet dat er op een tijd iets staat: een bezet slot verschijnt gewoon niet.
`events` wordt alleen gelezen voor afspraken die deze pagina zelf heeft gemaakt (racecontrole bij boeken,
de eigen beheerlink van de bezoeker, en het beheer-endpoint hieronder).

Dubbel boeken: vlak voor het aanmaken wordt vrij/bezet opnieuw opgehaald. Daarna wordt de afspraak stil
aangemaakt, wordt gecontroleerd of er op dezelfde seconde een andere boeking binnenkwam (de oudste wint),
en pas dan gaan de uitnodigingen uit. Een fout bij het ophalen van vrij/bezet telt als bezet.

Zonder Google-sleutels draait elke preview en `npm run dev` met een voorbeeldagenda. Op productie staat die
uit: daar ziet een bezoeker dan de noodroute (`BOEK_NOODROUTE_URL`) of het mailadres.

## Beheer-endpoint voor Marinus (het OS leest dit server-side)

| | |
|---|---|
| URL | `GET https://book.socialnow.nl/api/beheer?van=YYYY-MM-DD&tot=YYYY-MM-DD` (beide optioneel; standaard vandaag tot en met over 14 dagen, maximaal 31 dagen) |
| Inlog | header `Authorization: Bearer <BOEKING_BEHEER_SLEUTEL>`; dezelfde waarde in Vercel bij `socialnow-boeken` en bij de OS-app |
| Fouten | `401` verkeerde of geen sleutel, `503` sleutel of agenda niet ingesteld, `429` te vaak, `502` agenda onbereikbaar |
| Cache | `no-store` |

```json
{
  "ok": true,
  "tijdzone": "Europe/Amsterdam",
  "van": "2026-10-22",
  "tot": "2026-11-05",
  "slots": [
    { "start": "2026-10-26T10:00:00+01:00", "eind": "2026-10-26T10:20:00+01:00", "soort": "security" },
    { "start": "2026-10-26T10:00:00+01:00", "eind": "2026-10-26T10:30:00+01:00", "soort": "intro" }
  ],
  "calls": [
    {
      "id": "abc123",
      "naam": "Sanne de Vries",
      "email": "sanne@voorbeeld.nl",
      "soort": "security",
      "soortTitel": "Gratis veiligheidscall",
      "start": "2026-10-27T14:00:00+01:00",
      "eind": "2026-10-27T14:20:00+01:00",
      "vraag": "voorbeeld.nl",
      "meet": "https://meet.google.com/xxx-xxxx-xxx"
    }
  ]
}
```

`slots` staan per soort call (een beginmoment kan dus twee keer voorkomen, met een ander eind).

## Env-namen (waarden alleen in Vercel, nooit in code of chat)

| Naam | Verplicht | Wat |
|---|---|---|
| `GOOGLE_CLIENT_ID` | ja | OAuth-client (type Desktop app) |
| `GOOGLE_CLIENT_SECRET` | ja | idem |
| `GOOGLE_REFRESH_TOKEN` | ja | uit `npm run token` |
| `GOOGLE_CALENDAR_ID` | nee | standaard `primary` van het account dat toestemming gaf |
| `GOOGLE_BUSY_CALENDARS` | nee | extra agenda-id's (komma's) die ook als bezet tellen |
| `BOEKING_BEHEER_SLEUTEL` | ja, voor het beheer | minstens 24 tekens; dezelfde waarde in de OS-app |
| `BOEK_GEHEIM` | ja | lange willekeurige tekst voor de verzet- en annuleerlink |
| `BOEK_BASIS_URL` | nee | standaard `https://book.socialnow.nl` |
| `BOEK_TEAM_GASTEN` | nee | extra mailadressen die de uitnodiging ook krijgen |
| `BOEK_NOODROUTE_URL` | nee | Google-afsprakenpagina als terugval |

## Lokaal

```bash
npm test        # 23 proeven: slots, dubbel boeken, tijdzones, werktijden, alle agenda's, privacy, beheer
npm run dev     # http://localhost:5191 met voorbeeldagenda
```
