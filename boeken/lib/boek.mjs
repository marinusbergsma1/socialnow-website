// Stub: boekt zonder enige controle.
export async function boek({ agenda, soortId, start, naam, email, vraag }) {
  const s = Date.parse(start), e = s + 30 * 60e3;
  const a = await agenda.maak({ start: s, eind: e, titel: "Call", beschrijving: vraag, soortId });
  const u = await agenda.nodigUit(a.id, { gasten: [{ naam, email }], beschrijving: vraag });
  return { id: a.id, start: new Date(s).toISOString(), eind: new Date(e).toISOString(), meet: u.meet };
}
export async function verzet({ agenda, id, start }) {
  const s = Date.parse(start);
  await agenda.verplaats(id, { start: s, eind: s + 30 * 60e3 });
  return { id, start: new Date(s).toISOString() };
}
export async function annuleer({ agenda, id }) { await agenda.verwijder(id, { stil: false }); }
