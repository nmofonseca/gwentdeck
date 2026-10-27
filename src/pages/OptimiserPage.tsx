import { useMemo, useState } from 'react'
import { GwentCard } from '../components/GwentCard'
import { catalogue, factionLabel, playableFactions } from '../domain/catalogue'
import { recommendDeck, STRATEGY_LABELS } from '../domain/recommend'
import type { PlayableFaction, StrategyId } from '../domain/types'
import { useCollection } from '../persistence/CollectionContext'

type FactionChoice = PlayableFaction | 'auto'

function pickAutoFaction(owned: Record<string, number>): PlayableFaction {
  const scores = Object.fromEntries(playableFactions.map((f) => [f, 0])) as Record<
    PlayableFaction,
    number
  >
  for (const card of catalogue.cards) {
    const qty = owned[card.id] ?? 0
    if (qty <= 0) continue
    if (card.faction === 'neutral') {
      for (const f of playableFactions) scores[f] += qty * 0.35
      continue
    }
    if (card.faction in scores) {
      scores[card.faction as PlayableFaction] += qty * (card.kind === 'leader' ? 8 : 1)
    }
  }
  return playableFactions.reduce((best, f) => (scores[f] > scores[best] ? f : best))
}

export function OptimiserPage() {
  const { state, saveDeck, getImageUrl } = useCollection()
  const [factionChoice, setFactionChoice] = useState<FactionChoice>('auto')
  const [strategy, setStrategy] = useState<StrategyId>('balanced')
  const [generated, setGenerated] = useState<{
    faction: PlayableFaction
    strategy: StrategyId
  } | null>(null)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  const result = useMemo(() => {
    if (!generated) return null
    return recommendDeck(generated.faction, state.owned, generated.strategy)
  }, [generated, state.owned])

  function onGenerate() {
    const faction =
      factionChoice === 'auto' ? pickAutoFaction(state.owned) : factionChoice
    setGenerated({ faction, strategy })
    setSavedMsg(null)
  }

  function onSave() {
    if (!result?.leader || !generated) {
      setSavedMsg('Cannot save: no owned leader.')
      return
    }
    const id = `deck-${Date.now()}`
    saveDeck({
      id,
      name: `${factionLabel(generated.faction)} ${STRATEGY_LABELS[generated.strategy].name}`,
      faction: generated.faction,
      strategy: generated.strategy,
      leaderId: result.leader.id,
      cardIds: result.cards.map((c) => c.id),
      createdAt: new Date().toISOString(),
      notes: result.explanations.slice(0, 5).join('\n'),
    })
    setSavedMsg('Deck saved to My Decks.')
  }

  function onExport() {
    if (!result || !generated) return
    const payload = {
      name: `${factionLabel(generated.faction)} ${STRATEGY_LABELS[generated.strategy].name}`,
      faction: generated.faction,
      strategy: generated.strategy,
      leader: result.leader,
      cards: result.cards,
      explanations: result.explanations,
      legality: result.legality,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gwentdeck-${generated.faction}-${generated.strategy}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="animate-rise mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-[var(--color-silver)]">
          Deck Optimiser
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Choose a faction (or Auto) and strategy, then Generate. Only cards you own are used.
        </p>
      </header>

      <div className="panel p-4 flex flex-wrap gap-4 items-end">
        <label className="text-sm">
          <span className="label-caps">Faction</span>
          <select
            value={factionChoice}
            onChange={(e) => setFactionChoice(e.target.value as FactionChoice)}
            className="field"
          >
            <option value="auto">Auto (best from collection)</option>
            {playableFactions.map((f) => (
              <option key={f} value={f}>
                {factionLabel(f)}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="text-sm">
          <legend className="label-caps">Strategy</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STRATEGY_LABELS) as StrategyId[]).map((s) => (
              <label
                key={s}
                className={[
                  'rounded-sm border px-3 py-2 cursor-pointer transition',
                  strategy === s
                    ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/15 text-[var(--color-gold)]'
                    : 'border-[var(--color-border)] bg-[var(--color-void)]/40 text-[var(--color-ink-muted)] hover:border-[var(--color-bronze)]',
                ].join(' ')}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="strategy"
                  checked={strategy === s}
                  onChange={() => setStrategy(s)}
                />
                <span className="font-medium">{STRATEGY_LABELS[s].name}</span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
            {STRATEGY_LABELS[strategy].blurb}
          </p>
        </fieldset>
        <button type="button" className="btn btn-primary" onClick={onGenerate}>
          Generate
        </button>
      </div>

      {!result ? (
        <p className="text-sm text-[var(--color-ink-muted)] panel px-4 py-6 text-center">
          Mark owned cards in My Collection, then press Generate to build a recommended deck.
        </p>
      ) : (
        <>
          <div
            className={[
              'rounded-sm border px-4 py-3 text-sm',
              result.legality.ok
                ? 'border-[var(--color-moss)]/50 bg-[var(--color-moss)]/10'
                : 'border-[var(--color-crimson)]/50 bg-[var(--color-crimson)]/10',
            ].join(' ')}
            role="status"
          >
            <p className="text-xs text-[var(--color-ink-faint)] mb-1">
              {factionLabel(generated!.faction)}
              {factionChoice === 'auto' ? ' (auto)' : ''} ·{' '}
              {STRATEGY_LABELS[generated!.strategy].name}
            </p>
            {result.legality.ok ? (
              <p>
                Legal deck · {result.legality.unitCount} units · {result.legality.specialCount}{' '}
                specials · total {result.legality.totalCards}
              </p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {result.legality.issues.map((i) => (
                  <li key={i.code + i.message}>{i.message}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onSave} className="btn btn-primary">
              Save deck
            </button>
            <button type="button" onClick={onExport} className="btn btn-secondary">
              Export JSON
            </button>
            {savedMsg ? (
              <span className="text-sm self-center text-[var(--color-ink-muted)]">{savedMsg}</span>
            ) : null}
          </div>

          <section className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[var(--color-silver)]">
                Leader &amp; cards
              </h2>
              {result.leader ? (
                <GwentCard card={result.leader} imageUrl={getImageUrl(result.leader.id)} />
              ) : (
                <p className="text-sm text-[var(--color-crimson-bright)]">
                  No owned leader for this faction.
                </p>
              )}
              <ul className="grid sm:grid-cols-2 gap-2 list-none p-0 m-0">
                {result.cards.map((card, idx) => (
                  <li key={`${card.id}-${idx}`}>
                    <GwentCard card={card} compact imageUrl={getImageUrl(card.id)} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[var(--color-silver)] mb-2">
                  Why these cards
                </h2>
                <ol className="list-decimal pl-5 space-y-1.5 text-sm text-[var(--color-ink-muted)]">
                  {result.explanations.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-[var(--color-gold)] mb-2">
                  Missing-card roadmap
                </h2>
                <p className="text-xs text-[var(--color-ink-faint)] mb-2">
                  Highest-value cards you do not fully own for this strategy.
                </p>
                <ul className="space-y-2">
                  {result.missing.map((m) => (
                    <li key={m.card.id} className="panel px-3 py-2 text-sm">
                      <div className="font-medium text-[var(--color-ink)]">{m.card.name}</div>
                      <div className="text-xs text-[var(--color-ink-muted)]">{m.reason}</div>
                      {m.card.sources[0] ? (
                        <div className="text-[11px] text-[var(--color-ink-faint)] mt-1">
                          {m.card.sources[0]}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
