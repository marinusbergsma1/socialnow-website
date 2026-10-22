// Controle van de mensproef in de browser (proposal/mensproef.ts) tegen het protocol van
// socialnow-os-os/api/_mensproef.js, in Node. Draai met: npm run check:mensproef
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createServer } from "vite";

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
try {
  const { sha256hex, losOp, Mensproef } = await server.ssrLoadModule("/proposal/mensproef.ts");
  const node = t => crypto.createHash("sha256").update(t).digest("hex");

  // De eigen SHA-256 is gelijk aan die van Node, voor alle lengtes tot 119 tekens (ook de grens van
  // één naar twee blokken bij 55 en 56 tekens).
  for (let n = 0; n <= 119; n++) {
    for (let r = 0; r < 20; r++) {
      const tekst = Array.from({ length: n }, () => String.fromCharCode(32 + crypto.randomInt(0, 95))).join("");
      assert.equal(sha256hex(tekst), node(tekst), JSON.stringify(tekst));
    }
  }
  assert.equal(sha256hex("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.throws(() => sha256hex("x".repeat(120)), /te_lang/);
  assert.throws(() => sha256hex("é"), /geen_ascii/);

  // Een opgave zoals de server hem maakt: zout met id, uitgifte, vervaltijd en route.
  const nu = Date.now();
  const zout = `${crypto.randomBytes(12).toString("base64url")}.${nu}.${nu + 20 * 60_000}.audit`;
  const getal = crypto.randomInt(0, 250_001);
  const opgave = { v: 1, zout, opgave: node(zout + getal), max: 250_000, handtekening: "x" };
  const start = Date.now();
  assert.equal(await losOp(opgave), getal);
  const duur = Date.now() - start;
  assert.equal(await losOp({ ...opgave, opgave: "0".repeat(64), max: 2000 }), -1);

  // De hele gang met een nagebootste server: opgave ophalen, oplossen, wachten, meesturen, en daarna
  // een nieuwe opgave voor een volgende poging.
  let opgehaald = 0;
  const oudeFetch = globalThis.fetch;
  globalThis.fetch = async url => {
    opgehaald++;
    assert.match(String(url), /\?route=audit$/);
    const z = `${crypto.randomBytes(12).toString("base64url")}.${Date.now()}.${Date.now() + 1_200_000}.audit`;
    return new Response(JSON.stringify({ ok: true, v: 1, zout: z, opgave: node(z + 42), max: 100, handtekening: "hand", wacht: 300 }), { status: 200 });
  };
  try {
    const p = new Mensproef("audit", "https://os.socialnow.nl/api/uitdaging");
    p.start();
    const t0 = Date.now();
    const bewijs = await p.voorVersturen();
    assert.ok(Date.now() - t0 >= 300, "wacht de minimale invultijd af");
    assert.equal(bewijs.mensproef.getal, 42);
    assert.equal(bewijs.mensproef.handtekening, "hand");
    assert.equal(bewijs.turnstile, undefined);
    assert.equal(opgehaald, 2, "na versturen meteen een nieuwe opgave");

    // Kent de server de opgave niet (404), dan gaat de aanvraag zonder antwoord.
    globalThis.fetch = async () => new Response("{}", { status: 404 });
    const leeg = new Mensproef("audit");
    assert.deepEqual(await leeg.voorVersturen(), {});
    // En zonder netwerk ook.
    globalThis.fetch = async () => { throw new Error("weg"); };
    assert.deepEqual(await new Mensproef("audit").voorVersturen(), {});
  } finally { globalThis.fetch = oudeFetch; }

  console.log(`MENSPROEF_OK sha256 gelijk aan Node, 250.000 opgelost in ${duur} ms`);
} finally {
  await server.close();
}
