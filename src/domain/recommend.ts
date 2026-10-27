import {
  catalogue,
  expandOwnedCopies,
  leadersFor,
  ownedQty,
} from './catalogue'
import { evaluateDeck } from './legality'
import type {
  Card,
  DeckRecommendation,
  MissingCardHint,
  PlayableFaction,
  ScoredCard,
  StrategyId,
} from './types'

interface Weights {
  strength: number
  hero: number
  spy: number
  medic: number
  muster: number
  bond: number
  horn: number
  scorch: number
  decoy: number
  weather: number
  morale: number
  agile: number
  leanPenalty: number
  targetUnits: number
  targetSpecials: number
}

const STRATEGIES: Record<StrategyId, Weights> = {
  balanced: {
    strength: 1,
    hero: 8,
    spy: 12,
    medic: 7,
    muster: 5,
    bond: 4,
    horn: 6,
    scorch: 5,
    decoy: 4,
    weather: 2,
    morale: 3,
    agile: 1,
    leanPenalty: 0.15,
    targetUnits: 22,
    targetSpecials: 6,
  },
  aggressive: {
    strength: 1.35,
    hero: 10,
    spy: 6,
    medic: 4,
    muster: 6,
    bond: 5,
    horn: 8,
    scorch: 7,
    decoy: 2,
    weather: 1,
    morale: 3,
    agile: 1,
    leanPenalty: 0.2,
    targetUnits: 22,
    targetSpecials: 5,
  },
  control: {
    strength: 0.7,
    hero: 7,
    spy: 14,
    medic: 10,
    muster: 3,
    bond: 2,
    horn: 5,
    scorch: 9,
    decoy: 8,
    weather: 6,
    morale: 2,
    agile: 1,
    leanPenalty: 0.1,
    targetUnits: 24,
    targetSpecials: 8,
  },
  synergy: {
    strength: 0.85,
    hero: 7,
    spy: 10,
    medic: 6,
    muster: 12,
    bond: 11,
    horn: 6,
    scorch: 4,
    decoy: 4,
    weather: 2,
    morale: 5,
    agile: 2,
    leanPenalty: 0.12,
    targetUnits: 25,
    targetSpecials: 6,
  },
}

export const STRATEGY_LABELS: Record<StrategyId, { name: string; blurb: string }> = {
  balanced: {
    name: 'Balanced',
    blurb: 'Lean deck, strong heroes, spies, and a sensible special package.',
  },
  aggressive: {
    name: 'Aggressive',
    blurb: 'Prioritise raw strength, heroes, horns and scorch.',
  },
  control: {
    name: 'Control',
    blurb: 'Spies, medics, decoys, weather and scorch for tempo swings.',
  },
  synergy: {
    name: 'Synergy',
    blurb: 'Prefer muster and tight-bond clusters even at lower face strength.',
  },
}

function scoreCard(card: Card, w: Weights, ownedPool: Card[]): ScoredCard {
  const reasons: string[] = []
  let score = 0
  const str = card.strength ?? 0

  if (card.kind === 'hero') {
    score += w.hero + str * w.strength
    reasons.push(`Hero ${str} — immune to weather/specials`)
  } else if (card.kind === 'unit') {
    score += str * w.strength
    reasons.push(`Unit strength ${str}`)
  } else if (card.kind === 'special') {
    if (card.abilities.includes('decoy')) {
      score += w.decoy
      reasons.push('Decoy recovers a played unit')
    }
    if (card.abilities.includes('commanders_horn')) {
      score += w.horn
      reasons.push("Commander's Horn doubles a row")
    }
    if (card.abilities.includes('scorch')) {
      score += w.scorch
      reasons.push('Scorch removes the strongest non-hero')
    }
    if (card.abilities.includes('mardroeme')) {
      score += w.muster
      reasons.push('Mardroeme enables Berserker transforms')
    }
  } else if (card.kind === 'weather') {
    score += w.weather
    if (card.abilities.includes('clear_weather')) {
      score += 1
      reasons.push('Clear Weather answers enemy weather')
    } else {
      reasons.push('Weather pressures a combat row')
    }
  }

  if (card.abilities.includes('spy')) {
    score += w.spy
    reasons.push('Spy draws 2 (plays on opponent side)')
  }
  if (card.abilities.includes('medic')) {
    score += w.medic
    reasons.push('Medic revives a non-hero from discard')
  }
  if (card.abilities.includes('muster')) {
    const group = card.musterGroup
    const siblings = group
      ? ownedPool.filter((c) => c.musterGroup === group).length
      : 1
    score += w.muster * Math.min(siblings, 4)
    reasons.push(`Muster group density ${siblings}`)
  }
  if (card.abilities.includes('tight_bond')) {
    const group = card.bondGroup ?? card.name
    const siblings = ownedPool.filter((c) => (c.bondGroup ?? c.name) === group).length
    score += w.bond * Math.min(siblings, 4)
    reasons.push(`Tight Bond partners owned: ${siblings}`)
  }
  if (card.abilities.includes('morale_boost')) {
    score += w.morale
    reasons.push('Morale Boost +1 to row')
  }
  if (card.abilities.includes('commanders_horn') && card.kind === 'unit') {
    score += w.horn * 0.8
    reasons.push('Built-in Commander’s Horn effect')
  }
  if (card.abilities.includes('scorch') && card.kind !== 'special') {
    score += w.scorch * 0.7
    reasons.push('Row/board Scorch ability')
  }
  if (card.abilities.includes('agile') || card.row === 'agile') {
    score += w.agile
    reasons.push('Agile row flexibility')
  }

  return { card, score, reasons }
}

