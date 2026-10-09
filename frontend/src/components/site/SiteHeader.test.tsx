import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader mobile navigation', () => {
  afterEach(() => {
    cleanup()
    document.body.style.overflow = ''
  })

  it('opens the navigation, moves focus into it, and closes on Escape', async () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    )

    const menuButton = screen.getByRole('button', { name: 'Open navigation' })
    fireEvent.click(menuButton)

    const mobileNavigation = screen.getByRole('navigation', {
      name: 'Mobile navigation',
    })
    await waitFor(() =>
      expect(mobileNavigation.contains(document.activeElement)).toBe(true),
    )
    expect(document.body.style.overflow).toBe('hidden')

    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() =>
      expect(
        screen.queryByRole('navigation', { name: 'Mobile navigation' }),
      ).toBeNull(),
    )
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Open navigation' }),
    )
    expect(document.body.style.overflow).toBe('')
  })

  it('marks the privacy page as the current page without activating landing links', () => {
    render(
      <MemoryRouter initialEntries={['/privacy']}>
        <SiteHeader />
      </MemoryRouter>,
    )
    const activeLinks = screen.getAllByRole('link', { current: 'page' })
    expect(activeLinks).toHaveLength(1)
    expect(activeLinks.every((link) => link.textContent?.includes('Privacy'))).toBe(true)
    expect(screen.queryAllByRole('link', { current: 'location' })).toHaveLength(0)
  })
})
