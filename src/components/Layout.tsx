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
      <header className="border-b border-[var(--color-border)] bg-[var(--color-charcoal)]/92 text-[var(--color-ink)] backdrop-blur sticky top-0 z-20 shadow-[0_1px_0_rgba(197,208,222,0.06)]">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl md:text-3xl font-bold tracking-wide text-[var(--color-gold)] drop-shadow-[0_0_18px_rgba(224,180,74,0.35)]">
              GwentDeck
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-faint)]">
              Wolf medallion · TW3 minigame
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
                      ? 'border-[rgba(224,180,74,0.55)] bg-[var(--color-panel-raised)] text-[var(--color-gold)] font-semibold shadow-[0_0_14px_rgba(224,180,74,0.15)]'
                      : 'border-transparent hover:border-[var(--color-border)] hover:bg-white/5 text-[var(--color-ink-muted)] hover:text-[var(--color-silver)]',
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="text-xs text-[var(--color-ink-muted)]" aria-live="polite">
            Owned unique:{' '}
            <strong className="text-[var(--color-silver)]">{ownedUnique}</strong>
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

      <footer className="border-t border-[var(--color-border)] py-4 text-center text-xs text-[var(--color-ink-faint)] max-w-3xl mx-auto px-4 space-y-1">
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
