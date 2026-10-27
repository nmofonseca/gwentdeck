/** Public path for original AI card art (webp), relative to Vite `base`. */
export function cardArtPath(cardId: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  return `${base}card-art/${cardId}.webp`
}
