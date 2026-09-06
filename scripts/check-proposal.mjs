// Bron-/rendercontrole in Node. Dit is geen visuele of interactieve browsertest.
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const server = await createServer({
  configFile: false,
  ssr: {
    noExternal: ["react-router-dom", "react-router"],
    resolve: { conditions: ["module-sync", "node", "development"] },
  },
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { MemoryRouter } = await server.ssrLoadModule("react-router-dom");
  const { default: Page } = await server.ssrLoadModule(
    "/proposal/WebsiteProposal.tsx",
  );
  const { parseOsStand, installationHint, OsProof, CLAIM_URL, INSTALL_URL } =
    await server.ssrLoadModule("/proposal/os-entry.tsx");
  const { projects, agents, people } = await server.ssrLoadModule(
    "/proposal/content.ts",
  );
  const { allPosts } = await server.ssrLoadModule("/data/posts.ts");
  const routes = [
    "/",
    "/het-os",
    "/projecten",
    "/diensten",
    "/prijzen",
    "/team",
    "/blog",
    "/contact",
    "/privacy",
    ...projects.map((project) => `/project/${project.slug}`),
    ...allPosts.map((post) => `/blog/${post.slug}`),
  ];
  const rendered = new Map();
  const images = new Set();
  const referencedAnchors = [];
  let idCount = 0;
  for (const route of [...routes, "/niet-bestaand"]) {
    const html = renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { basename: "/voorstel", initialEntries: [`/voorstel${route}`] },
        React.createElement(Page),
      ),
    );
    rendered.set(route, html);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `one h1: ${route}`);
    assert.equal(
      (html.match(/<main\b/g) || []).length,
      1,
      `one main: ${route}`,
    );
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    idCount += ids.length;
    assert.equal(new Set(ids).size, ids.length, `unique ids: ${route}`);
    for (const [, id] of html.matchAll(
      /(?:href="#|aria-controls="|aria-labelledby=")([^" ]+)"/g,
    ))
      assert(ids.includes(id), `existing ARIA/anchor ${id}: ${route}`);
    for (const [, src] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
      if (src.startsWith("https://")) continue;
      images.add(src);
      assert(existsSync(`public${src}`), `image exists ${src}: ${route}`);
    }
    for (const [, href] of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
      if (!href.startsWith("/voorstel")) continue;
      const url = new URL(
        href.replaceAll("&amp;", "&"),
        "https://socialnow.nl",
      );
      const target = url.pathname.replace(/^\/voorstel/, "") || "/";
      assert(
        routes.includes(target),
        `preview link stays in an existing route: ${href}`,
      );
      if (url.hash) referencedAnchors.push([target, url.hash.slice(1)]);
    }
  }
  for (const [route, id] of referencedAnchors)
    assert(
      rendered.get(route).includes(`id="${id}"`),
      `cross-page anchor ${route}#${id}`,
    );
  for (const base of ["/voorstel", "/"]) {
    for (const route of routes) {
      const url = `${base === "/" ? "" : base}${route}?stijl=studio`;
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { basename: base, initialEntries: [url] },
          React.createElement(Page),
        ),
      );
      assert(
        html.includes('data-style="signature"'),
        `Signature always selected: ${url}`,
      );
      assert(!html.includes("Kies een stijl"), `style picker removed: ${url}`);
      assert.equal((html.match(/<h1\b/g) || []).length, 1, `one h1: ${url}`);
      if (route === "/") {
        assert(
          html.includes('id="uitgelicht-werk"'),
          "featured work prominently available",
        );
        assert(
          html.includes("h-featured-motion"),
          "moving featured video collection",
        );
        assert(
          html.includes("Universal Studios, Sony"),
          "original film campaign collage",
        );
        assert(
          html.indexOf("h-hero-milos") < html.indexOf('id="uitgelicht-werk"'),
          "four hero Milos remain first",
        );
        assert(
          !html.includes("Concepttekst voor Marinus"),
          "no unapproved founder quote on production",
        );
      }
    }
  }
  const { portfolioVideos, portfolioImages } = await server.ssrLoadModule(
    "/proposal/MediaSliders.tsx",
  );
  assert.equal(
    portfolioVideos.length,
    14,
    "complete original video collection",
  );
  assert.equal(
    portfolioImages.length,
    9,
    "complete original image-slider collection",
  );
  for (const file of ["header-intro.mp4", "header-intro-mobile.mp4"])
    assert(existsSync(`public/video/${file}`));
  assert.equal(projects.length, 14, "all 14 original projects retained");
  assert.equal(people.length, 8, "full team retained");
  assert.equal(agents.length, 4, "four dashboard Milos");
  for (const agent of agents) {
    assert(
      rendered.get("/").includes(`/proposal/milo/${agent.id}.webp`),
      `dashboard Milo in homepage: ${agent.id}`,
    );
    for (const extension of ["webp", "webm", "mp4"])
      assert(existsSync(`public/proposal/milo/${agent.id}.${extension}`));
  }
  assert(
    rendered.get("/contact").includes("Open e-mailconcept"),
    "contact flow honestly labels email handoff",
  );
  assert(
    rendered.get("/prijzen").includes("Bespreek jouw Custom OS"),
    "offer leads to personal Custom OS conversation",
  );
  assert(
    !rendered.get("/prijzen").includes("€ 1.500"),
    "old onepager pricing no longer main offer",
  );
  assert(
    rendered.get("/niet-bestaand").includes("Pagina niet gevonden"),
    "missing route has recovery",
  );
  for (const role of [
    "website",
    "crm",
    "content",
    "advertenties",
    "odoo",
    "kwh-case",
    "master-en",
  ]) {
    assert(
      existsSync(`public/video/os/os-${role}.mp4`),
      `original video exists: ${role}`,
    );
    assert(
      existsSync(`public/video/os/os-${role}.webp`),
      `original poster exists: ${role}`,
    );
  }
  assert.equal(CLAIM_URL, "https://app.socialnow.nl/login/?bron=site");
  assert.equal(INSTALL_URL, "https://app.socialnow.nl/?bron=installatie");

  const demo = parseOsStand({ ok: true, demo: true, customOs: 26, demos: 240 });
  const live = parseOsStand({ ok: true, live: true, total: 0 });
  assert.equal(demo.mode, "demo");
  assert.equal(live.mode, "live");
  for (const data of [
    null,
    {},
    { ok: true, demo: true, live: true, total: 1, customOs: 2, demos: 3 },
    { ok: true, live: true, total: -1 },
    { ok: true, live: true, total: 1.1 },
    { ok: true, demo: true, customOs: 1, demos: "2" },
    { ok: true, live: true, total: Number.MAX_SAFE_INTEGER + 1 },
  ])
    assert.equal(parseOsStand(data), null);
  const demoMarkup = renderToStaticMarkup(
    React.createElement(OsProof, { stand: demo }),
  );
  assert(
    demoMarkup.includes("Demostand") && demoMarkup.includes("geen klantgroei"),
  );
  const liveMarkup = renderToStaticMarkup(
    React.createElement(OsProof, { stand: live }),
  );
  assert(
    liveMarkup.includes("OS-werkruimten aangemaakt") &&
      !liveMarkup.includes("Demostand"),
  );
  const absentMarkup = renderToStaticMarkup(
    React.createElement(OsProof, { stand: null }),
  );
  assert(
    absentMarkup.includes("tijdelijk niet beschikbaar") &&
      !absentMarkup.includes("OS-werkruimten aangemaakt"),
  );
  assert(
    installationHint("iPhone Safari", "iPhone", 1).includes("beginscherm"),
  );
  assert(
    installationHint("Macintosh Safari", "MacIntel", 5).includes("beginscherm"),
  );
  assert(installationHint("Macintosh Safari", "MacIntel", 0).includes("Dock"));
  assert(
    !installationHint("Macintosh Chrome Safari", "MacIntel", 0).includes(
      "Dock",
    ),
  );
  assert(
    installationHint("Android Firefox", "Linux", 1).includes(
      "als die optie beschikbaar is",
    ),
  );

  if (existsSync("dist/voorstel/index.html")) {
    const preview = readFileSync("dist/voorstel/index.html", "utf8");
    const home = readFileSync("dist/index.html", "utf8");
    assert(preview.includes("noindex, nofollow"));
    assert(!home.includes("noindex, nofollow"));
    assert(
      !home.includes("€3.000"),
      "old pricing removed from production metadata",
    );
    assert(
      home.includes("Eén OS voor je bedrijf"),
      "Signature homepage metadata",
    );
    assert(
      readFileSync("dist/prijzen/index.html", "utf8").includes(
        "persoonlijk voorstel",
      ),
      "new offer metadata",
    );
    assert(
      readFileSync("dist/sitemap.xml", "utf8").includes("/het-os"),
      "OS route indexed",
    );
    assert(
      readFileSync("dist/sitemap.xml", "utf8").includes("/contact"),
      "contact route indexed",
    );
    assert(!readFileSync("dist/sitemap.xml", "utf8").includes("/voorstel"));
    for (const [, asset] of preview.matchAll(
      /(?:src|href)="(\/assets\/[^"]+)"/g,
    )) {
      assert(existsSync(`dist${asset}`), `preview bundle: ${asset}`);
    }
    for (const route of routes) {
      const file = `dist/voorstel${route === "/" ? "" : route}/index.html`;
      assert(existsSync(file), `direct preview route: ${route}`);
      assert(
        readFileSync(file, "utf8").includes("noindex, nofollow"),
        `noindex preview route: ${route}`,
      );
    }
    for (const route of [
      "het-os",
      "contact",
      "diensten",
      "projecten",
      "prijzen",
      "privacy",
      "team",
      "blog",
      "project/kwh-garant-website",
    ]) {
      assert(
        existsSync(`dist/${route}/index.html`),
        `existing route retained: ${route}`,
      );
    }
  }
  console.log(
    `Geslaagd: Node-render, ${routes.length} routes, ${idCount} IDs en ARIA-doelen, ${images.size} bestaande afbeeldingen, instaplinks, demo/live/foutstanden, installatiehints en Signature op hoofd- en previewroutes. Geen browser gebruikt.`,
  );
} finally {
  await server.close();
}
