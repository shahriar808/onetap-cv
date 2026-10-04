import { useEffect, useState } from 'react'
import { getTemplates, type TemplateMetadata } from '../../../lib/api'
import { useResumeStore } from '../../../store/resumeStore'

export function TemplatePicker() {
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate)
  const setTemplate = useResumeStore((state) => state.setTemplate)
  const [templates, setTemplates] = useState<TemplateMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    getTemplates()
      .then((result) => {
        if (!controller.signal.aborted) {
          setTemplates(result)
        }
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Could not load resume templates.',
          )
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [reloadCount])

  if (loading) {
    return <p role="status">Loading templates…</p>
  }

  if (error) {
    return (
      <div role="alert" className="grid justify-items-start gap-3">
        <p className="text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => setReloadCount((count) => count + 1)}
          className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
        >
          Retry templates
        </button>
      </div>
    )
  }

  return (
    <section aria-labelledby="template-picker-title" className="grid gap-3">
      <h2 id="template-picker-title" className="text-lg font-semibold">
        Choose a template
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            aria-pressed={selectedTemplate === template.id}
            onClick={() => setTemplate(template.id)}
            className={`grid min-h-11 overflow-hidden rounded-xl border-2 bg-white text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${
              selectedTemplate === template.id
                ? 'border-blue-700'
                : 'border-slate-200 hover:border-slate-400'
            }`}
          >
            <img
              src={`/thumbnails/${template.id}.png`}
              alt=""
              className="aspect-[3/4] w-full bg-slate-100 object-contain"
            />
            <span className="grid gap-1 p-3">
              <span className="font-semibold text-slate-900">
                {template.name}
              </span>
              <span className="text-sm text-slate-600">
                {template.description}
              </span>
              <span className="text-sm text-slate-700">
                <span className="font-semibold">Best for:</span>{' '}
                {template.best_for}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
