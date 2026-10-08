import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

function BrokenChild(): ReactNode {
  throw new Error('render failed')
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows a privacy-safe fallback when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('heading', { name: 'Something went wrong' }))
      .not.toBeNull()
    expect(screen.getByText('Your data is safe in this browser.')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Reload' })).not.toBeNull()
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe(
      '/',
    )
  })
})
