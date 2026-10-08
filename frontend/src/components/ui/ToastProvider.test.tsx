import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

function ToastHarness() {
  const { showToast } = useToast()
  return <button onClick={() => showToast('Saved in your browser')}>Notify</button>
}

describe('ToastProvider', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('shows a status toast and dismisses it after four seconds', () => {
    vi.useFakeTimers()
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Notify' }))
    expect(screen.getByRole('status').textContent).toContain(
      'Saved in your browser',
    )

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(screen.queryByRole('status')).toBeNull()
  })

  it('can be dismissed using its accessible button', () => {
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Notify' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Dismiss notification' }),
    )

    expect(screen.queryByRole('status')).toBeNull()
  })
})
