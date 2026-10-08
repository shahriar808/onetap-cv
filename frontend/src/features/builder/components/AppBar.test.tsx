import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AppBar } from './AppBar'

describe('AppBar', () => {
  afterEach(cleanup)

  it('opens the builder menu with Home and Feedback links', () => {
    render(
      <MemoryRouter>
        <AppBar onCleared={vi.fn()} />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('navigation', { name: 'Builder menu' })).not.toBeNull()
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe(
      '/',
    )
    expect(
      screen.getByRole('link', { name: 'Feedback' }).getAttribute('href'),
    ).toBe('/#feedback')
  })

  it('keeps the clear-data confirmation available from the menu', () => {
    const onCleared = vi.fn()
    render(
      <MemoryRouter>
        <AppBar onCleared={onCleared} />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    fireEvent.click(screen.getByRole('button', { name: 'Clear all my data' }))

    expect(
      screen.getByRole('heading', { name: 'Clear all your resume data?' }),
    ).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Clear all data' }))
    expect(onCleared).toHaveBeenCalledOnce()
  })
})
