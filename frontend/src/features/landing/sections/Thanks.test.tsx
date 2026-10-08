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
      ['Follow Shahriar on Instagram (opens in a new tab)', LINKS.instagram.url],
      ['Follow Shahriar on Facebook (opens in a new tab)', LINKS.facebook.url],
      ['Connect with Shahriar on LinkedIn (opens in a new tab)', LINKS.linkedin.url],
      ['Follow Shahriar on GitHub (opens in a new tab)', LINKS.github.url],
    ] as const

    for (const [name, url] of rows) {
      const link = screen.getByRole('link', { name })
      expect(link.getAttribute('href')).toBe(url)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    }

    expect(
      screen.getByRole('link', {
        name: 'Star the project on GitHub (opens in a new tab)',
      }).getAttribute('href'),
    ).toBe(LINKS.repo.url)
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
