import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { LINKS } from '../../content/links'
import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  afterEach(cleanup)

  it('provides product, project, and maker navigation', () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation', { name: 'Product' })).not.toBeNull()
    expect(screen.getByRole('navigation', { name: 'Project' })).not.toBeNull()
    expect(screen.getByRole('navigation', { name: 'Maker' })).not.toBeNull()
    expect(
      screen.getByText(
        `Built in Dhaka by Shahriar Hasan. © ${new Date().getFullYear()}`,
      ),
    ).not.toBeNull()
    expect(
      screen.getByRole('link', { name: 'How it works' }).getAttribute('href'),
    ).toBe('/#how')
    expect(
      screen.getByRole('link', { name: 'Designs' }).getAttribute('href'),
    ).toBe('/#designs')
  })

  it('uses the shared social URLs and safe external-link attributes', () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    )

    const socialLinks = [
      ['Instagram', LINKS.instagram.url],
      ['Facebook', LINKS.facebook.url],
      ['LinkedIn', LINKS.linkedin.url],
      ['GitHub', LINKS.github.url],
    ] as const

    for (const [platform, href] of socialLinks) {
      const link = screen.getByRole('link', { name: platform })
      expect(link.getAttribute('href')).toBe(href)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    }
  })
})
