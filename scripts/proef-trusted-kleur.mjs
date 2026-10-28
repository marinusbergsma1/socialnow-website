// Proef: Trusted by in het startbeeld van de OS-film met alle logo's in kleur (28 oktober 2026, Marinus: "alle logo's in kleur").
// Rood op main 01037b9, groen op feat/trusted-kleur-20261028.
import { readFileSync, existsSync } from "node:fs";

const lees = p => readFileSync(p, "utf8");
const css = lees("proposal/explainer-player.css");
const speler = lees("proposal/ExplainerPlayer.tsx");
const regel = css.match(/\.sn-startbeeld-merken img\{[^}]*\}/)?.[0] ?? "";
let rood = 0;
const eis = (ok, tekst) => { console.log(`${ok ? "groen" : "ROOD "}  ${tekst}`); if (!ok) rood++; };

eis(regel && !/filter|opacity/.test(regel), "logo's in Trusted by zonder grijs- of witfilter en op volle sterkte");
eis(!/\.sn-startbeeld-merken img\.is-kleur\{[^}]*grayscale/.test(css), "geen grayscale meer voor de kleurlogo's");
eis(speler.includes("/images/merken/WARNER-BROS-KLEUR.svg") && existsSync("public/images/merken/WARNER-BROS-KLEUR.svg"), "Warner Bros. in het blauw van het schild");
eis(["UNIVERSAL-LOGO-WIT.svg", "IMAX-LOGO-WIT.svg"].every(f => speler.includes(`/images/merken/${f}`) && existsSync(`public/images/merken/${f}`)), "Universal en IMAX helder wit in plaats van grijs");
eis(["AZ", "Supperclub", "Crafture", "Universal", "Warner Bros.", "MOJO", "IMAX", "Marvel"].every(n => speler.includes(`naam: "${n}"`)), "zelfde merken en volgorde als voorheen");

process.exit(rood ? 1 : 0);
