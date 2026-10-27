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
      <header className="border-b border-[var(--color-bronze)]/45 bg-[var(--color-charcoal)]/95 text-[var(--color-ink)] backdrop-blur sticky top-0 z-20 shadow-[0_1px_0_rgba(212,175,55,0.12)]">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl md:text-3xl font-bold tracking-wide text-[var(--color-gold)]">
              GwentDeck
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-faint)]">
              TW3 minigame · tavern ledger
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
                    'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-sm transition border border-transparent',
                    isActive
                      ? 'bg-gradient-to-b from-[var(--color-parchment)] to-[var(--color-parchment-deep)] text-[var(--color-ledger-ink)] font-semibold border-[var(--color-bronze)]/50 shadow-[inset_0_1px_0_rgba(255,245,220,0.4)]'
                      : 'hover:bg-[var(--color-leather)]/40 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-border)]',
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
