import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  max: number
  onChange: (n: number) => void
  label: string
}

export function QtyStepper({ value, max, onChange, label }: Props) {
  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label={label}>
      <button
        type="button"
        className="h-8 w-8 rounded-sm bg-[var(--color-leather)] text-[var(--color-ink)] border border-[var(--color-border)] disabled:opacity-40 hover:border-[var(--color-bronze)]"
        disabled={value <= 0}
        onClick={() => onChange(value - 1)}
        aria-label={`Decrease ${label}`}
      >
        <Minus className="h-4 w-4 mx-auto" />
      </button>
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        aria-label={label}
        className="field w-12 text-center text-sm py-1"
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <button
        type="button"
        className="h-8 w-8 rounded-sm bg-[var(--color-leather)] text-[var(--color-ink)] border border-[var(--color-border)] disabled:opacity-40 hover:border-[var(--color-bronze)]"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${label}`}
      >
        <Plus className="h-4 w-4 mx-auto" />
      </button>
      <span className="text-xs text-[var(--color-ink-faint)] ml-1">/ {max}</span>
    </div>
  )
}
