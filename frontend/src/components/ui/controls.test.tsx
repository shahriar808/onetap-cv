import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Dialog } from './Dialog'
import { Toggle } from './Toggle'

describe('UI controls', () => {
  afterEach(cleanup)

  it('updates a labeled switch', () => {
    const onChange = vi.fn()
    render(
      <Toggle
        label="Show education"
        checked={false}
        onChange={onChange}
      />,
    )

    const toggle = screen.getByRole('switch', { name: 'Show education' })
    expect(toggle.getAttribute('aria-checked')).toBe('false')
    fireEvent.click(toggle)

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('shows a visible check mark when the switch is on', () => {
    const { container } = render(
      <Toggle label="Show education" checked onChange={vi.fn()} />,
    )
    const toggle = screen.getByRole('switch', { name: 'Show education' })

    expect(toggle.className).toContain('h-11')
    expect(container.querySelector('svg[aria-hidden="true"]')).not.toBeNull()
  })

  it('closes the dialog on Escape', () => {
    const onCancel = vi.fn()
    render(
      <Dialog
        open
        title="Confirm action"
        message="Continue?"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    )

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onCancel).toHaveBeenCalledOnce()
  })
})
