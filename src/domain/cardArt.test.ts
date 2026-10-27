import { describe, expect, it } from 'vitest'
import { cardArtPath } from './cardArt'

describe('cardArtPath', () => {
  it('builds a webp URL under the Vite base path', () => {
    const path = cardArtPath('monsters-arachas')
    expect(path).toMatch(/\/card-art\/monsters-arachas\.webp$/)
    expect(path.startsWith('/')).toBe(true)
  })
})
