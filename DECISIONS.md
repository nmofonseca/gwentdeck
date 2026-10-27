# Architecture Decision Records

## ADR-001: HashRouter + `/gwentdeck/` base

- **Status:** Accepted
- **Context:** GitHub Pages project sites do not support SPA history fallbacks without a `404.html` hack.
- **Decision:** Use React Router `HashRouter` and Vite `base: '/gwentdeck/'`.
- **Consequences:** URLs look like `/gwentdeck/#/collection`; deep links work without server config.

## ADR-002: CSS card faces, no vendored art

- **Status:** Accepted
- **Context:** Wiki and game card images are copyrighted / unclear to redistribute.
- **Decision:** Render cards with CSS (faction colour, strength, ability badges). Link to sources in About for reference only.
- **Consequences:** Less flashy; legally safer; works offline fully.

## ADR-003: Catalogue as static JSON with maxCopies

- **Status:** Accepted
- **Context:** TW3 has multiple physical copies of some cards (e.g. 3× Decoy).
- **Decision:** One catalogue entry per distinct card identity; `maxCopies` caps owned quantity.
- **Sources:** wjsutton Gwent CSV (fandom-derived stats), gwentcards acquisition list, witcherworkshop cross-check.
- **Consequences:** Collection is `Record<id, qty>`; muster/bond grouping via optional fields.

## ADR-004: Stage A heuristic recommender first

- **Status:** Accepted
- **Context:** Full search/synergy optimisation is unbounded; users need a useful legal deck ASAP.
- **Decision:** Score owned candidates (strength, hero, spy, medic, muster/bond density, special utility), enforce legality, prefer lean ~22–25 unit decks. Strategies adjust weights.
- **Consequences:** Not a perfect solver; explanations map to score features. Synergy pass can deepen later without API changes.

## ADR-005: Zod-validated versioned localStorage

- **Status:** Accepted
- **Context:** Corrupt or older saves must not crash the app.
- **Decision:** `COLLECTION_SCHEMA_VERSION`; parse with Zod; on failure, keep backup key and start fresh with user-visible warning.
- **Consequences:** Import/export uses the same schema.

## ADR-006: npm (not pnpm/yarn)

- **Status:** Accepted
- **Context:** CI and Pages Action ubiquity; avoid extra package-manager setup in bare images.
- **Decision:** npm with `package-lock.json`.
- **Consequences:** Contributors should use npm for lockfile stability.

## ADR-007: oxlint + Prettier (no heavy ESLint flat rewrite)

- **Status:** Accepted
- **Context:** Vite template shipped oxlint; keep lint fast.
- **Decision:** oxlint for lint; Prettier for format; eslint-config-prettier available if ESLint is added later.
- **Consequences:** Slightly different rule set than classic ESLint; acceptable for this app size.
