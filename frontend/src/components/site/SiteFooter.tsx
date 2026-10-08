import { Link } from 'react-router-dom'
import { LINKS } from '../../content/links'
import { LANDING_CONTENT } from '../../features/landing/content'

const COPYRIGHT_YEAR = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper py-10">
      <div className="container-page grid grid-cols-2 gap-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="col-span-2 grid content-start gap-3 sm:col-span-1">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center font-display text-lg font-semibold text-ink underline-offset-4 hover:underline"
          >
            OneTap CV
          </Link>
          <p className="text-sm text-ink-muted">
            {LANDING_CONTENT.footer.copyright} © {COPYRIGHT_YEAR}
          </p>
        </div>
        <nav aria-label="Product" className="grid content-start justify-items-start gap-2">
          <p className="text-label text-ink-muted">Product</p>
          <Link to="/#how" className="min-h-11 content-center text-sm text-ink-soft hover:text-ink hover:underline">
            How it works
          </Link>
          <Link to="/#designs" className="min-h-11 content-center text-sm text-ink-soft hover:text-ink hover:underline">
            Designs
          </Link>
          <Link to="/privacy" className="min-h-11 content-center text-sm text-ink-soft hover:text-ink hover:underline">
            Privacy
          </Link>
        </nav>
        <nav aria-label="Project" className="grid content-start justify-items-start gap-2">
          <p className="text-label text-ink-muted">Project</p>
          <a href={LINKS.repo.url} target="_blank" rel="noopener noreferrer" className="min-h-11 content-center text-sm text-ink-soft hover:text-ink hover:underline">
            Source code
          </a>
          <Link to="/#feedback" className="min-h-11 content-center text-sm text-ink-soft hover:text-ink hover:underline">
            Feedback
          </Link>
        </nav>
        <nav aria-label="Maker" className="grid content-start justify-items-start gap-2">
          <p className="text-label text-ink-muted">Maker</p>
          <a href={LINKS.instagram.url} target="_blank" rel="noopener noreferrer" className="min-h-11 content-center text-sm text-ink-soft hover:text-ink hover:underline">Instagram</a>
          <a href={LINKS.facebook.url} target="_blank" rel="noopener noreferrer" className="min-h-11 content-center text-sm text-ink-soft hover:text-ink hover:underline">Facebook</a>
          <a href={LINKS.linkedin.url} target="_blank" rel="noopener noreferrer" className="min-h-11 content-center text-sm text-ink-soft hover:text-ink hover:underline">LinkedIn</a>
          <a href={LINKS.github.url} target="_blank" rel="noopener noreferrer" className="min-h-11 content-center text-sm text-ink-soft hover:text-ink hover:underline">GitHub</a>
        </nav>
      </div>
    </footer>
  )
}
