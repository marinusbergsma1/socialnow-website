// Proef lichte beelden en films (30 september 2026). Marinus: "site VEEL SNELLER, WIL ECHT INSTANT LOADING".
// Rood op main b759d3d, groen op perf/media-licht-20260930. Maakt de bestanden: python3 scripts/media-licht.py
// Draai: node scripts/proef-media-licht.mjs   (exit 0 = groen). Leest alleen bronbestanden en public/, geen netwerk.
import { existsSync, readFileSync, statSync, readdirSync } from "node:fs";
const lees = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const kb = (p) => (existsSync(p) ? statSync(p).size / 1024 : Infinity);
const pub = (url) => `public${url.split("?")[0]}`;

// Breedte en hoogte uit de WebP-kop (VP8, VP8L en VP8X), zonder extra pakketten.
function webpMaat(pad) {
  if (!existsSync(pad)) return null;
  const b = readFileSync(pad);
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null;
  const soort = b.toString("ascii", 12, 16);
  if (soort === "VP8 ") return { breed: b.readUInt16LE(26) & 0x3fff, hoog: b.readUInt16LE(28) & 0x3fff };
  if (soort === "VP8L") { const n = b.readUInt32LE(21); return { breed: (n & 0x3fff) + 1, hoog: ((n >> 14) & 0x3fff) + 1 }; }
  if (soort === "VP8X") return { breed: 1 + b.readUIntLE(24, 3), hoog: 1 + b.readUIntLE(27, 3) };
  return null;
}

// MP4: staat moov vóór mdat (faststart, de film start voordat hij binnen is) en hoe breed is het beeld (tkhd).
function mp4(pad) {
  if (!existsSync(pad)) return null;
  const b = readFileSync(pad);
  let plek = 0, moov = -1, mdat = -1;
  while (plek + 8 <= b.length) {
    let grootte = b.readUInt32BE(plek);
    const soort = b.toString("ascii", plek + 4, plek + 8);
    if (grootte === 1) grootte = Number(b.readBigUInt64BE(plek + 8));
    if (grootte === 0) grootte = b.length - plek;
    if (soort === "moov" && moov < 0) moov = plek;
    if (soort === "mdat" && mdat < 0) mdat = plek;
    if (grootte < 8) break;
    plek += grootte;
  }
  let breed = 0;
  if (moov >= 0) {
    const kop = b.subarray(moov, moov + b.readUInt32BE(moov));
    for (let i = kop.indexOf("tkhd"); i > 0; i = kop.indexOf("tkhd", i + 4)) {
      const versie = kop[i + 4];
      const w = kop.readUInt32BE(i + 4 + (versie === 1 ? 88 : 76)) >> 16;
      if (w > breed) breed = w;
    }
  }
  return { faststart: moov >= 0 && mdat >= 0 && moov < mdat, breed };
}

const pages = lees("proposal/pages.tsx");
const motion = lees("proposal/motion.tsx");
const bento = lees("proposal/Bento.tsx");
const team = lees("proposal/TeamTrust.tsx");
const mensEnAI = lees("proposal/MensEnAI.tsx");
const kop = lees("proposal/WebsiteProposal.tsx");
const content = lees("proposal/content.ts");
const licht = lees("proposal/licht.ts");

// Beelden in de hero (boven de vouw en het sprekersblok eronder), zoals de bron ze nu laadt.
const posterUrl = pages.match(/const HERO_POSTER = "([^"]+)"/)?.[1] || pages.match(/poster="(\/video\/os\/os-booth-en\.[a-z]+)"/)?.[1] || "";
const gezichten = [...content.matchAll(/image:\s*"([^"/]+\.(?:webp|jpg|png))"/g)].map((m) => m[1]);
const teamBron = team.includes("klein(person.image, 48)")
  ? gezichten.flatMap((g) => [96, 160].map((m) => `/images/klein/${g.replace(/\.[a-z]+$/, "")}-${m}.webp`))
  : gezichten.map((g) => `/images/${g}`);
