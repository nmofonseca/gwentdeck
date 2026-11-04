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

## ADR-016: Personal full-card artwork in local development

- **Status:** Accepted for the requested local preview.
- **Context:** The owner requested more authentic artwork and screenshots without deployment.
- **Decision:** Opt-in `VITE_LOCAL_CARD_ART=true` serves personal WebPs from ignored `.local/card-art/` through development-only Vite middleware. Full faces retain their aspect ratio, borders and symbols without the portrait overlay. Explicit personal URL overrides retain priority. The desktop library uses four columns at xl widths.
- **Consequences:** Game artwork stays outside Git and production assets, preserving rule 9. Production still uses bundled original portraits. Local provenance is retained alongside the personal files. No mechanics, catalogue stats, collection data, or deployment settings change.

## ADR-017: Publish the owner-approved game card faces

- **Status:** Accepted; supersedes the local-only choice in ADR-016.
- **Context:** After reviewing the copyright discussion and local preview, the owner explicitly requested committing the new artwork and deploying it publicly, with creator/source credit.
- **Decision:** Ship all 183 full card faces in `public/card-faces/`, use them by default in development and production, and preserve the pinned per-image source map. Credit CD PROJEKT RED and respective creators for game artwork, and Gwent Classic / Arun Sundaram for the source. Include the upstream licence notice, distinguish the images from the MIT code and retained CC0 AI portraits, and keep the unofficial disclaimer. Remove the development-only artwork route and flag. Match leader image names against their embedded labels. Stretch library cards within each responsive row to align the quantity controls.
- **Consequences:** Pages now publishes the chosen card faces. This explicit owner instruction supersedes the previous no-game-textures repository restriction for these assets; it does not assert a separately negotiated art licence. No mechanics or catalogue stats change.

## ADR-018: A denser library for phone and foldable screens

- **Status:** Accepted.
- **Context:** Full-width card faces dominated narrow phone screens, and unfolded widths below 1024px still showed only two large cards.
- **Decision:** Use two columns from 360px and three from 640px, retaining four from 1280px. Collapse secondary filters below 640px. On phone widths, cap the artwork plane at 22rem and show a shorter name/strength summary; activating a card opens an accessible native dialog with the full face, description and acquisition source. Keep ownership buttons at least 44px below 768px and fit the quantity field into the available column width. Preserve equal card heights and aligned controls per row.
- **Consequences:** More cards fit on cover and unfolded displays; full details remain available by touch or keyboard. No card data or artwork changes.

## ADR-019: Consistent full card faces in generated decks

- **Status:** Accepted.
- **Context:** The optimiser stretched the leader across its whole panel, while rendering other full card faces inside short landscape compact slots.
- **Decision:** Place the leader first in the same responsive full-face gallery as the generated cards. Share phone summary and equal-height styling with the Card Library, and open full details in the existing accessible dialog. Give the deck gallery two thirds of the desktop result area and reserve the remaining third for explanations and missing-card suggestions.
- **Consequences:** Leader and other artwork have the same dimensions within each row. No recommendation, legality, ownership or export logic changes.

## ADR-020: A hardened static container for local testing

- **Status:** Accepted and verified.
- **Context:** The owner requested nerdctl instead of a GwentDeck systemd service, with a multi-stage build, Docker Hardened Images, pinned versions/digests, and a pinned Dockerfile frontend.
- **Decision:** Compile and test with DHI Node, then serve only the static build and artwork notices with DHI Nginx. Keep registry credentials outside build inputs. Use an allowlisted context, lockfile integrity checks, a non-root build user and runtime, a read-only runtime root, a limited tmpfs, dropped capabilities, no-new-privileges, resource limits and an HTTP readiness endpoint. Use Zod’s supported jitless validation mode so its optional eval probe does not violate the strict script CSP in Firefox. Keep the existing LAN port 5173 for browser/localStorage continuity. Containerd's existing rootless infrastructure remains in place.
- **Consequences:** This owner instruction supersedes the former repository restriction on Docker for this local preview. The container serves a built snapshot; source edits require rebuilding. GitHub Pages and application data/logic remain unchanged.
- **Verification:** The container build passed lint, all 27 unit tests and the production build. Chrome and Firefox passed desktop, phone and foldable viewport checks; localhost/LAN HTTP, artwork integrity, actual runtime restrictions and stop/start were verified. The former transient `gwentdeck-preview.service` was already absent, with no persistent unit file to delete. The replacement container is running on port 5173.

