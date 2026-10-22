// Ophalen voor het websiterapport op /check (22 oktober 2026, Marinus): "elke bevinding komt uit een meting met bewijs".
//
// Zelfde grenzen als de php2shell-check (server/php-check.mjs), plus wat het rapport extra nodig heeft:
//   - alleen GET, geen POST, geen formulieren, geen gokpaden;
//   - eigen user agent: "SocialNowCheck/1.0 (+https://socialnow.nl/check)";
//   - alleen publieke adressen op poort 80 en 443, opnieuw gecontroleerd bij elke redirect, en we verbinden met precies
//     het adres dat we controleerden (geen DNS-rebinding naar binnen);
//   - per verzoek een harde klok en een maximum aan bytes;
//   - we bewaren per hop de status, de headers, de tijd tot de eerste byte en, bij https, het certificaat en de TLS-versie.

import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import zlib from "node:zlib";
import { isPubliekAdres, testbankModus } from "../php-check.mjs";

export const USER_AGENT = "SocialNowCheck/1.0 (+https://socialnow.nl/check)";
export const MAX_REDIRECTS = 5;

// Namen die nooit op internet bestaan.
const GERESERVEERD = /(^|\.)(localhost|local|internal|intranet|lan|home|corp|test|invalid|example|onion|arpa)$/;

// Alleen in de testbank (lokaal, nooit op Vercel) draaien de nagebootste sites op andere poorten, zodat ze niet botsen
// met de php2shell-testbank op 80 en 443. Productie kent alleen 80 en 443.
export function poorten() {
  if (!testbankModus()) return { http: 80, https: 443 };
  return { http: Number(process.env.CHECK_RAPPORT_HTTP_POORT || 80), https: Number(process.env.CHECK_RAPPORT_HTTPS_POORT || 443) };
}
// URL laat de standaardpoort weg ("https://x:443/" heeft port ""). Een andere poort mag alleen als het de
// testbankpoort is; in productie dus nooit.
function toegestanePoort(url) {
  if (!url.port) return true;
  const p = poorten();
  return Number(url.port) === (url.protocol === "https:" ? p.https : p.http);
}
function poortVoor(url) {
  const p = poorten();
  if (url.port) return Number(url.port);
  return url.protocol === "https:" ? p.https : p.http;
}

export async function zoekAdres(host) {
  if (testbankModus() && host.endsWith(".testbank.localhost")) return { ok: true, adres: "127.0.0.1", familie: 4 };
  if (net.isIP(host.replace(/^\[|\]$/g, ""))) return { ok: false, reden: "intern" };
  if (GERESERVEERD.test(host)) return { ok: false, reden: "dns" };
  let adressen;
  try { adressen = await dns.lookup(host, { all: true, verbatim: true }); } catch { return { ok: false, reden: "dns" }; }
  if (!adressen.length) return { ok: false, reden: "dns" };
  if (adressen.some((a) => !isPubliekAdres(a.address))) return { ok: false, reden: "intern" };
  const keuze = adressen.find((a) => a.family === 4) || adressen[0];
  return { ok: true, adres: keuze.address, familie: keuze.family };
}

function tlsInfo(socket) {
  try {
    const cert = socket.getPeerCertificate?.() || {};
    return {
      protocol: socket.getProtocol?.() || null,
      geldig: !!socket.authorized,
      fout: socket.authorized ? null : String(socket.authorizationError || "onbekend"),
      onderwerp: cert.subject?.CN || null,
      uitgever: cert.issuer?.O || cert.issuer?.CN || null,
      geldigVanaf: cert.valid_from ? new Date(cert.valid_from).toISOString() : null,
      geldigTot: cert.valid_to ? new Date(cert.valid_to).toISOString() : null,
      namen: String(cert.subjectaltname || "").split(/,\s*/).filter(Boolean).slice(0, 20),
    };
  } catch {
    return null;
  }
}

