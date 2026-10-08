import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          id="main-content"
          className="mx-auto grid min-h-screen max-w-xl content-center justify-items-center gap-4 bg-paper px-6 text-center"
        >
          <h1 className="font-display text-display-lg font-semibold text-ink">
            Something went wrong
          </h1>
          <p className="text-ink-soft">
            Your data is safe in this browser.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-11 rounded-lg bg-ink px-5 py-2 font-semibold text-paper hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Reload
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg border border-line px-5 py-2 font-semibold text-ink hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Home
          </a>
        </main>
      )
    }

    return this.props.children
  }
}
