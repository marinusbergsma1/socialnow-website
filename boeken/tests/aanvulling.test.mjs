// Aanvulling van Marinus (22 okt 2026): werktijden ma t/m vr 10.00 tot 18.00, vrij/bezet uit AL zijn
// agenda's, privacy (alleen vrije blokken, alleen freeBusy), en een beveiligd beheer-endpoint.
import { test } from "node:test";
import assert from "node:assert/strict";
import config from "../config.mjs";
import { berekenSlots } from "../lib/slots.mjs";
import { delenInZone } from "../lib/tijd.mjs";
import { googleAgenda } from "../lib/google.mjs";
import { zetProefAgenda } from "../lib/omgeving.mjs";
import slotsHandler from "../api/slots.js";
import beheerHandler from "../api/beheer.js";
import { nepAgenda } from "./nep-agenda.mjs";

const AMS = "Europe/Amsterdam";

function nepRes() {
  return {
    code: 200, body: null, headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(c) { this.code = c; return this; },
    json(j) { this.body = j; return this; },
  };
}

// Google-API in het geheugen; onthoudt welke adressen zijn aangeroepen.
function nepGoogle({ agendas, bezet }) {
  const aanroepen = [];
  const fetchImpl = async (url, opties = {}) => {
    const u = String(url);
    aanroepen.push({ url: u, body: opties.body ? String(opties.body) : "" });
    const antwoord = (j, status = 200) => ({ ok: status < 300, status, json: async () => j });
    if (u.startsWith("https://oauth2.googleapis.com/token")) return antwoord({ access_token: "proef", expires_in: 3600 });
    if (u.includes("/users/me/calendarList")) return antwoord({ items: agendas });
    if (u.endsWith("/freeBusy")) {
      const vraag = JSON.parse(opties.body);
      return antwoord({ calendars: Object.fromEntries(vraag.items.map(({ id }) => [id, { busy: bezet[id] || [] }])) });
    }
    return antwoord({ error: { status: "NOT_FOUND" } }, 404);
  };
  return { fetchImpl, aanroepen };
}

// ---------- 1. werktijden ----------

test("werktijden: alleen maandag t/m vrijdag van 10.00 tot 18.00 Amsterdam", () => {
  const nu = new Date("2026-10-22T04:00:00Z");
  for (const soortId of Object.keys(config.soorten)) {
    const duur = config.soorten[soortId].minuten;
    const slots = berekenSlots({ config, soortId, nu, bezet: [] });
    assert.ok(slots.length > 0, soortId);
    for (const s of slots) {
      const d = delenInZone(s, AMS);
      const wd = new Date(Date.UTC(d.jaar, d.maand - 1, d.dag)).getUTCDay();
      const begin = d.uur * 60 + d.minuut;
      assert.ok(wd >= 1 && wd <= 5, `${s} valt in het weekend`);
      assert.ok(begin >= 600, `${s} begint voor 10.00`);
      assert.ok(begin + duur <= 1080, `${s} eindigt na 18.00`);
    }
    const tijden = new Set(slots.map((s) => { const d = delenInZone(s, AMS); return d.uur * 60 + d.minuut; }));
    assert.ok(tijden.has(600), `${soortId}: 10.00 hoort erbij`);
    assert.ok(tijden.has(1080 - Math.ceil(duur / 30) * 30), `${soortId}: laatste slot vlak voor 18.00`);
  }
});

// ---------- 2. vrij/bezet uit al zijn agenda's ----------

test("alle agenda's: vrij/bezet komt uit elke agenda in het account, niet alleen de hoofdagenda", async () => {
  const { fetchImpl, aanroepen } = nepGoogle({
    agendas: [
      { id: "info@socialnow.nl", primary: true },
      { id: "prive@gmail.com" },
      { id: "team@group.calendar.google.com" },
      { id: "nl.dutch#holiday@group.v.calendar.google.com" },
      { id: "addressbook#contacts@group.v.calendar.google.com" },
    ],
    bezet: { "team@group.calendar.google.com": [{ start: "2026-10-26T10:00:00Z", end: "2026-10-26T11:00:00Z" }] },
  });
  const agenda = googleAgenda({ clientId: "a", clientSecret: "b", refreshToken: "c", fetchImpl });
  const bezet = await agenda.bezet(new Date("2026-10-26T00:00:00Z"), new Date("2026-10-27T00:00:00Z"));
  const vraag = JSON.parse(aanroepen.find((a) => a.url.endsWith("/freeBusy")).body);
  const ids = vraag.items.map((i) => i.id).sort();
  assert.deepEqual(ids, ["info@socialnow.nl", "prive@gmail.com", "team@group.calendar.google.com"]);
  assert.deepEqual(bezet, [{ start: Date.parse("2026-10-26T10:00:00Z"), eind: Date.parse("2026-10-26T11:00:00Z") }]);
  // Een meeting in een tweede agenda blokkeert het slot (11.00 Amsterdam = 10.00 UTC).
  const slots = berekenSlots({ config, soortId: "intro", nu: new Date("2026-10-25T08:00:00Z"), bezet });
  assert.ok(!slots.includes("2026-10-26T10:00:00.000Z"));
  assert.ok(!slots.includes("2026-10-26T09:30:00.000Z"), "ook de buffer ervoor");
});

