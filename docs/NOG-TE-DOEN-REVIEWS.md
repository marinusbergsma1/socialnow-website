# Nog te doen: reviews met wat het OS oplevert

Opgeschreven op 20 augustus 2026, op verzoek van Marinus.

## Wat er nu staat

De reviewsectie op de startpagina toont drie kaarten. Ellen Sluijs van
kWh Garant staat op de plek waar eerst Niels Groen van RAVEG stond. Haar
kaart heeft nog geen quote, want die heeft ze niet gegeven. Zolang die er
niet is toont de kaart alleen de cijfers. Onder haar naam komt niets te
staan wat zij niet zelf geschreven heeft.

Niels Groen en RAVEG staan nergens meer op de site.

## Wat er nog moet gebeuren

**De reviews worden resultaatkaarten.** Niet een quote, maar de cijfers
die het OS oplevert. Twee klanten om mee te beginnen:

- **kWh Garant** — thuisbatterijen, Veenendaal
- **Verduurzaming Brigade (VDZ)** — verduurzaming

Voor elke klant is nodig:

1. Welke cijfers we mogen laten zien. Alleen wat de klant goedkeurt.
2. Waar die cijfers vandaan komen in het OS, zodat ze zichzelf bijwerken.
3. De regel eronder: dat dit de data is die we mogen delen en dat de
   meting uit onze eigen systemen komt.

## Waar het technisch al klaar voor staat

`public/data/klantcijfers.json` bestaat al. Het OS schrijft daar de
stand naartoe, de site haalt dat bestand bij elk bezoek opnieuw op. Een
nieuwe stand staat er dus meteen op zonder dat de site opnieuw gebouwd
hoeft te worden. Per klant staan er drie cijfers in met een label.

## Wat er nog ontbreekt

- De quote van Ellen, als ze er een wil geven.
- De koppeling die het OS die cijfers laat wegschrijven.
- Het contactmoment met VDZ over welke cijfers naar buiten mogen.
