import { useMemo, useState } from 'react'
import { GwentCard } from '../components/GwentCard'
import { QtyStepper } from '../components/QtyStepper'
import { catalogue, factionLabel, playableFactions } from '../domain/catalogue'
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
  const { state, setQty } = useCollection()
  const [q, setQ] = useState('')
  const [faction, setFaction] = useState<FactionId | 'all'>('all')
  const [kind, setKind] = useState<(typeof KINDS)[number]>('all')
  const [expansion, setExpansion] = useState<(typeof EXPANSIONS)[number]>('all')
  const [ownedOnly, setOwnedOnly] = useState(false)

  const factions: Array<FactionId | 'all'> = ['all', ...playableFactions, 'neutral']

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return catalogue.cards.filter((c) => {
      if (faction !== 'all' && c.faction !== faction) return false
      if (kind !== 'all' && c.kind !== kind) return false
      if (expansion !== 'all' && c.expansion !== expansion) return false
      const owned = state.owned[c.id] ?? 0
      if (ownedOnly && owned <= 0) return false
      if (!needle) return true
      return (
        c.name.toLowerCase().includes(needle) ||
        c.abilities.some((a) => a.includes(needle)) ||
        (c.abilityText?.toLowerCase().includes(needle) ?? false)
      )
    })
  }, [q, faction, kind, expansion, ownedOnly, state.owned])

  return (
    <div className="animate-rise space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold">Catalogue</h1>
        <p className="text-sm text-ink/70">
          {catalogue.cards.length} cards · filter, search, and mark owned copies
        </p>
      </header>

      <div className="flex flex-wrap gap-3 items-end">
        <label className="text-sm">
          <span className="block text-xs uppercase tracking-wide text-ink/60 mb-1">Search</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded border border-ink/20 bg-parchment/70 px-3 py-2 min-w-[14rem]"
            placeholder="Name or ability"
          />
        </label>
        <label className="text-sm">
          <span className="block text-xs uppercase tracking-wide text-ink/60 mb-1">Faction</span>
          <select
            value={faction}
            onChange={(e) => setFaction(e.target.value as FactionId | 'all')}
            className="rounded border border-ink/20 bg-parchment/70 px-3 py-2"
          >
            {factions.map((f) => (
              <option key={f} value={f}>
                {f === 'all' ? 'All' : factionLabel(f)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block text-xs uppercase tracking-wide text-ink/60 mb-1">Type</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])}
            className="rounded border border-ink/20 bg-parchment/70 px-3 py-2"
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block text-xs uppercase tracking-wide text-ink/60 mb-1">Expansion</span>
          <select
            value={expansion}
            onChange={(e) => setExpansion(e.target.value as (typeof EXPANSIONS)[number])}
            className="rounded border border-ink/20 bg-parchment/70 px-3 py-2"
          >
            {EXPANSIONS.map((x) => (
              <option key={x} value={x}>
                {x.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex items-center gap-2 text-sm pb-2">
          <input
            type="checkbox"
            checked={ownedOnly}
            onChange={(e) => setOwnedOnly(e.target.checked)}
          />
          Owned only
        </label>
      </div>

      <p className="text-xs text-ink/60" aria-live="polite">
        Showing {filtered.length} cards
      </p>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none p-0 m-0">
        {filtered.map((card) => {
          const qty = state.owned[card.id] ?? 0
          return (
            <li key={card.id} className="space-y-2">
              <GwentCard card={card} qty={qty || undefined} />
              <QtyStepper
                value={qty}
                max={card.maxCopies}
                onChange={(n) => setQty(card.id, n)}
                label={`Owned copies of ${card.name}`}
              />
              {card.sources[0] ? (
                <p className="text-[11px] text-ink/55 line-clamp-2">{card.sources[0]}</p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
