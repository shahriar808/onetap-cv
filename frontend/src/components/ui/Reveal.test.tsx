import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Reveal } from './Reveal'

describe('Reveal', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows content immediately when reduced motion is preferred', async () => {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: vi.fn(),
    })
    const matchMedia = vi.fn().mockReturnValue({ matches: true })
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: matchMedia,
    })

    render(<Reveal>Visible heading</Reveal>)

    await waitFor(() => {
      expect(screen.getByText('Visible heading').closest('.reveal')?.className).toContain('is-visible')
    })
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })
})
