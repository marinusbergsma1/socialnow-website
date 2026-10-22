// Stub: rekent alles als UTC. Wordt vervangen door de echte tijdzonelogica.
export function zoneNaarUtc(datum, tijd) { return new Date(`${datum}T${tijd}:00Z`); }
export function datumInZone(d) { return new Date(d).toISOString().slice(0, 10); }
