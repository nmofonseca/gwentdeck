import { catalogue, catalogueStats } from '../domain/catalogue'

export function AboutPage() {
  const stats = catalogueStats()
  return (
    <div className="animate-rise prose-like max-w-3xl space-y-6 text-sm leading-relaxed">
      <h1 className="font-display text-3xl font-bold">About GwentDeck</h1>
      <p>
        GwentDeck helps you track your <em>The Witcher 3: Wild Hunt</em> Gwent collection and build
        legal decks from cards you actually own. It is free, open source (MIT), and runs entirely in
        your browser — no accounts, no backend, no tracking.
      </p>
      <p>
        This tool covers the <strong>in-game minigame only</strong>, including Hearts of Stone and
        Blood and Wine (Skellige). It is not for the standalone GWENT client.
      </p>

      <h2 className="font-display text-2xl font-semibold">Deck rules used</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Exactly 1 leader of the chosen faction</li>
        <li>At least {catalogue.rules.minUnits} unit cards (heroes count)</li>
        <li>At most {catalogue.rules.maxSpecials} special cards (weather included)</li>
        <li>Units must be faction or Neutral</li>
        <li>Recommendations never add unowned cards</li>
      </ul>

      <h2 className="font-display text-2xl font-semibold">Catalogue</h2>
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

      <h2 className="font-display text-2xl font-semibold">Art &amp; trademarks</h2>
      <p>
        Card faces in this app are CSS reconstructions (faction colours, strength, ability badges).
        Official CDPR card art is not redistributed. The Witcher and Gwent are trademarks of their
        respective owners; this is an unofficial fan project.
      </p>

      <h2 className="font-display text-2xl font-semibold">Privacy</h2>
      <p>
        Your collection and saved decks live in <code>localStorage</code> on this device. Export JSON
        backups if you switch browsers.
      </p>
    </div>
  )
}
