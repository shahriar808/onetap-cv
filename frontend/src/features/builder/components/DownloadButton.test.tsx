import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { downloadBlob, fetchPdf } from '../../../lib/api'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { DownloadButton } from './DownloadButton'

vi.mock('../../../lib/api', () => ({
  downloadBlob: vi.fn(),
  fetchPdf: vi.fn(),
}))

describe('DownloadButton', () => {
  const onValidationRequested = vi.fn()
  const onGoToContact = vi.fn()

  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
    vi.mocked(fetchPdf).mockReset()
    vi.mocked(downloadBlob).mockReset()
    onValidationRequested.mockReset()
    onGoToContact.mockReset()
  })

  afterEach(cleanup)

  it('blocks invalid contact details and links to the Contact step', () => {
    render(
      <DownloadButton
        onValidationRequested={onValidationRequested}
        onGoToContact={onGoToContact}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }))

    expect(screen.getByText('Please fix: Full name, Email, Phone')).not.toBeNull()
    expect(fetchPdf).not.toHaveBeenCalled()
    expect(onValidationRequested).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole('button', { name: 'Go to Contact' }))
    expect(onGoToContact).toHaveBeenCalledOnce()
  })

  it('downloads a valid PDF and provides retry after an API failure', async () => {
    useResumeStore.getState().updateContact({
      full_name: 'Taylor Example',
      email: 'taylor@example.com',
      phone: '+1 555 0123',
    })
    vi.mocked(fetchPdf)
      .mockRejectedValueOnce(new Error('PDF service unavailable'))
      .mockResolvedValueOnce({
        blob: new Blob(['pdf']),
        filename: 'Taylor_Example_Resume.pdf',
      })
    render(
      <DownloadButton
        onValidationRequested={onValidationRequested}
        onGoToContact={onGoToContact}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }))
    expect(await screen.findByText('PDF service unavailable')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    await vi.waitFor(() =>
      expect(fetchPdf).toHaveBeenCalledTimes(2),
    )
    expect(downloadBlob).toHaveBeenCalledOnce()
    expect(onValidationRequested).not.toHaveBeenCalled()
  })
})
