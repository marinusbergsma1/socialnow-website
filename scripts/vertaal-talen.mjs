// 30 september 2026 (Marinus): "Ik wil de site in minimaal 10 talen." Dit script vult de woordenboeken
// van de extra talen vanuit het Nederlands (sleutel) en het Engels (bestaande vertaling). Het slaat
// elke partij direct op, dus een tweede run gaat verder waar de eerste stopte en vertaalt alleen wat
// ontbreekt. De sleutel voor OpenRouter komt uit ~/.jev-router/.env en komt nooit in de code.
// Gebruik: node scripts/vertaal-talen.mjs [taal ...]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";

const TALEN = {
  es: "Spanish (Spain). Address the reader informally with tú.",
  it: "Italian. Address the reader informally with tu.",
  pt: "European Portuguese (Portugal). Address the reader informally with tu.",
  pl: "Polish. Address the reader informally (ty).",
  sv: "Swedish. Address the reader with du.",
  da: "Danish. Address the reader with du.",
  tr: "Turkish. Address the reader politely (siz).",
  ja: "Japanese. Use natural, polite business Japanese (desu/masu).",
};
const MODEL = process.env.VERTAAL_MODEL || "anthropic/claude-sonnet-5.5";
const PARTIJ = 70;
const TEGELIJK = 4;

const sleutel = readFileSync(`${homedir()}/.jev-router/.env`, "utf8").match(/^OPENROUTER_API_KEY=(.+)$/m)?.[1]?.trim();
if (!sleutel) throw new Error("OPENROUTER_API_KEY ontbreekt in ~/.jev-router/.env");

const en = JSON.parse(readFileSync("proposal/i18n/en.json", "utf8"));
const de = JSON.parse(readFileSync("proposal/i18n/de.json", "utf8"));
const bron = { ...de, ...en }; // Engels waar het kan; de enkele sleutel die alleen in de/fr staat via het Duits.
const sleutels = Object.keys(bron);

const REGELS = `You translate website copy for SocialNow, a Dutch company that builds a personal AI-driven business OS (running on Odoo) with a real team of professionals.
Each item has the Dutch source ("nl") and the approved English translation ("en"). Translate into the target language, following the meaning of both.
Rules:
- Keep brand and product names exactly: SocialNow, SocialNow OS, OS, Odoo, Milo, Attesso, Salesforce, Komen Consultancy, WhatsApp, LinkedIn, Google Ads, Light Art, person names, company names, URLs, e-mail addresses.
- Never mention any AI model or AI vendor by name.
- Keep placeholders like {bedrag} exactly. Keep *asterisks* around the same phrase (they mark green highlighted text). Keep leading/trailing punctuation style, emoji, arrows, numbers, currency and "·" separators.
- If the English is a proper name, code, or already identical to the Dutch (a name), return it unchanged.
- Short UI labels stay short. Tone: warm, direct, confident, plain language, no marketing clichés.
Return ONLY a JSON object mapping each id to its translation string.`;

async function vraag(taal, partij, poging = 1) {
  const invoer = Object.fromEntries(partij.map((k, i) => [String(i), { nl: k, en: bron[k] }]));
  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${sleutel}`, "Content-Type": "application/json", "X-Title": "SocialNow vertalingen" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 9000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `${REGELS}\nTarget language: ${TALEN[taal]}` },
          { role: "user", content: JSON.stringify(invoer) },
        ],
      }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
    const tekst = (await r.json()).choices[0].message.content.replace(/^```(?:json)?\s*|\s*```$/g, "");
    const uit = JSON.parse(tekst);
    const goed = {};
    partij.forEach((k, i) => {
      const v = uit[String(i)];
      if (typeof v !== "string" || !v.trim()) return;
      const sterren = (s) => (s.match(/\*/g) || []).length;
      const plek = (s) => (s.match(/\{[a-z_]+\}/g) || []).sort().join();
      if (sterren(v) !== sterren(bron[k]) || plek(v) !== plek(bron[k])) return;
      goed[k] = v;
    });
    return goed;
  } catch (fout) {
    if (poging >= 4) { console.error(`[${taal}] partij mislukt: ${fout.message}`); return {}; }
    await new Promise((z) => setTimeout(z, 2000 * poging));
    return vraag(taal, partij, poging + 1);
  }
}

async function vertaal(taal) {
  const pad = `proposal/i18n/${taal}.json`;
  const klaar = existsSync(pad) ? JSON.parse(readFileSync(pad, "utf8")) : {};
  const open = sleutels.filter((k) => !(k in klaar));
  const partijen = [];
  for (let i = 0; i < open.length; i += PARTIJ) partijen.push(open.slice(i, i + PARTIJ));
  console.log(`[${taal}] ${open.length} open in ${partijen.length} partijen`);
  let volgende = 0;
  const bewaar = () => writeFileSync(pad, JSON.stringify(Object.fromEntries(sleutels.filter((k) => k in klaar).map((k) => [k, klaar[k]])), null, 2) + "\n");
  await Promise.all(Array.from({ length: TEGELIJK }, async () => {
    while (volgende < partijen.length) {
      const p = partijen[volgende++];
      Object.assign(klaar, await vraag(taal, p));
      bewaar();
    }
  }));
  const mist = sleutels.filter((k) => !(k in klaar)).length;
  console.log(`[${taal}] klaar, ${sleutels.length - mist}/${sleutels.length}${mist ? `, ${mist} missen nog (run opnieuw)` : ""}`);
}

const gekozen = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TALEN);
for (const taal of gekozen) await vertaal(taal);
