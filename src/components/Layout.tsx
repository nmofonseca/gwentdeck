import { BookOpen, Layers, Library, LayoutDashboard, Info } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useCollection } from '../persistence/CollectionContext'
import { countOwnedUnique } from '../persistence/collectionStore'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/catalogue', label: 'Card Library', icon: Library },
  { to: '/collection', label: 'My Collection', icon: Layers },
  { to: '/optimiser', label: 'Deck Optimiser', icon: BookOpen },
  { to: '/about', label: 'About', icon: Info },
]

export function Layout() {
  const { state, warning, clearWarning } = useCollection()
  const ownedUnique = countOwnedUnique(state.owned)

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="border-b-2 border-[var(--color-wood-edge)] text-[var(--color-ink)] sticky top-0 z-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(42,30,20,0.97), rgba(20,14,10,0.98)), radial-gradient(ellipse 60% 120% at 10% 0%, rgba(255,176,96,0.1), transparent 55%)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(26,58,40,0.35)',
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl md:text-3xl font-bold tracking-wide text-[var(--color-gold)] drop-shadow-[0_0_12px_rgba(255,176,96,0.25)]">
              GwentDeck
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-faint)]">
              TW3 minigame · tavern table
            </span>
          </div>
          <nav className="flex flex-wrap gap-1" aria-label="Primary">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-sm transition border',
                    isActive
                      ? 'bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-dim)] text-[var(--color-void)] font-semibold border-[var(--color-bronze)]/50 shadow-[0_0_12px_rgba(255,176,96,0.2)]'
                      : 'border-transparent hover:border-[var(--color-wood-edge)] hover:bg-[var(--color-wood)]/40 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]',
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="text-xs text-[var(--color-ink-muted)]" aria-live="polite">
            Owned unique: <strong className="text-[var(--color-gold)]">{ownedUnique}</strong>
          </div>
        </div>
      </header>

      {warning ? (
        <div
          role="status"
          className="bg-[var(--color-crimson)]/90 text-[var(--color-ink)] px-4 py-2 text-sm flex justify-between gap-3"
        >
          <span>{warning}</span>
          <button type="button" className="underline" onClick={clearWarning}>
            Dismiss
          </button>
        </div>
      ) : null}

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="border-t-2 border-[var(--color-wood-edge)] py-4 text-center text-xs text-[var(--color-ink-faint)] max-w-3xl mx-auto px-4 space-y-1">
        <div>
          Unofficial fan project · MIT · Card art CC0 · No accounts · Data stays in your browser
        </div>
        <div>
          Not approved or endorsed by CD PROJEKT RED. The Witcher and Gwent are trademarks of their
          respective owners.
        </div>
      </footer>
    </div>
  )
}
