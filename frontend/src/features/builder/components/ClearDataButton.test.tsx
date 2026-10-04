import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { ClearDataButton } from './ClearDataButton'

describe('ClearDataButton', () => {
  const onCleared = vi.fn()

  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
    useResumeStore.getState().updateContact({ full_name: 'Taylor Example' })
    onCleared.mockReset()
  })

  afterEach(cleanup)

  it('clears stored resume data after confirmation', () => {
    render(<ClearDataButton onCleared={onCleared} />)
    fireEvent.click(screen.getByRole('button', { name: 'Clear all my data' }))
    fireEvent.click(screen.getByRole('button', { name: 'Clear all data' }))

    expect(useResumeStore.getState().data).toEqual(defaultResume())
    expect(localStorage.getItem('cvbuilder:v1')).toBeNull()
    expect(onCleared).toHaveBeenCalledOnce()
  })

  it('preserves resume data when confirmation is cancelled', () => {
    render(<ClearDataButton onCleared={onCleared} />)
    fireEvent.click(screen.getByRole('button', { name: 'Clear all my data' }))
    fireEvent.click(screen.getByRole('button', { name: 'Keep my data' }))

    expect(useResumeStore.getState().data.contact.full_name).toBe(
      'Taylor Example',
    )
    expect(localStorage.getItem('cvbuilder:v1')).not.toBeNull()
    expect(onCleared).not.toHaveBeenCalled()
  })
})
