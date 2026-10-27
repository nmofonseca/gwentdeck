import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Upload, Trash2 } from 'lucide-react'
import { catalogue, factionLabel, playableFactions } from '../domain/catalogue'
import type { FactionId } from '../domain/types'
import { useCollection } from '../persistence/CollectionContext'
import { countOwnedCards, countOwnedUnique } from '../persistence/collectionStore'
import { QtyStepper } from '../components/QtyStepper'

export function CollectionPage() {
  const { state, setQty, reset, exportJson, importJson, deleteDeck } = useCollection()
  const fileRef = useRef<HTMLInputElement>(null)
  const [faction, setFaction] = useState<FactionId | 'all'>('all')
  const [message, setMessage] = useState<string | null>(null)

  const factions: Array<FactionId | 'all'> = ['all', ...playableFactions, 'neutral']

  const rows = useMemo(() => {
    return catalogue.cards.filter((c) => {
      if (faction !== 'all' && c.faction !== faction) return false
      return (state.owned[c.id] ?? 0) > 0
    })
  }, [faction, state.owned])

  function downloadExport() {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gwentdeck-collection-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onImportFile(file: File) {
    try {
      const text = await file.text()
      importJson(text)
      setMessage('Collection imported.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Import failed')
    }
  }

  function onReset() {
    if (window.confirm('Clear all owned cards and saved decks in this browser?')) {
      reset()
      setMessage('Collection cleared.')
    }
  }

  function grantStarterNorthern() {
    // Mark common base Northern Realms + neutrals as a helpful bootstrap (not a cheat — user can edit)
    const starters = catalogue.cards.filter(
      (c) =>
        (c.faction === 'northern_realms' || c.faction === 'neutral') &&
        c.expansion === 'base' &&
        (c.kind === 'unit' || c.kind === 'hero' || c.kind === 'special' || c.kind === 'weather' || c.kind === 'leader'),
    )
    for (const c of starters) {
      // Give 1 of each, up to max — approximates a mid-campaign collection, not the tiny starting hand
      setQty(c.id, Math.min(1, c.maxCopies))
    }
    // Extra copies for tight-bond / weather staples
    for (const c of catalogue.cards) {
      if (['Decoy', "Commander's Horn", 'Biting Frost', 'Clear Weather', 'Poor Fucking Infantry', 'Blue Stripes Commando'].includes(c.name)) {
        setQty(c.id, c.maxCopies)
      }
    }
    setMessage('Loaded a sample Northern Realms–leaning collection (edit freely).')
  }

  return (
    <div className="animate-rise space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Collection</h1>
          <p className="text-sm text-ink/70">
            {countOwnedUnique(state.owned)} unique · {countOwnedCards(state.owned)} copies · stored
            in localStorage
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadExport}
            className="inline-flex items-center gap-1.5 rounded bg-ink text-parchment px-3 py-2 text-sm"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded border border-ink/30 px-3 py-2 text-sm"
          >
            <Upload className="h-4 w-4" /> Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void onImportFile(f)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded border border-ember/40 text-ember px-3 py-2 text-sm"
          >
            <Trash2 className="h-4 w-4" /> Reset
          </button>
        </div>
      </header>

      {message ? (
        <p role="status" className="text-sm bg-moss/15 border border-moss/30 rounded px-3 py-2">
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-sm">
          Faction filter{' '}
          <select
            value={faction}
            onChange={(e) => setFaction(e.target.value as FactionId | 'all')}
            className="ml-1 rounded border border-ink/20 bg-parchment/70 px-2 py-1"
          >
            {factions.map((f) => (
              <option key={f} value={f}>
                {f === 'all' ? 'All owned' : factionLabel(f)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="text-sm underline text-ink/70"
          onClick={grantStarterNorthern}
        >
          Load sample NR collection
        </button>
        <Link className="text-sm underline text-ink/70" to="/catalogue">
          Add cards from catalogue
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-ink/70">
          No owned cards yet. Open the catalogue or load the sample collection.
        </p>
      ) : (
        <ul className="divide-y divide-ink/10 border border-ink/10 rounded bg-parchment/40">
          {rows.map((card) => (
            <li key={card.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
              <div>
                <div className="font-medium">{card.name}</div>
                <div className="text-xs text-ink/55">
                  {factionLabel(card.faction)} · {card.kind}
                  {card.strength != null ? ` · ${card.strength}` : ''}
                </div>
              </div>
              <QtyStepper
                value={state.owned[card.id] ?? 0}
                max={card.maxCopies}
                onChange={(n) => setQty(card.id, n)}
                label={`Owned ${card.name}`}
              />
            </li>
          ))}
        </ul>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-semibold">Saved decks</h2>
        {state.savedDecks.length === 0 ? (
          <p className="text-sm text-ink/60">None yet — save from the optimiser.</p>
        ) : (
          <ul className="space-y-2">
            {state.savedDecks.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-ink/10 bg-parchment/50 px-3 py-2"
              >
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-ink/55">
                    {factionLabel(d.faction)} · {d.strategy} · {d.cardIds.length} cards ·{' '}
                    {new Date(d.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-sm text-ember underline"
                  onClick={() => deleteDeck(d.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
