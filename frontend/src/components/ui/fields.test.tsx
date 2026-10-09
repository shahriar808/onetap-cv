import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/react'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Select } from './Select'

describe('form fields', () => {
  afterEach(cleanup)
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
        value="Sami"
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

  it('keeps a reserved message slot with no feedback text', () => {
    render(<Input label="Name" />)
    const input = screen.getByLabelText('Name')
    expect(input.parentElement?.querySelector('.min-h-5')).not.toBeNull()
  })

  it('reserves the same message row with or without an error', () => {
    const { rerender } = render(<Input label="Name" />)
    const inputRow = screen.getByLabelText('Name').parentElement?.querySelector('div.min-h-5')
    expect(inputRow).not.toBeNull()
    rerender(<Input label="Name" error="Name is required." />)
    expect(screen.getByLabelText('Name').parentElement?.querySelector('div.min-h-5')).not.toBeNull()
  })

  it('renders a labeled select with the shared control sizing', () => {
    render(<Select label="Month" value="" onChange={() => {}}><option value="">Month</option></Select>)
    expect(screen.getByLabelText('Month').className).toContain('min-h-11')
    expect(screen.getByLabelText('Month').className).toContain('appearance-none')
  })
})