## ADR-021: Deploy Pages only for published-site inputs

- **Status:** Accepted.
- **Context:** The owner requested that container and repository documentation changes stop causing unnecessary GitHub Pages deployments.
- **Decision:** Use GitHub's native `push.paths` allowlist, alongside the existing `main` branch restriction, for `src/**`, `public/**`, `index.html`, the package manifest/lockfile, Vite configuration and TypeScript configurations. Keep `workflow_dispatch` for deliberate redeploys. Repository docs, container configuration, artwork-generation scripts, and workflow-only edits do not trigger Pages. Public artwork, attribution notices and CNAME remain deployment inputs because Vite publishes them. Mixed commits deploy if any published input changes. CI and CodeQL triggers remain unchanged.
- **Consequences:** No additional action, token scope or runtime dependency is required. Maintainers must extend the allowlist if new build inputs are introduced. The current container branch still includes application validation changes and therefore qualifies for deployment when merged. Like other native GitHub path filters, exceptionally large pushes or diff timeouts follow GitHub's documented filter limits.

## ADR-022: Heredoc style for Dockerfile shell steps

- **Status:** Accepted.
- **Context:** The owner requested heredoc-style Dockerfile syntax and a recorded convention for future changes.
- **Decision:** Write Dockerfile shell `RUN` steps as quoted heredocs (`RUN <<'EOF'`), with one command per line and POSIX `set -eu` at the start. Keep `RUN` options such as cache mounts and `--network=none` on the instruction before the heredoc. Quoting the delimiter leaves shell expansion to the build-time shell. Preserve normal syntax for non-shell directives and JSON exec form for `ENTRYPOINT`/`CMD`.
- **Consequences:** Shell steps are readable without continuation backslashes or `&&` chains, and failed commands stop the build. The pinned frontend, image digests, dependency/cache behavior, offline lint/test/build step and hardened runtime settings remain unchanged.
- **Verification:** The nerdctl build passed strict Dockerfile frontend checks, lint, all 27 unit tests and the production build. A temporary container passed Nginx configuration, HTTP health, HTML/CSP and artwork checks; its HTML matched the existing preview. The test container was removed afterward.

## ADR-023: Compose for the local preview

- **Status:** Accepted; supersedes ADR-020's direct-run helper choice and no-additional-swap constraint.
- **Context:** The owner requested Compose after reviewing its resource-limit support. A fresh nerdctl 2.4.1 test confirmed that service-level `pids_limit` works, while `deploy.resources.limits.pids` and `memswap_limit` are ignored. The default swap allowance is acceptable for this small local static-site preview.
- **Decision:** Replace `container/preview.sh` with `compose.yaml`. Keep `pids_limit: 64`, `cpus: 1` and `mem_limit: 128m` at service level; omit unsupported swap configuration. nerdctl 2.4.1 rejects mixing service PIDs with deployment CPU/memory unless deployment PIDs are duplicated, so accept its deprecation notices for service CPU/memory fields and verify the applied limits. Preserve the non-root user, read-only root, dropped capabilities, no-new-privileges, protected tmpfs, file-descriptor limits, graceful shutdown and restart policy. Keep port 5173 and optional binding/port overrides. Use native `nerdctl compose` commands for build and lifecycle management; retain the pinned multi-stage heredoc Dockerfile.
- **Consequences:** Compose is the single runtime configuration. The tested default allows 128 MiB RAM and up to 128 MiB additional swap, subject to the host. Verify actual OCI limits after runtime/configuration changes. Browser data stays at the same origin. Container/documentation-only changes continue to skip GitHub Pages deployment.
- **Verification:** Compose configuration validation and the pinned image build passed (reusing cached application checks). A temporary Compose project passed actual OCI resource/security assertions, HTTP/CSP and artwork checks, and stop/start; it was removed afterward. The local preview was migrated to Compose on port 5173, with localhost/LAN access and identical HTML verified before retiring the standalone container.
