#!/usr/bin/env node
// Proef: meetingplanner voor een heel salesteam (doorlichting 10 november 2026, chat 4). Rood op main, groen op sf/4-planner.
// Bewaakt in api/afspraak.js de melding aan Sales met herhaling, de gastheer (?v=) naar de planner, de rem op het
// openbare boeken en de keuze "verzetten" bij een tweede boeking; in public/afspraak/index.html de gastheergegevens
// uit het API-antwoord met de huidige waarden als standaard. Alle verzoeken naar buiten zijn nagebootst.
// Gebruik: node scripts/proef-afspraak-planner.mjs
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

const plannerUrl = /^https:\/\/script\.google\.com\/macros\/s\//;
const salesMelding = "https://sales.socialnow.nl/api/signalflow-boeking-melding";
const geboekt = { status: "booked", invited: true, id: "a".repeat(64), uid: "proef@google.com",
  start: "2026-11-12T12:00:00.000Z", end: "2026-11-12T12:30:00.000Z", meet: "https://meet.google.com/abc-defg-hij" };
let teller = 0;

async function verzoek(body, { planner, sales = async () => new Response(null, { status: 204 }) } = {}) {
  const verzoeken = [];
  globalThis.fetch = async (url, opties) => {
    const payload = JSON.parse(opties.body);
    verzoeken.push({ url, payload });
    if (plannerUrl.test(url)) return Response.json(await planner(payload));
    return sales(url, payload, verzoeken.filter((v) => v.url === url).length);
  };
  const res = { headers: {}, setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(code) { this.statusCode = code; return this; }, json(data) { this.body = data; return this; } };
  const { default: handler } = await import(pathToFileURL("api/afspraak.js").href + "?proef=" + teller);
  await handler({ method: "POST", headers: { "content-type": "application/json", "sec-fetch-site": "same-origin" }, body }, res);
  return { res, verzoeken };
}

process.env.SIGNALFLOW_PLANNER_MELDING_KEY = "fictieve-sleutel-voor-de-proef-0000000000";
const boek = (extra = {}) => ({ operation: "book", token: "tijdvak", firstName: "Noa", lastName: "Voorbeeld",
  email: "noa@example.invalid", company: "Voorbeeld BV", viaMail: false, ...extra });
const fouterror = console.error;
const logregels = [];
console.error = (...regel) => logregels.push(regel.join(" "));

// 1. Melding aan Sales met herhaling en een duidelijke foutstatus
teller++;
{
  const { res, verzoeken } = await verzoek(boek(), { planner: async () => geboekt,
    sales: async (_url, _payload, poging) => new Response(null, { status: poging === 1 ? 503 : 204 }) });
  const meldingen = verzoeken.filter((v) => v.url === salesMelding);
  eis(res.statusCode === 200 && res.body.status === "booked", "de boeking zelf blijft geslaagd als Sales even niet antwoordt");
  eis(meldingen.length === 2, `de melding aan Sales wordt herhaald na een fout (${meldingen.length} pogingen)`);
  eis(!res.headers["x-signalflow-opvolging"], "na een geslaagde herhaling geen foutstatus");
}
teller++;
{
  const { res, verzoeken } = await verzoek(boek(), { planner: async () => geboekt,
    sales: async () => new Response(null, { status: 503 }) });
  const meldingen = verzoeken.filter((v) => v.url === salesMelding);
  eis(meldingen.length === 3, `hooguit drie pogingen (${meldingen.length})`);
  eis(res.body.status === "booked" && res.headers["x-signalflow-opvolging"] === "mislukt",
    "blijft de melding mislukken, dan staat dat in de kop X-Signalflow-Opvolging (het uurlijkse vangnet in Sales vangt het op)");
  eis(logregels.some((r) => /signalflow_afspraakopvolging_mislukt/.test(r)), "en in het log als signalflow_afspraakopvolging_mislukt");
}

// 2. Gastheer per verkoper: ?v= gaat mee naar de planner, het antwoord bevat naam, foto, telefoon en WhatsApp
teller++;
{
  const { res, verzoeken } = await verzoek({ operation: "slots", gastheer: "marinus" }, { planner: async () => [] });
  eis(verzoeken[0]?.payload.operation === "website-slots" && verzoeken[0]?.payload.gastheer === "marinus", "de gastheer gaat mee naar de planner");
  eis(res.body?.status === "available" && Array.isArray(res.body.slots), "vrije tijden komen als { status, slots }");
  eis(res.body?.gastheer?.naam === "Marinus Bergsma" && res.body.gastheer.telefoon === "+31637404577" &&
    res.body.gastheer.whatsapp === "31637404577" && res.body.gastheer.foto === "/images/klein/marinus-profiel-blauw-320.webp",
  "een oudere planner zonder gastheer geeft de huidige gegevens van Marinus als standaard");
}
teller++;
{
  const sid = { sleutel: "sid", naam: "Sid Voorbeeld", foto: "/images/sid.webp", telefoon: "+31600000000", whatsapp: "31600000000" };
  const { res } = await verzoek({ operation: "slots", gastheer: "sid" }, { planner: async () => ({ status: "available", slots: [], gastheer: sid }) });
  eis(res.body?.gastheer?.naam === "Sid Voorbeeld", "de gastheer uit de planner komt in het antwoord");
  const fout = await verzoek({ operation: "slots", gastheer: "Sid<script>" }, { planner: async () => [] });
  eis(fout.res.statusCode === 400 && fout.verzoeken.length === 0, "een ongeldige gastheer gaat niet naar de planner");
  const boeking = await verzoek(boek({ gastheer: "sid" }), { planner: async () => geboekt });
  eis(boeking.verzoeken[0]?.payload.gastheer === "sid", "ook bij boeken gaat de gastheer mee");
}

