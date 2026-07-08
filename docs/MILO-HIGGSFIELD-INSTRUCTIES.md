# 🤖 Milo × Higgsfield — de standaard-pijplijn voor de mascotte

Complete instructie voor het aansturen van **Milo** (de zilveren retro-robot met
teal oogjes) in **Higgsfield**: van beeld tot geanimeerde loop op de website.
Dit is de bewezen werkwijze — volg 'm exact zodat elke Milo identiek en on-brand
blijft.

> **Bron van waarheid (de sheet):**
> `/Volumes/T7/02-SOCIALNOW/BRANDING/MILO MASCOTTE/MILO AVATARSHEET 2K DEF.png`
> Higgsfield media_id: `5b9b0454-10d8-4abc-b742-7d5748f20fb0`
> Uitwerkingen staan in submappen: `MILO LERAAR/`, `MILO TUINIER/`, `MILO MOTOR/`.

---

## 0. De gouden regels (hier draait alles om)

1. **De sheet is heilig.** Elke render gebruikt de avatarsheet als referentie én
   een prompt die begint met *"STRICT CHARACTER CONSISTENCY TASK. Reproduce the
   robot mascot from the reference sheet EXACTLY…"*. Zonder die twee dingen
   drift het model weg van het karakter.
2. **Reflectie hard begrenzen.** gpt_image_2 tekent standaard een lange
   spiegelvloer; de sheet heeft slechts een **kort, subtiel plasje** onder de
   voeten. Vraag daar expliciet om, en **kap de reflectie desnoods in
   nabewerking af** (ffmpeg `drawbox`) — dat is de enige manier om ze allemaal
   gelijk te krijgen.
3. **Milo mag NOOIT buiten het frame.** In élke video-prompt afdwingen: hij
   verlaat het beeld nooit, wordt nergens afgesneden, en landt na een sprong
   altijd volledig in beeld. Idem voor rekwisieten (plant, gieter, stok).
4. **Milo verandert nooit van grootte** binnen een animatie — hij krimpt of
   groeit niet mee met wat er om hem heen gebeurt.
5. **Puur zwarte achtergrond**, altijd — want de video wordt later transparant
   gemaakt (zie §4) en op tekst geplaatst.

---

## 1. Stap 1 — Startbeeld genereren (gpt_image_2)

**Model:** `gpt_image_2` (in de chat "image2.0" genoemd) — hoogste
karakterconsistentie, ondersteunt `quality: high`.

**Prompt-skelet:**
```
STRICT CHARACTER CONSISTENCY TASK. Reproduce the robot mascot from the reference
sheet EXACTLY: identical proportions, identical rounded chrome body panels,
identical head shape with small antenna ball, identical side ear-discs, identical
dark visor with happy curved glowing teal eyes, identical brushed-metal material
with subtle retro CRT scanline texture.

Now posed as [ROL/SCÈNE — bijv. a cheerful GARDENER kneeling, planting a seedling].
[Eventuele extra props/kleding — bijv. green denim overalls (#25D366 tint)].

Pure black background. Match the reference sheet's ground treatment exactly: only
a very faint, short, soft reflection directly under him — NOT a long mirror
reflection. Nothing else in frame besides [de props]. Full body visible, centered.
```

**Parameters:**
```json
{ "model": "gpt_image_2",
  "medias": [{ "value": "5b9b0454-10d8-4abc-b742-7d5748f20fb0", "role": "image" }],
  "aspect_ratio": "1:1",   // of "16:9" voor brede scènes (motor)
  "count": 4,              // 4 varianten → laat de klant kiezen
  "quality": "high" }
```

**Tip — kopruimte inbouwen.** Groeit er iets omhoog (plant)? Zet Milo klein
**onderin** met veel zwarte ruimte erboven, zodat het element kan groeien zonder
de bovenrand te raken. Dat doe je met een ffmpeg-compositie op het gekozen
startbeeld:
```bash
ffmpeg -i milo.png -vf "scale=560:560,pad=1024:1024:232:454:black" milo-headroom.png
```

