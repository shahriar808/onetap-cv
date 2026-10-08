import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon, DownloadIcon } from '../../../components/icons'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../components/ui/useToast'
import { LINKS } from '../../../content/links'
import { fetchPdf, downloadBlob } from '../../../lib/api'
import { LANDING_CONTENT } from '../../landing/content'
import { useResumeStore } from '../../../store/resumeStore'
import { validateContact } from '../../../lib/validation'

interface DownloadButtonProps {
  onValidationRequested: () => void
  onGoToContact: () => void
  onRegisterDownload?: (download: () => void) => void
}

const CONTACT_LABELS: Record<string, string> = {
  full_name: 'Full name',
  email: 'Email',
  phone: 'Phone',
}

const TEMPLATE_NAMES = {
  classic: 'Classic',
  modern: 'Modern',
  compact: 'Compact',
} as const

export function DownloadButton({
  onValidationRequested,
  onGoToContact,
  onRegisterDownload,
}: DownloadButtonProps) {
  const data = useResumeStore((state) => state.data)
  const template = useResumeStore((state) => state.selectedTemplate)
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const validation = validateContact(data.contact)

  const download = useCallback(async () => {
    setDownloaded(false)
    setValidationMessage(null)
    setError(null)
    const validation = validateContact(data.contact)
    if (!validation.ok) {
      const fields = Object.keys(validation.errors)
        .map((field) => CONTACT_LABELS[field] ?? field)
        .join(', ')
      setValidationMessage(`Please fix: ${fields}`)
      onValidationRequested()
      return
    }

    setLoading(true)
    try {
      const { blob, filename } = await fetchPdf(data, template)
      downloadBlob(blob, filename)
      setDownloaded(true)
      showToast('Your PDF has been downloaded.')
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not download your resume. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }, [data, onValidationRequested, showToast, template])

  useEffect(() => {
    onRegisterDownload?.(download)
  }, [download, onRegisterDownload])

  return (
    <div className="grid gap-4">
      <ul aria-label="Download summary" className="grid gap-2">
        <li className="flex items-center gap-2 text-sm">
          {validation.ok ? (
            <CheckIcon className="shrink-0 text-moss" size={18} />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-[18px] shrink-0 place-items-center rounded-full bg-danger/10 text-xs font-bold text-danger"
            >
              !
            </span>
          )}
          {validation.ok ? (
            <span>Contact details complete</span>
          ) : (
            <>
              <span>Contact details need attention.</span>
              <Button
                variant="ghost"
                className="min-h-9 px-2 py-1 text-sm"
                onClick={onGoToContact}
              >
                Fix contact details
              </Button>
            </>
          )}
        </li>
        <li className="flex items-center gap-2 text-sm">
          <CheckIcon className="shrink-0 text-moss" size={18} />
          {data.enabled_sections.length}{' '}
          {data.enabled_sections.length === 1 ? 'section' : 'sections'} on
        </li>
        <li className="flex items-center gap-2 text-sm">
          <CheckIcon className="shrink-0 text-moss" size={18} />
          Design: {TEMPLATE_NAMES[template]}
        </li>
      </ul>
      <Button
        onClick={download}
        loading={loading}
        disabled={loading}
        className="min-h-14 w-full text-lg"
      >
        <DownloadIcon size={20} />
        Download PDF
      </Button>
      {downloaded ? (
        <div className="grid gap-4 rounded-lg border border-moss/30 bg-paper p-4">
          <div className="grid gap-1">
            <h3 className="font-display text-lg font-semibold text-ink">
              Downloaded.
            </h3>
            <p className="text-sm text-ink-soft">
              {LANDING_CONTENT.builder.afterDownload}
            </p>
          </div>
          <ul className="grid gap-2 text-sm text-ink-soft">
            {LANDING_CONTENT.builder.tips.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              to="/#feedback"
              className="min-h-11 content-center text-ink-soft hover:text-ink hover:underline"
            >
              Send feedback
            </Link>
            <a
              href={LINKS.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 content-center text-ink-soft hover:text-ink hover:underline"
            >
              Follow on Instagram
            </a>
            <Link
              to="/#thanks"
              className="min-h-11 content-center text-ink-soft hover:text-ink hover:underline"
            >
              Say thanks
            </Link>
          </div>
        </div>
      ) : (
        <>
          {validationMessage && (
            <div role="alert" className="grid justify-items-start gap-2">
              <p className="text-sm text-danger">{validationMessage}</p>
              <Button variant="secondary" onClick={onGoToContact}>
                Go to Contact
              </Button>
            </div>
          )}
          {error && (
            <div role="alert" className="grid justify-items-start gap-2">
              <p className="text-sm text-danger">{error}</p>
              <Button variant="secondary" onClick={download}>
                Retry
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
