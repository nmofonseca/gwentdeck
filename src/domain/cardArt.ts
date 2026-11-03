/** Bundled TW3 card face, relative to the Vite base. See NOTICE-ART.md for credits. */
export function cardArtPath(cardId: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  return `${base}card-faces/${cardId}.webp`
}
