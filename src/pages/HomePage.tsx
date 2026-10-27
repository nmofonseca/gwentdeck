import { Link } from 'react-router-dom'
import { catalogueStats } from '../domain/catalogue'

export function HomePage() {
  const stats = catalogueStats()
  return (
    <div className="animate-rise">
      <section className="relative min-h-[min(90vh,54rem)] flex flex-col justify-end overflow-hidden border-b border-[var(--color-border)]">
        {/* Full-bleed atmospheric plane — original CC0 landscape */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(4,5,7,0.35) 0%, rgba(4,5,7,0.15) 35%, rgba(4,5,7,0.72) 78%, rgba(4,5,7,0.96) 100%), url('/atmosphere/forest-keep.webp')",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-40 mix-blend-soft-light"
          style={{
            backgroundImage: "url('/atmosphere/forest-path.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[url('/atmosphere/keep-silhouette.svg')] bg-bottom bg-no-repeat bg-[length:100%_auto] opacity-90 animate-mist"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.16] animate-fog"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.55\'/%3E%3C/svg%3E")',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--color-void)] via-[var(--color-void)]/80 to-transparent"
          aria-hidden
        />

        {/* Steel medallion — original heraldic mark, not CDPR wolf */}
        <div
          className="pointer-events-none absolute right-[7%] top-[16%] hidden md:flex h-56 w-56 items-center justify-center animate-ember"
          aria-hidden
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(224,180,74,0.2) 0%, transparent 62%)',
            }}
          />
          <div className="relative h-44 w-44 rounded-full border-2 border-[var(--color-border-bright)] bg-gradient-to-br from-[#1a2030] via-[#0c1018] to-[#05070c] shadow-[inset_0_2px_8px_rgba(197,208,222,0.15),0_0_0_1px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.65)]">
            <div className="absolute inset-3 rounded-full border border-[rgba(224,180,74,0.35)]" />
            <div className="absolute inset-6 rounded-full border border-[var(--color-border)]/70" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-4xl font-bold tracking-[0.18em] text-[var(--color-gold)] drop-shadow-[0_0_12px_rgba(224,180,74,0.45)]">
                G
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-28 md:pb-20">
          <p className="font-display text-5xl md:text-7xl font-bold text-[var(--color-gold)] leading-none mb-2 drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)]">
            GwentDeck
          </p>
          <span className="flourish" aria-hidden />
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--color-silver)] mb-3 max-w-xl">
            Enter the path. Mark your cards. Forge legal decks.
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

      <section className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-5">
        <div className="panel p-5">
          <h2 className="font-display text-xl font-semibold text-[var(--color-gold)] mb-2">
            Card Library
          </h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-3">
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
          <p className="text-sm text-[var(--color-ink-muted)] mb-3">
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
          <p className="text-sm text-[var(--color-ink-muted)] mb-3">
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
