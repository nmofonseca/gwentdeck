import { useId, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
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
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filtersId = useId()

  const factions: Array<FactionId | 'all'> = ['all', ...playableFactions, 'neutral']
  const activeFilterCount =
    (faction !== 'all' ? 1 : 0) +
    (kind !== 'all' ? 1 : 0) +
    (row !== 'all' ? 1 : 0) +
    (expansion !== 'all' ? 1 : 0) +
    (ownedOnly ? 1 : 0)

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

      <div className="panel p-4 flex flex-wrap gap-3 items-end max-[399px]:flex-col max-[399px]:items-stretch">
        <label className="text-sm max-[399px]:w-full">
          <span className="label-caps">Search</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="field min-w-[14rem] max-[399px]:min-w-0 max-[399px]:w-full"
            placeholder="Name or ability"
          />
        </label>

        {/* Toggle only below ~400px (fold cover / narrow phones) */}
        <button
          type="button"
          className="min-[400px]:hidden inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-sm border border-[rgba(138,106,56,0.55)] bg-[rgba(42,33,22,0.92)] px-3 text-sm text-[var(--color-parchment)]"
          aria-expanded={filtersOpen}
          aria-controls={filtersId}
          onClick={() => setFiltersOpen((o) => !o)}
        >
          <span>
            Filters
            {activeFilterCount > 0 ? (
              <span className="ml-2 text-[var(--color-ledger-gold)]">
                ({activeFilterCount} active)
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>

        <div
          id={filtersId}
          className={
            filtersOpen
              ? 'contents max-[399px]:flex max-[399px]:w-full max-[399px]:flex-col max-[399px]:gap-3'
              : 'contents max-[399px]:hidden'
          }
        >
          <label className="text-sm max-[399px]:block max-[399px]:w-full">
            <span className="label-caps">Faction</span>
            <select
              value={faction}
              onChange={(e) => setFaction(e.target.value as FactionId | 'all')}
              className="field max-[399px]:w-full"
            >
              {factions.map((f) => (
                <option key={f} value={f}>
                  {f === 'all' ? 'All' : factionLabel(f)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm max-[399px]:block max-[399px]:w-full">
            <span className="label-caps">Type</span>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])}
              className="field max-[399px]:w-full"
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm max-[399px]:block max-[399px]:w-full">
            <span className="label-caps">Row</span>
            <select
              value={row}
              onChange={(e) => setRow(e.target.value as RowFilter)}
              className="field max-[399px]:w-full"
            >
              {ROW_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm max-[399px]:block max-[399px]:w-full">
            <span className="label-caps">Expansion</span>
            <select
              value={expansion}
              onChange={(e) => setExpansion(e.target.value as (typeof EXPANSIONS)[number])}
              className="field max-[399px]:w-full"
            >
              {EXPANSIONS.map((x) => (
                <option key={x} value={x}>
                  {x.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </label>
          <label className="inline-flex items-center gap-2 text-sm pb-2 text-[var(--color-ink-muted)] max-[399px]:pb-0">
            <input
              type="checkbox"
              checked={ownedOnly}
              onChange={(e) => setOwnedOnly(e.target.checked)}
              className="h-4 w-4"
            />
            Owned only
          </label>
        </div>
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
