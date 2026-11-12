// Proeven voor de boekingspagina: slotberekening, dubbele boeking geweigerd, tijdzones.
// Draaien: npm test (in deze map). Geen netwerk, geen sleutels: de agenda is nep-agenda.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { berekenSlots } from "../lib/slots.mjs";
import { zoneNaarUtc } from "../lib/tijd.mjs";
import { boek, verzet, annuleer } from "../lib/boek.mjs";
import { groepeerPerDag } from "../public/tijdzone.mjs";
import { nepAgenda } from "./nep-agenda.mjs";

const AMS = "Europe/Amsterdam";
const config = {
  tijdzone: AMS,
  werktijden: {
    ma: [["09:00", "17:00"]], di: [["09:00", "17:00"]], wo: [["09:00", "17:00"]],
    do: [["09:00", "17:00"]], vr: [["09:00", "17:00"]], za: [], zo: [],
  },
  bufferMinuten: 15,
  minimaleVooruitboektijdUren: 4,
  maximaleDagenVooruit: 7,
  stapMinuten: 30,
  vrijeDagen: ["2026-10-28"],
  standaardSoort: "intro",
  soorten: {
    security: { minuten: 20, titel: { en: "Free security call", nl: "Gratis veiligheidscall" } },
    intro: { minuten: 30, titel: { en: "Intro call", nl: "Kennismakingscall" } },
  },
  organisatie: "SocialNow",
};

// Maandag 26 oktober 2026, 07:00 in Amsterdam (wintertijd, UTC+1).
const MAANDAG = new Date("2026-10-26T06:00:00Z");
const opDag = (slots, utcDatum) => slots.filter((s) => s.startsWith(utcDatum));
const gast = { naam: "Sanne de Vries", email: "sanne@voorbeeld.nl", vraag: "Is mijn site veilig?", taal: "nl" };

// ---------- slotberekening ----------

test("slots: eerste slot ligt na de minimale vooruitboektijd", () => {
  const slots = berekenSlots({ config, soortId: "intro", nu: MAANDAG, bezet: [] });
  // 07:00 + 4 uur = 11:00 in Amsterdam = 10:00 UTC
  assert.equal(opDag(slots, "2026-10-26")[0], "2026-10-26T10:00:00.000Z");
  assert.ok(slots.every((s) => Date.parse(s) >= Date.parse("2026-10-26T10:00:00Z")));
});

test("slots: laatste slot eindigt binnen de werktijd", () => {
  const intro = opDag(berekenSlots({ config, soortId: "intro", nu: MAANDAG, bezet: [] }), "2026-10-26");
  assert.equal(intro.at(-1), "2026-10-26T15:30:00.000Z"); // 16:30 tot 17:00
  const security = opDag(berekenSlots({ config, soortId: "security", nu: MAANDAG, bezet: [] }), "2026-10-26");
  assert.equal(security.at(-1), "2026-10-26T15:30:00.000Z"); // 16:30 tot 16:50
  assert.equal(intro.length, 12); // 11:00 t/m 16:30, elk half uur
});

test("slots: geen weekend, geen vrije dagen, niet verder dan maximaal vooruit", () => {
  const slots = berekenSlots({ config, soortId: "intro", nu: MAANDAG, bezet: [] });
  assert.equal(opDag(slots, "2026-10-28").length, 0, "vrije dag");
  assert.equal(opDag(slots, "2026-10-31").length, 0, "zaterdag");
  assert.equal(opDag(slots, "2026-11-01").length, 0, "zondag");
  assert.ok(opDag(slots, "2026-11-02").length > 0, "dag 7 telt mee");
  assert.equal(opDag(slots, "2026-11-03").length, 0, "dag 8 valt erbuiten");
});

test("slots: bezette tijd en buffer eromheen vallen weg", () => {
  // Bezet van 12:00 tot 13:00 in Amsterdam.
  const bezet = [{ start: "2026-10-26T11:00:00Z", eind: "2026-10-26T12:00:00Z" }];
  const maandag = opDag(berekenSlots({ config, soortId: "intro", nu: MAANDAG, bezet }), "2026-10-26");
  assert.ok(maandag.includes("2026-10-26T10:00:00.000Z"), "11:00 tot 11:30, 15 minuten buffer past");
  for (const weg of ["10:30", "11:00", "11:30", "12:00"])
    assert.ok(!maandag.includes(`2026-10-26T${weg}:00.000Z`), `${weg} UTC hoort bezet te zijn`);
  assert.ok(maandag.includes("2026-10-26T12:30:00.000Z"), "13:30 ligt 30 minuten na het einde");
});

