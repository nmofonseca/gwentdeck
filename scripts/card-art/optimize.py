#!/usr/bin/env python3
"""Convert generated card art to optimized webp under public/card-art/."""
from __future__ import annotations
import argparse, json, shutil
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "card-art"
PROMPTS = Path(__file__).resolve().parent / "prompts.json"

def optimize(src: Path, dest: Path, max_w=384, max_h=512, quality=78) -> int:
    im = Image.open(src).convert("RGB")
    im.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=quality, method=6)
    return dest.stat().st_size

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src-dir", type=Path, required=True, help="Dir of raw images named {id}.jpg/.png")
    ap.add_argument("--ids", nargs="*", help="Optional id filter")
    args = ap.parse_args()
    ids = set(args.ids) if args.ids else None
    total = 0
    count = 0
    for p in sorted(args.src_dir.iterdir()):
        if p.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        card_id = p.stem
        if ids and card_id not in ids:
            continue
        size = optimize(p, OUT / f"{card_id}.webp")
        total += size
        count += 1
        print(f"{card_id}: {size}")
    print(f"DONE count={count} bytes={total}")

if __name__ == "__main__":
    main()
