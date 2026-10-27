# GwentDeck

Free, open-source **collection manager** and **intelligent deck optimiser** for the Gwent minigame in *The Witcher 3: Wild Hunt* (including Hearts of Stone and Blood and Wine).

**Not** for the standalone CDPR GWENT client. Unofficial fan project — not affiliated with CDPR.

## How to build a deck

1. **My Collection** / **Card Library** — mark owned cards and quantities (or load the sample Northern Realms set).
2. **Deck Optimiser** — choose a faction (or Auto) and a strategy, then press **Generate**.
3. Review the recommended deck, explanations, and missing-card roadmap; optionally **Save deck** to My Decks.

## Features

- Verified catalogue of TW3 Gwent cards (five factions + neutrals + HoS/BaW)
- Mark owned quantities; data stays in your browser (`localStorage`)
- Import / export collection and saved decks as JSON
- Generate **legal** decks from cards you own
- Explanations for inclusions and a missing-card roadmap
- CSS / procedural card faces by default; optional local image map if you supply your own URLs
- Static site — no accounts, no server, no tracking

## Live demo

**https://nmofonseca.github.io/gwentdeck/**

(Live Pages update only after changes merge to `main` and the Pages workflow finishes.)

## Quick start

```bash
npm install
npm run dev
```

```bash
npm test          # unit tests
npm run build     # production build (base /gwentdeck/)
npm run preview   # preview production build
npm run e2e       # Playwright (run build/preview or use webServer config)
```

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
- No official CDPR card art is redistributed; the UI uses CSS card faces. Optional user-supplied images stay in your browser only.

## Docs

- [PLAN.md](./PLAN.md) — roadmap and checklist
- [AGENTS.md](./AGENTS.md) — contributor/agent rules
- [DECISIONS.md](./DECISIONS.md) — ADRs
