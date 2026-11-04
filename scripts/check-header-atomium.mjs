#!/usr/bin/env node
// Proef: homepage van Marinus, 4 november 2026.
// "Deze als main image en hier stappen maken met website and branding, systems and operations, marketing and sales en dan finance
// als de stappen en daaronder het team gewoon gelijk bij connect" en "Verder na het team de websites en branding en content
// voorbeelden en dan bij read more bij odoo partners eronder de focus leggen op het blok wat nu in de footer is." en over de header
// met standfoto: "De huidige header mag naar een andere plek."
// Gebruik: node scripts/check-header-atomium.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");

const kop = lees("proposal/HeaderAlgemeen.tsx");
const header = kop.slice(kop.indexOf("export default function HeaderAlgemeen"));
const STAPPEN = ["Website en branding", "Systemen en operations", "Marketing en sales", "Finance"];
eis(header.includes("/images/verhaal/team-atomium.webp"), "header: het team bij het Atomium is het hoofdbeeld");
const stappen = kop.match(/const STAPPEN = \[([^\]]*)\]/);
eis(!!stappen && JSON.stringify(stappen[1].split(",").map((s) => s.trim().replace(/"/g, ""))) === JSON.stringify(STAPPEN) && header.includes("STAPPEN.map"), `header: vier stappen ${STAPPEN.join(", ")}`);
eis(!header.includes("odoo-experience-stand") && !header.includes("PARTNERS"), "header: geen standfoto en geen partnerkaart meer");
eis(header.includes("Bekijk de video") && header.includes("trusted by"), "header: Bekijk de video en de Trusted by-balk blijven");
// "Ik wil dat het écht duidelijk is gelijk BAM Ze kunnen mij helpen met management en operations en Odoo." en "Haal anders
// Indexworld en Uncanny maar weg en zet alleen de logo's van samenwerking eronder."
eis(header.includes("Wij helpen je met management, operations en Odoo.") && header.indexOf("management, operations en Odoo") < header.indexOf("STAPPEN.map"), "header: meteen onder de titel dat we helpen met management, operations en Odoo");
eis(["Odoo Silver Partner", "Shopify Partners", "Salesforce-partner", "Adobe-partner"].every((n) => kop.includes(`naam: "${n}"`)) && header.includes("KEURMERKEN.map") && header.indexOf("KEURMERKEN.map") < header.indexOf("STAPPEN.map"), "header: logo's van Odoo Silver, Shopify, Salesforce en Adobe onder de titel");
eis(!/(indexworld|uncanny)[^"]*\.(png|svg|webp)/i.test(kop), "Indexworld en Uncanny staan niet meer in de header of het Odoo-blok");

// Het Odoo-blok en de voorbeelden onder het team mochten later die dag weer weg: "Deze weg".
eis(!kop.includes("export function OdooPartners"), "geen apart Odoo-blok met standfoto meer");
// "Dit uit de footer en hier meer een geheel." en "Met kleur". Groei en cybersecurity staat weer onder de oude header, nu op /het-os.
const footer = lees("proposal/BrandFooter.tsx");
eis(!footer.includes("<SamenEnVeilig"), "Groei en cybersecurity staat niet meer in de footer");
const erkend = footer.slice(footer.indexOf('className="h-footer-erkend"'), footer.indexOf("</div>\n          </div>", footer.indexOf('className="h-footer-erkend"')));
eis(["Odoo Silver Partner", "Shopify Partners", "Salesforce-partner", "Adobe-partner"].every((n) => erkend.includes(`alt="${n}"`)) && !erkend.includes("h-footer-erkend-partners"), "footer: één rij met de partnerlogo's");
// Over Google, Meta en Google Developers in die rij: "Deze mogen weg".
eis(!/google-logo|meta-logo|Google Developers/.test(erkend), "footer: geen Google, Meta en Google Developers meer");
// Over het slot Start gratis met jouw systeem: "Hier focussen op een formulier of contactgegevens van Steef en Michelle en Ben.",
// "Doe maar contactgegevens met functies" en "Misschien mij nog erbij".
const slot = lees("proposal/ContactSlot.tsx");
eis(/metContact && <ContactSlot \/>/.test(footer) && ["Marinus Bergsma", "Steef Komen", "Michelle Yang", "Ben Sterckx"].every((n) => slot.includes(`naam: "${n}"`)) && slot.includes("{p.role}"), "homepage-slot: contactgegevens met functie van Marinus, Steef, Michelle en Ben");
// "Ik wil graag een Explainers slider met alle verschillende explainer video's." en "Animations and explainers doe maar dan kunnen
// ze er allemaal gewoon in."
const slider = lees("proposal/ExplainerSlider.tsx");
// Later: "Doe hier maar gewoon 1 slider van groot met de mooiste klantwerk animaties", daarna over de rijen met beelden "Die
// pijltjes hier mogen allemaal weg en moet gewoon te sliden zijn op mobiel ook." en "voeg anders die video's hier ook maar aan toe".
const media = lees("proposal/MediaSliders.tsx");
const klantwerk = media.slice(media.indexOf("export const klantwerkFilms"), media.indexOf("];", media.indexOf("export const klantwerkFilms")));
const films = [...klantwerk.matchAll(/src: "([^"?]+)/g)].map((m) => m[1]);
eis(films.length >= 8 && films.filter((f) => f.startsWith("/")).every((f) => fs.existsSync(`public${f}`)) && /kort \? mengen\(portfolioImages\.slice\(0, 5\), klantwerkFilms/.test(media), `homepage: klantwerk-films (${films.length}) lopen mee in de rijen van Branding en campagnes`);
eis(!media.includes("h-rail-arrows") && !media.includes("ChevronLeft") && /touch-action: pan-x/.test(lees("proposal/experience.css")), "rijen zonder pijlen, slepen en vegen werkt");
eis(!lees("proposal/pages.tsx").includes("<ExplainerSlider") && !lees("proposal/pages.tsx").includes("<ShowcaseFilms"), "geen aparte filmslider en geen See it in motion op de homepage");
// "de header afbeelding een langzame grow geven en de video van de Odoo Experience laten zien."
const hcss = lees("proposal/header-algemeen.css");
eis(/\.sn-alg-foto img\{[^}]*animation:sn-alg-grow/.test(hcss) && /prefers-reduced-motion:reduce\)\{\.sn-alg-foto img\{animation:none/.test(hcss), "header: foto zoomt langzaam (niet bij reduced motion)");
eis(kop.includes('const FILM = "/video/odoo-experience/odoo-experience.mp4"'), "header: Bekijk de video speelt de aftermovie van Odoo Experience");
// "Verder dottet pattern weer zichtbaar maken."
const stip = lees("proposal/stippen.css");
eis(/\.sn-team-product \{ background: transparent !important; \}/.test(stip) && /\.cx-connect \{[^}]*radial-gradient/.test(stip), "stippen: Connect-band doorzichtig, teamblok wit met stippen");
// Contact: "Doe maar gewoon de contactile van mij met info@socialnow.nl met 06 nummer dan Steef met Finance@socialnow.nl, Michelle
// mag Partners@socialnow.nl zijn en Ben Odoo@socialnow.nl. Zonder gesprek inplannen, ze kunnen wel gewoon een mail sturen of bellen."
eis([["Marinus Bergsma", "info@socialnow.nl"], ["Steef Komen", "finance@socialnow.nl"], ["Michelle Yang", "partners@socialnow.nl"], ["Ben Sterckx", "odoo@socialnow.nl"]].every(([n, m]) => slot.includes(`naam: "${n}", mail: "${m}"`)) && slot.includes('tel: "+31637404577"') && slot.includes("href={`tel:${c.tel}`}"), "contacttegels: juiste adressen, 06-nummer van Marinus, bellen en mailen");
eis(kop.includes('href="#contact"') && !kop.includes("openPlanCall") && slot.includes('id="contact"') && !fs.existsSync("proposal/GesprekPaneel.tsx"), "header: Neem contact op springt naar de tegels, geen gesprek inplannen");
// "Maak dit zakelijker" (contacttegels) en "Lijn dit in het midden uit" (hoofdmenu).
const ccss = lees("proposal/contact-slot.css");
eis(/\.sn-contactslot li\{[^}]*align-items:flex-start/.test(ccss) && /\.sn-contactslot li img\{[^}]*object-fit:cover/.test(ccss) && !/\.sn-contactslot li img\{[^}]*grayscale/.test(ccss) && /min-height:calc\(2em \* 1\.35\)/.test(ccss) && !/text-decoration-thickness:2px/.test(ccss), "contacttegels zakelijk: bovenaan uitgelijnd, vierkant in kleur (\"deze weer in kleur\"), links op één hoogte, geen dikke groene streep");
const menu = lees("proposal/hoofdmenu.css");
eis(/@media \(min-width:1280px\)\{[^@]*\.h-desktop-nav\{position:absolute;left:50%;top:50%;transform:translate\(-50%,-50%\)/.test(menu) && /\.h-language-current\{line-height:1;display:inline-flex;align-items:center\}/.test(menu), "hoofdmenu in het midden van de header, items en taalknop op één middenlijn");
// Over het grote slot op de andere pagina's: "Deze mag ook weg."
eis(!footer.includes("<Closing"), "footer: geen groot slot met Milo's meer");
const tech = lees("proposal/concept-tech.css");
eis(!/\.h-footer-erkend img \{[^}]*filter/.test(tech) && !/\.h-footer-erkend > div \{[^}]*opacity/.test(tech) , "footer: logo's in kleur, niet gedimd");

// "ik wil alleen niet af van de stippenachtergrond." De header en het Odoo-blok tekenen geen eigen dicht vlak over het stippenraster.
const css = lees("proposal/header-algemeen.css");
const basis = (css.match(/\.sn-alg\{[^}]*\}/) || [""])[0];
eis(/background:\s*transparent/.test(basis) && !/background:\s*#0{3,6}\b/.test(basis), "stippenachtergrond blijft zichtbaar: .sn-alg heeft geen eigen zwarte achtergrond");

const pages = lees("proposal/pages.tsx");
const home = pages.slice(pages.indexOf("export function Home()"));
// Over Wat we bereikten: "Deze mag weg."
eis(!home.includes("<Bereikt") && !pages.includes('import("./Bereikt")'), "homepage: geen blok Wat we bereikten meer");
// "deze Header mag weer terug bij producten daar is dat technische juist heel goed": /producten begint met HeaderBestaand.
const plek = ["<HeaderBestaand", "<SamenEnVeilig", "<ConnectExperts"].map((v) => home.indexOf(v));
eis(plek.every((p) => p >= 0) && plek[0] < plek[1] && plek[1] < plek[2] && !home.includes("<OdooPartners"), "/producten: de oude header, de partners (Groei en cybersecurity), dan het team; geen Odoo-blok");

// "Deze onderdelen bedoel ik meer die mag anders wel op de productenpagina oid." De oude header met OS, Connect en partners.
const paginas = lees("proposal/paginas.tsx");
const osPagina = paginas.slice(paginas.indexOf("export function OsPage"), paginas.indexOf("export function", paginas.indexOf("export function OsPage") + 10));
eis(!pages.slice(pages.indexOf("export function Home()"), pages.indexOf("export function ProductenPagina")).includes("<HeaderBestaand") && osPagina.includes("<HeaderBestaand"), "oude header met OS en Connect staat op /het-os en /producten, niet op de homepage");

eis(osPagina.indexOf("<SamenEnVeilig") > osPagina.indexOf("<HeaderBestaand"), "Groei en cybersecurity staat op /het-os onder de oude header");
// "Vanuit onder de websites zelf mag er meer content komen vanuit de branding en voorbeelden." en "Net als hier maar kortere titels."
const naWeb = home.slice(home.indexOf("<FreeWebsite"));
eis(naWeb.includes("<VideoSlider kort") && lees("proposal/HomeEnthousiast.tsx").includes("<ImageSliders kort"), "branding en campagnes op de homepage, video onder de websites op /producten");
// "die technische data en huidige landingspagina mag naar producten gaan dan is dit meer enthousiasmering en rest inhoudelijk en
// technisch. verder wil ik producten diensten en website actie"
const blij = lees("proposal/HomeEnthousiast.tsx");
const startHome = pages.slice(pages.indexOf("export function Home()"), pages.indexOf("export function ProductenPagina"));
const producten = pages.slice(pages.indexOf("export function ProductenPagina"));
eis(startHome.includes("<HomeEnthousiast />") && !startHome.includes("<ConnectExperts") && !startHome.includes("<HomeTechniek"), "homepage enthousiasmeert: geen team en geen techniek");
eis(['naar: "/producten"', 'naar: "/diensten"', 'naar: "/gratis-website"'].every((n) => blij.includes(n)) && (blij + lees("proposal/OdooFilm.tsx")).includes("odoo-experience-kort.mp4") && blij.includes("<TrustedBy />") && (blij.match(/<h1 /g) || []).length === 1, "homepage: één kop, de Odoo-film, merken en drie deuren: Producten, Diensten, Website-actie");
eis(["<HeaderBestaand", "<SamenEnVeilig", "<ConnectExperts", "<FreeWebsite", "<HomeTechniek"].every((k) => producten.includes(k)) && /path="\/producten" element=\{<ProductenPagina \/>\}/.test(lees("proposal/WebsiteProposal.tsx")), "/producten: de inhoudelijke en technische landingspagina");
const menuTsx = lees("proposal/Producten.tsx"), shellTsx = lees("proposal/WebsiteProposal.tsx");
eis(/NAV_LINKS: Array<\[string, string\]> = \[\s*\["\/diensten", "Diensten"\],\s*\];/.test(menuTsx) && shellTsx.includes('<NavLink to="/producten">Producten</NavLink>') && menuTsx.includes("<span>Website-actie</span>"), "menu: Producten, Diensten, Website-actie");
// "heel simpel meer focus op die websites. En onboarding graag op een witte pagina met mooiere voorbeelden en leuker om in te vullen.
// Nadruk op veiligheidsscan kan misschien wel veel kleiner."
eis(blij.indexOf('naar: "/gratis-website"') > 0 && blij.indexOf('naar: "/gratis-website"') < blij.indexOf('naar: "/producten"') && blij.includes("breed: true") && blij.includes("<WebsiteTegel />") && !/securityscan|\/security/.test(blij.replace(/\/\/.*$/gm, "")), "homepage: website-actie voorop en breed, de websites eronder, geen securityscan");
const gw = lees("proposal/GratisWebsite.tsx"), gwcss = lees("proposal/gratis-website-wit.css");
eis(/\.gw2\{[^}]*background:#fff/.test(gwcss) && gw.includes("STIJLEN.map") && gw.includes("DOELEN.map") && gw.includes("gw2-voortgang") && (gw.match(/zetStap\(/g) || []).length >= 2 && !/value=\{"[^"]+"\}|defaultValue=/.test(gw), "onboarding: witte pagina, stap voor stap, echte voorbeelden en klikbare antwoorden, geen ingevulde voorbeelddata");
// "Zet verder de Odoo video achter de header video en zorg dat die ook automatisch daar afspeelt met geluid na 3 seconden."
const film = lees("proposal/OdooFilm.tsx");
eis(blij.includes("<OdooFilm />") && film.includes('const LANG = "/video/odoo-experience/odoo-experience.mp4"') && fs.existsSync("public/video/odoo-experience/odoo-experience.mp4") && film.includes("const WACHT = 3000") && /v\.muted = false;\s*try \{ await v\.play\(\)/.test(film) && /catch \{\s*v\.muted = true/.test(film) && film.includes('"Geluid aan"') && film.includes('addEventListener("pointerdown", aan') && film.includes("prefers-reduced-motion"), "homepage: na 3 s de Odoo-aftermovie met geluid, anders gedempt met Geluid aan en geluid bij de eerste klik");
// Website-actie: "een hele cleane onboarding [...] met nog een zwarte banner met de video van mij en in 1 header net als de main".
eis(/<section className="sn-alg gw2-kop"/.test(gw) && gw.includes('src="/security/film/security-9x16.mp4"') && fs.existsSync("public/security/film/security-9x16.mp4") && gw.indexOf("gw2-kop") < gw.indexOf('id="onboarding"') && (gw.match(/<h1 /g) || []).length === 1 && !gw.includes("ConnectExperts"), "website-actie: zwarte header met de video van Marinus, direct daaronder de witte onboarding");
// "die website-onboarding waarbij ze nog de persoon kunnen aanvinken via wie ze daar zijn gekomen + Als CTA ook in de homepage".
const aanvr = lees("proposal/aanvragen.ts");
eis(gw.includes("AANBRENGERS.map") && gw.includes('"Iemand anders"'.slice(1, -1)) && gw.includes("Niemand, zelf gevonden") && /get\("ref"\)/.test(gw) && /\[w\.via, gegevens\.via\]/.test(aanvr) && (aanvr.match(/via: "/g) || []).length === 10 && gw.includes("{ via, voornaam"), "onboarding: kies via wie je kwam (foto en naam, Iemand anders, Zelf gevonden), ?ref= vult vooraf in, Aangebracht door gaat mee in de aanvraag");
eis((blij.match(/<WebsiteCTA/g) || []).length >= 2 && blij.indexOf("<WebsiteCTA />") < blij.indexOf("sn-deuren") && /gratis-website\?ref=/.test(blij), "homepage: CTA gratis nieuwe website direct onder de hero en verderop, ?ref gaat mee");
// Website-actie in de menubalk: "Deze dikgedrukt en met een shine zodat ie nog meer opvalt."
const menuCss = lees("proposal/hoofdmenu.css");
eis(/a\.h-security>span,[^{]*\{font-weight:800!important;[^}]*background-clip:text;[^}]*animation:sn-glans 5s/.test(menuCss) && /prefers-reduced-motion:reduce\)\{[^{]*a\.h-security>span[^{]*\{animation:none/.test(menuCss) && /#25d366 50%/.test(menuCss), "menu: Website-actie vet met een rustige groene glans (elke 5 s), niet bij reduced motion");
const seo = lees("scripts/brand-meta.mjs");
eis((seo.match(/'\/producten': \[/g) || []).length === 10 && lees("scripts/postbuild.mjs").includes("producten: {title:"), "/producten heeft titel en omschrijving in alle 10 talen");
const sliders = lees("proposal/MediaSliders.tsx");
eis(sliders.includes("kort ? <>Branding en campagnes.</>") && sliders.includes("kort ? <>Video en motion.</>"), "homepage-rijen hebben korte koppen");
// "Hier dezelfde logo's als ook op de main page." De logostrook op /projecten gebruikt de Trusted by-merken uit de header.
const ui = lees("proposal/ui.tsx");
const strook = ui.slice(ui.indexOf("export function ClientLogos"), ui.indexOf("export function Questions"));
eis(strook.includes("[...DIRECT, CRAFTURE, ...VIA_CRAFTURE]") && !strook.includes("logos.map"), "logostrook op /projecten: dezelfde merken als Trusted by op de homepage");

const cx = lees("proposal/ConnectExperts.tsx");
eis(!cx.includes("<details") && !cx.includes("NieuwHier"), "Connect: het team staat meteen open, geen uitklapper en geen Nieuw hier");
eis(cx.indexOf('className="cx-org"') > 0 && !cx.includes("cx-voorbeelden") && !cx.includes("VOORBEELDEN"), "Connect: geen rij voorbeelden meer na het team");
// "Deze knoppen wil ik ook met die filling en met die style zoals die": de knop Inloggen gratis OS (sn-pill).
const acties = header.slice(header.indexOf('className="sn-alg-acties"'), header.indexOf("</div>", header.indexOf('className="sn-alg-acties"')));
eis((acties.match(/className="sn-pill"/g) || []).length === 2 && !acties.includes("sn-alg-knop"), "headerknoppen hebben dezelfde stijl als Inloggen gratis OS (sn-pill)");

const nieuw = [...STAPPEN, "Een betrouwbare partner voor groei en cybersecurity", "Start met een gratis websitedemo", "Ons team bij het Atomium in Brussel", "Wij helpen je met management, operations en Odoo.", "Salesforce-partner", "Partners en specialiteiten", "Branding en campagnes.", "Video en motion.", "Neem contact met ons op.", "VASTIQ · Van één grachtenpand naar heel Amsterdam", "Hajenius · Het pand aan het Rokin", "Neem contact op", "Waar wil je beginnen?", "Alles over onze producten en techniek", "Website-actie", "Welke stijl spreekt je aan?", "Wat moet je website vooral doen?", "Meer aanvragen", "Geluid aan", "Begin met vraag 1", "Een goede website is ook een veilige website.", "Via wie ben je bij ons gekomen?", "Nieuwe website, gratis", "Vraag je gratis website aan"];
for (const l of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(lees(`proposal/i18n/${l}.json`) || "{}");
  const mist = nieuw.filter((k) => !w[k] || /[–—]/.test(w[k]));
  eis(!mist.length, `nieuwe teksten vertaald zonder gedachtestreepjes (${l})${mist.length ? ": mist " + mist.slice(0, 3).join(", ") : ""}`);
}

if (process.argv.includes("--dist")) {
  const nl = lees("dist/nl/index.html");
  const nlProd = lees("dist/nl/producten/index.html");
  eis(nlProd.includes("sn-bestaand") && nlProd.includes('id="groei"') && nlProd.includes('class="cx-org"'), "gebouwde /nl/producten: de oude header, de partners en het team");
  eis(nl.includes("sn-deuren") && nl.includes("odoo-experience-kort.mp4") && !nl.includes('class="cx-org"'), "gebouwde nl-homepage: deuren en film, geen team");
  eis(!nl.includes('id="groei"') && !nl.includes("odoo-experience-stand") && !nl.includes("cx-voorbeelden") && nl.includes("h-image-showcase") && !nl.includes('id="bereikt"') && nl.includes("sn-contactslot") && nl.includes("partners@socialnow.nl") && nl.includes("tel:+31637404577"), "gebouwde nl-homepage: geen Groei-blok, geen Odoo-blok, wel branding en de contacttegels");
  const os = lees("dist/nl/het-os/index.html");
  eis(os.includes("sn-bestaand") && os.includes('id="groei"') && !nl.includes("sn-bestaand"), "gebouwde /het-os toont de oude header met Groei en cybersecurity, de homepage niet");
  const en = lees("dist/index.html");
  eis(en.includes("Where would you like to start?") && en.includes("We help you with management, operations and Odoo.") && lees("dist/producten/index.html").includes("sn-bestaand"), "gebouwde en-homepage en /producten zijn vertaald");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
