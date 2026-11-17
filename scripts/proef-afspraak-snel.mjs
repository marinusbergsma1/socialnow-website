#!/usr/bin/env node
// Proef (17 nov 2026, Marinus: "ik wil dat call inplannen sneller gaat", boekingspagina laadt traag).
// Gemeten op live: pagina 0,15 s, vrije tijden 1,4 tot 2,1 s, vrijwel alles in Google Apps Script.
// Eis: de vrije tijden komen uit een korte tussenopslag (CDN en browser), boeken blijft altijd vers.
// Rood op main 4bd7749, groen met de wijziging. Gebruik: node scripts/proef-afspraak-snel.mjs
import { readFileSync } from "node:fs";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };

const { default: handler } = await import("../api/afspraak.js");
const tijden = [{ start: "2026-11-19T10:30:00.000Z", end: "2026-11-19T11:00:00.000Z", token: "t" }];

async function vraag({ method = "GET", headers = {}, body, upstream = () => new Response(JSON.stringify(tijden)) }) {
  const verstuurd = [];
  const echt = globalThis.fetch;
  globalThis.fetch = async (url, init) => { verstuurd.push({ url: String(url), body: JSON.parse(init.body) }); return upstream(); };
  const antwoord = { status: 0, kop: {}, json: undefined };
  const res = {
    setHeader(naam, waarde) { antwoord.kop[naam.toLowerCase()] = waarde; },
    status(code) { antwoord.status = code; return res; },
    json(data) { antwoord.json = data; return res; },
  };
  try { await handler({ method, headers, body, query: {}, url: "/api/afspraak" }, res); }
  finally { globalThis.fetch = echt; }
  return { ...antwoord, verstuurd };
}
const getal = (kop, naam) => +(new RegExp(`(?:^|[ ,])${naam}=(\\d+)`).exec(kop || "")?.[1] ?? NaN);

// 1. Vrije tijden via GET, zodat CDN en browser ze kunnen bewaren.
const get = await vraag({});
eis(get.status === 200 && Array.isArray(get.json) && get.json.length === 1, "GET /api/afspraak geeft de vrije tijden");
eis(get.verstuurd.length === 1 && JSON.stringify(get.verstuurd[0].body) === '{"operation":"website-slots"}',
  "GET vraagt alleen de openbare tijden op, zonder invoer van de bezoeker");
const cdn = get.kop["vercel-cdn-cache-control"] || "";
const browser = get.kop["cache-control"] || "";
eis(getal(cdn, "s-maxage") >= 15 && getal(cdn, "stale-while-revalidate") >= 60, "CDN bewaart de tijden en ververst ze op de achtergrond");
// Een tijd is 15 minuten boekbaar na uitgifte (Planner.gs). Er moet minstens 9 minuten overblijven om te kiezen en in te vullen.
const oudst = getal(cdn, "s-maxage") + getal(cdn, "stale-while-revalidate") + getal(browser, "max-age");
eis(oudst <= 6 * 60, `bewaarde tijden zijn hooguit 6 minuten oud (nu ${oudst} s)`);
eis(/\bprivate\b/.test(browser) && getal(browser, "max-age") >= 15, "browser bewaart de tijden kort, zodat vooraf ophalen iets oplevert");

// 2. Fouten en vreemde herkomst komen nooit in de tussenopslag.
const stuk = await vraag({ upstream: () => new Response("nee", { status: 500 }) });
eis(stuk.status === 502 && stuk.kop["cache-control"] === "no-store" && !stuk.kop["vercel-cdn-cache-control"], "storing bij Google wordt niet bewaard");
const vreemd = await vraag({ headers: { "sec-fetch-site": "cross-site" } });
eis(vreemd.status === 403 && vreemd.verstuurd.length === 0 && vreemd.kop["cache-control"] === "no-store", "GET vanaf een andere site wordt geweigerd");

// 3. Boeken en opnieuw ophalen blijven vers (POST).
const json = { "content-type": "application/json" };
const vers = await vraag({ method: "POST", headers: json, body: { operation: "slots" } });
eis(vers.status === 200 && vers.kop["cache-control"] === "no-store" && !vers.kop["vercel-cdn-cache-control"], "POST slots blijft vers (no-store)");
const boek = await vraag({ method: "POST", headers: json, body: { operation: "book", token: "t", firstName: "A", lastName: "B", viaMail: false },
  upstream: () => new Response(JSON.stringify({ status: "taken" })) });
eis(boek.status === 200 && boek.json.status === "taken" && boek.kop["cache-control"] === "no-store" &&
  boek.verstuurd[0].body.operation === "website-book", "boeken gaat ongewijzigd en vers naar de agenda");
const persoonlijk = await vraag({ method: "POST", headers: json, body: { operation: "slots", mailTicket: "x".repeat(40) },
  upstream: () => new Response(JSON.stringify({ status: "available", slots: tijden })) });
eis(persoonlijk.kop["cache-control"] === "no-store" && persoonlijk.verstuurd[0].body.mailTicket === "x".repeat(40), "persoonlijke uitnodiging blijft vers en ongewijzigd");
const put = await vraag({ method: "PUT" });
eis(put.status === 405 && put.verstuurd.length === 0, "andere methodes blijven geweigerd");

// 4. De pagina vraagt de tijden meteen in de kop op en ververst vers na een mislukte boeking.
const pagina = readFileSync("public/afspraak/index.html", "utf8");
const kop = pagina.slice(0, pagina.indexOf("</head>"));
eis(/<script>[^<]*fetch\('\/api\/afspraak'\)[^<]*<\/script>/.test(kop) && /ticket/.test(kop.match(/<script>[^<]*fetch\('\/api\/afspraak'\)[^<]*<\/script>/)?.[0] || ""),
  "pagina start het ophalen in de kop, behalve bij een persoonlijke uitnodiging");
eis(/function loadSlots\(message = '', vers = false\)/.test(pagina), "loadSlots kent een verse variant");
eis(/loadSlots\('Dit moment is niet meer beschikbaar[^']*', true\)/.test(pagina), "na bezet of verlopen haalt de pagina verse tijden op");
eis(/refresh\.addEventListener\('click', \(\) => loadSlots\('', true\)\)/.test(pagina), "knop Opnieuw proberen haalt verse tijden op");

// 5. De site warmt de tijden op zodra iemand naar een afspraaklink beweegt.
const knop = readFileSync("proposal/PlanCall.tsx", "utf8");
eis(/pointerover/.test(knop) && /touchstart/.test(knop) && /focusin/.test(knop) && /fetch\("\/api\/afspraak"\)/.test(knop),
  "site haalt de tijden vooraf op bij aanwijzen, aanraken of focus van een afspraaklink");
eis(/rel = "prefetch"/.test(knop), "site haalt de afspraakpagina zelf vooraf op");

console.log(fouten.length ? `\n${fouten.length} rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
