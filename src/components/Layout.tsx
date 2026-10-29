import { useEffect, useId, useState } from 'react'
import { BookOpen, Layers, Library, LayoutDashboard, Info, Menu, X } from 'lucide-react'
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

function navLinkClass(isActive: boolean): string {
  return [
    'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-sm transition border',
    isActive
      ? 'border-[rgba(168,144,88,0.55)] bg-gradient-to-b from-[var(--color-parchment)] to-[var(--color-parchment-deep)] text-[var(--color-ledger-ink)] font-semibold shadow-[inset_0_1px_0_rgba(255,245,220,0.4),0_0_12px_rgba(224,180,74,0.12)]'
      : 'border-transparent hover:border-[var(--color-border)] hover:bg-white/5 text-[var(--color-ink-muted)] hover:text-[var(--color-silver)]',
  ].join(' ')
}

export function Layout() {
  const { state, warning, clearWarning } = useCollection()
  const ownedUnique = countOwnedUnique(state.owned)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(4,5,7,0.55), rgba(4,5,7,0.85)), url('/atmosphere/forest-path.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-48 bg-[url('/atmosphere/keep-silhouette.svg')] bg-bottom bg-no-repeat bg-[length:120%_auto] opacity-40"
        aria-hidden
      />
      <header className="relative z-20 border-b border-[var(--color-border)] bg-[var(--color-charcoal)]/94 text-[var(--color-ink)] backdrop-blur sticky top-0 pt-[env(safe-area-inset-top,0px)] shadow-[0_1px_0_rgba(197,208,222,0.08)]">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-baseline gap-3 md:flex-initial">
            <span className="font-display text-2xl md:text-3xl font-bold tracking-wide text-[var(--color-gold)] drop-shadow-[0_0_16px_rgba(224,180,74,0.3)]">
              GwentDeck
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-faint)]">
              Steel &amp; parchment · TW3 minigame
            </span>
          </div>

          {/* Desktop primary nav — unchanged at md+ */}
          <nav className="hidden md:flex flex-wrap gap-1" aria-label="Primary">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => navLinkClass(isActive)}>
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-xs text-[var(--color-ink-muted)]" aria-live="polite">
              Owned unique:{' '}
              <strong className="text-[var(--color-silver)]">{ownedUnique}</strong>
            </div>
            <button
              type="button"
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[var(--color-border)] bg-[var(--color-leather)] text-[var(--color-silver)] hover:border-[var(--color-bronze)] hover:text-[var(--color-ink)]"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>

        {/* Compact mobile / fold-cover nav */}
        {menuOpen ? (
          <nav
            id={menuId}
            className="md:hidden border-t border-[var(--color-border)] px-4 py-2"
            aria-label="Primary"
          >
            <ul className="flex flex-col gap-1 list-none p-0 m-0">
              {links.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `${navLinkClass(isActive)} min-h-11 w-full justify-start px-3`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
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

      <main className="relative z-10 flex-1 w-full">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-[var(--color-border)] py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] text-center text-xs text-[var(--color-ink-faint)] max-w-3xl mx-auto px-4 space-y-1">
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
