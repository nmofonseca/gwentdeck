# GwentDeck original card art

One WebP portrait per catalogue card id (`{id}.webp`).

- **License:** CC0 1.0 — see `LICENSE` and root `NOTICE-ART.md`
- **Not** official CDPR / Witcher Wiki art
- Dimensions: ≤384×512 (3:4), quality ~78
- **v2:** subject-faithful prompts + `GwentCard` uses matching `aspect-[3/4]` framing
- Regenerate prompts: `npm run art:rebuild-prompts`
- Optimize: `npm run art:optimize` (expects JPGs in `/opt/cursor/artifacts/assets-v2`)

UI loads these through `cardArtPath()` with CSS fallback (`GwentCard`).
