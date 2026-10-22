// Aanvulling van Marinus: soort "Uitgebreide websitecheck", 30 minuten, direct te openen met
// ?type=uitgebreide-check&domein=voorbeeld.nl, domein in de afspraak en de bevestiging, alleen naam en e-mail.
import { test } from "node:test";
import assert from "node:assert/strict";
import config from "../config.mjs";
import { berekenSlots } from "../lib/slots.mjs";
import { delenInZone } from "../lib/tijd.mjs";
import { boek } from "../lib/boek.mjs";
import { veldenVoor, schoonDomein } from "../public/velden.mjs";
import { zetProefAgenda } from "../lib/omgeving.mjs";
import beheerHandler from "../api/beheer.js";
import { nepAgenda } from "./nep-agenda.mjs";

const ID = "uitgebreide-check";
const MAANDAG = new Date("2026-10-26T06:00:00Z");

test("websitecheck: soort bestaat, 30 minuten, EN en NL titel", () => {
  const s = config.soorten[ID];
  assert.ok(s, "soort ontbreekt in config.mjs");
  assert.equal(s.minuten, 30);
  assert.equal(s.titel.nl, "Uitgebreide websitecheck");
  assert.equal(s.titel.en, "Extended website check");
});

test("websitecheck: alleen vrije tijden binnen ma t/m vr 10.00 tot 18.00", () => {
  const bezet = [{ start: "2026-10-26T10:00:00Z", eind: "2026-10-26T11:00:00Z" }];
  const slots = berekenSlots({ config, soortId: ID, nu: MAANDAG, bezet });
  assert.ok(slots.length > 0);
  for (const s of slots) {
    const d = delenInZone(s, "Europe/Amsterdam");
    const wd = new Date(Date.UTC(d.jaar, d.maand - 1, d.dag)).getUTCDay();
    assert.ok(wd >= 1 && wd <= 5 && d.uur * 60 + d.minuut >= 600 && d.uur * 60 + d.minuut + 30 <= 1080, s);
  }
  assert.ok(!slots.includes("2026-10-26T10:00:00.000Z") && !slots.includes("2026-10-26T10:30:00.000Z"), "bezet blijft dicht");
});

test("websitecheck: het formulier vraagt alleen naam, e-mail en domein", () => {
  assert.deepEqual(veldenVoor(config.soorten[ID]), ["naam", "email", "domein"]);
  assert.deepEqual(veldenVoor(config.soorten.intro), ["naam", "email", "vraag"]);
});

test("websitecheck: domein uit de link wordt netjes gemaakt, onzin wordt geweigerd", () => {
  assert.equal(schoonDomein("voorbeeld.nl"), "voorbeeld.nl");
  assert.equal(schoonDomein("  https://WWW.Voorbeeld.nl/pagina?x=1 "), "www.voorbeeld.nl");
  assert.equal(schoonDomein("shop.bakkerij-jansen.co.uk"), "shop.bakkerij-jansen.co.uk");
  for (const fout of ["", "geen domein", "<script>.nl", "voorbeeld", "a".repeat(260) + ".nl", "javascript:alert(1)"]) assert.equal(schoonDomein(fout), "", fout);
});

test("websitecheck: domein staat in de afspraak, de bevestiging en het beheer", async () => {
  process.env.BOEKING_BEHEER_SLEUTEL = "proefsleutel-die-lang-genoeg-is-1234567890";
  const agenda = nepAgenda();
  const uit = await boek({ agenda, config, soortId: ID, start: "2026-10-26T12:00:00.000Z", naam: "Sanne de Vries", email: "sanne@voorbeeld.nl", domein: "https://voorbeeld.nl/", taal: "nl", nu: MAANDAG });
  assert.equal(uit.domein, "voorbeeld.nl", "bevestiging");
  const [a] = agenda.actief();
  assert.match(a.titel, /voorbeeld\.nl/, "titel van de afspraak");
  assert.match(a.beschrijving, /Domein: voorbeeld\.nl/, "beschrijving van de afspraak");
  assert.equal(a.domein, "voorbeeld.nl");

  // Beheer leest de echte klok; zet de afspraak in de toekomst.
  a.start = Math.floor((Date.now() + 2 * 24 * 3600e3) / 60e3) * 60e3;
  a.eind = a.start + 30 * 60e3;
  zetProefAgenda(agenda);
  const res = { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(j) { this.body = j; return this; } };
  await beheerHandler({ method: "GET", headers: { authorization: "Bearer proefsleutel-die-lang-genoeg-is-1234567890" }, query: {} }, res);
  zetProefAgenda(null);
  delete process.env.BOEKING_BEHEER_SLEUTEL;
  assert.equal(res.code, 200);
  assert.equal(res.body.calls[0].domein, "voorbeeld.nl");
});

test("websitecheck: zonder geldig domein geen boeking", async () => {
  const agenda = nepAgenda();
  await assert.rejects(
    boek({ agenda, config, soortId: ID, start: "2026-10-26T12:00:00.000Z", naam: "Sanne", email: "sanne@voorbeeld.nl", domein: "geen domein", nu: MAANDAG }),
    (f) => f.code === "invoer",
  );
  assert.equal(agenda.afspraken.size, 0);
});
