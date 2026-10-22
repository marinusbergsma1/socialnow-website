// Marinus deelt zijn boekbare tijden zelf in op os.socialnow.nl (contract: beschikbaarheid-contract.md, LEESMIJ.md).
// Een slot is boekbaar als het binnen zijn blokken valt EN zijn Google Agenda dan vrij is.
import { test } from "node:test";
import assert from "node:assert/strict";
import config from "../config.mjs";
import { berekenSlots } from "../lib/slots.mjs";
import { boek } from "../lib/boek.mjs";
import { pasToe, leesBeschikbaarheid, beschikbaarheidsBron } from "../lib/beschikbaarheid.mjs";
import { zetProefAgenda } from "../lib/omgeving.mjs";
import { groepeerPerDag } from "../public/tijdzone.mjs";
import slotsHandler from "../api/slots.js";
import boekHandler from "../api/boek.js";
import { nepAgenda } from "./nep-agenda.mjs";

const MAANDAG = new Date("2026-10-26T06:00:00Z"); // 07:00 Amsterdam, wintertijd
const gast = { naam: "Sanne de Vries", email: "sanne@voorbeeld.nl", taal: "nl" };
const op = (slots, datum) => slots.filter((s) => s.startsWith(datum));
const OS = (extra = {}) => ({
  ok: true, versie: 1, tijdzone: "Europe/Amsterdam", bron: "opgeslagen", bijgewerkt: "2026-10-22T12:00:00+02:00",
  week: { 1: [["10:00", "18:00"]], 2: [["10:00", "18:00"]], 3: [["10:00", "18:00"]], 4: [["10:00", "18:00"]], 5: [["10:00", "18:00"]], 6: [], 7: [] },
  datums: {}, vrij: [], ...extra,
});
const met = (antwoord) => pasToe(config, leesBeschikbaarheid(antwoord));

function nepRes() {
  return { code: 200, headers: {}, body: null, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, status(c) { this.code = c; return this; }, json(j) { this.body = j; return this; } };
}

test("beschikbaarheid: per weekdag, zaterdag open en maandag dicht", () => {
  const c = met(OS({ week: { ...OS().week, 1: [], 6: [["11:00", "13:00"]] } }));
  const slots = berekenSlots({ config: c, soortId: "intro", nu: MAANDAG, bezet: [] });
  assert.equal(op(slots, "2026-10-26").length, 0, "maandag dicht");
  assert.deepEqual(op(slots, "2026-10-31"), ["2026-10-31T10:00:00.000Z", "2026-10-31T10:30:00.000Z", "2026-10-31T11:00:00.000Z", "2026-10-31T11:30:00.000Z"]);
});

test("beschikbaarheid: een datum vervangt de weekdag, en een vrije dag uit datums geeft geen slots", () => {
  const c = met(OS({ datums: { "2026-10-27": [["13:00", "15:00"]], "2026-10-28": [] } }));
  const slots = berekenSlots({ config: c, soortId: "intro", nu: MAANDAG, bezet: [] });
  assert.deepEqual(op(slots, "2026-10-27"), ["2026-10-27T12:00:00.000Z", "2026-10-27T12:30:00.000Z", "2026-10-27T13:00:00.000Z", "2026-10-27T13:30:00.000Z"]);
  assert.equal(op(slots, "2026-10-28").length, 0, "vrije dag");
  assert.ok(op(slots, "2026-10-29").length > 0, "donderdag gewoon open");
});

test("beschikbaarheid: vrije periodes, hele dagen en een tijdvak", () => {
  const c = met(OS({ vrij: [{ van: "2026-10-29", tot: "2026-10-30" }, { van: "2026-10-27T14:00:00+01:00", tot: "2026-10-27T16:00:00+01:00" }] }));
  const slots = berekenSlots({ config: c, soortId: "intro", nu: MAANDAG, bezet: [] });
  assert.equal(op(slots, "2026-10-29").length + op(slots, "2026-10-30").length, 0);
  const dinsdag = op(slots, "2026-10-27");
  assert.ok(dinsdag.includes("2026-10-27T12:30:00.000Z"), "13:30 tot 14:00 past nog");
  for (const weg of ["13:00", "13:30", "14:00", "14:30"]) assert.ok(!dinsdag.includes(`2026-10-27T${weg}:00.000Z`), weg);
  assert.ok(dinsdag.includes("2026-10-27T15:00:00.000Z"), "16:00 weer open");
});

test("beschikbaarheid: blok binnen de beschikbaarheid maar bezet in Google is niet boekbaar", async () => {
  const c = met(OS({ datums: { "2026-10-27": [["13:00", "15:00"]] } }));
  const agenda = nepAgenda({ bezet: [{ start: "2026-10-27T12:00:00Z", eind: "2026-10-27T12:30:00Z" }] });
  const slots = berekenSlots({ config: c, soortId: "intro", nu: MAANDAG, bezet: await agenda.bezet(new Date("2026-10-27T00:00:00Z"), new Date("2026-10-28T00:00:00Z")) });
  assert.ok(!op(slots, "2026-10-27").includes("2026-10-27T12:00:00.000Z"));
  await assert.rejects(boek({ agenda, config: c, soortId: "intro", start: "2026-10-27T12:00:00.000Z", ...gast, nu: MAANDAG }), (f) => f.code === "bezet");
  assert.equal(agenda.afspraken.size, 0);
});

