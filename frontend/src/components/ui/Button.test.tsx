import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('keeps its label and exposes a spinner while loading', () => {
    const { container } = render(<Button loading>Saving changes</Button>)
    const button = screen.getByRole('button', { name: 'Saving changes' })

    expect(button.hasAttribute('disabled')).toBe(true)
    expect(button.getAttribute('aria-busy')).toBe('true')
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })

  it('renders the destructive variant with an outlined danger treatment', () => {
    render(<Button variant="danger">Clear all my data</Button>)
    const button = screen.getByRole('button', { name: 'Clear all my data' })

    expect(button.className).toContain('border-danger')
    expect(button.className).toContain('text-danger')
    expect(button.className).toContain('bg-danger/10')
  })
})
