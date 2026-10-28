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
        'gwent-card-art relative overflow-hidden border-b border-black/35',
        compact ? 'aspect-[16/10]' : 'aspect-[3/4]',
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
        'gwent-card animate-card text-left overflow-hidden transition group',
        'text-[var(--color-parchment)] w-full',
        'bg-gradient-to-br',
        FACTION_BG[card.faction],
        FACTION_EDGE[card.faction],
        selected ? 'ring-2 ring-[var(--color-gold)] shadow-[0_0_20px_rgba(224,180,74,0.22)]' : '',
        onClick ? 'hover:brightness-110 cursor-pointer' : '',
      ].join(' ')}
      aria-label={`${card.name}, ${KIND_LABEL[card.kind]}, ${card.strength ?? 'no'} strength`}
    >
      {showArt ? (
        <div
          className={[
            'gwent-card-art relative overflow-hidden border-b border-black/40 bg-black/50',
            compact ? 'aspect-[16/10]' : 'aspect-[3/4]',
          ].join(' ')}
        >
          <img
            src={resolvedUrl!}
            alt=""
            loading="lazy"
            decoding="async"
            className="gwent-card-art-img absolute inset-0 h-full w-full object-cover object-center"
            onError={() => setArtFailed(true)}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
            aria-hidden
          />
        </div>
      ) : (
        <CssArtFallback card={card} compact={compact} />
      )}

      <div
        className={[
          'gwent-card-body relative z-[1]',
          compact ? 'p-2 min-h-[3.75rem]' : 'p-3 min-h-[5.5rem]',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div
              className={`font-display font-semibold leading-tight text-[var(--color-gold)] ${compact ? 'text-sm' : 'text-base'}`}
            >
              {card.name}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] uppercase tracking-wide opacity-90">
              <span className="rounded-sm bg-black/50 px-1.5 py-0.5 border border-[var(--color-gold)]/25">
                {KIND_LABEL[card.kind]}
              </span>
              {card.row ? (
                <span className="rounded-sm bg-black/50 px-1.5 py-0.5 border border-[var(--color-gold)]/25">
                  {ROW_LABEL[card.row]}
                </span>
              ) : null}
              {card.abilities.slice(0, 3).map((a) => (
                <span
                  key={a}
                  className="rounded-sm bg-black/50 px-1.5 py-0.5 border border-[var(--color-gold)]/25"
                >
                  {a.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {card.strength != null ? (
              <span
                className="medallion-disc inline-flex h-8 w-8 items-center justify-center rounded-full font-display text-lg font-bold"
                aria-hidden
              >
                {card.strength}
              </span>
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-xs border border-[var(--color-border-bright)]/40 text-[var(--color-silver)]">
                —
              </span>
            )}
            {typeof qty === 'number' ? (
              <span
                className="text-xs bg-black/50 rounded-sm px-1.5 py-0.5 border border-[var(--color-gold)]/25"
                aria-label={`Owned ${qty}`}
              >
                ×{qty}
              </span>
            ) : null}
          </div>
        </div>
        {!compact && card.abilityText ? (
          <p className="mt-2 text-xs leading-snug text-[var(--color-parchment)]/85 line-clamp-3">
            {card.abilityText}
          </p>
        ) : null}
      </div>
    </Tag>
  )
}
