import { afterEach, describe, expect, it } from 'vitest'
import {
  IMAGE_OVERRIDES_KEY,
  importImageOverridesJson,
  isAllowedImageUrl,
  sanitizeImageOverrides,
  setImageOverride,
} from './imageOverrides'

describe('imageOverrides', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('allows https and data:image URLs only', () => {
    expect(isAllowedImageUrl('https://example.com/a.png')).toBe(true)
    expect(isAllowedImageUrl('http://localhost/a.png')).toBe(true)
    expect(isAllowedImageUrl('data:image/png;base64,abc')).toBe(true)
    expect(isAllowedImageUrl('javascript:alert(1)')).toBe(false)
    expect(isAllowedImageUrl('data:text/html;base64,abc')).toBe(false)
  })

  it('keeps only known catalogue ids', () => {
    const map = sanitizeImageOverrides({
      'northern_realms-foltest-king-of-temeria': 'https://example.com/f.png',
      'not-a-real-card': 'https://example.com/x.png',
    })
    expect(map['northern_realms-foltest-king-of-temeria']).toBe('https://example.com/f.png')
    expect(map['not-a-real-card']).toBeUndefined()
  })

  it('imports images wrapper or bare map', () => {
    const id = 'northern_realms-foltest-king-of-temeria'
    expect(importImageOverridesJson(JSON.stringify({ [id]: 'https://a.test/x.png' }))[id]).toBe(
      'https://a.test/x.png',
    )
    expect(
      importImageOverridesJson(
        JSON.stringify({ version: 1, images: { [id]: 'https://b.test/y.png' } }),
      )[id],
    ).toBe('https://b.test/y.png')
  })

  it('setImageOverride clears blank urls', () => {
    const id = 'northern_realms-foltest-king-of-temeria'
    const withImg = setImageOverride({}, id, 'https://c.test/z.png')
    expect(withImg[id]).toBe('https://c.test/z.png')
    expect(setImageOverride(withImg, id, null)[id]).toBeUndefined()
    expect(localStorage.getItem(IMAGE_OVERRIDES_KEY)).toBeNull()
  })
})