function pickLeader(faction: PlayableFaction, owned: Record<string, number>): Card | null {
  const ownedLeaders = leadersFor(faction).filter((l) => ownedQty(owned, l.id) > 0)
  if (ownedLeaders.length === 0) return null
  // Prefer leaders with proactive board effects for balanced play
  const preferred = [
    'siegemaster',
    'beautiful',
    'king-of-the-wild-hunt',
    'emperor',
    'crach',
    'lord-commander',
  ]
  const ranked = [...ownedLeaders].sort((a, b) => {
    const ap = preferred.findIndex((p) => a.id.includes(p))
    const bp = preferred.findIndex((p) => b.id.includes(p))
    const av = ap === -1 ? 50 : ap
    const bv = bp === -1 ? 50 : bp
    return av - bv || a.name.localeCompare(b.name)
  })
  return ranked[0] ?? null
}

function buildMissing(
  faction: PlayableFaction,
  owned: Record<string, number>,
  w: Weights,
): MissingCardHint[] {
  const candidates = catalogue.cards.filter(
    (c) =>
      (c.faction === faction || c.faction === 'neutral') &&
      c.kind !== 'leader' &&
      ownedQty(owned, c.id) < c.maxCopies,
  )
  const emptyOwned: Card[] = []
  const hints = candidates
    .map((card) => {
      const scored = scoreCard(card, w, emptyOwned)
      const have = ownedQty(owned, card.id)
      return {
        card,
        priority: scored.score,
        reason:
          have === 0
            ? `Unowned — ${scored.reasons[0] ?? 'high value for this strategy'}`
            : `Own ${have}/${card.maxCopies} — extra copies help ${scored.reasons[0] ?? 'this strategy'}`,
      } satisfies MissingCardHint
    })
    .sort((a, b) => b.priority - a.priority)
  return hints.slice(0, 12)
}

export function recommendDeck(
  faction: PlayableFaction,
  owned: Record<string, number>,
  strategy: StrategyId = 'balanced',
): DeckRecommendation {
  const w = STRATEGIES[strategy]
  const leader = pickLeader(faction, owned)
  const pool = expandOwnedCopies(owned, faction)
  const scored = pool.map((card) => scoreCard(card, w, pool))
  scored.sort((a, b) => b.score - a.score || (b.card.strength ?? 0) - (a.card.strength ?? 0))

  const picked: ScoredCard[] = []
  let units = 0
  let specials = 0
  const usedBond = new Map<string, number>()
  const usedMuster = new Map<string, number>()

  for (const item of scored) {
    const { card } = item
    const isUnit = card.kind === 'unit' || card.kind === 'hero'
    const isSpecial = card.kind === 'special' || card.kind === 'weather'

    if (isUnit && units >= w.targetUnits + 4) continue
    if (isSpecial && specials >= w.targetSpecials) continue
    if (isSpecial && specials >= catalogue.rules.maxSpecials) continue

    // Soft lean: after target units, only take clearly better cards
    if (isUnit && units >= w.targetUnits && item.score < 8) continue

    if (card.bondGroup) {
      usedBond.set(card.bondGroup, (usedBond.get(card.bondGroup) ?? 0) + 1)
    }
    if (card.musterGroup) {
      usedMuster.set(card.musterGroup, (usedMuster.get(card.musterGroup) ?? 0) + 1)
    }

    picked.push(item)
    if (isUnit) units++
    if (isSpecial) specials++

    if (units >= w.targetUnits && specials >= Math.min(w.targetSpecials, 4) && units + specials >= w.targetUnits + 4) {
      // enough for a legal lean package
      if (units >= catalogue.rules.minUnits) break
    }
  }

  // Ensure minimum units if we somehow undershot (tiny collection)
  if (units < catalogue.rules.minUnits) {
    for (const item of scored) {
      if (picked.includes(item)) continue
      if (item.card.kind !== 'unit' && item.card.kind !== 'hero') continue
      picked.push(item)
      units++
      if (units >= catalogue.rules.minUnits) break
    }
  }

  const cards = picked.map((p) => p.card)
  const cardIds = cards.map((c) => c.id)
  const legality = evaluateDeck({
    faction,
    leaderId: leader?.id ?? null,
    cardIds,
    owned,
  })

  const explanations: string[] = []
  explanations.push(
    `Strategy: ${STRATEGY_LABELS[strategy].name} — ${STRATEGY_LABELS[strategy].blurb}`,
  )
  if (leader) {
    explanations.push(
      `Leader: ${leader.name}${leader.abilityText ? ` — ${leader.abilityText}` : ''}`,
    )
  } else {
    explanations.push('No owned leader for this faction — acquire a leader before the deck is legal.')
  }
  explanations.push(
    `Selected ${units} units and ${specials} specials (TW3 requires ≥${catalogue.rules.minUnits} units and ≤${catalogue.rules.maxSpecials} specials).`,
  )

  const top = [...picked].sort((a, b) => b.score - a.score).slice(0, 8)
  for (const t of top) {
    explanations.push(`Include ${t.card.name}: ${t.reasons.slice(0, 2).join('; ')}`)
  }

  if (!legality.ok) {
    explanations.push(
      `Deck is not yet legal: ${legality.issues.map((i) => i.message).join(' ')}`,
    )
  }

  return {
    faction,
    strategy,
    leader,
    cards,
    explanations,
    missing: buildMissing(faction, owned, w),
    legality,
    scoreBreakdown: picked,
  }
}
