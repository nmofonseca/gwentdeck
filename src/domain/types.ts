export type FactionId =
  | 'northern_realms'
  | 'nilfgaard'
  | 'scoiatael'
  | 'monsters'
  | 'skellige'
  | 'neutral'

export type CardKind = 'leader' | 'unit' | 'hero' | 'special' | 'weather'

export type CombatRow = 'close' | 'ranged' | 'siege' | 'agile'

export type Expansion = 'base' | 'hearts_of_stone' | 'blood_and_wine'

export type AbilityId =
  | 'hero'
  | 'spy'
  | 'medic'
  | 'muster'
  | 'tight_bond'
  | 'agile'
  | 'morale_boost'
  | 'commanders_horn'
  | 'scorch'
  | 'decoy'
  | 'mardroeme'
  | 'berserker'
  | 'summon_avenger'
  | 'biting_frost'
  | 'impenetrable_fog'
  | 'torrential_rain'
  | 'clear_weather'
  | 'skellige_storm'

export interface Card {
  id: string
  name: string
  faction: FactionId
  kind: CardKind
  row: CombatRow | null
  strength: number | null
  abilities: AbilityId[]
  maxCopies: number
  expansion: Expansion
  sources: string[]
  musterGroup: string | null
  bondGroup: string | null
  abilityText: string | null
}

export interface FactionInfo {
  name: string
  perk: string | null
}

export interface Catalogue {
  version: number
  game: string
  sources: string[]
  rules: {
    minUnits: number
    maxSpecials: number
    leaderRequired: boolean
    unitsIncludeHeroes: boolean
    specialsIncludeWeather: boolean
  }
  factions: Record<FactionId, FactionInfo>
  cards: Card[]
}

export type PlayableFaction = Exclude<FactionId, 'neutral'>

export type StrategyId = 'balanced' | 'aggressive' | 'control' | 'synergy'

export interface OwnedMap {
  [cardId: string]: number
}

export interface SavedDeck {
  id: string
  name: string
  faction: PlayableFaction
  strategy: StrategyId
  leaderId: string
  cardIds: string[]
  createdAt: string
  notes?: string
}

export interface CollectionState {
  version: number
  owned: OwnedMap
  savedDecks: SavedDeck[]
  updatedAt: string
}

export interface LegalityIssue {
  code: string
  message: string
}

export interface LegalityResult {
  ok: boolean
  issues: LegalityIssue[]
  unitCount: number
  specialCount: number
  totalCards: number
}

export interface ScoredCard {
  card: Card
  score: number
  reasons: string[]
}

export interface DeckRecommendation {
  faction: PlayableFaction
  strategy: StrategyId
  leader: Card | null
  cards: Card[]
  explanations: string[]
  missing: MissingCardHint[]
  legality: LegalityResult
  scoreBreakdown: ScoredCard[]
}

export interface MissingCardHint {
  card: Card
  reason: string
  priority: number
}
