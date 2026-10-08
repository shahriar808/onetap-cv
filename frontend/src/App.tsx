import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/site/Layout'
import { ScrollToHash } from './components/site/ScrollToHash'
import { ToastProvider } from './components/ui/ToastProvider'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { HomePage } from './pages/HomePage'

const BuilderPage = lazy(() =>
  import('./pages/BuilderPage').then(({ BuilderPage }) => ({
    default: BuilderPage,
  })),
)

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <a
          href="#main-content"
          className="sr-only fixed left-3 top-3 z-[70] rounded-lg bg-paper-2 px-4 py-3 font-semibold text-ink shadow-paper focus:not-sr-only focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          Skip to content
        </a>
        <ToastProvider>
          <ScrollToHash />
          <Routes>
            <Route
              path="/build"
              element={
                <Suspense
                  fallback={
                    <main
                      id="main-content"
                      role="status"
                      className="grid min-h-screen content-start gap-4 bg-paper p-6 text-ink"
                    >
                      <span className="font-display text-xl font-semibold">
                        Opening the builder…
                      </span>
                      <span className="h-5 max-w-md animate-pulse rounded bg-paper-2" />
                      <span className="h-5 max-w-lg animate-pulse rounded bg-paper-2" />
                    </main>
                  }
                >
                  <BuilderPage />
                </Suspense>
              }
            />
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
