import type { Card, FactionId } from '../domain/types'

const FACTION_BG: Record<FactionId, string> = {
  northern_realms: 'from-[#3d5a80] to-[#1b2838]',
  nilfgaard: 'from-[#3a3a3a] to-[#1a1a1a]',
  scoiatael: 'from-[#3d6b3a] to-[#1e331c]',
  monsters: 'from-[#6b2a3a] to-[#2a1018]',
  skellige: 'from-[#2a4a6b] to-[#102030]',
  neutral: 'from-[#6b5a45] to-[#2e261c]',
}

const KIND_LABEL: Record<string, string> = {
  leader: 'Leader',
  unit: 'Unit',
  hero: 'Hero',
  special: 'Special',
  weather: 'Weather',
}

const ROW_LABEL: Record<string, string> = {
  close: 'Close',
  ranged: 'Ranged',
  siege: 'Siege',
  agile: 'Agile',
}

interface Props {
  card: Card
  qty?: number
  compact?: boolean
  selected?: boolean
  onClick?: () => void
}

export function GwentCard({ card, qty, compact, selected, onClick }: Props) {
  const Tag = onClick ? 'button' : 'article'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={[
        'animate-card text-left rounded-md border overflow-hidden shadow-sm transition',
        'border-black/20 text-parchment w-full',
        'bg-gradient-to-br',
        FACTION_BG[card.faction],
        selected ? 'ring-2 ring-[var(--color-gold)]' : '',
        onClick ? 'hover:brightness-110 cursor-pointer' : '',
        compact ? 'p-2 min-h-[5.5rem]' : 'p-3 min-h-[8.5rem]',
      ].join(' ')}
      aria-label={`${card.name}, ${KIND_LABEL[card.kind]}, ${card.strength ?? 'no'} strength`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className={`font-display font-semibold leading-tight ${compact ? 'text-sm' : 'text-base'}`}>
            {card.name}
          </div>
          <div className="mt-1 flex flex-wrap gap-1 text-[10px] uppercase tracking-wide opacity-90">
            <span className="rounded bg-black/35 px-1.5 py-0.5">{KIND_LABEL[card.kind]}</span>
            {card.row ? (
              <span className="rounded bg-black/35 px-1.5 py-0.5">{ROW_LABEL[card.row]}</span>
            ) : null}
            {card.abilities.slice(0, 3).map((a) => (
              <span key={a} className="rounded bg-black/35 px-1.5 py-0.5">
                {a.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {card.strength != null ? (
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-gold)] text-ink font-display text-lg font-bold"
              aria-hidden
            >
              {card.strength}
            </span>
          ) : (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-xs">
              —
            </span>
          )}
          {typeof qty === 'number' ? (
            <span className="text-xs bg-black/40 rounded px-1.5 py-0.5" aria-label={`Owned ${qty}`}>
              ×{qty}
            </span>
          ) : null}
        </div>
      </div>
      {!compact && card.abilityText ? (
        <p className="mt-2 text-xs leading-snug opacity-85 line-clamp-3">{card.abilityText}</p>
      ) : null}
    </Tag>
  )
}
