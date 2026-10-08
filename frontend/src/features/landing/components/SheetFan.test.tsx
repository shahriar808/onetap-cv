import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SheetFan } from './SheetFan'

describe('SheetFan', () => {
  afterEach(cleanup)

  it('lets keyboard-operable buttons bring each sheet to the front', () => {
    render(<SheetFan />)
    const classic = screen.getByRole('button', { name: 'Classic' })
    const modern = screen.getByRole('button', { name: 'Modern' })

    expect(modern.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(classic)
    expect(classic.getAttribute('aria-pressed')).toBe('true')
    expect(modern.getAttribute('aria-pressed')).toBe('false')
  })
})
