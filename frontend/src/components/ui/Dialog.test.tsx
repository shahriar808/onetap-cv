import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Dialog } from './Dialog'

function DialogHarness() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      <Dialog
        open={open}
        title="Confirm action"
        message="Continue?"
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}

describe('Dialog keyboard focus', () => {
  afterEach(cleanup)

  it('focuses the first action, traps tab, and restores focus on close', () => {
    render(<DialogHarness />)
    const trigger = screen.getByRole('button', { name: 'Open dialog' })
    trigger.focus()
    fireEvent.click(trigger)
    const confirm = screen.getByRole('button', { name: 'Confirm' })
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    expect(document.activeElement).toBe(confirm)

    fireEvent.keyDown(window, { key: 'Tab' })
    expect(document.activeElement).toBe(cancel)
    fireEvent.click(cancel)
    expect(document.activeElement).toBe(trigger)
  })

  it('closes when the backdrop is clicked', () => {
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

    const backdrop = screen.getByRole('dialog').parentElement
    if (!backdrop) {
      throw new Error('Dialog backdrop was not rendered')
    }
    fireEvent.click(backdrop)

    expect(onCancel).toHaveBeenCalledOnce()
  })
})
