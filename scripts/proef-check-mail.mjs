#!/usr/bin/env node
// Proef: aanvragen van socialnow.nl/security komen echt als mail aan (22 oktober 2026, Marinus).
// Aanleiding: om 17.03 gaf het formulier "Ontvangen", maar in Vercel ontbrak CHECK_SMTP_PASS en kwam er niets in info@.
// Deel 1 (lokaal): de functie herkent ontbrekende SMTP-gegevens en GET /api/check-aanvraag meldt dat, zonder waarden.
// Deel 2 (--live <url>): de live site meldt "mail: klaar". De echte aflevering in de INBOX van info@ is daarna
// met een testinzending en de Hostinger-mail-API bevestigd (zie de PR).
// Gebruik: node scripts/proef-check-mail.mjs [--live https://socialnow.nl]
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const server = await import(pathToFileURL(`${process.cwd()}/server/check-aanvraag.mjs`).href);

// 1. mailStatus noemt alleen namen
const ms = server.mailStatus;
eis(typeof ms === "function", "server/check-aanvraag.mjs heeft mailStatus()");
if (typeof ms === "function") {
  const zonderPass = ms({ CHECK_SMTP_USER: "info@socialnow.nl" });
  eis(!zonderPass.klaar && zonderPass.ontbreekt.join() === "CHECK_SMTP_PASS", "alleen USER in env (de situatie van 17.03): niet klaar, ontbreekt CHECK_SMTP_PASS");
  eis(ms({ CHECK_SMTP_USER: "a@b.nl", CHECK_SMTP_PASS: "x" }).klaar, "USER en PASS in env: klaar");
  eis(!JSON.stringify(ms({ CHECK_SMTP_USER: "geheim@b.nl", CHECK_SMTP_PASS: "" })).includes("geheim"), "mailStatus toont nooit een waarde");
}

// 2. GET op de API meldt de status, zonder namen of waarden
const api = (await import(pathToFileURL(`${process.cwd()}/api/check-aanvraag.js`).href)).default;
const nepRes = () => { const r = { code: 0, body: null, headers: {} }; r.setHeader = (k, v) => { r.headers[k] = v; }; r.status = (c) => { r.code = c; return r; }; r.json = (b) => { r.body = b; return r; }; return r; };
const bewaar = { u: process.env.CHECK_SMTP_USER, p: process.env.CHECK_SMTP_PASS };
process.env.CHECK_SMTP_USER = "info@socialnow.nl"; delete process.env.CHECK_SMTP_PASS;
const r1 = nepRes(); await api({ method: "GET", headers: {} }, r1);
eis(r1.code === 200 && r1.body?.mail === "onvolledig", "GET /api/check-aanvraag zonder wachtwoord: { mail: \"onvolledig\" }");
eis(!JSON.stringify(r1.body || {}).includes("socialnow.nl"), "GET-antwoord bevat geen adres of wachtwoord");
process.env.CHECK_SMTP_PASS = "proef";
const r2 = nepRes(); await api({ method: "GET", headers: {} }, r2);
eis(r2.code === 200 && r2.body?.mail === "klaar", "GET /api/check-aanvraag met USER en PASS: { mail: \"klaar\" }");
for (const [k, v] of [["CHECK_SMTP_USER", bewaar.u], ["CHECK_SMTP_PASS", bewaar.p]]) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }

// 3. Live: de productie meldt "klaar"
const i = process.argv.indexOf("--live");
if (i > 0) {
  const basis = (process.argv[i + 1] || "https://socialnow.nl").replace(/\/$/, "");
  let body = null, code = 0;
  try { const r = await fetch(`${basis}/api/check-aanvraag`, { headers: { "cache-control": "no-cache" } }); code = r.status; body = await r.json().catch(() => null); } catch {}
  eis(code === 200 && body?.mail === "klaar", `live ${basis}/api/check-aanvraag meldt mail: klaar (kreeg ${code} ${JSON.stringify(body)})`);
}

if (!fs.existsSync("api/check-aanvraag.js")) eis(false, "api/check-aanvraag.js bestaat");
console.log(fouten.length ? `\n${fouten.length} rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
