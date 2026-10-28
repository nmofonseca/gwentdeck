import { describe, expect, it } from 'vitest'
import { catalogue } from './catalogue'
import {
  filterCatalogueCards,
  matchesCatalogueFilters,
  matchesRow,
} from './cardFilters'
import type { Card } from './types'

function sample(partial: Partial<Card> & Pick<Card, 'id' | 'name' | 'kind' | 'row'>): Card {
  return {
    faction: 'northern_realms',
    strength: 5,
    abilities: [],
    maxCopies: 1,
    expansion: 'base',
    sources: [],
    musterGroup: null,
    bondGroup: null,
    abilityText: null,
    ...partial,
  }
}

describe('matchesRow', () => {
  it('passes all rows when filter is all', () => {
    expect(matchesRow(sample({ id: 'a', name: 'A', kind: 'unit', row: 'close' }), 'all')).toBe(true)
    expect(matchesRow(sample({ id: 'b', name: 'B', kind: 'leader', row: null }), 'all')).toBe(true)
  })

  it('matches exclusively on card.row (agile ≠ close)', () => {
    const close = sample({ id: 'c', name: 'Close', kind: 'unit', row: 'close' })
    const agile = sample({ id: 'd', name: 'Agile', kind: 'unit', row: 'agile' })
    expect(matchesRow(close, 'close')).toBe(true)
    expect(matchesRow(agile, 'close')).toBe(false)
    expect(matchesRow(agile, 'agile')).toBe(true)
    expect(matchesRow(close, 'agile')).toBe(false)
  })

  it('excludes null-row cards when a row is selected', () => {
    const leader = sample({ id: 'e', name: 'Leader', kind: 'leader', row: null })
    expect(matchesRow(leader, 'siege')).toBe(false)
  })
})

describe('matchesCatalogueFilters', () => {
  it('keeps Type and Row orthogonal', () => {
    const heroClose = sample({ id: 'h', name: 'Hero Close', kind: 'hero', row: 'close' })
    expect(matchesCatalogueFilters(heroClose, { kind: 'hero', row: 'close' })).toBe(true)
    expect(matchesCatalogueFilters(heroClose, { kind: 'unit', row: 'close' })).toBe(false)
    expect(matchesCatalogueFilters(heroClose, { kind: 'hero', row: 'ranged' })).toBe(false)
  })
})

describe('filterCatalogueCards (live catalogue)', () => {
  it('siege filter returns only siege-row cards', () => {
    const siege = filterCatalogueCards(catalogue.cards, { row: 'siege' })
    expect(siege.length).toBeGreaterThan(0)
    expect(siege.every((c) => c.row === 'siege')).toBe(true)
  })

  it('agile filter excludes leaders and close units', () => {
    const agile = filterCatalogueCards(catalogue.cards, { row: 'agile' })
    expect(agile.length).toBeGreaterThan(0)
    expect(agile.every((c) => c.row === 'agile')).toBe(true)
    expect(agile.every((c) => c.kind !== 'leader')).toBe(true)
  })

  it('Francesca Hope of the Aen Seidhe has null row (leader ability, not placement)', () => {
    const francesca = catalogue.cards.find(
      (c) => c.id === 'scoiatael-francesca-findabair-hope-of-the-aen-seidhe',
    )
    expect(francesca).toBeDefined()
    expect(francesca!.kind).toBe('leader')
    expect(francesca!.row).toBeNull()
    const agile = filterCatalogueCards(catalogue.cards, { row: 'agile' })
    expect(agile.some((c) => c.id === francesca!.id)).toBe(false)
  })
})
