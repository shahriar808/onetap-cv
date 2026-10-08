import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-page grid gap-4 py-8 sm:grid-cols-[1fr_auto] sm:items-center">
        <Link
          to="/"
          className="font-display text-lg font-semibold text-ink underline-offset-4 hover:underline"
        >
          OneTap CV
        </Link>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link
            to="/privacy"
            className="min-h-11 content-center text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            Privacy
          </Link>
          <a
            href="https://github.com/shahriar808/onetap-cv"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-11 content-center text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            Source code
          </a>
          <Link
            to="/#feedback"
            className="min-h-11 content-center text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            Feedback
          </Link>
        </nav>
      </div>
    </footer>
  )
}
