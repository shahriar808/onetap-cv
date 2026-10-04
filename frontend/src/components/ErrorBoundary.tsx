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
        <main className="mx-auto grid min-h-screen max-w-xl content-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Something went wrong
          </h1>
          <p className="text-slate-700">
            Your data is safe in this browser.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mx-auto min-h-11 rounded-lg bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Reload
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
