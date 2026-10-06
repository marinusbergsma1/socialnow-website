// Proef 6 oktober 2026 (Marinus): "Graag hier geen wit achter en die onderste ook er rechts naast."
// NEXT STEP in de hero: geen witte chips achter de ERP-logo's, donkere logo's in een witte variant, alle vijf op één regel.
// Gebruik: node scripts/proef-next-step-zwart.mjs [git-ref]   (zonder ref: de werkmap; met ref, bijvoorbeeld HEAD: die stand)
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const ref = process.argv[2];
const lees = (pad) => ref ? execFileSync("git", ["show", `${ref}:${pad}`], { encoding: "utf8" }) : readFileSync(pad, "utf8");
const bestaat = (pad) => {
  if (!ref) return existsSync(pad);
  try { execFileSync("git", ["cat-file", "-e", `${ref}:${pad}`], { stdio: "ignore" }); return true; } catch { return false; }
};

const css = lees("proposal/hero-c.css");
const team = lees("proposal/TeamTrust.tsx");
const pages = lees("proposal/pages.tsx");
const regel = (sel) => (css.match(new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\{([^}]*)\\}")) || [])[1] || "";

const uit = [];
const eis = (naam, ok) => uit.push([naam, ok]);
eis("geen witte achtergrond achter de ERP-logo's", !/background\s*:\s*#fff/i.test(regel(".sn-site .h-next-erps a")));
eis("alle vijf op één regel (geen wrap op de pc)", /flex-wrap\s*:\s*nowrap/.test(regel(".sn-site .h-next-erps")));
eis("logo's worden niet platgedrukt (max-width ruim genoeg)", (Number((regel(".sn-site .h-next-erps img").match(/max-width:\s*(\d+)px/) || [])[1]) || 0) >= 100);
for (const [naam, bestand] of [["AFAS", "afas-op-zwart.png"], ["HubSpot", "hubspot-op-zwart.svg"], ["Microsoft Dynamics 365", "dynamics-365-op-zwart.svg"]]) {
  eis(`${naam}: witte variant voor zwart bestaat`, bestaat(`public/images/partners/integraties/${bestand}`));
  eis(`${naam}: witte variant gekoppeld in INTEGRATIES`, team.includes(`zwart: "/images/partners/integraties/${bestand}"`));
}
eis("hero gebruikt de variant voor zwart", pages.includes("src={systeem.zwart ?? systeem.src}"));
if (bestaat("public/images/partners/integraties/hubspot-op-zwart.svg")) {
  const hs = lees("public/images/partners/integraties/hubspot-op-zwart.svg");
  eis("HubSpot-tekst wit, oranje beeldmerk blijft", !hs.includes("#33475B") && hs.includes("#FF7A59"));
}

let fout = 0;
for (const [n, ok] of uit) { console.log(ok ? "GROEN" : "ROOD ", n); if (!ok) fout++; }
console.log(fout ? `ROOD: ${fout} van ${uit.length} eisen faalt` : `GROEN: alle ${uit.length} eisen`);
process.exit(fout ? 1 : 0);
