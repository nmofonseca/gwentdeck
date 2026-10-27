import { describe, expect, it } from 'vitest'
import { catalogue, catalogueStats, leadersFor, playableFactions } from './catalogue'

describe('catalogue', () => {
  it('loads a substantial verified set', () => {
    expect(catalogue.cards.length).toBeGreaterThanOrEqual(170)
    expect(catalogue.version).toBe(1)
  })

  it('has leaders for every playable faction', () => {
    for (const f of playableFactions) {
      const leaders = leadersFor(f)
      expect(leaders.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('has unique ids', () => {
    const ids = catalogue.cards.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('reports faction coverage', () => {
    const { byFaction } = catalogueStats()
    expect(byFaction.northern_realms).toBeGreaterThan(20)
    expect(byFaction.nilfgaard).toBeGreaterThan(20)
    expect(byFaction.scoiatael).toBeGreaterThan(20)
    expect(byFaction.monsters).toBeGreaterThan(20)
    expect(byFaction.skellige).toBeGreaterThan(20)
    expect(byFaction.neutral).toBeGreaterThan(15)
  })
})
