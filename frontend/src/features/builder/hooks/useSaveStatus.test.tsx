import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { useSaveStatus } from './useSaveStatus'

function SaveStatusProbe() {
  return <p role="status">{useSaveStatus()}</p>
}

describe('useSaveStatus', () => {
  beforeEach(() => {
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('shows Saving while changes settle, then reports Saved', () => {
    vi.useFakeTimers()
    render(<SaveStatusProbe />)

    expect(screen.getByRole('status').textContent).toBe(
      'Saved in this browser',
    )

    act(() => {
      useResumeStore.getState().updateContact({ full_name: 'Taylor Example' })
    })
    expect(screen.getByRole('status').textContent).toBe('Saving…')

    act(() => {
      vi.advanceTimersByTime(799)
    })
    expect(screen.getByRole('status').textContent).toBe('Saving…')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.getByRole('status').textContent).toBe(
      'Saved in this browser',
    )
  })
})
