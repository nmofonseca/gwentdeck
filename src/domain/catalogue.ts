import raw from '../data/catalogue.json'
import type { Card, Catalogue, FactionId, PlayableFaction } from './types'

const PLAYABLE: PlayableFaction[] = [
  'northern_realms',
  'nilfgaard',
  'scoiatael',
  'monsters',
  'skellige',
]

function assertCatalogue(data: unknown): Catalogue {
  const c = data as Catalogue
  if (!c || !Array.isArray(c.cards) || c.cards.length < 100) {
    throw new Error('Catalogue failed validation: expected a large card list')
  }
  const ids = new Set<string>()
  for (const card of c.cards) {
    if (!card.id || !card.name || !card.faction || !card.kind) {
      throw new Error(`Catalogue card missing required fields: ${JSON.stringify(card)}`)
    }
    if (ids.has(card.id)) throw new Error(`Duplicate card id: ${card.id}`)
    ids.add(card.id)
    if (card.maxCopies < 1) throw new Error(`Invalid maxCopies for ${card.id}`)
  }
  const leaders = c.cards.filter((x) => x.kind === 'leader')
  if (leaders.length < 20) throw new Error('Catalogue missing leaders')
  return c
}

export const catalogue: Catalogue = assertCatalogue(raw)

export const playableFactions: PlayableFaction[] = PLAYABLE

export function getCard(id: string): Card | undefined {
  return catalogue.cards.find((c) => c.id === id)
}

export function cardsForFaction(faction: PlayableFaction): Card[] {
  return catalogue.cards.filter((c) => c.faction === faction || c.faction === 'neutral')
}

export function leadersFor(faction: PlayableFaction): Card[] {
  return catalogue.cards.filter((c) => c.kind === 'leader' && c.faction === faction)
}

export function isUnitCard(card: Card): boolean {
  return card.kind === 'unit' || card.kind === 'hero'
}

export function isSpecialCard(card: Card): boolean {
  return card.kind === 'special' || card.kind === 'weather'
}

export function factionLabel(id: FactionId): string {
  return catalogue.factions[id]?.name ?? id
}

export function ownedQty(owned: Record<string, number>, cardId: string): number {
  return owned[cardId] ?? 0
}

export function expandOwnedCopies(owned: Record<string, number>, faction: PlayableFaction): Card[] {
  const pool: Card[] = []
  for (const card of cardsForFaction(faction)) {
    if (card.kind === 'leader') continue
    const qty = Math.min(ownedQty(owned, card.id), card.maxCopies)
    for (let i = 0; i < qty; i++) pool.push(card)
  }
  return pool
}

export function catalogueStats() {
  const byFaction: Record<string, number> = {}
  const byKind: Record<string, number> = {}
  for (const c of catalogue.cards) {
    byFaction[c.faction] = (byFaction[c.faction] ?? 0) + 1
    byKind[c.kind] = (byKind[c.kind] ?? 0) + 1
  }
  return { total: catalogue.cards.length, byFaction, byKind }
}
