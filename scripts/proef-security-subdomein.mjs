#!/usr/bin/env node
// Proef (22 oktober 2026, regie security-campagne): security.socialnow.nl stuurt permanent (308) door naar
// https://socialnow.nl/security. Een Vercel-domeinomleiding kan alleen naar een domein, dus de regel staat in vercel.json
// met een host-voorwaarde. Rood op main, groen op de tak. Gebruik: node scripts/proef-security-subdomein.mjs
// Na livegang: PROEF_LIVE=1 node scripts/proef-security-subdomein.mjs controleert ook het echte adres.
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const cfg = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
const regels = (cfg.redirects || []).filter((r) => (r.has || []).some((h) => h.type === "host" && h.value === "security.socialnow.nl"));
eis(regels.length === 1, "één omleiding met host-voorwaarde security.socialnow.nl");
const r = regels[0] || {};
// "/:pad*" pakt live de kale "/" niet (22 okt gemeten: 200 in plaats van 308), "/(.*)" wel.
eis(r.source === "/(.*)", "elk pad op het subdomein gaat mee, ook de kale /");
eis(r.destination === "https://socialnow.nl/security", "doel is https://socialnow.nl/security");
eis(r.permanent === true, "permanent (308)");
eis((cfg.redirects || []).indexOf(r) === 0, "staat bovenaan, vóór de andere omleidingen");
if (process.env.PROEF_LIVE) {
  for (const [pad, verwacht] of [["/", "https://socialnow.nl/security"], ["/?domein=link.nl", "https://socialnow.nl/security?domein=link.nl"], ["/iets", "https://socialnow.nl/security"]]) {
    const res = await fetch(`https://security.socialnow.nl${pad}`, { redirect: "manual" }).catch((e) => ({ status: 0, headers: new Headers(), fout: e.message }));
    const naar = res.headers.get("location") || "";
    eis(res.status === 308 && naar === verwacht, `live: security.socialnow.nl${pad} geeft 308 naar ${verwacht} (kreeg ${res.status} ${naar || res.fout || ""})`);
  }
  const doel = await fetch("https://socialnow.nl/security");
  eis(doel.status === 200, `live: https://socialnow.nl/security geeft 200 (kreeg ${doel.status})`);
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