test("slots: onbekende soort geeft niets", () => {
  assert.deepEqual(berekenSlots({ config, soortId: "bestaatniet", nu: MAANDAG, bezet: [] }), []);
});

// ---------- tijdzones ----------

test("tijdzones: werktijd in Amsterdam wordt de juiste UTC, ook rond de wintertijd", () => {
  assert.equal(zoneNaarUtc("2026-10-23", "09:00", AMS).toISOString(), "2026-10-23T07:00:00.000Z"); // zomertijd
  assert.equal(zoneNaarUtc("2026-10-26", "09:00", AMS).toISOString(), "2026-10-26T08:00:00.000Z"); // wintertijd
  assert.equal(zoneNaarUtc("2026-03-30", "09:00", AMS).toISOString(), "2026-03-30T07:00:00.000Z");
});

test("tijdzones: slots over de klokwissel van 25 oktober beginnen steeds om 09:00 Amsterdam", () => {
  const donderdag = new Date("2026-10-22T04:00:00Z"); // 06:00 zomertijd
  const slots = berekenSlots({ config, soortId: "intro", nu: donderdag, bezet: [] });
  assert.equal(opDag(slots, "2026-10-22")[0], "2026-10-22T08:00:00.000Z"); // 10:00, na 4 uur vooruit
  assert.equal(opDag(slots, "2026-10-23")[0], "2026-10-23T07:00:00.000Z"); // vrijdag 09:00 zomertijd
  assert.equal(opDag(slots, "2026-10-26")[0], "2026-10-26T08:00:00.000Z"); // maandag 09:00 wintertijd
});

test("tijdzones: de bezoeker ziet tijden en dagen in zijn eigen zone", () => {
  const slots = ["2026-10-26T08:00:00.000Z", "2026-10-26T15:30:00.000Z", "2026-11-02T08:00:00.000Z"];
  const ny = groepeerPerDag(slots, "America/New_York", "en");
  assert.deepEqual(ny.map((d) => [d.datum, d.tijden.map((t) => t.tijd)]), [
    ["2026-10-26", ["04:00", "11:30"]], // New York nog zomertijd (UTC-4)
    ["2026-11-02", ["03:00"]], // na 1 november wintertijd (UTC-5)
  ]);
  const tokio = groepeerPerDag(slots, "Asia/Tokyo", "en");
  assert.deepEqual(tokio.map((d) => [d.datum, d.tijden.map((t) => t.tijd)]), [
    ["2026-10-26", ["17:00"]],
    ["2026-10-27", ["00:30"]], // 16:30 Amsterdam is in Tokio al de volgende dag
    ["2026-11-02", ["17:00"]],
  ]);
  assert.equal(ny[0].tijden[0].iso, slots[0]);
});

// ---------- boeken en dubbel boeken ----------

