import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { LINKS } from '../../../content/links'
import { Thanks } from './Thanks'

describe('Thanks', () => {
  afterEach(cleanup)

  it('renders social rows from the shared links with safe new-tab attributes', () => {
    render(
      <MemoryRouter>
        <Thanks />
      </MemoryRouter>,
    )

    const rows = [
      ['Follow on Instagram', LINKS.instagram.url],
      ['Follow on Facebook', LINKS.facebook.url],
      ['Connect on LinkedIn', LINKS.linkedin.url],
      ['Follow on GitHub', LINKS.github.url],
    ] as const

    for (const [name, url] of rows) {
      const link = screen.getByRole('link', { name: new RegExp(name) })
      expect(link.getAttribute('href')).toBe(url)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
      expect(link.getAttribute('aria-label')).toBeNull()
      expect(link.textContent).toContain('(opens in a new tab)')
    }

    expect(screen.queryByRole('link', { name: /onetap-cv/i })).toBeNull()
  })

  it('falls back to a monogram when the portrait image cannot load', () => {
    render(
      <MemoryRouter>
        <Thanks />
      </MemoryRouter>,
    )

    fireEvent.error(screen.getByRole('img', { name: 'Shahriar Hasan' }))

    expect(
      screen.getByLabelText('Portrait placeholder for Shahriar Hasan').textContent,
    ).toBe('SH')
  })
})
