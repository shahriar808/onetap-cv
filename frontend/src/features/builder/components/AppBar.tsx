import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClearDataButton } from './ClearDataButton'
import { useSaveStatus } from '../hooks/useSaveStatus'

interface AppBarProps {
  onCleared: () => void
}

export function AppBar({ onCleared }: AppBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const saveStatus = useSaveStatus()

  function clearData() {
    setMenuOpen(false)
    onCleared()
  }

  return (
    <header className="relative z-50 flex h-14 min-h-14 items-center justify-between border-b border-line bg-paper px-3 sm:px-5">
      <Link
        to="/"
        className="font-display text-lg font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        OneTap CV
      </Link>

      <p
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 font-mono text-xs text-ink-muted sm:text-sm"
      >
        <span aria-hidden="true" className="size-2 rounded-full bg-moss" />
        {saveStatus}
      </p>

      <div className="relative">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="builder-app-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex min-h-11 items-center rounded-lg border border-line px-3 text-sm font-semibold text-ink hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          Menu
        </button>
        {menuOpen && (
          <nav
            id="builder-app-menu"
            aria-label="Builder menu"
            className="absolute right-0 top-full z-50 mt-2 grid w-56 gap-1 rounded-xl border border-line bg-paper p-2 shadow-paper"
          >
            <ClearDataButton onCleared={clearData} />
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Home
            </Link>
            <Link
              to="/#feedback"
              onClick={() => setMenuOpen(false)}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Feedback
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
