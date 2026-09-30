"""check-meta-na-laden: red/green-proef voor de meta NA het laden van de app, op de build (dist).

30 september 2026. postbuild.mjs en localize-build.mjs schrijven per route en per taal een eigen title,
description en canonical in de html. Daarna zette de app in WebsiteProposal.tsx op elke route zonder
project of blogpost de algemene homepagezin en het menulabel terug. Google voert JavaScript uit en zag
dus op alle 32 route-taalcombinaties met eigen meta de algemene zin; in de broncode stond het goed, dus
niemand zag het.

De proef serveert dist zoals Vercel (/prijzen en /prijzen/ geven prijzen/index.html, onbekend geeft
404.html) en vergelijkt per route en taal de html met de toestand na het laden. Hoort de html bij de
route (canonical wijst ernaar en localize-build heeft hreflang gezet), dan moet de app hem laten staan.
Anders (404-terugval, route buiten de sitemap) moet de app zelf zetten. Plus: taal via cookie omgezet,
en navigeren binnen de app.

Draai: npm run build && python3 scripts/check-meta-na-laden.py   (exit 0 = groen)
Vereist Python Playwright met chromium (pip install playwright && playwright install chromium).
"""
import html, http.server, os, re, socketserver, sys, threading, urllib.error, urllib.request
from playwright.sync_api import sync_playwright

DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")
if not os.path.exists(os.path.join(DIST, "index.html")):
    sys.exit("dist ontbreekt: eerst npm run build")


class Vercelachtig(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=DIST, **k)

    def log_message(self, *a):
        pass

    def send_head(self):
        pad = self.path.split("?")[0].split("#")[0]
        vol = os.path.join(DIST, pad.lstrip("/"))
        if os.path.isdir(vol) and os.path.exists(os.path.join(vol, "index.html")):
            self.path = pad.rstrip("/") + "/index.html"
            return super().send_head()
        if os.path.isfile(vol):
            return super().send_head()
        f = open(os.path.join(DIST, "404.html"), "rb")
        self.send_response(404)
        self.send_header("Content-type", "text/html; charset=utf-8")
        self.end_headers()
        return f


socketserver.TCPServer.allow_reuse_address = True
server = socketserver.ThreadingTCPServer(("127.0.0.1", 0), Vercelachtig)
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{server.server_address[1]}"

ROUTES = ["/", "/antwoord-aanvragen", "/prijzen", "/prijzen/", "/het-os", "/team", "/contact", "/blog", "/project/raveg-branding", "/foo", "/investors"]
TALEN = ["", "/nl", "/de", "/fr"]
BUITEN = re.compile(r"workers\.dev|behold|googleapis|mymemory")
fouten = []


def statisch(url):
    try:
        body = urllib.request.urlopen(url).read().decode()
    except urllib.error.HTTPError as e:
        body = e.read().decode()
    veld = lambda r: html.unescape(re.search(r, body).group(1))
    return (veld(r"<title>([^<]*)</title>"), veld(r'<meta\s+name="description"\s+content="([^"]*)"'),
            veld(r'<link\s+rel="canonical"\s+href="([^"]*)"') if 'hreflang="x-default"' in body else "(niet gelokaliseerd)")


def na_laden(pg):
    pg.wait_for_timeout(700)
    return (pg.title(), pg.get_attribute('meta[name="description"]', "content"), pg.get_attribute('link[rel="canonical"]', "href"))


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context()
    ctx.add_cookies([{"name": "sn-taal", "value": "en", "url": BASE}])
    ctx.route(BUITEN, lambda r: r.abort())
    pg = ctx.new_page()
    for taal in TALEN:
        for route in ROUTES:
            url = BASE + taal + route
            st, sd, sc = statisch(url)
            pg.goto(url, wait_until="domcontentloaded")
            lt, ld, lc = na_laden(pg)
            eigen = sc.rstrip("/") == ("https://socialnow.nl" + taal + route).rstrip("/")
            if eigen and (ld != sd or lt != st):
                fouten.append(f"{taal or '/en'}{route}: meta overschreven\n     html : {st} | {sd[:80]}\n     app  : {lt} | {ld[:80]}")
            if not eigen and ld == sd and route != "/" and not (taal == "/nl" and route == "/antwoord-aanvragen"):
                fouten.append(f"{taal or '/en'}{route}: 404-terugval, app zet geen eigen meta ({ld[:60]})")
            if not eigen and lc.rstrip("/") == sc.rstrip("/"):
                fouten.append(f"{taal or '/en'}{route}: canonical blijft {lc}")

    # Taal via cookie: /prijzen met sn-taal=nl wordt /nl/prijzen zonder herladen; de Engelse html-meta mag niet blijven.
    ctx2 = b.new_context()
    ctx2.add_cookies([{"name": "sn-taal", "value": "nl", "url": BASE}])
    ctx2.route(BUITEN, lambda r: r.abort())
    pg2 = ctx2.new_page()
    en_t, en_d, _ = statisch(BASE + "/prijzen")
    pg2.goto(BASE + "/prijzen", wait_until="domcontentloaded")
    lt, ld, lc = na_laden(pg2)
    if ld == en_d or lc.rstrip("/") != "https://socialnow.nl/nl/prijzen":
        fouten.append(f"cookie nl op /prijzen: Engelse meta of canonical blijft ({lc} | {ld[:60]})")

    # Navigeren binnen de app: van /prijzen naar /team, de meta moet mee.
    pr_t, pr_d, _ = statisch(BASE + "/prijzen")
    pg.goto(BASE + "/prijzen", wait_until="domcontentloaded")
    na_laden(pg)
    pg.click('header nav.h-desktop-nav a[href="/team"]')
    lt, ld, lc = na_laden(pg)
    if ld == pr_d or lt == pr_t or lc.rstrip("/") != "https://socialnow.nl/team":
        fouten.append(f"navigeren /prijzen -> /team: meta blijft van /prijzen ({lt} | {lc})")
    b.close()
server.shutdown()

for f in fouten:
    print("  -", f)
print(("ROOD: %d" % len(fouten)) if fouten else "GROEN")
sys.exit(1 if fouten else 0)
