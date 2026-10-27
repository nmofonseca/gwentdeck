# Architecture Decision Records

## ADR-001: HashRouter + `/` base (custom domain)

- **Status:** Accepted (supersedes `/gwentdeck/` project-path base)
- **Context:** GitHub Pages project sites do not support SPA history fallbacks without a `404.html` hack. With custom domain `gwentbuilder.devopsplays.top`, Pages serves the artifact at the apex (`/`), not under `/gwentdeck/`. A `/gwentdeck/` Vite base made root HTML request assets that 404'd.
- **Decision:** Use React Router `HashRouter` and Vite `base: '/'`. Publish `public/CNAME` (`gwentbuilder.devopsplays.top`). Keep HashRouter for deep links without server rewrites.
- **Consequences:** Canonical URL is `https://gwentbuilder.devopsplays.top/#/…`. `https://nmofonseca.github.io/gwentdeck/` continues to **301** to the custom-domain apex while the custom domain is configured (GitHub Pages enforce-HTTPS / custom-domain redirect).

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

## ADR-008: Original CC0 AI card art, CSS fallback, optional local overrides

- **Status:** Accepted
- **Context:** ADR-002 barred vendoring wiki/game textures. Research found no free redistributable TW3 face set. Users also want portraits and optional personal image maps without scraping CDPR/wiki lookalikes.
- **Decision:**
  1. Ship one **original AI illustration** per catalogue `id` under `public/card-art/{id}.webp` (dark fantasy, faction-tinted, not CDPR compositions), dedicated **CC0 1.0** (`public/card-art/LICENSE` + root `NOTICE-ART.md`).
  2. `GwentCard` loads user `imageUrl` override when set, otherwise `cardArtPath(id)`; on load error, fall back to **CSS / procedural** faces (faction bands, metal strength disc, leather grain).
  3. Support **optional user-supplied** image URLs (`https` / `http` / `data:image/…`) in `localStorage` (`gwentdeck.imageOverrides.v1`), never in `catalogue.json`.
  4. Do **not** hotlink community CDNs, scrape fandom, or ship third-party copyrighted card art. Keep the unofficial CDPR fan disclaimer.
- **Consequences:** Repo grows by ~N×35KB WebP files (no LFS at current size). Prompt/optimize scripts live in `scripts/card-art/`. Power users can still map personal images; the app does not vouch for those assets.
- **Supersedes (partially):** ADR-002’s “CSS only” presentation — CSS remains the mandatory fallback, not the sole face.

## ADR-009: Dark Witcher 3–branded UI tokens

- **Status:** Accepted
- **Context:** Feedback that the light parchment look did not feel TW3-branded.
- **Decision:** Charcoal/near-black surfaces, bronze/gold accents, restrained crimson, self-hosted Cormorant Garamond + Source Sans 3 variables, leather noise texture via CSS/SVG; nav labels Dashboard / Card Library / My Collection / Deck Optimiser; Optimiser uses explicit Generate + Auto faction.
- **Consequences:** Stronger brand signal without purple-gradient AI clichés; Pages assets change on next deploy after merge.

## ADR-010: Pin GitHub Actions to commit SHAs + least privilege

- **Status:** Accepted
- **Context:** Workflows used mutable tags (`@v4` / `@v3`), CI had no explicit `permissions` / concurrency, and Pages jobs inherited broad workflow token scopes.
- **Decision:**
  1. Pin official `actions/*` to full commit SHAs with version-tag comments (verified via `git ls-remote` / GitHub Releases).
  2. CI: `permissions: contents: read`; concurrency cancel-in-progress per ref; keep `pull_request` (not `pull_request_target`); no secrets.
  3. Pages: keep `contents: read` + `pages: write` + `id-token: write`; narrow build to `contents: read` and deploy to `pages`/`id-token`; `cancel-in-progress: false` so deploys are not interrupted.
  4. Prefer current maintained majors (`checkout`/`setup-node` v7, Pages artifact/deploy v5) without changing CI steps (lint/test/build remain identical).
- **Consequences:** Tag moves no longer silently change runner code; token blast radius is smaller. Owners should still treat the `github-pages` Environment as the deploy gate (optional required reviewers / wait timer). Re-pin SHAs when bumping action versions.
- **Environment note:** Restrict who can approve `workflow_dispatch` / Environment deploys in repo Settings → Environments → `github-pages` if extra human gate is desired.

## ADR-011: Experimental Gwent tavern-table UI theme

- **Status:** Experimental (branch `experiment/ui-gwent-table` only — not default on `main`)
- **Context:** Explore an immersive alternate skin that feels like sitting at the in-game TW3 Gwent board, without replacing the accepted charcoal/leather ADR-009 baseline until reviewed.
- **Decision:** Theme tokens + CSS primitives lean into dark wood tabletop, restrained felt/green play-surface accents, carved wood panel frames, candlelight warm highlights, and physical-card chrome on `GwentCard` (`.gwent-card-face`). Keep fonts and client-only architecture unchanged.
- **Consequences:** Visual experiment only; compare via draft PR screenshots. Merge to `main` only if chosen as the new default (would supersede parts of ADR-009 presentation).