test("beschikbaarheid: boeken buiten de blokken wordt geweigerd, ook als Google vrij is", async () => {
  const c = met(OS({ datums: { "2026-10-27": [["13:00", "15:00"]] } }));
  const agenda = nepAgenda();
  await assert.rejects(boek({ agenda, config: c, soortId: "intro", start: "2026-10-27T09:00:00.000Z", ...gast, nu: MAANDAG }), (f) => f.code === "tijd");
  assert.equal(agenda.afspraken.size, 0);
});

test("beschikbaarheid: rare antwoorden worden niet gebruikt", () => {
  for (const fout of [null, "tekst", { ok: false }, OS({ versie: 2 }), OS({ week: { 1: [["18:00", "10:00"]] } }), OS({ week: { 1: [["10:00", "25:00"]] } }), OS({ datums: { "26-10-2026": [] } }), OS({ tijdzone: "Europe/London" })]) {
    assert.equal(leesBeschikbaarheid(fout), null, JSON.stringify(fout)?.slice(0, 80));
  }
  assert.ok(leesBeschikbaarheid(OS()));
});

test("beschikbaarheid: ophalen met sleutel, cache hooguit 30 s, bij fout de laatst goede versie, anders standaard", async () => {
  let klok = 1_000_000;
  const aanroepen = [];
  let antwoord = () => ({ ok: true, status: 200, json: async () => OS({ week: { ...OS().week, 6: [["10:00", "12:00"]] } }) });
  const bron = beschikbaarheidsBron({ url: "https://os.socialnow.nl/api/beschikbaarheid", sleutel: "geheim-geheim-geheim-1234", nu: () => klok, fetchImpl: async (url, o) => { aanroepen.push([String(url), o.headers.authorization]); return antwoord(); } });
  const eerste = await bron();
  assert.deepEqual(aanroepen[0], ["https://os.socialnow.nl/api/beschikbaarheid", "Bearer geheim-geheim-geheim-1234"]);
  assert.deepEqual(eerste.week.za, [["10:00", "12:00"]]);
  klok += 20_000; await bron();
  assert.equal(aanroepen.length, 1, "binnen 30 s uit het geheugen");
  klok += 15_000; antwoord = () => { throw new Error("time-out"); };
  const tweede = await bron();
  assert.equal(aanroepen.length, 2);
  assert.deepEqual(tweede.week.za, [["10:00", "12:00"]], "laatst goede versie");
  const leeg = beschikbaarheidsBron({ url: "https://os.socialnow.nl/api/beschikbaarheid", sleutel: "geheim-geheim-geheim-1234", nu: () => klok, fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ rare: "json" }) }) });
  assert.equal(await leeg(), null, "geen goede versie: standaard uit config.mjs");
  const geenSleutel = beschikbaarheidsBron({ url: "https://os.socialnow.nl/api/beschikbaarheid", sleutel: "", fetchImpl: async () => { throw new Error("mag niet"); } });
  assert.equal(await geenSleutel(), null);
});

test("dag eerst: alleen dagen die nog iets vrij hebben verschijnen", () => {
  const c = met(OS());
  const bezet = [{ start: "2026-10-27T08:00:00Z", eind: "2026-10-27T18:00:00Z" }]; // dinsdag helemaal vol
  const dagen = groepeerPerDag(berekenSlots({ config: c, soortId: "intro", nu: MAANDAG, bezet }), "Europe/Amsterdam").map((d) => d.datum);
  assert.ok(!dagen.includes("2026-10-27"));
  assert.ok(dagen.includes("2026-10-26") && dagen.includes("2026-10-28"));
});

test("productie zonder Google-sleutels: voorbeeldtijden met duidelijke vlag, en echt boeken kan niet", async () => {
  const oud = { ...process.env };
  for (const k of ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "BOEK_DEMO", "BOEKING_BEHEER_SLEUTEL"]) delete process.env[k];
  process.env.VERCEL_ENV = "production";
  try {
    zetProefAgenda(null);
    const res = nepRes();
    await slotsHandler({ method: "GET", headers: {}, query: { type: "intro" } }, res);
    assert.equal(res.code, 200);
    assert.equal(res.body.echt, false);
    assert.equal(res.body.demo, true);
    assert.ok(res.body.slots.length > 0, "tijden zijn te zien");
    const boekRes = nepRes();
    await boekHandler({ method: "POST", headers: {}, body: { type: "intro", start: res.body.slots[0], ...gast } }, boekRes);
    assert.equal(boekRes.code, 503);
    assert.equal(boekRes.body.reden, "niet-ingesteld");
  } finally {
    for (const k of Object.keys(process.env)) if (!(k in oud)) delete process.env[k];
    Object.assign(process.env, oud);
  }
});
