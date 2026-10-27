# AGENTS.md — Rules for contributors and coding agents

This repository is **GwentDeck**: a free, static TW3 Gwent collection manager and deck optimiser.

## Mandatory rules (18)

1. **TW3 minigame only** — Never mix in standalone GWENT (CDPR) cards, provisions, or meta.
2. **No invented mechanics** — Deck rules and card stats must come from cited sources; if unsure, mark unknown and refuse to guess in UI copy.
3. **Legal decks only** — Recommendations may only include cards the user owns; never silently add unowned cards.
4. **Explain recommendations** — Every generated deck must include human-readable reasons and missing-card gaps.
5. **Client-only** — No backend, accounts, hosted DB, analytics, or paid APIs.
6. **localStorage persistence** — Collection/decks must be versioned and schema-validated; support import/export.
7. **Static GitHub Pages** — `base: '/gwentdeck/'`, `HashRouter`, Actions-based Pages deploy.
8. **MIT license** — Keep `LICENSE` accurate; attribute third-party data (wiki CC BY-SA for names/stats).
9. **No copyrighted art redistribution** — Do not vendor wiki/game textures. Original CC0 AI art under `public/card-art/` is allowed (ADR-008); CSS faces remain the mandatory fallback; optional user-local image URLs stay in the browser only.
10. **TypeScript strict** — No `any` escapes for catalogue/engine paths; prefer Zod at persistence boundaries.
11. **Tests for engines** — Legality and recommender changes require unit tests; do not ship placeholder optimisers.
12. **Simplicity** — No Docker/K8s/auth/feature flags; prefer readable pure functions in `src/domain/`.
13. **Do not mark PLAN items done until verified** — Checklists in `PLAN.md` stay unchecked until tested.
14. **Record decisions** — Non-trivial choices go in `DECISIONS.md` (ADR style).
15. **Faction completeness** — Catalogue must cover NR, NG, ST, Monsters, Skellige, Neutrals, HoS, BaW.
16. **Accessibility** — Interactive controls need labels; keyboard operable; do not rely on colour alone for owned/missing state.
17. **Safe defaults** — Balanced strategy is default; destructive actions (reset collection) require confirmation.
18. **Honest status** — Never claim Pages/deploy/auth success without verification; document remaining owner steps.

## Working agreements

- Prefer small PRs focused on catalogue, engine, or UI — not all three at once when avoidable.
- Keep `catalogue.json` as the single source of card truth; UI must not hardcode card lists.
- When scraping or importing data is tempting: **don't** if it violates site ToS; use already-published open datasets and cite them.
- npm is the package manager for this repo (`package-lock.json` is canonical).

## Out of scope for agents

- Claiming GitHub username without `gh api user`.
- Pushing to branches you did not create (except as directed).
- Adding tracking pixels, ads, or external font CDNs that phone home beyond documented needs.
