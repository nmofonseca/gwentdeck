import { describe, expect, it } from 'vitest'
import {
  emptyCollection,
  exportCollectionJson,
  importCollectionJson,
  parseCollection,
  sanitizeOwned,
  setOwnedQty,
} from './collectionStore'
import { catalogue } from '../domain/catalogue'

describe('collectionStore', () => {
  it('sanitizes unknown ids and clamps maxCopies', () => {
    const card = catalogue.cards.find((c) => c.maxCopies >= 1)!
    const owned = sanitizeOwned({
      'nope-id': 3,
      [card.id]: card.maxCopies + 5,
    })
    expect(owned['nope-id']).toBeUndefined()
    expect(owned[card.id]).toBe(card.maxCopies)
  })

  it('round-trips export/import', () => {
    let state = emptyCollection()
    const card = catalogue.cards[0]!
    state = setOwnedQty(state, card.id, 1)
    const json = exportCollectionJson(state)
    const imported = importCollectionJson(json)
    expect(imported.owned[card.id]).toBe(1)
    expect(imported.version).toBe(1)
  })

  it('rejects invalid schema', () => {
    expect(() => parseCollection({ version: 99, owned: {}, savedDecks: [] })).toThrow()
  })
})
