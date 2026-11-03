# Game card faces — credits and rights

Game artwork from **The Witcher 3: Wild Hunt**, © **CD PROJEKT RED / CD PROJEKT S.A.**
and the respective creators. The Witcher and Gwent names and marks belong to their
respective rights holders. Individual artists have not been reliably identified
per image; no individual artist attribution is inferred.

Card-image source: **Gwent Classic**, by **Arun Sundaram**:
https://github.com/asundr/gwent-classic
Pinned revision: `08592d847f2573440a34deb9f32bc855b2544cdd`.
Full per-image paths are in `sources.json` next to this notice.

Images were converted from JPEG to WebP (quality 92). Some leader mappings were
corrected by the names printed on the card faces. No card statistics or mechanics
are imported from the source project.

The upstream repository's LICENSE identifies MIT with the Commons Clause v1.0
condition. Its text is preserved verbatim in `LICENSE.upstream.txt`. That software
notice does not establish a grant from CD PROJEKT RED for the underlying game art.
These card faces are **not CC0** and are **not covered by GwentDeck's MIT code
licence**. GwentDeck claims no ownership of this artwork or ability to relicense it.

This is a free, noncommercial, unofficial fan website, not approved or endorsed by
CD PROJEKT RED. See CD PROJEKT RED's Fan Content Guidelines:
https://www.cdprojektred.com/en/fan-content
Attribution is not a claim of endorsement or a separately negotiated permission.

---

## Retained original AI portrait set

# Original AI portrait NOTICE

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