**Kleur-varianten (bijv. rode motor):** genereer eerst neutraal, en pas dan de
kleur aan met een gerichte edit-prompt op dat beeld:
> *"Keep this exact image UNCHANGED … ONLY CHANGE: the motorcycle's painted body
> parts become glossy RACING RED (#D62828) … Nothing else changes."*

---

## 2. Stap 2 — Altijd eerst ter controle voorleggen

Genereer **4 varianten**, download ze en leg ze naast elkaar voor aan Marinus
vóór je animeert. Hij let streng op: proporties, reflectie-lengte,
karaktertrouw. Pas na akkoord door naar de video.

Reflectie in nabewerking terugbrengen tot sheet-niveau (indien nodig):
```bash
# zachte band net onder de voeten, daaronder puur zwart
ffmpeg -i milo.png -vf "drawbox=x=0:y=800:w=1024:h=60:color=black@0.65:t=fill,\
drawbox=x=0:y=860:w=1024:h=164:color=black:t=fill" milo-DEF.png
```
Centreren in het vlak indien gewenst:
```bash
ffmpeg -i milo-DEF.png -vf "scale=iw*0.78:-1,pad=1024:1024:270:112:black" milo-CENTERED.png
```

---

## 3. Stap 3 — Animeren (Seedance 2.0)

**Model:** `seedance_2_0` — acties **in tekst beschrijven**, géén extra
reference-frames voor tussenposes (dat geeft layout-drift). Het goedgekeurde
beeld gaat als `start_image` mee.

**Uploaden + genereren:**
```
1. media_upload (filename) → curl PUT naar upload_url → media_confirm (type image)
2. generate_video met dat media_id als start_image
```

**Prompt-skelet voor een loop:**
```
Camera completely static and locked off, pure black background. [Milo]
keeps EXACTLY THE SAME SIZE the entire time and stays fully inside the frame —
never leaves the frame, never gets cut off.

[Actie-sequentie, stap voor stap …]. Any growing element (plant) grows but its
top ALWAYS stays comfortably inside the frame with a clear margin, never touching
the top edge. After a jump/hop he lands WELL WITHIN the frame, fully visible.

At the END, [eind-pose — bijv. he looks up at the plant and holds still], so it
can either loop or stay frozen. No camera movement, no zoom, no pan. Character
stays perfectly on-model.
```

**Parameters:**
```json
{ "model": "seedance_2_0",
  "medias": [{ "value": "<start_image_id>", "role": "start_image" }],
  "aspect_ratio": "1:1",
  "duration": 8,
  "declined_preset_id": "<id>" }   // zie hieronder
```

**Preset-melding:** Seedance stelt soms een "preset" voor (bijv. "IN THE DARK",
"EXIT THE DREAM"). Wij willen **letterlijk** genereren, dus geef in de retry het
voorgestelde `preset_id` mee als **`declined_preset_id`**.

**Kosten:** een 8s-clip ≈ 36 credits, 12s ≈ 54. Check vooraf met
`get_cost: true`. Op = wachten tot bijgevuld.

---

## 4. Stap 4 — Web-integratie (transparant, op tekst)

### 4.1 Encoden: écht alpha-kanaal
Milo staat vaak **op tekst**. Een gewone mp4 met screen-blend werkt niet overal
(het zwarte blok wordt zichtbaar tegen watermark-woorden). Oplossing: een
**VP9-alpha `.webm`** (zwart weggekeyd) met een **`.mp4`-fallback**:
```bash
# transparante webm (zwart → transparant)
ffmpeg -i raw.mp4 -vf "colorkey=0x000000:0.12:0.09,format=yuva420p" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 33 -an milo.webm
# mp4-fallback (web-geoptimaliseerd, geen audio)
ffmpeg -i raw.mp4 -c:v libx264 -crf 24 -preset slow -an -movflags +faststart \
  -pix_fmt yuv420p milo.mp4
```
Controleer de alpha door de webm over een felle kleur te leggen:
```bash
ffmpeg -c:v libvpx-vp9 -ss 6 -i milo.webm -f lavfi -i "color=magenta:s=720x720:d=1" \
  -filter_complex "[1:v][0:v]overlay=shortest=1,scale=420:-2" -frames:v 1 check.png
```

### 4.2 De `.sn-milo` conventie (index.css)
```html
<div class="sn-milo relative w-40 md:w-80 lg:w-[26rem]">
  <video muted playsInline preload="metadata">
    <source src="/video/milo-x.webm" type="video/webm" />
    <source src="/video/milo-x.mp4"  type="video/mp4" />
  </video>
</div>
```
De klasse doet twee dingen:
- **`mix-blend-mode: screen`** op de video → zwart is transparant, mag óp tekst.
- **VHS-scanlines als MASK op de videopixels zelf** (niet als losse overlay met
  `multiply` — die verdonkert het hele vlak tot een zichtbaar blok).

> ⚠️ **Zet GEEN `position` in de `.sn-milo`-CSS-klasse** — dat overschrijft
> Tailwind's `absolute`/`relative` (utilities komen eerder in de bundel). Zet de
> positie in de markup.

### 4.3 Plaatsing zonder afsnijden
Groeit er iets boven de sectie uit (plant op een letter)? Zet de sectie op
**`[overflow-x:clip] [overflow-y:visible]`** (niet `overflow-hidden` — dat snijdt
verticaal af) en verwijder een `border-t` die een zichtbare edge dwars door Milo
zou trekken.

### 4.4 Afspeelgedrag
- **Continue loop:** `loop`-attribuut op de video.
- **Eén keer, dan stilstaan + reset bij wegscrollen:** een
  `IntersectionObserver` die bij `isIntersecting` één keer `play()` doet en bij
  verlaten `pause()` + `currentTime = 0` (zoals `MiloPlant` in `ShortContent`).
  Zo eindigt hij op zijn eind-pose en kan de klant zelf kiezen loop-of-stil.
- **Loop met pauze:** speel af, en herstart via `onEnded` met een
  `setTimeout(…, 15000)` (zoals de FAQ-leraar oorspronkelijk deed).

---

## 5. Volledige checklist (beeld → live)

- [ ] Sheet als reference + "STRICT CHARACTER CONSISTENCY"-prompt
- [ ] Puur zwarte achtergrond, korte reflectie (of in post afgekapt)
- [ ] Kopruimte ingebouwd als er iets omhoog groeit
- [ ] 4 varianten gegenereerd en **ter controle voorgelegd**
- [ ] Seedance-prompt: Milo blijft in beeld, zelfde grootte, duidelijke eind-pose
- [ ] `declined_preset_id` meegegeven bij een preset-melding
- [ ] Geëncodeerd naar alpha-`.webm` + `.mp4`-fallback, alpha gecontroleerd
- [ ] In `.sn-milo`-wrapper, positie in de markup, geen afsnijdende overflow
- [ ] Afspeelgedrag gekozen (loop / eenmalig / loop-met-pauze)
- [ ] Op de live site geverifieerd (hard refresh) — geen zwart blok, niet afgesneden

---

## 6. Bewezen do's & don'ts (uit de praktijk)

| ✅ Do | ❌ Don't |
|---|---|
| Reflectie in post afkappen tot sheet-niveau | Vertrouwen dat de prompt de reflectie kort houdt |
| Milo klein onderin bij groei-scènes | Milo groot centreren en hopen dat de plant past |
| Alpha-webm voor Milo op tekst | Screen-blend mp4 (zwart blok tegen watermarks) |
| Positie in de markup | `position` in de `.sn-milo`-CSS |
| `overflow-x:clip / overflow-y:visible` | `overflow-hidden` op de sectie (snijdt de plant af) |
| Acties in de Seedance-tekst beschrijven | Reference-frames voor tussenposes (layout-drift) |
| Expliciet "stays inside the frame" | Aannemen dat het model binnen de rand blijft |
```
