import { Link } from 'react-router-dom'
import { catalogueStats } from '../domain/catalogue'

export function HomePage() {
  const stats = catalogueStats()
  return (
    <div className="animate-rise">
      <section className="relative min-h-[min(88vh,52rem)] flex flex-col justify-end overflow-hidden border-b border-[var(--color-border)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 72% 35%, rgba(166,124,61,0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 15% 70%, rgba(143,47,42,0.12), transparent 50%), linear-gradient(125deg, #080705 0%, #161210 40%, #1a1410 70%, #0c0a08 100%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.55\'/%3E%3C/svg%3E")',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-8 top-16 hidden md:block h-72 w-52 rotate-6 rounded border border-[var(--color-bronze)]/40 bg-gradient-to-br from-[#2a4060] to-[#0e141c] shadow-[0_20px_60px_rgba(0,0,0,0.55)] animate-ember"
          aria-hidden
        >
          <div className="m-3 h-full rounded-sm border border-[var(--color-gold)]/25 bg-black/25 p-4">
            <div className="font-display text-[var(--color-gold)] text-xl">Foltest</div>
            <div className="mt-2 text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">
              Leader · Northern Realms
            </div>
            <div className="mt-8 h-16 w-16 rounded-full bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-dim)] text-[var(--color-void)] font-display text-3xl font-bold grid place-items-center">
              —
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-24 md:pb-20">
          <p className="font-display text-5xl md:text-7xl font-bold text-[var(--color-gold)] leading-none mb-4">
            GwentDeck
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--color-ink)] mb-3 max-w-xl">
            Own your cards. Build legal decks.
          </h1>
          <p className="text-[var(--color-ink-muted)] mb-8 max-w-lg">
            Offline collection manager and deck optimiser for The Witcher 3 Gwent minigame — five
            factions, neutrals, HoS &amp; BaW. No account. No server.
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

      <section className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-8">
        <div>
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
        <div>
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
        <div>
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
