// Proef 4 oktober 2026: het teamvlak in de hero krijgt de twee duo's (SocialNow donkerblauw met logo, Attesso roze met ~/a),
// de rest als Independent entrepreneurs, Marinus' verhaal in een eigen vak en het blok Currently building met echte logo's.
// Geen zwarte Let's get-tegel en geen zwarte join-balk meer. AI Payments hoort alleen bij Sid (Attesso).
// Ook: het echte XXL Nutrition-logo in Talking to en kleinere partnerlogo's ("Verder logo's veel te groot").
// Rood op main f990846, groen op feat/team-duos-tekst-20261004.
import { readFileSync, existsSync } from "node:fs";
const team = readFileSync("proposal/TeamTrust.tsx", "utf8"), css = readFileSync("proposal/hero-c.css", "utf8");
// 5 oktober 2026: de witte Talking to-balk is weg (scripts/proef-talking-to-weg.mjs).
const balk = existsSync("proposal/PartnerBalk.tsx") ? readFileSync("proposal/PartnerBalk.tsx", "utf8") : "";
const pages = readFileSync("proposal/pages.tsx", "utf8"), content = readFileSync("proposal/content.ts", "utf8");
const rol = naam => (content.match(new RegExp(`name: "${naam}",[\\s\\S]*?role: "([^"]+)"`)) || [])[1] || "";
const bestaat = p => existsSync("public" + p);
const eisen = [
  ["SocialNow-duo met logo en Advertisement & Consultancy", team.includes('className="h-duo is-sn"') && team.includes("SocialNow-Logo-2026-400.webp") && team.includes("Advertisement &amp; Consultancy")],
  ["Attesso-duo met ~/a en AI Payments", team.includes('className="h-duo is-attesso"') && team.includes("~/a") && team.includes("AI Payments")],
  ["duo's: Marinus en Steef, Sid en Douwe", /SOCIALNOW_DUO = \["Marinus Bergsma", "Steef Komen"\]/.test(team) && /ATTESSO_DUO = \["Sid van Kalken", "Douwe Kramer"\]/.test(team)],
  ["de rest als Independent entrepreneurs", team.includes("Independent entrepreneurs")],
  ["geen zwarte Let's get-tegel en geen join-balk", !team.includes("h-team-jij") && !team.includes("h-team-join-balk")],
  ["uitnodiging als tekstlink", team.includes("Join the network")],
  ["Currently building met zes echte logo's", team.includes("Currently building") && ["/images/partners/odoo.svg", "/images/partners/salesforce.svg", "/images/partners/integraties/afas.png", "/images/partners/integraties/exact.svg", "/images/partners/integraties/hubspot.svg", "/images/partners/integraties/dynamics-365.svg"].every(p => team.includes(p) && bestaat(p))],
  ["Odoo-uitleg en AGI-zin", team.includes("proven free accounting and website layer") && team.includes("universal ERP connections") && team.includes("always stays yours")],
  ["Tristan met KLM en BearingPoint, Douwe met ByteChat en ByteVision", ["/images/merken/klm.svg", "/images/merken/bearingpoint.svg", "/images/merken/bytechat.svg", "/images/merken/bytevision.png"].every(p => team.includes(p) && bestaat(p))],
  ["verhaal van Marinus in een eigen vak", pages.includes('className="h-team-verhaal"') && pages.includes("Why I started") && pages.includes("family of makers") && pages.includes("free, fair and social economy")],
  ["AI Payments niet bij Steef en Michelle, wel bij Sid", !rol("Steef Komen").includes("AI Payments") && !rol("Michelle Yang").includes("AI Payments") && rol("Sid van Kalken").includes("AI Payments")],
  ["SocialNow-duo donkerblauw naar zwart, groen feller", /\.h-duo\.is-sn \{[^}]*#16233a[^}]*#0b0f12/.test(css) && /b\.g \{ color: #0cb457; \}/.test(css)],
  ["LinkedIn bij Tristan en Douwe, bedrijfslogo's linken door", ["https://www.linkedin.com/in/tristan-slobben-105056159/", "https://www.linkedin.com/in/douwe-kramer-attesso/", "https://www.klm.com", "https://www.bearingpoint.com", "https://bytechat.io", "https://bytevision.io"].every(u => team.includes(`"${u}"`)) && team.includes('rel: "noopener noreferrer"')],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
