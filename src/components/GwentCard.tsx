import { useState } from 'react'
import { cardArtPath } from '../domain/cardArt'
import type { Card, FactionId } from '../domain/types'

const FACTION_BG: Record<FactionId, string> = {
  northern_realms: 'from-[#2a4060] via-[#1a2838] to-[#0e141c]',
  nilfgaard: 'from-[#3a3830] via-[#242220] to-[#121110]',
  scoiatael: 'from-[#2f4a28] via-[#1c2e18] to-[#0e160c]',
  monsters: 'from-[#4a1f2e] via-[#2a1018] to-[#14080c]',
  skellige: 'from-[#1e3a5f] via-[#122030] to-[#0a121c]',
  neutral: 'from-[#4a4034] via-[#2a241c] to-[#14110c]',
}

const FACTION_EDGE: Record<FactionId, string> = {
  northern_realms: 'border-[#6a8ab0]/60',
  nilfgaard: 'border-[#c4a35a]/50',
  scoiatael: 'border-[#7a9a4a]/55',
  monsters: 'border-[#a84858]/55',
  skellige: 'border-[#5a8aba]/55',
  neutral: 'border-[#a89870]/50',
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
  /** User override URL; when omitted, bundled CC0 AI art is used. Pass null to force CSS-only. */
  imageUrl?: string | null
  onClick?: () => void
}

function CssArtFallback({ card, compact }: { card: Card; compact?: boolean }) {
  return (
    <div
      className={[
        'relative overflow-hidden border-b border-black/35',
        compact ? 'h-10' : 'h-16',
      ].join(' ')}
      aria-hidden
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-90 ${FACTION_BG[card.faction]}`} />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent, transparent 6px, rgba(0,0,0,0.35) 7px), radial-gradient(circle at 30% 40%, rgba(212,175,55,0.2), transparent 45%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute left-2 bottom-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]/70">
        {card.faction.replace(/_/g, ' ')}
      </div>
    </div>
  )
}

export function GwentCard({ card, qty, compact, selected, imageUrl, onClick }: Props) {
  const [artFailed, setArtFailed] = useState(false)
  const resolvedUrl = imageUrl === null ? null : (imageUrl ?? cardArtPath(card.id))
  const showArt = Boolean(resolvedUrl) && !artFailed
  const Tag = onClick ? 'button' : 'article'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={[
        'gwent-card-face animate-card text-left overflow-hidden transition group',
        'text-[var(--color-parchment)] w-full',
        'bg-gradient-to-br',
        FACTION_BG[card.faction],
        FACTION_EDGE[card.faction],
        selected ? 'ring-2 ring-[var(--color-candle)] ring-offset-1 ring-offset-[var(--color-void)]' : '',
        onClick ? 'hover:brightness-110 cursor-pointer' : '',
      ].join(' ')}
      aria-label={`${card.name}, ${KIND_LABEL[card.kind]}, ${card.strength ?? 'no'} strength`}
    >
      {showArt ? (
        <div
          className={[
            'relative overflow-hidden border-b border-black/40 bg-black/40',
            compact ? 'h-16' : 'h-28',
          ].join(' ')}
        >
          <img
            src={resolvedUrl!}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top opacity-90"
            onError={() => setArtFailed(true)}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
            aria-hidden
          />
        </div>
      ) : (
        <CssArtFallback card={card} compact={compact} />
      )}

      <div
        className={[
          'relative z-[1]',
          compact ? 'p-2 min-h-[4.5rem]' : 'p-3 min-h-[7.5rem]',
          'bg-gradient-to-b from-black/25 via-transparent to-[rgba(26,16,10,0.55)]',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div
              className={`font-display font-semibold leading-tight text-[var(--color-gold)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] ${compact ? 'text-sm' : 'text-base'}`}
            >
              {card.name}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] uppercase tracking-wide opacity-90">
              <span className="rounded-sm bg-[var(--color-wood-deep)]/80 px-1.5 py-0.5 border border-[var(--color-bronze)]/35">
                {KIND_LABEL[card.kind]}
              </span>
              {card.row ? (
                <span className="rounded-sm bg-[var(--color-felt-dim)]/80 px-1.5 py-0.5 border border-[var(--color-felt-bright)]/40">
                  {ROW_LABEL[card.row]}
                </span>
              ) : null}
              {card.abilities.slice(0, 3).map((a) => (
                <span
                  key={a}
                  className="rounded-sm bg-black/50 px-1.5 py-0.5 border border-[var(--color-bronze)]/25"
                >
                  {a.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {card.strength != null ? (
              <span
                className="gwent-card-strength inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-dim)] text-[var(--color-void)] font-display text-lg font-bold"
                aria-hidden
              >
                {card.strength}
              </span>
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-wood-deep)]/90 text-xs border border-[var(--color-bronze)]/40">
                —
              </span>
            )}
            {typeof qty === 'number' ? (
              <span
                className="text-xs bg-[var(--color-wood-deep)]/85 rounded-sm px-1.5 py-0.5 border border-[var(--color-bronze)]/35"
                aria-label={`Owned ${qty}`}
              >
                ×{qty}
              </span>
            ) : null}
          </div>
        </div>
        {!compact && card.abilityText ? (
          <p className="mt-2 rounded-sm border border-[var(--color-bronze)]/20 bg-[rgba(240,230,212,0.08)] px-2 py-1.5 text-xs leading-snug text-[var(--color-parchment)]/85 line-clamp-3">
            {card.abilityText}
          </p>
        ) : null}
      </div>
    </Tag>
  )
}