// 3. Rem op het openbare boeken
teller++;
{
  let planner = 0;
  const { default: handler } = await import(pathToFileURL("api/afspraak.js").href + "?rem");
  globalThis.fetch = async (url) => { if (plannerUrl.test(url)) { planner++; return Response.json({ status: "taken" }); } return new Response(null, { status: 204 }); };
  const stuur = async (body) => {
    const res = { headers: {}, setHeader() {}, status(code) { this.statusCode = code; return this; }, json(data) { this.body = data; return this; } };
    await handler({ method: "POST", headers: { "content-type": "application/json" }, body }, res);
    return res.body.status;
  };
  const adres = [];
  for (let i = 0; i < 4; i++) adres.push(await stuur(boek()));
  eis(adres.slice(0, 3).every((s) => s === "taken") && adres[3] === "limiet" && planner === 3,
    `hooguit drie boekpogingen per e-mailadres per uur (${adres.join(", ")})`);
  const totaal = [];
  for (let i = 0; i < 40; i++) totaal.push(await stuur(boek({ email: `klant${i}@example.invalid` })));
  eis(totaal.includes("limiet") && totaal.indexOf("limiet") <= 30, `een maximum aan boekpogingen per uur in totaal (limiet na ${totaal.indexOf("limiet")})`);
}

// 4. Een tweede boeking met hetzelfde adres: geen tweede afspraak, bevestiging met verzetlink opnieuw
teller++;
{
  const bestaat = { status: "bestaat", id: "b".repeat(64), uid: "eerder@google.com", start: "2026-11-13T12:00:00.000Z", end: "2026-11-13T12:30:00.000Z" };
  const { res, verzoeken } = await verzoek(boek(), { planner: async () => bestaat });
  const melding = verzoeken.find((v) => v.url === salesMelding)?.payload;
  eis(melding?.opnieuw === true && melding.id === bestaat.id && melding.email === "noa@example.invalid",
    "Sales stuurt de bevestiging met de link om te verzetten of te annuleren opnieuw");
  eis(res.body.status === "bestaat" && res.body.opnieuwVerstuurd === true && !res.body.id && !res.body.uid && !res.body.start,
    "de bezoeker ziet geen gegevens van de bestaande afspraak");
}

// 5. Annuleren met de persoonlijke link gaat rechtstreeks naar Sales
teller++;
{
  const { res, verzoeken } = await verzoek({ operation: "cancel", mailTicket: "a".repeat(60) }, {
    sales: async () => Response.json({ status: "cancelled" }) });
  eis(verzoeken[0]?.url === "https://sales.socialnow.nl/api/signalflow-agenda-web" &&
    verzoeken[0].payload.operation === "cancel" && res.body.status === "cancelled", "annuleren gaat met het ticket naar Sales");
  const zonder = await verzoek({ operation: "cancel" }, {});
  eis(zonder.res.statusCode === 400 && zonder.verzoeken.length === 0, "annuleren zonder persoonlijke link kan niet");
}
console.error = fouterror;

// 6. De pagina: huidige gegevens als standaard, gastheer uit het antwoord, v= naar de API
const html = lees("public/afspraak/index.html");
eis(html.includes('src="/images/klein/marinus-profiel-blauw-320.webp" alt="Marinus Bergsma"') &&
  html.includes('href="tel:+31637404577"') && html.includes('href="https://wa.me/31637404577"') &&
  html.includes("Marinus Bergsma · SocialNow"), "de pagina ziet er zonder antwoord precies hetzelfde uit (huidige waarden als standaard)");
eis(/plannerParams\.get\('v'\)/.test(html) && /gastheer: gastheerSleutel/.test(html), "de parameter v= gaat als gastheer mee naar de API");
eis(/function toonGastheer\(/.test(html) && /toonGastheer\(result\.gastheer\)/.test(html), "naam, foto, telefoon en WhatsApp komen uit het API-antwoord");
eis(/result\.status === 'bestaat'/.test(html) && /result\.status === 'limiet'/.test(html), "de pagina legt 'bestaat' en 'limiet' uit");
eis(/plannerRequest\('cancel'\)/.test(html) && /id="cancel" class="secondary"/.test(html), "met een verzetlink kan de klant annuleren (bestaande knopstijl)");

if (fouten.length) {
  console.log(`\n${fouten.length} eis(en) rood.`);
  process.exit(1);
}
console.log("\nAlles groen.");
