import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main
      id="main-content"
      className="container-page grid min-h-[60vh] content-center justify-items-start gap-4 py-16"
    >
      <p className="text-label text-accent">404 / Not found</p>
      <h1 className="font-display text-display-lg font-semibold text-ink">
        Page not found
      </h1>
      <p className="max-w-[62ch] text-ink-soft">
        That page is not here. Head back to OneTap CV and continue from there.
      </p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-ink px-5 py-2 font-semibold text-ink hover:bg-paper-2"
      >
        Go home
      </Link>
    </main>
  )
}
