import { Link } from 'react-router-dom'
import { catalogueStats } from '../domain/catalogue'

export function HomePage() {
  const stats = catalogueStats()
  return (
    <div className="animate-rise space-y-10">
      <section className="relative overflow-hidden rounded-xl border border-ink/10 bg-ink text-parchment min-h-[70vh] flex flex-col justify-end">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 70% 30%, rgba(196,163,90,0.45), transparent 40%), linear-gradient(120deg, #1a1410 0%, #2f4a3a 55%, #1a1410 100%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 11px, #fff 12px), repeating-linear-gradient(90deg, transparent, transparent 11px, #fff 12px)',
          }}
          aria-hidden
        />
        <div className="relative z-10 p-8 md:p-14 max-w-2xl">
          <p className="font-display text-5xl md:text-7xl font-bold text-[var(--color-gold)] leading-none mb-4">
            GwentDeck
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mb-3">
            Own your cards. Build legal decks.
          </h1>
          <p className="text-parchment/85 mb-8 max-w-lg">
            A free, offline collection manager and deck optimiser for The Witcher 3 Gwent minigame —
            all five factions, neutrals, HoS &amp; BaW. No account. No server.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/collection"
              className="rounded bg-[var(--color-gold)] text-ink px-5 py-2.5 font-semibold hover:brightness-105"
            >
              Track collection
            </Link>
            <Link
              to="/optimiser"
              className="rounded border border-parchment/40 px-5 py-2.5 hover:bg-white/10"
            >
              Optimise a deck
            </Link>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold mb-2">Catalogue</h2>
          <p className="text-sm text-ink/75 mb-2">
            {stats.total} verified card identities with strength, row, abilities, and acquisition notes.
          </p>
          <Link className="text-sm font-semibold text-ember underline" to="/catalogue">
            Browse cards
          </Link>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold mb-2">Collection</h2>
          <p className="text-sm text-ink/75 mb-2">
            Mark quantities you own. Saved in this browser only — export anytime.
          </p>
          <Link className="text-sm font-semibold text-ember underline" to="/collection">
            Manage owned cards
          </Link>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold mb-2">Optimiser</h2>
          <p className="text-sm text-ink/75 mb-2">
            Generate a legal owned-only deck with explanations and a missing-card roadmap.
          </p>
          <Link className="text-sm font-semibold text-ember underline" to="/optimiser">
            Open optimiser
          </Link>
        </div>
      </section>
    </div>
  )
}
