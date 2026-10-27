import { catalogue, getCard, isSpecialCard, isUnitCard } from './catalogue'
import type { Card, LegalityIssue, LegalityResult, PlayableFaction } from './types'

export interface DeckDraft {
  faction: PlayableFaction
  leaderId: string | null
  /** Multiset of non-leader card ids (one entry per copy in the deck). */
  cardIds: string[]
  /** Optional owned map — when provided, unowned cards are illegal. */
  owned?: Record<string, number>
}

function countOwnedUsage(cardIds: string[]): Record<string, number> {
  const used: Record<string, number> = {}
  for (const id of cardIds) {
    used[id] = (used[id] ?? 0) + 1
  }
  return used
}

export function evaluateDeck(draft: DeckDraft): LegalityResult {
  const issues: LegalityIssue[] = []
  const { minUnits, maxSpecials } = catalogue.rules

  const leader = draft.leaderId ? getCard(draft.leaderId) : undefined
  if (!draft.leaderId || !leader) {
    issues.push({ code: 'leader_required', message: 'A deck needs exactly one leader.' })
  } else if (leader.kind !== 'leader') {
    issues.push({ code: 'leader_invalid', message: 'Leader slot must be a leader card.' })
  } else if (leader.faction !== draft.faction) {
    issues.push({
      code: 'leader_faction',
      message: `Leader must belong to ${catalogue.factions[draft.faction].name}.`,
    })
  }

  const cards: Card[] = []
  for (const id of draft.cardIds) {
    const card = getCard(id)
    if (!card) {
      issues.push({ code: 'unknown_card', message: `Unknown card id: ${id}` })
      continue
    }
    if (card.kind === 'leader') {
      issues.push({
        code: 'leader_in_list',
        message: `${card.name} is a leader and cannot sit in the unit/special list.`,
      })
      continue
    }
    if (card.faction !== draft.faction && card.faction !== 'neutral') {
      issues.push({
        code: 'wrong_faction',
        message: `${card.name} cannot be used in a ${catalogue.factions[draft.faction].name} deck.`,
      })
    }
    cards.push(card)
  }

  if (draft.owned) {
    const used = countOwnedUsage(draft.cardIds)
    for (const [id, qty] of Object.entries(used)) {
      const card = getCard(id)
      const have = draft.owned[id] ?? 0
      if (qty > have) {
        issues.push({
          code: 'unowned',
          message: `Not enough copies of ${card?.name ?? id} (need ${qty}, own ${have}).`,
        })
      }
      if (card && qty > card.maxCopies) {
        issues.push({
          code: 'over_max',
          message: `${card.name} exceeds catalogue maxCopies (${card.maxCopies}).`,
        })
      }
    }
    if (draft.leaderId) {
      const haveLeader = draft.owned[draft.leaderId] ?? 0
      if (haveLeader < 1) {
        issues.push({
          code: 'unowned_leader',
          message: `You do not own the selected leader.`,
        })
      }
    }
  }

  const unitCount = cards.filter(isUnitCard).length
  const specialCount = cards.filter(isSpecialCard).length

  if (unitCount < minUnits) {
    issues.push({
      code: 'min_units',
      message: `Need at least ${minUnits} unit cards (including heroes); have ${unitCount}.`,
    })
  }
  if (specialCount > maxSpecials) {
    issues.push({
      code: 'max_specials',
      message: `At most ${maxSpecials} special/weather cards; have ${specialCount}.`,
    })
  }

  return {
    ok: issues.length === 0,
    issues,
    unitCount,
    specialCount,
    totalCards: cards.length + (leader ? 1 : 0),
  }
}
