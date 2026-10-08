import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from './Input'
import { Textarea } from './Textarea'

describe('form fields', () => {
  it('connects the input label and shows an accessible error', () => {
    render(<Input label="Email" type="email" error="Enter a valid email" />)

    const input = screen.getByLabelText('Email')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).not.toBeNull()
    expect(screen.getByRole('alert').textContent).toBe('Enter a valid email')
  })

  it('connects the textarea label and hint', () => {
    render(<Textarea label="Summary" hint="Keep it brief" />)

    expect(
      screen.getByLabelText('Summary').getAttribute('aria-describedby'),
    ).not.toBeNull()
    expect(screen.getByText('Keep it brief').textContent).toBe('Keep it brief')
  })

  it('shows the required tag and a descriptive counter at the limit', () => {
    render(
      <Input
        label="Full name"
        required
        maxLength={4}
        value="Alex"
        onChange={() => {}}
      />,
    )

    const input = screen.getByLabelText('Full name')
    const counter = screen.getByText('4 / 4 characters — limit reached')
    expect(input.getAttribute('required')).not.toBeNull()
    expect(screen.getByText('Required')).not.toBeNull()
    expect(counter.className).toContain('text-danger')
    expect(input.getAttribute('aria-describedby')).toContain(counter.id)
  })
})
