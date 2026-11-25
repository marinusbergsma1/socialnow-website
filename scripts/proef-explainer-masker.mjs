#!/usr/bin/env node
// Proef, Marinus 25 nov 2026: "Ik vind het masker niet mooi. Graag verbeteren of iets meer verplaatsen." De homepagefilm is opnieuw
// gerenderd (film 92, v2) met de tegels achter hem verschoven tot ze zijn silhouet niet raken. Rood op main, groen erna.
import fs from "node:fs"; import crypto from "node:crypto";
const F = "public/video/explainer/socialnow-explainer-5x4.mp4";
const h = crypto.createHash("sha256").update(fs.readFileSync(F)).digest("hex").slice(0, 12);
const ok = h === "faffe4c73ad3";
console.log(`${ok ? "GROEN" : "ROOD "}  homepagefilm is v2 zonder tegels achter het hoofd (${h})`);
process.exit(ok ? 0 : 1);
