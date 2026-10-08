import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider } from '../../../components/ui/ToastProvider'
import { MemoryRouter } from 'react-router-dom'
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

  function renderDownloadButton() {
    return render(
      <MemoryRouter>
        <ToastProvider>
          <DownloadButton
            onValidationRequested={onValidationRequested}
            onGoToContact={onGoToContact}
          />
        </ToastProvider>
      </MemoryRouter>,
    )
  }

  it('blocks invalid contact details and links to the Contact step', () => {
    renderDownloadButton()
    expect(screen.getByText('Contact details need attention.')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Fix contact details' }))
    expect(onGoToContact).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }))

    expect(screen.getByText('Please fix: Full name, Email, Phone')).not.toBeNull()
    expect(fetchPdf).not.toHaveBeenCalled()
    expect(onValidationRequested).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole('button', { name: 'Go to Contact' }))
    expect(onGoToContact).toHaveBeenCalledTimes(2)
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
    renderDownloadButton()

    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }))
    expect(await screen.findByText('PDF service unavailable')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    await vi.waitFor(() =>
      expect(fetchPdf).toHaveBeenCalledTimes(2),
    )
    expect(downloadBlob).toHaveBeenCalledOnce()
    expect(onValidationRequested).not.toHaveBeenCalled()
  })

  it('shows the download summary, success tips, links, and toast after success', async () => {
    useResumeStore.getState().updateContact({
      full_name: 'Taylor Example',
      email: 'taylor@example.com',
      phone: '+1 555 0123',
    })
    vi.mocked(fetchPdf).mockResolvedValue({
      blob: new Blob(['pdf']),
      filename: 'Taylor_Example_Resume.pdf',
    })
    renderDownloadButton()

    expect(screen.getByText('Contact details complete')).not.toBeNull()
    expect(screen.getByText('4 sections on')).not.toBeNull()
    expect(screen.getByText('Design: Modern')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }))

    expect(await screen.findByText('Downloaded.')).not.toBeNull()
    expect(
      screen.getByText(
        'Downloaded. Open the PDF and check that you can select the text.',
      ),
    ).not.toBeNull()
    expect(
      screen
        .getAllByRole('listitem')
        .some((item) => item.textContent?.includes('Tailor the keywords to each job.')),
    ).toBe(true)
    expect(screen.getByRole('link', { name: 'Send feedback' }).getAttribute('href'))
      .toBe('/#feedback')
    expect(
      screen.getByRole('link', { name: 'Follow on Instagram' }).getAttribute('href'),
    ).toBe('https://www.instagram.com/shahriarhasan808/')
    expect(screen.getByRole('link', { name: 'Say thanks' }).getAttribute('href'))
      .toBe('/#thanks')
    expect(screen.getByRole('status').textContent).toContain(
      'Your PDF has been downloaded.',
    )
  })
})
