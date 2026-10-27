import { catalogue, catalogueStats } from '../domain/catalogue'

export function AboutPage() {
  const stats = catalogueStats()
  return (
    <div className="animate-rise mx-auto max-w-3xl px-4 py-6 space-y-6 text-sm leading-relaxed text-[var(--color-ink-muted)]">
      <h1 className="font-display text-3xl font-bold text-[var(--color-gold)]">About GwentDeck</h1>
      <p>
        GwentDeck helps you track your <em className="text-[var(--color-ink)]">The Witcher 3: Wild
        Hunt</em>{' '}
        Gwent collection and build legal decks from cards you actually own. It is free, open source
        (MIT), and runs entirely in your browser — no accounts, no backend, no tracking.
      </p>
      <p>
        This tool covers the{' '}
        <strong className="text-[var(--color-ink)]">in-game minigame only</strong>, including Hearts
        of Stone and Blood and Wine (Skellige). It is not for the standalone GWENT client.
      </p>

      <h2 className="font-display text-2xl font-semibold text-[var(--color-gold)]">
        How to build a deck
      </h2>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-[var(--color-ink)]">My Collection / Card Library</strong> — mark
          owned cards and quantities (or load the sample NR set).
        </li>
        <li>
          <strong className="text-[var(--color-ink)]">Deck Optimiser</strong> — choose a faction (or
          Auto) and a strategy, then press <em>Generate</em>.
        </li>
        <li>
          Review the recommended deck, explanations, and missing-card roadmap; optionally{' '}
          <em>Save deck</em> to My Decks.
        </li>
      </ol>

      <h2 className="font-display text-2xl font-semibold text-[var(--color-gold)]">
        Deck rules used
      </h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Exactly 1 leader of the chosen faction</li>
        <li>At least {catalogue.rules.minUnits} unit cards (heroes count)</li>
        <li>At most {catalogue.rules.maxSpecials} special cards (weather included)</li>
        <li>Units must be faction or Neutral</li>
        <li>Recommendations never add unowned cards</li>
      </ul>

      <h2 className="font-display text-2xl font-semibold text-[var(--color-gold)]">Card Library</h2>
      <p>
        {stats.total} card identities loaded. Leaders: {stats.byKind.leader ?? 0}. Data is compiled
        from open community sources and cross-checked; names and stats are derived from Witcher Wiki
        material (CC BY-SA).
      </p>
      <ul className="list-disc pl-5 space-y-1">
        {catalogue.sources.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h2 className="font-display text-2xl font-semibold text-[var(--color-gold)]">
        Art &amp; trademarks
      </h2>
      <p>
        Card faces are CSS / procedural reconstructions (faction colours, strength, ability badges).
        Official CDPR card art is <strong className="text-[var(--color-ink)]">not</strong>{' '}
        redistributed, and the app does not scrape or vendor wiki/fan lookalikes. You may optionally
        supply your own local image URLs under My Collection if you hold the rights. The Witcher and
        Gwent are trademarks of their respective owners; this is an unofficial fan project.
      </p>

      <h2 className="font-display text-2xl font-semibold text-[var(--color-gold)]">Privacy</h2>
      <p>
        Your collection, saved decks, and optional image map live in{' '}
        <code className="text-[var(--color-bronze)]">localStorage</code> on this device. Export JSON
        backups if you switch browsers.
      </p>
    </div>
  )
}
