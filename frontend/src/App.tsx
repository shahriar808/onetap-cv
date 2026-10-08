import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './components/ui/ToastProvider'
import { BuilderPage } from './pages/BuilderPage'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <a
          href="#main-content"
          className="sr-only fixed left-3 top-3 z-50 rounded-lg bg-white px-4 py-3 font-semibold text-blue-900 shadow focus:not-sr-only focus:outline focus:outline-2 focus:outline-blue-700"
        >
          Skip to content
        </a>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/build" element={<BuilderPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
