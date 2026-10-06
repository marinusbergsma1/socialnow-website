// Controleert navigatie, ankers, contactcontext en mobiele bediening op de gebouwde website.
// Start npm run preview -- --host 127.0.0.1 --port 4311 --strictPort.
// PLAYWRIGHT_CORE kan naar een aanwezige Playwright-module wijzen; BROWSER_CHANNEL=chrome gebruikt de lokale Chrome.
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright");
const base = process.env.WEBSITE_TEST_URL || "http://127.0.0.1:4311";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Gebruik een lokale preview");
const output = process.env.ARTIFACT_DIR || "/tmp/socialnow-product-route";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
  for (const language of ["nl", "en", "de", "fr"]) {
    const dictionary = language === "nl" ? {} : JSON.parse(readFileSync(`proposal/i18n/${language}.json`, "utf8"));
    const prefix = language === "en" ? "" : `/${language}`;
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
      await context.addCookies([{ name: "sn-taal", value: language, url: base }]);
      // Geen externe API's, accounts of klantgegevens tijdens deze UI-proef.
      await context.route("**/*", route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      // De static host opent route-mappen met een slash. Vite preview geeft voor /prijzen zonder
      // slash de SPA-fallback (homepage), wat een onjuiste hydratatieproef zou zijn.
      const open = async route => { await page.goto(`${base}${prefix}${route.endsWith("/") ? route : `${route}/`}`); await page.waitForLoadState("networkidle"); };
      const fits = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${language} ${width}: horizontale overflow`);
      await open("/");
      await fits();
      assert.equal(await page.locator(".h-hero .h-integratie").count(), 0);
      assert.equal(await page.locator("#koppelingen .h-film-os video").getAttribute("src"), null, "De optionele Odoo-film mag niet op het eerste scherm laden");
      assert.equal(await page.locator(".h-hero-tekst .h-dock-login").getAttribute("href"), "https://app.socialnow.nl/login/");
      assert.equal(await page.locator(".h-product-milos img").evaluateAll(images => images.filter(image => image.complete && image.naturalWidth > 0).length), 4);
      await page.screenshot({ path: path.join(output, `${language}-home-${width}.png`) });
      for (const step of ["website", "content", "studio"]) {
        await open("/"); // Ook testen wanneer de OS-pagina nog niet is geladen.
        await page.locator(".sn-product-route").first().locator(`a[href$="#route-${step}"]`).click();
        await page.waitForLoadState("networkidle");
        const anchor = page.locator(`#route-${step}`);
        await anchor.waitFor({ state: "visible" });
        const box = await anchor.boundingBox();
        assert.ok(box.y >= 64 && box.y < 450, `${language} ${width}: ${step} valt achter de header of buiten beeld (${box.y})`);
        assert.equal(new URL(page.url()).pathname.replace(/\/$/, ""), `${prefix}/het-os`);
        await fits();
      }
      await open("/het-os");
      await page.screenshot({ path: path.join(output, `${language}-os-${width}.png`) });
      await page.locator(".sn-product-offer > a").first().click();
      await page.waitForLoadState("networkidle");
      assert.equal(await page.locator('input[name="subject"]').inputValue(), dictionary["Een persoonlijk systeem"] || "Een persoonlijk systeem");
      await open("/prijzen");
      await fits();
      await page.screenshot({ path: path.join(output, `${language}-prijzen-${width}.png`) });
      await page.locator(".prijs-opslag a").click();
      await page.waitForLoadState("networkidle");
      assert.equal(new URL(page.url()).searchParams.get("onderwerp"), "Opslag boven 10 GB");
      assert.ok(await page.locator('input[name="subject"]').inputValue());
      if (width === 390) {
        const toggle = page.locator(".h-menu-toggle");
        const box = await toggle.boundingBox();
        assert.ok(box.x >= 0 && box.x + box.width <= width, "De menuknop valt buiten het mobiele scherm");
        await toggle.click();
        assert.equal(await toggle.getAttribute("aria-expanded"), "true");
        await page.keyboard.press("Escape");
        assert.equal(await toggle.getAttribute("aria-expanded"), "false");
        assert.equal(await toggle.evaluate(element => element === document.activeElement), true);
      }
      assert.deepEqual(errors, [], `${language} ${width}: browserfouten`);
      await context.close();
      console.log(`GROEN ${language} ${width}: route, ankers, contactcontext, beelden en layout`);
    }
  }
} finally {
  await browser.close();
}
