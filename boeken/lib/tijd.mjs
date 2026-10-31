// Rekenen met tijdzones zonder bibliotheek: Intl kent de regels, wij vragen alleen de offset op.
const formatters = new Map();

function formatter(tz) {
  if (!formatters.has(tz)) {
    formatters.set(tz, new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }));
  }
  return formatters.get(tz);
}

// Klokdelen van een moment in een zone.
export function delenInZone(moment, tz) {
  const p = {};
  for (const { type, value } of formatter(tz).formatToParts(new Date(moment))) p[type] = value;
  return { jaar: +p.year, maand: +p.month, dag: +p.day, uur: +p.hour, minuut: +p.minute, seconde: +p.second };
}

// Minuten dat de zone op dat moment voor UTC loopt (Amsterdam: 60 of 120).
export function offsetMinuten(moment, tz) {
  const ms = +new Date(moment);
  const d = delenInZone(ms, tz);
  const alsUtc = Date.UTC(d.jaar, d.maand - 1, d.dag, d.uur, d.minuut, d.seconde);
  return Math.round((alsUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

// "2026-10-26" + "09:00" in Europe/Amsterdam wordt het juiste UTC-moment.
export function zoneNaarUtc(datum, tijd, tz) {
  const [j, m, d] = datum.split("-").map(Number);
  const [u, mi] = tijd.split(":").map(Number);
  const gok = Date.UTC(j, m - 1, d, u, mi);
  let uit = gok - offsetMinuten(gok, tz) * 60000;
  const tweede = offsetMinuten(uit, tz);
  if (gok - tweede * 60000 !== uit) uit = gok - tweede * 60000;
  return new Date(uit);
}

export function datumInZone(moment, tz) {
  const d = delenInZone(moment, tz);
  return `${d.jaar}-${String(d.maand).padStart(2, "0")}-${String(d.dag).padStart(2, "0")}`;
}

export function plusDagen(datum, n) {
  const [j, m, d] = datum.split("-").map(Number);
  return new Date(Date.UTC(j, m - 1, d + n)).toISOString().slice(0, 10);
}

// 0 = zondag, 6 = zaterdag.
export function weekdag(datum) {
  const [j, m, d] = datum.split("-").map(Number);
  return new Date(Date.UTC(j, m - 1, d)).getUTCDay();
}

export function minutenVan(tijd) {
  const [u, m] = tijd.split(":").map(Number);
  return u * 60 + m;
}

export function tijdVan(minuten) {
  return `${String(Math.floor(minuten / 60)).padStart(2, "0")}:${String(minuten % 60).padStart(2, "0")}`;
}

// "2026-10-26T10:00:00+01:00": hetzelfde moment, geschreven in de klok van de zone.
export function isoMetOffset(moment, tz) {
  const ms = +new Date(moment);
  const d = delenInZone(ms, tz);
  const off = offsetMinuten(ms, tz);
  const p2 = (n) => String(Math.abs(n)).padStart(2, "0");
  return `${d.jaar}-${p2(d.maand)}-${p2(d.dag)}T${p2(d.uur)}:${p2(d.minuut)}:${p2(d.seconde)}${off < 0 ? "-" : "+"}${p2(Math.trunc(off / 60))}:${p2(off % 60)}`;
}
