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
## ADR-012: Experimental fantasy medallion + parchment mix UI

- **Status:** Accepted (merged via #8; now default presentation on `main`)
- **Context:** User feedback preferred a mix of wolf-medallion (#5) and parchment (#6) but wanted a stronger Witcher 3 fantasy-world feel — illuminated manuscript / heraldic flourishes, wood/stone atmosphere, not generic dark SaaS. Imagery must be original (CSS/SVG/CC0 AI atmospheres), not CDPR card or character lookalikes.
- **Decision:** Hybrid theme: cold steel/silver chrome shell + parchment/ink raised panels with ornamental corner ticks; hero uses full-bleed original CC0 landscape + SVG keep silhouette + steel medallion mark; cards combine metal frame with illuminated parchment body wash. Decorative assets live under `public/atmosphere/` (CC0).
- **Consequences:** Supersedes parts of ADR-009 presentation tokens while keeping dark charcoal/bronze brand direction.

## ADR-013: Card art v2 — portrait framing + subject-faithful prompts

- **Status:** Accepted (this change set)
- **Context:** Card Library feedback: art was barely visible (CSS used a short wide strip + `object-cover` on 3:4 portraits) and many faces were hard to recognise from name/role.
- **Decision:**
  1. `GwentCard` art plane uses **`aspect-[3/4]`** (compact `16/10`) with `object-cover` + `object-[center_22%]` and a lighter bottom gradient — face/upper body stays readable.
  2. Regenerate catalogue WebPs with **v2 prompts** (`scripts/card-art/rebuild_prompts_v2.py`): per-card visual hints (e.g. white-haired witcher, Temerian king), tight portrait framing instructions, still **original** / anti-CDPR-copy constraints, **CC0**.
  3. Keep CSS fallback + optional local overrides (ADR-008).
- **Consequences:** Taller Card Library tiles; ~183 WebPs replaced in place under `public/card-art/`. Prompt rebuild is deterministic from catalogue + hint map.

## ADR-014: Card Library exclusive Row filter (Variant A)

- **Status:** Accepted
- **Context:** TW3 browse UIs expose Close / Ranged / Siege / Agile as exclusive row options. Library had Faction/Type/Expansion but no Row control; Collection remains faction-only.
- **Decision:**
  1. Add a **Row** `<select>` beside Type: `All | Close Combat | Ranged | Siege | Agile`.
  2. Filter with exclusive `card.row === selected` (Agile ≠ Close/Ranged); null-row cards (leaders/specials/weather) drop when a row is set. Type stays orthogonal.
  3. Pure helpers in `src/domain/cardFilters.ts` with unit tests; Collection unchanged (no shared filter panel).
  4. Normalize Francesca Hope of the Aen Seidhe `row` to `null` (leader ability moves agile units; she does not occupy a combat row).
- **Consequences:** Library browse matches community catalogue axes; inclusive “plays on Close” deferred to Optimiser/deck placement if needed later.

## ADR-015: Mobile / fold-cover chrome without desktop churn

- **Status:** Accepted
- **Context:** Live audit showed sticky header ~169–207px on phone/cover from wrapped nav; QtyStepper ± at 32×32; filter selects cramped under ~400px. Desktop (`md`+) was already fine.
- **Decision:**
  1. Below `md` (768px): hamburger + expandable primary nav; keep labelled links for a11y. At `md+` keep the existing horizontal Primary nav.
  2. Below ~400px: collapse Card Library secondary filters behind a disclosure; keep search visible; full-width selects when open. At ≥400px keep the existing flex-wrap filter row.
  3. QtyStepper ± hit targets `44×44` below `md`, retain `32×32` at `md+`.
  4. Cheap safe-area: `viewport-fit=cover`, sticky header `pt-[env(safe-area-inset-top)]`, footer bottom padding uses safe-area inset.
- **Consequences:** Cover/phone first paint shows cards sooner; desktop screenshots at 1280 remain visually unchanged.
