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

## ADR-008: Card art — CSS faces + optional local user images only

- **Status:** Accepted
- **Context:** Users asked for card images / “similar” web art. CDPR Gwent art and most wiki/fan assets are not clearly redistributable; scraping or vendoring lookalikes would violate AGENTS.md / PLAN non-goals.
- **Decision:**
  1. Keep **CSS / procedural** card faces as the default (enriched with faction bands, metal strength disc, leather-style grain).
  2. Support **optional user-supplied** image URLs (`https` / `http` / `data:image/…`) stored separately in `localStorage` (`gwentdeck.imageOverrides.v1`), never in `catalogue.json` or the repo.
  3. Do **not** hotlink community CDNs, scrape fandom, or ship any third-party card art.
- **Consequences:** Default UX stays fully offline and legally conservative. Power users who own rights can map images locally via My Collection import; the app does not vouch for those assets.

## ADR-009: Dark Witcher 3–branded UI tokens

- **Status:** Accepted
- **Context:** Feedback that the light parchment look did not feel TW3-branded.
- **Decision:** Charcoal/near-black surfaces, bronze/gold accents, restrained crimson, self-hosted Cormorant Garamond + Source Sans 3 variables, leather noise texture via CSS/SVG; nav labels Dashboard / Card Library / My Collection / Deck Optimiser; Optimiser uses explicit Generate + Auto faction.
- **Consequences:** Stronger brand signal without purple-gradient AI clichés; Pages assets change on next deploy after merge.
