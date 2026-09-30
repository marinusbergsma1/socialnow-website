# 30 september 2026 (Marinus: "WIL ECHT INSTANT LOADING"). Maakt van de drie TT Norms-OTF's (samen 460 KB, 169 KB over
# de lijn) woff2-bestanden zonder het Cyrillisch, dat op de site niet voorkomt. Alle andere tekens blijven: Latijn met
# accenten (namen als Łukasz of Şahin), leestekens, euro, pijlen en wiskundige tekens.
#
# Wat hetzelfde blijft: elke Latijnse glyph, elke breedte, alle kerning en de Apple-vormregels. TT Norms kernt in
# twee lagen: een lijst paren (formaat 0) en een klassentabel (Apple-formaat 2) met onder meer T en t voor a, c, e,
# o en s. Daarnaast zet de morx-tabel standaard ligaturen en tabelcijfers aan in shapers die Apple-tabellen lezen.
# fontTools kan die tabellen niet subsetten en laat ze vallen. Daarom houden we alle glyphs behalve de Cyrillische
# (ook de alternatieven en ligaturen zonder eigen teken), houden we de glyphnummers gelijk (retain_gids) en zetten
# we de klassentabel, morx en feat byte voor byte terug; de nummers waar ze naar wijzen kloppen dan nog.
#
# Gebruik (fontTools en brotli nodig): python3 scripts/lettertypes-subset.py
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables.DefaultTable import DefaultTable

MAP = Path(__file__).resolve().parent.parent / "proposal" / "fonts"
CYRILLISCH = range(0x400, 0x530)

for gewicht in ("Regular", "Medium", "Bold"):
    bron = MAP / f"TTNorms-{gewicht}.otf"
    doel = MAP / f"TTNorms-{gewicht}.woff2"
    origineel = TTFont(bron)
    klassentabellen = [t for t in origineel["kern"].kernTables if not hasattr(t, "kernTable")]
    ruw = {tag: origineel.reader[tag] for tag in ("morx", "feat") if tag in origineel.reader}
    tekens = [cp for cp in origineel.getBestCmap() if cp not in CYRILLISCH]
    cyrillisch = {g for cp, g in origineel.getBestCmap().items() if cp in CYRILLISCH}
    elders = {g for cp, g in origineel.getBestCmap().items() if cp not in CYRILLISCH}
    houden = [g for g in origineel.getGlyphOrder() if g not in cyrillisch or g in elders]

    opties = subset.Options()
    opties.unicodes = tekens
    opties.layout_features = ["*"]
    opties.name_IDs = ["*"]
    opties.name_languages = ["*"]
    opties.retain_gids = True
    opties.notdef_outline = True
    opties.flavor = "woff2"
    lettertype = TTFont(bron)
    subsetter = subset.Subsetter(opties)
    subsetter.populate(glyphs=houden, unicodes=opties.unicodes)
    subsetter.subset(lettertype)
    lettertype["kern"].kernTables.extend(klassentabellen)
    for tag, data in ruw.items():
        tabel = DefaultTable(tag)
        tabel.data = data
        lettertype[tag] = tabel
    lettertype.flavor = "woff2"
    lettertype.save(doel)
    print(f"{doel.name}: {doel.stat().st_size} bytes (was {bron.stat().st_size})")
