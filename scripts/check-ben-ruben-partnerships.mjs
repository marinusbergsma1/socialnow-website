#!/usr/bin/env node
// Proef: Ben Sterckx als Sales & Partnerships in de groep Partnerships naast Fabiana, en "Cold Calling" weg uit de functie
// van Ruben Spyckerelle (nieuw: B2B Appointment Setting). Marinus, 4 nov 2026.
// Gebruik: node scripts/check-ben-ruben-partnerships.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (f) => fs.readFileSync(f, "utf8");
const content = lees("proposal/content.ts");
const trust = lees("proposal/TeamTrust.tsx");
const connect = lees("proposal/ConnectExperts.tsx");
const homeTeam = lees("proposal/HomeTeam.tsx");
const postbuild = lees("scripts/postbuild.mjs");
const talen = fs.readdirSync("proposal/i18n").filter(f => f.endsWith(".json") && !f.startsWith("."));
const woordenboeken = Object.fromEntries(talen.map(f => [f, JSON.parse(lees(`proposal/i18n/${f}`))]));
const en = woordenboeken["en.json"];

// Ben Sterckx
eis(/name: "Ben Sterckx", role: "Sales & Partnerships", image: "Ben-Sterckx\.webp", linkedin: "https:\/\/www\.linkedin\.com\/in\/bensterckx\/"/.test(content), "Ben in het team als Sales & Partnerships, met LinkedIn");
eis(["Ben-Sterckx.webp", ...[96, 160, 320, 480].map(m => `klein/Ben-Sterckx-${m}.webp`)].every(f => fs.existsSync(`public/images/${f}`)), "foto van Ben in alle maten");
const groep = content.match(/\{ name: "Partnerships", members: \[([^\]]*)\]/);
eis(!!groep && /"Fabiana Abauna", "Ben Sterckx"/.test(groep[1]), "Connect-groep Partnerships: Ben direct na Fabiana");
eis(/functie: "Partnerships", mensen: \[[^\]]*"Fabiana Abauna", "Ben Sterckx"/.test(trust), "teammuur: Ben onder Partnerships naast Fabiana");
eis(/\["Partnerships", \[[^\]]*"Ben Sterckx"/.test(trust), "teamlagen: Ben in de laag Partnerships");
eis(en["Ben Sterckx"] === "Ben Sterckx" && en["Sales & Partnerships"] === "Sales & Partnerships", "Engelse teksten voor Ben aanwezig");
eis(postbuild.includes("person('Ben Sterckx', 'Sales & Partnerships')") && postbuild.includes("https://www.linkedin.com/in/bensterckx/"), "Ben in de gestructureerde teamgegevens");

// Ruben Spyckerelle zonder Cold Calling
const bronnen = { "content.ts": content, "TeamTrust.tsx": trust, "ConnectExperts.tsx": connect, "HomeTeam.tsx": homeTeam, "postbuild.mjs": postbuild };
const metCold = Object.entries(bronnen).filter(([, t]) => /cold[ -]?calling/i.test(t)).map(([f]) => f);
eis(metCold.length === 0, `geen Cold Calling meer in de sitebronnen${metCold.length ? " (nog in " + metCold.join(", ") + ")" : ""}`);
const talenMetCold = talen.filter(f => Object.entries(woordenboeken[f]).some(([k, v]) => /cold[ -]?calling/i.test(k) || /cold[ -]?calling/i.test(String(v))));
eis(talenMetCold.length === 0, `geen Cold Calling meer in de woordenboeken${talenMetCold.length ? " (nog in " + talenMetCold.join(", ") + ")" : ""}`);
eis(/name: "Ruben Spyckerelle"[^}]*role: "B2B Appointment Setting · Benelux & DACH"/.test(content), "Ruben in content.ts: B2B Appointment Setting · Benelux & DACH");
eis(connect.includes('"B2B Appointment Setting"') && homeTeam.includes('"B2B Appointment Setting"'), "Connect en homepage-team tonen B2B Appointment Setting");
eis(/"Ruben Spyckerelle": "B2B Appointment Setting"/.test(trust), "korte rol van Ruben is B2B Appointment Setting");
eis(talen.every(f => woordenboeken[f]["B2B Appointment Setting · Benelux & DACH"]), "alle woordenboeken kennen de nieuwe functie van Ruben");
eis(en["B2B Appointment Setting"] === "B2B Appointment Setting", "Engelse korte functie van Ruben aanwezig");

if (process.argv.includes("--dist")) {
  for (const pagina of ["dist/nl/index.html", "dist/nl/team/index.html", "dist/index.html"]) {
    if (!fs.existsSync(pagina)) { eis(false, `${pagina} bestaat`); continue; }
    const html = lees(pagina);
    eis(!/cold[ -]?calling/i.test(html), `${pagina} zonder Cold Calling`);
    if (!pagina.includes("/team/")) eis(html.includes("Ben Sterckx") && html.includes("Sales &amp; Partnerships") && html.includes("/images/klein/Ben-Sterckx-"), `${pagina} toont Ben met foto`);
  }
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
