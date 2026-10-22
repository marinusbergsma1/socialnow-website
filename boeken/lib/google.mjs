// Google Agenda via de Calendar API v3, zonder SDK. De sleutels komen alleen uit Vercel-env
// (zie omgeving.mjs); hier staan geen waarden, en ze komen nooit in een antwoord of log.
const API = "https://www.googleapis.com/calendar/v3";
const TOKEN = "https://oauth2.googleapis.com/token";
const MARKERING = "socialnowBoeking";

export class GoogleFout extends Error {
  constructor(status, reden) {
    super(`google ${status} ${reden || ""}`.trim());
    this.status = status;
  }
}

export function googleAgenda({ clientId, clientSecret, refreshToken, agendaId = "primary", bezetAgendas = [], fetchImpl = fetch, tijdslimiet = 8000 }) {
  let toegang = null;
  let verloopt = 0;

  async function token() {
    if (toegang && Date.now() < verloopt - 60_000) return toegang;
    const r = await fetchImpl(TOKEN, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
      signal: AbortSignal.timeout(tijdslimiet),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.access_token) throw new GoogleFout(r.status, j.error || "token");
    toegang = j.access_token;
    verloopt = Date.now() + (j.expires_in || 3600) * 1000;
    return toegang;
  }

  async function api(methode, pad, { query, body } = {}) {
    const url = new URL(API + pad);
    for (const [k, v] of Object.entries(query || {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const r = await fetchImpl(url, {
      method: methode,
      headers: { authorization: `Bearer ${await token()}`, ...(body ? { "content-type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(tijdslimiet),
    });
    if (r.status === 204) return null;
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new GoogleFout(r.status, j?.error?.status || j?.error?.message);
    return j;
  }

  const agendaPad = `/calendars/${encodeURIComponent(agendaId)}`;
  const iso = (ms) => new Date(ms).toISOString();
  const naarAfspraak = (e) => ({
    id: e.id,
    start: Date.parse(e.start?.dateTime || e.start?.date),
    eind: Date.parse(e.end?.dateTime || e.end?.date),
    aangemaakt: Date.parse(e.created),
    status: e.status,
    boeking: e.extendedProperties?.private?.[MARKERING] === "1",
    soortId: e.extendedProperties?.private?.soort || "",
    gastNaam: e.extendedProperties?.private?.gastNaam || "",
    meet: e.hangoutLink || e.conferenceData?.entryPoints?.find((p) => p.entryPointType === "video")?.uri || null,
  });

  return {
    // Bezet in de boekingsagenda plus eventuele extra agenda's. Een fout bij één agenda telt als
    // bezet: liever geen slot dan een dubbele boeking.
    async bezet(van, tot) {
      const ids = [agendaId, ...bezetAgendas];
      const j = await api("POST", "/freeBusy", { body: { timeMin: iso(+van), timeMax: iso(+tot), timeZone: "UTC", items: ids.map((id) => ({ id })) } });
      const uit = [];
      for (const id of ids) {
        const c = j.calendars?.[id] || (id === "primary" ? Object.values(j.calendars || {})[0] : null);
        if (!c || c.errors?.length) throw new GoogleFout(502, `freebusy ${c?.errors?.[0]?.reason || "ontbreekt"}`);
        for (const b of c.busy || []) uit.push({ start: Date.parse(b.start), eind: Date.parse(b.end) });
      }
      return uit;
    },

    async boekingen(van, tot) {
      const j = await api("GET", `${agendaPad}/events`, {
        query: { timeMin: iso(+van), timeMax: iso(+tot), singleEvents: true, showDeleted: false, maxResults: 50, privateExtendedProperty: `${MARKERING}=1` },
      });
      return (j.items || []).filter((e) => e.status !== "cancelled").map(naarAfspraak);
    },

    async maak({ start, eind, titel, beschrijving, soortId, taal }) {
      const e = await api("POST", `${agendaPad}/events`, {
        query: { conferenceDataVersion: 1, sendUpdates: "none" },
        body: {
          summary: titel,
          description: beschrijving,
          start: { dateTime: iso(start), timeZone: "UTC" },
          end: { dateTime: iso(eind), timeZone: "UTC" },
          conferenceData: { createRequest: { requestId: `sn-${start}-${Math.random().toString(36).slice(2, 10)}`, conferenceSolutionKey: { type: "hangoutsMeet" } } },
          extendedProperties: { private: { [MARKERING]: "1", soort: soortId, taal } },
          guestsCanInviteOthers: false,
          guestsCanModify: false,
          transparency: "opaque",
          reminders: { useDefault: true },
        },
      });
      return naarAfspraak(e);
    },

    async nodigUit(id, { gasten, beschrijving, naam, soortId, taal }) {
      const e = await api("PATCH", `${agendaPad}/events/${encodeURIComponent(id)}`, {
        query: { conferenceDataVersion: 1, sendUpdates: "all" },
        body: {
          description: beschrijving,
          attendees: gasten.map((g) => ({ email: g.email, displayName: g.naam || undefined })),
          extendedProperties: { private: { [MARKERING]: "1", soort: soortId, taal, gastNaam: naam } },
        },
      });
      return naarAfspraak(e);
    },

    async haal(id) {
      try {
        return naarAfspraak(await api("GET", `${agendaPad}/events/${encodeURIComponent(id)}`));
      } catch (f) {
        if (f.status === 404 || f.status === 410) return null;
        throw f;
      }
    },

    async verplaats(id, { start, eind, stil }) {
      const e = await api("PATCH", `${agendaPad}/events/${encodeURIComponent(id)}`, {
        query: { sendUpdates: stil ? "none" : "all" },
        body: { start: { dateTime: iso(start), timeZone: "UTC" }, end: { dateTime: iso(eind), timeZone: "UTC" } },
      });
      return naarAfspraak(e);
    },

    async verwijder(id, { stil }) {
      await api("DELETE", `${agendaPad}/events/${encodeURIComponent(id)}`, { query: { sendUpdates: stil ? "none" : "all" } });
    },
  };
}