const sprekers = [...pages.slice(pages.indexOf("function HeroSprekers"), pages.indexOf("function HeroVeilig")).matchAll(/klein\("([^"]+)", SPREKER_MAAT, \[([\d, ]+)\]\)|src="(\/images\/[^"]+)"/g)]
  .flatMap((m) => (m[3] ? [m[3]] : m[2].split(",").map((n) => `/images/klein/${m[1].replace(/\.[a-z]+$/, "")}-${n.trim()}.webp`)));
const merken = [...content.matchAll(/\["(merken\/[^"]+\.webp)"/g)].map((m) => `/images/${m[1]}`);
const kopLogo = [...kop.matchAll(/(\/images\/(?:klein\/)?SocialNow-Logo-2026[^" ,]*\.webp)/g)].map((m) => m[1]);
const milos = ["website", "crm", "content", "ads-magenta"];
const pilMaat = pages.match(/className="h-milo-pil"><MiloMotion [^>]*maat=\{(\d+)\}/)?.[1];
const pilPosters = milos.map((r) => `/proposal/milo/${r}${pilMaat ? `-${pilMaat}` : ""}.webp`);
const heroBeelden = [posterUrl, ...teamBron, ...sprekers, ...merken, ...kopLogo, ...pilPosters].filter(Boolean);
const teZwaar = heroBeelden.filter((u) => kb(pub(u)) > 60);

// Elke <video> in de site: onder de vouw preload="none". Uitzonderingen laden pas bij zicht of klik, of zijn de landing zelf.
const uitzonderingen = [
  ["motion.tsx", "onLoadedData={() => setPlaying(true)}"], // AmbientVideo: pas in de pagina als hij in beeld is ({loaded && ...})
  ["ui.tsx", "controls"], // VideoBlock: pas na een klik op Bekijk de video
  ["MediaSliders.tsx", "controls"], // mediavenster na een klik
  ["LogoIntro.tsx", "onEnded={close}"], // intro-venster, niet in gebruik
  ["ConsentPopup.tsx", "aria-label={a.win}"], // film in de pop-up, niet op de pagina
];
const films = readdirSync("proposal").filter((f) => f.endsWith(".tsx")).flatMap((f) => {
  const bron = lees(`proposal/${f}`);
  // Van <video tot de eerste /> of </video>: daarin staat altijd de hele openingstag (ook met pijlfuncties erin).
  return [...bron.matchAll(/<video\s[\s\S]*?(?:\/>|<\/video>)/g)].map((m) => ({ f, tekst: m[0] }));
});
const verkeerd = films.filter(({ f, tekst }) => !/preload="none"/.test(tekst) && !uitzonderingen.some(([bestand, teken]) => bestand === f && tekst.includes(teken)));
const ambientPasBijZicht = /\{loaded && \(\s*<video/.test(motion);

const film = pages.slice(pages.indexOf("function Film("), pages.indexOf("function VeiligheidSpeler"));
const veilig = pages.slice(pages.indexOf("function VeiligheidSpeler"), pages.indexOf("type HeroGeluid"));
const zwareFilms = [["/video/os/os-booth-en.mp4", 2600], ...["en", "nl"].flatMap((t) => ["versleuteling", "toegang", "goedkeuring", "infrastructuur", "koppelingen"].map((s) => [`/video/veiligheid/vertrouwen-${s}-${t}.mp4`, 1300])), ["/video/verhaal/verhaal-en.mp4", 2600], ["/video/verhaal/verhaal-nl.mp4", 2600], ["/video/bedankt/logo-animatie.mp4", 150]];

const eisen = [
  [`hero: geen beeld groter dan 60 KB (${heroBeelden.length} beelden${teZwaar.length ? `; te zwaar: ${teZwaar.map((u) => `${u.split("/").pop()} ${Math.round(kb(pub(u)))} KB`).join(", ")}` : ""})`,
    heroBeelden.length > 20 && teZwaar.length === 0],
  ["hero: de poster van de OS-film is WebP, hoogstens 1280 px breed en de film gebruikt hem",
    /\.webp$/.test(posterUrl) && (webpMaat(pub(posterUrl))?.breed || 9999) <= 1280 && /poster=\{HERO_POSTER\}/.test(pages)],
  ["hero: de OS-film laadt en start pas als de poster (het eerste beeld) binnen is",
    /useNaBeeld\(poster\)/.test(film) && /<video ref=\{ref\} src=\{src\} poster=\{poster\} muted loop playsInline preload="none"/.test(film) && !/autoPlay/.test(film.slice(film.indexOf("<video"), film.indexOf("/>", film.indexOf("<video"))))],
  ["hero: de Milo's in de pillen zijn 128 px en wachten ook op de poster",
    pilMaat === "128" && /maat=\{128\} wacht=\{!klaar\}/.test(pages) && /const klaar = useNaBeeld\(HERO_POSTER\)/.test(pages) && /if \(visible && !wacht\) setLoaded\(true\)/.test(motion)],
  ["Milo's: 128 en 256 px in WebM (Chrome) en MOV met alfa (Safari), met posters",
    milos.every((r) => [128, 256].every((m) => existsSync(`public/proposal/milo/${r}-alpha-${m}.webm`) && existsSync(`public/proposal/milo/${r}-alpha-${m}.mov`) && (webpMaat(`public/proposal/milo/${r}-${m}.webp`)?.breed || 0) === m))
      && milos.every((r) => kb(`public/proposal/milo/${r}-alpha-128.webm`) < 100)],
  ["teamstrook en Mens en AI: gezichten in 96 en 160 px (de originelen zijn tot 1920 px)",
    team.includes("{...klein(person.image, 48)}") && mensEnAI.includes("{...klein(p.image, 36)}")
      && gezichten.length >= 12 && gezichten.every((g) => [96, 160].every((m) => { const w = webpMaat(`public/images/klein/${g.replace(/\.[a-z]+$/, "")}-${m}.webp`); return w && Math.min(w.breed, w.hoog) === m && kb(`public/images/klein/${g.replace(/\.[a-z]+$/, "")}-${m}.webp`) < 10; }))],
  ["een ontbrekende kleine variant valt terug op het origineel",
    /beeld\.removeAttribute\("srcset"\);\s*beeld\.src = origineel;/.test(licht)],
  ["logobalk: merklogo's hoogstens 120 px hoog (balk is 58 px), blijven eager in de strook",
    merken.length >= 6 && merken.every((u) => (webpMaat(pub(u))?.hoog || 999) <= 120) && lees("proposal/ui.tsx").includes('loading={kort ? "eager" : "lazy"}')],
  ["kop: woordmerk in 400 en 600 px in plaats van 1556 px",
    kopLogo.length >= 2 && kopLogo.every((u) => u.includes("/klein/")) && [400, 600].every((m) => webpMaat(`public/images/klein/SocialNow-Logo-2026-${m}.webp`)?.breed === m)],
  [`films onder de vouw: preload="none" (${films.length} films${verkeerd.length ? `; fout: ${verkeerd.map((v) => v.f).join(", ")}` : ""})`,
    films.length >= 8 && verkeerd.length === 0 && ambientPasBijZicht],
  ["veiligheidsfilm in de hero: film en poster pas als het blok dichtbij komt",
    /useDichtbij<HTMLDivElement>\(\)/.test(veilig) && /if \(dichtbij && ref\.current\) void ref\.current\.play\(\)/.test(veilig) && /poster=\{dichtbij \? veiligheidPoster/.test(veilig)
      && /<video[^]*?preload="none"[^]*?\/>/.test(veilig) && !/autoPlay/.test(veilig.slice(veilig.indexOf("<video"), veilig.indexOf("/>", veilig.indexOf("<video"))))],
  ["tegelfilms (verhaal, VASTIQ, veiligheid): poster pas binnen 900 px van het scherm",
    /poster=\{posterAan \? poster : undefined\}/.test(bento) && /rootMargin: "900px 0px"/.test(bento)],
  ["posters onder de vouw zijn licht (WebP, hoogstens 1280 px, onder 80 KB)",
    ["/video/verhaal/verhaal-en-poster.webp", "/video/verhaal/verhaal-nl-poster.webp", "/video/vastiq/vastiq-uitzoom-poster.webp"].every((u) => kb(pub(u)) < 80 && (webpMaat(pub(u))?.breed || 9999) <= 1280)
      && lees("proposal/Verhaal.tsx").includes('"/video/verhaal/verhaal-nl-poster.webp"') && lees("proposal/Bereikt.tsx").includes('poster="/video/vastiq/vastiq-uitzoom-poster.webp"')],
  [`zware films: H.264 op hoogstens 1280 px, faststart en onder de grens (${zwareFilms.filter(([u, max]) => !(kb(pub(u)) <= max && mp4(pub(u))?.faststart && (mp4(pub(u))?.breed || 9999) <= 1280)).map(([u]) => u.split("/").pop()).join(", ") || "alle goed"})`,
    zwareFilms.every(([u, max]) => kb(pub(u)) <= max && mp4(pub(u))?.faststart && (mp4(pub(u))?.breed || 9999) <= 1280)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
