import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Upload, Trash2, Image } from 'lucide-react'
import { catalogue, factionLabel, playableFactions } from '../domain/catalogue'
import type { FactionId } from '../domain/types'
import { useCollection } from '../persistence/CollectionContext'
import { countOwnedCards, countOwnedUnique } from '../persistence/collectionStore'
import { QtyStepper } from '../components/QtyStepper'

export function CollectionPage() {
  const {
    state,
    setQty,
    reset,
    exportJson,
    importJson,
    deleteDeck,
    imageOverrides,
    importImagesJson,
    exportImagesJson,
    clearImages,
  } = useCollection()
  const fileRef = useRef<HTMLInputElement>(null)
  const imagesRef = useRef<HTMLInputElement>(null)
  const [faction, setFaction] = useState<FactionId | 'all'>('all')
  const [message, setMessage] = useState<string | null>(null)

  const factions: Array<FactionId | 'all'> = ['all', ...playableFactions, 'neutral']
  const imageCount = Object.keys(imageOverrides).length

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

  function downloadImages() {
    const blob = new Blob([exportImagesJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gwentdeck-images-${new Date().toISOString().slice(0, 10)}.json`
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

  async function onImportImages(file: File) {
    try {
      const text = await file.text()
      const n = importImagesJson(text)
      setMessage(
        `Imported ${n} local card image URL(s). Images stay in this browser only — you are responsible for rights.`,
      )
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Image import failed')
    }
  }

  function onReset() {
    if (window.confirm('Clear all owned cards and saved decks in this browser?')) {
      reset()
      setMessage('Collection cleared.')
    }
  }

  function onClearImages() {
    if (window.confirm('Clear all optional local card images in this browser?')) {
      clearImages()
      setMessage('Local card images cleared.')
    }
  }

  function grantStarterNorthern() {
    const starters = catalogue.cards.filter(
      (c) =>
        (c.faction === 'northern_realms' || c.faction === 'neutral') &&
        c.expansion === 'base' &&
        (c.kind === 'unit' ||
          c.kind === 'hero' ||
          c.kind === 'special' ||
          c.kind === 'weather' ||
          c.kind === 'leader'),
    )
    for (const c of starters) {
      setQty(c.id, Math.min(1, c.maxCopies))
    }
    for (const c of catalogue.cards) {
      if (
        [
          'Decoy',
          "Commander's Horn",
          'Biting Frost',
          'Clear Weather',
          'Poor Fucking Infantry',
          'Blue Stripes Commando',
        ].includes(c.name)
      ) {
        setQty(c.id, c.maxCopies)
      }
    }
    setMessage('Loaded a sample Northern Realms–leaning collection (edit freely).')
  }

  return (
    <div className="animate-rise mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-silver)]">
            My Collection
          </h1>
          <p className="text-sm text-[var(--color-ink-muted)]">
            {countOwnedUnique(state.owned)} unique · {countOwnedCards(state.owned)} copies · stored
            in localStorage
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={downloadExport} className="btn btn-primary">
            <Download className="h-4 w-4" /> Export
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-secondary">
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
          <button type="button" onClick={onReset} className="btn btn-danger">
            <Trash2 className="h-4 w-4" /> Reset
          </button>
        </div>
      </header>

      {message ? (
        <p
          role="status"
          className="text-sm panel px-3 py-2 border-[var(--color-moss)]/40 text-[var(--color-ink)]"
        >
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-sm text-[var(--color-ink-muted)]">
          Faction filter{' '}
          <select
            value={faction}
            onChange={(e) => setFaction(e.target.value as FactionId | 'all')}
            className="field ml-1"
          >
            {factions.map((f) => (
              <option key={f} value={f}>
                {f === 'all' ? 'All owned' : factionLabel(f)}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn-ghost text-sm" onClick={grantStarterNorthern}>
          Load sample NR collection
        </button>
        <Link className="btn-ghost text-sm" to="/catalogue">
          Add cards from Card Library
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-muted)]">
          No owned cards yet. Open the Card Library or load the sample collection.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--color-border)] panel overflow-hidden">
          {rows.map((card) => (
            <li
              key={card.id}
              className="flex flex-wrap items-center justify-between gap-3 px-3 py-2"
            >
              <div>
                <div className="font-medium text-[var(--color-ink)]">{card.name}</div>
                <div className="text-xs text-[var(--color-ink-faint)]">
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
        <h2 className="font-display text-2xl font-semibold text-[var(--color-silver)]">My Decks</h2>
        {state.savedDecks.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-faint)]">
            None yet — save from the Deck Optimiser.
          </p>
        ) : (
          <ul className="space-y-2">
            {state.savedDecks.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-2 panel px-3 py-2"
              >
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-[var(--color-ink-faint)]">
                    {factionLabel(d.faction)} · {d.strategy} · {d.cardIds.length} cards ·{' '}
                    {new Date(d.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-ghost text-sm text-[var(--color-crimson-bright)]"
                  onClick={() => deleteDeck(d.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3 panel p-4">
        <h2 className="font-display text-2xl font-semibold text-[var(--color-gold)] flex items-center gap-2">
          <Image className="h-5 w-5" aria-hidden /> Optional local card images
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Default faces are CSS (no CDPR art). You may optionally map card ids to{' '}
          <strong className="font-medium text-[var(--color-ink)]">your own</strong> https or{' '}
          <code className="text-[var(--color-bronze)]">data:image/…</code> URLs. Nothing is shipped
          in the repo; mappings stay in this browser. Do not import wiki/fan/CDPR art unless you
          have rights.
        </p>
        <p className="text-xs text-[var(--color-ink-faint)]">
          Currently mapped: {imageCount}. Example JSON:{' '}
          <code>{`{ "images": { "<card-id>": "https://…" } }`}</code>
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => imagesRef.current?.click()}>
            <Upload className="h-4 w-4" /> Import image map
          </button>
          <input
            ref={imagesRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void onImportImages(f)
              e.target.value = ''
            }}
          />
          <button type="button" className="btn btn-secondary" onClick={downloadImages} disabled={!imageCount}>
            <Download className="h-4 w-4" /> Export image map
          </button>
          <button type="button" className="btn btn-danger" onClick={onClearImages} disabled={!imageCount}>
            Clear images
          </button>
        </div>
      </section>
    </div>
  )
}
