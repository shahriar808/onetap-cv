import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'
import { PrivacyPage } from './PrivacyPage'

describe('site pages', () => {
  afterEach(cleanup)

  it('explains browser storage and feedback email privacy', () => {
    render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Your CV stays yours.' }),
    ).not.toBeNull()
    expect(screen.getByText(/message is emailed to the owner/)).not.toBeNull()
  })

  it('shows a home link for an unknown page', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Page not found' })).not.toBeNull()
    expect(screen.getByRole('link', { name: 'Go home' }).getAttribute('href')).toBe(
      '/',
    )
  })
})
