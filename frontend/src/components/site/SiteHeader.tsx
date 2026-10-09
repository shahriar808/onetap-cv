import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRightIcon, MenuIcon, XIcon } from '../icons'
import { Wordmark } from './Wordmark'
import { useActiveSection } from '../../hooks/useActiveSection'
import { cn } from '../../lib/cn'

const NAV_LINKS = [
  { label: 'How it works', to: '/#how' },
  { label: 'Designs', to: '/#designs' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'FAQ', to: '/#faq' },
  { label: 'Feedback', to: '/#feedback' },
] as const

export function SiteHeader() {
  const { pathname } = useLocation()
  const activeSection = useActiveSection(pathname === '/' ? ['how', 'designs', 'faq', 'feedback'] : [])
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const previousOverflowRef = useRef('')

  useEffect(() => {
    function updateScrollState() {
      setScrolled(window.scrollY > 8)
    }
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  useEffect(() => {
    if (!menuOpen) {
      return
    }
    previousOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    })

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflowRef.current
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
  }

  function isActive(to: string) {
    if (to === '/privacy') return pathname === '/privacy'
    return pathname === '/' && activeSection === to.split('#')[1]
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper transition-colors ${
        scrolled ? 'border-line' : 'border-transparent'
      }`}
    >
      <div className="container-page flex min-h-14 items-center justify-between gap-4">
        <Wordmark />
        <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={(event) => {
                const targetId = to.split('#')[1]
                if (pathname === '/' && targetId && window.location.hash === `#${targetId}`) {
                  event.preventDefault()
                  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              aria-current={isActive(to) ? (to === '/privacy' ? 'page' : 'location') : undefined}
              className={cn('min-h-11 content-center text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline', isActive(to) && 'font-semibold text-ink decoration-accent decoration-2 underline underline-offset-8')}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/build"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-4 py-2 text-base font-semibold text-paper hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Build my CV
          </Link>
        </nav>
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="mobile-site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-11 place-items-center rounded-lg border border-line text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent lg:hidden"
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>
      {menuOpen && (
        <nav
          ref={menuRef}
          id="mobile-site-navigation"
          aria-label="Mobile navigation"
          className="fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-line bg-paper p-5 shadow-paper lg:hidden"
        >
          <div className="mx-auto grid max-w-6xl gap-2">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={(event) => {
                  closeMenu()
                  const targetId = to.split('#')[1]
                  if (pathname === '/' && targetId && window.location.hash === `#${targetId}`) {
                    event.preventDefault()
                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                aria-current={isActive(to) ? (to === '/privacy' ? 'page' : 'location') : undefined}
                className={cn('flex min-h-12 items-center border-b border-line py-2 text-base font-medium text-ink', isActive(to) && 'border-l-4 border-accent bg-paper-2 pl-3')}
              >
                {label}
                <ArrowRightIcon className="ml-auto" />
              </Link>
            ))}
            <Link
              to="/build"
              onClick={closeMenu}
              className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-ink px-4 py-2 text-base font-semibold text-paper hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Build my CV
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
