import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  max: number
  onChange: (n: number) => void
  label: string
  fitWidth?: boolean
}

const stepBtn =
  'qty-stepper-button inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[var(--color-leather)] text-[var(--color-silver)] border border-[var(--color-border)] disabled:opacity-45 hover:border-[var(--color-bronze)] hover:text-[var(--color-ink)] md:h-8 md:w-8'

function clampQty(raw: string, max: number): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') return 0
  if (!/^\d+$/.test(trimmed)) return null
  return Math.max(0, Math.min(max, Number(trimmed)))
}

export function QtyStepper({ value, max, onChange, label, fitWidth }: Props) {
  return (
    <div
      className={`qty-stepper inline-flex h-11 items-center md:h-8 ${fitWidth ? 'w-full gap-1 md:w-auto md:gap-1.5' : 'gap-1.5'}`}
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
      <div
        className={`qty-stepper-value inline-flex h-11 items-center justify-center rounded-sm border border-[var(--color-border)] bg-[var(--color-leather)] md:h-8 ${fitWidth ? 'min-w-0 flex-1 gap-1 px-1 md:min-w-[4rem] md:flex-none md:gap-1.5 md:px-2.5' : 'min-w-[4rem] gap-1.5 px-2.5'}`}
      >
        {/*
          text + inputMode (not type=number): Firefox paints native spinner
          arrows that overlap +/- and / max in a narrow field.
        */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={value}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          className="qty-field h-full w-6 border-0 bg-transparent p-0 text-center text-sm font-semibold tabular-nums text-[var(--color-ink)] outline-none"
          onChange={(e) => {
            const next = clampQty(e.target.value, max)
            if (next != null) onChange(next)
          }}
        />
        <span className="select-none text-sm font-medium tabular-nums text-[var(--color-silver)]">
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
