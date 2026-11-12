// Kiest de agenda op basis van Vercel-env. Namen van de variabelen staan in LEESMIJ.md;
// de waarden plakt Marinus zelf in Vercel en ze staan nergens in de code.
import { googleAgenda } from "./google.mjs";
import { demoAgenda } from "./demo.mjs";
import { beschikbaarheidsBron, pasToe } from "./beschikbaarheid.mjs";
import config from "../config.mjs";

let demo = null;
let kijk = null;
let google = null;
let proef = null;
let bron = null;
let proefBron = null;

// Alleen voor de proeven: beschikbaarheid van buiten in plaats van het OS.
export function zetProefBeschikbaarheid(haal) {
  proefBron = haal;
}

// config.mjs met de blokken die Marinus op os.socialnow.nl indeelt. Zonder sleutel, of als het OS niet
// antwoordt en er nog geen goede versie is, gewoon config.mjs (ma t/m vr 10.00 tot 18.00).
export async function effectieveConfig(env = process.env) {
  if (proefBron) return pasToe(config, await proefBron());
  bron ??= beschikbaarheidsBron({
    url: env.BOEKING_BESCHIKBAARHEID_URL || "https://os.socialnow.nl/api/beschikbaarheid",
    sleutel: (env.BOEKING_BEHEER_SLEUTEL || "").length >= 24 ? env.BOEKING_BEHEER_SLEUTEL : "",
  });
  return pasToe(config, await bron());
}

// Alleen voor de proeven: een agenda van buiten in plaats van Google of de voorbeeldagenda.
export function zetProefAgenda(agenda) {
  proef = agenda;
}

const lijst = (w) => String(w || "").split(",").map((s) => s.trim()).filter(Boolean);

export function instellingen(env = process.env) {
  const heeftGoogle = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN);
  const productie = env.VERCEL_ENV === "production";
  return {
    heeftGoogle,
    // Zonder Google-sleutels draait de pagina als voorbeeld. Op productie is dat alleen kijken: de bezoeker
    // ziet de echte blokken van Marinus, maar boeken gaat dan via het contactformulier, nooit in het niets.
    demo: !heeftGoogle,
    alleenKijken: !heeftGoogle && productie && env.BOEK_DEMO !== "1",
    geheim: env.BOEK_GEHEIM || (heeftGoogle ? "" : "alleen-voor-de-voorbeeldagenda"),
    basisUrl: (env.BOEK_BASIS_URL || "https://book.socialnow.nl").replace(/\/+$/, ""),
    noodroute: env.BOEK_NOODROUTE_URL || "",
    extraGasten: lijst(env.BOEK_TEAM_GASTEN).map((email) => ({ email })),
  };
}

export function kiesAgenda(env = process.env) {
  if (proef) return proef;
  const ins = instellingen(env);
  if (ins.heeftGoogle) {
    google ??= googleAgenda({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      refreshToken: env.GOOGLE_REFRESH_TOKEN,
      agendaId: env.GOOGLE_CALENDAR_ID || "primary",
      bezetAgendas: lijst(env.GOOGLE_BUSY_CALENDARS),
    });
    return google;
  }
  if (ins.alleenKijken) return (kijk ??= demoAgenda(config.tijdzone, { voorbeeldBezet: false }));
  if (ins.demo) return (demo ??= demoAgenda(config.tijdzone));
  return null;
}
