"""TT Norms met losse letters, inclusief de Apple/Safari-vormregels.

Gebruik: python3 scripts/lettertypes-zonder-ligaturen.py (fontTools en brotli).
Glyphs, breedtes, kerning en cijferinstellingen blijven behouden.
"""
from pathlib import Path

from fontTools.ttLib import TTFont

MAP = Path(__file__).resolve().parent.parent / "proposal" / "fonts"

for gewicht in ("Light", "Regular", "Medium", "Bold"):
    for extensie in ("otf", "woff2"):
        pad = MAP / f"TTNorms-{gewicht}.{extensie}"
        font = TTFont(pad, recalcTimestamp=False)
        gewijzigd = False
        if "morx" in font:
            for chain in font["morx"].table.MorphChain:
                losse_letters = [s for s in chain.MorphSubtable if s.MorphType != 2]
                if len(losse_letters) != len(chain.MorphSubtable):
                    chain.MorphSubtable = losse_letters
                    chain.MorphSubtableCount = len(losse_letters)
                    gewijzigd = True
        if gewijzigd:
            font.save(pad)
            print(f"{pad.name}: Apple-ligaturen verwijderd")
