// Voorbeeldagenda voor previews en lokaal werk, zolang de Google-sleutels nog niet in Vercel staan.
// Zet nooit iets in een echte agenda en stuurt geen uitnodigingen. Op productie staat hij uit
// (zie omgeving.mjs), zodat een echte bezoeker nooit in het niets boekt.
import { datumInZone, plusDagen, weekdag, zoneNaarUtc } from "./tijd.mjs";

// Een paar vaste bezette blokken per weekdag, zodat de pagina eruitziet als een gewone week.
const VOORBEELD = { 1: [["10:00", "11:00"], ["14:00", "15:00"]], 2: [["09:00", "10:30"]], 3: [["13:00", "14:30"]], 4: [["11:00", "12:00"], ["15:00", "16:00"]], 5: [["09:30", "10:30"]] };

export function demoAgenda(tz = "Europe/Amsterdam", { voorbeeldBezet: metVoorbeeld = true } = {}) {
  const afspraken = new Map();
  let volgnummer = 0;
  const overlapt = (a, b, c, d) => a < d && c < b;
  const actief = () => [...afspraken.values()].filter((a) => a.status !== "cancelled");

  function voorbeeldBezet(van, tot) {
    const uit = [];
    for (let d = datumInZone(van, tz); d <= datumInZone(tot, tz); d = plusDagen(d, 1)) {
      for (const [b, e] of VOORBEELD[weekdag(d)] || []) uit.push({ start: +zoneNaarUtc(d, b, tz), eind: +zoneNaarUtc(d, e, tz) });
    }
    return uit;
  }

  return {
    demo: true,
    async bezet(van, tot) {
      return [...(metVoorbeeld ? voorbeeldBezet(van, tot) : []), ...actief()].filter((b) => overlapt(b.start, b.eind, +van, +tot)).map(({ start, eind }) => ({ start, eind }));
    },
    async boekingen(van, tot) {
      return actief().filter((a) => overlapt(a.start, a.eind, +van, +tot));
    },
    async maak({ start, eind, soortId, domein }) {
      const a = { id: `demo${Date.now().toString(36)}${++volgnummer}`, start: +start, eind: +eind, soortId, domein: domein || "", aangemaakt: Date.now(), status: "confirmed", boeking: true, gastNaam: "" };
      afspraken.set(a.id, a);
      return a;
    },
    async nodigUit(id, { naam, email, vraag }) {
      const a = afspraken.get(id);
      Object.assign(a, { gastNaam: naam, gastEmail: email, vraag });
      return { ...a, meet: null };
    },
    async overzicht(van, tot) {
      return actief().filter((a) => overlapt(a.start, a.eind, +van, +tot)).map((a) => ({ ...a, meet: null }));
    },
    async haal(id) {
      return afspraken.get(id) || null;
    },
    async verplaats(id, { start, eind }) {
      const a = afspraken.get(id);
      Object.assign(a, { start: +start, eind: +eind });
      return a;
    },
    async verwijder(id) {
      const a = afspraken.get(id);
      if (a) a.status = "cancelled";
    },
  };
}
