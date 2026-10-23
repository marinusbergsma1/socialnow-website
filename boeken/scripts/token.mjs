// Eenmalig: haalt de Google refresh token op en zet de drie Google-waarden in Vercel.
// Draai dit zelf in je eigen terminal: npm run token (in de map boeken).
// De waarden gaan rechtstreeks van Google naar Vercel; ze komen niet in een bestand, niet in git
// en niet in een chat. Alleen als je kiest voor "zelf plakken" verschijnt de token op je eigen scherm.
import http from "node:http";
import { readFileSync } from "node:fs";
import { spawnSync, spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { randomBytes } from "node:crypto";

const PROJECT = "socialnow-boeken";
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
];

function vraag(tekst, verborgen = false) {
  return new Promise((klaar) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (verborgen) rl._writeToOutput = (s) => { if (s.includes(tekst)) rl.output.write(s); };
    rl.question(tekst, (a) => { rl.close(); if (verborgen) process.stdout.write("\n"); klaar(a.trim()); });
  });
}

const clientId = await vraag("Client ID (van de OAuth-client, type Desktop app): ");
const clientSecret = await vraag("Client secret (wordt niet getoond): ", true);
if (!clientId || !clientSecret) { console.log("Client ID en secret zijn nodig."); process.exit(1); }

const staat = randomBytes(16).toString("hex");
const code = await new Promise((klaar, stop) => {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    if (url.pathname !== "/") { res.statusCode = 404; return res.end(); }
    res.setHeader("content-type", "text/html; charset=utf-8");
    if (url.searchParams.get("state") !== staat || !url.searchParams.get("code")) {
      res.end("<p>Er ging iets mis. Sluit dit venster en probeer opnieuw.</p>");
      server.close();
      return stop(new Error(url.searchParams.get("error") || "geen code"));
    }
    res.end("<p>Gelukt. Je kunt dit venster sluiten en terug naar de terminal.</p>");
    server.close();
    klaar({ code: url.searchParams.get("code"), redirect: `http://127.0.0.1:${server.address().port}` });
  });
  server.listen(0, "127.0.0.1", () => {
    const redirect = `http://127.0.0.1:${server.address().port}`;
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirect, response_type: "code", scope: SCOPES.join(" "), access_type: "offline", prompt: "consent", state: staat });
    console.log("\nLog in met het Google-account van de SocialNow-agenda. Opent de browser niet vanzelf, open dan:\n" + url + "\n");
    spawn("open", [String(url)], { stdio: "ignore", detached: true }).on("error", () => {});
  });
});

const r = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ code: code.code, client_id: clientId, client_secret: clientSecret, redirect_uri: code.redirect, grant_type: "authorization_code" }),
});
const j = await r.json();
if (!j.refresh_token) { console.log("Google gaf geen refresh token:", j.error || r.status); process.exit(1); }
console.log("Refresh token ontvangen.");

let project = null;
try { project = JSON.parse(readFileSync(new URL("../.vercel/project.json", import.meta.url), "utf8")).projectName; } catch {}
if (project !== PROJECT) {
  console.log(`\nDeze map is niet gekoppeld aan Vercel-project ${PROJECT} (gevonden: ${project || "geen"}).`);
  console.log("Koppel eerst met: vercel link --project socialnow-boeken. Er is niets in Vercel gezet.");
  if ((await vraag("Token hier tonen om zelf in Vercel te plakken? (j/n) ")).toLowerCase() === "j") console.log(j.refresh_token);
  process.exit(0);
}

if ((await vraag(`Nu GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET en GOOGLE_REFRESH_TOKEN in ${PROJECT} zetten (production)? (j/n) `)).toLowerCase() !== "j") process.exit(0);
for (const [naam, waarde] of [["GOOGLE_CLIENT_ID", clientId], ["GOOGLE_CLIENT_SECRET", clientSecret], ["GOOGLE_REFRESH_TOKEN", j.refresh_token]]) {
  for (const omgeving of ["production"]) {
    spawnSync("vercel", ["env", "rm", naam, omgeving, "--yes"], { stdio: "ignore", cwd: new URL("..", import.meta.url) });
    const uit = spawnSync("vercel", ["env", "add", naam, omgeving], { input: waarde, stdio: ["pipe", "ignore", "pipe"], cwd: new URL("..", import.meta.url) });
    console.log(`${naam} ${omgeving}: ${uit.status === 0 ? "gezet" : "mislukt " + String(uit.stderr).slice(0, 200)}`);
  }
}
console.log("\nKlaar. Publiceer opnieuw (vercel --prod) zodat de functies de nieuwe waarden lezen.");
