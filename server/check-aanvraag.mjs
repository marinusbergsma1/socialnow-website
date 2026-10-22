// Aanvragen uit het formulier op socialnow.nl/security (eerst /check) (22 oktober 2026, Marinus). Elke inzending wordt één mail naar
// secure@socialnow.nl (alias van de mailbox info@, dus hij komt in die inbox), met Reply-To op het adres van de bezoeker.
// Geen bevestiging naar de bezoeker. Afzender: Hostinger laat verzenden namens een alias alleen in de webmail toe, niet
// via SMTP; daarom is de afzender standaard het SMTP-account zelf (info@). Kan secure@ later toch als afzender, zet dan
// CHECK_MAIL_VAN. De SMTP-gegevens staan alleen in de env van Vercel:
//
//   CHECK_SMTP_HOST   standaard smtp.hostinger.com
//   CHECK_SMTP_PORT   standaard 465 (TLS)
//   CHECK_SMTP_USER   het Hostinger-mailadres dat verstuurt
//   CHECK_SMTP_PASS   het wachtwoord van dat adres
//   CHECK_MAIL_NAAR   standaard secure@socialnow.nl
//   CHECK_MAIL_VAN    standaard gelijk aan CHECK_SMTP_USER
//
// Lukt versturen niet (geen env, server weg), dan probeert de functie het nog één keer en schrijft daarna de hele
// aanvraag als één regel "CHECK_AANVRAAG_NIET_VERSTUURD" in de Vercel-logs. Zo verdwijnt er geen aanvraag stilletjes;
// de bezoeker ziet hoe dan ook "Ontvangen".

const schoon = (w, max) => String(w ?? "").replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const UITSLAGEN = { groen: "groen", rood: "rood", oranje: "oranje", onbekend: "afgeschermd" };

export function leesAanvraag(b = {}) {
  return {
    naam: schoon(b.naam, 100),
    email: schoon(b.email, 200).toLowerCase(),
    domein: schoon(b.domein, 200).toLowerCase(),
    uitslag: Object.hasOwn(UITSLAGEN, b.uitslag) ? b.uitslag : "",
    phpVersie: schoon(b.phpVersie, 80),
    telefoon: schoon(b.telefoon, 40),
    hosting: schoon(b.hosting, 120),
    vraag: String(b.vraag ?? "").slice(0, 2000).trim(),
    taal: schoon(b.taal, 5),
    soort: b.soort === "uitgebreide-check" ? "uitgebreide-check" : b.soort === "contact" ? "contact" : "",
    honing: schoon(b.website2, 100),
  };
}

export function controleerAanvraag(a) {
  if (a.honing) return "honing";
  if (!a.naam) return "naam";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email)) return "email";
  if (!a.domein) return "domein";
  return "";
}

export function bouwMail(a, { naar = process.env.CHECK_MAIL_NAAR || "secure@socialnow.nl", van = process.env.CHECK_MAIL_VAN || process.env.CHECK_SMTP_USER || "info@socialnow.nl", nu = new Date() } = {}) {
  const uitslag = a.uitslag ? UITSLAGEN[a.uitslag] : "geen check gedaan";
  const versie = a.phpVersie || (a.uitslag ? "afgeschermd" : "-");
  const tijd = nu.toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" });
  const regels = [
    ["Soort", a.soort === "uitgebreide-check" ? "uitgebreide check" : a.soort], ["Naam", a.naam], ["E-mail", a.email], ["Domein", a.domein], ["Uitslag", uitslag], ["PHP-versie", versie],
    ["Telefoon", a.telefoon], ["Hosting", a.hosting], ["Taal", a.taal || "-"], ["Tijdstip", tijd],
  ].filter(([, w]) => w);
  const tekst = regels.map(([k, w]) => `${k}: ${w}`).join("\n") + (a.vraag ? `\n\nVraag:\n${a.vraag}` : "") + "\n\nVia socialnow.nl/security";
  return {
    from: `SocialNow check <${van}>`,
    to: naar,
    replyTo: a.email,
    subject: `${a.soort === "uitgebreide-check" ? "Uitgebreide check" : "Check-aanvraag"}: ${a.domein} (${uitslag})`,
    text: tekst,
  };
}

let transportGemaakt = null;
async function standaardTransport() {
  if (!process.env.CHECK_SMTP_USER || !process.env.CHECK_SMTP_PASS) return null;
  if (!transportGemaakt) {
    const { default: nodemailer } = await import("nodemailer");
    const poort = Number(process.env.CHECK_SMTP_PORT || 465);
    transportGemaakt = nodemailer.createTransport({
      host: process.env.CHECK_SMTP_HOST || "smtp.hostinger.com",
      port: poort,
      secure: poort === 465,
      auth: { user: process.env.CHECK_SMTP_USER, pass: process.env.CHECK_SMTP_PASS },
      connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 10000,
    });
  }
  return transportGemaakt;
}

// Verstuurt de mail; geeft { verstuurd, poging } terug. Logt bij falen de volledige aanvraag, zodat niets verdwijnt.
export async function verstuurAanvraag(a, { transport, log = console } = {}) {
  const mail = bouwMail(a);
  const t = transport || (await standaardTransport());
  let laatsteFout = t ? "" : "geen SMTP-gegevens in env (CHECK_SMTP_USER, CHECK_SMTP_PASS)";
  for (let poging = 1; t && poging <= 2; poging++) {
    try {
      await t.sendMail(mail);
      return { verstuurd: true, poging, mail };
    } catch (e) {
      laatsteFout = String(e?.message || e).slice(0, 200);
    }
  }
  log.error(`CHECK_AANVRAAG_NIET_VERSTUURD ${JSON.stringify({ reden: laatsteFout, onderwerp: mail.subject, replyTo: mail.replyTo, tekst: mail.text })}`);
  return { verstuurd: false, poging: 0, mail, reden: laatsteFout };
}
