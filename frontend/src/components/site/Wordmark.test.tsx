import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Wordmark } from './Wordmark'

describe('Wordmark', () => {
  afterEach(cleanup)

  it('links home with an accessible name and supports an icon-only size', () => {
    const { container } = render(
      <MemoryRouter>
        <Wordmark size={32} showText={false} />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'OneTap CV home' })
    const mark = container.querySelector('svg')
    expect(link.getAttribute('href')).toBe('/')
    expect(mark?.getAttribute('width')).toBe('32')
    expect(screen.queryByText('OneTap CV')).toBeNull()
  })
})
