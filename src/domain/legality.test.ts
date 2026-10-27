import { describe, expect, it } from 'vitest'
import { catalogue, leadersFor } from './catalogue'
import { evaluateDeck } from './legality'
import type { PlayableFaction } from './types'

function unitsFor(faction: PlayableFaction, n: number): string[] {
  return catalogue.cards
    .filter(
      (c) =>
        (c.faction === faction || c.faction === 'neutral') &&
        (c.kind === 'unit' || c.kind === 'hero'),
    )
    .slice(0, n)
    .map((c) => c.id)
}

describe('evaluateDeck', () => {
  it('requires a leader and 22 units', () => {
    const faction: PlayableFaction = 'northern_realms'
    const result = evaluateDeck({
      faction,
      leaderId: null,
      cardIds: unitsFor(faction, 10),
    })
    expect(result.ok).toBe(false)
    expect(result.issues.some((i) => i.code === 'leader_required')).toBe(true)
    expect(result.issues.some((i) => i.code === 'min_units')).toBe(true)
  })

  it('accepts a minimal legal NR deck without ownership checks', () => {
    const faction: PlayableFaction = 'northern_realms'
    const leader = leadersFor(faction)[0]
    expect(leader).toBeTruthy()
    const cardIds = unitsFor(faction, 22)
    const result = evaluateDeck({
      faction,
      leaderId: leader!.id,
      cardIds,
    })
    expect(result.unitCount).toBe(22)
    expect(result.ok).toBe(true)
  })

  it('rejects unowned cards when owned map provided', () => {
    const faction: PlayableFaction = 'nilfgaard'
    const leader = leadersFor(faction)[0]!
    const cardIds = unitsFor(faction, 22)
    const owned: Record<string, number> = { [leader.id]: 1 }
    const result = evaluateDeck({ faction, leaderId: leader.id, cardIds, owned })
    expect(result.ok).toBe(false)
    expect(result.issues.some((i) => i.code === 'unowned')).toBe(true)
  })

  it('caps specials at 10', () => {
    const faction: PlayableFaction = 'monsters'
    const leader = leadersFor(faction)[0]!
    const units = unitsFor(faction, 22)
    const specials = catalogue.cards
      .filter((c) => c.faction === 'neutral' && (c.kind === 'special' || c.kind === 'weather'))
      .flatMap((c) => Array.from({ length: c.maxCopies }, () => c.id))
      .slice(0, 11)
    const result = evaluateDeck({
      faction,
      leaderId: leader.id,
      cardIds: [...units, ...specials],
    })
    expect(result.issues.some((i) => i.code === 'max_specials')).toBe(true)
  })
})
