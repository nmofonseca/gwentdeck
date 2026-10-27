import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CollectionState, SavedDeck } from '../domain/types'
import {
  addSavedDeck,
  emptyCollection,
  exportCollectionJson,
  importCollectionJson,
  loadCollection,
  removeSavedDeck,
  saveCollection,
  setOwnedQty,
} from './collectionStore'
import {
  exportImageOverridesJson,
  importImageOverridesJson,
  loadImageOverrides,
  saveImageOverrides,
  setImageOverride,
  type ImageOverrides,
} from './imageOverrides'

interface CollectionContextValue {
  state: CollectionState
  warning: string | null
  clearWarning: () => void
  setQty: (cardId: string, qty: number) => void
  reset: () => void
  exportJson: () => string
  importJson: (text: string) => void
  saveDeck: (deck: SavedDeck) => void
  deleteDeck: (id: string) => void
  imageOverrides: ImageOverrides
  getImageUrl: (cardId: string) => string | undefined
  setCardImage: (cardId: string, url: string | null) => void
  importImagesJson: (text: string) => number
  exportImagesJson: () => string
  clearImages: () => void
}

const CollectionContext = createContext<CollectionContextValue | null>(null)

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CollectionState>(() => emptyCollection())
  const [imageOverrides, setImageOverrides] = useState<ImageOverrides>({})
  const [warning, setWarning] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const { state: loaded, warning: w } = loadCollection()
    const images = loadImageOverrides()
    setState(loaded)
    setImageOverrides(images.map)
    const warnings = [w, images.warning].filter(Boolean)
    if (warnings.length) setWarning(warnings.join(' '))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveCollection(state)
  }, [state, hydrated])

  useEffect(() => {
    if (!hydrated) return
    saveImageOverrides(imageOverrides)
  }, [imageOverrides, hydrated])

  const setQty = useCallback((cardId: string, qty: number) => {
    setState((s) => setOwnedQty(s, cardId, qty))
  }, [])

  const reset = useCallback(() => {
    setState(emptyCollection())
  }, [])

  const exportJson = useCallback(() => exportCollectionJson(state), [state])

  const importJson = useCallback((text: string) => {
    const next = importCollectionJson(text)
    setState(next)
    setWarning(null)
  }, [])

  const saveDeck = useCallback((deck: SavedDeck) => {
    setState((s) => addSavedDeck(s, deck))
  }, [])

  const deleteDeck = useCallback((id: string) => {
    setState((s) => removeSavedDeck(s, id))
  }, [])

  const getImageUrl = useCallback(
    (cardId: string) => imageOverrides[cardId],
    [imageOverrides],
  )

  const setCardImage = useCallback((cardId: string, url: string | null) => {
    setImageOverrides((m) => setImageOverride(m, cardId, url))
  }, [])

  const importImagesJson = useCallback((text: string) => {
    const next = importImageOverridesJson(text)
    setImageOverrides(next)
    return Object.keys(next).length
  }, [])

  const exportImagesJson = useCallback(
    () => exportImageOverridesJson(imageOverrides),
    [imageOverrides],
  )

  const clearImages = useCallback(() => {
    setImageOverrides({})
  }, [])

  const value = useMemo(
    () => ({
      state,
      warning,
      clearWarning: () => setWarning(null),
      setQty,
      reset,
      exportJson,
      importJson,
      saveDeck,
      deleteDeck,
      imageOverrides,
      getImageUrl,
      setCardImage,
      importImagesJson,
      exportImagesJson,
      clearImages,
    }),
    [
      state,
      warning,
      setQty,
      reset,
      exportJson,
      importJson,
      saveDeck,
      deleteDeck,
      imageOverrides,
      getImageUrl,
      setCardImage,
      importImagesJson,
      exportImagesJson,
      clearImages,
    ],
  )

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

export function useCollection(): CollectionContextValue {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider')
  return ctx
}
