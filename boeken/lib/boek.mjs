// Boeken, verzetten en annuleren. De agenda komt van buiten (lib/google.mjs, lib/demo.mjs of de
// nep-agenda in de proeven), zodat de regels tegen dubbel boeken hier op één plek staan.
import { kandidaten, isVrij, overlapt, trekAf } from "./slots.mjs";

const MINUUT = 60_000;
const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;

export class BoekFout extends Error {
  constructor(code, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

const schoon = (w, max) => String(w ?? "").replace(/[\u0000-\u0008\u000b-\u001f<>]/g, "").trim().slice(0, max);

function controleerSlot(config, soortId, startMs, nu) {
  if (!Number.isFinite(startMs) || !kandidaten(config, soortId, nu).includes(startMs)) throw new BoekFout("tijd", 400);
}

// Verliest deze afspraak van een andere boeking die tegelijk binnenkwam? De oudste wint;
// bij gelijke tijd beslist het id, zodat beide kanten hetzelfde besluiten.
async function verliestRace(agenda, config, eigen, startMs, eindMs) {
  const buf = config.bufferMinuten * MINUUT;
  const rivalen = await agenda.boekingen(new Date(startMs - buf), new Date(eindMs + buf));
  return rivalen.some((r) =>
    r.id !== eigen.id &&
    overlapt(r.start, r.eind, startMs - buf, eindMs + buf) &&
    (r.aangemaakt < eigen.aangemaakt || (r.aangemaakt === eigen.aangemaakt && r.id < eigen.id)));
}

export function beschrijving({ config, soortId, taal, naam, email, vraag, beheer }) {
  const soort = config.soorten[soortId];
  const nl = taal === "nl";
  const regels = [
    `${soort.titel[nl ? "nl" : "en"]} (${soort.minuten} min)`,
    "",
    `${nl ? "Naam" : "Name"}: ${naam}`,
    `${nl ? "E-mail" : "Email"}: ${email}`,
  ];
  if (vraag) regels.push("", `${nl ? "Vraag" : "Question"}:`, vraag);
  if (beheer) regels.push("", `${nl ? "Verzetten of annuleren" : "Reschedule or cancel"}: ${beheer}`);
  regels.push("", "socialnow.nl");
  return regels.join("\n");
}

export async function boek({ agenda, config, soortId, start, naam, email, vraag = "", taal = "en", nu = new Date(), beheerUrl = null, extraGasten = [] }) {
  const soort = config.soorten?.[soortId];
  if (!soort) throw new BoekFout("soort", 400);
  naam = schoon(naam, 100);
  email = schoon(email, 200).toLowerCase();
  vraag = schoon(vraag, 1000);
  taal = taal === "nl" ? "nl" : "en";
  if (!naam || !EMAIL.test(email)) throw new BoekFout("invoer", 400);

  const startMs = Date.parse(start);
  controleerSlot(config, soortId, startMs, nu);
  const eindMs = startMs + soort.minuten * MINUUT;
  const buf = config.bufferMinuten * MINUUT;

  // Vlak voor het aanmaken nog één keer vrij/bezet uit de agenda.
  const bezet = await agenda.bezet(new Date(startMs - buf), new Date(eindMs + buf));
  if (!isVrij(startMs, eindMs, bezet, config.bufferMinuten)) throw new BoekFout("bezet", 409);

  // Eerst stil aanmaken, dan controleren of er tegelijk een andere boeking binnenkwam,
  // en pas daarna de uitnodigingen versturen. Zo krijgt niemand een uitnodiging die weer vervalt.
  const titel = `${soort.titel[taal]}: ${naam} × ${config.organisatie}`;
  const eigen = await agenda.maak({
    start: startMs, eind: eindMs, titel, soortId, taal,
    beschrijving: beschrijving({ config, soortId, taal, naam, email, vraag }),
  });
  if (await verliestRace(agenda, config, eigen, startMs, eindMs)) {
    await agenda.verwijder(eigen.id, { stil: true });
    throw new BoekFout("bezet", 409);
  }

  const beheer = beheerUrl ? beheerUrl(eigen.id) : null;
  const gasten = [{ naam, email }, ...extraGasten.filter((g) => g.email && g.email !== email)];
  const klaar = await agenda.nodigUit(eigen.id, {
    gasten, naam, email, vraag, soortId, taal,
    beschrijving: beschrijving({ config, soortId, taal, naam, email, vraag, beheer }),
  });
  return {
    id: eigen.id, soort: soortId,
    start: new Date(startMs).toISOString(), eind: new Date(eindMs).toISOString(),
    meet: klaar?.meet || null, beheer,
  };
}

async function haalBoeking(agenda, id, nu) {
  const afspraak = id ? await agenda.haal(id) : null;
  if (!afspraak || !afspraak.boeking || afspraak.status === "cancelled") throw new BoekFout("onbekend", 404);
  if (afspraak.start <= +nu) throw new BoekFout("voorbij", 410);
  return afspraak;
}

export async function bekijk({ agenda, id, nu = new Date() }) {
  const a = await haalBoeking(agenda, id, nu);
  return { id: a.id, soort: a.soortId, start: new Date(a.start).toISOString(), eind: new Date(a.eind).toISOString(), naam: a.gastNaam || "" };
}

export async function verzet({ agenda, config, id, start, nu = new Date() }) {
  const oud = await haalBoeking(agenda, id, nu);
  const soort = config.soorten[oud.soortId];
  if (!soort) throw new BoekFout("soort", 400);
  const startMs = Date.parse(start);
  controleerSlot(config, oud.soortId, startMs, nu);
  const eindMs = startMs + soort.minuten * MINUUT;
  const buf = config.bufferMinuten * MINUUT;

  const bezet = trekAf(await agenda.bezet(new Date(startMs - buf), new Date(eindMs + buf)), oud);
  if (!isVrij(startMs, eindMs, bezet, config.bufferMinuten)) throw new BoekFout("bezet", 409);

  // Google stuurt de gasten de nieuwe tijd. Kwam er precies tegelijk een andere boeking op dit
  // moment, dan wijkt de verzette afspraak altijd en gaat hij terug naar de oude tijd.
  await agenda.verplaats(id, { start: startMs, eind: eindMs, stil: false });
  const eigen = { id, aangemaakt: Infinity };
  if (await verliestRace(agenda, config, eigen, startMs, eindMs)) {
    await agenda.verplaats(id, { start: oud.start, eind: oud.eind, stil: false });
    throw new BoekFout("bezet", 409);
  }
  return { id, soort: oud.soortId, start: new Date(startMs).toISOString(), eind: new Date(eindMs).toISOString() };
}

export async function annuleer({ agenda, id, nu = new Date() }) {
  await haalBoeking(agenda, id, nu);
  await agenda.verwijder(id, { stil: false });
  return { id, geannuleerd: true };
}
