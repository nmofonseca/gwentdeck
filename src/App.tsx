import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { CataloguePage } from './pages/CataloguePage'
import { CollectionPage } from './pages/CollectionPage'
import { HomePage } from './pages/HomePage'
import { OptimiserPage } from './pages/OptimiserPage'
import { CollectionProvider } from './persistence/CollectionContext'

export default function App() {
  return (
    <CollectionProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="catalogue" element={<CataloguePage />} />
            <Route path="collection" element={<CollectionPage />} />
            <Route path="optimiser" element={<OptimiserPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </CollectionProvider>
  )
}
