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
}

const CollectionContext = createContext<CollectionContextValue | null>(null)

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CollectionState>(() => emptyCollection())
  const [warning, setWarning] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const { state: loaded, warning: w } = loadCollection()
    setState(loaded)
    if (w) setWarning(w)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveCollection(state)
  }, [state, hydrated])

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
    }),
    [state, warning, setQty, reset, exportJson, importJson, saveDeck, deleteDeck],
  )

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

export function useCollection(): CollectionContextValue {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider')
  return ctx
}
