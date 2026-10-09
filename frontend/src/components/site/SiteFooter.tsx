import { Link, useLocation } from 'react-router-dom'
import { FacebookIcon, GitHubIcon, InstagramIcon, LinkedInIcon } from '../icons'
import { LINKS } from '../../content/links'
import { Wordmark } from './Wordmark'
import { LANDING_CONTENT } from '../../features/landing/content'

const COPYRIGHT_YEAR = new Date().getFullYear()
const footerLinkClass = 'inline-flex min-h-11 items-center gap-2 text-sm text-ink-soft hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent lg:min-h-10'

export function SiteFooter() {
  const { pathname } = useLocation()
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12 lg:py-10">
        <div className="grid content-start gap-2">
          <Wordmark />
          <p className="max-w-sm text-sm text-ink-muted">A clear, private way to make a CV that software can read.</p>
        </div>
        <nav aria-label="Explore" className="grid content-start gap-1">
          <p className="text-label text-ink-muted">Explore</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-0 lg:grid lg:gap-0">
            <li><Link to="/#how" onClick={(event) => { if (pathname === '/' && window.location.hash === '#how') { event.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }) } }} className={footerLinkClass}>How it works</Link></li>
            <li><Link to="/#designs" onClick={(event) => { if (pathname === '/' && window.location.hash === '#designs') { event.preventDefault(); document.getElementById('designs')?.scrollIntoView({ behavior: 'smooth' }) } }} className={footerLinkClass}>Designs</Link></li>
            <li><Link to="/privacy" aria-current={pathname === '/privacy' ? 'page' : undefined} className={footerLinkClass}>Privacy</Link></li>
            <li><Link to="/#feedback" onClick={(event) => { if (pathname === '/' && window.location.hash === '#feedback') { event.preventDefault(); document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' }) } }} className={footerLinkClass}>Feedback</Link></li>
          </ul>
        </nav>
        <nav aria-label="Follow" className="grid content-start gap-1">
          <p className="text-label text-ink-muted">Follow</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-0 lg:grid lg:gap-0">
            <li><a href={LINKS.instagram.url} target="_blank" rel="noopener noreferrer" className={footerLinkClass}><InstagramIcon size={16} />Instagram<span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a href={LINKS.facebook.url} target="_blank" rel="noopener noreferrer" className={footerLinkClass}><FacebookIcon size={16} />Facebook<span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a href={LINKS.linkedin.url} target="_blank" rel="noopener noreferrer" className={footerLinkClass}><LinkedInIcon size={16} />LinkedIn<span className="sr-only"> (opens in a new tab)</span></a></li>
            <li><a href={LINKS.github.url} target="_blank" rel="noopener noreferrer" className={footerLinkClass}><GitHubIcon size={16} />GitHub<span className="sr-only"> (opens in a new tab)</span></a></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="container-page py-4 text-sm text-ink-muted">© {COPYRIGHT_YEAR} OneTap CV. {LANDING_CONTENT.footer.copyright}</p>
      </div>
    </footer>
  )
}
