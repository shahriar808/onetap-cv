import { useEffect, useMemo, useState } from 'react'
import { CheckIcon } from '../../../components/icons'
import { getTemplates, type TemplateMetadata } from '../../../lib/api'
import { useResumeStore } from '../../../store/resumeStore'

export function TemplatePicker() {
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate)
  const setTemplate = useResumeStore((state) => state.setTemplate)
  const [reloadCount, setReloadCount] = useState(0)
  const requestKey = useMemo(
    () => ({ reloadCount }),
    [reloadCount],
  )
  const [result, setResult] = useState<{
    requestKey: { reloadCount: number }
    templates: TemplateMetadata[]
    error: string | null
  } | null>(null)

  useEffect(() => {
    let active = true

    getTemplates()
      .then((result) => {
        if (active) {
          setResult({ requestKey, templates: result, error: null })
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setResult({
            requestKey,
            templates: [],
            error:
              requestError instanceof Error
                ? requestError.message
                : 'Could not load resume templates.',
          })
        }
      })

    return () => {
      active = false
    }
  }, [reloadCount, requestKey])

  const currentResult = result?.requestKey === requestKey ? result : null
  const loading = currentResult === null
  const templates = currentResult?.templates ?? []
  const error = currentResult?.error ?? null

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
      <h2
        id="template-picker-title"
        className="font-display text-display-md font-semibold text-ink"
      >
        Choose a template
      </h2>
      <div
        role="radiogroup"
        aria-labelledby="template-picker-title"
        className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3"
      >
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            role="radio"
            aria-checked={selectedTemplate === template.id}
            aria-label={template.name}
            tabIndex={selectedTemplate === template.id ? 0 : -1}
            onClick={() => setTemplate(template.id)}
            onKeyDown={(event) => {
              if (
                event.key !== 'ArrowRight' &&
                event.key !== 'ArrowDown' &&
                event.key !== 'ArrowLeft' &&
                event.key !== 'ArrowUp'
              ) {
                return
              }
              event.preventDefault()
              const direction =
                event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
              const nextIndex =
                (templates.findIndex((item) => item.id === template.id) +
                  direction +
                  templates.length) %
                templates.length
              const nextTemplate = templates[nextIndex]
              setTemplate(nextTemplate.id)
              event.currentTarget.parentElement
                ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
                .item(nextIndex)
                .focus()
            }}
            className={`relative grid min-h-11 overflow-hidden rounded-xl border-2 bg-paper text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
              selectedTemplate === template.id
                ? 'border-2 border-ink'
                : 'border-line hover:border-ink-soft'
            }`}
          >
            {selectedTemplate === template.id && (
              <span
                aria-hidden="true"
                className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-ink text-paper"
              >
                <CheckIcon size={18} />
              </span>
            )}
            <img
              src={`/thumbnails/${template.id}-480.webp`}
              srcSet={`/thumbnails/${template.id}-480.webp 480w, /thumbnails/${template.id}-900.webp 900w`}
              sizes="(max-width: 420px) 90vw, 300px"
              alt=""
              width={480}
              height={679}
              className="aspect-[3/4] w-full bg-paper-2 object-contain p-3"
            />
            <span className="grid content-start gap-2 p-3">
              <span className="font-display text-lg font-semibold text-ink">
                {template.name}
              </span>
              <span className="text-sm text-ink-soft">
                {template.description}
              </span>
              <span className="grid gap-1 text-sm text-ink">
                <span className="font-mono text-xs font-semibold tracking-wide text-ink-muted">
                  BEST FOR
                </span>
                <span>{template.best_for}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
