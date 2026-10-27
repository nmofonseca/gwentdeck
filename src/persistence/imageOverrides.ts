import { z } from 'zod'
import { getCard } from '../domain/catalogue'

export const IMAGE_OVERRIDES_KEY = 'gwentdeck.imageOverrides.v1'
export const IMAGE_OVERRIDES_BACKUP_KEY = 'gwentdeck.imageOverrides.backup'

/** cardId → user-supplied image URL (https or data:image only). Never shipped in the repo. */
export type ImageOverrides = Record<string, string>

const mapSchema = z.record(z.string(), z.string().min(1).max(2_000_000))

/** Allow only safe URL schemes; reject javascript:, file:, etc. */
export function isAllowedImageUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed || trimmed.length > 2_000_000) return false
  try {
    if (trimmed.startsWith('data:')) {
      return /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);/i.test(trimmed)
    }
    const u = new URL(trimmed)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

export function sanitizeImageOverrides(raw: unknown): ImageOverrides {
  const parsed = mapSchema.parse(raw)
  const next: ImageOverrides = {}
  for (const [id, url] of Object.entries(parsed)) {
    if (!getCard(id)) continue
    const trimmed = url.trim()
    if (!isAllowedImageUrl(trimmed)) continue
    next[id] = trimmed
  }
  return next
}

export function loadImageOverrides(): { map: ImageOverrides; warning?: string } {
  if (typeof localStorage === 'undefined') return { map: {} }
  const raw = localStorage.getItem(IMAGE_OVERRIDES_KEY)
  if (!raw) return { map: {} }
  try {
    return { map: sanitizeImageOverrides(JSON.parse(raw)) }
  } catch (err) {
    try {
      localStorage.setItem(IMAGE_OVERRIDES_BACKUP_KEY, raw)
    } catch {
      /* ignore */
    }
    return {
      map: {},
      warning: `Card image overrides could not be read (${err instanceof Error ? err.message : 'invalid'}). Backup kept; starting empty.`,
    }
  }
}

export function saveImageOverrides(map: ImageOverrides): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(IMAGE_OVERRIDES_KEY, JSON.stringify(sanitizeImageOverrides(map)))
}

export function exportImageOverridesJson(map: ImageOverrides): string {
  return JSON.stringify(
    {
      version: 1,
      note: 'User-supplied card images for GwentDeck. Not redistributed by the app. You are responsible for rights to these URLs/files.',
      images: sanitizeImageOverrides(map),
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  )
}

export function importImageOverridesJson(text: string): ImageOverrides {
  const data = JSON.parse(text) as unknown
  if (data && typeof data === 'object' && 'images' in data) {
    return sanitizeImageOverrides((data as { images: unknown }).images)
  }
  return sanitizeImageOverrides(data)
}

export function setImageOverride(
  map: ImageOverrides,
  cardId: string,
  url: string | null,
): ImageOverrides {
  if (!getCard(cardId)) return map
  const next = { ...map }
  if (!url || !url.trim()) {
    delete next[cardId]
    return next
  }
  const trimmed = url.trim()
  if (!isAllowedImageUrl(trimmed)) return map
  next[cardId] = trimmed
  return next
}
