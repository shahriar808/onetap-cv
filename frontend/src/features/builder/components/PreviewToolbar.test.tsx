import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { PreviewToolbar } from './PreviewToolbar'

describe('PreviewToolbar', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(cleanup)

  it('switches the selected preview template in the store', () => {
    render(<PreviewToolbar template="modern" loading={false} />)

    fireEvent.click(screen.getByRole('button', { name: 'Classic' }))

    expect(useResumeStore.getState().selectedTemplate).toBe('classic')
  })

  it('shows an updating status while a preview request is loading', () => {
    render(<PreviewToolbar template="modern" loading />)

    expect(screen.getByRole('status').textContent).toContain('Updating…')
    expect(screen.getByText('PREVIEW · A4')).not.toBeNull()
  })
})
