import { BookOpen, Layers, Library, Sparkles, Info } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useCollection } from '../persistence/CollectionContext'
import { countOwnedUnique } from '../persistence/collectionStore'

const links = [
  { to: '/', label: 'Home', icon: Sparkles, end: true },
  { to: '/catalogue', label: 'Catalogue', icon: Library },
  { to: '/collection', label: 'Collection', icon: Layers },
  { to: '/optimiser', label: 'Optimiser', icon: BookOpen },
  { to: '/about', label: 'About', icon: Info },
]

export function Layout() {
  const { state, warning, clearWarning } = useCollection()
  const ownedUnique = countOwnedUnique(state.owned)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/15 bg-ink/90 text-parchment backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl md:text-3xl font-bold tracking-wide text-[var(--color-gold)]">
              GwentDeck
            </span>
            <span className="hidden sm:inline text-xs uppercase tracking-[0.2em] opacity-70">
              TW3 minigame
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
                    'inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm transition',
                    isActive
                      ? 'bg-[var(--color-gold)] text-ink font-semibold'
                      : 'hover:bg-white/10 text-parchment/90',
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="text-xs opacity-80" aria-live="polite">
            Owned unique: <strong>{ownedUnique}</strong>
          </div>
        </div>
      </header>

      {warning ? (
        <div
          role="status"
          className="bg-ember/90 text-parchment px-4 py-2 text-sm flex justify-between gap-3"
        >
          <span>{warning}</span>
          <button type="button" className="underline" onClick={clearWarning}>
            Dismiss
          </button>
        </div>
      ) : null}

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-ink/10 py-4 text-center text-xs text-ink/60">
        Free &amp; open source · MIT · No accounts · Data stays in your browser
      </footer>
    </div>
  )
}
