import { useMemo, useState } from 'react'
import { GwentCard } from '../components/GwentCard'
import { factionLabel, playableFactions } from '../domain/catalogue'
import { recommendDeck, STRATEGY_LABELS } from '../domain/recommend'
import type { PlayableFaction, StrategyId } from '../domain/types'
import { useCollection } from '../persistence/CollectionContext'

export function OptimiserPage() {
  const { state, saveDeck } = useCollection()
  const [faction, setFaction] = useState<PlayableFaction>('northern_realms')
  const [strategy, setStrategy] = useState<StrategyId>('balanced')
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  const result = useMemo(
    () => recommendDeck(faction, state.owned, strategy),
    [faction, strategy, state.owned],
  )

  function onSave() {
    if (!result.leader) {
      setSavedMsg('Cannot save: no owned leader.')
      return
    }
    const id = `deck-${Date.now()}`
    saveDeck({
      id,
      name: `${factionLabel(faction)} ${STRATEGY_LABELS[strategy].name}`,
      faction,
      strategy,
      leaderId: result.leader.id,
      cardIds: result.cards.map((c) => c.id),
      createdAt: new Date().toISOString(),
      notes: result.explanations.slice(0, 5).join('\n'),
    })
    setSavedMsg('Deck saved to this browser.')
  }

  function onExport() {
    const payload = {
      name: `${factionLabel(faction)} ${STRATEGY_LABELS[strategy].name}`,
      faction,
      strategy,
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
    a.download = `gwentdeck-${faction}-${strategy}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="animate-rise space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Deck optimiser</h1>
        <p className="text-sm text-ink/70">
          Builds a legal deck from cards you own. Nothing unowned is added.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 items-end">
        <label className="text-sm">
          <span className="block text-xs uppercase tracking-wide text-ink/60 mb-1">Faction</span>
          <select
            value={faction}
            onChange={(e) => setFaction(e.target.value as PlayableFaction)}
            className="rounded border border-ink/20 bg-parchment/70 px-3 py-2"
          >
            {playableFactions.map((f) => (
              <option key={f} value={f}>
                {factionLabel(f)}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="text-sm">
          <legend className="text-xs uppercase tracking-wide text-ink/60 mb-1">Strategy</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STRATEGY_LABELS) as StrategyId[]).map((s) => (
              <label
                key={s}
                className={[
                  'rounded border px-3 py-2 cursor-pointer',
                  strategy === s
                    ? 'border-ink bg-ink text-parchment'
                    : 'border-ink/20 bg-parchment/60',
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
          <p className="mt-1 text-xs text-ink/60">{STRATEGY_LABELS[strategy].blurb}</p>
        </fieldset>
      </div>

      <div
        className={[
          'rounded border px-4 py-3 text-sm',
          result.legality.ok
            ? 'border-moss/40 bg-moss/10'
            : 'border-ember/40 bg-ember/10',
        ].join(' ')}
        role="status"
      >
        {result.legality.ok ? (
          <p>
            Legal deck · {result.legality.unitCount} units · {result.legality.specialCount} specials
            · total {result.legality.totalCards}
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
        <button
          type="button"
          onClick={onSave}
          className="rounded bg-ink text-parchment px-4 py-2 text-sm font-medium"
        >
          Save deck
        </button>
        <button
          type="button"
          onClick={onExport}
          className="rounded border border-ink/30 px-4 py-2 text-sm"
        >
          Export JSON
        </button>
        {savedMsg ? <span className="text-sm self-center text-ink/70">{savedMsg}</span> : null}
      </div>

      <section className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">Leader &amp; cards</h2>
          {result.leader ? (
            <GwentCard card={result.leader} />
          ) : (
            <p className="text-sm text-ember">No owned leader for this faction.</p>
          )}
          <ul className="grid sm:grid-cols-2 gap-2 list-none p-0 m-0">
            {result.cards.map((card, idx) => (
              <li key={`${card.id}-${idx}`}>
                <GwentCard card={card} compact />
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">Why these cards</h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-ink/80">
              {result.explanations.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">Missing-card roadmap</h2>
            <p className="text-xs text-ink/60 mb-2">
              Highest-value cards you do not fully own for this strategy.
            </p>
            <ul className="space-y-2">
              {result.missing.map((m) => (
                <li
                  key={m.card.id}
                  className="rounded border border-ink/10 bg-parchment/50 px-3 py-2 text-sm"
                >
                  <div className="font-medium">{m.card.name}</div>
                  <div className="text-xs text-ink/60">{m.reason}</div>
                  {m.card.sources[0] ? (
                    <div className="text-[11px] text-ink/45 mt-1">{m.card.sources[0]}</div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
