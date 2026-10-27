import { z } from 'zod'
import { catalogue, getCard } from '../domain/catalogue'
import type { CollectionState, OwnedMap, SavedDeck } from '../domain/types'

export const COLLECTION_SCHEMA_VERSION = 1
export const STORAGE_KEY = 'gwentdeck.collection.v1'
export const BACKUP_KEY = 'gwentdeck.collection.backup'

const ownedSchema = z.record(z.string(), z.number().int().min(0).max(20))

const savedDeckSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  faction: z.enum(['northern_realms', 'nilfgaard', 'scoiatael', 'monsters', 'skellige']),
  strategy: z.enum(['balanced', 'aggressive', 'control', 'synergy']),
  leaderId: z.string(),
  cardIds: z.array(z.string()),
  createdAt: z.string(),
  notes: z.string().max(2000).optional(),
})

export const collectionSchema = z.object({
  version: z.literal(COLLECTION_SCHEMA_VERSION),
  owned: ownedSchema,
  savedDecks: z.array(savedDeckSchema),
  updatedAt: z.string(),
})

export function emptyCollection(): CollectionState {
  return {
    version: COLLECTION_SCHEMA_VERSION,
    owned: {},
    savedDecks: [],
    updatedAt: new Date().toISOString(),
  }
}

/** Clamp owned quantities to catalogue maxCopies; drop unknown ids. */
export function sanitizeOwned(owned: OwnedMap): OwnedMap {
  const next: OwnedMap = {}
  for (const [id, qty] of Object.entries(owned)) {
    const card = getCard(id)
    if (!card) continue
    const n = Math.max(0, Math.min(card.maxCopies, Math.floor(qty)))
    if (n > 0) next[id] = n
  }
  return next
}

export function parseCollection(raw: unknown): CollectionState {
  const parsed = collectionSchema.parse(raw)
  return {
    ...parsed,
    owned: sanitizeOwned(parsed.owned),
  }
}

export function loadCollection(): { state: CollectionState; warning?: string } {
  if (typeof localStorage === 'undefined') {
    return { state: emptyCollection() }
  }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { state: emptyCollection() }
  try {
    const state = parseCollection(JSON.parse(raw))
    return { state }
  } catch (err) {
    try {
      localStorage.setItem(BACKUP_KEY, raw)
    } catch {
      /* ignore quota */
    }
    return {
      state: emptyCollection(),
      warning: `Saved collection could not be read (${err instanceof Error ? err.message : 'invalid data'}). A backup was kept; starting fresh.`,
    }
  }
}

export function saveCollection(state: CollectionState): void {
  if (typeof localStorage === 'undefined') return
  const payload: CollectionState = {
    ...state,
    version: COLLECTION_SCHEMA_VERSION,
    owned: sanitizeOwned(state.owned),
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function exportCollectionJson(state: CollectionState): string {
  return JSON.stringify(
    {
      ...state,
      version: COLLECTION_SCHEMA_VERSION,
      owned: sanitizeOwned(state.owned),
      exportedAt: new Date().toISOString(),
      game: catalogue.game,
    },
    null,
    2,
  )
}

export function importCollectionJson(text: string): CollectionState {
  const data = JSON.parse(text) as unknown
  return parseCollection(data)
}

export function setOwnedQty(state: CollectionState, cardId: string, qty: number): CollectionState {
  const card = getCard(cardId)
  if (!card) return state
  const owned = { ...state.owned }
  const n = Math.max(0, Math.min(card.maxCopies, Math.floor(qty)))
  if (n <= 0) delete owned[cardId]
  else owned[cardId] = n
  return { ...state, owned, updatedAt: new Date().toISOString() }
}

export function addSavedDeck(state: CollectionState, deck: SavedDeck): CollectionState {
  return {
    ...state,
    savedDecks: [deck, ...state.savedDecks].slice(0, 50),
    updatedAt: new Date().toISOString(),
  }
}

export function removeSavedDeck(state: CollectionState, id: string): CollectionState {
  return {
    ...state,
    savedDecks: state.savedDecks.filter((d) => d.id !== id),
    updatedAt: new Date().toISOString(),
  }
}

export function countOwnedCards(owned: OwnedMap): number {
  return Object.values(owned).reduce((a, b) => a + b, 0)
}

export function countOwnedUnique(owned: OwnedMap): number {
  return Object.keys(owned).length
}
