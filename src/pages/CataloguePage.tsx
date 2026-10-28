import { useMemo, useState } from 'react'
import { GwentCard } from '../components/GwentCard'
import { QtyStepper } from '../components/QtyStepper'
import { catalogue, factionLabel, playableFactions } from '../domain/catalogue'
import {
  filterCatalogueCards,
  ROW_FILTER_OPTIONS,
  type RowFilter,
} from '../domain/cardFilters'
import type { CardKind, Expansion, FactionId } from '../domain/types'
import { useCollection } from '../persistence/CollectionContext'

const KINDS: Array<CardKind | 'all'> = ['all', 'leader', 'hero', 'unit', 'special', 'weather']
const EXPANSIONS: Array<Expansion | 'all'> = [
  'all',
  'base',
  'hearts_of_stone',
  'blood_and_wine',
]

export function CataloguePage() {
  const { state, setQty, getImageUrl } = useCollection()
  const [q, setQ] = useState('')
  const [faction, setFaction] = useState<FactionId | 'all'>('all')
  const [kind, setKind] = useState<(typeof KINDS)[number]>('all')
  const [row, setRow] = useState<RowFilter>('all')
  const [expansion, setExpansion] = useState<(typeof EXPANSIONS)[number]>('all')
  const [ownedOnly, setOwnedOnly] = useState(false)

  const factions: Array<FactionId | 'all'> = ['all', ...playableFactions, 'neutral']

  const filtered = useMemo(
    () =>
      filterCatalogueCards(catalogue.cards, {
        query: q,
        faction,
        kind,
        row,
        expansion,
        ownedOnly,
        owned: state.owned,
      }),
    [q, faction, kind, row, expansion, ownedOnly, state.owned],
  )

  return (
    <div className="animate-rise mx-auto max-w-6xl px-4 py-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold text-[var(--color-silver)]">Card Library</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          {catalogue.cards.length} cards · filter, search, and mark owned copies
        </p>
      </header>

      <div className="panel p-4 flex flex-wrap gap-3 items-end">
        <label className="text-sm">
          <span className="label-caps">Search</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="field min-w-[14rem]"
            placeholder="Name or ability"
          />
        </label>
        <label className="text-sm">
          <span className="label-caps">Faction</span>
          <select
            value={faction}
            onChange={(e) => setFaction(e.target.value as FactionId | 'all')}
            className="field"
          >
            {factions.map((f) => (
              <option key={f} value={f}>
                {f === 'all' ? 'All' : factionLabel(f)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="label-caps">Type</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])}
            className="field"
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="label-caps">Row</span>
          <select
            value={row}
            onChange={(e) => setRow(e.target.value as RowFilter)}
            className="field"
          >
            {ROW_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="label-caps">Expansion</span>
          <select
            value={expansion}
            onChange={(e) => setExpansion(e.target.value as (typeof EXPANSIONS)[number])}
            className="field"
          >
            {EXPANSIONS.map((x) => (
              <option key={x} value={x}>
                {x.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex items-center gap-2 text-sm pb-2 text-[var(--color-ink-muted)]">
          <input
            type="checkbox"
            checked={ownedOnly}
            onChange={(e) => setOwnedOnly(e.target.checked)}
          />
          Owned only
        </label>
      </div>

      <p className="text-xs text-[var(--color-ink-faint)]" aria-live="polite">
        Showing {filtered.length} cards
      </p>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none p-0 m-0">
        {filtered.map((card) => {
          const qty = state.owned[card.id] ?? 0
          return (
            <li key={card.id} className="space-y-2">
              <GwentCard card={card} qty={qty || undefined} imageUrl={getImageUrl(card.id)} />
              <QtyStepper
                value={qty}
                max={card.maxCopies}
                onChange={(n) => setQty(card.id, n)}
                label={`Owned copies of ${card.name}`}
              />
              {card.sources[0] ? (
                <p className="text-[11px] text-[var(--color-ink-faint)] line-clamp-2">
                  {card.sources[0]}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
