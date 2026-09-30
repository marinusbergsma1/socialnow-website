// Kern en rest van een woordenboek (zie scripts/woordenboek-split.mjs en laadWoordenboek in context.ts).
declare module "*.json?kern" {
  const woorden: Record<string, string>;
  export default woorden;
}
declare module "*.json?rest" {
  const woorden: Record<string, string>;
  export default woorden;
}
