# Card art NOTICE

## What

Files under `public/card-art/*.webp` are **original** AI-generated dark-fantasy card portraits created for GwentDeck. They are **not** scans, extracts, or lookalike rips of CD PROJEKT RED / Witcher Wiki / official Gwent card art.

Each file is named `{catalogue-card-id}.webp` and matches one identity in `src/data/catalogue.json`.

## License

**CC0 1.0 Universal** — see `public/card-art/LICENSE`.

To the extent possible under law, the GwentDeck project dedicators waive all copyright and related rights to these generated raster assets so they can ship alongside the MIT-licensed application without conflicting terms.

## Trademarks / lore

Card **names**, faction identities, and lore references remain trademarks / IP of their respective owners (including CD PROJEKT S.A. and literary rights holders). This NOTICE does **not** grant trademark rights. GwentDeck is an unofficial fan work and is not approved or endorsed by CD PROJEKT RED.

## Pipeline

- Prompts: `scripts/card-art/prompts.json` (v2: per-card visual hints + tight portrait framing; rebuild via `npm run art:rebuild-prompts`)
- Optimize: `scripts/card-art/optimize.py` (Pillow → WebP ≤384×512, quality ~78; default src `/opt/cursor/artifacts/assets-v2`)
- No Git LFS required at current sizes (~30–45 KB per card)

## Attribution (optional)

CC0 does not require attribution. If you credit the set, “GwentDeck original AI card art (CC0)” is enough.
