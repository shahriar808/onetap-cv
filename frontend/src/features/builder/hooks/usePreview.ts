import { useEffect, useState } from 'react'
import { fetchPreview } from '../../../lib/api'
import type { TemplateId } from '../../../lib/defaults'
import type { ResumeData } from '../../../types/resume'
import { useDebouncedValue } from './useDebouncedValue'

interface PreviewState {
  html: string
  loading: boolean
  error: string | null
  retry: () => void
}

function withPreviewContact(data: ResumeData): ResumeData {
  return {
    ...data,
    contact: {
      ...data.contact,
      full_name: data.contact.full_name.trim() || 'Your Name',
      email: data.contact.email.trim() || 'you@example.com',
      phone: data.contact.phone.trim() || '+000 000 000',
    },
  }
}

export function usePreview(
  data: ResumeData,
  template: TemplateId,
): PreviewState {
  const debouncedData = useDebouncedValue(data, 600)
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchPreview(withPreviewContact(debouncedData), template, controller.signal)
      .then(setHtml)
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) {
          return
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Could not load the resume preview.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [debouncedData, template, retryCount])

  return {
    html,
    loading,
    error,
    retry: () => setRetryCount((count) => count + 1),
  }
}
