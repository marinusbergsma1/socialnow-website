// Boekingspagina van SocialNow. Geen tracking, geen externe scripts.
// Andere pagina's linken hierheen met ?type=security, ?type=intro of ?type=uitgebreide-check&domein=voorbeeld.nl
// (optioneel ?lang=nl, ?email=, ?naam=, ?vraag=).
import { groepeerPerDag, tijdIn, dagLabel, eigenZone, geldigeZone } from "./tijdzone.mjs";
import { veldenVoor, schoonDomein } from "./velden.mjs";

const T = {
  en: {
    titel: "Book a call", intro: "Pick a moment that suits you. You get a Google Meet invite straight away.",
    kies: "What would you like to talk about?", kiesSub: "Choose the call that fits.",
    min: "min", moment: "Choose a moment", momentSub: "All times are shown in your time zone.",
    tot: "to", zone: "Time zone", terug: "Back", wissel: "Change",
    geen: "There are no free moments in the coming weeks. Mail info@socialnow.nl and we will find one.",
    gegevens: "Your details", naam: "Name", email: "Email", vraag: "Short question (optional)", domein: "Website", domeinFout: "Enter a valid website, for example yourcompany.com.",
    boek: "Book call", bezig: "Booking...",
    akkoord: "We only use your details to plan and hold this call. No tracking.", privacy: "Privacy",
    klaar: "You're booked", klaarSub: (e) => `The invite with the Google Meet link is on its way to ${e}.`,
    meet: "Open Google Meet", beheerUitleg: "Need another moment? Use the link in the invite to reschedule or cancel.",
    bezet: "Someone just took this moment. Pick another one.",
    tijdFout: "This moment is no longer available. Pick another one.",
    invoer: "Check your name and email address.", limiet: "Too many attempts. Try again in a few minutes.",
    agenda: "We could not reach the calendar. Try again in a minute.",
    nietIngesteld: "Online booking is not live yet. Mail us and we will plan a call with you.",
    mail: "Mail info@socialnow.nl", noodroute: "Open the booking calendar",
    jouwCall: "Your call", verzet: "Reschedule", annuleer: "Cancel call", annuleerVraag: "Cancel this call?",
    annuleerJa: "Yes, cancel", nee: "Keep it", geannuleerd: "Your call is cancelled", geannuleerdSub: "Everyone got a cancellation. You can book a new moment any time.",
    nieuw: "Book a new moment", verzetNaar: "Move your call to", bevestig: "Confirm new time",
    verzetKlaar: "Your call is moved", verzetKlaarSub: "Everyone got the updated invite.",
    onbekend: "We could not find this booking. It may have been cancelled or moved.",
    voorbij: "This call has already taken place.",
    demo: "Preview mode: nothing is put in a real calendar and no invites are sent.",
    alleenKijken: "Online booking is not live yet. Pick a moment and request it through our contact form.",
    kiesDag: "Choose a day", kiesTijd: "Choose a time",
    aanvraagKop: "Request this moment", aanvraagUitleg: "Online booking goes live soon. Send this moment through our contact form and we will confirm it by email.",
    aanvraag: "Request via the form", aanvraagOnderwerp: "Call request",
    voet: "No tracking. We only use your details for this call.",
  },
  nl: {
    titel: "Plan een call", intro: "Kies een moment dat jou past. Je krijgt meteen een uitnodiging met Google Meet.",
    kies: "Waar wil je het over hebben?", kiesSub: "Kies de call die past.",
    min: "min", moment: "Kies een moment", momentSub: "Alle tijden staan in jouw tijdzone.",
    tot: "tot", zone: "Tijdzone", terug: "Terug", wissel: "Wijzig",
    geen: "Er zijn de komende weken geen vrije momenten. Mail info@socialnow.nl en we zoeken er een.",
    gegevens: "Je gegevens", naam: "Naam", email: "E-mail", vraag: "Korte vraag (mag leeg)", domein: "Website", domeinFout: "Vul een geldige website in, bijvoorbeeld jouwbedrijf.nl.",
    boek: "Call inplannen", bezig: "Bezig met inplannen...",
    akkoord: "We gebruiken je gegevens alleen om deze call te plannen en te houden. Geen tracking.", privacy: "Privacy",
    klaar: "Je call staat gepland", klaarSub: (e) => `De uitnodiging met de Google Meet-link is onderweg naar ${e}.`,
    meet: "Open Google Meet", beheerUitleg: "Toch een ander moment? Via de link in de uitnodiging kun je verzetten of annuleren.",
    bezet: "Iemand was je net voor. Kies een ander moment.",
    tijdFout: "Dit moment is niet meer beschikbaar. Kies een ander moment.",
    invoer: "Controleer je naam en e-mailadres.", limiet: "Te veel pogingen. Probeer het over een paar minuten opnieuw.",
    agenda: "We konden de agenda niet bereiken. Probeer het over een minuut opnieuw.",
    nietIngesteld: "Online plannen staat nog niet live. Mail ons en we plannen samen een call.",
    mail: "Mail info@socialnow.nl", noodroute: "Open de afsprakenagenda",
    jouwCall: "Je call", verzet: "Verzetten", annuleer: "Call annuleren", annuleerVraag: "Deze call annuleren?",
    annuleerJa: "Ja, annuleren", nee: "Laat staan", geannuleerd: "Je call is geannuleerd", geannuleerdSub: "Iedereen heeft een afmelding gekregen. Je kunt altijd een nieuw moment kiezen.",
    nieuw: "Nieuw moment kiezen", verzetNaar: "Verzet je call naar", bevestig: "Nieuwe tijd bevestigen",
    verzetKlaar: "Je call is verzet", verzetKlaarSub: "Iedereen heeft de bijgewerkte uitnodiging gekregen.",
    onbekend: "We vinden deze afspraak niet. Misschien is hij al geannuleerd of verzet.",
    voorbij: "Deze call is al geweest.",
    demo: "Voorbeeldmodus: er komt niets in een echte agenda en er gaan geen uitnodigingen uit.",
    alleenKijken: "Online boeken staat nog niet live. Kies een moment en vraag het aan via ons contactformulier.",
    kiesDag: "Kies een dag", kiesTijd: "Kies een tijd",
    aanvraagKop: "Vraag dit moment aan", aanvraagUitleg: "Online boeken gaat binnenkort live. Stuur dit moment via ons contactformulier, dan bevestigen we het per mail.",
    aanvraag: "Aanvragen via het formulier", aanvraagOnderwerp: "Call aanvragen",
    voet: "Geen tracking. We gebruiken je gegevens alleen voor deze call.",
  },
};

