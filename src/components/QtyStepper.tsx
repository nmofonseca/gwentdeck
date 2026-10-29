import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  max: number
  onChange: (n: number) => void
  label: string
}

const stepBtn =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[var(--color-leather)] text-[var(--color-silver)] border border-[var(--color-border)] disabled:opacity-45 hover:border-[var(--color-bronze)] hover:text-[var(--color-ink)]'

export function QtyStepper({ value, max, onChange, label }: Props) {
  return (
    <div
      className="inline-flex h-8 items-center gap-1.5"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={stepBtn}
        disabled={value <= 0}
        onClick={() => onChange(value - 1)}
        aria-label={`Decrease ${label}`}
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <div className="inline-flex h-8 items-center gap-1 rounded-sm border border-[var(--color-border)] bg-[var(--color-leather)] px-1.5">
        <input
          type="number"
          min={0}
          max={max}
          value={value}
          aria-label={label}
          className="qty-field h-full w-7 border-0 bg-transparent p-0 text-center text-sm font-medium tabular-nums text-[var(--color-ink)] outline-none"
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span
          className="select-none text-xs font-medium tabular-nums text-[var(--color-ink-muted)]"
          aria-hidden="true"
        >
          / {max}
        </span>
      </div>
      <button
        type="button"
        className={stepBtn}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${label}`}
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}
