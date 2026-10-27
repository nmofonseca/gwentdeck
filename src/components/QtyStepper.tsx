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
        className="h-8 w-8 rounded bg-ink/80 text-parchment disabled:opacity-40"
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
        className="w-12 rounded border border-ink/20 bg-parchment/80 text-center text-sm py-1"
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <button
        type="button"
        className="h-8 w-8 rounded bg-ink/80 text-parchment disabled:opacity-40"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${label}`}
      >
        <Plus className="h-4 w-4 mx-auto" />
      </button>
      <span className="text-xs text-ink/50 ml-1">/ {max}</span>
    </div>
  )
}