const param = new URLSearchParams(location.search);
const opslag = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const kortTekst = (w, max) => String(w || "").slice(0, max);

const staat = {
  taal: ["nl", "en"].includes(param.get("lang")) ? param.get("lang") : (navigator.language || "").toLowerCase().startsWith("nl") ? "nl" : "en",
  zone: [param.get("tz"), opslag.get("boeken-zone"), eigenZone()].find((z) => z && geldigeZone(z)),
  info: null,
  soort: null,
  slots: [],
  dag: null,
  slot: null,
  beheer: param.get("beheer"),
  afspraak: null,
  vooraf: { naam: kortTekst(param.get("naam"), 100), email: kortTekst(param.get("email"), 200), vraag: kortTekst(param.get("vraag"), 1000), domein: schoonDomein(param.get("domein")) },
};

const $ = (s) => document.querySelector(s);
const paneel = $("#paneel");
const t = (k) => T[staat.taal][k];
const PIJL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const TERUG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
const VINK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

function esc(w) {
  return String(w ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
const knop = (tekst, { wit = false, id = "", type = "button" } = {}) =>
  `<button class="knop${wit ? " wit" : ""}" type="${type}"${id ? ` id="${id}"` : ""}><span>${esc(tekst)}</span><i>${PIJL}</i></button>`;
const linkKnop = (tekst, href, wit = false) =>
  `<a class="knop${wit ? " wit" : ""}" href="${esc(href)}" target="_blank" rel="noopener"><span>${esc(tekst)}</span><i>${PIJL}</i></a>`;
const soortVan = (id) => staat.info?.soorten.find((s) => s.id === id);
const soortTitel = (s) => s?.titel?.[staat.taal] || "";

function momentTekst(startIso, eindIso) {
  const datum = new Intl.DateTimeFormat(staat.taal === "nl" ? "nl-NL" : "en-GB", { timeZone: staat.zone, weekday: "long", day: "numeric", month: "long" }).format(new Date(startIso));
  return `${datum}, ${tijdIn(startIso, staat.zone)} ${t("tot")} ${tijdIn(eindIso, staat.zone)}`;
}

async function api(pad, opties = {}) {
  try {
    const r = await fetch(pad, { ...opties, headers: { "content-type": "application/json", ...(opties.headers || {}) } });
    const j = await r.json().catch(() => ({}));
    return { status: r.status, ...j };
  } catch {
    return { status: 0, ok: false, reden: "agenda" };
  }
}

function foutTekst(reden) {
  return { bezet: t("bezet"), tijd: t("tijdFout"), invoer: t("invoer"), limiet: t("limiet"), onbekend: t("onbekend"), voorbij: t("voorbij"), "niet-ingesteld": t("nietIngesteld") }[reden] || t("agenda");
}

// ---------- vaste delen ----------

function zetVast() {
  document.documentElement.lang = staat.taal;
  document.title = `${t("titel")} | SocialNow`;
  for (const b of document.querySelectorAll(".taal button")) b.setAttribute("aria-pressed", String(b.dataset.taal === staat.taal));
  const s = soortVan(staat.soort);
  $("#titel").textContent = staat.beheer ? t("jouwCall") : s ? soortTitel(s) : t("titel");
  $("#intro").textContent = s?.uitleg?.[staat.taal] || t("intro");
  $("#feiten").hidden = !s;
  if (s) $("#feit-duur").textContent = `${s.minuten} ${t("min")}`;
  $("#feit-zone").textContent = staat.zone.replace(/_/g, " ");
  $("#demo").hidden = !staat.info?.demo;
  $("#demo").textContent = staat.info?.alleenKijken ? t("alleenKijken") : t("demo");
  $("#voet").textContent = t("voet");
  $("#privacy").textContent = t("privacy");
  }

function laden() {
  paneel.innerHTML = '<div class="laden" aria-hidden="true"><span></span><span></span><span></span></div>';
}

function toon(html, na) {
  paneel.innerHTML = `<div class="stap">${html}</div>`;
  zetVast();
  na?.();
  const focus = paneel.querySelector("h2");
  if (focus) { focus.tabIndex = -1; focus.focus({ preventScroll: true }); }
}

// ---------- stap 1: soort ----------

function toonSoorten() {
  staat.soort = null;
  toon(`
    <h2>${esc(t("kies"))}</h2><p class="sub">${esc(t("kiesSub"))}</p>
    <div class="soorten">${staat.info.soorten.map((s) => `
      <button class="soort" type="button" data-soort="${esc(s.id)}">
        <strong>${esc(soortTitel(s))}</strong><span class="duur">${s.minuten} ${esc(t("min"))}</span>
        <p>${esc(s.uitleg?.[staat.taal] || "")}</p>
      </button>`).join("")}
    </div>`, () => {
    for (const b of paneel.querySelectorAll("[data-soort]")) b.onclick = () => kiesSoort(b.dataset.soort);
  });
}

async function kiesSoort(id, modus = "boek") {
  staat.soort = id;
  staat.slot = null;
  zetVast();
  laden();
  const j = await api(`/api/slots?type=${encodeURIComponent(id)}`);
  if (j.status === 503 || !j.ok) return toonNiet(j.reden);
  staat.slots = j.slots || [];
  staat.opgehaald = Date.now();
  const dagen = groepeerPerDag(staat.slots, staat.zone);
  if (!dagen.some((d) => d.datum === staat.dag)) staat.dag = null;
  toonMoment(modus);
}

// ---------- stap 2: moment ----------

function zoneKeuze() {
  let zones = [];
  try { zones = Intl.supportedValuesOf("timeZone"); } catch { zones = [staat.zone, "Europe/Amsterdam", "Europe/London", "America/New_York", "Asia/Dubai"]; }
  if (!zones.includes(staat.zone)) zones.unshift(staat.zone);
  return `<label class="zone">${esc(t("zone"))}
    <select id="zone">${zones.map((z) => `<option value="${esc(z)}"${z === staat.zone ? " selected" : ""}>${esc(z.replace(/_/g, " "))}</option>`).join("")}</select></label>`;
}

function toonMoment(modus = "boek") {
  staat.modus = modus;
  const dagen = groepeerPerDag(staat.slots, staat.zone);
  // Eerst een dag, dan een tijdblok. Alleen dagen met nog iets vrij staan erin.
  const dag = dagen.find((d) => d.datum === staat.dag) || null;
  const terug = modus === "verzet" ? "" : `<button class="terug" type="button" id="terug">${TERUG}${esc(t("terug"))}</button>`;
  const kop = modus === "verzet" ? t("verzetNaar") : t("moment");
  if (!dagen.length) {
    return toon(`${terug}<h2>${esc(kop)}</h2><p class="leeg">${esc(t("geen"))}</p><div class="knoppen">${linkKnop(t("mail"), "mailto:info@socialnow.nl")}</div>`, () => {
      $("#terug") && ($("#terug").onclick = toonSoorten);
    });
  }
  toon(`
    ${terug}
    <h2>${esc(kop)}</h2><p class="sub">${esc(t("momentSub"))}</p>
    ${zoneKeuze()}
    <p class="daglabel">${esc(dag ? dagLabel(dag.datum, staat.taal, { weekday: "long", day: "numeric", month: "long" }) : t("kiesDag"))}</p>
    <div class="dagen" role="group" aria-label="${esc(t("kiesDag"))}">${dagen.map((d) => {
      const [, , dd] = d.datum.split("-");
      return `<button class="dag" type="button" data-dag="${d.datum}" aria-pressed="${d.datum === dag?.datum}">
        <small>${esc(dagLabel(d.datum, staat.taal, { weekday: "short" }).replace(".", ""))}</small><strong>${+dd}</strong><span>${esc(dagLabel(d.datum, staat.taal, { month: "short" }).replace(".", ""))}</span></button>`;
    }).join("")}</div>
    ${dag ? `<p class="daglabel">${esc(t("kiesTijd"))}</p><div class="tijden">${dag.tijden.map((s) => `<button class="tijd" type="button" data-slot="${s.iso}" aria-pressed="${s.iso === staat.slot}">${s.tijd}</button>`).join("")}</div>` : ""}`, () => {
    $("#terug") && ($("#terug").onclick = toonSoorten);
    $("#zone").onchange = (e) => { staat.zone = e.target.value; opslag.set("boeken-zone", staat.zone); staat.dag = null; toonMoment(modus); };
    for (const b of paneel.querySelectorAll("[data-dag]")) b.onclick = () => { staat.dag = b.dataset.dag; toonMoment(modus); };
    for (const b of paneel.querySelectorAll("[data-slot]")) b.onclick = () => { staat.slot = b.dataset.slot; modus === "verzet" ? toonVerzetBevestig() : toonGegevens(); };
    paneel.querySelector('.dag[aria-pressed="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
}

// ---------- stap 3: gegevens ----------

function eindVan(startIso) {
  return new Date(Date.parse(startIso) + soortVan(staat.soort).minuten * 60000).toISOString();
}

// Productie zonder Google-sleutels: niet echt boeken, maar het gekozen moment via het contactformulier aanvragen.
function toonAanvraag() {
  const s = soortVan(staat.soort);
  const moment = momentTekst(staat.slot, eindVan(staat.slot));
  const domein = staat.vooraf.domein ? `, ${staat.vooraf.domein}` : "";
  const onderwerp = `${t("aanvraagOnderwerp")}: ${soortTitel(s)}, ${moment} (${staat.zone})${domein}`;
  const href = `https://socialnow.nl${staat.taal === "nl" ? "/nl" : ""}/contact?onderwerp=${encodeURIComponent(onderwerp)}`;
  toon(`
    <button class="terug" type="button" id="terug">${TERUG}${esc(t("terug"))}</button>
    <h2>${esc(t("aanvraagKop"))}</h2>
    <div class="samenvatting"><strong>${esc(soortTitel(s))}, ${s.minuten} ${esc(t("min"))}</strong><span>${esc(moment)}</span><span>${esc(staat.zone.replace(/_/g, " "))}</span>${staat.vooraf.domein ? `<span>${esc(t("domein"))}: ${esc(staat.vooraf.domein)}</span>` : ""}</div>
    <p class="sub">${esc(t("aanvraagUitleg"))}</p>
    <div class="knoppen"><a class="knop" href="${esc(href)}"><span>${esc(t("aanvraag"))}</span><i>${PIJL}</i></a></div>`, () => {
    $("#terug").onclick = () => toonMoment();
  });
}

function toonGegevens(melding = "") {
  if (staat.info?.alleenKijken) return toonAanvraag();
  const s = soortVan(staat.soort);
  const v = staat.vooraf;
  const velden = veldenVoor(s);
  toon(`
    <button class="terug" type="button" id="terug">${TERUG}${esc(t("terug"))}</button>
    <h2>${esc(t("gegevens"))}</h2>
    <div class="samenvatting"><strong>${esc(soortTitel(s))}, ${s.minuten} ${esc(t("min"))}</strong><span>${esc(momentTekst(staat.slot, eindVan(staat.slot)))}</span><span>${esc(staat.zone.replace(/_/g, " "))}</span></div>
    <form id="form" novalidate>
      <label>${esc(t("naam"))}<input name="naam" autocomplete="name" required maxlength="100" value="${esc(v.naam)}"></label>
      <label>${esc(t("email"))}<input name="email" type="email" autocomplete="email" inputmode="email" required maxlength="200" value="${esc(v.email)}"></label>
      ${velden.includes("domein") ? `<label>${esc(t("domein"))}<input name="domein" inputmode="url" autocomplete="url" autocapitalize="none" spellcheck="false" required maxlength="253" placeholder="voorbeeld.nl" value="${esc(v.domein)}"></label>` : ""}
      ${velden.includes("vraag") ? `<label>${esc(t("vraag"))}<textarea name="vraag" maxlength="1000" placeholder="${esc(s.vraag?.[staat.taal] || "")}">${esc(v.vraag)}</textarea></label>` : ""}
      <div class="honing" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
      <p class="melding" id="melding" role="alert">${esc(melding)}</p>
      <div class="knoppen">${knop(t("boek"), { type: "submit", id: "verstuur" })}</div>
      <p class="klein">${esc(t("akkoord"))} <a href="https://socialnow.nl/privacy">${esc(t("privacy"))}</a></p>
    </form>`, () => {
    $("#terug").onclick = () => toonMoment();
    $("#form").onsubmit = verstuur;
    if (!v.naam) paneel.querySelector('input[name="naam"]').focus({ preventScroll: true });
  });
}

async function verstuur(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const velden = veldenVoor(soortVan(staat.soort));
  staat.vooraf = {
    naam: String(f.get("naam") || "").trim(),
    email: String(f.get("email") || "").trim(),
    vraag: velden.includes("vraag") ? String(f.get("vraag") || "").trim() : staat.vooraf.vraag,
    domein: velden.includes("domein") ? schoonDomein(f.get("domein")) : staat.vooraf.domein,
  };
  if (!staat.vooraf.naam || !/^\S+@\S+\.\S{2,}$/.test(staat.vooraf.email)) return ($("#melding").textContent = t("invoer"));
  if (velden.includes("domein") && !staat.vooraf.domein) return ($("#melding").textContent = t("domeinFout"));
  const verstuurKnop = $("#verstuur");
  verstuurKnop.disabled = true;
  verstuurKnop.querySelector("span").textContent = t("bezig");
  const j = await api("/api/boek", {
    method: "POST",
    body: JSON.stringify({
      type: staat.soort, start: staat.slot, naam: staat.vooraf.naam, email: staat.vooraf.email,
      ...(velden.includes("vraag") ? { vraag: staat.vooraf.vraag } : {}),
      ...(velden.includes("domein") ? { domein: staat.vooraf.domein } : {}),
      taal: staat.taal, website: f.get("website") || "",
    }),
  });
  if (j.ok) return toonKlaar(j);
  if (j.reden === "bezet" || j.reden === "tijd") {
    await kiesSoort(staat.soort);
    const m = document.createElement("p");
    m.className = "melding";
    m.setAttribute("role", "alert");
    m.textContent = foutTekst(j.reden);
    paneel.querySelector(".stap")?.prepend(m);
    return;
  }
  if (j.reden === "niet-ingesteld") return toonNiet(j.reden);
  toonGegevens(foutTekst(j.reden));
}

// ---------- stap 4: klaar ----------

function toonKlaar(j) {
  const s = soortVan(staat.soort);
  toon(`
    <div class="vinkje">${VINK}</div>
    <h2>${esc(t("klaar"))}</h2>
    <p class="sub">${esc(t("klaarSub")(staat.vooraf.email))}</p>
    <div class="samenvatting"><strong>${esc(soortTitel(s))}, ${s.minuten} ${esc(t("min"))}</strong><span>${esc(momentTekst(j.start, j.eind))}</span><span>${esc(staat.zone.replace(/_/g, " "))}</span>${j.domein ? `<span>${esc(t("domein"))}: ${esc(j.domein)}</span>` : ""}</div>
    ${j.meet ? `<div class="knoppen">${linkKnop(t("meet"), j.meet)}</div>` : ""}
    <p class="klein ruimte">${esc(t("beheerUitleg"))}</p>`);
}

// ---------- niet ingesteld ----------

function toonNiet(reden) {
  const nood = staat.info?.noodroute;
  toon(`
    <h2>${esc(staat.soort ? t("moment") : t("kies"))}</h2>
    <p class="leeg">${esc(foutTekst(reden))}</p>
    <div class="knoppen">${nood ? linkKnop(t("noodroute"), nood) : ""}${linkKnop(t("mail"), "mailto:info@socialnow.nl", Boolean(nood))}</div>`);
}

// ---------- beheer: verzetten en annuleren ----------

async function toonBeheer() {
  laden();
  const j = await api(`/api/afspraak?t=${encodeURIComponent(staat.beheer)}`);
  if (!j.ok) {
    return toon(`<h2>${esc(t("jouwCall"))}</h2><p class="leeg">${esc(foutTekst(j.reden))}</p><div class="knoppen">${knop(t("nieuw"), { id: "nieuw" })}</div>`, () => {
      $("#nieuw").onclick = nieuweBoeking;
    });
  }
  staat.afspraak = j;
  staat.soort = j.soort;
  const s = soortVan(j.soort);
  toon(`
    <h2>${esc(t("jouwCall"))}</h2>
    <div class="samenvatting"><strong>${esc(soortTitel(s))}, ${s?.minuten || ""} ${esc(t("min"))}</strong><span>${esc(momentTekst(j.start, j.eind))}</span><span>${esc(staat.zone.replace(/_/g, " "))}</span></div>
    <p class="melding" id="melding" role="alert"></p>
    <div class="knoppen" id="acties">${knop(t("verzet"), { id: "verzet" })}${knop(t("annuleer"), { id: "annuleer", wit: true })}</div>`, () => {
    $("#verzet").onclick = () => kiesSoort(j.soort, "verzet");
    $("#annuleer").onclick = () => {
      $("#acties").innerHTML = `<p class="daglabel vraagregel">${esc(t("annuleerVraag"))}</p>${knop(t("annuleerJa"), { id: "ja" })}${knop(t("nee"), { id: "nee", wit: true })}`;
      $("#nee").onclick = toonBeheer;
      $("#ja").onclick = annuleer;
    };
  });
}

async function annuleer() {
  $("#ja").disabled = true;
  const j = await api("/api/afspraak", { method: "POST", body: JSON.stringify({ t: staat.beheer, actie: "annuleer" }) });
  if (!j.ok) return ($("#melding").textContent = foutTekst(j.reden));
  toon(`<div class="vinkje">${VINK}</div><h2>${esc(t("geannuleerd"))}</h2><p class="sub">${esc(t("geannuleerdSub"))}</p><div class="knoppen">${knop(t("nieuw"), { id: "nieuw" })}</div>`, () => {
    $("#nieuw").onclick = nieuweBoeking;
  });
}

function toonVerzetBevestig(melding = "") {
  const s = soortVan(staat.soort);
  toon(`
    <button class="terug" type="button" id="terug">${TERUG}${esc(t("terug"))}</button>
    <h2>${esc(t("verzetNaar"))}</h2>
    <div class="samenvatting"><strong>${esc(soortTitel(s))}, ${s.minuten} ${esc(t("min"))}</strong><span>${esc(momentTekst(staat.slot, eindVan(staat.slot)))}</span><span>${esc(staat.zone.replace(/_/g, " "))}</span></div>
    <p class="melding" id="melding" role="alert">${esc(melding)}</p>
    <div class="knoppen">${knop(t("bevestig"), { id: "bevestig" })}</div>`, () => {
    $("#terug").onclick = () => toonMoment("verzet");
    $("#bevestig").onclick = async () => {
      $("#bevestig").disabled = true;
      const j = await api("/api/afspraak", { method: "POST", body: JSON.stringify({ t: staat.beheer, actie: "verzet", start: staat.slot }) });
      if (j.ok) {
        return toon(`<div class="vinkje">${VINK}</div><h2>${esc(t("verzetKlaar"))}</h2><p class="sub">${esc(t("verzetKlaarSub"))}</p>
          <div class="samenvatting"><strong>${esc(soortTitel(s))}, ${s.minuten} ${esc(t("min"))}</strong><span>${esc(momentTekst(j.start, j.eind))}</span></div>`);
      }
      if (j.reden === "bezet" || j.reden === "tijd") return kiesSoort(staat.soort, "verzet");
      toonVerzetBevestig(foutTekst(j.reden));
    };
  });
}

function nieuweBoeking() {
  staat.beheer = null;
  history.replaceState(null, "", `/?lang=${staat.taal}`);
  toonSoorten();
}

// ---------- altijd actueel ----------

// Staat iemand langer dan een minuut op de tijdenkeuze, dan halen we de vrije tijden stil opnieuw op.
async function ververs() {
  if (!staat.soort || !paneel.querySelector(".dagen") || Date.now() - (staat.opgehaald || 0) < 60_000) return;
  const j = await api(`/api/slots?type=${encodeURIComponent(staat.soort)}`);
  if (!j.ok || !paneel.querySelector(".dagen")) return;
  staat.slots = j.slots || [];
  staat.opgehaald = Date.now();
  if (staat.slot && !staat.slots.includes(staat.slot)) staat.slot = null;
  const dagen = groepeerPerDag(staat.slots, staat.zone);
  if (!dagen.some((d) => d.datum === staat.dag)) staat.dag = null;
  toonMoment(staat.modus);
}
setInterval(ververs, 15_000);
document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && ververs());

// ---------- start ----------

function herteken() {
  zetVast();
  const stap = paneel.querySelector(".stap");
  if (!staat.info || !stap) return;
  if (staat.beheer) return toonBeheer();
  if (!staat.soort) return toonSoorten();
  if (paneel.querySelector("#form")) return toonGegevens();
  if (paneel.querySelector(".vinkje")) return;
  toonMoment(staat.modus);
}

for (const b of document.querySelectorAll(".taal button")) {
  b.onclick = () => { staat.taal = b.dataset.taal; herteken(); };
}

(async function start() {
  zetVast();
  const j = await api("/api/slots");
  if (!j.soorten) return toonNiet("agenda");
  staat.info = j;
  zetVast();
  if (staat.beheer) return toonBeheer();
  const gevraagd = param.get("type") || location.pathname.replace(/^\/+|\/+$/g, "");
  if (gevraagd && soortVan(gevraagd)) return kiesSoort(gevraagd);
  toonSoorten();
})();
