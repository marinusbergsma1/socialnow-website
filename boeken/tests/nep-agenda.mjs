// Agenda in het geheugen met dezelfde vorm als lib/google.mjs, voor de proeven.
// `wachtNaBezet` laat twee boekingen tegelijk door de vrij/bezet-controle lopen, zoals bij
// twee bezoekers die op dezelfde seconde op hetzelfde moment klikken.
export function nepAgenda({ bezet = [], wachtNaBezet = null } = {}) {
  const afspraken = new Map();
  let klok = 1_000;
  let volgnummer = 0;

  const actief = () => [...afspraken.values()].filter((a) => a.status !== "cancelled");
  const overlapt = (a, b, c, d) => a < d && c < b;

  return {
    afspraken,
    actief,
    async bezet(van, tot) {
      const v = +van, t = +tot;
      const uit = [
        ...bezet.map((b) => ({ start: Date.parse(b.start), eind: Date.parse(b.eind) })),
        ...actief().map((a) => ({ start: a.start, eind: a.eind })),
      ].filter((b) => overlapt(b.start, b.eind, v, t));
      if (wachtNaBezet) await wachtNaBezet();
      return uit;
    },
    async boekingen(van, tot) {
      return actief()
        .filter((a) => overlapt(a.start, a.eind, +van, +tot))
        .map((a) => ({ id: a.id, start: a.start, eind: a.eind, aangemaakt: a.aangemaakt }));
    },
    async maak({ start, eind, titel, beschrijving, soortId }) {
      const id = `nep${++volgnummer}`;
      const a = { id, start: +start, eind: +eind, titel, beschrijving, soortId, aangemaakt: klok++, status: "confirmed", gasten: [] };
      afspraken.set(id, a);
      return { id, start: a.start, eind: a.eind, aangemaakt: a.aangemaakt };
    },
    async nodigUit(id, { gasten, beschrijving }) {
      const a = afspraken.get(id);
      a.gasten = gasten;
      a.beschrijving = beschrijving;
      return { id, start: a.start, eind: a.eind, meet: `https://meet.google.com/nep-${id}` };
    },
    async haal(id) {
      const a = afspraken.get(id);
      if (!a) return null;
      return { id, start: a.start, eind: a.eind, soortId: a.soortId, status: a.status, boeking: true, gastNaam: a.gasten[0]?.naam || "" };
    },
    async verplaats(id, { start, eind, beschrijving }) {
      const a = afspraken.get(id);
      a.start = +start;
      a.eind = +eind;
      if (beschrijving) a.beschrijving = beschrijving;
      return { id, start: a.start, eind: a.eind };
    },
    async verwijder(id) {
      const a = afspraken.get(id);
      if (a) a.status = "cancelled";
    },
  };
}
