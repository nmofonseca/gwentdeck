import type { Card, CardKind, CombatRow, Expansion, FactionId } from './types'

export type RowFilter = CombatRow | 'all'

export interface CatalogueFilterCriteria {
  query?: string
  faction?: FactionId | 'all'
  kind?: CardKind | 'all'
  row?: RowFilter
  expansion?: Expansion | 'all'
  ownedOnly?: boolean
  owned?: Record<string, number>
}

/** Exclusive match on `card.row`; Agile ≠ Close/Ranged. Null-row cards drop when a row is selected. */
export function matchesRow(card: Card, row: RowFilter): boolean {
  if (row === 'all') return true
  return card.row === row
}

export function matchesCatalogueFilters(card: Card, criteria: CatalogueFilterCriteria): boolean {
  const {
    query = '',
    faction = 'all',
    kind = 'all',
    row = 'all',
    expansion = 'all',
    ownedOnly = false,
    owned = {},
  } = criteria

  if (faction !== 'all' && card.faction !== faction) return false
  if (kind !== 'all' && card.kind !== kind) return false
  if (!matchesRow(card, row)) return false
  if (expansion !== 'all' && card.expansion !== expansion) return false
  if (ownedOnly && (owned[card.id] ?? 0) <= 0) return false

  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return (
    card.name.toLowerCase().includes(needle) ||
    card.abilities.some((a) => a.includes(needle)) ||
    (card.abilityText?.toLowerCase().includes(needle) ?? false)
  )
}

export function filterCatalogueCards(
  cards: readonly Card[],
  criteria: CatalogueFilterCriteria,
): Card[] {
  return cards.filter((c) => matchesCatalogueFilters(c, criteria))
}

export const ROW_FILTER_OPTIONS: Array<{ value: RowFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'close', label: 'Close Combat' },
  { value: 'ranged', label: 'Ranged' },
  { value: 'siege', label: 'Siege' },
  { value: 'agile', label: 'Agile' },
]
