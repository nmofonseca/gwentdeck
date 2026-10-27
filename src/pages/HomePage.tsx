import { Link } from 'react-router-dom'
import { catalogueStats } from '../domain/catalogue'

export function HomePage() {
  const stats = catalogueStats()
  return (
    <div className="animate-rise">
      <section className="relative min-h-[min(88vh,52rem)] flex flex-col justify-end overflow-hidden border-b-2 border-[var(--color-wood-edge)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 20% 15%, rgba(255,176,96,0.18), transparent 50%), radial-gradient(ellipse 70% 55% at 75% 40%, rgba(26,58,40,0.28), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(212,120,48,0.1), transparent 50%), linear-gradient(125deg, #0e0a07 0%, #1a120c 35%, #241810 65%, #100c08 100%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'w\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.03 0.11\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23w)\' opacity=\'0.55\'/%3E%3C/svg%3E")',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-8 bottom-28 top-28 hidden md:block rounded felt-mat opacity-70"
          aria-hidden
        />
        <div
          className="gwent-card-face pointer-events-none absolute -right-8 top-16 hidden md:block h-72 w-52 rotate-6 bg-gradient-to-br from-[#2a4060] via-[#1a2838] to-[#0e141c] animate-ember opacity-95"
          aria-hidden
        >
          <div className="relative z-[1] m-3 h-[calc(100%-1.5rem)] rounded-sm border border-[var(--color-gold)]/40 bg-black/45 p-4">
            <div className="font-display text-[var(--color-gold)] text-xl">Foltest</div>
            <div className="mt-2 text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">
              Leader · Northern Realms
            </div>
            <div
              className="mt-6 h-20 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 40% 35%, rgba(255,176,96,0.4), transparent 55%), repeating-linear-gradient(135deg, transparent, transparent 5px, rgba(0,0,0,0.35) 6px)',
              }}
            />
            <div className="gwent-card-strength mt-4 h-14 w-14 rounded-full bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-dim)] text-[var(--color-void)] font-display text-2xl font-bold grid place-items-center">
              —
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-24 md:pb-20">
          <p className="font-display text-5xl md:text-7xl font-bold text-[var(--color-gold)] leading-none mb-4 drop-shadow-[0_0_24px_rgba(255,176,96,0.25)]">
            GwentDeck
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--color-ink)] mb-3 max-w-xl">
            Sit at the board. Own your cards.
          </h1>
          <p className="text-[var(--color-ink-muted)] mb-8 max-w-lg">
            Offline collection manager and deck optimiser for The Witcher 3 Gwent minigame — felt
            table, candlelight, five factions, neutrals, HoS &amp; BaW. No account. No server.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/collection" className="btn btn-primary">
              My Collection
            </Link>
            <Link to="/optimiser" className="btn btn-secondary">
              Deck Optimiser
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-6">
        <div className="panel p-5">
          <h2 className="font-display text-xl font-semibold text-[var(--color-gold)] mb-2">
            Card Library
          </h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-2">
            {stats.total} verified identities with strength, row, abilities, and acquisition notes.
          </p>
          <Link className="btn-ghost text-sm" to="/catalogue">
            Browse cards
          </Link>
        </div>
        <div className="panel p-5">
          <h2 className="font-display text-xl font-semibold text-[var(--color-gold)] mb-2">
            My Collection
          </h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-2">
            Mark quantities you own. Saved in this browser only — export anytime.
          </p>
          <Link className="btn-ghost text-sm" to="/collection">
            Manage owned cards
          </Link>
        </div>
        <div className="panel p-5">
          <h2 className="font-display text-xl font-semibold text-[var(--color-gold)] mb-2">
            Deck Optimiser
          </h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-2">
            Choose faction and strategy, generate a legal owned-only deck with explanations.
          </p>
          <Link className="btn-ghost text-sm" to="/optimiser">
            Open optimiser
          </Link>
        </div>
      </section>
    </div>
  )
}
