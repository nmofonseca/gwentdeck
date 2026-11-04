# GwentDeck

Free, open-source **collection manager** and **intelligent deck optimiser** for the Gwent minigame in *The Witcher 3: Wild Hunt* (including Hearts of Stone and Blood and Wine).

**Not** for the standalone CDPR GWENT client. Unofficial fan project — not affiliated with CDPR.

## How to use

Watch a short walkthrough (Card Library → owned cards → Deck Optimiser → export/import):

https://github.com/nmofonseca/gwentdeck/blob/main/docs/howto.mp4

<video src="./docs/howto.mp4" controls width="720" title="GwentDeck how-to walkthrough">
  <a href="./docs/howto.mp4">Download the how-to walkthrough (MP4)</a>
</video>

[Download howto.mp4](./docs/howto.mp4) (~48s, Firefox recording of the live site).

### How to build a deck

1. **My Collection** / **Card Library** — mark owned cards and quantities (or load the sample Northern Realms set).
2. **Deck Optimiser** — choose a faction (or Auto) and a strategy, then press **Generate**.
3. Review the recommended deck, explanations, and missing-card roadmap; optionally **Save deck** to My Decks.
4. On **My Collection**, use **Export** / **Import** to back up or restore your `localStorage` collection JSON.

## Features

- Verified catalogue of TW3 Gwent cards (five factions + neutrals + HoS/BaW)
- Mark owned quantities; data stays in your browser (`localStorage`)
- Import / export collection and saved decks as JSON
- Generate **legal** decks from cards you own
- Explanations for inclusions and a missing-card roadmap
- Witcher 3 card faces with artwork credits and CSS fallback; optional personal image URL overrides
- Static site — no accounts, no server, no tracking

## Live demo

**https://gwentbuilder.devopsplays.top/**

(`https://nmofonseca.github.io/gwentdeck/` redirects to the custom domain while it is configured.)

Pages deploys automatically when a push or merge to `main` changes application
source (`src/**`), published assets (`public/**`), `index.html`, `package.json`,
`package-lock.json`, `vite.config.ts`, or `tsconfig*.json`. Assets include artwork,
its published credit notices, and the custom-domain `CNAME` file.

Documentation-only changes outside the published inputs, container files
(`Dockerfile`, `.dockerignore`, `container/**`), and workflow-only changes skip
automatic deployment. A mixed change still deploys if it includes any published
input. CI and CodeQL continue running for PRs and pushes to `main`.

For an explicit redeploy, open **Actions → Deploy GitHub Pages → Run workflow**
and choose `main`. Keep the workflow's `paths` list current if new build inputs
are introduced. The live site updates after the Pages workflow finishes.

## Quick start

```bash
npm install
npm run dev
```

```bash
npm test          # unit tests
npm run build     # production build (base /)
npm run preview   # preview production build
npm run e2e       # Playwright (run build/preview or use webServer config)
```

## Local container preview

With rootless nerdctl and BuildKit available:

```bash
nerdctl login dhi.io
container/preview.sh build
container/preview.sh run
```

Open `http://127.0.0.1:5173/`. Stop it with `container/preview.sh stop`; use `container/preview.sh rm` to remove
the stopped container. See [container instructions](./docs/containers.md)
for pinned DHI versions/digests, LAN access, rebuilds and security settings.

## Stack

Vite · React · TypeScript (strict) · HashRouter · Tailwind CSS v4 · Lucide · Zod · Vitest · Playwright

## Deck rules (TW3)

- Exactly **1** leader of the chosen faction
- At least **22** unit cards (heroes count as units)
- At most **10** special cards (weather + Decoy / Commander’s Horn / Scorch / Mardroeme)
- Units must be the chosen faction or **Neutral**

## Licence & attribution

- Code: [MIT](./LICENSE)
- Card names, stats, and acquisition text are derived from community datasets citing the [Witcher Wiki](https://witcher.fandom.com/) (CC BY-SA). See `src/data/catalogue.json` `sources` and the in-app About page.
- **Game card faces** under `public/card-faces/`: artwork © CD PROJEKT RED and respective creators, sourced from Gwent Classic by Arun Sundaram. See [NOTICE-ART.md](./NOTICE-ART.md) and [upstream notices](./public/card-faces/NOTICE.md). These images are not covered by the code MIT licence or CC0.
- **Retained original AI card art** under `public/card-art/` is dedicated **[CC0 1.0](./public/card-art/LICENSE)** — see [NOTICE-ART.md](./NOTICE-ART.md). This older portrait set is no longer the default. UI falls back to CSS faces if an image is missing. Optional user-supplied image URLs stay in your browser only.
- This is an unofficial fan work and is not approved or endorsed by CD PROJEKT RED.
## Docs

- [PLAN.md](./PLAN.md) — roadmap and checklist
- [AGENTS.md](./AGENTS.md) — contributor/agent rules
- [DECISIONS.md](./DECISIONS.md) — ADRs
