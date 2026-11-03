import { afterEach, describe, expect, it, vi } from 'vitest'
import { cardArtPath } from './cardArt'

afterEach(() => vi.unstubAllEnvs())

describe('cardArtPath', () => {
  it('uses bundled card faces in production', () => {
    vi.stubEnv('DEV', false)
    expect(cardArtPath('monsters-arachas')).toBe('/card-faces/monsters-arachas.webp')
  })

  it('respects the configured base path', () => {
    vi.stubEnv('BASE_URL', '/preview/')
    expect(cardArtPath('monsters-arachas')).toBe('/preview/card-faces/monsters-arachas.webp')
  })
})
