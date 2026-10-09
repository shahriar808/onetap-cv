import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { LINKS } from '../../content/links'
import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  afterEach(cleanup)

  it('provides compact explore and follow navigation without a source-code link', () => {
    render(<MemoryRouter initialEntries={['/privacy']}><SiteFooter /></MemoryRouter>)
    expect(screen.getByRole('navigation', { name: 'Explore' })).not.toBeNull()
    expect(screen.getByRole('navigation', { name: 'Follow' })).not.toBeNull()
    expect(screen.getByRole('link', { name: /How it works/ }).getAttribute('href')).toBe('/#how')
    expect(screen.getByRole('link', { name: /Designs/ }).getAttribute('href')).toBe('/#designs')
    expect(screen.getByRole('link', { name: /Privacy/ }).getAttribute('aria-current')).toBe('page')
    expect(screen.queryByRole('link', { name: /Source code|onetap-cv/i })).toBeNull()
    expect(screen.getByText(`© ${new Date().getFullYear()} OneTap CV. Built in Dhaka by Shahriar Hasan.`)).not.toBeNull()
  })

  it('uses the shared social URLs and safe external-link attributes', () => {
    render(<MemoryRouter><SiteFooter /></MemoryRouter>)
    const socialLinks = [
      ['Instagram', LINKS.instagram.url],
      ['Facebook', LINKS.facebook.url],
      ['LinkedIn', LINKS.linkedin.url],
      ['GitHub', LINKS.github.url],
    ] as const
    for (const [platform, href] of socialLinks) {
      const link = screen.getByRole('link', { name: new RegExp(`${platform}.*opens in a new tab`) })
      expect(link.getAttribute('href')).toBe(href)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    }
  })
})
