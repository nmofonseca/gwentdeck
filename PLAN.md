# GwentDeck — Project Plan

Free, open-source collection manager and intelligent deck optimiser for **The Witcher 3: Wild Hunt** Gwent minigame (not standalone GWENT).

## Goals

- Browse a verified TW3 Gwent card catalogue (all five factions + neutrals + HoS/BaW).
- Track owned card quantities in browser `localStorage` (versioned, validated, import/export).
- Generate **legal** decks from owned cards only, with explanations and missing-card guidance.
- Static site on GitHub Pages at `/gwentdeck/` — no accounts, backend, hosted DB, or paid APIs.

## Non-goals

- Standalone CDPR GWENT client/metagame.
- Multiplayer, accounts, cloud sync, analytics/tracking.
- Hosting third-party copyrighted card art (original CC0 AI art + CSS fallback is OK; optional user-local images only — see ADR-008; no wiki/game rips).- Docker/K8s/auth infrastructure.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| UI | Vite + React 19 + TypeScript (strict) | Fast static builds, typed catalogue/engines |
| Routing | React Router `HashRouter` | Works on GitHub Pages without server rewrites |
| Style | Tailwind CSS v4 | Utility styling without a design-system tax |
| Icons | Lucide | Lightweight, MIT |
| Validation | Zod | Runtime schemas for collection/deck persistence |
| Unit tests | Vitest + Testing Library | Fast engine/UI tests |
| E2E | Playwright | Pages smoke + critical flows |
| Package manager | npm + lockfile | Universal CI; no pnpm store assumptions |

## Architecture

```
src/
  data/catalogue.json     # Verified card catalogue
  domain/                 # Types, schemas, legality, recommender (pure)
  persistence/            # localStorage versioned store
  components/             # CSS cards, layout, shared UI
  pages/                  # Catalogue, Collection, Optimiser, Decks, About
  App.tsx                 # HashRouter routes
```

- **Catalogue**: static JSON, validated at load; sources cited in file + docs.
- **Collection**: `{ version, owned: Record<cardId, qty>, savedDecks[] }` in `localStorage`.
- **Legality**: TW3 rules — 1 leader, ≥22 units (heroes count), ≤10 specials (weather included), faction+neutral only.
- **Recommender**: Stage A heuristic (strength, heroes, spies, medics, bonds/muster, specials); strategy presets (Balanced default, Aggressive, Control, Synergy).

## Research summary (TW3 minigame)

Sources cross-checked (no invented mechanics):

- Deck: 1 Leader; ≥22 Unit cards (incl. Heroes); 0–10 Special cards (Weather + Decoy/Horn/Scorch/Mardroeme).
- Factions: Northern Realms, Nilfgaard, Scoia'tael, Monsters, Skellige (+ Neutral).
- Expansions: base + Hearts of Stone + Blood and Wine (Skellige).
- Catalogue built from community CSV (fandom-derived stats) + gwentcards acquisition metadata + witcherworkshop cross-check (~181 collectible named cards; our JSON collapses copies into `maxCopies`).

## Checklist

### Foundation

- [x] Environment (Node, npm)
- [ ] GitHub auth + `gwentdeck` repo create/push
- [x] `PLAN.md` / `AGENTS.md` / `DECISIONS.md` / `README.md` / `LICENSE` / `.gitignore`
- [x] Vite+React+TS+Tailwind+Router scaffold
- [x] Vitest + Playwright + ESLint/oxlint + Prettier config
- [x] CI + Pages workflow files added (not yet green on GitHub — unpublished)
- [ ] Live Pages URL verified

### Catalogue

- [x] Schema + `catalogue.json` with factions, leaders, rows, strength, abilities, acquisition, expansion
- [x] Validation on load
- [x] Automated coverage tests (faction/leader counts); manual wiki spot-check still welcome

### Collection

- [x] Mark owned quantities (0…maxCopies)
- [x] Persist across refresh (versioned localStorage)
- [x] Import / export JSON
- [x] Reset with confirm

### Optimiser

- [x] Faction + strategy selection
- [x] Legal owned-only deck generation
- [x] Leader + card list + explanations
- [x] Missing-card roadmap
- [x] Save / export deck

### Polish

- [x] a11y basics (labels, keyboard, contrast-minded theme)
- [x] Playwright e2e against preview (2 smoke tests)
- [x] About/legal/credits
- [ ] Production deploy verified

## Definition of Done (initial release)

Users can visit the Pages URL; browse catalogue; mark owned quantities; persist across refresh; pick a faction; generate a legal owned-only deck; see list/leader/explanations/missing cards; save/export collection & decks — with no account/server/paid service.

## Risks / blockers

| Risk | Mitigation |
| --- | --- |
| GitHub auth unavailable in agent | Build fully offline; retry `gh auth`; document owner steps |
| Card art rights | CSS-only card faces; cite wiki for names/stats (CC BY-SA attribution) |
| Catalogue gaps | Document sources; validation tests; never invent mechanics |

## Implementation order (status)

1. Environment + GitHub access — **in progress (auth pending)**
2. Research — **done (recorded here + catalogue sources)**
3. PLAN / AGENTS / DECISIONS — **done**
4. App foundation + tests + CI + Pages workflow — **in progress**
5. Create/publish repo — **blocked on auth**
6. Verified catalogue — **done (v1)**
7. Collection + persistence — **done**
8. Deck legality — **done**
9. Recommendation Stage A — **done**
10. Optimiser UI — **done**
11. Polish / e2e / docs — **in progress**
12. Push, deploy, verify — **blocked on auth**
