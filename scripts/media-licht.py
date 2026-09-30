#!/usr/bin/env python3
# Lichte beelden en films voor socialnow.nl (30 september 2026, Marinus: "site VEEL SNELLER, WIL ECHT INSTANT LOADING").
# Maakt elk beeld in de maat waarin het getoond wordt en comprimeert de zware films, zonder zichtbaar kwaliteitsverlies.
# Het origineel van een gezicht of poster blijft staan voor grote weergaven (zoals /team); films en merklogo's worden op
# hun plek vervangen, zodat alle verwijzingen blijven kloppen. Nog een keer draaien slaat over wat al klaar is.
# Draai: python3 scripts/media-licht.py   (vraagt Pillow en ffmpeg met libx264, libvpx-vp9 en hevc_videotoolbox)
# Proef: node scripts/proef-media-licht.mjs
import json, os, re, subprocess, sys
from PIL import Image

PUBLIC = os.path.join(os.path.dirname(__file__), "..", "public")
KLEIN = os.path.join(PUBLIC, "images", "klein")
LABEL = "media-licht 2026-09-30"


def pad(*delen):
    return os.path.join(PUBLIC, *delen)


def webp(bron, doel, breed=None, kort=None, hoog=None, kwaliteit=78):
    """Schaal op breedte, op de korte zijde of op hoogte (nooit groter dan het origineel) en schrijf WebP."""
    if os.path.exists(doel) and os.path.getmtime(doel) >= os.path.getmtime(bron):
        return
    beeld = Image.open(bron)
    beeld = beeld.convert("RGBA") if beeld.mode in ("RGBA", "LA", "P") else beeld.convert("RGB")
    b, h = beeld.size
    factor = 1.0
    if breed:
        factor = min(1.0, breed / b)
    if kort:
        factor = min(1.0, kort / min(b, h))
    if hoog:
        factor = min(1.0, hoog / h)
    if factor < 1.0:
        beeld = beeld.resize((max(1, round(b * factor)), max(1, round(h * factor))), Image.LANCZOS)
    os.makedirs(os.path.dirname(doel), exist_ok=True)
    beeld.save(doel, "WEBP", quality=kwaliteit, method=6)
    print(f"beeld  {os.path.relpath(doel, PUBLIC)}  {beeld.size[0]}x{beeld.size[1]}  {os.path.getsize(doel) // 1024} KB")


def mensen():
    """De gezichten uit proposal/content.ts (people[].image)."""
    bron = open(os.path.join(os.path.dirname(__file__), "..", "proposal", "content.ts"), encoding="utf8").read()
    return sorted(set(re.findall(r'image:\s*"([^"/]+\.(?:webp|jpg|jpeg|png))"', bron)))


def gezichten():
    # Teamstrook 48 px, Mens en AI 36 px, voettekst en pop-up 34 tot 38 px: 96 (1x en 2x) en 160 (3x).
    for naam in mensen():
        stam = os.path.splitext(naam)[0]
        for maat in (96, 160):
            webp(pad("images", naam), os.path.join(KLEIN, f"{stam}-{maat}.webp"), kort=maat, kwaliteit=80)
    # Sprekersblok in de hero (vierkant in een staande kaart van ongeveer 340 bij 420): 480 en 800.
    for naam in ("marinus-profiel-blauw.webp", "sid-attesso.webp"):
        stam = os.path.splitext(naam)[0]
        for maat in (480, 800):
            webp(pad("images", naam), os.path.join(KLEIN, f"{stam}-{maat}.webp"), kort=maat, kwaliteit=78)


def logos():
    # Het woordmerk in de kop staat op 184 bij 28 px: 400 px voor 1x en 2x, 600 px voor 3x.
    for maat in (400, 600):
        webp(pad("images", "SocialNow-Logo-2026.webp"), os.path.join(KLEIN, f"SocialNow-Logo-2026-{maat}.webp"), breed=maat, kwaliteit=80)
    # Logobalk: hoogstens 58 px hoog, 40 px op de telefoon (3x = 120). Op hun plek, want de balk laadt ze eager.
    for naam in sorted(os.listdir(pad("images", "merken"))):
        if not naam.endswith(".webp"):
            continue
        p = pad("images", "merken", naam)
        beeld = Image.open(p)
        if beeld.size[1] <= 120:
            continue
        beeld = beeld.convert("RGBA")
        b, h = beeld.size
        beeld = beeld.resize((round(b * 120 / h), 120), Image.LANCZOS)
        beeld.save(p, "WEBP", quality=90, method=6)
        print(f"logo   images/merken/{naam}  {beeld.size[0]}x120  {os.path.getsize(p) // 1024} KB")


