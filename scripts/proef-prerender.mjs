// Proef eerste beeld zonder JavaScript (30 september 2026, Marinus: "WIL ECHT INSTANT LOADING").
// Leest de bouw in dist/, dus eerst npm run build. Rood op main b759d3d en 450d83e, groen op perf/prerender-eerste-beeld.
import { existsSync, readFileSync } from "node:fs";

if (!existsSync("dist/nl/index.html")) {
  console.error("Geen dist/nl/index.html: draai eerst npm run build.");
  process.exit(1);
}
const lees = (pad) => readFileSync(pad, "utf8");
const inRoot = (html) => html.split('<div id="root"')[1]?.split("</main>")[0] || "";
const kop = (html) => html.split("</head>")[0];
const woorden = (html) => (html.split(/<body[^>]*>/)[1] || "")
  .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&[#a-z0-9]+;/gi, " ")
  .split(/\s+/)
  .filter(Boolean).length;

const nl = lees("dist/nl/index.html");
const en = lees("dist/index.html");
const de = lees("dist/de/index.html");
const fr = lees("dist/fr/index.html");
const sitemap = lees("dist/sitemap.xml");
const paden = [...new Set([...sitemap.matchAll(/<loc>https:\/\/socialnow\.nl([^<]*)<\/loc>/g)].map((m) => m[1] || "/"))];
const bestand = (pad) => `dist${pad === "/" ? "" : pad.replace(/\/$/, "")}/index.html`;
const zonderInhoud = paden.filter((pad) => !/<div id="root" data-prerender="(en|nl|de|fr)">(<div[^>]*>){0,2}<div class="sn-site"/.test(lees(bestand(pad))));
const index = lees("index.tsx");

const eisen = [
  ["/nl/ heeft de kop Let’s get SocialNow in de HTML", /<h1[^>]*h-taalwissel[\s\S]*?Let’s get/.test(inRoot(nl))],
  ["/nl/ heeft het inlogblok Log in op je gratis OS in de HTML", inRoot(nl).includes("Log in op je gratis OS")],
  ["/ (Engels) heeft kop en Log in to your free OS", inRoot(en).includes("Let’s get") && inRoot(en).includes("Log in to your free OS")],
  ["/de/ en /fr/ hebben het inlogblok in hun eigen taal", inRoot(de).includes("Bei Ihrem kostenlosen OS anmelden") && inRoot(fr).includes("Connectez-vous à votre OS gratuit")],
  ["/nl/ toont zonder JavaScript meer dan 500 woorden", woorden(nl) > 500],
  [`elke route uit de sitemap (${paden.length}) is voorgerenderd`, paden.length >= 140 && zonderInhoud.length === 0],
  ["404 blijft leeg, zodat een onbekende route geen homepage toont", lees("dist/404.html").includes('<div id="root"></div>')],
  ["kritieke CSS staat inline in de head, met de hero erin", /<style>[\s\S]*\.h-hero[\s\S]*<\/style>/.test(kop(nl))],
  ["de volledige stylesheet blokkeert niet", !/<link rel="stylesheet"[^>]*\.css/.test(kop(nl).replace(/<noscript>[\s\S]*?<\/noscript>/g, "")) && /<link rel="preload"[^>]*as="style"|<link rel="preload"[^>]*onload="this\.rel='stylesheet'"/.test(kop(nl))],
  ["zonder JavaScript laadt de stylesheet via noscript", /<noscript><link rel="stylesheet"[^>]*\.css"><\/noscript>/.test(kop(nl))],
  ["letter van de kop (TT Norms Bold, woff2) wordt vooraf geladen", /<link rel="preload" href="\/assets\/TTNorms-Bold-[^"]+\.woff2" as="font" type="font\/woff2" crossorigin>/.test(kop(nl))],
  ["logo in de kop wordt vooraf geladen, in dezelfde maat als de <img>", (() => {
    const img = inRoot(nl).match(/<a class="h-brand"[^>]*><img[^>]*src="([^"]+)"/)?.[1];
    return Boolean(img) && new RegExp(`<link rel="preload" href="${img}" as="image"[^>]*fetchpriority="high">`).test(kop(nl));
  })()],
  ["achtergrond van de hero (Largest Contentful Paint) wordt vooraf geladen", /<link rel="preload" href="\/beeldmerk-2026\.webp" as="image"[^>]*fetchpriority="high">/.test(kop(nl))],
  ["de browser hydrateert de voorgerenderde HTML", index.includes("hydrateRoot(") && index.includes("dataset.prerender")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
if (zonderInhoud.length) console.log(`  zonder inhoud: ${zonderInhoud.slice(0, 5).join(", ")}${zonderInhoud.length > 5 ? " ..." : ""}`);
console.log(`  /nl/ zonder JavaScript: ${woorden(nl)} woorden`);
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
