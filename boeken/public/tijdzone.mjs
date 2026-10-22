// Stub: groepeert op UTC-datum.
export function groepeerPerDag(slots) {
  const dagen = new Map();
  for (const iso of slots) {
    const d = iso.slice(0, 10);
    if (!dagen.has(d)) dagen.set(d, { datum: d, tijden: [] });
    dagen.get(d).tijden.push({ iso, tijd: iso.slice(11, 16) });
  }
  return [...dagen.values()];
}
