// Kiest de agenda op basis van Vercel-env. Namen van de variabelen staan in LEESMIJ.md;
// de waarden plakt Marinus zelf in Vercel en ze staan nergens in de code.
import { googleAgenda } from "./google.mjs";
import { demoAgenda } from "./demo.mjs";
import config from "../config.mjs";

let demo = null;
let google = null;

const lijst = (w) => String(w || "").split(",").map((s) => s.trim()).filter(Boolean);

export function instellingen(env = process.env) {
  const heeftGoogle = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN);
  const productie = env.VERCEL_ENV === "production";
  return {
    heeftGoogle,
    // Zonder sleutels draait de pagina buiten productie als voorbeeld; op productie nooit.
    demo: !heeftGoogle && (!productie || env.BOEK_DEMO === "1"),
    geheim: env.BOEK_GEHEIM || (heeftGoogle ? "" : "alleen-voor-de-voorbeeldagenda"),
    basisUrl: (env.BOEK_BASIS_URL || "https://book.socialnow.nl").replace(/\/+$/, ""),
    noodroute: env.BOEK_NOODROUTE_URL || "",
    extraGasten: lijst(env.BOEK_TEAM_GASTEN).map((email) => ({ email })),
  };
}

export function kiesAgenda(env = process.env) {
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
  if (ins.demo) return (demo ??= demoAgenda(config.tijdzone));
  return null;
}
