// Oordeel per punt van het websiterapport (22 oktober 2026). Pure functies: meting erin, punt eruit.
//
// Elk punt heeft dezelfde vorm, zodat de pagina het in elke taal kan tonen:
//   status     "goed" | "aandacht" | "slecht" | "onbekend" (onbekend = kon niet gemeten worden)
//   problemen  codes, ernstigste eerst; de pagina maakt er zinnen en adviezen van
//   reden      alleen bij "onbekend": waarom het niet lukte, in een code
//   waarde     de getallen voor de kopregel
//   bewijs     [{ k, v }]: wat we letterlijk zagen (header, getal, DNS-record)
// Drempels staan bij elke regel, met hun bron.

const lijst = (w) => (Array.isArray(w) ? w : w == null ? [] : [String(w)]);
const DAG = 24 * 3600 * 1000;
const ergste = (statussen) => (statussen.includes("slecht") ? "slecht" : statussen.includes("aandacht") ? "aandacht" : "goed");

// ---------------------------------------------------------------------------------------------
// 2. Beveiligde verbinding
// ---------------------------------------------------------------------------------------------

// meting: { https: uitkomst van haal("https://host/"), http: uitkomst van haal("http://host/"), nu }
export function beoordeelVerbinding({ https, http, nu = Date.now(), waarschuwDagen = 21 }) {
  const bewijs = [];
  const problemen = [];
  // De eerste https-hop is de host die de bezoeker intypte; daar zit het certificaat dat hij als eerste ziet.
  const eerste = https?.stappen?.[0] || (https?.ok ? https : null);
  const tls = eerste?.tls || https?.tls || null;
  const httpsWerkt = !!eerste;
  const httpWerkt = !!(http?.stappen?.length || http?.ok);
  if (!httpsWerkt && !httpWerkt) return { status: "onbekend", reden: https?.reden || http?.reden || "verbinding", problemen: [], bewijs: [] };

  const waarde = { https: httpsWerkt, tls: tls?.protocol || null, dagen: null, hsts: null, doorsturen: null, uitgever: tls?.uitgever || null };
  if (!httpsWerkt) {
    problemen.push({ code: "geen-https", status: "slecht" });
    bewijs.push({ k: "https", v: `https://${new URL(http.stappen?.[0]?.url || http.url).hostname}/ → ${https?.reden || "geen antwoord"}` });
  } else {
    bewijs.push({ k: "https", v: `${eerste.url} → ${eerste.status}` });
    if (tls?.protocol) bewijs.push({ k: "tls", v: tls.protocol });
    if (tls) {
      bewijs.push({ k: "certificaat", v: [tls.onderwerp, tls.uitgever && `uitgegeven door ${tls.uitgever}`].filter(Boolean).join(", ") || "-" });
      if (tls.geldigTot) {
        const dagen = Math.floor((Date.parse(tls.geldigTot) - nu) / DAG);
        waarde.dagen = dagen;
        bewijs.push({ k: "verloopt", v: tls.geldigTot.slice(0, 10) });
        if (dagen < 0) problemen.push({ code: "cert-verlopen", status: "slecht" });
        else if (dagen < waarschuwDagen) problemen.push({ code: "cert-bijna", status: "aandacht" });
      }
      if (!tls.geldig && !problemen.some((p) => p.code === "cert-verlopen")) {
        problemen.push({ code: "cert-ongeldig", status: "slecht" });
        bewijs.push({ k: "certificaatfout", v: tls.fout });
      }
      // TLS 1.0 en 1.1 zijn sinds 2021 afgeschreven (RFC 8996).
      if (tls.protocol && /^TLSv1(\.1)?$/.test(tls.protocol)) problemen.push({ code: "tls-oud", status: "slecht" });
    }
    // HSTS op de https-pagina waar de bezoeker eindigt (RFC 6797). max-age onder een half jaar telt als kort.
    const laatste = (https.stappen || []).filter((s) => s.url.startsWith("https:")).pop() || eerste;
    const hsts = lijst(laatste.headers?.["strict-transport-security"])[0] || null;
    const maxAge = hsts ? Number((hsts.match(/max-age\s*=\s*"?(\d+)/i) || [])[1] ?? NaN) : null;
    waarde.hsts = hsts ? (maxAge > 0 ? maxAge : 0) : null;
    bewijs.push({ k: "hsts", v: hsts ? `Strict-Transport-Security: ${hsts}` : "Strict-Transport-Security ontbreekt" });
    if (!hsts || !(maxAge > 0)) problemen.push({ code: "geen-hsts", status: "aandacht" });
    else if (maxAge < 15552000) problemen.push({ code: "hsts-kort", status: "aandacht" });
  }
  // http moet doorsturen naar https, ook via een tussenstap (http://x → http://www.x → https://www.x).
  if (httpWerkt) {
    const keten = http.stappen || [];
    const eind = http.ok ? http.url : keten[keten.length - 1]?.url;
    const naarHttps = keten.some((s, i) => i > 0 && s.url.startsWith("https:")) || String(eind || "").startsWith("https:");
    waarde.doorsturen = naarHttps;
    bewijs.push({ k: "http", v: keten.length ? keten.map((s) => `${s.url} ${s.status}`).join(" → ") : `${http.url} ${http.status}` });
    if (!naarHttps && httpsWerkt) problemen.push({ code: "geen-doorsturen", status: "aandacht" });
  } else {
    bewijs.push({ k: "http", v: `http → ${http?.reden || "geen antwoord"}` });
  }
  const volgorde = { slecht: 0, aandacht: 1 };
  problemen.sort((a, b) => volgorde[a.status] - volgorde[b.status]);
  return { status: ergste(problemen.map((p) => p.status)), problemen: problemen.map((p) => p.code), waarde, bewijs };
}

// ---------------------------------------------------------------------------------------------
// 4. Beveiligingsheaders
// ---------------------------------------------------------------------------------------------

export function beoordeelHeaders(antwoord) {
  if (!antwoord?.headers) return { status: "onbekend", reden: antwoord?.reden || "verbinding", problemen: [], bewijs: [] };
  const h = antwoord.headers;
  const een = (k) => lijst(h[k]).join(", ").trim();
  const csp = een("content-security-policy");
  const cspRapport = een("content-security-policy-report-only");
  const xfo = een("x-frame-options");
  const frameAncestors = /(^|;)\s*frame-ancestors\s/i.test(csp);
  const checks = [
    ["csp", !!csp, csp ? `Content-Security-Policy: ${csp.slice(0, 160)}${csp.length > 160 ? "…" : ""}` : cspRapport ? "Alleen Content-Security-Policy-Report-Only (blokkeert niets)" : "Content-Security-Policy ontbreekt"],
    ["frame", /^(deny|sameorigin)$/i.test(xfo) || frameAncestors, xfo ? `X-Frame-Options: ${xfo}` : frameAncestors ? "CSP frame-ancestors" : "X-Frame-Options en frame-ancestors ontbreken"],
    ["nosniff", /^nosniff$/i.test(een("x-content-type-options")), een("x-content-type-options") ? `X-Content-Type-Options: ${een("x-content-type-options")}` : "X-Content-Type-Options ontbreekt"],
    ["referrer", !!een("referrer-policy") && !/unsafe-url/i.test(een("referrer-policy")), een("referrer-policy") ? `Referrer-Policy: ${een("referrer-policy")}` : "Referrer-Policy ontbreekt"],
    ["permissions", !!(een("permissions-policy") || een("feature-policy")), een("permissions-policy") ? `Permissions-Policy: ${een("permissions-policy").slice(0, 120)}` : een("feature-policy") ? `Feature-Policy: ${een("feature-policy").slice(0, 120)}` : "Permissions-Policy ontbreekt"],
  ];
  // Versienummers in Server, X-Powered-By en de ASP.NET-headers vertellen een aanvaller welke lekken hij kan proberen.
  const lekken = [];
  for (const [k, naam] of [["server", "Server"], ["x-powered-by", "X-Powered-By"], ["x-aspnet-version", "X-AspNet-Version"], ["x-aspnetmvc-version", "X-AspNetMvc-Version"]]) {
    for (const w of lijst(h[k])) if (/\d+\.\d+/.test(w) || k.startsWith("x-aspnet")) lekken.push(`${naam}: ${w}`);
  }
  const aanwezig = checks.filter((c) => c[1]).length;
  const problemen = checks.filter((c) => !c[1]).map((c) => `mist-${c[0]}`);
  if (lekken.length) problemen.push("versie-lek");
  const status = aanwezig <= 1 ? "slecht" : aanwezig <= 3 || lekken.length ? "aandacht" : "goed";
  return {
    status, problemen,
    waarde: { aanwezig, van: checks.length, lekken: lekken.length },
    bewijs: [...checks.map((c) => ({ k: c[0], v: c[2], ok: c[1] })), ...lekken.map((l) => ({ k: "lek", v: l, ok: false })), { k: "pagina", v: antwoord.url || "" }],
  };
}

// ---------------------------------------------------------------------------------------------
// 5. E-mailbeveiliging (SPF RFC 7208, DMARC RFC 7489, MX RFC 5321, null-MX RFC 7505)
// ---------------------------------------------------------------------------------------------

// dns: { domein, txt: string[] | { fout }, dmarc: string[] | { fout }, mx: [{exchange, priority}] | { fout } }
export function beoordeelEmail(dns) {
  const fout = (x) => x && !Array.isArray(x);
  if (dns.txt?.fout === "nxdomain") return { status: "onbekend", reden: "dns", problemen: [], bewijs: [{ k: "spf", v: `${dns.domein}: domein bestaat niet (NXDOMAIN)` }] };
  if (fout(dns.txt) && fout(dns.dmarc)) return { status: "onbekend", reden: dns.txt.fout || "dns", problemen: [], bewijs: [] };
  const bewijs = [];
  const problemen = [];
  const spf = fout(dns.txt) ? null : dns.txt.filter((t) => /^v=spf1(\s|$)/i.test(t.trim()));
  const dmarc = fout(dns.dmarc) ? null : dns.dmarc.filter((t) => /^v=DMARC1\s*(;|$)/i.test(t.trim()));
  const mx = fout(dns.mx) ? null : dns.mx;
  const waarde = { spf: null, dmarc: null, mx: mx ? mx.length : null };

  if (spf === null) bewijs.push({ k: "spf", v: `TXT ${dns.domein}: ${dns.txt.fout}` });
  else if (!spf.length) { problemen.push({ code: "geen-spf", status: "slecht" }); bewijs.push({ k: "spf", v: `TXT ${dns.domein}: geen v=spf1-record`, ok: false }); waarde.spf = "geen"; }
  else {
    for (const r of spf) bewijs.push({ k: "spf", v: `TXT ${dns.domein}: ${r}`, ok: spf.length === 1 });
    const all = (spf[0].match(/(?:^|\s)([-~?+]?)all(?:\s|$)/i) || [])[1];
    const redirect = /(?:^|\s)redirect=/i.test(spf[0]);
    waarde.spf = all === undefined ? (redirect ? "redirect" : "geen-all") : `${all || "+"}all`;
    if (spf.length > 1) problemen.push({ code: "spf-dubbel", status: "aandacht" });
    if (all === "+" || all === "" || all === "?") problemen.push({ code: "spf-open", status: "slecht" });
    else if (all === undefined && !redirect) problemen.push({ code: "spf-geen-all", status: "aandacht" });
  }

  if (dmarc === null) bewijs.push({ k: "dmarc", v: `TXT _dmarc.${dns.domein}: ${dns.dmarc.fout}` });
  else if (!dmarc.length) { problemen.push({ code: "geen-dmarc", status: "slecht" }); bewijs.push({ k: "dmarc", v: `TXT _dmarc.${dns.domein}: geen v=DMARC1-record`, ok: false }); waarde.dmarc = "geen"; }
  else {
    const r = dmarc[0];
    bewijs.push({ k: "dmarc", v: `TXT _dmarc.${dns.domein}: ${r}`, ok: true });
    const tag = (n) => (r.match(new RegExp(`(?:^|;)\\s*${n}\\s*=\\s*([^;\\s]+)`, "i")) || [])[1]?.toLowerCase();
    const p = tag("p");
    const pct = tag("pct") ? Number(tag("pct")) : 100;
    waarde.dmarc = ["none", "quarantine", "reject"].includes(p) ? p : "ongeldig";
    if (dmarc.length > 1) problemen.push({ code: "dmarc-dubbel", status: "aandacht" });
    if (!["none", "quarantine", "reject"].includes(p)) problemen.push({ code: "dmarc-ongeldig", status: "slecht" });
    else if (p === "none") problemen.push({ code: "dmarc-none", status: "aandacht" });
    else if (pct < 100) problemen.push({ code: "dmarc-pct", status: "aandacht" });
    if (!tag("rua")) problemen.push({ code: "dmarc-geen-rua", status: "info" });
  }

  if (mx === null) bewijs.push({ k: "mx", v: `MX ${dns.domein}: ${dns.mx.fout}` });
  else if (!mx.length) bewijs.push({ k: "mx", v: `MX ${dns.domein}: geen`, ok: null });
  else for (const m of mx.slice(0, 5)) bewijs.push({ k: "mx", v: `MX ${dns.domein}: ${m.priority} ${m.exchange || "."}`, ok: true });
  // Null-MX (". " met voorkeur 0): dit domein ontvangt bewust geen mail.
  if (mx?.length === 1 && (!mx[0].exchange || mx[0].exchange === ".")) waarde.mx = 0;

  const volgorde = { slecht: 0, aandacht: 1, info: 2 };
  problemen.sort((a, b) => volgorde[a.status] - volgorde[b.status]);
  let status = ergste(problemen.map((p) => p.status));
  // Lukte één van de twee opzoekingen niet, dan zeggen we niet "goed" op basis van de helft.
  if (status !== "slecht" && (spf === null || dmarc === null)) return { status: "onbekend", reden: "dns-deels", problemen: problemen.map((p) => p.code), waarde, bewijs, domein: dns.domein };
  return { status, problemen: problemen.map((p) => p.code), waarde, bewijs, domein: dns.domein };
}

// ---------------------------------------------------------------------------------------------
// 1. Snelheid op mobiel
// ---------------------------------------------------------------------------------------------

// Drempels van Google (web.dev/articles/vitals): goed tot, slecht vanaf.
export const DREMPELS = { lcpMs: [2500, 4000], inpMs: [200, 500], cls: [0.1, 0.25], tbtMs: [200, 600], ttfbMs: [800, 1800], bytes: [1.6e6, 4e6] };
const meetStatus = (k, w) => (w == null ? null : w <= DREMPELS[k][0] ? "goed" : w <= DREMPELS[k][1] ? "aandacht" : "slecht");

// PageSpeed Insights v5 (Lighthouse 12). Score: 90 en hoger goed, 50 tot 89 aandacht, lager slecht (Lighthouse-schaal).
export function beoordeelPageSpeed(psi) {
  const lh = psi?.lighthouseResult;
  const score = lh?.categories?.performance?.score;
  if (typeof score !== "number") return null;
  const a = (id) => lh.audits?.[id]?.numericValue;
  const veld = psi.loadingExperience?.metrics || {};
  const inpVeld = veld.INTERACTION_TO_NEXT_PAINT?.percentile;
  const w = {
    bron: "pagespeed",
    score: Math.round(score * 100),
    lcpMs: a("largest-contentful-paint") != null ? Math.round(a("largest-contentful-paint")) : null,
    inpMs: typeof inpVeld === "number" ? inpVeld : null,
    tbtMs: a("total-blocking-time") != null ? Math.round(a("total-blocking-time")) : null,
    cls: a("cumulative-layout-shift") != null ? Math.round(a("cumulative-layout-shift") * 1000) / 1000 : null,
    ttfbMs: a("server-response-time") != null ? Math.round(a("server-response-time")) : null,
    bytes: a("total-byte-weight") != null ? Math.round(a("total-byte-weight")) : null,
    lighthouse: lh.lighthouseVersion || null,
    getest: lh.fetchTime || null,
    url: lh.finalDisplayedUrl || lh.finalUrl || psi.id || null,
  };
  const status = w.score >= 90 ? "goed" : w.score >= 50 ? "aandacht" : "slecht";
  const problemen = [];
  for (const k of ["lcpMs", w.inpMs != null ? "inpMs" : "tbtMs", "cls", "ttfbMs", "bytes"]) {
    const s = meetStatus(k, w[k]);
    if (s === "slecht" || s === "aandacht") problemen.push({ code: `${k}-${s === "slecht" ? "slecht" : "matig"}`, s });
  }
  problemen.sort((x, y) => (x.s === "slecht" ? 0 : 1) - (y.s === "slecht" ? 0 : 1));
  const bewijs = [
    { k: "score", v: `${w.score} / 100` },
    { k: "lcp", v: w.lcpMs != null ? `${(w.lcpMs / 1000).toFixed(1)} s` : "-", s: meetStatus("lcpMs", w.lcpMs) },
    w.inpMs != null ? { k: "inp", v: `${w.inpMs} ms`, s: meetStatus("inpMs", w.inpMs) } : { k: "tbt", v: w.tbtMs != null ? `${w.tbtMs} ms` : "-", s: meetStatus("tbtMs", w.tbtMs) },
    { k: "cls", v: w.cls != null ? String(w.cls) : "-", s: meetStatus("cls", w.cls) },
    { k: "ttfb", v: w.ttfbMs != null ? `${w.ttfbMs} ms` : "-", s: meetStatus("ttfbMs", w.ttfbMs) },
    { k: "gewicht", v: w.bytes != null ? `${(w.bytes / 1e6).toFixed(1)} MB` : "-", s: meetStatus("bytes", w.bytes) },
    { k: "bron", v: `Google PageSpeed Insights, mobiel, Lighthouse ${w.lighthouse || "?"}${w.getest ? `, ${w.getest.slice(0, 16).replace("T", " ")} UTC` : ""}` },
  ];
  return { status, problemen: problemen.map((p) => p.code), waarde: w, bewijs };
}

// Terugval zonder PageSpeed: wat wij zelf meten bij één GET van de homepage. Status op de tijd tot de eerste byte.
export function beoordeelEigenSnelheid(antwoord, { psiReden = null, regio = null } = {}) {
  if (!antwoord?.ok) return { status: "onbekend", reden: psiReden || antwoord?.reden || "verbinding", problemen: [], bewijs: [] };
  const w = { bron: "eigen", ttfbMs: antwoord.ttfbMs, htmlBytes: antwoord.lijnBytes, gecomprimeerd: !!antwoord.codering, psiReden };
  const problemen = [];
  const s = meetStatus("ttfbMs", w.ttfbMs);
  if (s !== "goed") problemen.push(`ttfbMs-${s === "slecht" ? "slecht" : "matig"}`);
  if (!w.gecomprimeerd && w.htmlBytes > 20000) problemen.push("geen-compressie");
  return {
    status: s,
    problemen,
    waarde: w,
    bewijs: [
      { k: "ttfb", v: `${w.ttfbMs} ms`, s },
      { k: "html", v: `${Math.round(w.htmlBytes / 1024)} KB${w.gecomprimeerd ? ` (${antwoord.codering})` : ""}` },
      { k: "bron", v: `Eigen meting vanaf ${regio || "onze server"}, ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC` },
      { k: "pagespeed", v: psiReden || "-" },
    ],
  };
}
