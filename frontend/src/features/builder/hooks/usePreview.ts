import { useEffect, useMemo, useState } from 'react'
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

interface PreviewResult {
  requestKey: {
    data: ResumeData
    template: TemplateId
    retryCount: number
  }
  html: string
  error: string | null
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
  const [retryCount, setRetryCount] = useState(0)
  const requestKey = useMemo(
    () => ({ data: debouncedData, template, retryCount }),
    [debouncedData, template, retryCount],
  )
  const [result, setResult] = useState<PreviewResult | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchPreview(withPreviewContact(debouncedData), template, controller.signal)
      .then((html) => {
        if (!controller.signal.aborted) {
          setResult({ requestKey, html, error: null })
        }
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) {
          return
        }
        setResult({
          requestKey,
          html: '',
          error:
            requestError instanceof Error
              ? requestError.message
              : 'Could not load the resume preview.',
        })
      })

    return () => controller.abort()
  }, [debouncedData, template, retryCount, requestKey])

  const currentResult = result?.requestKey === requestKey ? result : null
  return {
    html: currentResult?.html ?? result?.html ?? '',
    loading: currentResult === null,
    error: currentResult?.error ?? null,
    retry: () => setRetryCount((count) => count + 1),
  }
}
