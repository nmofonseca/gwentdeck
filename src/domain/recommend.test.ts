import { describe, expect, it } from 'vitest'
import { catalogue } from './catalogue'
import { recommendDeck } from './recommend'
import type { OwnedMap } from './types'

function ownPlenty(): OwnedMap {
  const owned: OwnedMap = {}
  for (const c of catalogue.cards) {
    if (c.faction === 'northern_realms' || c.faction === 'neutral') {
      owned[c.id] = c.maxCopies
    }
  }
  return owned
}

describe('recommendDeck', () => {
  it('produces a legal NR deck when the collection is complete enough', () => {
    const rec = recommendDeck('northern_realms', ownPlenty(), 'balanced')
    expect(rec.leader).not.toBeNull()
    expect(rec.legality.ok).toBe(true)
    expect(rec.legality.unitCount).toBeGreaterThanOrEqual(22)
    expect(rec.legality.specialCount).toBeLessThanOrEqual(10)
    expect(rec.explanations.length).toBeGreaterThan(3)
  })

  it('never includes unowned cards', () => {
    const owned: OwnedMap = {}
    // Own only a thin slice
    for (const c of catalogue.cards) {
      if (c.faction === 'scoiatael' && c.kind === 'leader') owned[c.id] = 1
      if (
        (c.faction === 'scoiatael' || c.faction === 'neutral') &&
        (c.kind === 'unit' || c.kind === 'hero')
      ) {
        owned[c.id] = 1
      }
    }
    const rec = recommendDeck('scoiatael', owned, 'synergy')
    for (const card of rec.cards) {
      expect(owned[card.id] ?? 0).toBeGreaterThan(0)
    }
    if (rec.leader) expect(owned[rec.leader.id]).toBeGreaterThan(0)
  })

  it('reports missing cards when collection is empty', () => {
    const rec = recommendDeck('monsters', {}, 'aggressive')
    expect(rec.leader).toBeNull()
    expect(rec.legality.ok).toBe(false)
    expect(rec.missing.length).toBeGreaterThan(0)
  })
})