// Eén GET. Leest de body tot maxBody (na uitpakken) en telt de bytes die over de lijn kwamen.
export function eenVerzoek(url, { adres, familie, restMs, maxBody = 512 * 1024, accept = "text/html,application/xhtml+xml,*/*;q=0.5", oudeTls = false }) {
  return new Promise((resolve) => {
    let klaar = false;
    const start = Date.now();
    let eersteByte = null;
    let tls = null;
    const einde = (w) => { if (!klaar) { klaar = true; clearTimeout(wekker); resolve(w); } };
    const isHttps = url.protocol === "https:";
    const mod = isHttps ? https : http;
    let req;
    try {
      req = mod.request({
        method: "GET",
        hostname: url.hostname,
        port: poortVoor(url),
        path: `${url.pathname}${url.search}`,
        servername: net.isIP(url.hostname) ? undefined : url.hostname,
        headers: { "User-Agent": USER_AGENT, Accept: accept, "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "nl,en;q=0.8", Connection: "close" },
        lookup: (_h, opts, cb) => (opts && opts.all ? cb(null, [{ address: adres, family: familie }]) : cb(null, adres, familie)),
        // We lezen alleen. Een ongeldig certificaat meten we juist; het mag het rapport niet blokkeren.
        rejectUnauthorized: false,
        // Ook een oude server (TLS 1.0 of 1.1) willen we kunnen zien, om hem als verouderd te melden.
        ...(isHttps && oudeTls ? { minVersion: "TLSv1", ciphers: "DEFAULT:@SECLEVEL=0" } : {}),
        agent: false,
      }, (res) => {
        eersteByte = Date.now() - start;
        if (isHttps && !tls) tls = tlsInfo(res.socket);
        const codering = String(res.headers["content-encoding"] || "").toLowerCase().trim();
        let lijnBytes = 0;
        const stukken = [];
        let lengte = 0;
        let afgekapt = false;
        const af = () => einde({
          ok: true, status: res.statusCode || 0, headers: res.headers, body: Buffer.concat(stukken).subarray(0, maxBody).toString("utf8"),
          ttfbMs: eersteByte, totaalMs: Date.now() - start, lijnBytes, afgekapt, codering: codering || null, tls,
        });
        let bron = res;
        const uitpak = codering === "gzip" || codering === "x-gzip" ? zlib.createGunzip() : codering === "deflate" ? zlib.createInflate() : codering === "br" ? zlib.createBrotliDecompress() : null;
        res.on("data", (d) => { lijnBytes += d.length; });
        if (uitpak) { res.pipe(uitpak); bron = uitpak; uitpak.on("error", af); }
        bron.on("data", (d) => {
          if (lengte >= maxBody) return;
          stukken.push(d); lengte += d.length;
          if (lengte >= maxBody) { afgekapt = true; af(); res.destroy(); }
        });
        bron.on("end", af);
        res.on("close", () => setTimeout(af, uitpak ? 50 : 0));
        res.on("error", af);
      });
    } catch {
      return resolve({ ok: false, reden: "verbinding" });
    }
    if (isHttps) req.on("socket", (s) => s.once("secureConnect", () => { tls = tlsInfo(s); }));
    const wekker = setTimeout(() => { req.destroy(); einde({ ok: false, reden: "timeout", tls }); }, Math.max(1, restMs));
    req.on("error", (e) => {
      const code = String(e?.code || e?.message || "");
      einde({ ok: false, reden: /cert|ssl|tls|EPROTO|handshake|alert/i.test(code) ? "tls" : e?.code === "ECONNREFUSED" ? "geweigerd" : /HPE_|parse/i.test(code) ? "geen-http" : "verbinding", tls });
    });
    req.end();
  });
}

// GET met redirects (tot vijf), elke hop opnieuw gecontroleerd. Geeft de hele keten terug.
export async function haal(startUrl, { einde, maxBody, accept, oudeTls = false, maxRedirects = MAX_REDIRECTS } = {}) {
  let url = new URL(startUrl);
  const stappen = [];
  for (let hop = 0; hop <= maxRedirects; hop++) {
    const rest = einde - Date.now();
    if (rest <= 0) return { ok: false, reden: "timeout", stappen };
    if (!["http:", "https:"].includes(url.protocol)) return { ok: false, reden: "redirect", stappen };
    if (url.username || url.password) return { ok: false, reden: "redirect", stappen };
    if (!toegestanePoort(url)) return { ok: false, reden: "poort", stappen };
    const gevonden = await zoekAdres(url.hostname);
    if (!gevonden.ok) return { ok: false, reden: gevonden.reden, stappen };
    const a = await eenVerzoek(url, { adres: gevonden.adres, familie: gevonden.familie, restMs: Math.min(rest, 10000), maxBody, accept, oudeTls });
    if (!a.ok) return { ok: false, reden: a.reden, stappen, tls: a.tls };
    stappen.push({ url: url.href, ...a });
    const naar = a.headers.location;
    if (a.status >= 300 && a.status < 400 && naar) {
      let volgende;
      try { volgende = new URL(Array.isArray(naar) ? naar[0] : naar, url); } catch { return { ok: false, reden: "redirect", stappen }; }
      if (stappen.some((s) => s.url === volgende.href)) return { ok: false, reden: "lus", stappen };
      url = volgende;
      continue;
    }
    return { ok: true, ...a, url: url.href, stappen };
  }
  return { ok: false, reden: "te-veel-redirects", stappen };
}

// ---------------------------------------------------------------------------------------------
// robots.txt: wij volgen de groep voor SocialNowCheck, anders die voor *.
// ---------------------------------------------------------------------------------------------

export function leesRobots(tekst) {
  const groepen = [];
  let huidig = null;
  let laatsteWasAgent = false;
  for (const ruw of String(tekst || "").split(/\r?\n/)) {
    const regel = ruw.replace(/#.*$/, "").trim();
    const m = regel.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const veld = m[1].toLowerCase(), waarde = m[2].trim();
    if (veld === "user-agent") {
      if (!huidig || !laatsteWasAgent) { huidig = { agents: [], regels: [] }; groepen.push(huidig); }
      huidig.agents.push(waarde.toLowerCase());
      laatsteWasAgent = true;
    } else if (huidig && (veld === "disallow" || veld === "allow")) {
      huidig.regels.push({ toestaan: veld === "allow", pad: waarde });
      laatsteWasAgent = false;
    } else laatsteWasAgent = false;
  }
  const eigen = groepen.filter((g) => g.agents.some((a) => a && "socialnowcheck".startsWith(a.replace(/\/.*$/, "")) && a !== "*"));
  const ster = groepen.filter((g) => g.agents.includes("*"));
  const regels = (eigen.length ? eigen : ster).flatMap((g) => g.regels);
  return { regels, groep: eigen.length ? "SocialNowCheck" : ster.length ? "*" : null };
}

function patroonPast(patroon, pad) {
  if (!patroon) return false;
  const anker = patroon.endsWith("$");
  const kern = (anker ? patroon.slice(0, -1) : patroon).split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp(`^${kern}${anker ? "$" : ""}`).test(pad);
}

// Langste passende regel wint; bij gelijke lengte wint allow (Google, RFC 9309).
export function magVolgensRobots(robots, pad) {
  let beste = null;
  for (const r of robots?.regels || []) {
    if (!r.pad && !r.toestaan) continue; // "Disallow:" leeg = alles mag
    if (!patroonPast(r.pad, pad)) continue;
    if (!beste || r.pad.length > beste.pad.length || (r.pad.length === beste.pad.length && r.toestaan)) beste = r;
  }
  return !beste || beste.toestaan;
}
