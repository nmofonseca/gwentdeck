import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import type { Card } from '../domain/types'
import { GwentCard } from './GwentCard'

interface Props {
  card: Card
  imageUrl?: string
  onClose: () => void
}

export function CardDetailsDialog({ card, imageUrl, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      className="card-details-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded border border-[var(--color-border-bright)] bg-[var(--color-void)] p-4 text-[var(--color-parchment)] shadow-2xl"
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <h2 id={titleId} className="font-display text-xl font-semibold text-[var(--color-gold)]">
          {card.name}
        </h2>
        <button
          type="button"
          autoFocus
          onClick={() => dialogRef.current?.close()}
          aria-label="Close card details"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-leather)]"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </header>
      <div className="mx-auto max-w-[17rem]">
        <GwentCard card={card} imageUrl={imageUrl} />
      </div>
      {card.sources[0] && (
        <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{card.sources[0]}</p>
      )}
    </dialog>
  )
}
