import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { fetchPdf, downloadBlob } from '../../../lib/api'
import { useResumeStore } from '../../../store/resumeStore'
import { validateContact } from '../../../lib/validation'

interface DownloadButtonProps {
  onValidationRequested: () => void
  onGoToContact: () => void
}

const CONTACT_LABELS: Record<string, string> = {
  full_name: 'Full name',
  email: 'Email',
  phone: 'Phone',
}

export function DownloadButton({
  onValidationRequested,
  onGoToContact,
}: DownloadButtonProps) {
  const data = useResumeStore((state) => state.data)
  const template = useResumeStore((state) => state.selectedTemplate)
  const [loading, setLoading] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function download() {
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
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not download your resume. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid justify-items-start gap-3">
      <Button onClick={download} loading={loading} disabled={loading}>
        Download PDF
      </Button>
      {validationMessage && (
        <div role="alert" className="grid justify-items-start gap-2">
          <p className="text-sm text-red-700">{validationMessage}</p>
          <Button variant="secondary" onClick={onGoToContact}>
            Go to Contact
          </Button>
        </div>
      )}
      {error && (
        <div role="alert" className="grid justify-items-start gap-2">
          <p className="text-sm text-red-700">{error}</p>
          <Button variant="secondary" onClick={download}>
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}