test("boeken: een vrij slot geeft een afspraak met Meet-link en uitnodiging", async () => {
  const agenda = nepAgenda();
  const uit = await boek({ agenda, config, soortId: "security", start: "2026-10-26T10:00:00.000Z", ...gast, nu: MAANDAG });
  assert.equal(uit.start, "2026-10-26T10:00:00.000Z");
  assert.equal(uit.eind, "2026-10-26T10:20:00.000Z");
  assert.match(uit.meet, /^https:\/\/meet\.google\.com\//);
  const [afspraak] = agenda.actief();
  assert.deepEqual(afspraak.gasten.map((g) => g.email), ["sanne@voorbeeld.nl"]);
  assert.match(afspraak.beschrijving, /Is mijn site veilig\?/);
});

test("dubbel boeken: hetzelfde slot een tweede keer wordt geweigerd", async () => {
  const agenda = nepAgenda();
  const start = "2026-10-26T10:00:00.000Z";
  await boek({ agenda, config, soortId: "intro", start, ...gast, nu: MAANDAG });
  await assert.rejects(
    boek({ agenda, config, soortId: "intro", start, ...gast, email: "ander@voorbeeld.nl", nu: MAANDAG }),
    (f) => f.code === "bezet" && f.status === 409,
  );
  assert.equal(agenda.actief().length, 1);
});

test("dubbel boeken: een slot binnen de buffer van een boeking wordt geweigerd", async () => {
  const agenda = nepAgenda();
  await boek({ agenda, config, soortId: "intro", start: "2026-10-26T10:00:00.000Z", ...gast, nu: MAANDAG });
  await assert.rejects(
    boek({ agenda, config, soortId: "intro", start: "2026-10-26T10:30:00.000Z", ...gast, nu: MAANDAG }),
    (f) => f.code === "bezet",
  );
});

test("dubbel boeken: twee bezoekers op dezelfde seconde, er blijft er precies één over", async () => {
  let wachtend = [];
  const tegelijk = () => new Promise((r) => { wachtend.push(r); if (wachtend.length === 2) wachtend.forEach((f) => f()); });
  const agenda = nepAgenda({ wachtNaBezet: tegelijk });
  const start = "2026-10-26T13:00:00.000Z";
  const uit = await Promise.allSettled([
    boek({ agenda, config, soortId: "intro", start, ...gast, nu: MAANDAG }),
    boek({ agenda, config, soortId: "intro", start, ...gast, email: "ander@voorbeeld.nl", nu: MAANDAG }),
  ]);
  assert.equal(uit.filter((u) => u.status === "fulfilled").length, 1);
  assert.equal(uit.find((u) => u.status === "rejected")?.reason?.code, "bezet");
  assert.equal(agenda.actief().length, 1);
});

test("dubbel boeken: bezet in Google Agenda (vlak voor het aanmaken gecontroleerd) wordt geweigerd", async () => {
  const agenda = nepAgenda({ bezet: [{ start: "2026-10-26T13:00:00Z", eind: "2026-10-26T14:00:00Z" }] });
  await assert.rejects(
    boek({ agenda, config, soortId: "intro", start: "2026-10-26T13:00:00.000Z", ...gast, nu: MAANDAG }),
    (f) => f.code === "bezet",
  );
  assert.equal(agenda.afspraken.size, 0, "er is niets aangemaakt");
});

test("boeken: tijd buiten het rooster, te vroeg, onbekende soort of fout e-mailadres wordt geweigerd", async () => {
  const agenda = nepAgenda();
  const poging = (extra) => boek({ agenda, config, soortId: "intro", start: "2026-10-26T10:00:00.000Z", ...gast, nu: MAANDAG, ...extra });
  await assert.rejects(poging({ start: "2026-10-26T10:10:00.000Z" }), (f) => f.code === "tijd" && f.status === 400);
  await assert.rejects(poging({ start: "2026-10-26T08:00:00.000Z" }), (f) => f.code === "tijd"); // binnen 4 uur
  await assert.rejects(poging({ start: "2026-10-31T09:00:00.000Z" }), (f) => f.code === "tijd"); // zaterdag
  await assert.rejects(poging({ soortId: "bestaatniet" }), (f) => f.code === "soort");
  await assert.rejects(poging({ email: "geen-adres" }), (f) => f.code === "invoer");
  await assert.rejects(poging({ naam: "" }), (f) => f.code === "invoer");
  assert.equal(agenda.afspraken.size, 0);
});

test("verzetten: naar een vrij slot mag, ook vlak naast de eigen oude tijd; naar bezet niet", async () => {
  const agenda = nepAgenda({ bezet: [{ start: "2026-10-27T09:00:00Z", eind: "2026-10-27T10:00:00Z" }] });
  const { id } = await boek({ agenda, config, soortId: "intro", start: "2026-10-26T10:00:00.000Z", ...gast, nu: MAANDAG });
  const verzet1 = await verzet({ agenda, config, id, start: "2026-10-26T10:30:00.000Z", nu: MAANDAG });
  assert.equal(verzet1.start, "2026-10-26T10:30:00.000Z");
  await assert.rejects(verzet({ agenda, config, id, start: "2026-10-27T09:00:00.000Z", nu: MAANDAG }), (f) => f.code === "bezet");
  assert.equal(agenda.afspraken.get(id).start, Date.parse("2026-10-26T10:30:00Z"));
});

test("annuleren: het slot komt weer vrij", async () => {
  const agenda = nepAgenda();
  const start = "2026-10-26T10:00:00.000Z";
  const { id } = await boek({ agenda, config, soortId: "intro", start, ...gast, nu: MAANDAG });
  await annuleer({ agenda, id, nu: MAANDAG });
  const bezet = await agenda.bezet(new Date("2026-10-26T00:00:00Z"), new Date("2026-10-27T00:00:00Z"));
  assert.ok(berekenSlots({ config, soortId: "intro", nu: MAANDAG, bezet }).includes(start));
});
