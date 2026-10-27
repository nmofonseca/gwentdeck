# GwentDeck

Free, open-source **collection manager** and **intelligent deck optimiser** for the Gwent minigame in *The Witcher 3: Wild Hunt* (including Hearts of Stone and Blood and Wine).

**Not** for the standalone CDPR GWENT client.

## Features

- Verified catalogue of TW3 Gwent cards (five factions + neutrals + HoS/BaW)
- Mark owned quantities; data stays in your browser (`localStorage`)
- Import / export collection and saved decks as JSON
- Generate **legal** decks from cards you own
- Explanations for inclusions and a missing-card roadmap
- Static site — no accounts, no server, no tracking

## Live demo

Once GitHub Pages is enabled:

**https://\<username\>.github.io/gwentdeck/**

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
- No official CDPR card art is redistributed; the UI uses CSS card faces.

## Docs

- [PLAN.md](./PLAN.md) — roadmap and checklist
- [AGENTS.md](./AGENTS.md) — contributor/agent rules
- [DECISIONS.md](./DECISIONS.md) — ADRs