test("alle agenda's: kan de agendalijst niet geladen worden, dan geen slots (liever niets dan dubbel)", async () => {
  const fetchImpl = async (url) => String(url).includes("oauth2")
    ? { ok: true, status: 200, json: async () => ({ access_token: "x", expires_in: 3600 }) }
    : { ok: false, status: 500, json: async () => ({}) };
  const agenda = googleAgenda({ clientId: "a", clientSecret: "b", refreshToken: "c", fetchImpl });
  await assert.rejects(agenda.bezet(new Date("2026-10-26T00:00:00Z"), new Date("2026-10-27T00:00:00Z")));
});

// ---------- 3. privacy ----------

test("privacy: de publieke kant gebruikt alleen freeBusy, nooit events", async () => {
  const { fetchImpl, aanroepen } = nepGoogle({ agendas: [{ id: "info@socialnow.nl", primary: true }], bezet: {} });
  const agenda = googleAgenda({ clientId: "a", clientSecret: "b", refreshToken: "c", fetchImpl });
  zetProefAgenda(agenda);
  const res = nepRes();
  await slotsHandler({ method: "GET", headers: {}, query: { type: "intro" } }, res);
  zetProefAgenda(null);
  assert.equal(res.code, 200);
  assert.ok(aanroepen.length > 0);
  assert.ok(aanroepen.every((a) => !a.url.includes("/events")), aanroepen.map((a) => a.url).join("\n"));
});

test("privacy: het publieke antwoord bevat alleen vrije begintijden, niets over wat er bezet is", async () => {
  const agenda = nepAgenda({ bezet: [{ start: "2026-10-26T10:00:00Z", eind: "2026-10-26T11:00:00Z" }] });
  agenda.titels = ["Tandarts", "Gesprek met klant X"];
  zetProefAgenda(agenda);
  const res = nepRes();
  await slotsHandler({ method: "GET", headers: {}, query: { type: "intro" } }, res);
  zetProefAgenda(null);
  assert.equal(res.code, 200);
  assert.equal(res.headers["cache-control"], "no-store");
  const toegestaan = new Set(["ok", "tijdzone", "standaardSoort", "soorten", "demo", "noodroute", "soort", "slots"]);
  assert.deepEqual(Object.keys(res.body).filter((k) => !toegestaan.has(k)), []);
  assert.ok(res.body.slots.every((s) => typeof s === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:00\.000Z$/.test(s)));
  const tekst = JSON.stringify(res.body);
  for (const verboden of ["Tandarts", "klant", "busy", "bezet", "2026-10-26T10:00"]) assert.ok(!tekst.includes(verboden), verboden);
});

// ---------- 4. beheer-endpoint ----------

test("beheer: zonder of met verkeerde sleutel geen toegang", async () => {
  process.env.BOEKING_BEHEER_SLEUTEL = "proefsleutel-die-lang-genoeg-is-1234567890";
  zetProefAgenda(nepAgenda());
  for (const auth of [undefined, "Bearer fout", "proefsleutel-die-lang-genoeg-is-1234567890"]) {
    const res = nepRes();
    await beheerHandler({ method: "GET", headers: auth ? { authorization: auth } : {}, query: {} }, res);
    assert.equal(res.code, 401, String(auth));
    assert.equal(res.body?.calls, undefined);
  }
  delete process.env.BOEKING_BEHEER_SLEUTEL;
  const res = nepRes();
  await beheerHandler({ method: "GET", headers: { authorization: "Bearer iets" }, query: {} }, res);
  assert.equal(res.code, 503, "zonder ingestelde sleutel staat het endpoint dicht");
  zetProefAgenda(null);
});

test("beheer: met sleutel open slots en geboekte calls met naam, e-mail, soort, tijd en vraag", async () => {
  process.env.BOEKING_BEHEER_SLEUTEL = "proefsleutel-die-lang-genoeg-is-1234567890";
  const agenda = nepAgenda();
  const start = Math.floor((Date.now() + 3 * 24 * 3600e3) / 60e3) * 60e3;
  const a = await agenda.maak({ start, eind: start + 20 * 60e3, titel: "x", beschrijving: "", soortId: "security" });
  await agenda.nodigUit(a.id, { gasten: [{ naam: "Sanne de Vries", email: "sanne@voorbeeld.nl" }], naam: "Sanne de Vries", email: "sanne@voorbeeld.nl", vraag: "voorbeeld.nl", soortId: "security", beschrijving: "" });
  zetProefAgenda(agenda);
  const res = nepRes();
  await beheerHandler({ method: "GET", headers: { authorization: "Bearer proefsleutel-die-lang-genoeg-is-1234567890" }, query: {} }, res);
  zetProefAgenda(null);
  delete process.env.BOEKING_BEHEER_SLEUTEL;
  assert.equal(res.code, 200);
  assert.equal(res.headers["cache-control"], "no-store");
  assert.equal(res.body.tijdzone, AMS);
  assert.ok(res.body.slots.length > 0);
  const offset = /^\d{4}-\d\d-\d\dT\d\d:\d\d:00\+0[12]:00$/;
  assert.ok(res.body.slots.every((s) => offset.test(s.start) && offset.test(s.eind)), JSON.stringify(res.body.slots[0]));
  assert.ok(res.body.slots.every((s) => Date.parse(s.start) < Date.now() + 15 * 24 * 3600e3), "twee weken vooruit");
  assert.equal(res.body.calls.length, 1);
  const [call] = res.body.calls;
  assert.equal(call.naam, "Sanne de Vries");
  assert.equal(call.email, "sanne@voorbeeld.nl");
  assert.equal(call.soort, "security");
  assert.equal(call.vraag, "voorbeeld.nl");
  assert.equal(Date.parse(call.start), start);
  assert.match(call.start, /[+-]0[12]:00$/);
});
