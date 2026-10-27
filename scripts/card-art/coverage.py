#!/usr/bin/env python3
"""Report catalogue vs public/card-art webp coverage."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CAT = json.loads((ROOT / "src/data/catalogue.json").read_text())
ART = ROOT / "public/card-art"

ids = [c["id"] for c in CAT["cards"]]
have = {p.stem for p in ART.glob("*.webp")}
missing = [i for i in ids if i not in have]
extra = sorted(have - set(ids))
total_bytes = sum((ART / f"{i}.webp").stat().st_size for i in ids if i in have)

print(f"catalogue={len(ids)} art={len(have & set(ids))} missing={len(missing)} extra={len(extra)}")
print(f"art_bytes={total_bytes} (~{total_bytes/1024/1024:.2f} MiB)")
if missing:
    print("MISSING:")
    for m in missing:
        print(f"  {m}")
if extra:
    print("EXTRA:")
    for e in extra:
        print(f"  {e}")