def posters():
    # Hero: de poster is het eerste beeld (LCP) en blijft onder 60 KB.
    webp(pad("video", "os", "os-booth-en.jpg"), pad("video", "os", "os-booth-en-poster.webp"), breed=1280, kwaliteit=70)
    # Onder de vouw: lichte posters, die pas laden als de film dichtbij komt.
    for taal in ("en", "nl"):
        webp(pad("video", "verhaal", f"verhaal-{taal}.jpg"), pad("video", "verhaal", f"verhaal-{taal}-poster.webp"), breed=1280, kwaliteit=70)
    webp(pad("video", "vastiq", "vastiq-uitzoom.jpg"), pad("video", "vastiq", "vastiq-uitzoom-poster.webp"), breed=960, kwaliteit=66)


def ffprobe(p):
    uit = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height:format_tags=comment", "-of", "json", p],
                         capture_output=True, text=True, check=True).stdout
    return json.loads(uit)


def al_licht(p):
    return LABEL in (ffprobe(p).get("format", {}).get("tags", {}) or {}).get("comment", "")


def film(p, crf, breed=1280):
    """H.264 op hoogstens 1280 px, faststart, stem op 96 kbit/s; op zijn plek, want alle verwijzingen blijven gelijk."""
    if al_licht(p):
        return
    info = ffprobe(p)
    geluid = any(s.get("codec_type") == "audio" for s in info["streams"])
    tijdelijk = p + ".licht.mp4"
    voor = os.path.getsize(p)
    opdracht = ["ffmpeg", "-v", "error", "-y", "-i", p, "-vf", f"scale='min({breed},iw)':-2:flags=lanczos",
                "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-profile:v", "high", "-pix_fmt", "yuv420p",
                "-movflags", "+faststart", "-metadata", f"comment={LABEL}"]
    opdracht += ["-c:a", "aac", "-b:a", "96k"] if geluid else ["-an"]
    subprocess.run(opdracht + [tijdelijk], check=True)
    na = os.path.getsize(tijdelijk)
    if na >= voor:
        os.remove(tijdelijk)
        print(f"film   {os.path.relpath(p, PUBLIC)}  al licht ({voor // 1024} KB)")
        return
    os.replace(tijdelijk, p)
    print(f"film   {os.path.relpath(p, PUBLIC)}  {voor // 1024} KB naar {na // 1024} KB")


def films():
    # Hero: de OS-film (crf 28, de film met de meeste tekst) en de logo-animatie bovenaan.
    film(pad("video", "os", "os-booth-en.mp4"), 28)
    film(pad("video", "bedankt", "logo-animatie.mp4"), 28, breed=840)
    # Onder de vouw: de vijf veiligheidsfilms in twee talen en de verhaalfilm.
    for naam in sorted(os.listdir(pad("video", "veiligheid"))):
        if naam.endswith(".mp4"):
            film(pad("video", "veiligheid", naam), 30)
    for taal in ("en", "nl"):
        film(pad("video", "verhaal", f"verhaal-{taal}.mp4"), 30)


def milo():
    # De vier Milo's in de pillen boven de OS-film staan op 38 px (3x = 114): 128 px. In de tegels "Vier gezichten"
    # en de afsluiter staan ze op 90 tot 140 px: 256 px. Chrome en Firefox krijgen VP9 met alfa, Safari HEVC met alfa.
    for rol in ("website", "crm", "content", "ads-magenta"):
        for maat, crf, q in ((128, 36, 50), (256, 34, 50)):
            webp(pad("proposal", "milo", f"{rol}.webp"), pad("proposal", "milo", f"{rol}-{maat}.webp"), breed=maat, kwaliteit=80)
            bron = pad("proposal", "milo", f"{rol}-alpha.webm")
            doel = pad("proposal", "milo", f"{rol}-alpha-{maat}.webm")
            if not os.path.exists(doel):
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-c:v", "libvpx-vp9", "-i", bron, "-vf", f"scale={maat}:{maat}:flags=lanczos",
                                "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", str(crf), "-row-mt", "1",
                                "-deadline", "good", "-cpu-used", "2", "-an", doel], check=True)
                print(f"milo   {os.path.relpath(doel, PUBLIC)}  {os.path.getsize(doel) // 1024} KB")
            doel = pad("proposal", "milo", f"{rol}-alpha-{maat}.mov")
            if not os.path.exists(doel):
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-c:v", "libvpx-vp9", "-i", bron, "-vf", f"scale={maat}:{maat}:flags=lanczos,format=bgra",
                                "-c:v", "hevc_videotoolbox", "-alpha_quality", "0.6", "-q:v", str(q), "-tag:v", "hvc1", "-an", doel], check=True)
                print(f"milo   {os.path.relpath(doel, PUBLIC)}  {os.path.getsize(doel) // 1024} KB")


if __name__ == "__main__":
    stappen = {"gezichten": gezichten, "logos": logos, "posters": posters, "milo": milo, "films": films}
    for naam in (sys.argv[1:] or stappen.keys()):
        stappen[naam]()
